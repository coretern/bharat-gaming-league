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
    <div className="space-y-6">
      {/* Management Header */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Event Registry
                      <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[10px] font-black uppercase tracking-widest">{liveTournaments.length} Active</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Tournament Distribution & Control</p>
              </div>

              <button onClick={() => setShowCreateTour(true)} 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-google-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-600">
                  <Plus className="w-4 h-4" /> Initialize Tournament
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              {/* Search Bar */}
              <div className="space-y-2 lg:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Events</label>
                  <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Title or Game Name..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)}
                          className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
                  </div>
              </div>

              {/* Game Platform Filter */}
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Game</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      {(['All', 'BGMI', 'Free Fire'] as const).map(f => (
                          <button key={f} onClick={() => setTourGameFilter(f)} 
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${tourGameFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                              {f}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Event Status Filter */}
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Status</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      {(['All', 'Open', 'Closed', 'Coming Soon'] as const).map(f => (
                          <button key={f} onClick={() => setTourStatusFilter(f)} 
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded-lg ${tourStatusFilter === f ? 'bg-white dark:bg-slate-700 text-google-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                              {f === 'Coming Soon' ? 'Soon' : f}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
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
    </div>
  );
};

export default TournamentsTab;
