"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Head from "next/head";
import { FaInstagram, FaPinterestP, FaTiktok } from "react-icons/fa";

// Animation Variants
const headingParent = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const headingChild = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [particles, setParticles] = useState<{ left: string; top: string }[]>([]);

  // Generate stable particle positions
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setMessage("You're on the waitlist!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Please try again");
    }
  };

  // ========= Structured data (JSON-LD) =========
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Plannosaur – AI-Powered Physical Planner",
    image: ["https://plannosaur.com/logo.png"],
    description:
      "A psychology-backed physical planner you design online with AI. Tailored to your personality—especially helpful if you have ADHD, struggle with discipline or motivation, or identify as Type B.",
    brand: { "@type": "Brand", name: "Plannosaur" },
    category: "OfficeProduct",
    material: "Paper",
    audience: {
      "@type": "PeopleAudience",
      audienceType: "Adults",
      // Using 'additionalProperty' to describe fit-for profiles
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Designed for",
          value: "ADHD, Type B personalities, low-motivation / discipline struggles"
        }
      ]
    },
    // Pre-order offer for launch
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "TBD",
      availability: "https://schema.org/PreOrder",
      url: "https://plannosaur.com"
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Approach",
        value: "Psychology-backed; AI-personalized layout and routines"
      }
    ]
  };

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Plannosaur Launch",
    startDate: "2025-11-13T00:00:00-05:00",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: "https://plannosaur.com" },
    image: ["https://plannosaur.com/logo.png"],
    description:
      "Launch of Plannosaur, the psychology-backed, AI-powered physical planner you design online. Built for ADHD, Type B personalities, and anyone who struggles with motivation or discipline. Join the waitlist for 30% off.",
    organizer: { "@type": "Organization", name: "Plannosaur", url: "https://plannosaur.com" }
  };

  return (
    <>
      {/* ======= SEO Meta ======= */}
      <Head>
        <title>Plannosaur – Psychology-Backed AI Physical Planner Built Online | 30% Off</title>
        <meta
          name="description"
          content="Join the waitlist for Plannosaur, a psychology-backed, AI-powered physical planner that you design online. Built for ADHD, Type B personalities, and anyone who struggles with discipline or motivation. Get 30% off launch pricing."
        />
        <meta
          name="keywords"
          content="AI physical planner, ADHD planner, Type B planner, psychology-backed planner, online planner builder, motivation, discipline, productivity tool, goal setting, Plannosaur"
        />
        <meta property="og:title" content="Plannosaur – AI Physical Planner (Psychology-Backed)" />
        <meta
          property="og:description"
          content="Design your psychology-backed physical planner online with AI. Great for ADHD, Type B, and anyone who struggles with motivation or discipline. Join the waitlist for 30% off."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://plannosaur.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Plannosaur – AI Physical Planner (Psychology-Backed)" />
        <meta
          name="twitter:description"
          content="A physical planner you design online with AI. Psychology-backed for ADHD, Type B, and low-motivation struggles. 30% off for early access."
        />
        <meta name="twitter:image" content="/logo.png" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      </Head>

      {status === "success" ? (
        <main className="min-h-screen bg-gradient-to-b from-[#0c3427] via-[#1a4a3a] to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#d3a749]/20 to-transparent rounded-full blur-3xl" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-md mx-auto px-8 relative z-10"
          >
            <CheckCircle className="w-16 h-16 text-[#d3a749] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4 font-urbanist">You&apos;re In!</h1>
            <p className="text-gray-300 mb-8 leading-relaxed font-poppins">
              We&apos;ll notify you as soon as Plannosaur launches.
              <br />
              <span className="text-[#d3a749] font-medium">November 13th, 2025</span>
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="bg-gradient-to-r from-[#d3a749] to-[#f4e5a1] text-[#0c3427] px-8 py-3 rounded-full font-semibold hover:from-[#f4e5a1] hover:to-[#d3a749] transition-all duration-300 transform hover:scale-105 font-poppins"
            >
              Add Another Email
            </button>
          </motion.div>
        </main>
      ) : (
        <main className="min-h-screen bg-gradient-to-b from-[#0c3427] via-[#1a4a3a] to-black flex items-center justify-center relative overflow-hidden">
          {/* Background & Particles */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#d3a749]/20 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {particles.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#d3a749]/30 rounded-full"
              style={{ left: pos.left, top: pos.top }}
              animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            {/* Logo */}
            <header className="mb-8">
              <div className="flex flex-col items-center space-y-6 mb-4">
                <motion.div
                  className="w-20 h-20 flex items-center justify-center"
                  animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/logo.png"
                    alt="Plannosaur Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>
                <div className="text-center">
                  <h1 className="text-[#d3a749] font-bold text-3xl tracking-wide mb-2 font-urbanist">
                    Plannosaur
                  </h1>
                  <p className="text-[#d3a749]/60 text-base font-medium tracking-widest uppercase font-poppins">
                    AI-Powered Physical Planner
                  </p>
                </div>
              </div>
            </header>

            {/* Main Headline */}
            <motion.h2
              variants={headingParent}
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.15 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight font-urbanist"
            >
              <motion.span variants={headingChild} transition={{ ease: "easeOut", duration: 0.6 }}>
                Stop Abandoning
              </motion.span>
              <motion.span variants={headingChild} transition={{ ease: "easeOut", duration: 0.6 }} className="block text-[#d3a749]">
                Planners After
              </motion.span>
              <motion.span variants={headingChild} transition={{ ease: "easeOut", duration: 0.6 }} className="block text-[#f4e5a1] italic font-light">
                3 Weeks
              </motion.span>
            </motion.h2>

            <motion.div
  initial={{ y: 30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
  className="mx-auto mb-12 max-w-3xl text-center font-poppins"
>
  {/* Lead copy */}
  <p className="text-[1.25rem] md:text-[1.35rem] leading-relaxed text-gray-200">
    Get the world’s first{" "}
    <span className="font-semibold text-[#d3a749]">
      psychology-backed, AI-powered <span className="whitespace-nowrap">physical planner</span>
    </span>{" "}
    that you design online — and that adapts to{" "}
    <span className="italic">your personality</span>.
  </p>

  {/* Sub line */}
  <p className="mt-3 text-gray-300">
    Purpose-built to help you actually stick with it.
  </p>

  {/* Audience chips */}
  <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-[#f4e5a1] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur">
      <span className="i"></span> ADHD-friendly
    </span>
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-[#f4e5a1] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur">
      <span className="i"></span> Type-B supportive
    </span>
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-[#f4e5a1] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur">
      <span className="i"></span> Beat motivation & discipline dips
    </span>
  </div>

{/* Offer bar */}
<div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#d3a749]/40 bg-[#d3a749]/10 px-5 py-2 text-base text-[#f4e5a1]">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-[#d3a749]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>
    First 100 signups get{" "}
    <span className="underline underline-offset-2 decoration-[#f4e5a1] font-semibold">30% off</span>{" "}
    launch pricing & early access
  </span>
</div>



            {/* Waitlist Form */}
            <section className="max-w-md mx-auto">
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-full mb-6 text-sm font-poppins"
                >
                  {message}
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d3a749] focus:border-transparent transition-all duration-300 font-poppins"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-gradient-to-r from-[#d3a749] to-[#f4e5a1] text-[#0c3427] px-8 py-4 rounded-full font-semibold hover:from-[#f4e5a1] hover:to-[#d3a749] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-poppins"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Get 30% Off</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-center">
              <div className="flex justify-center space-x-6">
                <a href="https://instagram.com/plannosaur.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram className="w-6 h-6 text-[#d3a749] hover:text-white transition-colors duration-300" />
                </a>
                <a href="https://pinterest.com/PlannosaurOfficial" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <FaPinterestP className="w-6 h-6 text-[#d3a749] hover:text-white transition-colors duration-300" />
                </a>
                <a href="https://tiktok.com/@plannosaur.official" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <FaTiktok className="w-6 h-6 text-[#d3a749] hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </footer>
          </div>
        </main>
      )}
    </>
  );
}
