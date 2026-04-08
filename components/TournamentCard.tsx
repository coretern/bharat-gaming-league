'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card group overflow-hidden border-white/5 hover:border-white/20 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            isBGMI ? "bg-neon-cyan text-black" : "bg-neon-purple text-white"
          )}>
            {game}
          </span>
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md border border-white/10",
            status === 'Open' ? "text-green-400" : "text-amber-400"
          )}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic group-hover:text-neon-cyan transition-colors line-clamp-1">
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Prize Pool</span>
              <span className="text-sm font-black italic">{prizePool}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neon-purple" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Entry Fee</span>
              <span className="text-sm font-black italic">{entryFee}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Date & Time</span>
              <span className="text-sm font-black italic">{date} @ {time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Registration</span>
              <span className="text-sm font-black italic">{slots} Slots Left</span>
            </div>
          </div>
        </div>

        <Link href={`/register?tournament=${id}`}>
          <button className={cn(
            "w-full h-12 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm transition-all",
            status === 'Open' 
              ? isBGMI ? "bg-neon-cyan text-black hover:shadow-neon-cyan" : "bg-neon-purple text-white hover:shadow-neon-purple"
              : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
          )}>
            {status === 'Open' ? 'Register Now' : 'Closed'}
            {status === 'Open' && <ArrowRight className="w-4 h-4" />}
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
