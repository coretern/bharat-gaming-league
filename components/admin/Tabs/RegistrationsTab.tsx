import React, { useState } from 'react';
import { Search, Download, Calendar, Settings2 } from 'lucide-react';
import RegistrationTable from '../Registrations/RegistrationTable';
import { Reg } from '../../types/admin';
import GroupScheduleModal from '../Registrations/GroupScheduleModal';
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
  regGameFilter: string;
  setRegGameFilter: (filter: string) => void;
  regGroupFilter: string;
  setRegGroupFilter: (filter: string) => void;
  regMatchTypeFilter: string;
  setRegMatchTypeFilter: (filter: string) => void;
  setViewReg: (reg: Reg) => void;
  handleDeleteRegistration: (id: string) => void;
  onSync: () => void;
  onRefresh: () => void;
  loadingRegs: boolean;
  liveTournaments: any[];
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
  regGameFilter,
  setRegGameFilter,
  regGroupFilter,
  setRegGroupFilter,
  regMatchTypeFilter,
  setRegMatchTypeFilter,
  setViewReg,
  handleDeleteRegistration,
  onSync,
  onRefresh,
  loadingRegs,
  liveTournaments
}) => {
  const [syncing, setSyncing] = React.useState(false);
  const [editingGroup, setEditingGroup] = useState<{ number: number, tourName: string, tourId?: string } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSync();
    } finally {
      setSyncing(false);
    }
  };
  const filteredRegs = registrations
    .filter(r => !r.matchDate) // Exclude scheduled groups
    .filter(r => r.status === regFilter)
    .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
    .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
    .filter(r => {
      if (regGameFilter === 'All') return true;
      if (r.game) return r.game === regGameFilter;
      return r.tournamentName.toLowerCase().includes(regGameFilter.toLowerCase());
    })
    .filter(r => regGroupFilter === 'All' || r.groupNumber?.toString() === regGroupFilter)
    .filter(r => regMatchTypeFilter === 'All' || r.matchType === regMatchTypeFilter);

  // Get unique group numbers for the current selection to show in filter
  const availableGroups = Array.from(new Set(
    registrations
      .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
      .filter(r => {
        if (regGameFilter === 'All') return true;
        if (r.game) return r.game === regGameFilter;
        return r.tournamentName.toLowerCase().includes(regGameFilter.toLowerCase());
      })
      .map(r => r.groupNumber)
      .filter(Boolean)
  )).sort((a, b) => (a || 0) - (b || 0));

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
    <div className="space-y-6">
      {/* Primary Management Header */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Control Center
                      <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[10px] font-black uppercase tracking-widest">{regFilter}</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage and Monitor Tournament Pulse</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                  <button 
                      onClick={() => {
                          const dataToExport = filteredRegs.map(r => ({
                              'Team Name': r.teamName,
                              'Game': r.game || (r.tournamentName.toLowerCase().includes('bgmi') ? 'BGMI' : 'Free Fire'),
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
                          exportToExcel(dataToExport, 'Registrations');
                      }}
                      className="h-10 px-4 bg-google-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                  >
                      <Download className="w-3.5 h-3.5" /> Export Data
                  </button>
                  
                  <button 
                      onClick={handleSync}
                      disabled={syncing || loadingRegs}
                      className="h-10 px-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                      <svg className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {syncing ? 'Syncing...' : 'Sync Groups'}
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              {/* Status Filter */}
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reg Status</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      {(['Pending', 'Approved', 'Rejected'] as const).map(f => (
                          <button key={f} onClick={() => setRegFilter(f)} 
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${regFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                              {f}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Game Platform Filter */}
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      {(['All', 'BGMI', 'Free Fire'] as const).map(f => (
                          <button key={f} onClick={() => setRegGameFilter(f)} 
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${regGameFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                              {f}
                          </button>
                      ))}
                  </div>
              </div>


              {/* Match Type Selector */}
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Match Type</label>
                  <select value={regMatchTypeFilter} onChange={(e) => setRegMatchTypeFilter(e.target.value)}
                      className="w-full h-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-google-blue/10 appearance-none">
                      <option value="All">All Categories</option>
                      <option value="Solo">Solo</option>
                      <option value="Duo">Duo</option>
                      <option value="Squad">Squad</option>
                  </select>
              </div>
          </div>

          {/* Group Filling Pulse */}
          <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
             <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-google-blue animate-pulse" />
                Live Tournament Filling Pulse
             </h4>
             <div className="flex flex-wrap gap-2">
                <div 
                   onClick={() => {
                      setRegTourFilter('All');
                      setRegGroupFilter('All');
                      setRegGameFilter('All');
                   }}
                   className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-center cursor-pointer transition-all hover:scale-105 hover:bg-slate-100 min-w-[100px]"
                >
                   <span className="text-[10px] font-black uppercase text-slate-400">View All</span>
                   <p className="text-[11px] font-black uppercase text-slate-800 dark:text-white">Full List</p>
                </div>

                {(() => {
                   // Group registrations by Tournament -> Group Number
                   const tournamentGroups: Record<string, number[]> = {};
                   registrations.forEach(r => {
                      if (!r.tournamentName || !r.groupNumber) return;
                      // Respect current platform filter if selected
                      if (regGameFilter !== 'All') {
                         const isMatch = r.game === regGameFilter || r.tournamentName.toLowerCase().includes(regGameFilter.toLowerCase());
                         if (!isMatch) return;
                      }
                      if (!tournamentGroups[r.tournamentName]) tournamentGroups[r.tournamentName] = [];
                      if (!tournamentGroups[r.tournamentName].includes(r.groupNumber)) {
                        tournamentGroups[r.tournamentName].push(r.groupNumber);
                      }
                   });

                   const tourList = Object.keys(tournamentGroups).sort();
                   if (tourList.length === 0) return <p className="text-[10px] italic text-slate-400 font-medium">No active registrations found...</p>;

                   return tourList.map(tourName => {
                      const groups = tournamentGroups[tourName].sort((a, b) => a - b);
                      const tournament = liveTournaments.find(t => t.title === tourName);
                      const gameType = tournament?.game || (tourName.toLowerCase().includes('bgmi') ? 'BGMI' : 'Free Fire');
                      
                        return groups.map(gNum => {
                           const teamsInGroup = registrations.filter(r => r.tournamentName === tourName && r.groupNumber === gNum);
                           const approvedTeams = teamsInGroup.filter(r => r.status === 'Approved');
                           const approvedCount = approvedTeams.length;
                           const totalCount = teamsInGroup.length;
                           
                           const isScheduled = teamsInGroup.some(r => !!r.matchDate);
                           
                           let target = 48; // Default
                           if (tournament?.slots) {
                              const parts = tournament.slots.split('/');
                              const parsed = parseInt(parts[parts.length - 1]);
                              if (!isNaN(parsed)) target = parsed;
                           } else if (gameType === 'BGMI') {
                               target = 94;
                           }
                           
                           const isFull = totalCount >= target;
                           const isFullyApproved = approvedCount >= target;

                          return (
                             <div key={`${tourName}-${gNum}`} 
                                 onClick={() => {
                                    setRegTourFilter(tourName);
                                    setRegGroupFilter(gNum.toString());
                                 }}
                                 className={`px-4 py-3 rounded-2xl border flex flex-col gap-1 cursor-pointer transition-colors min-w-[140px] group/pulse relative ${
                                   isScheduled
                                     ? 'bg-google-blue/10 border-google-blue/30'
                                     : isFullyApproved 
                                       ? 'bg-google-green/10 border-google-green/30' 
                                       : isFull
                                            ? 'bg-google-blue/5 border-google-blue/20'
                                            : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                                 }`}
                             >
                                {/* Quick Schedule Trigger - Only show for fully approved groups */}
                                {isFullyApproved && (
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setEditingGroup({ number: gNum, tourName: tourName, tourId: teamsInGroup[0]?.tournamentId });
                                     }}
                                     className="absolute top-2 right-2 p-1.5 rounded-lg bg-google-green text-white shadow-lg shadow-green-500/30 opacity-0 group-hover/pulse:opacity-100 transition-opacity hover:bg-google-green/90 active:scale-90 z-[20]"
                                     title="Assign Group Schedule"
                                   >
                                      <Calendar className="w-3.5 h-3.5" />
                                   </button>
                                )}

                                <div className="flex items-center justify-between gap-1 relative z-10 pr-6">
                                   <span className={`text-[8px] font-black uppercase tracking-widest ${gameType === 'BGMI' ? 'text-google-blue' : 'text-google-red'}`}>
                                       {gameType}
                                   </span>
                                   <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                       isScheduled ? 'bg-google-blue text-white animate-pulse' :
                                       isFullyApproved ? 'bg-google-green text-white' : 
                                       isFull ? 'bg-google-blue text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                   }`}>
                                       {isScheduled ? 'SCHEDULED' : isFullyApproved ? 'APPROVED' : isFull ? 'FULL' : 'Filling'}
                                   </span>
                                </div>
                                <p className="text-[11px] font-black italic uppercase text-slate-800 dark:text-white truncate max-w-[140px] relative z-10 mt-1">
                                   {tourName}
                               </p>
                               <div className="flex items-end justify-between mt-2 pt-2 border-t border-slate-500/5 relative z-10">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Group {gNum}</span>
                                  <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                      {totalCount}<span className="text-[10px] text-slate-400 font-bold ml-0.5">/{target}</span>
                                  </span>
                               </div>
                            </div>
                         );
                      });
                   });
                })()}
             </div>
          </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search by Team or Player UID..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none ring-google-blue/5 focus:ring-4 transition-all" />
              </div>
              
              <div className="w-full md:w-64">
                <select value={regTourFilter} onChange={(e) => setRegTourFilter(e.target.value)} 
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase outline-none appearance-none">
                    <option value="All">Active Tournaments</option>
                    {Array.from(new Set(registrations.map(r => r.tournamentName))).map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            </div>
        </div>

        <RegistrationTable 
          registrations={registrations} 
          loading={loading} 
          regFilter={regFilter} 
          regSearch={regSearch} 
          regTourFilter={regTourFilter} 
          regGameFilter={regGameFilter} 
          regGroupFilter={regGroupFilter}
          regMatchTypeFilter={regMatchTypeFilter}
          setViewReg={setViewReg} 
          deleteRegistration={handleDeleteRegistration} 
        />
      </div>
       {/* Bulk Schedule Modal */}
       {editingGroup && (
         <GroupScheduleModal 
           groupNumber={editingGroup.number}
           tournamentName={editingGroup.tourName}
           tournamentId={editingGroup.tourId}
           onClose={() => setEditingGroup(null)}
           onSuccess={onRefresh}
         />
       )}
    </div>
  );
};

export default RegistrationsTab;
