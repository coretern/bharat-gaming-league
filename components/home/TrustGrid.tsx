'use client';

import { ShieldCheck, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: ShieldCheck,
    title: 'Fair Play Policy',
    desc: 'Every match is monitored by expert admins with anti-cheat protection, ensuring a clean and competitive playing field.',
    color: 'text-blue-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    desc: 'Withdraw directly to UPI or bank within 24 hours. No holds, no hidden fees — just instant verification.',
    color: 'text-amber-500',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  {
    icon: Heart,
    title: '50K+ Active Players',
    desc: 'Join a massive, passionate gaming community competing daily for glory, rankings, and real cash rewards.',
    color: 'text-rose-500',
    iconBg: 'bg-gradient-to-br from-rose-400 to-red-500',
  },
];

export default function TrustGrid() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-google-blue bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/30 mb-4">
            <ShieldCheck className="w-3 h-3" />
            Secure & Verified
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Why Players Trust BGL
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            India's most transparent esports ecosystem — security, speed, and competitive integrity at the core.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900/70 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-md", feature.iconBg)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
