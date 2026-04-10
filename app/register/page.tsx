'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle2, Trophy, LogIn, ExternalLink, Info } from "lucide-react";
import toast from 'react-hot-toast';

function RegistrationForm() {
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
                    
                    // Fetch tournament info for header
                    const tRes = await fetch('/api/tournaments');
                    const tData = await tRes.json();
                    const tFound = tData.find((t: any) => t.id === reg.tournamentId);
                    setTournament(tFound);
                }
            } else {
                const res = await fetch('/api/tournaments');
                const data = await res.json();
                const found = Array.isArray(data) ? data.find((t: any) => t.id === tournamentId) : null;
                setTournament(found);
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
    setPlayers(Array(count).fill(0).map(() => ({ name: '', uid: '', instagram: '', file: null })));
  };

  const updatePlayer = (index: number, field: string, value: any) => {
    const newPlayers = [...players];
    (newPlayers[index] as any)[field] = value;
    setPlayers(newPlayers);
  };

  if (fetchingTournament) {
    return <div className="text-center py-24 text-slate-500 font-bold">Checking tournament status...</div>;
  }

  if (tournament && tournament.status !== 'Open') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <Info className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Registration Closed</h2>
          <p className="text-slate-500 mb-6 text-sm">Applications for this tournament are currently closed or have been recently completed.</p>
          <button onClick={() => router.push('/')}
            className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <LogIn className="w-12 h-12 text-neon-purple mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Login Required</h2>
          <p className="text-slate-500 mb-6 text-sm">You need to sign in with Google before registering.</p>
          <button
            onClick={() => signIn('google', { callbackUrl: `/register?tournament=${tournamentId}` })}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

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
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Registered!</h2>
          <p className="text-slate-500 text-sm mb-6">Redirecting to payment if applicable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {tournament && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
           <div className="absolute -right-4 -top-4 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full" />
           <div className="relative z-10">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[.2em]">Live Tournament</span>
              </div>
              <h3 className="font-black italic uppercase text-3xl tracking-tighter">{tournament.title}</h3>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-300">
                  <p>Match Entry Fee: <span className="text-white">₹{getEntryFee()}</span></p>
                  <p>Prize Pool: <span className="text-green-400">{tournament.prizePool}</span></p>
                  <p>Schedule: <span className="text-white">{tournament.date}</span></p>
              </div>
           </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">1. Tournament Format</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['Solo', 'Duo', 'Squad'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleMatchTypeChange(type)}
                className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border ${
                  matchType === type
                    ? 'bg-neon-purple text-white border-neon-purple shadow-lg shadow-neon-purple/20 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">2. Team Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Team Name <span className="text-red-500">*</span></label>
              <input required value={teamName} onChange={e => setTeamName(e.target.value)} type="text" placeholder="e.g. Mortal Gaming"
                className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number <span className="text-red-500">*</span></label>
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                type="tel" placeholder="10 Digit Number" pattern="[0-9]{10}"
                className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {players.map((player, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  {idx === 0 ? '3. Team Leader' : `Player ${idx + 1}`}
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name <span className="text-red-500">*</span></label>
                  <input required value={player.name} onChange={e => updatePlayer(idx, 'name', e.target.value)} type="text" placeholder="Gamer Name"
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Game UID <span className="text-red-500">*</span></label>
                  <input required value={player.uid} onChange={e => updatePlayer(idx, 'uid', e.target.value)} type="text" placeholder="123456789"
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Instagram Profile</label>
                <input value={player.instagram} onChange={e => updatePlayer(idx, 'instagram', e.target.value)} type="url" placeholder="https://instagram.com/profile"
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Game Profile Screenshot <span className="text-red-500">*</span></label>
                <div className="relative h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 flex items-center gap-3 overflow-hidden group hover:border-neon-purple/50 transition-colors">
                    <Upload className="w-4 h-4 text-slate-400 group-hover:text-neon-purple transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                        {player.file ? player.file.name : player.existingUrl ? '(Already Uploaded) Change image...' : 'Choose image for proof...'}
                    </span>
                    <input required type="file" accept="image/*" onChange={e => updatePlayer(idx, 'file', e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Payout Details (For Prizes)</h3>
          
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center leading-relaxed">
            Please upload your PhonePe/GPay QR code. If you win, we will use this to send your prize money.
          </div>

          <div className="relative h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center group hover:border-neon-purple/50 transition-colors bg-slate-50/50 dark:bg-slate-900">
            <input required type="file" accept="image/*" onChange={e => setQrFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-neon-purple mb-2" />
            <p className="text-xs font-black uppercase text-slate-500">
                {qrFile ? qrFile.name : existingQrUrl ? '(Already Uploaded) Change QR' : 'Upload Payment QR'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or JPEG</p>
          </div>
        </div>

        <button disabled={loading} type="submit"
          className="w-full h-16 bg-slate-900 border-2 border-slate-900 dark:bg-neon-purple dark:border-neon-purple text-white font-black italic uppercase rounded-3xl hover:bg-transparent hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-50 text-base shadow-xl active:scale-[0.98]">
          {loading ? 'Processing...' : `Confirm Registration · ₹${getEntryFee()}`}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-6">
        <header className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2 text-foreground">
            Team <span className="text-neon-purple">Registration</span>
          </h1>
          <p className="text-slate-500 text-sm font-semibold">Secure your slot. Fill in your details and upload your game profile screenshot.</p>
        </header>
        <Suspense fallback={<div className="text-center py-24 text-foreground">Loading...</div>}>
          <RegistrationForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
