import React from 'react';
import { X, ShieldAlert, ImageOff, CheckCircle, ShieldOff } from 'lucide-react';
import { Reg } from '../../types/admin';

interface RejectionModalProps {
  viewReg: Reg;
  rejectionOptions: {
    qr: boolean;
    profiles: boolean;
    playerIndices: number[];
    msg: string;
  };
  setRejectionOptions: (options: any) => void;
  onCancel: () => void;
  onConfirm: (finalMsg: string, targets: string[]) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  viewReg,
  rejectionOptions,
  setRejectionOptions,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
        
        <header className="mb-8 pr-12">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Rejection Protocol</h2>
          </div>
          <h3 className="text-3xl font-black italic uppercase text-foreground leading-tight tracking-tighter">Rejecting <span className="text-red-500">{viewReg.teamName}</span></h3>
          <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Select reasons for rejection below</p>
        </header>

        <button onClick={onCancel} className="absolute top-8 right-8 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-all active:scale-90">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Payout Issue Card */}
          <label className={`block group cursor-pointer transition-all duration-300 ${rejectionOptions.qr ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}>
            <div className={`p-5 rounded-3xl border-2 transition-all ${
              rejectionOptions.qr 
                ? 'bg-red-50 border-red-500 dark:bg-red-900/10' 
                : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    rejectionOptions.qr ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <ImageOff className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`text-sm font-black uppercase italic ${rejectionOptions.qr ? 'text-red-500' : 'text-foreground'}`}>Payout QR Issue</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">QR is missing, blurry or invalid</p>
                  </div>
                </div>
                <input type="checkbox" checked={rejectionOptions.qr} onChange={e => setRejectionOptions({...rejectionOptions, qr: e.target.checked})} className="hidden" />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${rejectionOptions.qr ? 'bg-red-500 border-red-500' : 'border-slate-200 dark:border-slate-700'}`}>
                  {rejectionOptions.qr && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          </label>

          {/* Player Issues Section */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Player Proof Issues:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {viewReg.players.map((p, idx) => (
                <label key={idx} className="block group cursor-pointer transition-all">
                  <div className={`p-4 rounded-2xl border-2 transition-all ${
                    rejectionOptions.playerIndices.includes(idx) 
                      ? 'bg-amber-50 border-amber-500 dark:bg-amber-900/10 scale-[1.02] shadow-sm' 
                      : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-amber-200'
                  }`}>
                    <input type="checkbox" 
                      checked={rejectionOptions.playerIndices.includes(idx)} 
                      onChange={e => {
                        const newIndices = e.target.checked 
                          ? [...rejectionOptions.playerIndices, idx]
                          : rejectionOptions.playerIndices.filter(i => i !== idx);
                        setRejectionOptions({ ...rejectionOptions, playerIndices: newIndices, profiles: newIndices.length > 0 });
                      }} 
                      className="hidden" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                        rejectionOptions.playerIndices.includes(idx) ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        P{idx + 1}
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase italic ${rejectionOptions.playerIndices.includes(idx) ? 'text-amber-600' : 'text-foreground'}`}>{p.name}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">{p.uid}</p>
                      </div>
                      {rejectionOptions.playerIndices.includes(idx) && (
                        <ShieldOff className="w-4 h-4 text-amber-500 ml-auto" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Message Card */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Custom Rejection Message:</label>
            <textarea 
              placeholder="Describe the issue in detail for the team..."
              value={rejectionOptions.msg}
              onChange={e => setRejectionOptions({...rejectionOptions, msg: e.target.value})}
              className="w-full h-24 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={onCancel} className="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs uppercase hover:bg-slate-200 transition-all">
            Cancel
          </button>
          <button 
            onClick={() => {
              const targets = [];
              let finalMsg = rejectionOptions.msg;
              if (rejectionOptions.qr) targets.push('qr');
              if (rejectionOptions.playerIndices.length > 0) {
                targets.push('profiles');
                const names = rejectionOptions.playerIndices.map(i => viewReg.players[i].name).join(', ');
                if (!finalMsg) finalMsg = `Screenshots invalid for: ${names}`;
                else finalMsg = `[Issues: ${names}] ${finalMsg}`;
              }
              if (!finalMsg && rejectionOptions.qr) finalMsg = "Payment QR code is invalid or not clear.";
              
              onConfirm(finalMsg || 'Registration rejected due to data issues.', targets);
            }}
            disabled={!rejectionOptions.qr && rejectionOptions.playerIndices.length === 0 && !rejectionOptions.msg}
            className="flex-[2] h-14 rounded-2xl bg-red-500 text-white font-black italic uppercase text-sm shadow-xl shadow-red-500/30 hover:bg-red-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]">
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
