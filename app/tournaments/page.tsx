'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentCard from "@/components/TournamentCard";
import { Search, Trophy } from "lucide-react";

export default function TournamentsPage() {
  const [filter, setFilter] = useState<'All' | 'BGMI' | 'Free Fire'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveTournaments, setLiveTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setLiveTournaments(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTournaments = liveTournaments.filter(t => {
    const matchesFilter = filter === 'All' || t.game === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-40 bg-white dark:bg-slate-950">
      <Navbar />
      
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
             Explore <span className="text-google-blue">Tournaments</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl font-medium">
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
                className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all"
              />
           </div>
           
           <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
             {(['All', 'BGMI', 'Free Fire'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === f 
                      ? 'bg-white dark:bg-slate-800 text-google-blue shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
             {[1, 2, 3, 4].map(i => <div key={i} className="h-96 rounded-2xl bg-slate-50 animate-pulse" />)}
           </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl mb-24">
            <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No results found</h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Try broadening your search or filters.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
