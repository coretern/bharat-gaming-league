'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TournamentCard from "@/components/TournamentCard";
import { tournaments } from "@/data/tournaments";
import { Search, Trophy } from "lucide-react";

export default function TournamentsPage() {
  const [filter, setFilter] = useState<'All' | 'BGMI' | 'Free Fire'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTournaments = tournaments.filter(t => {
    const matchesFilter = filter === 'All' || t.game === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-foreground">
            Browse <span className="text-neon-cyan">Tournaments</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-bold">
            Find the perfect competition for your team. Filter by game, prize pool, or date.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Search and Filters */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search tournaments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-6 text-foreground focus:outline-none focus:border-neon-cyan transition-all font-medium"
              />
            </div>
            
            <div className="flex gap-2 p-1 bg-foreground/5 border border-foreground/10 rounded-2xl h-14 self-start">
              {(['All', 'BGMI', 'Free Fire'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    filter === f 
                      ? 'bg-neon-cyan text-black shadow-md' 
                      : 'text-slate-500 hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center glass-card border-dashed border-foreground/10">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase italic text-slate-500">No Tournaments Found</h3>
            <p className="text-slate-600 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
