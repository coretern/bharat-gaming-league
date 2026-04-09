'use client';

import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import { tournaments } from "@/data/tournaments";
import { Trophy, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const featuredTournaments = tournaments.slice(0, 3);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-background">
      <Navbar />

      {/* Featured Tournaments Section */}
      <section className="pt-32 pb-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Recommended
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Featured <span className="text-neon-cyan">Tournaments</span>
              </h1>
            </div>
            <Link href="/tournaments">
              <button className="btn-outline text-xs uppercase tracking-widest px-8 group">
                View All <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 container mx-auto px-6 border-t border-foreground/5">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4 p-8 glass-card">
            <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-2">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Massive Prize Pools</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">We host the biggest tournaments with the highest stakes. Win life-changing rewards every single month.</p>
          </div>

          <div className="flex flex-col gap-4 p-8 glass-card">
            <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Fair Play Guaranteed</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Advanced anti-cheat systems and dedicated admins ensure a level playing field for every competitor.</p>
          </div>

          <div className="flex flex-col gap-4 p-8 glass-card">
            <div className="w-14 h-14 rounded-2xl bg-neon-red/10 flex items-center justify-center text-neon-red mb-2">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Real-time Leaderboards</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Track your progress and rankings in real-time. See where you stand against the world's best players.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-28 border-t border-foreground/5">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
            Ready to <span className="text-neon-purple">Dominate</span> the Game?
          </h2>
          <p className="text-lg text-slate-400 mb-10">Join thousands of players already competing. Your journey to the top starts here.</p>
          <Link href="/register">
            <button className="btn-neon-purple h-14 px-12 text-base uppercase tracking-widest font-black">
              Create Team Now
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
