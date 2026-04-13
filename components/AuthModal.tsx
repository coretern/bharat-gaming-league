'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { X, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      
      // Initialize Native Google One Tap logic
      const initOneTap = () => {
        if (window.google?.accounts?.id && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
           window.google.accounts.id.initialize({
             client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
             callback: (response: any) => {
               // On success, sign in with NextAuth
               signIn('google', { 
                 callbackUrl: '/',
                 credential: response.credential 
               });
             },
             itp_support: true,
           });
           
           // This triggers the native "Continue as [Account]" UI at the top
           window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                 console.log('One tap skipped or suppressed');
              }
           });
        }
      };

      // Wait for script to load
      const timer = setTimeout(initOneTap, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered && !isOpen) return null;

  return (
    <div 
      className={`fixed top-24 right-4 md:right-8 z-[100] w-[320px] transition-all duration-700 ease-out transform 
      ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}
    >
      {/* Container: Premium Glass-card style */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header bar with Close */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
             <Image src="/logo.png" alt="Logo" width={18} height={18} className="rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800 dark:text-white">Sign in with Google</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all active:scale-90"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center">
          
          <div className="relative mb-4">
             <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
                <img 
                  src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                  alt="Google" 
                  className="w-6 h-6" 
                />
             </div>
          </div>

          <div className="text-center mb-6">
             <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Join BharatGaming</h3>
             <p className="text-[10px] text-slate-400 font-medium px-4">Continue as a guest or sign in to save your rankings & earn rewards</p>
          </div>

          {/* Action Button: Google Styled */}
          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl transition-all shadow-sm group active:scale-[0.98]"
          >
            <img 
              src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
              alt="Google" 
              className="w-5 h-5 group-hover:scale-110 transition-transform" 
            />
            <div className="flex flex-col items-start leading-none">
               <span className="text-[11px] font-bold text-slate-700 dark:text-white mb-0.5">Continue to Platform</span>
               <span className="text-[9px] text-slate-400 font-medium tracking-tight">Access your elite dashboard</span>
            </div>
          </button>

          {/* Secure Footer */}
          <div className="mt-4 flex items-center justify-center gap-4 py-1 border-t border-slate-50 dark:border-slate-800/50 w-full pt-3">
             <div className="flex items-center gap-1 opacity-60">
                <ShieldCheck className="w-3 h-3 text-google-green" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Google Secure</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
