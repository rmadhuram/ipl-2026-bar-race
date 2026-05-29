import "server-only";
import fs from "fs";
import path from "path";
import { TEAM_CONFIG, ALL_TEAMS } from "@/constants/teams";
import type { MatchSnapshot, TeamStanding } from "@/lib/types";

interface Delivery {
  runs: { batter: number; extras: number; total: number };
  extras?: { wides?: number; noballs?: number; legbyes?: number; byes?: number };
  wickets?: unknown[];
}

interface Over {
  over: number;
  deliveries: Delivery[];
}

interface Innings {
  team: string;
  overs: Over[];
  target?: { overs: number; runs: number };
}

interface Outcome {
  winner?: string;
  eliminator?: string;
  result?: string;
  method?: string;
  by?: { wickets?: number; runs?: number };
}

interface MatchInfo {
  event: { name: string; match_number: number };
  dates: string[];
  teams: [string, string];
  outcome: Outcome;
}

interface CricsheetMatch {
  info: MatchInfo;
  innings: Innings[];
}

interface TeamStats {
  pts: number;
  wins: number;
  losses: number;
  runsScored: number;
  ballsFaced: number;
  runsConceded: number;
  ballsBowled: number;
}

function countLegalBalls(innings: Innings): number {
  let count = 0;
  for (const over of innings.overs) {
    for (const d of over.deliveries) {
      const ex = d.extras ?? {};
      if (!("wides" in ex) && !("noballs" in ex)) count++;
    }
  }
  return count;
}

function countRuns(innings: Innings): number {
  return innings.overs
    .flatMap((o) => o.deliveries)
    .reduce((sum, d) => sum + d.runs.total, 0);
}

export function processData(): MatchSnapshot[] {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  const rawMatches: CricsheetMatch[] = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"))
  );
  rawMatches.sort(
    (a, b) => a.info.event.match_number - b.info.event.match_number
  );

  const stats: Record<string, TeamStats> = {};
  for (const team of ALL_TEAMS) {
    stats[team] = { pts: 0, wins: 0, losses: 0, runsScored: 0, ballsFaced: 0, runsConceded: 0, ballsBowled: 0 };
  }

  const snapshots: MatchSnapshot[] = [];

  for (const match of rawMatches) {
    const { info, innings } = match;
    const outcome = info.outcome;
    const [teamA, teamB] = info.teams;
    const matchNumber = info.event.match_number;
    const date = info.dates[0];

    if (outcome.result === "no result") {
      stats[teamA].pts += 1;
      stats[teamB].pts += 1;
    } else {
      // Super Over: outcome.eliminator holds the winner; normal win: outcome.winner
      const winner = outcome.winner ?? outcome.eliminator!;
      const loser = info.teams.find((t) => t !== winner)!;
      stats[winner].pts += 2;
      stats[winner].wins += 1;
      stats[loser].losses += 1;

      // Only regular innings (index 0 and 1) count for NRR
      const inn0 = innings[0];
      const inn1 = innings[1];

      const runs0 = countRuns(inn0);
      const runs1 = countRuns(inn1);
      const legal0 = countLegalBalls(inn0);
      const legal1 = countLegalBalls(inn1);

      let balls0: number;
      let balls1: number;

      const isDL = "method" in outcome;

      if (isDL) {
        // D/L: use actual legal balls for both innings
        balls0 = legal0;
        balls1 = legal1;
      } else {
        // innings[0] always treated as 20 overs (120 balls) for NRR
        balls0 = 120;
        // innings[1]: actual if they won chasing, 120 otherwise
        balls1 = winner === inn1.team ? legal1 : 120;
      }

      stats[inn0.team].runsScored   += runs0;
      stats[inn0.team].ballsFaced   += balls0;
      stats[inn0.team].runsConceded += runs1;
      stats[inn0.team].ballsBowled  += balls1;

      stats[inn1.team].runsScored   += runs1;
      stats[inn1.team].ballsFaced   += balls1;
      stats[inn1.team].runsConceded += runs0;
      stats[inn1.team].ballsBowled  += balls0;
    }

    const standings: TeamStanding[] = ALL_TEAMS.map((team) => {
      const s = stats[team];
      const nrr =
        s.ballsFaced > 0
          ? (s.runsScored / s.ballsFaced) * 6 -
            (s.runsConceded / s.ballsBowled) * 6
          : 0;
      return {
        team,
        abbrev: TEAM_CONFIG[team].abbrev,
        pts: s.pts,
        wins: s.wins,
        losses: s.losses,
        nrr: Math.round(nrr * 1000) / 1000,
        rank: 0,
      };
    });

    standings.sort((a, b) => b.pts - a.pts || b.nrr - a.nrr);
    standings.forEach((s, i) => (s.rank = i + 1));

    const tA = TEAM_CONFIG[teamA].abbrev;
    const tB = TEAM_CONFIG[teamB].abbrev;

    snapshots.push({
      matchNumber,
      label: `Match ${matchNumber}: ${tA} vs ${tB}`,
      date,
      standings,
    });
  }

  return snapshots;
}
