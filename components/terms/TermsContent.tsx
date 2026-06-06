'use client';

import { FileText } from "lucide-react";

export default function TermsContent() {
  return (
    <div className="container mx-auto px-6 max-w-3xl relative z-10">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Terms of <span className="text-google-blue">Service</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">Last updated: April 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
        
        {[
          {
            title: "1. Acceptance of Terms",
            content: "By registering on Bharat Gaming League (BGL), you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes."
          },
          {
            title: "2. Eligibility",
            content: "You must be at least 13 years of age to register and participate in tournaments on BGL. By creating an account, you confirm that the information you provide is accurate and complete. BGL reserves the right to verify eligibility at any time."
          },
          {
            title: "3. Tournament Registration & Fees",
            content: "Entry fees are non-refundable once a registration is submitted and payment is confirmed. Players are responsible for ensuring their payment screenshot is valid and transaction ID is visible. Fraudulent payment submissions will result in permanent account termination."
          },
          {
            title: "4. Fair Play & Conduct",
            content: "All participants are expected to compete with integrity. Any form of cheating, collusion, use of hacks/mods, or unsportsmanlike behavior will result in immediate disqualification and a permanent ban. BGL's admin decisions are final."
          },
          {
            title: "5. Prize Distribution",
            content: "Prizes are distributed to verified winners within 24–48 hours of match completion via UPI/bank transfer. Winners must provide valid payment details. BGL is not liable for delays caused by incorrect payment information provided by the winner."
          },
          {
            title: "6. Account Responsibility",
            content: "You are responsible for maintaining the confidentiality of your account. BGL will never ask for your Google password. You must notify us immediately if you suspect unauthorized access to your account."
          },
          {
            title: "7. Limitation of Liability",
            content: "BGL shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform, including technical issues, server downtime, or tournament cancellations due to force majeure events."
          },
          {
            title: "8. Contact",
            content: "For any queries regarding these Terms, contact us at worktoearn@gmail.com, reach us on WhatsApp: +91 7488168228 or reach us on Telegram at t.me/freefire_tounamentt",
            isContactLink: true
          }
        ].map((sec, idx) => (
          <section 
            key={idx}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-slate-900 dark:text-white font-extrabold text-base mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-google-blue rounded-full" />
               {sec.title}
            </h2>
            {sec.isContactLink ? (
              <p>
                For any queries regarding these Terms, contact us at{" "}
                <a href="mailto:worktoearn@gmail.com" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  worktoearn@gmail.com
                </a>
                , reach us on WhatsApp:{" "}
                <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  +91 7488168228
                </a>{" "}
                or reach us on Telegram at{" "}
                <a href="https://t.me/freefire_tounamentt" target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  t.me/freefire_tounamentt
                </a>.
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">{sec.content}</p>
            )}
          </section>
        ))}

      </div>
    </div>
  );
}
