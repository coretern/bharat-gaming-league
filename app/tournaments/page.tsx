'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentCard from "@/components/TournamentCard";
import { Search, Trophy } from "lucide-react";
import { useTournaments } from "@/hooks/useTournaments";

export default function TournamentsPage() {
  const [filter, setFilter] = useState<'All' | 'BGMI' | 'Free Fire'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { tournaments: liveTournaments, loading } = useTournaments();

  const filteredTournaments = liveTournaments.filter(t => {
    const matchesFilter = filter === 'All' || t.game === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 bg-white dark:bg-slate-950 bg-dot-grid relative overflow-x-hidden">
      <Navbar />

      {/* Floating background gradient glow */}
      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-google-blue" />
            </span>
            Live Arenas
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Explore Active <span className="text-google-blue">Tournaments</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl font-medium">
            Browse and join active competitions. Filter by game platform or search for your favorite events.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search tournament name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>
          
          <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none whitespace-nowrap">
            {(['All', 'BGMI', 'Free Fire'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-white dark:bg-slate-800 text-google-blue dark:text-white shadow-sm border border-slate-100 dark:border-slate-700/50' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[430px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between animate-pulse">
                <div>
                  <div className="w-full h-44 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4" />
                  <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-4" />
                  <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4" />
                </div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id}>
                <TournamentCard {...tournament} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mb-24 bg-slate-50/50 dark:bg-slate-900/20">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-255">No results found</h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Try broadening your search or filters.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
