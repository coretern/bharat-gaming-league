'use client';

import { ShieldCheck, Zap, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: ShieldCheck,
    title: 'Fair Play Policy',
    color: 'text-blue-500',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    color: 'text-amber-500',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
  {
    icon: Heart,
    title: '500M+ Active Players',
    color: 'text-rose-500',
    iconBg: 'bg-gradient-to-br from-rose-400 to-red-500',
  },
  {
    icon: MessageSquare,
    title: '24/7 Live Support',
    color: 'text-emerald-500',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
];

export default function TrustGrid() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4 tracking-tight">
            Why Players Trust BGL
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            India's most transparent esports ecosystem — security, speed, and competitive integrity at the core.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white/85 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center text-center gap-3 shadow-sm hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/20 aspect-square transition-all duration-300"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", feature.iconBg)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
