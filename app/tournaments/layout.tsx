import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Tournaments",
  description: "Browse all upcoming BGMI and Free Fire tournaments on Bharat Gaming League. Filter by game, prize pool, and date. Register your team and compete today.",
  keywords: ["BGMI tournaments list", "Free Fire tournaments 2026", "esports tournaments India", "mobile gaming India", "online tournament registration"],
  openGraph: {
    title: "Browse Tournaments | Bharat Gaming League",
    description: "Find the perfect BGMI or Free Fire tournament for your team. Massive prize pools. Register now.",
    images: [{ url: "/bgmi-thumb.png", width: 1200, height: 630, alt: "Bharat Gaming League Tournaments" }],
  },
};

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
