export interface Winner {
  _id: string;
  tournamentName: string;
  teamName: string;
  playerName: string;
  amount: string;
  date: string;
}

export interface PastGroup {
  groupNumber: number;
  winnerTeam: string;
  prize: number;
  matchType: string;
  matchDate: string;
  screenshot: string;
  playerCount: number;
}

export interface PastTournament {
  name: string;
  game: string;
  groups: PastGroup[];
}
