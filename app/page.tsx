'use client';

import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import { Trophy, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

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
    <main className="min-h-screen relative overflow-x-hidden bg-background">
      <Navbar />

      {/* Featured Tournaments Section */}
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start">
              {/* Winners ticker */}
              <div className="flex items-center gap-3 mb-4 overflow-hidden w-full max-w-sm">
                <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                  Live
                </span>
                <div className="overflow-hidden flex-1">
                  <div className="flex gap-8 animate-[marquee_18s_linear_infinite] whitespace-nowrap">
                    {[...winners, ...winners].map((w, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-foreground/70">
                        <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="text-foreground font-black">{w.team}</span>
                        <span className="text-foreground/50">won</span>
                        <span className="text-neon-cyan font-black">{w.prize}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h1 className="hidden md:block text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Featured <span className="text-neon-cyan">Tournaments</span>
              </h1>
            </div>
            
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <Link href="/tournaments">
                <button className="btn-outline text-xs uppercase tracking-widest px-8 group">
                  View All <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-[400px] rounded-3xl bg-foreground/5 animate-pulse" />)
            ) : liveTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>
        </div>
      </section>



      {/* Trust & Track Record Section */}
      <section className="py-24 border-t border-foreground/5 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(157,0,255,0.07) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-6 relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[11px] font-black uppercase tracking-[0.25em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
              Trusted Since 2021
            </div>
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
              India's Most <span className="text-neon-purple">Trusted</span> Esports Platform
            </h2>
            <p className="text-foreground/50 max-w-xl mx-auto text-base font-medium">
              We've been conducting fair, transparent, and competitive tournaments for over 3 years — and we're just getting started.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '3+', label: 'Years Active', sub: 'Running since 2021', color: 'text-neon-cyan' },
              { value: '200+', label: 'Tournaments Held', sub: 'Across BGMI & Free Fire', color: 'text-neon-purple' },
              { value: '50,000+', label: 'Players Registered', sub: 'From across India', color: 'text-amber-400' },
              { value: '₹15L+', label: 'Prize Money Paid', sub: '100% on-time payouts', color: 'text-neon-cyan' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <p className={`text-3xl md:text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-foreground font-black uppercase text-xs tracking-widest mt-2">{stat.label}</p>
                <p className="text-foreground/40 text-[11px] mt-1 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Trust Points */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'Season After Season', desc: 'We have completed 15+ tournament seasons without a single cancellation or refund dispute.' },
              { icon: '💸', title: 'Instant Prize Payouts', desc: 'Winners receive their prize money within 24 hours — directly to their UPI or bank account. No delays, ever.' },
              { icon: '🛡️', title: 'Anti-Cheat Enforced', desc: 'Every match is monitored by our dedicated admin team. Cheaters are permanently banned — zero tolerance policy.' },
            ].map((point) => (
              <div key={point.title} className="glass-card p-6 flex gap-4 items-start">
                <span className="text-3xl shrink-0">{point.icon}</span>
                <div>
                  <h4 className="font-black text-foreground uppercase tracking-tight text-sm mb-1">{point.title}</h4>
                  <p className="text-foreground/50 text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
