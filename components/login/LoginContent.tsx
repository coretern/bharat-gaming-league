'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

// Form Subcomponents & Hooks
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/login/SignupForm';
import OTPForm from '@/components/login/OTPForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';
import { useGoogleGsi } from '@/hooks/useGoogleGsi';

type AuthMode = 'login' | 'signup' | 'otp-signup' | 'forgot-init';

export default function LoginContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [mode, setMode] = useState<AuthMode>(pathname === '/signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode state with route pathname when navigating back/forward
  useEffect(() => {
    if (pathname === '/signup') {
      setMode('signup');
    } else if (pathname === '/login') {
      setMode('login');
    }
  }, [pathname]);

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    if (newMode === 'signup') {
      window.history.pushState(null, '', '/signup' + window.location.search);
    } else if (newMode === 'login') {
      window.history.pushState(null, '', '/login' + window.location.search);
    }
  };

  // Auto-detect and render Google Identity Services
  useGoogleGsi({ callbackUrl, mode, setSuccessMessage, loginHintEmail: email });

  const handleSignupInitSuccess = (registeredEmail: string) => {
    setEmail(registeredEmail);
    setSuccessMessage('OTP code sent to verify your email!');
    handleSwitchMode('otp-signup');
  };

  const handleSuccessNotification = (msg: string) => {
    setSuccessMessage(msg);
  };

  return (
    <main className="min-h-screen min-h-[100dvh] bg-white dark:bg-slate-955 bg-dot-grid flex items-center justify-center px-3 font-gaming relative py-4 xs:py-6 sm:py-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[260px] xs:w-[320px] h-[260px] xs:h-[320px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[320px] xs:max-w-[360px] sm:max-w-sm relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 xs:p-5 sm:p-7 shadow-xl text-center relative overflow-hidden">

          
          <div className="relative mb-2 pt-1">
             <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800 mx-auto">
                <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg" />
             </div>
          </div>

          <h1 className="text-lg xs:text-xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white leading-none">
            {mode === 'login' && <span>Welcome to BGL Esports</span>}
            {mode === 'signup' && <span>Create Account</span>}
            {mode === 'otp-signup' && <span>Email Verification</span>}
            {mode === 'forgot-init' && <span>Reset Password</span>}
          </h1>
          
          {mode !== 'login' && (
            <p className="text-slate-500 dark:text-slate-400 mb-5 text-xs font-normal">
              {mode === 'signup' && 'Register your details to join BGL'}
              {mode === 'otp-signup' && 'Verify your account authorization'}
              {mode === 'forgot-init' && 'Recover your password'}
            </p>
          )}

          {successMessage && (
            <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-xl text-left flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-google-green shrink-0 mt-0.5" />
              <span className="text-xs text-google-green leading-tight">{successMessage}</span>
            </div>
          )}

          <div>
            {mode === 'login' && (
              <LoginForm 
                email={email}
                setEmail={setEmail}
                callbackUrl={callbackUrl} 
                onSwitchMode={handleSwitchMode} 
                onSuccess={() => setSuccessMessage('')} 
              />
            )}
            {mode === 'signup' && (
              <SignupForm 
                email={email}
                setEmail={setEmail}
                callbackUrl={callbackUrl} 
                onSwitchMode={handleSwitchMode} 
                onSignupInitSuccess={handleSignupInitSuccess} 
              />
            )}
            {mode === 'otp-signup' && (
              <OTPForm 
                email={email} 
                onSwitchMode={handleSwitchMode} 
                onVerificationSuccess={handleSuccessNotification} 
              />
            )}
            {mode === 'forgot-init' && (
              <ForgotPasswordForm 
                email={email}
                setEmail={setEmail}
                onSwitchMode={handleSwitchMode} 
                onResetSuccess={handleSuccessNotification} 
              />
            )}
          </div>

          {/* Terms Agreement */}
          {mode === 'login' && (
            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/50 mt-4">
               <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-[260px] mx-auto opacity-65">
                 By signing in, you agree to our 
                 <Link href="/rules" className="text-google-blue font-medium px-1 hover:underline">Fair Play Policy</Link> 
                 and 
                 <Link href="/terms" className="text-google-blue font-medium px-1 hover:underline">Tournament Terms</Link>.
               </p>
            </div>
          )}
        </div>
        

      </div>
    </main>
  );
}
