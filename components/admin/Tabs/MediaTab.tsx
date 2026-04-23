import React from 'react';
import { Search, Filter, Maximize2, Calendar, User, Users, Trash2, Clock } from 'lucide-react';
import { CloudinaryMedia } from '../../types/admin';

interface MediaTabProps {
  mediaList: CloudinaryMedia[];
  mediaSearch: string;
  setMediaSearch: (s: string) => void;
  mediaTypeFilter: 'All' | 'Payout';
  setMediaTypeFilter: (t: 'All' | 'Payout') => void;
  setPreviewImg: (url: string | null) => void;
  onDeleteMedia: (regId: string, fieldKey: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({
  mediaList,
  mediaSearch,
  setMediaSearch,
  mediaTypeFilter,
  setMediaTypeFilter,
  setPreviewImg,
  onDeleteMedia
}) => {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Media
              <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[9px] font-black uppercase">{mediaList.length} files</span>
            </h2>
          </div>
          <div className="flex h-8 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['All', 'Payout'] as const).map(f => (
              <button key={f} onClick={() => setMediaTypeFilter(f)}
                className={`px-3 text-[9px] font-bold uppercase rounded-md transition-all ${mediaTypeFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search team, player..." value={mediaSearch} onChange={(e) => setMediaSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/10 transition-all" />
        </div>
      </div>

      {mediaList.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
           <Filter className="w-8 h-8 text-slate-200 mx-auto mb-3" />
           <p className="text-sm font-medium text-slate-400">No matching media found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaList.map((item, idx) => (
            <div key={`${item.url}-${idx}`} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={item.url} alt={item.teamName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => setPreviewImg(item.url)} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-200">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => onDeleteMedia(item.regId, item.fieldKey)} className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-red-200 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                   <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border shadow-lg bg-google-green text-white border-green-400">
                     Payout QR
                   </span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                   <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                     <Users className="w-3.5 h-3.5 text-google-blue" />
                   </div>
                   <div className="min-w-0">
                     <p className="text-[10px] font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{item.teamName}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Team</p>
                   </div>
                </div>



                <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-slate-400">
                   <div className="flex items-center gap-1.5">
                     <Calendar className="w-3 h-3" />
                     <span className="text-[9px] font-bold uppercase tracking-tighter">{new Date(item.createdAt).toLocaleDateString('en-GB')}</span>
                   </div>
                   <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                     <Clock className="w-3 h-3 text-google-blue" />
                     <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">{new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaTab;
