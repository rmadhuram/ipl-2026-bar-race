export interface TeamStanding {
  team: string;
  abbrev: string;
  pts: number;
  nrr: number;
  rank: number;
}

export interface MatchSnapshot {
  matchNumber: number;
  label: string;
  date: string;
  standings: TeamStanding[];
}
