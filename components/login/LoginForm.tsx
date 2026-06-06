'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import SocialLogins from './SocialLogins';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  callbackUrl: string;
  onSwitchMode: (mode: 'signup' | 'forgot-init') => void;
  onSuccess: () => void;
}

export default function LoginForm({ email, setEmail, callbackUrl, onSwitchMode, onSuccess }: LoginFormProps) {
  const [localEmail, setLocalEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  // Sync localEmail with parent email changes (e.g. if loaded from parent state)
  React.useEffect(() => {
    setLocalEmail(email);
  }, [email]);

  // Debounced parent email update to prevent re-initializing GSI on every keystroke
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localEmail !== email) {
        setEmail(localEmail);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [localEmail, email, setEmail]);

  // Debounced email check to detect Google login requirement
  React.useEffect(() => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setIsGoogleAccount(false);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setIsGoogleAccount(data.exists && data.provider === 'google');
        }
      } catch (err) {
        console.error(err);
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmail(localEmail);

    if (isGoogleAccount) {
      signIn('google', { callbackUrl }, { login_hint: localEmail });
      return;
    }
    if (!localEmail || !password) return setError('Please fill in all fields');
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: localEmail,
        password,
        callbackUrl,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === 'CredentialsSignin') setError('Invalid email or password');
        else if (res.error === 'GOOGLE_LOGIN_REQUIRED') {
          setError('This account is registered using Google login. Please sign in with Google.');
          setIsGoogleAccount(true);
        } else if (res.error === 'BAN_ACTIVE') setError('Your account is banned. Please contact support.');
        else setError(res.error || 'Failed to sign in');
      } else {
        onSuccess();
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        {error && (
          <div className="p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-google-red shrink-0 mt-0.5" />
            <span className="text-xs text-google-red leading-tight">{error}</span>
          </div>
        )}

        {isGoogleAccount && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-google-blue shrink-0 mt-0.5" />
            <span className="text-xs text-google-blue leading-tight">
              This email is registered with Google. Please use the Google sign-in option below.
            </span>
          </div>
        )}

        <div className="space-y-3 pt-3">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                onBlur={() => setEmail(localEmail)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 text-sm font-medium text-slate-800 dark:text-slate-105 focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Password
              </label>
              <button
                type="button"
                onClick={() => onSwitchMode('forgot-init')}
                className="text-xs font-medium text-google-blue hover:text-blue-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 text-sm font-medium text-slate-800 dark:text-slate-105 focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-google-blue text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in...' : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
        <span className="relative px-3 bg-white dark:bg-slate-900 text-xs font-normal text-slate-500">or continue with</span>
      </div>

      <SocialLogins callbackUrl={callbackUrl} email={localEmail} />

      <div className="text-center pt-2">
        <p className="text-xs font-normal text-slate-500">
          Don't have an account? <button onClick={() => onSwitchMode('signup')} className="text-google-blue font-semibold hover:underline ml-1">Register here</button>
        </p>
      </div>
    </div>
  );
}
