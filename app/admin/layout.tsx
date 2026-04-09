import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Bharat Gaming League Admin Panel",
  robots: { index: false, follow: false }, // Private — no indexing
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
