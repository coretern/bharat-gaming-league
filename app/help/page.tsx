import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | Bharat Gaming League",
  description: "Find answers to common questions about Bharat Gaming League tournaments, registration, and prizes.",
  robots: { index: true, follow: true },
};

const faqs = [
  {
    q: "How do I register for a tournament?",
    a: "Go to the Tournaments page, select a tournament, and click Register. You'll need to log in with Google, fill in your team details (team name, in-game UID, WhatsApp), and upload a screenshot of your entry fee payment."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI payments (GPay, PhonePe, Paytm). After paying, take a screenshot showing the transaction ID and amount, then upload it during registration."
  },
  {
    q: "How long does registration approval take?",
    a: "Our admin team verifies registrations within 2–6 hours during active hours (10am–8pm). You'll receive confirmation on WhatsApp once approved."
  },
  {
    q: "Can I get a refund on my entry fee?",
    a: "Entry fees are non-refundable once registration is submitted. Refunds are only issued if BGL cancels the tournament."
  },
  {
    q: "How will I receive the lobby code?",
    a: "Lobby codes are shared 15 minutes before match time via the WhatsApp group or our Telegram channel. Make sure to join our Telegram: t.me/freefire_tounamentt"
  },
  {
    q: "How are prizes paid out?",
    a: "Prizes are transferred within 24 hours of the match via UPI to the phone number you provided during registration. Please ensure your UPI ID/number is active and correct."
  },
  {
    q: "What happens if I disconnect during a match?",
    a: "Disconnections are not grounds for a rematch unless a server-side issue is confirmed by our admins. Make sure you have a stable internet connection before the match."
  },
  {
    q: "What if I suspect a player of cheating?",
    a: "Report suspected cheaters immediately to our admin team via Telegram with video/screenshot evidence. We take all reports seriously and investigate within 12 hours."
  },
  {
    q: "How do I join the tournament WhatsApp/Telegram group?",
    a: "After your registration is approved, the admin will add you to the relevant WhatsApp group or share the Telegram link. You can also join our main channel: t.me/freefire_tounamentt"
  },
  {
    q: "Can one player register in multiple teams?",
    a: "No. A single player (identified by their in-game UID) can only be registered in one team per tournament. Duplicate registrations will result in disqualification."
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
          Help <span className="text-neon-cyan">Center</span>
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Find answers to the most common questions below.</p>

        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card p-6">
              <h3 className="text-foreground font-black text-sm uppercase tracking-wide mb-2">
                Q: {faq.q}
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-8 text-center">
          <h2 className="text-foreground font-black uppercase tracking-tight text-lg mb-2">Still need help?</h2>
          <p className="text-foreground/50 text-sm mb-5">Our support team is available Mon–Sat, 10am–8pm.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer"
              className="btn-outline px-8 py-2.5 text-sm font-black uppercase tracking-widest inline-block border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
              WhatsApp Support
            </a>
            <a href="mailto:worktoearn@gmail.com"
              className="btn-outline px-8 py-2.5 text-sm font-black uppercase tracking-widest inline-block">
              Email Us
            </a>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
