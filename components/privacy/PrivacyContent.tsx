'use client';

import { Shield } from "lucide-react";

export default function PrivacyContent() {
  return (
    <div className="container mx-auto px-6 max-w-3xl relative z-10">
      
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-google-blue dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <Shield className="w-3.5 h-3.5" /> Security
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Privacy <span className="text-google-blue">Policy</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">Last updated: April 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
        
        {[
          {
            title: "1. Information We Collect",
            content: "When you register on Bharat Gaming League, we collect the following information via Google OAuth: your name, email address, and profile picture. We also collect tournament registration data including team name, in-game UID, WhatsApp number, and payout QR codes."
          },
          {
            title: "2. How We Use Your Information",
            isList: true,
            items: [
              "To verify your identity and manage your account",
              "To process tournament registrations and verify payments",
              "To communicate match schedules and results via WhatsApp/Telegram",
              "To distribute prize winnings to verified winners",
              "To improve platform features and user experience"
            ]
          },
          {
            title: "3. Data Storage & Security",
            content: "Your data is stored securely on MongoDB Atlas servers. Payout QR codes are stored on Cloudinary with access-controlled URLs. We do not store your Google password or any financial credentials. We implement industry-standard security measures to protect your data."
          },
          {
            title: "4. Data Sharing",
            content: "We do not sell, rent, or share your personal data with third parties for advertising purposes. We may share data with our payment processing and hosting partners solely to operate the platform. Admin team members have access to registration data strictly for tournament management."
          },
          {
            title: "5. Cookies",
            content: "BGL uses session cookies to keep you logged in via NextAuth. These cookies are essential for the platform to function and do not track you across other websites. You may disable cookies in your browser settings, but this may prevent login functionality."
          },
          {
            title: "6. Your Rights",
            content: "You have the right to request deletion of your account and associated data at any time. Contact us at worktoearn@gmail.com and we will process your request within 7 business days.",
            isEmailLink: true
          },
          {
            title: "7. Changes to This Policy",
            content: "We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy."
          },
          {
            title: "8. Contact",
            content: "For privacy-related queries, contact: worktoearn@gmail.com or WhatsApp: +91 7488168228",
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
            {sec.isList ? (
              <ul className="list-disc list-inside space-y-2 text-slate-500 dark:text-slate-400">
                {sec.items?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : sec.isEmailLink ? (
              <p>
                You have the right to request deletion of your account and associated data at any time. Contact us at{" "}
                <a href="mailto:worktoearn@gmail.com" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  worktoearn@gmail.com
                </a>{" "}
                and we will process your request within 7 business days.
              </p>
            ) : sec.isContactLink ? (
              <p>
                For privacy-related queries, contact:{" "}
                <a href="mailto:worktoearn@gmail.com" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  worktoearn@gmail.com
                </a>{" "}
                or WhatsApp:{" "}
                <a href="https://wa.me/917488168228" target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 font-bold transition-colors">
                  +91 7488168228
                </a>
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
