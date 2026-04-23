'use client';

import { Suspense, useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Trophy } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Hooks
import { useDashboardData } from '@/hooks/useDashboardData';
import { useProfile } from '@/hooks/useProfile';

// Components
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileDashboardHeader from '@/components/dashboard/MobileDashboardHeader';
import ProfileTab from '@/components/dashboard/ProfileTab';
import RegistrationsTab from '@/components/dashboard/RegistrationsTab';

const navItems = [
  { name: 'Profile', icon: User },
  { name: 'My Registrations', icon: Trophy },
];

function DashboardContent() {
  const { session, status, activeTab, setActiveTab, myRegs, loadingRegs, isImpersonating, viewEmail } = useDashboardData();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || status === 'loading') return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-slate-500 uppercase italic animate-pulse">Checking Profile...</div>;
  if (!session) return null;

  // Merge session user with profile name so sidebar updates when name is edited
  const mergedUser = {
    ...session.user,
    name: profile.name || session.user?.name || '',
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      {isImpersonating && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-google-yellow flex items-center justify-center text-white shadow-lg">
               <User className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-black text-google-yellow uppercase tracking-widest leading-none mb-1">Administrative View</p>
               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">You are viewing the account of: <span className="text-google-blue">{viewEmail}</span></p>
             </div>
           </div>
        </div>
      )}

      <MobileDashboardHeader 
        user={mergedUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems} 
      />

      <div className="grid lg:grid-cols-4 gap-8">
        <DashboardSidebar 
          user={mergedUser} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navItems={navItems} 
        />

        <div className="lg:col-span-3 space-y-5">
          {activeTab === 'Profile' && <ProfileTab user={mergedUser} />}
          {activeTab === 'My Registrations' && <RegistrationsTab myRegs={myRegs} loadingRegs={loadingRegs} />}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen pt-24 pb-24 bg-background">
      <Navbar />
      <ErrorBoundary fallbackTitle="Dashboard Error">
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-slate-500 font-bold uppercase italic">Syncing Data...</div>}>
          <DashboardContent />
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </main>
  );
}
