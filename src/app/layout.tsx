import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plannosaur - AI-Powered Planner Waitlist",
  description: "Join the waitlist for the world's first AI planner that adapts to your personality. Get 30% off launch pricing and early access!",
  keywords: ["AI planner", "personality planner", "productivity", "goal setting", "waitlist"],
  // Add favicon metadata
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Plannosaur - Stop Abandoning Planners After 3 Weeks",
    description: "Get the world's first AI planner that adapts to your personality. First 100 signups get 30% off!",
    type: "website",
    url: "https://plannosaur.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plannosaur - AI-Powered Planner",
    description: "Stop abandoning planners after 3 weeks. Get early access with 30% off!",
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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
