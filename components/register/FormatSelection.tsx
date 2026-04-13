interface FormatSelectionProps {
  allowedMatchTypes: string[];
  matchType: string;
  isEdit: boolean;
  onMatchTypeChange: (type: 'Solo' | 'Duo' | 'Squad') => void;
}

export default function FormatSelection({ allowedMatchTypes, matchType, isEdit, onMatchTypeChange }: FormatSelectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-slate-400">1. Tournament Format</h3>
      <div className="grid grid-cols-3 gap-3">
        {(allowedMatchTypes || ['Solo', 'Duo', 'Squad']).map((type: any) => (
          <button
            key={type}
            type="button"
            disabled={isEdit}
            onClick={() => onMatchTypeChange(type)}
            className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border ${
              matchType === type
                ? 'bg-neon-purple text-white border-neon-purple shadow-lg shadow-neon-purple/20 scale-[1.02]'
                : isEdit 
                  ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed opacity-50 border-transparent'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
            }`}
          >
            {type}
            {isEdit && matchType === type && <span className="block text-[8px] opacity-70 mt-1 uppercase tracking-tighter font-black">Locked Selection</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
