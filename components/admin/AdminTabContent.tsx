import React from 'react';
import RegistrationsTab from '@/components/admin/Tabs/RegistrationsTab';
import TournamentsTab from '@/components/admin/Tabs/TournamentsTab';
import WinnersTab from '@/components/admin/Tabs/WinnersTab';
import MediaTab from '@/components/admin/Tabs/MediaTab';
import SchedulesTab from '@/components/admin/Tabs/SchedulesTab';
import LogsTab from '@/components/admin/Tabs/LogsTab';
import UserTable from '@/components/admin/Users/UserTable';

interface AdminTabContentProps {
  adminState: any;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  session: any;
}

export default function AdminTabContent({ adminState, activeTab, setActiveTab, session }: AdminTabContentProps) {
  // 2-stage native browser confirm dialogs for deleting users
  const handleDeleteWithConfirm = (email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      if (window.confirm(`⚠ FINAL WARNING: This will permanently delete user ${email} and all associated data.\nThis action CANNOT be undone. Are you absolutely sure?`)) {
        adminState.handleDeleteUser(email);
      }
    }
  };

  // 2-stage native browser confirm dialogs for banning/unbanning users
  const handleToggleBanWithConfirm = (email: string, currentStatus: boolean) => {
    const action = currentStatus ? 'unban' : 'ban';
    const warning = currentStatus
      ? 'This will restore the user\'s access to all platform features and tournaments.'
      : '⚠ WARNING: This will immediately restrict this user from registering or participating in any tournaments.';

    if (window.confirm(`Are you sure you want to ${action} user ${email}?`)) {
      if (window.confirm(`⚠ FINAL WARNING: ${warning}\nAre you absolutely sure you want to proceed?`)) {
        adminState.handleToggleBan(email, currentStatus);
      }
    }
  };

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
          onRefresh={adminState.fetchUsers}
          onToggleBan={handleToggleBanWithConfirm}
          onDelete={handleDeleteWithConfirm}
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
