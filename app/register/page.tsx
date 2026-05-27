'use client';

import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from '@/components/register/RegistrationForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-950 bg-dot-grid relative">
      <Navbar />

      {/* Background glow orb */}
      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <header className="mb-10 text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            📝 Secure Entry
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
            Team <span className="text-google-blue">Registration</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg">
            Secure your slot in the upcoming tournament. Fill in your details and provide your payout QR for winnings.
          </p>
        </header>

        <Suspense fallback={
          <div className="text-center py-24 text-slate-500 font-bold animate-pulse uppercase tracking-wider text-xs">
            Initializing Portal...
          </div>
        }>
          <RegistrationForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
