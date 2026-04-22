'use client';

import React from 'react';
import { CheckCircle2, Loader, LogIn, Info, ShieldCheck } from "lucide-react";
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

// Hook
import { useRegistrationForm } from '@/hooks/useRegistrationForm';

// Components
import TournamentHeader from '@/components/register/TournamentHeader';
import FormatSelection from '@/components/register/FormatSelection';
import TeamInformation from '@/components/register/TeamInformation';
import PlayerFormFields from '@/components/register/PlayerFormFields';
import PayoutQRUpload from '@/components/register/PayoutQRUpload';

export default function RegistrationForm() {
  const {
    tournamentId,
    isEdit,
    tournament,
    fetchingTournament,
    matchType,
    teamName,
    setTeamName,
    whatsapp,
    setWhatsapp,
    players,
    qrFile,
    setQrFile,
    existingQrUrl,
    isPaid,
    rejectionTargets,
    rejectionIndices,
    savedQrUrl,
    savedScreenshotUrl,
    isSubmitted,
    loading,
    status,
    handleMatchTypeChange,
    updatePlayer,
    getEntryFee,
    handleSubmit,
    router
  } = useRegistrationForm();

  if (fetchingTournament) return <div className="text-center py-24 text-slate-500 font-bold">Checking tournament status...</div>;

  if (tournament && tournament.status !== 'Open') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <Info className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Registration Closed</h2>
          <p className="text-slate-500 mb-6 text-sm">Applications for this tournament are currently closed or have been recently completed.</p>
          <button onClick={() => router.push('/')} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Back to Home</button>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <LogIn className="w-12 h-12 text-neon-purple mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Login Required</h2>
          <p className="text-slate-500 mb-6 text-sm">You need to sign in with Google before registering.</p>
          <button onClick={() => signIn('google', { callbackUrl: `/register?tournament=${tournamentId}` })}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-md">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase mb-2 text-foreground">Registered!</h2>
          <p className="text-slate-500 text-sm mb-6">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      {loading && (
        <div className="fixed inset-0 z-[200] bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-google-blue rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Securing your slot...</p>
        </div>
      )}

      <TournamentHeader tournament={tournament} entryFee={getEntryFee()} />

      <form onSubmit={handleSubmit} className="space-y-12">
        {isPaid && (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-google-green flex items-center justify-center text-white"><ShieldCheck className="w-5 h-5" /></div>
            <div>
                <p className="text-[10px] font-bold uppercase text-google-green tracking-wider">Payment Confirmed</p>
                <p className="text-xs text-slate-500 font-medium">Your registration is already partially or fully secured.</p>
            </div>
          </div>
        )}

        <FormatSelection 
          allowedMatchTypes={tournament?.allowedMatchTypes} 
          matchType={matchType} 
          isEdit={isEdit} 
          onMatchTypeChange={handleMatchTypeChange} 
        />

        <TeamInformation 
          teamName={teamName} 
          setTeamName={setTeamName} 
          whatsapp={whatsapp} 
          setWhatsapp={setWhatsapp} 
        />

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-4 bg-google-yellow rounded-full" />
             <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Squad Members</h4>
          </div>
          {players.map((player, idx) => (
            <PlayerFormFields 
              key={idx}
              player={player} 
              idx={idx} 
              isEdit={isEdit} 
              rejectionTargets={rejectionTargets} 
              rejectionIndices={rejectionIndices} 
              onUpdate={updatePlayer}
              savedScreenshotUrl={idx === 0 ? savedScreenshotUrl : ''}
            />
          ))}
        </div>

        <PayoutQRUpload 
          qrFile={qrFile} 
          setQrFile={setQrFile} 
          existingQrUrl={existingQrUrl} 
          isEdit={isEdit} 
          rejectionTargets={rejectionTargets}
          savedQrUrl={savedQrUrl}
        />

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
           <button 
             type="submit" 
             disabled={loading}
             className={cn(
               "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg",
               loading 
                 ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                 : "bg-google-blue text-white hover:bg-blue-600 shadow-blue-500/20 hover:shadow-blue-500/40"
             )}
           >
             {loading ? 'Processing...' : (isEdit ? 'Update Details' : `Finish Registration · ₹${getEntryFee()}`)}
           </button>
           <p className="text-center text-[10px] text-slate-400 mt-4 font-medium px-8 leading-relaxed">
             By clicking "Finish Registration", you agree to the tournament rules and fair play policy. All entry fees are non-refundable.
           </p>
        </div>
      </form>
    </div>
  );
}
