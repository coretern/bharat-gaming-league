import React, { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import RegistrationTable from '../Registrations/RegistrationTable';
import { Reg, Tournament } from '../../types/admin';
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
  setActiveTab: (tab: any) => void;
}

const RegistrationsTab: React.FC<RegistrationsTabProps> = (props) => {
  const {
    registrations, loading, regFilter, setRegFilter, regSearch, setRegSearch,
    regTourFilter, setRegTourFilter, regGameFilter, setRegGameFilter,
    regGroupFilter, setRegGroupFilter, regMatchTypeFilter, setRegMatchTypeFilter,
    setViewReg, handleDeleteRegistration, onSync, onRefresh, loadingRegs,
    liveTournaments, setActiveTab
  } = props;

  const [syncing, setSyncing] = React.useState(false);
  const [editingGroup, setEditingGroup] = useState<{ number: number, tourName: string, tourId?: string } | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try { await onSync(); } finally { setSyncing(false); }
  };

  const filteredRegs = registrations
    .filter(r => !r.matchDate)
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

  const exportToExcel = () => {
    try {
      const data = filteredRegs.map(r => ({
        'Team': r.teamName, 'Game': r.game || 'N/A', 'WhatsApp': r.whatsapp,
        'Tournament': r.tournamentName, 'Type': r.matchType, 'Status': r.status,
        'Group': r.groupNumber ? `G${r.groupNumber}` : 'N/A', 'Slot': r.slotNumber || 'N/A',
        'Payment': r.paymentVerified ? 'Verified' : 'Pending',
        'Date': new Date(r.createdAt).toLocaleString(),
        'Leader': r.players[0]?.name || 'N/A', 'UID': r.players[0]?.uid || 'N/A'
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registrations");
      XLSX.writeFile(wb, `BGL_Registrations_${new Date().toLocaleDateString()}.xlsx`);
      toast.success('Exported successfully');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
        {/* Row 1: Title + Actions */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Registrations
              <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[9px] font-black uppercase">{regFilter} · {filteredRegs.length}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportToExcel} className="h-8 px-3 bg-google-green text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-all">
              <Download className="w-3 h-3" /> Export
            </button>
            <button onClick={handleSync} disabled={syncing || loadingRegs}
              className="h-8 px-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-50">
              <svg className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync
            </button>
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Status */}
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Status</label>
            <div className="flex h-8 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['Pending', 'Approved', 'Rejected'] as const).map(f => (
                <button key={f} onClick={() => setRegFilter(f)}
                  className={`flex-1 text-[9px] font-bold uppercase rounded-md transition-all ${regFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {f.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Platform</label>
            <div className="flex h-8 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['All', 'BGMI', 'Free Fire'] as const).map(f => (
                <button key={f} onClick={() => setRegGameFilter(f)}
                  className={`flex-1 text-[9px] font-bold uppercase rounded-md transition-all ${regGameFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {f === 'Free Fire' ? 'FF' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Match Type */}
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Type</label>
            <select value={regMatchTypeFilter} onChange={(e) => setRegMatchTypeFilter(e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-[10px] font-bold uppercase outline-none appearance-none text-slate-600 dark:text-slate-300">
              <option value="All">All</option>
              <option value="Solo">Solo</option>
              <option value="Duo">Duo</option>
              <option value="Squad">Squad</option>
            </select>
          </div>

          {/* Tournament filter */}
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Tournament</label>
            <select value={regTourFilter} onChange={(e) => setRegTourFilter(e.target.value)}
              className="w-full h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-[10px] font-bold uppercase outline-none appearance-none text-slate-600 dark:text-slate-300 truncate">
              <option value="All">All</option>
              {Array.from(new Set(registrations.map(r => r.tournamentName))).map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Group pulse */}
      <GroupPulse
        registrations={registrations}
        regGameFilter={regGameFilter}
        liveTournaments={liveTournaments}
        setRegTourFilter={setRegTourFilter}
        setRegGroupFilter={setRegGroupFilter}
        setRegGameFilter={setRegGameFilter}
        setEditingGroup={setEditingGroup}
      />

      {/* Search + Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search team or player..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/10 transition-all" />
          </div>
        </div>

        <RegistrationTable
          registrations={registrations} loading={loading}
          regFilter={regFilter} regSearch={regSearch}
          regTourFilter={regTourFilter} regGameFilter={regGameFilter}
          regGroupFilter={regGroupFilter} regMatchTypeFilter={regMatchTypeFilter}
          setViewReg={setViewReg} deleteRegistration={handleDeleteRegistration}
        />
      </div>

      {editingGroup && (
        <GroupScheduleModal
          groupNumber={editingGroup.number}
          tournamentName={editingGroup.tourName}
          tournamentId={editingGroup.tourId}
          onClose={() => setEditingGroup(null)}
          onSuccess={() => { onRefresh(); setActiveTab('Schedules'); }}
        />
      )}
    </div>
  );
};

/** Group filling pulse cards */
function GroupPulse({ registrations, regGameFilter, liveTournaments, setRegTourFilter, setRegGroupFilter, setRegGameFilter, setEditingGroup }: any) {
  const unscheduled = registrations.filter((r: Reg) => !r.matchDate);
  const groups: Record<string, number[]> = {};

  unscheduled.forEach((r: Reg) => {
    if (!r.tournamentName || !r.groupNumber) return;
    if (regGameFilter !== 'All') {
      const match = r.game === regGameFilter || r.tournamentName.toLowerCase().includes(regGameFilter.toLowerCase());
      if (!match) return;
    }
    if (!groups[r.tournamentName]) groups[r.tournamentName] = [];
    if (!groups[r.tournamentName].includes(r.groupNumber)) groups[r.tournamentName].push(r.groupNumber);
  });

  const tours = Object.keys(groups).sort();
  if (tours.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-google-blue animate-pulse" />
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Group Fill Status</h4>
        <button onClick={() => { setRegTourFilter('All'); setRegGroupFilter('All'); setRegGameFilter('All'); }}
          className="ml-auto text-[9px] font-bold text-google-blue hover:underline">Reset Filters</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tours.map(tourName => {
          const gNums = groups[tourName].sort((a, b) => a - b);
          const tournament = liveTournaments.find((t: any) => t.title === tourName);
          const game = tournament?.game || (tourName.toLowerCase().includes('bgmi') ? 'BGMI' : 'Free Fire');

          return gNums.map(gNum => {
            const teams = unscheduled.filter((r: Reg) => r.tournamentName === tourName && r.groupNumber === gNum);
            const approved = teams.filter((r: Reg) => r.status === 'Approved').length;
            const total = teams.length;
            let target = 48;
            if (tournament?.slots) {
              const p = parseInt(tournament.slots.split('/').pop());
              if (!isNaN(p)) target = p;
            } else if (game === 'BGMI') target = 94;

            const isFull = total >= target;
            const isApproved = approved >= target;

            return (
              <button key={`${tourName}-${gNum}`}
                onClick={() => { setRegTourFilter(tourName); setRegGroupFilter(gNum.toString()); }}
                className={`px-3 py-2 rounded-xl border text-left transition-all hover:shadow-md relative group/p min-w-[120px] ${
                  isApproved ? 'bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20' :
                  isFull ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20' :
                  'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                }`}
              >
                {isApproved && (
                  <span onClick={(e) => { e.stopPropagation(); setEditingGroup({ number: gNum, tourName, tourId: teams[0]?.tournamentId }); }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-google-green text-white opacity-0 group-hover/p:opacity-100 transition-opacity shadow-sm hover:bg-green-600 z-10">
                    <Calendar className="w-3 h-3" />
                  </span>
                )}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[8px] font-black uppercase ${game === 'BGMI' ? 'text-google-blue' : 'text-google-red'}`}>{game}</span>
                  <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isApproved ? 'bg-google-green text-white' : isFull ? 'bg-google-blue text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>{isApproved ? '✓' : isFull ? 'Full' : 'Open'}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{tourName}</p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400">G{gNum}</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums">{total}<span className="text-[9px] text-slate-400 font-medium">/{target}</span></span>
                </div>
              </button>
            );
          });
        })}
      </div>
    </div>
  );
}

export default RegistrationsTab;
