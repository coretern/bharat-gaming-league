import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bharat Gaming League",
  description: "Privacy Policy for Bharat Gaming League — how we collect, use, and protect your data.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-36 pb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
          Privacy <span className="text-neon-cyan">Policy</span>
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-foreground/70 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">1. Information We Collect</h2>
            <p>When you register on Bharat Gaming League, we collect the following information via Google OAuth: your name, email address, and profile picture. We also collect tournament registration data including team name, in-game UID, WhatsApp number, and payment screenshots.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To verify your identity and manage your account</li>
              <li>To process tournament registrations and verify payments</li>
              <li>To communicate match schedules and results via WhatsApp/Telegram</li>
              <li>To distribute prize winnings to verified winners</li>
              <li>To improve platform features and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely on MongoDB Atlas servers. Payment screenshots are stored on Cloudinary with access-controlled URLs. We do not store your Google password or any financial credentials. We implement industry-standard security measures to protect your data.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">4. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal data with third parties for advertising purposes. We may share data with our payment processing and hosting partners solely to operate the platform. Admin team members have access to registration data strictly for tournament management.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">5. Cookies</h2>
            <p>BGL uses session cookies to keep you logged in via NextAuth. These cookies are essential for the platform to function and do not track you across other websites. You may disable cookies in your browser settings, but this may prevent login functionality.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">6. Your Rights</h2>
            <p>You have the right to request deletion of your account and associated data at any time. Contact us at <a href="mailto:support@bharatgamingleague.in" className="text-neon-cyan hover:underline">support@bharatgamingleague.in</a> and we will process your request within 7 business days.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm mb-3">8. Contact</h2>
            <p>For privacy-related queries, contact: <a href="mailto:support@bharatgamingleague.in" className="text-neon-cyan hover:underline">support@bharatgamingleague.in</a></p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
