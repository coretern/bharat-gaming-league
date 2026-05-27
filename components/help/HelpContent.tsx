'use client';

import { MessageSquare, Mail, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I register for a tournament?",
    a: "Go to the Tournaments page, select a tournament, and click Register. You'll need to log in with Google, fill in your team details (team name, in-game UID, WhatsApp), and complete the secure payment process."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major UPI apps (GPay, PhonePe, Paytm) via our secure payment gateway. Your registration will be automatically verified once the transaction is complete."
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

export default function HelpContent() {
  return (
    <div className="container mx-auto px-6 max-w-3xl relative z-10">
      
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <HelpCircle className="w-3.5 h-3.5" /> Support
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Help <span className="text-google-blue">Center</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">
          Find answers to the most common questions below.
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-slate-855 dark:text-slate-200 font-bold text-sm md:text-base mb-2">
              Q: {faq.q}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Support Card */}
      <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl text-center shadow-sm">
        <h2 className="text-slate-900 dark:text-white font-extrabold tracking-tight text-lg mb-2">Still need help?</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6 font-medium">Our support team is available Mon–Sat, 10am–8pm.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/917488168228" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp Support
          </a>
          <a 
            href="mailto:worktoearn@gmail.com"
            className="px-6 py-3 bg-google-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" /> Email Us
          </a>
        </div>
      </div>

    </div>
  );
}
