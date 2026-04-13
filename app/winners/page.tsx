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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-12">
      <Navbar />

      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20 text-yellow-600 text-[10px] font-bold uppercase tracking-widest mb-6">
             🏆 View Winners
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Tournament <span className="text-google-blue">Legends</span>
          </h1>
          <p className="text-slate-500 font-medium text-base max-w-xl mx-auto">
            Celebrating the elite champions who dominated the battlefield in the <span className="text-slate-900 dark:text-white font-bold">Bharat Gaming League</span>.
          </p>
        </div>

        {/* Content */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="w-10 h-10 border-4 border-slate-200 border-t-google-blue rounded-full animate-spin" />
                 <p className="font-bold text-slate-400 tracking-wider text-xs uppercase">Loading Hall of Fame...</p>
             </div>
        ) : winners.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Medal className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase">No winners announced yet</h3>
                <p className="text-slate-400 font-medium text-sm">Compete in our active tournaments to secure your spot here!</p>
            </div>
        ) : (
            <div className="space-y-16">
                {sortedDates.map((date) => {
                    const winnersOnDate = groupedWinners[date];
                    return (
                        <div key={date}>
                            {/* Date Separator */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {new Date(date).toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}
                                </span>
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                            </div>

                            {/* Winner Badges Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {winnersOnDate.map((winner) => (
                                    <div key={winner._id} className="group bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 mb-3">
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        
                                        <p className="text-[8px] font-bold text-google-blue uppercase tracking-widest mb-1 line-clamp-1">{winner.tournamentName}</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">₹{winner.amount}</p>
                                        
                                        <div className="w-full pt-3 border-t border-slate-50 dark:border-slate-800">
                                           <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{winner.playerName}</p>
                                           <p className="text-[9px] font-medium text-slate-400 truncate">{winner.teamName}</p>
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
      <Footer />
    </main>
  );
}
