// src/app/page.tsx
"use client"

import { useState } from 'react'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
    } catch {
      setStatus('error')
      setMessage('Please try again')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">You're In! ✅</h1>
          <p className="mb-8">We'll notify you when Plannosaur launches.</p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold"
          >
            Add Another Email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Plannosaur Waitlist</h1>
        <p className="mb-8">Get 30% off launch pricing!</p>
        
        {status === 'error' && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded text-black"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-yellow-500 text-black px-6 py-3 rounded font-semibold disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Get 30% Off'}
          </button>
        </form>
      </div>
    </div>
  )
}
