'use client';

import { Trophy, Users, Zap, Play } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Players Joined', value: '50K+', icon: Users, color: 'text-neon-cyan' },
  { label: 'Prize Pool', value: '₹25L+', icon: Trophy, color: 'text-neon-purple' },
  { label: 'Matches Today', value: '120+', icon: Zap, color: 'text-neon-red' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      {/* Background gradient orbs — using radial gradients (no overflow-hidden clipping) */}
      <div className="absolute w-[700px] h-[700px] rounded-full top-[-200px] left-[-250px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(157,0,255,0.25) 0%, transparent 70%)' }}
      />
      <div className="absolute w-[600px] h-[600px] rounded-full top-[50px] right-[-200px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.15) 0%, transparent 70%)' }}
      />
      <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-100px] left-[35%] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,0,85,0.1) 0%, transparent 70%)' }}
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="container mx-auto px-6 relative z-10 py-16">
        <div className="max-w-5xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[11px] font-black uppercase tracking-[0.25em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
            Season 5 Live Now
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-[90px] font-black mb-6 leading-[0.9] italic uppercase tracking-tighter">
            India's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_30px_rgba(0,242,255,0.4)]">
              #1 Esports
            </span>
            <br />
            Tournament
            <br />
            <span className="text-white/90">Platform</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium">
            Compete in BGMI & Free Fire. Win massive prize pools.
            Rise to the top of the leaderboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/register">
              <button className="btn-neon-purple h-14 px-10 text-base uppercase tracking-widest flex items-center gap-3 font-black">
                Register Now <Play className="w-4 h-4 fill-current" />
              </button>
            </Link>
            <Link href="/tournaments">
              <button className="btn-outline h-14 px-10 text-base uppercase tracking-widest font-black">
                View Tournaments
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card px-6 py-4 flex items-center gap-4 min-w-[160px]">
                <stat.icon className={stat.color + " w-5 h-5 shrink-0"} />
                <div>
                  <p className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

