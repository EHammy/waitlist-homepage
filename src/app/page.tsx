"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa'

// Animation Variants - FIXED (removed transition from variants)
const headingParent = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const headingChild = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [particles, setParticles] = useState<{ left: string; top: string }[]>([])

  // Generate stable particle positions on client only
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }))
    setParticles(newParticles)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      if (response.ok) {
        setStatus('success')
        setMessage("You're on the waitlist!")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Please try again')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c3427] via-[#1a4a3a] to-black flex items-center justify-center relative overflow-hidden">
        {/* Background Orb */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#d3a749]/20 to-transparent rounded-full blur-3xl" />

        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-md mx-auto px-8 relative z-10"
        >
          <CheckCircle className="w-16 h-16 text-[#d3a749] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4 font-urbanist">You're In!</h1>
          <p className="text-gray-300 mb-8 leading-relaxed font-poppins">
            We'll notify you as soon as Plannosaur launches.
            <br />
            <span className="text-[#d3a749] font-medium">Novemeber 13th, 2025</span>
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-gradient-to-r from-[#d3a749] to-[#f4e5a1] text-[#0c3427] px-8 py-3 rounded-full font-semibold hover:from-[#f4e5a1] hover:to-[#d3a749] transition-all duration-300 transform hover:scale-105 font-poppins"
          >
            Add Another Email
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c3427] via-[#1a4a3a] to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orb */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#d3a749]/20 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Particles */}
      {particles.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#d3a749]/30 rounded-full"
          style={{ left: pos.left, top: pos.top }}
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Logo + Branding */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col items-center space-y-6 mb-4">
            {/* SMALLER LOGO - Fixed the green circle issue */}
            <motion.div 
              className="w-20 h-20 flex items-center justify-center"
              animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image 
                src="/logo.png"
                alt="Plannosaur Globe Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </motion.div>
            <div className="text-center">
              <div className="text-[#d3a749] font-bold text-3xl tracking-wide mb-2 font-urbanist">
                Plannosaur
              </div>
              <div className="text-[#d3a749]/60 text-base font-medium tracking-widest uppercase font-poppins">
                AI-Powered Planner
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Heading with stagger - FIXED */}
        <motion.h1
          variants={headingParent}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
          className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight font-urbanist"
        >
          <motion.div 
            variants={headingChild}
            transition={{ ease: "easeOut", duration: 0.6 }}
          >
            Stop Abandoning
          </motion.div>
          <motion.div 
            variants={headingChild}
            transition={{ ease: "easeOut", duration: 0.6 }}
            className="text-[#d3a749]"
          >
            Planners After
          </motion.div>
          <motion.div 
            variants={headingChild}
            transition={{ ease: "easeOut", duration: 0.6 }}
            className="text-[#f4e5a1] italic font-light"
          >
            3 Weeks
          </motion.div>
        </motion.h1>

        {/* Subtitle - UPDATED WITH NEW PRICING */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-poppins"
        >
          Get the world's first{" "}
          <span className="text-[#d3a749] font-semibold">AI-powered planner</span>{" "}
          that adapts to <span className="italic">your personality</span>.
          <span className="block mt-4 text-[#f4e5a1] font-medium text-lg">
            First 100 signups get <span className="underline">30% off</span> launch pricing and early access!
          </span>
        </motion.p>

        {/* Waitlist Form - UPDATED BUTTON TEXT */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          {status === 'error' && (
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
              disabled={status === 'loading'}
              className="bg-gradient-to-r from-[#d3a749] to-[#f4e5a1] text-[#0c3427] px-8 py-4 rounded-full font-semibold hover:from-[#f4e5a1] hover:to-[#d3a749] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-poppins"
            >
              {status === 'loading' ? (
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
        </motion.div>

        {/* Footer with gold icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="mt-16 text-center"
        >
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
        </motion.div>
      </div>
    </div>
  )
}
