import { useState, useEffect } from 'react';
import { Winner, PastTournament } from '@/components/winners/types';

export function useWinnersData() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [pastTournaments, setPastTournaments] = useState<PastTournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [wRes, pRes] = await Promise.all([
          fetch('/api/admin/winners'), 
          fetch('/api/past-tournaments'),
        ]);
        const wData = await wRes.json();
        const pData = await pRes.json();
        if (active) {
          setWinners(Array.isArray(wData) ? wData : []);
          setPastTournaments(Array.isArray(pData) ? pData : []);
        }
      } catch {
        if (active) {
          setWinners([]);
          setPastTournaments([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const groupedWinners = winners.reduce((acc: Record<string, Winner[]>, w) => {
    if (!acc[w.date]) acc[w.date] = [];
    acc[w.date].push(w);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedWinners).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return {
    sortedDates,
    groupedWinners,
    pastTournaments,
    loading,
  };
}
