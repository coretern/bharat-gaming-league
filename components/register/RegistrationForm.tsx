'use client';

import React from 'react';
import { CheckCircle2, Loader, LogIn, Info, ShieldCheck } from "lucide-react";
import { signIn } from 'next-auth/react';

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
    <div className="max-w-2xl mx-auto space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-neon-purple animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-2xl">
                <Loader className="w-8 h-8 text-neon-purple animate-spin" />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <h3 className="text-xl font-black italic uppercase text-white tracking-widest animate-pulse">Processing...</h3>
            <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Uploading assets and securing your slot</p>
          </div>
        </div>
      )}

      <TournamentHeader tournament={tournament} entryFee={getEntryFee()} />

      <form onSubmit={handleSubmit} className="space-y-10">
        {isPaid && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white"><ShieldCheck className="w-6 h-6" /></div>
            <div>
                <p className="text-xs font-black uppercase text-green-500 tracking-widest">Payment Verified</p>
                <p className="text-[10px] text-green-600/70 font-bold">You have already paid. Details only update required.</p>
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
          {players.map((player, idx) => (
            <PlayerFormFields 
              key={idx}
              player={player} 
              idx={idx} 
              isEdit={isEdit} 
              rejectionTargets={rejectionTargets} 
              rejectionIndices={rejectionIndices} 
              onUpdate={updatePlayer} 
            />
          ))}
        </div>

        <PayoutQRUpload 
          qrFile={qrFile} 
          setQrFile={setQrFile} 
          existingQrUrl={existingQrUrl} 
          isEdit={isEdit} 
          rejectionTargets={rejectionTargets} 
        />

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full h-16 rounded-3xl font-black italic uppercase text-lg tracking-widest transition-all ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-neon-purple text-white shadow-xl hover:shadow-neon-purple/50 active:scale-95'
          } flex items-center justify-center gap-3`}
        >
          {loading ? <><Loader className="w-5 h-5 animate-spin" /> Processing...</> : (isEdit ? 'Update Registration' : `Confirm Registration · ₹${getEntryFee()}`)}
        </button>
      </form>
    </div>
  );
}
