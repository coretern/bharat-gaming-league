import { Upload } from "lucide-react";

interface PayoutQRUploadProps {
  qrFile: File | null;
  setQrFile: (file: File | null) => void;
  existingQrUrl: string;
  isEdit: boolean;
  rejectionTargets: string[];
}

export default function PayoutQRUpload({ qrFile, setQrFile, existingQrUrl, isEdit, rejectionTargets }: PayoutQRUploadProps) {
  const isLocked = isEdit && !rejectionTargets.includes('qr');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Payout Details (For Prizes)</h3>
      
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center leading-relaxed">
        Please upload your PhonePe/GPay QR code. If you win, we will use this to send your prize money.
      </div>

      <div className={`relative h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center group transition-colors ${isLocked ? 'bg-slate-100 dark:bg-slate-900/50 opacity-60' : 'hover:border-neon-purple/50 bg-slate-50/50 dark:bg-slate-900 cursor-pointer'}`}>
        <input 
          disabled={isLocked}
          required={!isEdit || rejectionTargets.includes('qr')} 
          type="file" accept="image/*" onChange={e => setQrFile(e.target.files?.[0] || null)}
          className={`absolute inset-0 w-full h-full opacity-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
        <Upload className="w-6 h-6 text-slate-400 group-hover:text-neon-purple mb-2" />
        <p className="text-xs font-black uppercase text-slate-500 text-center px-4">
            {isLocked ? 'QR Locked (Already Received)' : qrFile ? qrFile.name : existingQrUrl ? '(Already Uploaded) Change QR' : 'Upload Payment QR'}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or JPEG</p>
      </div>
    </div>
  );
}
