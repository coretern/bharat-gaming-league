import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import RulesContent from "@/components/rules/RulesContent";

export const metadata: Metadata = {
  title: "Rules & Regulations | Bharat Gaming League",
  description: "Official tournament rules and regulations for Bharat Gaming League BGMI and Free Fire competitions.",
  robots: { index: true, follow: true },
};

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 bg-dot-grid relative pt-32 pb-24">
      <Navbar />

      <div className="absolute top-20 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

      <RulesContent />

      <Footer />
    </main>
  );
}

