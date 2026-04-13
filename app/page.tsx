'use client';

import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import { Trophy, TrendingUp, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const winners = [
  { team: 'Team Alpha', prize: '₹1,000', tournament: 'Pro League S15' },
  { team: 'Shadow Squad', prize: '₹500', tournament: 'Alpha Cups Elite' },
  { team: 'Death Reapers', prize: '₹2,500', tournament: 'Winter Clash' },
  { team: 'BloodBath Boys', prize: '₹750', tournament: 'Pro League S14' },
  { team: 'Noob Slayers', prize: '₹300', tournament: 'Open Cup' },
  { team: 'Fire Lords', prize: '₹1,500', tournament: 'BGMI Invitational' },
];

export default function Home() {
  const [liveTournaments, setLiveTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => {
        setLiveTournaments(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .finally(() => setLoading(false));
  }, []);

  // reusable ticker component logic to keep it DRY
  const TickerContent = () => (
    <div className="flex gap-10 animate-[marquee_50s_linear_infinite] whitespace-nowrap items-center py-2">
      {[...winners, ...winners, ...winners].map((w, i) => (
        <div key={i} className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-google-green" />
             <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-tight">{w.team}</span>
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Success</span>
          <span className="text-xs font-bold text-google-green">+{w.prize}</span>
          <span className="text-[9px] text-google-blue font-bold tracking-widest uppercase bg-blue-50/50 dark:bg-blue-500/5 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-500/20">{w.tournament}</span>
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <Image 
             src="/assets/hero-bg.png" 
             alt="Background" 
             fill 
             className="object-cover opacity-[0.03] dark:opacity-[0.07]"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Centered Left Content Column */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
              
              {/* Trusted Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm text-google-blue text-[10px] font-bold uppercase tracking-widest mb-8 transition-transform hover:scale-105 duration-300">
                 <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-google-blue"></span>
                 </div>
                 India's #1 Trusted Esports Platform
              </div>

              {/* MOBILE ONLY TICKER */}
              <div className="block lg:hidden relative w-full overflow-hidden mb-10 h-10 flex items-center bg-slate-50/30 dark:bg-slate-900/30 rounded-full px-4 border border-slate-100/50 dark:border-slate-800/50">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-50/0 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50/0 to-transparent z-10 pointer-events-none" />
                <TickerContent />
              </div>

              {/* H1 Title - Enhanced Typography & Gradient */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05] max-w-2xl px-2">
                 Dominate The Arena In <br className="hidden md:block" />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-blue-500 to-cyan-500">
                    India's Top League
                 </span>
              </h1>

              {/* Description - Refined spacing */}
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-12 font-medium leading-relaxed px-4 sm:px-0">
                 Join thousands of players competing in daily safe, transparent, and high-payout tournaments. Experience the next era of competitive gaming.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-6 sm:px-0">
                 <Link href="/tournaments" className="w-full sm:w-auto px-10 py-4 bg-google-blue text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all hover:scale-[1.02] active:scale-100 text-center">
                    Join Tournament
                 </Link>
                 <Link href="/winners" className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50/80 transition-all text-center">
                    View Winners
                 </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="hidden lg:block w-1/2 relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-google-blue/10 to-transparent blur-3xl opacity-50" />
               <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl aspect-[4/3]">
                 <Image 
                   src="/assets/gaming-hero.png" 
                   alt="Pro Gaming Setup" 
                   fill
                   className="object-cover"
                   priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                       <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse" />
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Global Championship Live</p>
                       </div>
                       <p className="text-sm font-bold text-white tracking-tight">Join 12,400+ Active Players Today</p>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* DESKTOP ONLY TICKER */}
      <div className="hidden lg:block bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-4 overflow-hidden backdrop-blur-sm">
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          <TickerContent />
        </div>
      </div>

      <section className="py-12 md:py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Active Tournaments</h2>
            <p className="text-slate-500 mt-2 font-medium">Join a match today and prove your skills.</p>
          </div>
          <Link href="/tournaments" className="text-sm font-bold text-google-blue hover:underline hidden md:block">
            See all tournament matches
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="h-96 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)
          ) : liveTournaments.map((t) => (
             <TournamentCard key={t.id} {...t} />
          ))}
        </div>
      </section>

      {/* Trust Grid */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Why Players Trust BGL</h2>
             <p className="text-slate-500 font-medium max-w-xl mx-auto">India's most transparent esports ecosystem, built on three years of excellence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Fair Play Policy', desc: 'Every match is monitored by expert admins and anti-cheat tech to ensure a level playing field.', color: 'text-google-blue', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { icon: Zap, title: 'Instant Payouts', desc: 'Withdraw your winnings within 24 hours directly to your UPI/Bank. No holds, no hidden fees.', color: 'text-google-green', bg: 'bg-green-50 dark:bg-green-500/10' },
              { icon: Heart, title: '50K+ Active Players', desc: 'Join a community of thousands who compete daily for glory and real rewards across India.', color: 'text-google-red', bg: 'bg-red-50 dark:bg-red-500/10' },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center md:text-left">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0", f.bg)}>
                  <f.icon className={cn("w-6 h-6", f.color)} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
