'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Trophy, Calendar, Wallet, Settings, Bell, LogOut } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Dashboard() {
  const sidebarLinks = [
    { name: 'Profile', icon: User, active: true },
    { name: 'Joined Tournaments', icon: Trophy, active: false },
    { name: 'Match Schedule', icon: Calendar, active: false },
    { name: 'Winnings', icon: Wallet, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <main className="min-h-screen pt-24 bg-slate-950">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 border-white/5">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-neon-purple to-neon-cyan mb-4">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tight">John "Neo" Wick</h2>
                <span className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.2em] mt-1">Pro Member</span>
              </div>

              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.name}
                    className={`whitespace-nowrap flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
                      link.active 
                        ? 'bg-neon-purple text-white shadow-neon-purple/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-white dark:hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Header */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Total Matches', value: '124', icon: Trophy, color: 'text-neon-cyan' },
                { label: 'Wins', value: '42', icon: Trophy, color: 'text-neon-purple' },
                { label: 'Total Winnings', value: '₹12,400', icon: Wallet, color: 'text-green-400' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 flex flex-col justify-between h-32 border-white/5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-black italic tracking-tighter">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Your <span className="text-neon-cyan">Competitions</span></h3>
                <button className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors tracking-widest bg-white/5 px-4 py-2 rounded-lg">View All</button>
              </div>

              <div className="glass-card border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tournament Name</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Game</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Placement</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Prize</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { name: 'BGMI Clash of Kings', game: 'BGMI', status: 'Completed', rank: '#4', prize: '₹2,500' },
                        { name: 'Elite Scrims', game: 'Free Fire', status: 'In Progress', rank: '-', prize: '-' },
                        { name: 'Sunday Mega Cup', game: 'BGMI', status: 'Completed', rank: '#2', prize: '₹5,000' },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-6 font-bold uppercase italic">{item.name}</td>
                          <td className="px-6 py-6 text-sm text-slate-400 font-bold">{item.game}</td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-6 font-black italic text-neon-purple">{item.rank}</td>
                          <td className="px-6 py-6 font-black text-right text-white italic">{item.prize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
