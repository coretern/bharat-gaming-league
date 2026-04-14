import React from 'react';
import { X, Trash2, ExternalLink, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Reg } from '../../types/admin';

interface RegistrationDetailsModalProps {
  viewReg: Reg;
  updating: string | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onApprove: (id: string, data?: any) => void;
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase">
              Team <span className="text-google-blue">{viewReg.teamName}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded text-[10px] font-bold uppercase text-slate-500 tracking-widest">{viewReg.tournamentName}</span>
              <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded text-[10px] font-bold uppercase text-google-blue tracking-widest">{viewReg.matchType}</span>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                viewReg.status === 'Approved' ? 'bg-green-50 text-google-green border-green-200 dark:bg-green-500/10' :
                viewReg.status === 'Rejected' ? 'bg-red-50 text-google-red border-red-200 dark:bg-red-500/10' :
                'bg-blue-50 text-google-blue border-blue-200 dark:bg-blue-500/10'
              }`}>
                {viewReg.isResubmitted && viewReg.status === 'Pending' ? 'Resubmitted' : viewReg.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onDelete(viewReg._id)}
              disabled={updating === viewReg._id}
              className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-google-red border border-red-100 dark:border-red-500/20 hover:bg-google-red hover:text-white transition-all active:scale-95"
              title="Delete Permanently"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-4">
          {/* Players Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-800 pb-2">Squad Members</h3>
            <div className="grid gap-3">
              {viewReg.players.map((p, i) => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-[10px] text-google-blue font-bold tracking-tight">{p.uid}</p>
                        {p.instagram && (
                          <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-google-blue hover:underline flex items-center gap-1 transition-colors">
                            <ExternalLink className="w-2.5 h-2.5" /> Instagram Handle
                          </a>
                        )}
                      </div>
                    </div>
                    {p.profileScreenshot && (
                      <button onClick={() => onPreviewImage(p.profileScreenshot)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-google-blue transition-all">
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
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-50 dark:border-slate-800 pb-2">Registration Info</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp</span>
                  <a href={`https://wa.me/${viewReg.whatsapp}`} target="_blank" className="text-xs font-bold text-google-blue hover:underline">{viewReg.whatsapp}</a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered On</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(viewReg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${viewReg.paymentVerified ? 'bg-green-50 text-google-green border-green-100' : 'bg-yellow-50 text-google-yellow border-yellow-100'}`}>
                    {viewReg.paymentVerified ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
                {viewReg.matchDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-google-blue uppercase tracking-widest">Match Schedule</span>
                    <span className="text-xs font-black text-google-blue uppercase italic tabular-nums">{viewReg.matchDate} @ {viewReg.matchTime || 'TBA'}</span>
                  </div>
                )}
                {viewReg.orderId && (
                  <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 block">Transaction ID</span>
                    <span className="text-[10px] font-medium text-slate-500 select-all font-mono break-all">{viewReg.orderId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Payout Details (QR)</h4>
              {viewReg.payoutDetails?.qrCodeUrl ? (
                <button onClick={() => onPreviewImage(viewReg.payoutDetails!.qrCodeUrl!)} 
                  className="w-full h-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                  <Eye className="w-4 h-4" /> View QR Screenshot
                </button>
              ) : (
                <div className="py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">No QR Code provided</p>
                </div>
              )}
            </div>

            {viewReg.status === 'Rejected' && viewReg.rejectionReason && (
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 dark:bg-red-500/5 dark:border-red-500/10">
                <h4 className="text-[9px] font-bold uppercase text-google-red mb-1.5 tracking-widest">Rejection Reason</h4>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">"{viewReg.rejectionReason}"</p>
              </div>
            )}

            {viewReg.status === 'Approved' && (
              <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Winner Outcome */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-google-green mb-3 tracking-[0.2em]">Match Outcome Management</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
                      <input 
                        type="number" 
                        placeholder="Prize Amount" 
                        className="w-full h-11 pl-7 pr-4 rounded-xl bg-green-50/30 dark:bg-green-500/5 border border-green-100 dark:border-green-500/20 text-xs font-bold text-google-green outline-none focus:ring-4 focus:ring-google-green/10 transition-all placeholder:text-google-green/30"
                        id="prizeInput"
                        defaultValue={viewReg.prizeAmount || 0}
                      />
                    </div>
                    <button 
                      disabled={updating === viewReg._id}
                      onClick={() => {
                        const amt = (document.getElementById('prizeInput') as HTMLInputElement).value;
                        onApprove(viewReg._id, { resultStatus: 'Won', prizeAmount: Number(amt) });
                      }}
                      className={`h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg ${
                        viewReg.resultStatus === 'Won' 
                          ? 'bg-google-green text-white shadow-green-500/20' 
                          : 'bg-white dark:bg-slate-900 text-google-green border border-green-200 dark:border-green-900/30 hover:bg-google-green hover:text-white'
                      }`}
                    >
                      {viewReg.resultStatus === 'Won' ? 'Winner Declared' : 'Set as Winner'}
                    </button>
                  </div>
                  <p className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Setting a winner will automatically mark other players in Group {viewReg.groupNumber} as losers.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-slate-50 dark:border-slate-800">
              <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                onClick={() => onApprove(viewReg._id, { status: 'Approved' })}
                className="flex-[2] h-12 rounded-xl bg-google-blue text-white font-bold uppercase text-xs hover:bg-blue-600 disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95 transition-all tracking-[0.1em]">
                Approve
              </button>
              <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                onClick={() => onRejectRequest(viewReg._id)}
                className="flex-1 h-12 rounded-xl bg-white dark:bg-slate-900 text-google-red border border-red-100 dark:border-red-900/30 font-bold uppercase text-xs hover:bg-red-50 active:scale-95 transition-all tracking-tight">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsModal;
