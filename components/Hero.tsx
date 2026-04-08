'use client';

import { Trophy, Users, Zap, Play } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Players Joined', value: '50K+', icon: Users, color: 'text-neon-cyan' },
  { label: 'Prize Pool', value: '$25,000', icon: Trophy, color: 'text-neon-purple' },
  { label: 'Matches Today', value: '120+', icon: Zap, color: 'text-neon-red' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden bg-background border-b border-foreground/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            Season 5 Live Now
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 leading-[0.9] italic uppercase tracking-tighter text-foreground">
            Join the <br /> 
            <span className="text-neon-cyan dark:drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              Ultimate
            </span> <br /> 
            Battle Arena
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed font-medium">
            Dominate the battlefield of Free Fire and BGMI. Compete with the best, 
            prove your skills, and win legendary prizes in the most elite esports arena.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-20">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full btn-neon-purple h-16 px-12 text-xl uppercase tracking-tighter flex items-center justify-center gap-3">
                Register Now <Play className="w-5 h-5 fill-current" />
              </button>
            </Link>
            <Link href="/tournaments" className="w-full sm:w-auto">
              <button className="w-full btn-outline h-16 px-12 text-xl uppercase tracking-tighter">
                View Tournaments
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 py-8 border-t border-foreground/5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className={stat.color + " w-6 h-6"} />
                  <span className="text-3xl font-black italic tracking-tighter text-foreground">{stat.value}</span>
                </div>
                <span className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
