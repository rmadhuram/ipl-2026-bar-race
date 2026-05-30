import "server-only";
import fs from "fs";
import path from "path";
import { TEAM_CONFIG } from "@/constants/teams";
import type { WicketSnapshot, WicketStanding } from "@/lib/types";

const TOP_N = 10;

// Wicket kinds NOT credited to the bowler
const NON_BOWLER_WICKETS = new Set(["run out", "retired hurt", "retired out"]);

interface Wicket {
  kind: string;
}

interface Delivery {
  bowler: string;
  runs: { batter: number; extras: number; total: number };
  extras?: { wides?: number; noballs?: number };
  wickets?: Wicket[];
}

interface Over {
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
}

interface CricsheetMatch {
  info: MatchInfo;
  innings: Innings[];
}

interface BowlerStats {
  wickets: number;
  innings: number;
  runsConceded: number;
  legalBalls: number;
}

export function processWicketData(): WicketSnapshot[] {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  const rawMatches: CricsheetMatch[] = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"))
  );
  rawMatches.sort(
    (a, b) => a.info.event.match_number - b.info.event.match_number
  );

  const statsMap: Record<string, BowlerStats> = {};
  const teamMap: Record<string, string> = {};

  const snapshots: WicketSnapshot[] = [];

  for (const match of rawMatches) {
    const { info, innings } = match;
    const matchNumber = info.event.match_number;

    // Track team membership
    for (const [team, players] of Object.entries(info.players)) {
      for (const player of players) teamMap[player] = team;
    }

    // Accumulate bowling stats from regular innings only
    for (const inn of innings.slice(0, 2)) {
      const bowlersThisInnings = new Set<string>();
      for (const over of inn.overs) {
        for (const d of over.deliveries) {
          const s = statsMap[d.bowler] ?? { wickets: 0, innings: 0, runsConceded: 0, legalBalls: 0 };
          const ex = d.extras ?? {};
          const isWide = "wides" in ex;
          const isNoBall = "noballs" in ex;

          s.runsConceded += d.runs.total;
          if (!isWide && !isNoBall) s.legalBalls += 1;

          if (d.wickets) {
            for (const w of d.wickets) {
              if (!NON_BOWLER_WICKETS.has(w.kind)) s.wickets += 1;
            }
          }

          statsMap[d.bowler] = s;
          bowlersThisInnings.add(d.bowler);
        }
      }
      for (const bowler of bowlersThisInnings) {
        statsMap[bowler].innings += 1;
      }
    }

    // Build top-N snapshot
    const allBowlers = Object.entries(statsMap)
      .filter(([player]) => teamMap[player])
      .map(([player, s]) => ({
        player,
        team: teamMap[player],
        wickets: s.wickets,
        innings: s.innings,
        runsConceded: s.runsConceded,
        economy: s.legalBalls > 0 ? (s.runsConceded / s.legalBalls) * 6 : 99,
      }))
      .filter((b) => b.wickets > 0)
      // Sort: most wickets first; tiebreak on economy (lower = better)
      .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy);

    const top = allBowlers.slice(0, TOP_N);
    const standings: WicketStanding[] = top.map((b, i) => ({
      player: b.player,
      team: b.team,
      wickets: b.wickets,
      innings: b.innings,
      runsConceded: b.runsConceded,
      economy: Math.round(b.economy * 100) / 100,
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
