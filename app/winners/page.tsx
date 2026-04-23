'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Medal, Eye, Gamepad2, Crown, Users, ChevronDown } from "lucide-react";
import ErrorBoundary from '@/components/ErrorBoundary';

interface Winner {
  _id: string;
  tournamentName: string;
  teamName: string;
  playerName: string;
  amount: string;
  date: string;
}

interface PastGroup {
  groupNumber: number;
  winnerTeam: string;
  prize: number;
  matchType: string;
  matchDate: string;
  screenshot: string;
  playerCount: number;
}

interface PastTournament {
  name: string;
  game: string;
  groups: PastGroup[];
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [pastTournaments, setPastTournaments] = useState<PastTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'winners' | 'past'>('winners');

  useEffect(() => {
    async function fetchData() {
      try {
        const [wRes, pRes] = await Promise.all([
          fetch('/api/admin/winners'), fetch('/api/past-tournaments'),
        ]);
        const wData = await wRes.json();
        const pData = await pRes.json();
        setWinners(Array.isArray(wData) ? wData : []);
        setPastTournaments(Array.isArray(pData) ? pData : []);
      } catch { /* silent */ } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const groupedWinners = winners.reduce((acc: Record<string, Winner[]>, w) => {
    if (!acc[w.date]) acc[w.date] = [];
    acc[w.date].push(w);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedWinners).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-12">
      <Navbar />
      <ErrorBoundary fallbackTitle="Winners Page Error">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 text-yellow-600 text-[10px] font-bold uppercase tracking-widest mb-6">
              🏆 Hall of Fame
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Tournament <span className="text-google-blue">Champions</span>
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-xl mx-auto">
              Champions who dominated the <span className="text-slate-900 dark:text-white font-bold">Bharat Gaming League</span>.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mb-10">
            <button onClick={() => setTab('winners')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'winners' ? 'bg-google-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <Trophy className="w-3.5 h-3.5 inline mr-1.5" /> Champions
            </button>
            <button onClick={() => setTab('past')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'past' ? 'bg-google-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              <Gamepad2 className="w-3.5 h-3.5 inline mr-1.5" /> Past Tournaments
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-google-blue rounded-full animate-spin" />
              <p className="font-bold text-slate-400 tracking-wider text-xs uppercase">Loading...</p>
            </div>
          ) : tab === 'winners' ? (
            <WinnersGrid sortedDates={sortedDates} groupedWinners={groupedWinners} />
          ) : (
            <PastTournamentGallery tournaments={pastTournaments} />
          )}
        </div>
      </ErrorBoundary>
      <Footer />
    </main>
  );
}

function WinnersGrid({ sortedDates, groupedWinners }: { sortedDates: string[]; groupedWinners: Record<string, Winner[]> }) {
  if (sortedDates.length === 0) return (
    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 shadow-sm">
      <Medal className="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase">No winners announced yet</h3>
      <p className="text-slate-400 font-medium text-sm">Compete in active tournaments to secure your spot!</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {sortedDates.map(date => (
        <div key={date}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {new Date(date).toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}
            </span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedWinners[date].map(w => (
              <div key={w._id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 mx-auto mb-3">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="text-[8px] font-bold text-google-blue uppercase tracking-widest mb-1 line-clamp-1">{w.tournamentName}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">₹{w.amount}</p>
                <div className="w-full pt-3 border-t border-slate-50 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{w.playerName}</p>
                  <p className="text-[9px] font-medium text-slate-400 truncate">{w.teamName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PastTournamentGallery({ tournaments }: { tournaments: PastTournament[] }) {
  if (tournaments.length === 0) return (
    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 shadow-sm">
      <Gamepad2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase">No past tournaments yet</h3>
      <p className="text-slate-400 font-medium text-sm">Completed tournaments will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {tournaments.map((t, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-tight">{t.name}</h3>
              <span className="text-[10px] font-bold text-google-blue uppercase tracking-widest">{t.game} • {t.groups.length} Matches Completed</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-green-50 text-google-green text-[9px] font-black uppercase border border-green-100">Completed</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {t.groups.map((g, j) => (
              <div key={j} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-google-blue uppercase tracking-widest">Group {g.groupNumber}</span>
                  <span className="text-[9px] font-bold text-slate-400">{g.matchDate || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{g.winnerTeam}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-google-green">₹{g.prize}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold">{g.matchType}</span>
                    {g.screenshot && (
                      <a href={g.screenshot} target="_blank" rel="noopener noreferrer" className="text-google-blue hover:underline text-[9px] font-bold flex items-center gap-0.5">
                        <Eye className="w-3 h-3" /> Proof
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
