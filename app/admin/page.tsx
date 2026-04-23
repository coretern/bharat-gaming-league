'use client';

import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";
import ErrorBoundary from '@/components/ErrorBoundary';

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-google-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-5 bg-slate-50 dark:bg-black">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-google-red">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Access Required</h1>
        <p className="max-w-sm text-slate-500 text-sm font-medium">
          This area is restricted to authorized administrators only.
        </p>
        <button onClick={() => signIn('google')}
          className="h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
          Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black pb-12 font-sans text-slate-900 dark:text-white">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 pt-24">
        <ErrorBoundary fallbackTitle="Admin Panel Error">
          {/* Page header */}
          <div className="mb-5">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium">Manage tournaments, registrations, and platform settings</p>
          </div>

          {/* Stats */}
          <AdminStats
            registrations={adminState.registrations}
            siteUsers={adminState.siteUsers}
            liveTournaments={adminState.liveTournaments}
            winners={adminState.winners}
          />

          {/* Main layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-5">
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

            <div className="lg:col-span-3 min-w-0">
              <AdminTabContent adminState={adminState} activeTab={activeTab} setActiveTab={setActiveTab} session={session} />
            </div>
          </div>
        </ErrorBoundary>
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

/** Tab content — extracted to keep page.tsx under 100 lines */
function AdminTabContent({ adminState, activeTab, setActiveTab, session }: any) {
  return (
    <>
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
          onDeleteRequest={(email: string) => adminState.setConfirmDelete({ email, stage: 1 })}
          onDeleteCancel={() => adminState.setConfirmDelete(null)}
          onDeleteConfirm={(email: string, stage: number) => {
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
    </>
  );
}
