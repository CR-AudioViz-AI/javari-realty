'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, Mail, Phone, MapPin, DollarSign, Home, MessageSquare } from 'lucide-react'

const AREAS = ['Naples', 'Fort Myers', 'Cape Coral', 'Bonita Springs', 'Marco Island', 'Estero', 'Lehigh Acres', 'Golden Gate Estates']
const BUDGET_RANGES = ['Under $300K', '$300K-$400K', '$400K-$500K', '$500K-$750K', '$750K-$1M', '$1M-$2M', '$2M+']
const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land', 'Commercial']
const LEAD_SOURCES = ['Website', 'Zillow', 'Realtor.com', 'Referral', 'Open House', 'Facebook', 'Instagram', 'Google Ads', 'Cold Call', 'Other']
const TIMELINE = ['ASAP', '1-3 months', '3-6 months', '6-12 months', 'Just browsing']

export default function AddLeadPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredAreas: [] as string[],
    budget: '',
    propertyType: '',
    source: '',
    timeline: '',
    preApproved: false,
    notes: ''
  })

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAreas: prev.preferredAreas.includes(area)
        ? prev.preferredAreas.filter(a => a !== area)
        : [...prev.preferredAreas, area]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In production, this would save to Supabase
    console.log('Lead data:', formData)
    
    alert('Lead added successfully!')
    router.push('/dashboard/leads')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/leads" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Add New Lead</h1>
              <p className="text-gray-500">Enter client information</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.firstName || !formData.lastName}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(239) 555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                <select
                  value={formData.source}
                  onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select source...</option>
                  {LEAD_SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Property Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Preferred Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map(area => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleAreaToggle(area)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.preferredAreas.includes(area)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget...</option>
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={e => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                <select
                  value={formData.timeline}
                  onChange={e => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline...</option>
                  {TIMELINE.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="preApproved"
                  checked={formData.preApproved}
                  onChange={e => setFormData(prev => ({ ...prev, preApproved: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="preApproved" className="text-sm text-gray-700">Pre-approved for mortgage</label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Notes
            </h2>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this lead..."
            />
          </div>
        </div>

        {/* Mobile Submit Button */}
        <div className="mt-6 lg:hidden">
          <button
            type="submit"
            disabled={saving || !formData.firstName || !formData.lastName}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  )
}
