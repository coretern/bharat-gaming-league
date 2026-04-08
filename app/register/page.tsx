'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CheckCircle2, ShieldCheck, Info, Trophy } from "lucide-react";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function RegistrationForm() {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('tournament');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      toast.success('Registration submitted successfully!');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-2xl mx-auto border-neon-cyan/30"
      >
        <div className="w-24 h-24 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-neon-cyan" />
        </div>
        <h2 className="text-4xl font-black uppercase italic mb-4">Registration Received!</h2>
        <p className="text-slate-400 text-lg mb-8">
          Your team registration for the tournament has been submitted. Our team will verify your payment and details within 24 hours.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="btn-outline px-12 uppercase italic font-black"
        >
          Register Another Team
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-12 items-start">
      <div className="lg:col-span-3">
        <div className="glass-card p-8 md:p-12 border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Team Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Mortal Soul" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Team Leader UID</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 5123456789" 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number</label>
              <input 
                required
                type="tel" 
                placeholder="+91 00000 00000" 
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-white focus:outline-none focus:border-neon-purple/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Payment Screenshot</label>
              <div className="relative group">
                <input 
                  required
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-neon-cyan/50 transition-all bg-white/2">
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-neon-cyan transition-colors" />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-neon-cyan">Click to upload JPG/PNG</span>
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full h-16 btn-neon-purple text-xl italic uppercase tracking-tighter disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? 'Processing...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="glass-card p-8 border-neon-cyan/20">
          <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3">
            <Info className="w-6 h-6 text-neon-cyan" />
            Registration Rules
          </h3>
          <ul className="space-y-4 text-slate-400 font-medium">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 shrink-0"></div>
              <span>Ensure all player UIDs are correct for rewards distribution.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 shrink-0"></div>
              <span>Payment screenshots must clearly show the Transaction ID.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 shrink-0"></div>
              <span>No team name changes are allowed after registration.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 shrink-0"></div>
              <span>Join our official Discord for lobby details.</span>
            </li>
          </ul>
        </div>

        <div className="glass-card p-8 bg-gradient-to-br from-neon-purple/10 to-transparent">
          <Trophy className="w-12 h-12 text-neon-purple mb-4" />
          <h3 className="text-xl font-black uppercase italic mb-2">Tournament ID: {tournamentId || 'General'}</h3>
          <p className="text-slate-400 font-medium">By registering, you agree to follow the fair play policy and tournament regulations.</p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <Navbar />
      
      <div className="container mx-auto px-6">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
            Team <span className="text-neon-purple">Registration</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Secure your spot in the arena. Fill in your details and upload the payment proof to join.
          </p>
        </header>

        <Suspense fallback={<div className="text-center py-24 text-white uppercase font-black tracking-[0.3em]">Loading Arena...</div>}>
          <RegistrationForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
