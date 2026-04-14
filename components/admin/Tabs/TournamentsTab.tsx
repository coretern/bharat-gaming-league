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
  setEditTour,
  onDeleteTournament
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">Global Events</h2>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Tournament Ecosystem</p>
            </div>
            <button onClick={() => setShowCreateTour(true)} className="flex items-center gap-2 px-5 py-2.5 bg-google-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <Plus className="w-4 h-4" /> Create New
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full md:w-auto">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search Tournaments..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none ring-google-blue/5 focus:ring-4 transition-all" />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select value={tourGameFilter} onChange={(e) => setTourGameFilter(e.target.value)} className="flex-1 md:w-32 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none appearance-none">
                    <option value="All">All Games</option>
                    <option value="BGMI">BGMI</option>
                    <option value="Free Fire">Free Fire</option>
                </select>
                <select value={tourStatusFilter} onChange={(e) => setTourStatusFilter(e.target.value)} className="flex-1 md:w-32 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none appearance-none">
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>
          </div>
      </div>
      <TournamentTable 
        tournaments={liveTournaments} 
        loading={loadingTours} 
        tourSearch={tourSearch} 
        tourGameFilter={tourGameFilter} 
        tourStatusFilter={tourStatusFilter} 
        onEdit={setEditTour} 
        onDelete={onDeleteTournament}
      />
    </div>
  );
};

export default TournamentsTab;
