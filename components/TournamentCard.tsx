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
  date: string;
  time: string;
  slots: string;
  image: string;
  status?: 'Open' | 'Closed' | 'Coming Soon';
}

export default function TournamentCard({
  id,
  title,
  game,
  prizePool,
  date,
  time,
  slots,
  image,
  status
}: TournamentCardProps) {
  const isBGMI = game === 'BGMI';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-[0_1px_3px_0_rgba(60,64,67,.30)] hover:shadow-xl transition-all group flex flex-col">
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider",
            isBGMI ? "bg-google-blue text-white" : "bg-google-red text-white"
          )}>
            {game}
          </span>
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-white/95 text-slate-900 shadow-sm",
            status === 'Open' ? "text-google-green" : "text-google-yellow"
          )}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 line-clamp-1 group-hover:text-google-blue transition-colors">
          {title}
        </h3>

        {/* Financial Breakdown Section */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 mb-8">
          <div className="bg-white dark:bg-slate-900 p-4">
             <div className="flex items-center gap-1.5 mb-1">
                <Trophy className="w-3 h-3 text-google-yellow" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Grand Prize</span>
             </div>
             <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{prizePool}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 border-l border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3 h-3 text-google-green" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Entry Fee</span>
             </div>
             <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">₹36 - 144</p>
          </div>
        </div>

        {/* Status & Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-8">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
               <Users className="w-3 h-3" /> Availability
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{slots}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
               <Calendar className="w-3 h-3" /> Match Date
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{date}</p>
          </div>
        </div>

        <Link href={status === 'Open' ? `/register?tournament=${id}` : '#'} className={cn("mt-auto", status !== 'Open' && "pointer-events-none")}>
          <button className={cn(
            "w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
            status === 'Open' 
              ? "bg-google-blue text-white shadow-md hover:bg-blue-600"
              : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          )}>
            {status === 'Open' ? 'Join Now' : status}
          </button>
        </Link>
      </div>
    </div>
  );
}
