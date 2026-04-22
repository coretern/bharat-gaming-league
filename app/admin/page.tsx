'use client';

import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users } from "lucide-react";

// Hook
import { useAdminLogic } from '@/hooks/useAdminLogic';

// Components
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminStats from '@/components/admin/AdminStats';
import AdminModals from '@/components/admin/AdminModals';
import RegistrationsTab from '@/components/admin/Tabs/RegistrationsTab';
import TournamentsTab from '@/components/admin/Tabs/TournamentsTab';
import WinnersTab from '@/components/admin/Tabs/WinnersTab';
import MediaTab from '@/components/admin/Tabs/MediaTab';
import SchedulesTab from '@/components/admin/Tabs/SchedulesTab';
import LogsTab from '@/components/admin/Tabs/LogsTab';
import UserTable from '@/components/admin/Users/UserTable';

export default function AdminPanel() {
  const adminState = useAdminLogic();
  const { session, status, activeTab, setActiveTab, isAdmin } = adminState;

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center font-black italic uppercase text-lg animate-pulse">Checking credentials...</div>;
  
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 shadow-xl"><Users className="w-10 h-10" /></div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Admin Access Needed</h1>
        <p className="max-w-md text-slate-500 font-medium">This zone is restricted to authorized personnel only. Please sign in with an administrator account.</p>
        <button onClick={() => signIn('google')} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Sign In As Admin</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black pb-24 font-sans text-slate-900 dark:text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32">
        <AdminStats 
          registrations={adminState.registrations} 
          siteUsers={adminState.siteUsers} 
          liveTournaments={adminState.liveTournaments} 
          winners={adminState.winners} 
        />

        <div className="grid lg:grid-cols-4 gap-8">
          <AdminSidebar 
            user={session.user || {}} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onTabClick={(tab) => {
              if (tab === 'Users') adminState.fetchUsers();
              if (tab === 'Registrations') adminState.fetchRegistrations();
              if (tab === 'Tournaments') adminState.fetchTournaments();
              if (tab === 'Winners') adminState.loadWinnersData();
            }}
          />

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'Registrations' && (
              <RegistrationsTab 
                registrations={adminState.registrations}
                loading={adminState.loading}
                regFilter={adminState.regFilter}
                setRegFilter={adminState.setRegFilter}
                regSearch={adminState.regSearch}
                setRegSearch={adminState.setRegSearch}
                regTourFilter={adminState.regTourFilter}
                setRegTourFilter={adminState.setRegTourFilter}
                regGameFilter={adminState.regGameFilter}
                setRegGameFilter={adminState.setRegGameFilter}
                regGroupFilter={adminState.regGroupFilter}
                setRegGroupFilter={adminState.setRegGroupFilter}
                regMatchTypeFilter={adminState.regMatchTypeFilter}
                setRegMatchTypeFilter={adminState.setRegMatchTypeFilter}
                setViewReg={adminState.setViewReg}
                handleDeleteRegistration={adminState.handleDeleteRegistration}
                onSync={adminState.onSyncGroups}
                onRefresh={adminState.fetchRegistrations}
                loadingRegs={adminState.loading}
                liveTournaments={adminState.liveTournaments}
                setActiveTab={setActiveTab}
              />
            )}
            
            {activeTab === 'Schedules' && (
              <SchedulesTab 
                registrations={adminState.registrations}
                loading={adminState.loading}
                setViewReg={adminState.setViewReg}
              />
            )}

            {activeTab === 'Users' && (
              <UserTable 
                users={adminState.siteUsers} 
                loading={adminState.loadingUsers} 
                updating={adminState.updating} 
                adminEmail={session.user?.email || undefined} 
                confirmDelete={adminState.confirmDelete} 
                onRefresh={adminState.fetchUsers} 
                onToggleBan={adminState.handleToggleBan} 
                onDeleteRequest={(email) => adminState.setConfirmDelete({ email, stage: 1 })} 
                onDeleteCancel={() => adminState.setConfirmDelete(null)} 
                onDeleteConfirm={(email, stage) => {
                  if (stage === 1) adminState.setConfirmDelete({ email, stage: 2 });
                  else adminState.handleDeleteUser(email);
                }} 
              />
            )}

            {activeTab === 'Tournaments' && (
              <TournamentsTab 
                liveTournaments={adminState.liveTournaments}
                loadingTours={adminState.loadingTours}
                tourSearch={adminState.tourSearch}
                setTourSearch={adminState.setTourSearch}
                tourGameFilter={adminState.tourGameFilter}
                setTourGameFilter={adminState.setTourGameFilter}
                tourStatusFilter={adminState.tourStatusFilter}
                setTourStatusFilter={adminState.setTourStatusFilter}
                setShowCreateTour={adminState.setShowCreateTour}
                setEditTour={adminState.setEditTour}
                onDeleteTournament={adminState.handleDeleteTournament}
              />
            )}

            {activeTab === 'Winners' && (
              <WinnersTab 
                winners={adminState.winners}
                loadingWinners={adminState.loadingWinners}
                setShowAddWinner={adminState.setShowAddWinner}
                handleDeleteWinner={adminState.handleDeleteWinner}
              />
            )}

            {activeTab === 'Media' && (
              <MediaTab 
                mediaList={adminState.mediaList}
                mediaSearch={adminState.mediaSearch}
                setMediaSearch={adminState.setMediaSearch}
                mediaTypeFilter={adminState.mediaTypeFilter}
                setMediaTypeFilter={adminState.setMediaTypeFilter}
                setPreviewImg={adminState.setPreviewImg}
                onDeleteMedia={adminState.handleDeleteMedia}
              />
            )}

            {activeTab === 'Logs' && <LogsTab />}
          </div>
        </div>
      </div>

      <AdminModals 
        {...adminState} 
        handleSaveTournament={adminState.handleSaveTournament} 
        handleCreateTournament={adminState.handleCreateTournament} 
        handleAddWinner={adminState.handleAddWinner} 
      />
      
      <Footer />
    </main>
  );
}
