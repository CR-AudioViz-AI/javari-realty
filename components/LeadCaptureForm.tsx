// components/LeadCaptureForm.tsx
// Lead Capture Form - Routes to Agent Based on Specialty

'use client'

import { useState } from 'react'
import { Mail, Phone, User, MessageSquare, CheckCircle } from 'lucide-react'

interface LeadCaptureFormProps {
  propertyId: string
  propertyAddress: string
}

export default function LeadCaptureForm({ propertyId, propertyAddress }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest_type: 'general', // Will route based on property tags
    preferred_contact: 'email'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId,
          property_address: propertyAddress,
          source: 'homefinder',
          captured_at: new Date().toISOString()
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Track conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'lead_captured', {
            property_id: propertyId,
            source: 'homefinder'
          })
        }
      }
    } catch (error) {
      console.error('Lead capture failed:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">A local agent will contact you within 2 hours.</p>
        <p className="text-sm text-gray-500">Check your email for confirmation</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Your Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          placeholder="John Smith"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          placeholder="john@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Phone Number *
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Preferred Contact Method
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="email"
              checked={formData.preferred_contact === 'email'}
              onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
              className="mr-2"
            />
            <span className="text-sm">Email</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="phone"
              checked={formData.preferred_contact === 'phone'}
              onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
              className="mr-2"
            />
            <span className="text-sm">Phone</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="text"
              checked={formData.preferred_contact === 'text'}
              onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
              className="mr-2"
            />
            <span className="text-sm">Text</span>
          </label>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Message (Optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          placeholder="When would you like to schedule a showing?"
          rows={3}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Connecting...' : 'Contact Agent'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to be contacted by a real estate professional
      </p>
    </form>
  )
}
