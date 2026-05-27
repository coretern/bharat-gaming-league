'use client';

import { signIn } from 'next-auth/react';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialLoginsProps {
  callbackUrl: string;
  email?: string;
}

export default function SocialLogins({ callbackUrl, email }: SocialLoginsProps) {
  const [gsiLoaded, setGsiLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      setGsiLoaded(true);
    } else {
      const interval = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          setGsiLoaded(true);
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="space-y-3 w-full">
      {/* Target container for Google Identity Services GSI button */}
      <div 
        id="google-signin-btn" 
        className="w-full flex justify-center"
      />

      {/* Fallback Google button if GSI is not loaded */}
      {!gsiLoaded && (
        <button
          onClick={() => signIn('google', { callbackUrl }, email ? { login_hint: email } : undefined)}
          className="group w-full flex items-center justify-between px-5 h-11 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm text-left"
        >
          <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
               <img 
                 src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                 alt="Google" 
                 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" 
               />
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-200">Continue with Google</span>
                <span className="text-[7px] text-slate-400 font-medium">Safe & direct login</span>
             </div>
          </div>
          <Mail className="w-3 h-3 text-slate-350 group-hover:text-google-blue transition-colors" />
        </button>
      )}
    </div>
  );
}
