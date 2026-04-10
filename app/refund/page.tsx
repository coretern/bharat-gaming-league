import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Bharat Gaming League",
  description: "Read the Refund and Cancellation Policy for Bharat Gaming League tournaments.",
  robots: { index: true, follow: true },
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
          Refund & <span className="text-amber-400">Cancellation</span> Policy
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-foreground/70 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">1. General Policy</h2>
            <p>All entry fees paid to Bharat Gaming League (BGL) are considered final upon submission. By registering for a tournament and paying the entry fee, you acknowledge and agree to this refund policy. BGL is committed to conducting all registered tournaments, and cancellations are extremely rare.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">2. Non-Refundable Situations</h2>
            <p>Entry fees will <strong className="text-foreground">NOT</strong> be refunded in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Player voluntarily withdraws from a tournament after registration</li>
              <li>Team fails to join the lobby on time and forfeits their slot</li>
              <li>Player or team is disqualified due to cheating, rule violations, or misconduct</li>
              <li>Player provides incorrect in-game UID or payment details leading to disqualification</li>
              <li>Player is unable to participate due to personal reasons (power cut, internet issues, etc.)</li>
              <li>Disputes raised after 30 minutes of match completion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">3. Refund Eligible Situations</h2>
            <p>BGL will issue a <strong className="text-foreground">full refund</strong> of the entry fee only in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>BGL cancels a tournament before it begins due to insufficient registrations</li>
              <li>A technical failure on BGL's platform prevents the tournament from being conducted</li>
              <li>A major server or game outage (confirmed by the game developer) forces cancellation</li>
              <li>Duplicate payment was charged by error — verified by admin</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">4. Refund Process</h2>
            <p>If you are eligible for a refund:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Contact us within 48 hours of the tournament cancellation on Telegram or email</li>
              <li>Provide your registered email, team name, and payment transaction ID</li>
              <li>Refunds are processed within 5–7 business days via the original payment method (UPI)</li>
              <li>BGL will confirm the refund initiation via WhatsApp or email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">5. Tournament Postponement</h2>
            <p>If a tournament is postponed (not cancelled), entry fees are carried forward to the rescheduled date. Players who cannot participate on the new date can request a refund within 24 hours of the postponement announcement. After this window, the entry fee will not be refunded.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">6. Prize Disputes</h2>
            <p>Prize money disputes must be raised within 12 hours of the match result announcement via Telegram or email. BGL will review all disputes with match recordings and admin logs. Prize decisions once finalized by BGL admin are binding and non-negotiable.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">7. Contact for Refund Requests</h2>
            <p>
              To raise a refund request, contact us:<br /><br />
              📧 Email: <a href="mailto:worktoearn@gmail.com" className="text-neon-cyan hover:underline">worktoearn@gmail.com</a><br />
              📱 WhatsApp: <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">+91 7488168228</a><br />
              ✈️ Telegram: <a href="https://t.me/freefire_tounamentt" className="text-neon-cyan hover:underline">t.me/freefire_tounamentt</a><br />
              🕐 Response Time: Within 24 hours (Mon–Sat, 10am–8pm)
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
