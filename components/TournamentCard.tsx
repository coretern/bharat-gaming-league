'use client';

import { Calendar, Users, Trophy, DollarSign, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TournamentCardProps {
  id: string;
  title: string;
  game: 'BGMI' | 'Free Fire';
  prizePool: string;
  entryFee: string;
  date: string;
  time: string;
  slots: string;
  image: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
}

export default function TournamentCard({
  id,
  title,
  game,
  prizePool,
  entryFee,
  date,
  time,
  slots,
  image,
  status
}: TournamentCardProps) {
  const isBGMI = game === 'BGMI';

  return (
    <div className="glass-card group overflow-hidden border-foreground/5 hover:border-foreground/20 transition-all">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            isBGMI ? "bg-neon-cyan text-black" : "bg-neon-purple text-white"
          )}>
            {game}
          </span>
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-background border border-foreground/10",
            status === 'Open' ? "text-green-500" : "text-amber-500"
          )}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic group-hover:text-neon-cyan transition-colors line-clamp-1 text-foreground">
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black">Prize Pool</span>
              <span className="text-sm font-black italic text-foreground">{prizePool}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neon-purple" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black">Entry Fee</span>
              <span className="text-sm font-black italic text-foreground">{entryFee}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black">Date & Time</span>
              <span className="text-sm font-black italic text-foreground">{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black">Remaining</span>
              <span className="text-sm font-black italic text-foreground">{slots}</span>
            </div>
          </div>
        </div>

        <Link href={`/register?tournament=${id}`}>
          <button className={cn(
            "w-full h-12 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm transition-all shadow-md",
            status === 'Open' 
              ? isBGMI ? "bg-neon-cyan text-black" : "bg-neon-purple text-white"
              : "bg-foreground/5 text-slate-500 cursor-not-allowed border border-foreground/10"
          )}>
            {status === 'Open' ? 'Register' : 'Closed'}
            {status === 'Open' && <ArrowRight className="w-4 h-4" />}
          </button>
        </Link>
      </div>
    </div>
  );
}
