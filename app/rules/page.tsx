import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules & Regulations | Bharat Gaming League",
  description: "Official tournament rules and regulations for Bharat Gaming League BGMI and Free Fire competitions.",
  robots: { index: true, follow: true },
};

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-40 pb-24">
      <Navbar />
      <div className="container mx-auto px-6 max-w-3xl">
        <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Rules & <span className="text-google-red">Regulations</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Last Updated: Season 5 · April 2026</p>
        </header>

        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-bold text-base mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-google-blue rounded-full" />
               1. Team Integrity
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-blue">•</span>
                 Min 4 players (BGMI) or game-specific squad size.
              </li>
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-blue">•</span>
                 Verified In-Game IDs (UID) only. Fake IDs lead to immediate disqualification.
              </li>
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-blue">•</span>
                 One player, one team. Registration across multiple teams per tournament is banned.
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-bold text-base mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-google-green rounded-full" />
               2. Match Protocols
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-green">•</span>
                 Room details shared 15 mins prior via official channels.
              </li>
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-green">•</span>
                 5-minute arrival window after room creation.
              </li>
              <li className="flex gap-3 leading-relaxed">
                 <span className="text-google-green">•</span>
                 Zero tolerance for toxic behavior or abusive language.
              </li>
            </ul>
          </section>

          <section className="bg-slate-900 dark:bg-slate-800 p-8 rounded-2xl border border-slate-800 text-white shadow-xl">
            <h2 className="text-google-red font-bold text-base mb-4 flex items-center gap-2 uppercase tracking-widest">
               ⚠️ Prohibited Actions
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">The following actions result in a permanent ban across all Bharat Gaming League events:</p>
            <ul className="grid sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wide">
               <li className="bg-slate-800 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-700">Third-Party Scripts</li>
               <li className="bg-slate-800 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-700">Account Sharing</li>
               <li className="bg-slate-800 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-700">Secret Teaming</li>
               <li className="bg-slate-800 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-700">Admin Disregard</li>
            </ul>
          </section>

          <section className="p-8">
            <h2 className="text-slate-900 dark:text-white font-bold text-base mb-4">Official Verification</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Bharat Gaming League administrators reserve the final right to all match decisions. Appeals can be filed within 24 hours of match completion via our WhatsApp support.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
