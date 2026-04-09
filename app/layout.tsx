import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import SessionChecker from "@/components/SessionChecker";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-gaming",
});

export const metadata: Metadata = {
  title: {
    default: "Bharat Gaming League | #1 BGMI & Free Fire Tournament Platform",
    template: "%s | Bharat Gaming League",
  },
  description: "Join India's biggest esports tournament platform. Compete in BGMI and Free Fire tournaments, win massive prize pools, and rise to the top of the leaderboard.",
  keywords: ["BGMI tournament", "Free Fire tournament", "esports India", "mobile gaming tournament", "Bharat Gaming League", "BGL", "online gaming competition", "prize pool India"],
  authors: [{ name: "Bharat Gaming League" }],
  creator: "Bharat Gaming League",
  metadataBase: new URL("https://bharatgamingleague.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bharatgamingleague.vercel.app",
    siteName: "Bharat Gaming League",
    title: "Bharat Gaming League | #1 BGMI & Free Fire Tournament Platform",
    description: "India's most elite esports tournament platform. Compete in BGMI and Free Fire. Win big, play hard.",
    images: [{ url: "/bgmi-thumb.png", width: 1200, height: 630, alt: "Bharat Gaming League" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat Gaming League | #1 BGMI & Free Fire Tournament Platform",
    description: "India's most elite esports tournament platform. Compete in BGMI and Free Fire. Win big, play hard.",
    images: ["/bgmi-thumb.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "6-2YsSbv2RS6QhTItYR1F3sfxxMXvtDHHVl_-QtmIvw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-gaming antialiased bg-background text-foreground min-h-screen transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SessionChecker />
            <Toaster position="top-right" />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
