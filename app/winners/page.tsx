'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, Calendar, User, Users, Medal, Search, Filter } from "lucide-react";
import Image from 'next/image';

interface Winner {
  _id: string;
  tournamentName: string;
  teamName: string;
  playerName: string;
  amount: string;
  date: string;
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchWinners() {
      try {
        const res = await fetch('/api/admin/winners');
        const data = await res.json();
        setWinners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch winners');
      } finally {
        setLoading(false);
      }
    }
    fetchWinners();
  }, []);

  // Group winners by date
  const groupedWinners = winners.reduce((acc: Record<string, Winner[]>, winner) => {
    if (!acc[winner.date]) acc[winner.date] = [];
    acc[winner.date].push(winner);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedWinners).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
      <Navbar />

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-neon-cyan/10 blur-[100px] -z-10" />
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-foreground mb-4">
            Tournament <span className="text-neon-cyan underline decoration-neon-cyan/30 underline-offset-8">Winners</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto">
            Celebrating the champions of <span className="text-foreground">Bharat Gaming League</span>
          </p>
        </div>

        {/* Search & Filter - Decorative for now */}
        <div className="max-w-xl mx-auto mb-12 flex gap-4">
            <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-neon-cyan transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search player or team..." 
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all placeholder:text-slate-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Content */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
                 <p className="font-black italic uppercase text-slate-400 tracking-widest text-xs">Loading Hall of Fame...</p>
             </div>
        ) : winners.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <Medal className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase text-foreground mb-2">No winners announced yet</h3>
                <p className="text-slate-500 font-bold text-sm">Be the first one to win and get listed here!</p>
            </div>
        ) : (
            <div className="space-y-16">
                {sortedDates.map((date) => {
                    const winnersOnDate = groupedWinners[date].filter(w => 
                        w.playerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        w.teamName.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    if (winnersOnDate.length === 0) return null;

                    return (
                        <div key={date} className="relative">
                            {/* Date Separator */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="px-4 py-2 rounded-xl bg-neon-cyan text-white text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                    {date}
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-neon-cyan/30 to-transparent" />
                            </div>

                            {/* Winners Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {winnersOnDate.map((winner) => (
                                    <div key={winner._id} className="group glass-card p-6 border-slate-200 dark:border-slate-800 hover:border-neon-cyan/30 transition-all duration-500 hover:translate-y-[-8px]">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                                <Trophy className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Prize Won</p>
                                                <p className="text-xl font-black italic text-neon-cyan">₹{winner.amount}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tournament</p>
                                                <h3 className="font-black italic uppercase text-foreground leading-tight group-hover:text-neon-cyan transition-colors">{winner.tournamentName}</h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Winner</p>
                                                    <p className="text-sm font-bold truncate text-foreground flex items-center gap-1.5 uppercase tracking-tight">
                                                        <User className="w-3.5 h-3.5 text-neon-purple" /> {winner.playerName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Team</p>
                                                    <p className="text-sm font-bold truncate text-foreground flex items-center gap-1.5 uppercase tracking-tight">
                                                        <Users className="w-3.5 h-3.5 text-neon-purple" /> {winner.teamName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
