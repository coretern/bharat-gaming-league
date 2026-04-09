export interface Registration {
  id: string;
  tournamentName: string;
  teamName: string;
  leaderName: string;
  leaderUid: string;
  whatsapp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  paymentVerified: boolean;
}

export const registrations: Registration[] = [
  {
    id: 'REG-001',
    tournamentName: 'BGMI Clash of Kings',
    teamName: 'TEAM ALPHA',
    leaderName: 'John Wick',
    leaderUid: '5123456789',
    whatsapp: '+91 98765 43210',
    status: 'Approved',
    date: 'Apr 08, 2026',
    paymentVerified: true,
  },
  {
    id: 'REG-002',
    tournamentName: 'Free Fire Elite Scrims',
    teamName: 'GODLIKE GAMING',
    leaderName: 'Neo Skywalker',
    leaderUid: '6234567890',
    whatsapp: '+91 87654 32109',
    status: 'Pending',
    date: 'Apr 09, 2026',
    paymentVerified: false,
  },
  {
    id: 'REG-003',
    tournamentName: 'BGMI Clash of Kings',
    teamName: 'SOUL SURVIVORS',
    leaderName: 'Agent 47',
    leaderUid: '7345678901',
    whatsapp: '+91 76543 21098',
    status: 'Pending',
    date: 'Apr 09, 2026',
    paymentVerified: true,
  },
];
