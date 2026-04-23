import React from 'react';
import { Pencil, Eye, Upload } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary-utils';

export function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-google-blue hover:bg-google-blue/10 transition-all" title="Edit">
      <Pencil className="w-3.5 h-3.5" />
    </button>
  );
}

export function Section({ icon, title, children, subtle, action }: { icon: React.ReactNode; title: string; children: React.ReactNode; subtle?: boolean; action?: React.ReactNode }) {
  return (
    <div className={`rounded-xl p-5 md:p-6 border shadow-[0_1px_2px_0_rgba(60,64,67,.30)] ${subtle ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800' : 'bg-white dark:bg-slate-900 border-slate-200'}`}>
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
        <span className="p-1.5 rounded-lg bg-google-blue/10 text-google-blue">{icon}</span>
        <span className="flex-1">{title}</span>
        {action}
      </h2>
      {children}
    </div>
  );
}

export function InfoField({ label, value, accent, link }: { label: string; value: string; accent?: boolean; link?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      {link && value.startsWith('http') ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-google-blue hover:underline truncate block">{value}</a>
      ) : (
        <p className={`font-medium text-sm ${accent ? 'text-google-green' : 'text-slate-700 dark:text-slate-200'}`}>{value}</p>
      )}
    </div>
  );
}

export function ProfileInput({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block ml-0.5">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/20 transition-all" />
    </div>
  );
}

export function UploadField({ label, hint, preview, inputRef, onFile, editable }: {
  label: string; hint: string; preview: string; editable: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>; onFile: (f: File) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-0.5">{label}</label>
      {preview ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
          <img src={optimizeCloudinaryUrl(preview, { width: 150, height: 150 })} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-google-green uppercase mb-0.5">Uploaded</p>
            <p className="text-[9px] text-slate-400">{hint}</p>
            <div className="flex gap-2 mt-1.5">
              <a href={preview} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-google-blue flex items-center gap-0.5 hover:underline"><Eye className="w-3 h-3" />View</a>
              {editable && <button onClick={() => inputRef.current?.click()} className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5 hover:text-slate-600"><Upload className="w-3 h-3" />Change</button>}
            </div>
          </div>
        </div>
      ) : editable ? (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full py-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-google-blue/40 hover:bg-google-blue/5 transition-all flex flex-col items-center gap-1.5 group">
          <Upload className="w-4 h-4 text-slate-300 group-hover:text-google-blue" />
          <span className="text-[10px] font-black text-slate-400 group-hover:text-google-blue uppercase tracking-widest">{label}</span>
          <span className="text-[9px] text-slate-300">{hint}</span>
        </button>
      ) : (
        <div className="py-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase">Not uploaded yet</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}
