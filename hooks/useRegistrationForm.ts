import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export const useRegistrationForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const tournamentId = searchParams.get('tournament') || 'general';
  const isEdit = searchParams.get('edit') === 'true';
  
  const [tournament, setTournament] = useState<any>(null);
  const [fetchingTournament, setFetchingTournament] = useState(true);

  const [matchType, setMatchType] = useState<'Solo' | 'Duo' | 'Squad'>('Solo');
  const [teamName, setTeamName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [players, setPlayers] = useState([{ name: '', uid: '', instagram: '' }]);
  const [isPaid, setIsPaid] = useState(false);
  const [rejectionTargets, setRejectionTargets] = useState<string[]>([]);
  const [rejectionIndices, setRejectionIndices] = useState<number[]>([]);


  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const initForm = async () => {
        try {
            if (isEdit) {
                const regRes = await fetch('/api/my-registrations');
                const regs = await regRes.json();
                const reg = regs.find((r: any) => r._id === tournamentId);
                if (reg) {
                    setTeamName(reg.teamName);
                    setWhatsapp(reg.whatsapp);
                    setMatchType(reg.matchType);
                    setPlayers(reg.players.map((p: any) => ({
                        name: p.name,
                        uid: p.uid,
                        instagram: p.instagram,
                    })));

                    setIsPaid(reg.paymentVerified || reg.paymentStatus === 'Paid');
                    setRejectionTargets(reg.rejectionTargets || []);
                    setRejectionIndices((reg.rejectionIndices || []).map((i: any) => Number(i)));
                    
                    const tRes = await fetch('/api/tournaments');
                    const tData = await tRes.json();
                    const tFound = tData.find((t: any) => t.id === reg.tournamentId);
                    setTournament(tFound);
                    
                    if (!isEdit && tFound?.allowedMatchTypes?.length > 0) {
                        setMatchType(tFound.allowedMatchTypes[0]);
                    }
                }
            } else {
                // Fetch tournament info
                const res = await fetch('/api/tournaments');
                const data = await res.json();
                const found = Array.isArray(data) ? data.find((t: any) => t.id === tournamentId) : null;
                setTournament(found);

                let defCount = 1;
                if (found?.allowedMatchTypes?.length > 0) {
                    setMatchType(found.allowedMatchTypes[0]);
                    defCount = found.allowedMatchTypes[0] === 'Solo' ? 1 : found.allowedMatchTypes[0] === 'Duo' ? 2 : 4;
                }

                // Auto-fill from user profile
                try {
                    const profileRes = await fetch('/api/profile');
                    if (profileRes.ok) {
                        const p = await profileRes.json();
                        if (p.teamName) setTeamName(p.teamName);
                        if (p.whatsapp) setWhatsapp(p.whatsapp);
                        if (p.paymentQrUrl) { /* QR is handled on backend from profile */ }

                        const savedTeam: any[] = p.savedPlayers || [];

                        // Pre-fill players: leader from profile, teammates from savedPlayers
                        const defaultPlayers = Array(defCount).fill(0).map((_, i) => {
                            if (i === 0) {
                                return {
                                    name: p.gameUsername || '',
                                    uid: p.gameUID || '',
                                    instagram: p.instagram || '',
                                };
                            }
                            // Fill teammates from saved team (offset by 1 since leader is slot 0)
                            const teammate = savedTeam[i - 1];
                            return {
                                name: teammate?.name || '',
                                uid: teammate?.uid || '',
                                instagram: teammate?.instagram || '',
                            };
                        });
                        setPlayers(defaultPlayers);
                        return; // skip default player init below
                    }
                } catch { /* profile fetch optional */ }

                setPlayers(Array(defCount).fill(0).map(() => ({ name: '', uid: '', instagram: '' })));
            }
        } catch (err) {
            console.error('Init error:', err);
        } finally {
            setFetchingTournament(false);
        }
    };
    initForm();
  }, [tournamentId, isEdit]);

  const handleMatchTypeChange = (type: 'Solo' | 'Duo' | 'Squad') => {
    setMatchType(type);
    const count = type === 'Solo' ? 1 : type === 'Duo' ? 2 : 4;
    setPlayers(Array(count).fill(0).map(() => ({ name: '', uid: '', instagram: '' })));
  };

  const updatePlayer = (index: number, field: string, value: any) => {
    const newPlayers = [...players];
    (newPlayers[index] as any)[field] = value;
    setPlayers(newPlayers);
  };

  const getEntryFee = () => {
    if (matchType === 'Solo') return 36;
    if (matchType === 'Duo') return 72;
    if (matchType === 'Squad') return 144;
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const currentFee = getEntryFee();
      
      if (isEdit) fd.append('registrationId', tournamentId);
      fd.append('matchType', matchType);
      fd.append('teamName', teamName);
      fd.append('whatsapp', whatsapp);
      fd.append('tournamentId', isEdit ? tournament?.id : tournamentId);
      fd.append('tournamentName', tournament?.title || '');
      fd.append('entryFee', `₹${currentFee}`);


      players.forEach((p, i) => {
        fd.append(`playerName_${i}`, p.name);
        fd.append(`playerUid_${i}`, p.uid);
        fd.append(`playerInstagram_${i}`, p.instagram);
      });



      const res = await fetch('/api/register', { 
        method: isEdit ? 'PUT' : 'POST', 
        body: fd 
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      if (data.paymentSessionId) {
        const cashfree = (window as any).Cashfree({ mode: "sandbox" });
        cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
      } else {
        setIsSubmitted(true);
        toast.success(isEdit ? 'Registration updated!' : 'Registration submitted!');
        setTimeout(() => {
          router.push('/dashboard?tab=My Registrations');
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    tournamentId,
    isEdit,
    tournament,
    fetchingTournament,
    matchType,
    setMatchType,
    teamName,
    setTeamName,
    whatsapp,
    setWhatsapp,
    players,
    setPlayers,
    isPaid,
    rejectionTargets,
    rejectionIndices,

    isSubmitted,
    loading,
    session,
    status,
    handleMatchTypeChange,
    updatePlayer,
    getEntryFee,
    handleSubmit,
    router
  };
};
