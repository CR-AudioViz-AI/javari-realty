// components/home-valuation.tsx
// "What's My Home Worth?" valuation widget
// Created: December 1, 2025 - 2:40 PM EST

'use client'

import { useState } from 'react'
import { Home, MapPin, DollarSign, TrendingUp, Loader2, CheckCircle, ArrowRight } from 'lucide-react'

interface ValuationResult {
  estimatedValue: number
  lowRange: number
  highRange: number
  confidence: number
  comparables: number
  lastUpdated: string
}

interface HomeValuationProps {
  onComplete?: (data: { address: string; email: string; phone?: string }) => void
  agentId?: string
  className?: string
}

export default function HomeValuation({ onComplete, agentId, className = '' }: HomeValuationProps) {
  const [step, setStep] = useState<'address' | 'details' | 'contact' | 'result'>('address')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  })
  const [details, setDetails] = useState({
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: '',
    yearBuilt: '',
    propertyType: 'single_family',
    condition: 'good',
  })
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [result, setResult] = useState<ValuationResult | null>(null)

  const handleAddressSubmit = () => {
    if (address.street && address.city && address.state && address.zip) {
      setStep('details')
    }
  }

  const handleDetailsSubmit = () => {
    setStep('contact')
  }

  const handleContactSubmit = async () => {
    setLoading(true)
    
    // Simulate valuation calculation (in production, call actual API)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate estimated value based on inputs
    const sqft = parseInt(details.squareFeet) || 1800
    const basePrice = sqft * 250 // Base price per sqft
    
    // Adjustments
    let adjustment = 1.0
    if (details.condition === 'excellent') adjustment *= 1.15
    if (details.condition === 'fair') adjustment *= 0.85
    if (details.bedrooms >= 4) adjustment *= 1.05
    if (details.bathrooms >= 3) adjustment *= 1.03
    
    const yearBuilt = parseInt(details.yearBuilt) || 1990
    if (yearBuilt >= 2010) adjustment *= 1.1
    if (yearBuilt < 1970) adjustment *= 0.9

    const estimatedValue = Math.round(basePrice * adjustment)
    
    setResult({
      estimatedValue,
      lowRange: Math.round(estimatedValue * 0.92),
      highRange: Math.round(estimatedValue * 1.08),
      confidence: 85,
      comparables: 12,
      lastUpdated: new Date().toLocaleDateString(),
    })

    setLoading(false)
    setStep('result')

    // Callback with lead info
    if (onComplete) {
      onComplete({
        address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
        email: contact.email,
        phone: contact.phone,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`bg-white rounded-xl border shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Home className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">What's My Home Worth?</h2>
        </div>
        <p className="text-emerald-100 text-sm">Get a free, instant home valuation estimate</p>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-3 bg-gray-50 border-b">
        <div className="flex items-center justify-between text-sm">
          {['Address', 'Details', 'Contact', 'Result'].map((label, idx) => {
            const stepOrder = ['address', 'details', 'contact', 'result']
            const currentIdx = stepOrder.indexOf(step)
            const isComplete = idx < currentIdx
            const isCurrent = idx === currentIdx

            return (
              <div key={label} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isComplete ? 'bg-emerald-500 text-white' :
                  isCurrent ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`ml-2 hidden sm:inline ${isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  {label}
                </span>
                {idx < 3 && <ArrowRight className="w-4 h-4 mx-2 text-gray-300" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Address */}
        {step === 'address' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="FL"
                  maxLength={2}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="33901"
                  maxLength={5}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddressSubmit}
              disabled={!address.street || !address.city || !address.state || !address.zip}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Property Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  value={details.bedrooms}
                  onChange={(e) => setDetails({ ...details, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  value={details.bathrooms}
                  onChange={(e) => setDetails({ ...details, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                <input
                  type="number"
                  value={details.squareFeet}
                  onChange={(e) => setDetails({ ...details, squareFeet: e.target.value })}
                  placeholder="2,000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                <input
                  type="number"
                  value={details.yearBuilt}
                  onChange={(e) => setDetails({ ...details, yearBuilt: e.target.value })}
                  placeholder="1995"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={details.propertyType}
                onChange={(e) => setDetails({ ...details, propertyType: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="single_family">Single Family Home</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="multi_family">Multi-Family</option>
                <option value="mobile">Mobile/Manufactured</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <div className="grid grid-cols-4 gap-2">
                {['poor', 'fair', 'good', 'excellent'].map(cond => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setDetails({ ...details, condition: cond })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize border ${
                      details.condition === cond
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('address')}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleDetailsSubmit}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 'contact' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter your contact information to receive your free home valuation report.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleContactSubmit}
                disabled={!contact.email || loading}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Get My Valuation'
                )}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted about your property valuation.
            </p>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && result && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <p className="text-sm text-emerald-600 font-medium mb-2">Estimated Home Value</p>
              <p className="text-4xl font-bold text-emerald-700 mb-2">
                {formatCurrency(result.estimatedValue)}
              </p>
              <p className="text-sm text-gray-500">
                Range: {formatCurrency(result.lowRange)} - {formatCurrency(result.highRange)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{result.confidence}%</p>
                <p className="text-xs text-gray-500">Confidence</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{result.comparables}</p>
                <p className="text-xs text-gray-500">Comparables</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{result.lastUpdated}</p>
                <p className="text-xs text-gray-500">Updated</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Want a more accurate valuation?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Schedule a free, no-obligation consultation with a local real estate expert 
                    for a detailed Comparative Market Analysis (CMA).
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('address')
                setResult(null)
                setAddress({ street: '', city: '', state: '', zip: '' })
              }}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Start New Valuation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
