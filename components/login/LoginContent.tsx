'use client';

import Image from 'next/image';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Form Subcomponents & Hooks
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/login/SignupForm';
import OTPForm from '@/components/login/OTPForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';
import { useGoogleGsi } from '@/hooks/useGoogleGsi';

type AuthMode = 'login' | 'signup' | 'otp-signup' | 'forgot-init';

export default function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-detect and render Google Identity Services
  useGoogleGsi({ callbackUrl, mode, setSuccessMessage, loginHintEmail: email });

  const handleSignupInitSuccess = (registeredEmail: string) => {
    setEmail(registeredEmail);
    setSuccessMessage('OTP code sent to verify your email!');
    setMode('otp-signup');
  };

  const handleSuccessNotification = (msg: string) => {
    setSuccessMessage(msg);
  };

  return (
    <main className="min-h-screen min-h-[100dvh] bg-white dark:bg-slate-955 bg-dot-grid flex items-center justify-center px-3 font-gaming relative py-4 xs:py-6 sm:py-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[260px] xs:w-[320px] h-[260px] xs:h-[320px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-sm relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 xs:p-5 sm:p-7 shadow-xl text-center relative overflow-hidden">
          {/* Back button */}
          <Link 
            href="/" 
            className="absolute left-3 top-3 w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-955 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3 h-3" />
          </Link>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          
          <div className="relative mb-2 pt-1">
             <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800 mx-auto">
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg" />
             </div>
          </div>

          <h1 className="text-base xs:text-lg font-extrabold tracking-tight mb-0.5 text-slate-900 dark:text-white leading-none">
            {mode === 'login' && <span>Welcome to <span className="text-google-blue font-black">BGL Esports</span></span>}
            {mode === 'signup' && <span>Create <span className="text-google-blue font-black">Account</span></span>}
            {mode === 'otp-signup' && <span>Email <span className="text-google-blue font-black">Verification</span></span>}
            {mode === 'forgot-init' && <span>Reset <span className="text-google-blue font-black">Password</span></span>}
          </h1>
          
          <p className="text-slate-400 mb-3 xs:mb-4 text-[8px] xs:text-[9px] font-bold uppercase tracking-widest">
            {mode === 'login' && 'India\'s #1 Gaming League'}
            {mode === 'signup' && 'Register your details to join BGL'}
            {mode === 'otp-signup' && 'Verify your account authorization'}
            {mode === 'forgot-init' && 'Recover your credentials securely'}
          </p>

          {successMessage && (
            <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-xl text-left flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-google-green shrink-0 mt-0.5" />
              <span className="text-[10px] font-bold text-google-green leading-tight">{successMessage}</span>
            </div>
          )}

          <div>
            {mode === 'login' && (
              <LoginForm 
                email={email}
                setEmail={setEmail}
                callbackUrl={callbackUrl} 
                onSwitchMode={setMode} 
                onSuccess={() => setSuccessMessage('')} 
              />
            )}
            {mode === 'signup' && (
              <SignupForm 
                email={email}
                setEmail={setEmail}
                callbackUrl={callbackUrl} 
                onSwitchMode={setMode} 
                onSignupInitSuccess={handleSignupInitSuccess} 
              />
            )}
            {mode === 'otp-signup' && (
              <OTPForm 
                email={email} 
                onSwitchMode={setMode} 
                onVerificationSuccess={handleSuccessNotification} 
              />
            )}
            {mode === 'forgot-init' && (
              <ForgotPasswordForm 
                email={email}
                setEmail={setEmail}
                onSwitchMode={setMode} 
                onResetSuccess={handleSuccessNotification} 
              />
            )}
          </div>

          {/* Terms Agreement */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-3">
               <p className="text-[8px] xs:text-[9px] text-slate-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                 By signing in, you agree to our 
                 <Link href="/rules" className="text-google-blue font-bold px-1 hover:underline">Fair Play Policy</Link> 
                 and 
                 <Link href="/terms" className="text-google-blue font-bold px-1 hover:underline">Tournament Terms</Link>.
               </p>
            </div>
          )}
        </div>
        
        <p className="mt-4 text-center text-[8px] xs:text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           Bharat Gaming League &bull; India's #1 League
        </p>
      </div>
    </main>
  );
}
