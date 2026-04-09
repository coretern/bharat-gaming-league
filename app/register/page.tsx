'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle2, Info, Trophy, LogIn } from "lucide-react";
import toast from 'react-hot-toast';
import { tournaments } from '@/data/tournaments';

function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const tournamentId = searchParams.get('tournament') || 'general';
  const tournament = tournaments.find(t => t.id === tournamentId);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [leaderUid, setLeaderUid] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Not logged in — show login prompt
  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <LogIn className="w-12 h-12 text-neon-purple mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Login Required</h2>
          <p className="text-slate-500 mb-6 text-sm">You need to sign in with Google before registering for a tournament.</p>
          <button
            onClick={() => signIn('google', { callbackUrl: `/register?tournament=${tournamentId}` })}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="text-center py-24 text-slate-500 font-bold">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('teamName', teamName);
      fd.append('leaderUid', leaderUid);
      fd.append('whatsapp', whatsapp);
      fd.append('tournamentId', tournamentId);
      fd.append('tournamentName', tournament?.title || 'General Tournament');
      if (file) fd.append('paymentScreenshot', file);

      const res = await fetch('/api/register', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      setIsSubmitted(true);
      toast.success('Registration submitted!');
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
          <p className="text-slate-500 text-sm mb-6">Your registration is submitted. We'll verify and notify you on WhatsApp.</p>
          <button onClick={() => router.push('/')} className="w-full h-11 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-12 items-start">
      <div className="lg:col-span-3">
        {/* User info card */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-6">
          {session?.user?.image && <img src={session.user.image} className="w-9 h-9 rounded-full" alt="avatar" />}
          <div>
            <p className="font-bold text-sm text-foreground">{session?.user?.name}</p>
            <p className="text-xs text-slate-500">{session?.user?.email}</p>
          </div>
          <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">Logged In</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Team Name</label>
                <input required value={teamName} onChange={e => setTeamName(e.target.value)} type="text" placeholder="e.g. Team Alpha"
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 text-foreground text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">In-Game UID</label>
                <input required value={leaderUid} onChange={e => setLeaderUid(e.target.value)} type="text" placeholder="e.g. 5123456789"
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 text-foreground text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">WhatsApp Number</label>
              <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} type="tel" placeholder="+91 00000 00000"
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 text-foreground text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Screenshot</label>
              <input required type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-slate-200 cursor-pointer text-xs text-slate-500 pt-2.5" />
            </div>

            <button disabled={loading} type="submit"
              className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-5">
        {tournament && (
          <div className="bg-slate-900 text-white rounded-2xl p-6">
            <Trophy className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-black italic uppercase text-lg">{tournament.title}</h3>
            <p className="text-slate-400 text-sm mt-1">Entry: {tournament.entryFee} · Prize: {tournament.prizePool}</p>
            <p className="text-slate-500 text-xs mt-1">{tournament.date}</p>
          </div>
        )}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-foreground"><Info className="w-4 h-4 text-slate-500" /> Rules</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            {['Team must have 4 active players.','UIDs must match in-game profile.','Transaction ID must be visible.','Join Discord for lobby times.'].map(r => (
              <li key={r} className="flex gap-2"><span>•</span>{r}</li>
            ))}
          </ul>
        </div>
      </div>
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
          <p className="text-slate-500 text-sm font-semibold">Secure your slot. Fill in your details and upload payment proof.</p>
        </header>
        <Suspense fallback={<div className="text-center py-24 text-foreground">Loading...</div>}>
          <RegistrationForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
