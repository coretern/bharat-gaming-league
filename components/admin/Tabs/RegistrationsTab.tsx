import React from 'react';
import { Search, Download } from 'lucide-react';
import RegistrationTable from '../Registrations/RegistrationTable';
import { Reg } from '../../types/admin';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface RegistrationsTabProps {
  registrations: Reg[];
  loading: boolean;
  regFilter: 'Pending' | 'Approved' | 'Rejected';
  setRegFilter: (filter: 'Pending' | 'Approved' | 'Rejected') => void;
  regSearch: string;
  setRegSearch: (search: string) => void;
  regTourFilter: string;
  setRegTourFilter: (filter: string) => void;
  setViewReg: (reg: Reg) => void;
  handleDeleteRegistration: (id: string) => void;
}

const RegistrationsTab: React.FC<RegistrationsTabProps> = ({
  registrations,
  loading,
  regFilter,
  setRegFilter,
  regSearch,
  setRegSearch,
  regTourFilter,
  setRegTourFilter,
  setViewReg,
  handleDeleteRegistration
}) => {
  const exportToExcel = (data: any[], fileName: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
      toast.success('Excel exported successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          {(['Pending', 'Approved', 'Rejected'] as const).map(f => (
              <button key={f} onClick={() => setRegFilter(f)} 
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${regFilter === f ? 'bg-white dark:bg-slate-700 text-neon-purple shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {f}
              </button>
          ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{regFilter} Registrations</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Manage and track all tournament entries</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search by Team or Player..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none" />
              </div>
              <select value={regTourFilter} onChange={(e) => setRegTourFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                  <option value="All">All Tournaments</option>
                  {Array.from(new Set(registrations.map(r => r.tournamentName))).map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <button 
                  onClick={() => {
                      const filtered = registrations
                          .filter(r => r.status === regFilter)
                          .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
                          .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
                          .map(r => ({
                              'Team Name': r.teamName,
                              'WhatsApp': r.whatsapp,
                              'Tournament': r.tournamentName,
                              'Type': r.matchType,
                              'Status': r.status,
                              'Payment': r.paymentVerified ? 'Verified' : 'Pending',
                              'Date': new Date(r.createdAt).toLocaleString(),
                              'Leader': r.players[0]?.name || 'N/A',
                              'Leader UID': r.players[0]?.uid || 'N/A'
                          }));
                      exportToExcel(filtered, 'Registrations');
                  }}
                  className="h-10 px-4 flex items-center gap-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95"
              >
                  <Download className="w-4 h-4" /> Export
              </button>
            </div>
        </div>
        <RegistrationTable 
          registrations={registrations} 
          loading={loading} 
          regFilter={regFilter} 
          regSearch={regSearch} 
          regTourFilter={regTourFilter} 
          setViewReg={setViewReg} 
          deleteRegistration={handleDeleteRegistration} 
        />
      </div>
    </div>
  );
};

export default RegistrationsTab;
