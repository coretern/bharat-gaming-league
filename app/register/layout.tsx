import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Registration",
  description: "Register your team for BGMI and Free Fire tournaments on Bharat Gaming League. Fill in your details, upload payment proof, and secure your slot now.",
  keywords: ["tournament registration", "BGMI team registration", "Free Fire register", "esports team India", "BGL register"],
  openGraph: {
    title: "Team Registration | Bharat Gaming League",
    description: "Secure your tournament slot on Bharat Gaming League. Register your team for BGMI and Free Fire competitions.",
    images: [{ url: "/ff-thumb.png", width: 1200, height: 630, alt: "Register for Bharat Gaming League Tournament" }],
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
