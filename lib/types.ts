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
  innings: number;
  fifties: number;
  hundreds: number;
  rank: number;
}

export interface PlayerSnapshot {
  matchNumber: number;
  label: string;
  date: string;
  standings: PlayerStanding[];
}

export interface WicketStanding {
  player: string;
  team: string;
  wickets: number;
  innings: number;
  runsConceded: number;
  economy: number;
  rank: number;
}

export interface WicketSnapshot {
  matchNumber: number;
  label: string;
  date: string;
  standings: WicketStanding[];
}
