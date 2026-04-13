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
  const [players, setPlayers] = useState([{ name: '', uid: '', instagram: '', file: null as File | null, existingUrl: '' }]);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [existingQrUrl, setExistingQrUrl] = useState('');
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
                        file: null,
                        existingUrl: p.profileScreenshot
                    })));
                    setExistingQrUrl(reg.payoutDetails?.qrCodeUrl || '');
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
                const res = await fetch('/api/tournaments');
                const data = await res.json();
                const found = Array.isArray(data) ? data.find((t: any) => t.id === tournamentId) : null;
                setTournament(found);
                if (found?.allowedMatchTypes?.length > 0) {
                    setMatchType(found.allowedMatchTypes[0]);
                    const defCount = found.allowedMatchTypes[0] === 'Solo' ? 1 : found.allowedMatchTypes[0] === 'Duo' ? 2 : 4;
                    setPlayers(Array(defCount).fill(0).map(() => ({ name: '', uid: '', instagram: '', file: null as File | null, existingUrl: '' })));
                }
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
    setPlayers(Array(count).fill(0).map(() => ({ name: '', uid: '', instagram: '', file: null as File | null, existingUrl: '' })));
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
        if (p.file) fd.append(`playerScreenshot_${i}`, p.file);
      });

      if (qrFile) fd.append('qrFile', qrFile);

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
          router.push('/dashboard');
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
    qrFile,
    setQrFile,
    existingQrUrl,
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
