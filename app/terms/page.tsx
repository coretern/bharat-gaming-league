import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bharat Gaming League",
  description: "Read the Terms of Service for Bharat Gaming League tournaments.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
          Terms of <span className="text-neon-purple">Service</span>
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-foreground/70 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">1. Acceptance of Terms</h2>
            <p>By registering on Bharat Gaming League (BGL), you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">2. Eligibility</h2>
            <p>You must be at least 13 years of age to register and participate in tournaments on BGL. By creating an account, you confirm that the information you provide is accurate and complete. BGL reserves the right to verify eligibility at any time.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">3. Tournament Registration & Fees</h2>
            <p>Entry fees are non-refundable once a registration is submitted and payment is confirmed. Players are responsible for ensuring their payment screenshot is valid and transaction ID is visible. Fraudulent payment submissions will result in permanent account termination.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">4. Fair Play & Conduct</h2>
            <p>All participants are expected to compete with integrity. Any form of cheating, collusion, use of hacks/mods, or unsportsmanlike behavior will result in immediate disqualification and a permanent ban. BGL's admin decisions are final.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">5. Prize Distribution</h2>
            <p>Prizes are distributed to verified winners within 24–48 hours of match completion via UPI/bank transfer. Winners must provide valid payment details. BGL is not liable for delays caused by incorrect payment information provided by the winner.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">6. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account. BGL will never ask for your Google password. You must notify us immediately if you suspect unauthorized access to your account.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">7. Limitation of Liability</h2>
            <p>BGL shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform, including technical issues, server downtime, or tournament cancellations due to force majeure events.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">8. Contact</h2>
            <p>For any queries regarding these Terms, contact us at <a href="mailto:worktoearn@gmail.com" className="text-neon-cyan hover:underline">worktoearn@gmail.com</a>, reach us on WhatsApp: <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">+91 7488168228</a> or reach us on Telegram at <a href="https://t.me/freefire_tounamentt" className="text-neon-cyan hover:underline">t.me/freefire_tounamentt</a>.</p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
