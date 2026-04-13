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
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-500 border-b border-slate-200">
            <th className="px-6 py-3">Team / Contact</th>
            <th className="px-6 py-3">Leader / UID</th>
            <th className="px-6 py-3">Tournament</th>
            <th className="px-6 py-3">Verification</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={5} className="py-20 text-center text-slate-400 text-sm">Synchronizing with server...</td></tr>
          ) : filteredRegs.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-medium text-sm">No registrations found in this view</td></tr>
          ) : (
            filteredRegs.map((reg) => (
              <tr key={reg._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{reg.teamName}</span>
                    <span className="text-xs text-slate-500">{reg.whatsapp}</span>
                    {reg.isResubmitted && (
                      <span className="mt-1 text-[8px] font-bold text-google-blue uppercase tracking-tighter">Resubmitted</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{reg.players[0]?.name || reg.userName}</span>
                    <span className="text-xs text-slate-400 font-mono">{reg.players[0]?.uid || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{reg.tournamentName}</span>
                    <span className="text-[10px] text-google-blue font-bold uppercase">{reg.matchType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                    reg.paymentVerified 
                      ? 'bg-green-50 text-google-green border border-green-200' 
                      : 'bg-yellow-50 text-google-yellow border border-yellow-200'
                  }`}>
                    {reg.paymentVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewReg(reg)} className="p-1.5 rounded-lg text-slate-400 hover:text-google-blue hover:bg-blue-50 transition-all" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRegistration(reg._id);
                      }} 
                      className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 transition-all"
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
    </div>
  );
};

export default RegistrationTable;
