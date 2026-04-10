export interface Tournament {
  id: string;
  title: string;
  game: 'BGMI' | 'Free Fire';
  prizePool: string;
  date: string;
  time: string;
  slots: string;
  image: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
}

export const tournaments: Tournament[] = [
  {
    id: 'bgmi-pro-league',
    title: 'BGMI Pro Championship',
    game: 'BGMI',
    prizePool: '₹1,00,000',
    date: '15 Oct 2026',
    time: '08:00 PM',
    slots: '12/48',
    image: '/bgmi-thumb.png',
    status: 'Open',
  },
  {
    id: 'ff-alpha-cups',
    title: 'Free Fire Alpha Elite',
    game: 'Free Fire',
    prizePool: '₹50,000',
    date: '18 Oct 2026',
    time: '04:00 PM',
    slots: '24/100',
    image: '/ff-thumb.png',
    status: 'Open',
  },
];
