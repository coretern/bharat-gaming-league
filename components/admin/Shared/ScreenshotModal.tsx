import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ScreenshotModalProps {
  url: string;
  onClose: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  url,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out" onClick={onClose}>
      <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors bg-white/10 p-2 rounded-full">
          <X className="w-7 h-7" />
        </button>
        <img src={url} alt="Registration Screenshot" className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh] border border-white/10" />
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 py-3 rounded-xl border border-white/5">
          <ExternalLink className="w-4 h-4" /> Open Full Size In New Tab
        </a>
      </div>
    </div>
  );
};

export default ScreenshotModal;
