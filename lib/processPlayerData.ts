import "server-only";
import fs from "fs";
import path from "path";
import { TEAM_CONFIG } from "@/constants/teams";
import type { PlayerSnapshot, PlayerStanding } from "@/lib/types";

const TOP_N = 10;

interface Delivery {
  batter: string;
  runs: { batter: number; extras: number; total: number };
  extras?: { wides?: number; noballs?: number };
}

interface Over {
  over: number;
  deliveries: Delivery[];
}

interface Innings {
  team: string;
  overs: Over[];
}

interface MatchInfo {
  event: { name: string; match_number: number };
  dates: string[];
  teams: [string, string];
  players: Record<string, string[]>;
  outcome: { winner?: string; eliminator?: string; result?: string };
}

interface CricsheetMatch {
  info: MatchInfo;
  innings: Innings[];
}

export function processPlayerData(): PlayerSnapshot[] {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  const rawMatches: CricsheetMatch[] = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"))
  );
  rawMatches.sort(
    (a, b) => a.info.event.match_number - b.info.event.match_number
  );

  const runsMap: Record<string, number> = {};
  const fiftiesMap: Record<string, number> = {};
  const hundredsMap: Record<string, number> = {};
  const teamMap: Record<string, string> = {};

  const snapshots: PlayerSnapshot[] = [];

  for (const match of rawMatches) {
    const { info, innings } = match;
    const matchNumber = info.event.match_number;

    // Update team map from match roster (handles impact player subs)
    for (const [team, players] of Object.entries(info.players)) {
      for (const player of players) {
        teamMap[player] = team;
      }
    }

    // Accumulate batter runs from regular innings only (index 0 and 1)
    for (const inn of innings.slice(0, 2)) {
      const inningsScore: Record<string, number> = {};
      for (const over of inn.overs) {
        for (const d of over.deliveries) {
          runsMap[d.batter] = (runsMap[d.batter] ?? 0) + d.runs.batter;
          inningsScore[d.batter] = (inningsScore[d.batter] ?? 0) + d.runs.batter;
        }
      }
      for (const [player, score] of Object.entries(inningsScore)) {
        if (score >= 100) {
          hundredsMap[player] = (hundredsMap[player] ?? 0) + 1;
        } else if (score >= 50) {
          fiftiesMap[player] = (fiftiesMap[player] ?? 0) + 1;
        }
      }
    }

    // Build top-N snapshot
    const allPlayers = Object.entries(runsMap)
      .map(([player, runs]) => ({ player, runs, team: teamMap[player] ?? "" }))
      .filter((p) => p.team !== "") // skip if team unknown
      .sort((a, b) => b.runs - a.runs || a.player.localeCompare(b.player));

    const top = allPlayers.slice(0, TOP_N);
    const standings: PlayerStanding[] = top.map((p, i) => ({
      player: p.player,
      team: p.team,
      runs: p.runs,
      fifties: fiftiesMap[p.player] ?? 0,
      hundreds: hundredsMap[p.player] ?? 0,
      rank: i + 1,
    }));

    const [tA, tB] = info.teams;
    const aAbbrev = TEAM_CONFIG[tA]?.abbrev ?? tA;
    const bAbbrev = TEAM_CONFIG[tB]?.abbrev ?? tB;

    snapshots.push({
      matchNumber,
      label: `Match ${matchNumber}: ${aAbbrev} vs ${bAbbrev}`,
      date: info.dates[0],
      standings,
    });
  }

  return snapshots;
}
