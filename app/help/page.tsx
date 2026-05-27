import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import HelpContent from "@/components/help/HelpContent";

export const metadata: Metadata = {
  title: "Help Center | Bharat Gaming League",
  description: "Find answers to common questions about Bharat Gaming League tournaments, registration, and prizes.",
  robots: { index: true, follow: true },
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 bg-dot-grid relative pt-32 pb-24 overflow-x-hidden">
      <Navbar />

      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <HelpContent />

      <Footer />
    </main>
  );
}

