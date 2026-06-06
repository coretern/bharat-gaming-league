'use client';

import { Gauge, Gem, Coins } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  slots,
  image,
  status
}: TournamentCardProps) {
  const totalSlots = slots.split('/').pop() || '0';
  const registered = slots.split('/')[0] || '0';
  const remaining = parseInt(totalSlots) - parseInt(registered);
  const percent = (parseInt(registered) / parseInt(totalSlots)) * 100;
  const isFillingFast = remaining > 0 && remaining <= 10;

  const isBGMI = game === 'BGMI';
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const handleJoinClick = (e: React.MouseEvent) => {
    if (sessionStatus !== 'authenticated') {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-blue-500/35 dark:hover:border-blue-500/30 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image 
          src={isBGMI ? '/bgmi-banner-169.png' : game === 'Free Fire' ? '/ff-banner-169.jpg' : image} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn(
            "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm",
            isBGMI ? "bg-google-blue text-white" : "bg-google-red text-white"
          )}>
            {game}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 line-clamp-1 group-hover:text-google-blue dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* Financial Breakdown Section */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-850 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-850 mb-6">
          <div className="bg-white dark:bg-slate-950/40 p-3 sm:p-4">
             <div className="flex items-center gap-1.5 mb-1">
                <Gem className="w-3 h-3 text-google-yellow" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Grand Prize</span>
             </div>
             <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{prizePool}</p>
          </div>
          <div className="bg-white dark:bg-slate-950/40 p-3 sm:p-4 border-l border-slate-100 dark:border-slate-850">
             <div className="flex items-center gap-1.5 mb-1">
                <Coins className="w-3 h-3 text-google-green" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Entry Fee</span>
             </div>
             <p className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">₹36 - 144</p>
          </div>
        </div>

        {/* Availability Section */}
        <div className="mb-6">
          <div className="min-w-0">
             <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mb-1.5 flex items-center gap-1.5 whitespace-nowrap">
                <Gauge className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" /> Availability
             </p>
             <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-end justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">{slots} slots filled</span>
                      {remaining <= 0 && <span className="text-[8px] font-black uppercase text-google-red bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded leading-none shrink-0 border border-red-100/50">Full</span>}
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                     <div 
                       className={cn(
                         "h-full transition-all duration-1000",
                         remaining <= 0 ? "bg-google-red" : percent > 80 ? "bg-google-yellow" : "bg-google-green"
                       )}
                       style={{ width: `${Math.min(percent, 100)}%` }}
                     />
                  </div>
             </div>
          </div>
        </div>

        <Link 
          href={status === 'Open' ? `/register?tournament=${id}` : '#'} 
          onClick={handleJoinClick}
          className={cn("mt-auto", (status !== 'Open') && "pointer-events-none")}
        >
          <button className={cn(
            "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border",
            status === 'Open' 
              ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-blue-600/10 shadow-[0_4px_12px_rgba(26,115,232,0.18)] dark:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_6px_20px_rgba(26,115,232,0.3)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.98]"
              : "bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-805 cursor-not-allowed"
          )}>
            {status === 'Open' ? 'Join Now' : status}
          </button>
        </Link>
      </div>
    </div>
  );
}
