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
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
          Rules & <span className="text-neon-red">Regulations</span>
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Effective: Season 5 · April 2026</p>

        <div className="space-y-10 text-foreground/70 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">1. Team Requirements</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Each team must have a minimum of 4 active players (BGMI) or the required squad size for the respective game</li>
              <li>All player UIDs must match in-game profiles — fake UIDs result in disqualification</li>
              <li>Teams must register under a unique team name — duplicate names are not allowed</li>
              <li>A player may only be registered with one team per tournament</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">2. Registration Rules</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Entry fee must be paid before the registration deadline</li>
              <li>Payment screenshot must clearly show the transaction ID and amount</li>
              <li>Registrations are only confirmed after admin verification</li>
              <li>Entry fees are non-refundable unless the tournament is cancelled by BGL</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">3. Match Rules</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Lobby codes are shared via WhatsApp/Telegram 15 minutes before match time</li>
              <li>Teams must join the lobby within 5 minutes of room creation or forfeit their slot</li>
              <li>Disconnection during a match is not grounds for a rematch unless server issues are confirmed</li>
              <li>All participants must follow in-game etiquette and not abuse other players</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">4. Prohibited Actions</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Use of hacks, mods, scripts, or any third-party software that modifies gameplay</li>
              <li>Account sharing or playing on behalf of another registered player</li>
              <li>Teaming up with opponents outside of official team rosters</li>
              <li>Threatening, harassing, or abusing admins or other players</li>
              <li>Publishing lobby codes or match details on social media before the match</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">5. Anti-Cheat Policy</h2>
            <p>BGL admins spectate and record all matches. Any player found using unauthorized software will be permanently banned from all future tournaments. Evidence (screenshots/recordings) will be collected before any ban is issued. Ban appeals can be submitted to our support email within 48 hours.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">6. Prize Distribution</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Winners are announced within 1 hour of the final match</li>
              <li>Prize money is transferred within 24 hours via UPI/bank transfer</li>
              <li>Winners must provide valid payment details within 12 hours of announcement</li>
              <li>Unclaimed prizes after 72 hours are forfeited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">7. Admin Decisions</h2>
            <p>All decisions made by BGL admins during a tournament are final and binding. Disputes must be raised within 30 minutes of the relevant match via WhatsApp or Telegram. BGL reserves the right to modify tournament brackets, formats, or rules at any time for operational reasons.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">8. Contact for Disputes</h2>
            <p>Raise disputes via Telegram: <a href="https://t.me/freefire_tounamentt" className="text-neon-cyan hover:underline">t.me/freefire_tounamentt</a> or email: <a href="mailto:support@bharatgamingleague.in" className="text-neon-cyan hover:underline">support@bharatgamingleague.in</a></p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
