'use client';

import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WithdrawalContent from "@/components/withdrawal/WithdrawalContent";
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSession, signIn } from 'next-auth/react';
import { LogIn, Loader } from 'lucide-react';

function WithdrawalPageContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader className="w-8 h-8 animate-spin text-google-blue" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-24 max-w-lg mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-md">
          <LogIn className="w-12 h-12 text-google-blue mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-slate-500 mb-6 text-sm">Please sign in to view your withdrawal dashboard and financial records.</p>
          <button onClick={() => signIn('google', { callbackUrl: '/withdrawal' })}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <WithdrawalContent />;
}

export default function WithdrawalPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-950 bg-dot-grid relative overflow-x-hidden">
      <Navbar />

      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <header className="mb-10 text-center md:text-left max-w-4xl mx-auto px-1 sm:px-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            💼 Financial Ledger
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
            Withdrawal <span className="text-google-blue">Portal</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">
            Track entry fee spending, prize earnings, and manage your linked payment QR code for disbursements.
          </p>
        </header>

        <ErrorBoundary fallbackTitle="Ledger Error">
          <Suspense fallback={
            <div className="text-center py-24 text-slate-500 font-bold animate-pulse uppercase tracking-wider text-xs">
              Loading Ledger...
            </div>
          }>
            <WithdrawalPageContent />
          </Suspense>
        </ErrorBoundary>
      </div>

      <Footer />
    </main>
  );
}
