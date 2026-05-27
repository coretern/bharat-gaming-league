'use client';

import { DollarSign } from "lucide-react";

export default function RefundContent() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl relative z-10">
      
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <DollarSign className="w-3.5 h-3.5" /> Finance
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Refund & <span className="text-google-blue">Cancellation</span> Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">Last updated: April 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
        
        {[
          {
            title: "1. General Policy",
            content: "All entry fees paid to Bharat Gaming League (BGL) are considered final upon submission. By registering for a tournament and paying the entry fee, you acknowledge and agree to this refund policy. BGL is committed to conducting all registered tournaments, and cancellations are extremely rare."
          },
          {
            title: "2. Non-Refundable Situations",
            isList: true,
            items: [
              "Player voluntarily withdraws from a tournament after registration",
              "Team fails to join the lobby on time and forfeits their slot",
              "Player or team is disqualified due to cheating, rule violations, or misconduct",
              "Player provides incorrect in-game UID or payment details leading to disqualification",
              "Player is unable to participate due to personal reasons (power cut, internet issues, etc.)",
              "Disputes raised after 30 minutes of match completion"
            ]
          },
          {
            title: "3. Refund Eligible Situations",
            isList: true,
            items: [
              "BGL cancels a tournament before it begins due to insufficient registrations",
              "A technical failure on BGL's platform prevents the tournament from being conducted",
              "A major server or game outage (confirmed by the game developer) forces cancellation",
              "Duplicate payment was charged by error — verified by admin"
            ]
          },
          {
            title: "4. Refund Process",
            isList: true,
            items: [
              "Contact us within 48 hours of the tournament cancellation on Telegram or email",
              "Provide your registered email, team name, and payment transaction ID",
              "Refunds are processed within 5–7 business days via the original payment method (UPI)",
              "BGL will confirm the refund initiation via WhatsApp or email"
            ]
          },
          {
            title: "5. Tournament Postponement",
            content: "If a tournament is postponed (not cancelled), entry fees are carried forward to the rescheduled date. Players who cannot participate on the new date can request a refund within 24 hours of the postponement announcement. After this window, the entry fee will not be refunded."
          },
          {
            title: "6. Prize Disputes",
            content: "Prize money disputes must be raised within 12 hours of the match result announcement via Telegram or email. BGL will review all disputes with match recordings and admin logs. Prize decisions once finalized by BGL admin are binding and non-negotiable."
          },
          {
            title: "7. Contact for Refund Requests",
            isContact: true
          }
        ].map((sec, idx) => (
          <section 
            key={idx}
            className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-slate-900 dark:text-white font-extrabold text-base mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-google-blue rounded-full" />
               {sec.title}
            </h2>
            {sec.isList ? (
              <ul className="list-disc list-inside space-y-2 text-slate-500 dark:text-slate-400">
                {sec.items?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : sec.isContact ? (
              <div className="space-y-2 text-slate-500 dark:text-slate-400 font-bold">
                <p>
                  📧 Email:{" "}
                  <a href="mailto:worktoearn@gmail.com" className="text-google-blue hover:text-blue-600 transition-colors">
                    worktoearn@gmail.com
                  </a>
                </p>
                <p>
                  📱 WhatsApp:{" "}
                  <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 transition-colors">
                    +91 7488168228
                  </a>
                </p>
                <p>
                  ✈️ Telegram:{" "}
                  <a href="https://t.me/freefire_tounamentt" target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 transition-colors">
                    t.me/freefire_tounamentt
                  </a>
                </p>
                <p className="text-slate-400 font-medium mt-2">🕐 Response Time: Within 24 hours (Mon–Sat, 10am–8pm)</p>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">{sec.content}</p>
            )}
          </section>
        ))}

      </div>
    </div>
  );
}
