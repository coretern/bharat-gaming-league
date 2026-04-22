export interface Player {
  name: string;
  uid: string;
  profileScreenshot: string;
  instagram?: string;
}

export interface Reg {
  _id: string;
  tournamentName: string;
  game?: string;
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
  groupNumber?: number;
  slotNumber?: number;
  resultStatus?: 'Playing' | 'Won' | 'Lost';
  prizeAmount?: number;
  matchDate?: string;
  matchTime?: string;
  winnerScreenshot?: string;
  createdAt: string;
}

export interface SiteUser {
  _id: string;
  email: string;
  name: string;
  image: string;
  createdAt?: string;
  firstLoginAt: string;
  lastLoginAt: string;
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

export interface CloudinaryMedia {
  url: string;
  type: 'Profile' | 'Payout';
  regId: string;
  fieldKey: string; // e.g., 'qr' or 'p0', 'p1'...
  teamName: string;
  playerName?: string;
  createdAt: string;
}
