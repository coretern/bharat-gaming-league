import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Loader2, Trophy, Eye, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { Reg } from '../../types/admin';

interface WinnerSectionProps {
  viewReg: Reg;
  updating: string | null;
  onApprove: (id: string, data?: any) => void;
  onPreviewImage: (url: string) => void;
}

const WinnerSection: React.FC<WinnerSectionProps> = ({
  viewReg,
  updating,
  onApprove,
  onPreviewImage
}) => {
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    setScreenshotFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadScreenshot = async () => {
    if (!screenshotFile) {
      toast.error('Please select a screenshot first');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshotFile);
      formData.append('registrationId', viewReg._id);

      const res = await fetch('/api/admin/winner-screenshot', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      toast.success(`Screenshot uploaded for ${data.updatedCount} teams!`);
      setScreenshotFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
      {/* Winner Outcome */}
      <div>
        <h4 className="text-[10px] font-black uppercase text-google-green mb-3 tracking-[0.2em]">
          Match Champion Management
        </h4>
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
            {viewReg.resultStatus === 'Won' ? 'Champion ✓' : 'Set Champion'}
          </button>
        </div>
        <p className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
          Setting a winner will automatically mark other teams in Group {viewReg.groupNumber} as losers.
        </p>
      </div>

      {/* Winner Screenshot Upload */}
      <div>
        <h4 className="text-[10px] font-black uppercase text-google-blue mb-3 tracking-[0.2em] flex items-center gap-1.5">
          <Camera className="w-3 h-3" /> Winner Proof Screenshot
        </h4>

        {/* Existing screenshot */}
        {viewReg.winnerScreenshot && (
          <div className="mb-3 p-3 rounded-xl bg-google-blue/5 border border-google-blue/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-google-blue" />
              <span className="text-[10px] font-bold text-google-blue uppercase">Screenshot Uploaded</span>
            </div>
            <button
              onClick={() => onPreviewImage(viewReg.winnerScreenshot!)}
              className="px-3 py-1.5 rounded-lg bg-google-blue text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Eye className="w-3 h-3" /> View
            </button>
          </div>
        )}

        {/* Upload area */}
        <div className="space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-google-blue/30 bg-google-blue/5">
              <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain" />
              <button
                onClick={() => { setScreenshotFile(null); setPreviewUrl(null); }}
                className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-google-blue/40 hover:bg-google-blue/5 transition-all flex flex-col items-center gap-2 group"
            >
              <Upload className="w-5 h-5 text-slate-300 group-hover:text-google-blue transition-colors" />
              <span className="text-[10px] font-black text-slate-400 group-hover:text-google-blue uppercase tracking-widest transition-colors">
                Upload Winner Screenshot
              </span>
              <span className="text-[9px] text-slate-300">PNG, JPG up to 5MB</span>
            </button>
          )}

          {screenshotFile && (
            <button
              onClick={handleUploadScreenshot}
              disabled={uploading}
              className="w-full h-10 rounded-xl bg-google-blue text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload & Share with All Teams'}
            </button>
          )}
        </div>

        <p className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
          This screenshot will be visible to ALL teams in this group (winners & losers).
        </p>
      </div>
    </div>
  );
};

export default WinnerSection;
