'use client';

import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { Chrome, ShieldAlert, ShieldCheck, Sparkles, Mail, Lock, Facebook } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const isBanned = error === 'BAN_ACTIVE' || error === 'Callback';
  const [oneTapReady, setOneTapReady] = useState(false);

  useEffect(() => {
    // Initialize Google One Tap specifically for the Login Page
    const initOneTap = () => {
      if (window.google?.accounts?.id && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        setOneTapReady(true);
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            signIn('google', { 
              callbackUrl: '/',
              credential: response.credential 
            });
          },
          itp_support: true,
          cancel_on_tap_outside: false
        });
        
        // window.google.accounts.id.prompt() has been removed to stop automatic popups
      }
    };

    const timer = setTimeout(initOneTap, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 font-gaming">
      <div className="w-full max-w-sm">
        
        {/* Elite Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl text-center relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-google-blue/10 blur-2xl rounded-full" />
          
          <div className="relative mb-8 pt-4">
             <div className="relative w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-800 mx-auto">
                <Image src="/logo.png" alt="Logo" width={54} height={54} className="rounded-xl" />
             </div>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-slate-900 dark:text-white leading-none">
            Welcome to <span className="text-google-blue">BharatGaming</span>
          </h1>
          <p className="text-slate-400 mb-10 text-[10px] font-bold uppercase tracking-widest">
            India's Most Trusted League
          </p>

          {isBanned && (
            <div className="mb-10 p-5 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-google-red mx-auto mb-3" />
              <h3 className="text-xs font-black uppercase text-google-red mb-1">Access Suspended</h3>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Your account is currently restricted. Please contact <span className="text-slate-900 dark:text-white">Support</span> to resolve this.
              </p>
            </div>
          )}

          <div className="space-y-4">
             {/* The Button now looks like a 'Continue as' prompt */}
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="group w-full flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-md active:scale-95 text-left"
              >
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                     <img 
                       src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                       alt="Google" 
                       className="w-5 h-5 group-hover:scale-110 transition-transform" 
                     />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider">Continue with Google</span>
                      <span className="text-[9px] text-slate-400 font-medium">Auto-detecting account...</span>
                   </div>
                </div>
                <Mail className="w-4 h-4 text-slate-300 group-hover:text-google-blue transition-colors" />
              </button>

              <button
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                className="group w-full flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-md active:scale-95 text-left"
              >
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                     <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider">Continue with Facebook</span>
                      <span className="text-[9px] text-slate-400 font-medium">Secure login via Facebook</span>
                   </div>
                </div>
                <Facebook className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </button>

             {/* Terms Agreement - WITH ACTIVE LINKS */}
             <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                  By signing in, you agree to our 
                  <Link href="/rules" className="text-google-blue font-bold px-1 hover:underline">Fair Play Policy</Link> 
                  and 
                  <Link href="/terms" className="text-google-blue font-bold px-1 hover:underline">Tournament Terms</Link>.
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                   <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">Privacy Policy</Link>
                   <span className="w-1 h-1 rounded-full bg-slate-200" />
                   <Link href="/support" className="text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">Help Center</Link>
                </div>
             </div>
          </div>

          {/* Secure Footer */}
          <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
             <div className="flex flex-col items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-google-green" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Encrypted</span>
             </div>
             <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700" />
             <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-google-green" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Verified</span>
             </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Bharat Gaming League &bull; India's #1 League
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
