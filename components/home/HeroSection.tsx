'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, ShieldCheck, Trophy, Users, Zap } from 'lucide-react';

export default function HeroSection() {
  const { status } = useSession();
  const router = useRouter();

  const handleJoinClick = (e: React.MouseEvent) => {
    if (status !== 'authenticated') {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <section className="relative pt-28 pb-12 lg:pt-40 lg:pb-28 overflow-hidden bg-white dark:bg-slate-950">
      {/* Dot grid background pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0" />

      {/* Static background shapes (no float animations) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-blue-500/15 via-cyan-400/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full bg-gradient-to-tl from-violet-500/10 via-blue-400/8 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-amber-400/5 to-rose-400/5 blur-3xl" />
      </div>

      {/* Subtle fade to white at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-[1] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-google-blue" />
              </span>
              India's #1 Trusted Esports Platform
            </div>

            {/* Main Title */}
            <h1 className="text-[2.1rem] xs:text-[2.4rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.2rem] font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.08]">
              Dominate The Arena
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-400 dark:to-cyan-400">
                In India's Top League
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-10 font-medium leading-relaxed">
              Join thousands of players competing in daily BGMI & Free Fire tournaments. Secure matches, transparent results, and instant withdrawals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/tournaments"
                onClick={handleJoinClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-center flex items-center justify-center gap-2 group text-sm"
              >
                Join Tournament
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/winners"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl font-bold transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
              >
                <Trophy className="w-4 h-4 text-google-yellow" />
                View Winners
              </Link>
            </div>
            
            {/* Floating stat pills */}
            <div className="mt-10 flex flex-wrap items-center gap-3 w-full justify-center lg:justify-start">
              {[
                { icon: Zap, label: 'Instant UPI Payouts', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                { icon: Users, label: '500M+ Players', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${stat.bg} border border-slate-100 dark:border-slate-800/60`}
                >
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Column (No Animations) */}
          <div className="hidden lg:block w-[45%] relative">
            {/* Background glow (no pulses) */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/15 via-violet-500/8 to-transparent blur-3xl opacity-70 dark:opacity-40 rounded-3xl" />
            
            {/* Main image card */}
            <div className="relative rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] aspect-[4/3] bg-slate-100 dark:bg-slate-900 group">
              <Image
                src="/assets/gaming-hero.png"
                alt="BGL Esports Gaming Setup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              
              {/* Floating overlay card */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-google-green" />
                      <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">Live Now</p>
                    </div>
                    <p className="text-sm font-bold text-white">Active Tournaments Running</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/10 text-white font-extrabold text-[11px] tracking-wide whitespace-nowrap">
                    500M+ PLAYERS
                  </div>
                </div>
              </div>
            </div>

            {/* Static mini-card accent */}
            <div className="absolute -top-4 -right-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-google-yellow to-amber-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Prize Pool</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹25L+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
