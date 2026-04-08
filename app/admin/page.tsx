'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Edit2, Trash2, Users, CheckCircle, Clock } from "lucide-react";
import { tournaments } from "@/data/tournaments";

export default function AdminPanel() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Admin <span className="text-neon-red">Panel</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Manage tournaments, registrations, and results.</p>
          </div>
          <button className="btn-neon-purple flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Tournament
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Admin Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                {[
                  { name: 'Tournaments', icon: Plus, active: true },
                  { name: 'Registrations', icon: Users, active: false, count: 15 },
                  { name: 'Pending Approvals', icon: Clock, active: false, count: 4 },
                  { name: 'Manage Results', icon: CheckCircle, active: false },
                ].map((item) => (
                  <button
                    key={item.name}
                    className={`whitespace-nowrap flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
                      item.active 
                        ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-white dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    {item.count && (
                      <span className="bg-neon-red text-white text-[10px] px-2 py-0.5 rounded-full">{item.count}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tournament List */}
          <div className="lg:col-span-3">
            <div className="glass-card border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tournament</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Game</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Reg Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tournaments.map((t) => (
                      <tr key={t.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold uppercase italic text-white">{t.title}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            t.game === 'BGMI' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-purple/10 text-neon-purple'
                          }`}>
                            {t.game}
                          </span>
                        </td>
                        <td className="px-6 py-6 font-bold text-slate-400">{t.slots}</td>
                        <td className="px-6 py-6">
                          <div className="flex justify-end gap-2">
                            <button className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-neon-cyan transition-all border border-white/5">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-white/5">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
