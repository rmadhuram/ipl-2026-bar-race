import type { MatchSnapshot } from "@/lib/types";

export interface TeamPositionStats {
  team: string;
  abbrev: string;
  best: number;
  worst: number;
  avg: number;
  median: number;
  mode: number[];
  dataPoints: number;
}

export function computePositionStats(snapshots: MatchSnapshot[]): TeamPositionStats[] {
  const teamRanks: Record<string, { abbrev: string; ranks: number[] }> = {};

  for (const snapshot of snapshots) {
    for (const standing of snapshot.standings) {
      if (!teamRanks[standing.team]) {
        teamRanks[standing.team] = { abbrev: standing.abbrev, ranks: [] };
      }
      if (standing.matchesPlayed >= 3) {
        teamRanks[standing.team].ranks.push(standing.rank);
      }
    }
  }

  const finalStandings = snapshots[snapshots.length - 1]?.standings ?? [];
  const finalRankMap = new Map(finalStandings.map((s) => [s.team, s.rank]));

  const stats: TeamPositionStats[] = Object.entries(teamRanks)
    .filter(([, { ranks }]) => ranks.length > 0)
    .map(([team, { abbrev, ranks }]) => {
      const sorted = [...ranks].sort((a, b) => a - b);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const avg = Math.round((ranks.reduce((s, r) => s + r, 0) / ranks.length) * 10) / 10;

      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10
          : sorted[mid];

      const freq: Record<number, number> = {};
      for (const r of ranks) freq[r] = (freq[r] ?? 0) + 1;
      const maxFreq = Math.max(...Object.values(freq));
      const mode = Object.entries(freq)
        .filter(([, f]) => f === maxFreq)
        .map(([r]) => Number(r))
        .sort((a, b) => a - b);

      return { team, abbrev, best, worst, avg, median, mode, dataPoints: ranks.length };
    });

  stats.sort(
    (a, b) => (finalRankMap.get(a.team) ?? 99) - (finalRankMap.get(b.team) ?? 99)
  );

  return stats;
}
