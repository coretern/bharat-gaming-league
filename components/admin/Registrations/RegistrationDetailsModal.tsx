import React from 'react';
import { X, Trash2, ExternalLink, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Reg } from '../../types/admin';
import WinnerSection from './WinnerSection';

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
  viewReg, updating, onClose, onDelete, onApprove, onRejectRequest, onPreviewImage
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none uppercase">
              Team <span className="text-google-blue">{viewReg.teamName}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge cls="bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100">{viewReg.tournamentName}</Badge>
              <Badge cls="bg-blue-50 dark:bg-blue-500/10 text-google-blue border-blue-100">{viewReg.matchType}</Badge>
              <Badge cls={viewReg.status === 'Approved' ? 'bg-green-50 text-google-green border-green-200' : viewReg.status === 'Rejected' ? 'bg-red-50 text-google-red border-red-200' : 'bg-blue-50 text-google-blue border-blue-200'}>
                {viewReg.isResubmitted && viewReg.status === 'Pending' ? 'Resubmitted' : viewReg.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onDelete(viewReg._id)} disabled={updating === viewReg._id}
              className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-google-red border border-red-100 hover:bg-google-red hover:text-white transition-all active:scale-95" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 text-slate-500 hover:bg-slate-100 transition-all active:scale-95">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 2-column layout: Players + Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left: Players */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">Squad Members</h3>
            <div className="space-y-2.5">
              {viewReg.players.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</p>
                    <p className="text-[10px] text-google-blue font-bold mt-0.5">{p.uid}</p>
                    {p.instagram && (
                      <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-google-blue flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-2.5 h-2.5" /> Instagram
                      </a>
                    )}
                  </div>
                  {p.profileScreenshot && (
                    <button onClick={() => onPreviewImage(p.profileScreenshot)} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 text-slate-400 hover:text-google-blue transition-all">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registration Info + QR */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest pb-2 border-b border-slate-50 dark:border-slate-800">Registration Info</h4>
              <InfoRow label="WhatsApp" value={<a href={`https://wa.me/${viewReg.whatsapp}`} target="_blank" className="text-xs font-bold text-google-blue hover:underline">{viewReg.whatsapp}</a>} />
              <InfoRow label="Registered On" value={<span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(viewReg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>} />
              <InfoRow label="Payment" value={
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${viewReg.paymentVerified ? 'bg-green-50 text-google-green border-green-100' : 'bg-yellow-50 text-google-yellow border-yellow-100'}`}>
                  {viewReg.paymentVerified ? 'VERIFIED' : 'PENDING'}
                </span>
              } />
              {viewReg.matchDate && (
                <InfoRow label="Schedule" value={<span className="text-xs font-black text-google-blue uppercase italic tabular-nums">{viewReg.matchDate} @ {viewReg.matchTime || 'TBA'}</span>} />
              )}
              {viewReg.orderId && (
                <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-0.5">Transaction ID</span>
                  <span className="text-[10px] font-medium text-slate-500 font-mono break-all select-all">{viewReg.orderId}</span>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Payout QR</h4>
              {viewReg.payoutDetails?.qrCodeUrl ? (
                <button onClick={() => onPreviewImage(viewReg.payoutDetails!.qrCodeUrl!)}
                  className="w-full h-10 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-sm">
                  <Eye className="w-3.5 h-3.5" /> View QR
                </button>
              ) : (
                <div className="py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">No QR provided</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rejection Reason */}
        {viewReg.status === 'Rejected' && viewReg.rejectionReason && (
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 dark:bg-red-500/5 dark:border-red-500/10 mb-6">
            <h4 className="text-[9px] font-bold uppercase text-google-red mb-1 tracking-widest">Rejection Reason</h4>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">"{viewReg.rejectionReason}"</p>
          </div>
        )}

        {/* Winner Section — full width, only for Approved */}
        {viewReg.status === 'Approved' && (
          <WinnerSection viewReg={viewReg} updating={updating} onApprove={onApprove} onPreviewImage={onPreviewImage} />
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
            onClick={() => onApprove(viewReg._id, { status: 'Approved' })}
            className="flex-[2] h-11 rounded-xl bg-google-blue text-white font-bold uppercase text-xs hover:bg-blue-600 disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95 transition-all tracking-[0.1em]">
            Approve
          </button>
          <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
            onClick={() => onRejectRequest(viewReg._id)}
            className="flex-1 h-11 rounded-xl bg-white dark:bg-slate-900 text-google-red border border-red-100 dark:border-red-900/30 font-bold uppercase text-xs hover:bg-red-50 active:scale-95 transition-all">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Helpers ── */
function Badge({ children, cls }: { children: React.ReactNode; cls: string }) {
  return <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border dark:border-opacity-20 ${cls}`}>{children}</span>;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      {value}
    </div>
  );
}

export default RegistrationDetailsModal;
