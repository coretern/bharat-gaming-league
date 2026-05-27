import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import TermsContent from "@/components/terms/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service | Bharat Gaming League",
  description: "Read the Terms of Service for Bharat Gaming League tournaments.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 bg-dot-grid relative pt-32 pb-24 overflow-x-hidden">
      <Navbar />

      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <TermsContent />

      <Footer />
    </main>
  );
}

