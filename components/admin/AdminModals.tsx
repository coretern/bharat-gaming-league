import React from 'react';
import ScreenshotModal from './Shared/ScreenshotModal';
import TournamentEditorModal from './Tournaments/TournamentEditorModal';
import TournamentCreateModal from './Tournaments/TournamentCreateModal';
import WinnerAddModal from './Winners/WinnerAddModal';
import RegistrationDetailsModal from './Registrations/RegistrationDetailsModal';
import RejectionModal from './Registrations/RejectionModal';
import { Reg, Tournament } from '../types/admin';

interface AdminModalsProps {
  previewImg: string | null;
  setPreviewImg: (url: string | null) => void;
  editTour: Tournament | null;
  setEditTour: (tour: Tournament | null) => void;
  updating: string | null;
  handleSaveTournament: (e: React.FormEvent) => void;
  showCreateTour: boolean;
  setShowCreateTour: (show: boolean) => void;
  newTour: any;
  setNewTour: (tour: any) => void;
  handleCreateTournament: (e: React.FormEvent) => void;
  showAddWinner: boolean;
  setShowAddWinner: (show: boolean) => void;
  newWinner: any;
  setNewWinner: (winner: any) => void;
  liveTournaments: Tournament[];
  handleAddWinner: (e: React.FormEvent) => void;
  viewReg: Reg | null;
  setViewReg: (reg: Reg | null) => void;
  handleDeleteRegistration: (id: string) => void;
  handleUpdateStatus: (id: string, update: any) => void;
  rejectingId: string | null;
  setRejectingId: (id: string | null) => void;
  rejectionOptions: any;
  setRejectionOptions: (options: any) => void;
}

const AdminModals: React.FC<AdminModalsProps> = ({
  previewImg, setPreviewImg,
  editTour, setEditTour, updating, handleSaveTournament,
  showCreateTour, setShowCreateTour, newTour, setNewTour, handleCreateTournament,
  showAddWinner, setShowAddWinner, newWinner, setNewWinner, liveTournaments, handleAddWinner,
  viewReg, setViewReg, handleDeleteRegistration, handleUpdateStatus,
  rejectingId, setRejectingId, rejectionOptions, setRejectionOptions
}) => {
  return (
    <>
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
            onApprove={(id, data) => handleUpdateStatus(id, data || { status: 'Approved' })} 
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
    </>
  );
};

export default AdminModals;
