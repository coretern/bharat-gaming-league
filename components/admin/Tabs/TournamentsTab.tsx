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
}

const TournamentsTab: React.FC<TournamentsTabProps> = ({
  liveTournaments,
  loadingTours,
  tourSearch,
  setTourSearch,
  tourGameFilter,
  setTourGameFilter,
  tourStatusFilter,
  setTourStatusFilter,
  setShowCreateTour,
  setEditTour
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">All Tournaments</h2>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search Tournaments..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none" />
              </div>
              <select value={tourGameFilter} onChange={(e) => setTourGameFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                  <option value="All">All Games</option>
                  <option value="BGMI">BGMI</option>
                  <option value="Free Fire">Free Fire</option>
              </select>
              <select value={tourStatusFilter} onChange={(e) => setTourStatusFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Coming Soon">Coming Soon</option>
              </select>
              <button onClick={() => setShowCreateTour(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95">
                  <Plus className="w-4 h-4" /> Create New
              </button>
          </div>
      </div>
      <TournamentTable 
        tournaments={liveTournaments} 
        loading={loadingTours} 
        tourSearch={tourSearch} 
        tourGameFilter={tourGameFilter} 
        tourStatusFilter={tourStatusFilter} 
        onEdit={setEditTour} 
      />
    </div>
  );
};

export default TournamentsTab;
