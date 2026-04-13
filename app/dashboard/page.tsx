'use client';

import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Trophy } from 'lucide-react';

// Hook
import { useDashboardData } from '@/hooks/useDashboardData';

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
  const { session, status, activeTab, setActiveTab, myRegs, loadingRegs } = useDashboardData();

  if (status === 'loading') return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-slate-500 uppercase italic animate-pulse">Checking Profile...</div>;
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 mt-6">
      <MobileDashboardHeader 
        user={session.user || {}} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems} 
      />

      <div className="grid lg:grid-cols-4 gap-8">
        <DashboardSidebar 
          user={session.user || {}} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navItems={navItems} 
        />

        <div className="lg:col-span-3 space-y-5">
          {activeTab === 'Profile' && <ProfileTab user={session.user || {}} />}
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
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-slate-500 font-bold uppercase italic">Syncing Data...</div>}>
        <DashboardContent />
      </Suspense>
      <Footer />
    </main>
  );
}
