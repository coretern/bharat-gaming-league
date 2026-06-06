'use client';

export default function RulesContent() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl relative z-10">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Rules & <span className="text-google-blue">Regulations</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">Last Updated: Season 5 · April 2026</p>
      </header>

      <div className="space-y-10">
        <section className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-slate-900 dark:text-white font-extrabold text-base mb-4 flex items-center gap-2">
             <div className="w-1.5 h-6 bg-google-blue rounded-full" />
             1. Team Integrity
          </h2>
          <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-blue font-bold">•</span>
               Min 4 players (BGMI) or game-specific squad size.
            </li>
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-blue font-bold">•</span>
               Verified In-Game IDs (UID) only. Fake IDs lead to immediate disqualification.
            </li>
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-blue font-bold">•</span>
               One player, one team. Registration across multiple teams per tournament is banned.
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-slate-900 dark:text-white font-extrabold text-base mb-4 flex items-center gap-2">
             <div className="w-1.5 h-6 bg-google-green rounded-full" />
             2. Match Protocols
          </h2>
          <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-green font-bold">•</span>
               Room details shared 15 mins prior via official channels.
            </li>
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-green font-bold">•</span>
               5-minute arrival window after room creation.
            </li>
            <li className="flex gap-3 leading-relaxed">
               <span className="text-google-green font-bold">•</span>
               Zero tolerance for toxic behavior or abusive language.
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-google-red font-extrabold text-base mb-4 flex items-center gap-2 uppercase tracking-wider">
             ⚠️ Prohibited Actions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">The following actions result in a permanent ban across all Bharat Gaming League events:</p>
          <ul className="grid sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wide">
             <li className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">Third-Party Scripts</li>
             <li className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">Account Sharing</li>
             <li className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">Secret Teaming</li>
             <li className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">Admin Disregard</li>
          </ul>
        </section>

        <section className="p-4 sm:p-8 border border-transparent">
          <h2 className="text-slate-900 dark:text-white font-extrabold text-base mb-4">Official Verification</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Bharat Gaming League administrators reserve the final right to all match decisions. Appeals can be filed within 24 hours of match completion via our WhatsApp support.
          </p>
        </section>
      </div>
    </div>
  );
}
