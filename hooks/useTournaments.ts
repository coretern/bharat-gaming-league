import { useState, useEffect } from 'react';

export interface Tournament {
  id: string;
  title: string;
  game: 'BGMI' | 'Free Fire';
  prizePool: string;
  date: string;
  time: string;
  slots: string;
  image: string;
  status?: 'Open' | 'Closed' | 'Coming Soon';
}

export const useTournaments = (limit?: number) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch('/api/tournaments')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const list = Array.isArray(data) ? data : [];
          setTournaments(limit ? list.slice(0, limit) : list);
        }
      })
      .catch(() => {
        if (active) setTournaments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit]);

  return { tournaments, loading };
};
