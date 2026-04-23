import React from 'react';
import { Search, Plus } from 'lucide-react';
import TournamentTable from '../Tournaments/TournamentTable';
import { Tournament } from '../../types/admin';

interface TournamentsTabProps {
  liveTournaments: Tournament[];
  loadingTours: boolean;
  tourSearch: string;
  setTourSearch: (search: string) => void;
  tourGameFilter: string;
  setTourGameFilter: (filter: string) => void;
  tourStatusFilter: string;
  setTourStatusFilter: (filter: string) => void;
  setShowCreateTour: (show: boolean) => void;
  setEditTour: (tour: Tournament) => void;
  onDeleteTournament: (id: string) => void;
}

const TournamentsTab: React.FC<TournamentsTabProps> = (props) => {
  const {
    liveTournaments, loadingTours, tourSearch, setTourSearch,
    tourGameFilter, setTourGameFilter, tourStatusFilter, setTourStatusFilter,
    setShowCreateTour, setEditTour, onDeleteTournament
  } = props;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Row 1: Title + Create */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Tournaments
              <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[9px] font-black uppercase">{liveTournaments.length}</span>
            </h2>
          </div>
          <button onClick={() => setShowCreateTour(true)}
            className="h-8 px-4 bg-google-blue text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" /> New Tournament
          </button>
        </div>

        {/* Row 2: Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/10 transition-all" />
          </div>

          {/* Game */}
          <div className="flex h-8 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['All', 'BGMI', 'Free Fire'] as const).map(f => (
              <button key={f} onClick={() => setTourGameFilter(f)}
                className={`flex-1 text-[9px] font-bold uppercase rounded-md transition-all ${tourGameFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {f === 'Free Fire' ? 'FF' : f}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex h-8 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['All', 'Open', 'Closed', 'Coming Soon'] as const).map(f => (
              <button key={f} onClick={() => setTourStatusFilter(f)}
                className={`flex-1 text-[9px] font-bold uppercase rounded-md transition-all ${tourStatusFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {f === 'Coming Soon' ? 'Soon' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <TournamentTable
          tournaments={liveTournaments} loading={loadingTours}
          tourSearch={tourSearch} tourGameFilter={tourGameFilter} tourStatusFilter={tourStatusFilter}
          onEdit={setEditTour} onDelete={onDeleteTournament}
        />
      </div>
    </div>
  );
};

export default TournamentsTab;
