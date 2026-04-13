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
  onSync: () => void;
  loadingRegs: boolean;
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
  handleDeleteRegistration,
  onSync,
  loadingRegs
}) => {
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSync();
    } finally {
      setSyncing(false);
    }
  };
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
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          {(['Pending', 'Approved', 'Rejected'] as const).map(f => (
              <button key={f} onClick={() => setRegFilter(f)} 
                  className={`px-4 py-2 text-sm font-medium transition-all relative ${regFilter === f ? 'text-google-blue' : 'text-slate-500 hover:text-slate-700'}`}>
                  {f}
                  {regFilter === f && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-google-blue rounded-t-full" />}
              </button>
          ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{regFilter}</h2>
              <p className="text-xs text-slate-400 font-medium mt-1.5 uppercase tracking-widest">Registrations Management</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search team or player..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none ring-google-blue/5 focus:ring-4 transition-all" />
              </div>
              
              <div className="flex items-center gap-2">
                <select value={regTourFilter} onChange={(e) => setRegTourFilter(e.target.value)} className="flex-1 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none appearance-none">
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
                                'Group': r.groupNumber ? `Group ${r.groupNumber}` : 'N/A',
                                'Slot': r.slotNumber || 'N/A',
                                'Payment': r.paymentVerified ? 'Verified' : 'Pending',
                                'Date': new Date(r.createdAt).toLocaleString(),
                                'Leader': r.players[0]?.name || 'N/A',
                                'Leader UID': r.players[0]?.uid || 'N/A'
                            }));
                        exportToExcel(filtered, 'Registrations');
                    }}
                    className="h-11 px-5 bg-google-green text-white rounded-xl text-xs font-bold shadow-lg shadow-green-500/10 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
                </button>
                
                <button 
                    onClick={handleSync}
                    disabled={syncing || loadingRegs}
                    className="h-11 px-5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Groups'}</span>
                </button>
              </div>
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
