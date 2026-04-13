'use client';

import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import { Trophy, TrendingUp, ShieldCheck, Zap, Heart } from "lucide-react";
import Link from "next/link";
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

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue text-[10px] font-bold uppercase tracking-widest mb-6">
             <span className="w-1.5 h-1.5 rounded-full bg-google-blue animate-pulse" />
             Trusted Esports Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
             Level up your game inIndia's top <span className="text-google-blue">Competitive</span> league
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
             Enter safe, transparent, and high-payout tournaments. Daily events for BGMI and Free Fire with instant prize distribution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/tournaments" className="w-full sm:w-auto px-10 py-4 bg-google-blue text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
                Join Tournament
             </Link>
             <Link href="/winners" className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-all">
                View Winners
             </Link>
          </div>
        </div>
      </section>

      {/* Winners Ticker */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-3 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[...winners, ...winners].map((w, i) => (
            <div key={i} className="flex items-center gap-2 px-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{w.team}</span>
              <span className="text-[10px] text-slate-400 font-medium">won {w.prize} in</span>
              <span className="text-[10px] text-google-blue font-bold tracking-tight uppercase">{w.tournament}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Active Tournaments</h2>
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
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Players Trust BGL</h2>
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
