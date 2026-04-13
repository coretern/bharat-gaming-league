import React from 'react';
import { X, Trash2, ExternalLink, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Reg } from '../../types/admin';

interface RegistrationDetailsModalProps {
  viewReg: Reg;
  updating: string | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onPreviewImage: (url: string) => void;
}

const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  viewReg,
  updating,
  onClose,
  onDelete,
  onApprove,
  onRejectRequest,
  onPreviewImage
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative mt-10 mb-10 overflow-hidden" onClick={e => e.stopPropagation()}>
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-foreground leading-none">Team <span className="text-neon-purple">{viewReg.teamName}</span></h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-500">{viewReg.tournamentName}</span>
              <span className="px-3 py-1 bg-neon-cyan/10 rounded-full text-[10px] font-black uppercase text-neon-cyan">{viewReg.matchType}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                viewReg.status === 'Approved' ? 'bg-green-500 text-white' :
                viewReg.status === 'Rejected' ? 'bg-red-500 text-white' :
                'bg-neon-purple text-white'
              }`}>
                {viewReg.isResubmitted && viewReg.status === 'Pending' ? 'Resubmitted' : viewReg.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onDelete(viewReg._id)}
              disabled={updating === viewReg._id}
              className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
              title="Delete Permanently"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Players Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Squad Members</h3>
            <div className="grid gap-3">
              {viewReg.players.map((p, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-foreground text-sm">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-neon-cyan font-black">{p.uid}</p>
                        {p.instagram && (
                          <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] text-neon-purple hover:underline flex items-center gap-0.5">
                            <ExternalLink className="w-2.5 h-2.5" /> Instagram
                          </a>
                        )}
                      </div>
                    </div>
                    {p.profileScreenshot && (
                      <button onClick={() => onPreviewImage(p.profileScreenshot)} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-neon-purple transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-6">
            {/* Registration Stats */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Registration Info</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</span>
                  <a href={`https://wa.me/${viewReg.whatsapp}`} target="_blank" className="text-xs font-black text-neon-cyan hover:underline">{viewReg.whatsapp}</a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Registered On</span>
                  <span className="text-xs font-black text-foreground">{new Date(viewReg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Payment Status</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${viewReg.paymentVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {viewReg.paymentVerified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
                {viewReg.orderId && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Order ID</span>
                    <span className="text-[10px] font-black text-slate-400 select-all tracking-tighter">{viewReg.orderId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30">
              <h4 className="text-[10px] font-black uppercase text-amber-600 mb-3 tracking-widest">Payout Details (QR)</h4>
              {viewReg.payoutDetails?.qrCodeUrl ? (
                <button onClick={() => onPreviewImage(viewReg.payoutDetails!.qrCodeUrl!)} 
                  className="mt-4 w-full h-10 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-[10px] font-black uppercase text-amber-600 flex items-center justify-center gap-2 hover:bg-amber-100 transition-all">
                  <Eye className="w-3 h-3" /> View QR Scanner
                </button>
              ) : (
                <p className="text-[10px] font-bold text-amber-600/50 italic">No QR Code provided</p>
              )}
            </div>

            {viewReg.status === 'Rejected' && viewReg.rejectionReason && (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <h4 className="text-[10px] font-black uppercase text-amber-600 mb-2">Current Rejection Reason</h4>
                <p className="text-xs font-bold text-slate-500 italic">"{viewReg.rejectionReason}"</p>
              </div>
            )}

            {viewReg.previousRejectionReason && (
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                <h4 className="text-[10px] font-black uppercase text-red-500 mb-2">Previous Rejection Reason</h4>
                <p className="text-xs font-bold text-slate-500 italic">"{viewReg.previousRejectionReason}"</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                onClick={() => onApprove(viewReg._id)}
                className="flex-1 h-12 rounded-xl bg-green-500 text-white font-black uppercase text-xs hover:bg-green-600 disabled:opacity-50 shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                Approve
              </button>
              <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                onClick={() => onRejectRequest(viewReg._id)}
                className="w-full h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-xs hover:bg-red-500/20 disabled:opacity-50 transition-all active:scale-95">
                {viewReg.status === 'Rejected' ? 'Modify Rejection' : 'Reject Registration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsModal;
