import type { Metadata } from "next";
import { Poppins, Urbanist } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Plannosaur - AI-Powered Planner Waitlist",
  description: "Join the waitlist for the world's first AI planner that adapts to your personality. Get 20% off launch pricing and early access!",
  keywords: ["AI planner", "personality planner", "productivity", "goal setting", "waitlist"],
  // Add favicon metadata
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Plannosaur - Stop Abandoning Planners After 3 Weeks",
    description: "Get the world's first AI planner that adapts to your personality. First 100 signups get 20% off!",
    type: "website",
    url: "https://plannosaur.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plannosaur - AI-Powered Planner",
    description: "Stop abandoning planners after 3 weeks. Get early access with 20% off!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body
        className={`${poppins.variable} ${urbanist.variable} antialiased font-poppins`}
      >
        {children}
      </body>
    </html>
  );
}