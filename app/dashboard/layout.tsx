import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your Bharat Gaming League profile, track your tournament registrations, and manage your gaming journey from your personal dashboard.",
  robots: { index: false, follow: false }, // Private — no indexing
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
