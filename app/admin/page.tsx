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
import RegistrationsTab from '@/components/admin/Tabs/RegistrationsTab';
import TournamentsTab from '@/components/admin/Tabs/TournamentsTab';
import WinnersTab from '@/components/admin/Tabs/WinnersTab';
import UserTable from '@/components/admin/Users/UserTable';

// Modals
import RegistrationDetailsModal from '@/components/admin/Registrations/RegistrationDetailsModal';
import RejectionModal from '@/components/admin/Registrations/RejectionModal';
import TournamentEditorModal from '@/components/admin/Tournaments/TournamentEditorModal';
import TournamentCreateModal from '@/components/admin/Tournaments/TournamentCreateModal';
import WinnerAddModal from '@/components/admin/Winners/WinnerAddModal';
import ScreenshotModal from '@/components/admin/Shared/ScreenshotModal';

export default function AdminPanel() {
  const {
    session,
    status,
    activeTab,
    setActiveTab,
    registrations,
    regFilter,
    setRegFilter,
    siteUsers,
    liveTournaments,
    winners,
    loading,
    loadingUsers,
    loadingTours,
    loadingWinners,
    previewImg,
    setPreviewImg,
    rejectingId,
    setRejectingId,
    rejectionOptions,
    setRejectionOptions,
    viewReg,
    setViewReg,
    editTour,
    setEditTour,
    updating,
    confirmDelete,
    setConfirmDelete,
    showCreateTour,
    setShowCreateTour,
    newTour,
    setNewTour,
    showAddWinner,
    setShowAddWinner,
    newWinner,
    setNewWinner,
    regSearch,
    setRegSearch,
    regTourFilter,
    setRegTourFilter,
    tourSearch,
    setTourSearch,
    tourGameFilter,
    setTourGameFilter,
    tourStatusFilter,
    setTourStatusFilter,
    isAdmin,
    fetchUsers,
    handleUpdateStatus,
    handleDeleteRegistration,
    handleToggleBan,
    handleDeleteUser,
    handleSaveTournament,
    handleCreateTournament,
    handleAddWinner,
    handleDeleteWinner
  } = useAdminLogic();

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
          registrations={registrations} 
          siteUsers={siteUsers} 
          liveTournaments={liveTournaments} 
          winners={winners} 
        />

        <div className="grid lg:grid-cols-4 gap-8">
          <AdminSidebar 
            user={session.user || {}} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'Registrations' && (
              <RegistrationsTab 
                registrations={registrations}
                loading={loading}
                regFilter={regFilter}
                setRegFilter={setRegFilter}
                regSearch={regSearch}
                setRegSearch={setRegSearch}
                regTourFilter={regTourFilter}
                setRegTourFilter={setRegTourFilter}
                setViewReg={setViewReg}
                handleDeleteRegistration={handleDeleteRegistration}
              />
            )}

            {activeTab === 'Users' && (
              <UserTable 
                users={siteUsers} 
                loading={loadingUsers} 
                updating={updating} 
                adminEmail={session.user?.email || undefined} 
                confirmDelete={confirmDelete} 
                onRefresh={fetchUsers} 
                onToggleBan={handleToggleBan} 
                onDeleteRequest={(email) => setConfirmDelete({ email, stage: 1 })} 
                onDeleteCancel={() => setConfirmDelete(null)} 
                onDeleteConfirm={(email, stage) => {
                  if (stage === 1) setConfirmDelete({ email, stage: 2 });
                  else handleDeleteUser(email);
                }} 
              />
            )}

            {activeTab === 'Tournaments' && (
              <TournamentsTab 
                liveTournaments={liveTournaments}
                loadingTours={loadingTours}
                tourSearch={tourSearch}
                setTourSearch={setTourSearch}
                tourGameFilter={tourGameFilter}
                setTourGameFilter={setTourGameFilter}
                tourStatusFilter={tourStatusFilter}
                setTourStatusFilter={setTourStatusFilter}
                setShowCreateTour={setShowCreateTour}
                setEditTour={setEditTour}
              />
            )}

            {activeTab === 'Winners' && (
              <WinnersTab 
                winners={winners}
                loadingWinners={loadingWinners}
                setShowAddWinner={setShowAddWinner}
                handleDeleteWinner={handleDeleteWinner}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {previewImg && <ScreenshotModal url={previewImg} onClose={() => setPreviewImg(null)} />}
      
      {editTour && (
        <TournamentEditorModal 
          editTour={editTour} 
          setEditTour={setEditTour} 
          updating={updating} 
          onClose={() => setEditTour(null)} 
          onSave={handleSaveTournament} 
        />
      )}

      {showCreateTour && (
        <TournamentCreateModal 
          newTour={newTour} 
          setNewTour={setNewTour} 
          updating={updating} 
          onClose={() => setShowCreateTour(false)} 
          onSubmit={handleCreateTournament} 
        />
      )}

      {showAddWinner && (
        <WinnerAddModal 
          newWinner={newWinner} 
          setNewWinner={setNewWinner} 
          liveTournaments={liveTournaments} 
          updating={updating} 
          onClose={() => setShowAddWinner(false)} 
          onSubmit={handleAddWinner} 
        />
      )}

      {viewReg && (
          <RegistrationDetailsModal 
            viewReg={viewReg} 
            updating={updating} 
            onClose={() => setViewReg(null)} 
            onDelete={handleDeleteRegistration} 
            onApprove={(id) => handleUpdateStatus(id, { status: 'Approved' })} 
            onRejectRequest={(id) => {
              setRejectingId(id);
              setRejectionOptions({ qr: false, profiles: false, playerIndices: [], msg: "" });
            }} 
            onPreviewImage={setPreviewImg} 
          />
      )}

      {rejectingId && viewReg && (
          <RejectionModal 
            viewReg={viewReg} 
            rejectionOptions={rejectionOptions} 
            setRejectionOptions={setRejectionOptions} 
            onCancel={() => setRejectingId(null)} 
            onConfirm={(finalMsg, targets) => handleUpdateStatus(rejectingId, { status: 'Rejected', rejectionReason: finalMsg, rejectionTargets: targets, rejectionIndices: rejectionOptions.playerIndices, previousRejectionReason: viewReg.rejectionReason })} 
          />
      )}
      
      <Footer />
    </main>
  );
}
