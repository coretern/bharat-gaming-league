import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface WithdrawalHistoryItem {
  id: string;
  tournamentName: string;
  matchType: 'Solo' | 'Duo' | 'Squad';
  teamName: string;
  groupNumber?: number;
  slotNumber?: number;
  spend: number;
  earning: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentVerified: boolean;
  resultStatus: 'Playing' | 'Won' | 'Lost';
  createdAt: string;
  matchDate?: string;
  matchTime?: string;
}

export interface WithdrawalData {
  totalSpend: number;
  totalEarning: number;
  history: WithdrawalHistoryItem[];
}

export function useWithdrawalData() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<WithdrawalData>({ totalSpend: 0, totalEarning: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/withdrawal');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch withdrawal data');
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    isAuthenticated: status === 'authenticated',
    isSessionLoading: status === 'loading',
  };
}
