import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://plannosaur.com"),
  title: "Plannosaur - AI-Powered Planner Waitlist",
  description:
    "Join the waitlist for the world's first AI planner that adapts to your personality. Get 30% off launch pricing and early access!",
  keywords: [
    "AI planner",
    "personality planner",
    "productivity",
    "goal setting",
    "waitlist",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Plannosaur - Stop Abandoning Planners After 3 Weeks",
    description:
      "Get the world's first AI planner that adapts to your personality. First 100 signups get 30% off!",
    type: "website",
    url: "https://plannosaur.com",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Plannosaur AI-Powered Planner Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plannosaur - AI-Powered Planner",
    description:
      "Stop abandoning planners after 3 weeks. Get early access with 30% off!",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
