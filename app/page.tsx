'use client';

import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import HeroSection from "@/components/home/HeroSection";
import WinnersTicker from "@/components/home/WinnersTicker";
import TrustGrid from "@/components/home/TrustGrid";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useTournaments } from "@/hooks/useTournaments";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { tournaments: liveTournaments, loading } = useTournaments(3);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <WinnersTicker />

      {/* Active Tournaments */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Active Tournaments
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-sm">
              Join a match today and prove your skills.
            </p>
          </div>
          <Link
            href="/tournaments"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-google-blue hover:text-blue-600 transition-colors group"
          >
            See all matches
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200/30 dark:border-slate-800/30" />
            ))
          ) : liveTournaments.length > 0 ? (
            liveTournaments.map((t) => (
              <div key={t.id}>
                <TournamentCard {...t} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-slate-400 font-medium">
              No active tournaments available at the moment.
            </div>
          )}
        </div>
      </section>

      <TrustGrid />
      <Footer />
    </main>
  );
}
