'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Gamepad2 } from "lucide-react";
import ErrorBoundary from '@/components/ErrorBoundary';
import { useWinnersData } from '@/hooks/useWinnersData';
import WinnersGrid from '@/components/winners/WinnersGrid';
import PastTournamentGallery from '@/components/winners/PastTournamentGallery';

export default function WinnersPage() {
  const [tab, setTab] = useState<'winners' | 'past'>('winners');
  const { sortedDates, groupedWinners, pastTournaments, loading } = useWinnersData();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 bg-dot-grid relative pt-32 pb-12 overflow-x-hidden">
      <Navbar />

      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <ErrorBoundary fallbackTitle="Winners Page Error">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Tournament <span className="text-google-blue">Champions</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-xl mx-auto">
              Champions who dominated the <span className="text-slate-900 dark:text-white font-bold">Bharat Gaming League</span>.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mb-12">
            <button 
              onClick={() => setTab('winners')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                tab === 'winners' 
                  ? 'bg-google-blue text-white shadow-md shadow-blue-500/10 border border-transparent' 
                  : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Champions
            </button>
            <button 
              onClick={() => setTab('past')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                tab === 'past' 
                  ? 'bg-google-blue text-white shadow-md shadow-blue-500/10 border border-transparent' 
                  : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Past Tournaments
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between animate-pulse">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mb-2" />
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  </div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full pt-4 border-t border-slate-100 dark:border-slate-800" />
                </div>
              ))}
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
