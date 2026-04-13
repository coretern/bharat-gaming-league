import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Reg } from '../../types/admin';

interface RegistrationTableProps {
  registrations: Reg[];
  loading: boolean;
  regFilter: string;
  regSearch: string;
  regTourFilter: string;
  setViewReg: (reg: Reg) => void;
  deleteRegistration: (id: string) => void;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  loading,
  regFilter,
  regSearch,
  regTourFilter,
  setViewReg,
  deleteRegistration
}) => {
  const filteredRegs = registrations
    .filter(r => r.status === regFilter)
    .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
    .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter);

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4">Team / Contact</th>
            <th className="px-6 py-4">Leader / UID</th>
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4">Verification</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={5} className="py-20 text-center text-slate-400 text-sm italic font-medium">Synchronizing with server...</td></tr>
          ) : filteredRegs.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">No registrations found in this view</td></tr>
          ) : (
            filteredRegs.map((reg) => (
              <tr key={reg._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{reg.teamName}</span>
                    <span className="text-[10px] font-medium text-slate-500">{reg.whatsapp}</span>
                    {reg.isResubmitted && (
                      <span className="mt-1 text-[8px] font-bold text-google-blue uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded w-fit">Resubmitted</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{reg.players[0]?.name || reg.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{reg.players[0]?.uid || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{reg.tournamentName}</span>
                    <span className="text-[10px] text-google-blue font-bold uppercase tracking-widest">{reg.matchType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                    reg.paymentVerified 
                      ? 'bg-green-50 text-google-green border-green-200 dark:bg-green-500/10 dark:border-green-500/20' 
                      : 'bg-yellow-50 text-google-yellow border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20'
                  }`}>
                    {reg.paymentVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewReg(reg)} className="p-2 rounded-lg text-slate-400 hover:text-google-blue hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRegistration(reg._id);
                      }} 
                      className="p-2 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium italic">Synchronizing...</div>
        ) : filteredRegs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">No registrations found</div>
        ) : (
          filteredRegs.map((reg) => (
            <div key={reg._id} className="p-5 space-y-5">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">{reg.teamName}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{reg.whatsapp}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-[0.1em] border ${
                    reg.paymentVerified 
                      ? 'bg-green-50 text-google-green border-green-100 dark:bg-green-500/10 dark:border-green-500/20' 
                      : 'bg-yellow-50 text-google-yellow border-yellow-100 dark:bg-yellow-500/10 dark:border-yellow-500/20'
                  }`}>
                    {reg.paymentVerified ? 'Verified' : 'Pending'}
                  </span>
               </div>
               
               <div className="flex gap-10">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Leader</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{reg.players[0]?.name || reg.userName}</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter mt-0.5">{reg.players[0]?.uid || 'N/A'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Match</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{reg.tournamentName}</p>
                    <p className="text-[10px] text-google-blue font-bold uppercase tracking-wider mt-0.5">{reg.matchType}</p>
                  </div>
               </div>

               <div className="flex gap-2 pt-1">
                  <button onClick={() => setViewReg(reg)} className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                    View Details
                  </button>
                  <button onClick={() => deleteRegistration(reg._id)} className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-google-red transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrationTable;
