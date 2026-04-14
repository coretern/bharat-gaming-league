import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface MyReg {
  _id: string;
  tournamentName: string;
  matchType: string;
  teamName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  paymentVerified: boolean;
  matchDate?: string;
  matchTime?: string;
  groupNumber?: number;
  slotNumber?: number;
  resultStatus?: 'Playing' | 'Won' | 'Lost';
  prizeAmount?: number;
  createdAt: string;
}

export const useDashboardData = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || (searchParams.get('order_id') ? 'My Registrations' : 'Profile');
  const [activeTab, setActiveTabState] = useState(initialTab);
  const [myRegs, setMyRegs] = useState<MyReg[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const viewEmail = searchParams.get('view');
  const isAdmin = (session?.user as any)?.isAdmin === true;
  const isImpersonating = isAdmin && viewEmail;

  const fetchMyRegs = async () => {
    if (!session?.user?.email) return;
    setLoadingRegs(true);
    try {
      const url = isImpersonating 
        ? `/api/my-registrations?email=${viewEmail}&t=${Date.now()}`
        : `/api/my-registrations?t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setMyRegs(Array.isArray(data) ? data : []);
    } catch {
      setMyRegs([]);
    } finally {
      setLoadingRegs(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyRegs();

      const orderId = searchParams.get('order_id');
      if (orderId) {
        fetch(`/api/payment/verify?order_id=${orderId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.status === 'PAID') {
              import('react-hot-toast').then(t => t.default.success('Payment Verified! Registration Confirmed.'));
              fetchMyRegs();
            } else if (data.status === 'ACTIVE' || data.status === 'PENDING') {
              import('react-hot-toast').then(t => t.default.error('Payment is still pending.'));
            } else {
              import('react-hot-toast').then(t => t.default.error(`Payment Status: ${data.status || 'Failed'}`));
            }
            
            // Clean up URL to prevent repeated toasts on refresh
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('order_id');
            const newUrl = `/dashboard?${newParams.toString()}`;
            router.replace(newUrl, { scroll: false });
          })
          .catch(() => {
             const newParams = new URLSearchParams(searchParams.toString());
             newParams.delete('order_id');
             router.replace(`/dashboard?${newParams.toString()}`, { scroll: false });
          });
      }
    }
  }, [session, searchParams]);

  return {
    session,
    status,
    activeTab,
    setActiveTab,
    myRegs,
    loadingRegs,
    router,
    isImpersonating,
    viewEmail
  };
};
