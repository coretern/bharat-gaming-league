'use client';

import { Suspense } from 'react';
import LoginContent from '@/components/login/LoginContent';

export default function SignupPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-500 font-bold uppercase tracking-wider text-xs animate-pulse">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
