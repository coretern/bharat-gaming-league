export interface Tournament {
  id: string;
  title: string;
  game: 'BGMI' | 'Free Fire';
  prizePool: string;
  entryFee: string;
  date: string;
  time: string;
  slots: string;
  image: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
}

export const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Pro League Season 15',
    game: 'BGMI',
    prizePool: '₹1,00,000',
    entryFee: '₹200 / Team',
    date: '15 Oct 2026',
    time: '08:00 PM',
    slots: '12/48',
    image: '/bgmi-thumb.png',
    status: 'Open',
  },
  {
    id: '2',
    title: 'Alpha Cups Elite',
    game: 'Free Fire',
    prizePool: '₹50,000',
    entryFee: '₹100 / Team',
    date: '18 Oct 2026',
    time: '04:00 PM',
    slots: '24/100',
    image: '/ff-thumb.png',
    status: 'Open',
  },
  {
    id: '3',
    title: 'Winter Clash Masters',
    game: 'BGMI',
    prizePool: '₹2,50,000',
    entryFee: '₹500 / Team',
    date: '25 Oct 2026',
    time: '06:00 PM',
    slots: '0/24',
    image: '/bgmi-thumb.png',
    status: 'Closed',
  },
  {
    id: '4',
    title: 'Cyber Strike Championship',
    game: 'Free Fire',
    prizePool: '₹1,20,000',
    entryFee: '₹250 / Team',
    date: '02 Nov 2026',
    time: '07:30 PM',
    slots: '80/80',
    image: '/ff-thumb.png',
    status: 'Coming Soon',
  },
];
