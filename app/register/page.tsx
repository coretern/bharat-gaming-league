'use client';

import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationForm from '@/components/register/RegistrationForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-6">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2 text-foreground">
            Team <span className="text-neon-purple">Registration</span>
          </h1>
          <p className="text-slate-500 text-sm font-semibold max-w-lg">Secure your slot in the upcoming tournament. Fill in your details and upload your game proof screenshots.</p>
        </header>

        <Suspense fallback={<div className="text-center py-24 text-foreground font-black uppercase italic animate-pulse">Initializing Portal...</div>}>
          <RegistrationForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
