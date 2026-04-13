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
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <th className="px-6 py-4">Team / Phone</th>
            <th className="px-6 py-4">Leader / UID</th>
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4 text-center">Payment</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={5} className="py-24 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Loading...</td></tr>
          ) : filteredRegs.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No matches found</td></tr>
          ) : (
            filteredRegs.map((reg) => (
              <tr key={reg._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-5">
                  <div>
                    <p className="font-black italic uppercase text-foreground leading-none mb-1">{reg.teamName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{reg.whatsapp}</p>
                    {reg.isResubmitted && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-neon-purple text-white text-[7px] font-black uppercase animate-pulse">Resubmitted</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs font-black uppercase italic text-foreground leading-none mb-1">{reg.players[0]?.name || reg.userName}</p>
                  <p className="text-[10px] text-neon-cyan font-bold uppercase tracking-tighter">{reg.players[0]?.uid || 'N/A'}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs text-foreground font-bold leading-none mb-1">{reg.tournamentName}</p>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{reg.matchType}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                    reg.paymentVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {reg.paymentVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setViewReg(reg)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-neon-purple transition-all" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRegistration(reg._id);
                      }} 
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Permanent"
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
    </div>
  );
};

export default RegistrationTable;
