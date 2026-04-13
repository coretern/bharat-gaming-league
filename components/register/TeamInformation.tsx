interface TeamInformationProps {
  teamName: string;
  setTeamName: (name: string) => void;
  whatsapp: string;
  setWhatsapp: (num: string) => void;
}

export default function TeamInformation({ teamName, setTeamName, whatsapp, setWhatsapp }: TeamInformationProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">2. Team Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Team Name <span className="text-red-500">*</span></label>
          <input required value={teamName} onChange={e => setTeamName(e.target.value)} type="text" placeholder="e.g. Mortal Gaming"
            className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number <span className="text-red-500">*</span></label>
          <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))} 
            type="tel" placeholder="10 Digit Number" pattern="[0-9]{10}"
            className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm focus:ring-2 focus:ring-neon-purple/20 transition-all outline-none" />
        </div>
      </div>
    </div>
  );
}
