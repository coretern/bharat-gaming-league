import { Upload, ShieldCheck } from "lucide-react";

interface PlayerFormFieldsProps {
  player: any;
  idx: number;
  isEdit: boolean;
  rejectionTargets: string[];
  rejectionIndices: number[];
  onUpdate: (index: number, field: string, value: any) => void;
}

export default function PlayerFormFields({ player, idx, isEdit, rejectionTargets, rejectionIndices, onUpdate }: PlayerFormFieldsProps) {
  const isLocked = isEdit && rejectionTargets.includes('profiles') && !rejectionIndices.includes(idx);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
          {idx === 0 ? '3. Team Leader' : `Player ${idx + 1}`}
        </h3>
      </div>
      
      {isLocked && (
        <div className="p-3 mb-4 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <p className="text-[10px] font-black uppercase text-slate-500">Screenshot Verified · <span className="text-green-500">Locked by Admin</span></p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name <span className="text-red-500">*</span></label>
          <input required 
            value={player.name} onChange={e => onUpdate(idx, 'name', e.target.value)} type="text" placeholder="Gamer Name"
            className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Game UID <span className="text-red-500">*</span></label>
          <input required 
            value={player.uid} onChange={e => onUpdate(idx, 'uid', e.target.value)} type="text" placeholder="123456789"
            className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Instagram Profile</label>
        <input 
          value={player.instagram} onChange={e => onUpdate(idx, 'instagram', e.target.value)} type="url" placeholder="https://instagram.com/profile"
          className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Game Profile Screenshot <span className="text-red-500">*</span></label>
        <div className={`relative h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 flex items-center gap-3 overflow-hidden group transition-colors ${isLocked ? 'opacity-50' : 'hover:border-neon-purple/50'}`}>
            <Upload className="w-4 h-4 text-slate-400 group-hover:text-neon-purple transition-colors" />
            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                {(isEdit && !rejectionIndices.includes(idx) && rejectionTargets.includes('profiles')) ? 'Locked (Verified)' : player.file ? player.file.name : player.existingUrl ? '(Already Uploaded) Change image...' : 'Choose image for proof...'}
            </span>
            <input 
              disabled={isLocked}
              required={!isEdit || (rejectionTargets.includes('profiles') && rejectionIndices.includes(idx))} 
              type="file" accept="image/*" onChange={e => onUpdate(idx, 'file', e.target.files?.[0] || null)}
              className={`absolute inset-0 w-full h-full opacity-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`} />
        </div>
      </div>
    </div>
  );
}
