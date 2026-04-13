export interface Player {
  name: string;
  uid: string;
  profileScreenshot: string;
  instagram?: string;
}

export interface Reg {
  _id: string;
  tournamentName: string;
  tournamentId: string;
  matchType: string;
  teamName: string;
  userName: string;
  userId: string;
  userEmail: string;
  userImage: string;
  players: Player[];
  whatsapp: string;
  instagram?: string;
  payoutDetails?: {
    qrCodeUrl: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  rejectionTargets?: string[];
  rejectionIndices?: number[];
  previousRejectionReason?: string;
  isResubmitted?: boolean;
  paymentVerified: boolean;
  orderId?: string;
  createdAt: string;
}

export interface SiteUser {
  _id: string;
  email: string;
  name: string;
  image: string;
  createdAt: string;
  lastLogin?: string;
  loginCount: number;
  isBanned: boolean;
}

export interface Tournament {
  id: string;
  _id: string;
  title: string;
  game: string;
  prizePool: string;
  date: string;
  time: string;
  slots: string;
  image: string;
  status: string;
  allowedMatchTypes: string[];
}

export interface Winner {
  _id: string;
  tournamentId: string;
  tournamentName: string;
  playerName: string;
  teamName: string;
  amount: string;
  date: string;
}
