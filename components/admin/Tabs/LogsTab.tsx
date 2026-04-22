'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Trophy, Users, Calendar, Medal, Monitor, User2, FileText } from 'lucide-react';

interface LogEntry {
  _id: string;
  action: string;
  category: string;
  details: string;
  performedBy: string;
  targetName?: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All', icon: FileText },
  { value: 'registration', label: 'Registration', icon: Users },
  { value: 'tournament', label: 'Tournament', icon: Trophy },
  { value: 'user', label: 'User', icon: User2 },
  { value: 'schedule', label: 'Schedule', icon: Calendar },
  { value: 'winner', label: 'Winner', icon: Medal },
  { value: 'profile', label: 'Profile', icon: User2 },
  { value: 'system', label: 'System', icon: Monitor },
];

const CATEGORY_COLORS: Record<string, string> = {
  registration: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  tournament: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  user: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  schedule: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  winner: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  profile: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
  system: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
};

export default function LogsTab() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, page: page.toString(), limit: '40', search });
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch { setLogs([]); } finally { setLoading(false); }
  }, [category, page, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black italic uppercase tracking-tight">
          Activity Logs <span className="text-slate-400 font-medium text-sm not-italic">({total})</span>
        </h2>
        <button onClick={fetchLogs} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-google-blue transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search logs..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-google-blue/20" />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
              className={`px-3 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 transition-all ${
                category === c.value ? 'bg-google-blue text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
              }`}>
              <c.icon className="w-3 h-3" /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-bold text-sm animate-pulse">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-bold text-sm">No logs found</div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {logs.map(log => (
              <div key={log._id} className="px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0 mt-0.5 ${CATEGORY_COLORS[log.category] || CATEGORY_COLORS.system}`}>
                    {log.category}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
                    {log.details && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{log.details}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400">{log.performedBy}</span>
                      {log.targetName && <span className="text-[10px] text-google-blue font-bold">→ {log.targetName}</span>}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap shrink-0">{formatTime(log.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-google-blue disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-google-blue disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
