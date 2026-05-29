export interface TeamStanding {
  team: string;
  abbrev: string;
  pts: number;
  nrr: number;
  rank: number;
  wins: number;
  losses: number;
}

export interface MatchSnapshot {
  matchNumber: number;
  label: string;
  date: string;
  standings: TeamStanding[];
}

export interface PlayerStanding {
  player: string;
  team: string;
  runs: number;
  rank: number;
}

export interface PlayerSnapshot {
  matchNumber: number;
  label: string;
  date: string;
  standings: PlayerStanding[];
}
