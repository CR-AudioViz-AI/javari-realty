'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Camera,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Upload,
  MapPin,
  DollarSign,
  Home,
  Heart,
  Send,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Award,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Property {
  id: string
  address: string
  city: string
  state: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  photos: string[]
}

interface Photo {
  url: string
  caption: string
  room: string
  issue: boolean
}

export default function MobileWalkthroughPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const propertyId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [agentId, setAgentId] = useState<string | null>(null)
  const [showingId, setShowingId] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1=photos, 2=ratings, 3=comments, 4=interest, 5=review
  const [notification, setNotification] = useState<string | null>(null)

  // Feedback data
  const [photos, setPhotos] = useState<Photo[]>([])
  const [ratings, setRatings] = useState({
    overall: 0,
    location: 0,
    condition: 0,
    value: 0,
    layout: 0,
  })
  const [comments, setComments] = useState({
    likes: '',
    dislikes: '',
    questions: '',
    overall: '',
  })
  const [interest, setInterest] = useState({
    level: '',
    wouldRevisit: false,
  })

  const rooms = ['Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bathroom', 'Backyard', 'Garage', 'Other']

  useEffect(() => {
    loadData()
  }, [propertyId])

  async function loadData() {
    try {
      // Get property
      const { data: prop } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (prop) setProperty(prop as Property)

      // Get customer
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id, assigned_agent_id')
          .eq('id', session.user.id)
          .single()

        if (customer) {
          const c = customer as { id: string; assigned_agent_id?: string }
          setCustomerId(c.id)
          setAgentId(c.assigned_agent_id || null)

          // Check for active showing
          const { data: showing } = await supabase
            .from('showing_requests')
            .select('id')
            .eq('customer_id', c.id)
            .eq('property_id', propertyId)
            .eq('status', 'confirmed')
            .single()

          if (showing) setShowingId((showing as { id: string }).id)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      // In production, upload to Supabase Storage
      // For now, create local URL
      const url = URL.createObjectURL(file)
      setPhotos(prev => [...prev, { url, caption: '', room: '', issue: false }])
    }
  }

  function updatePhoto(index: number, updates: Partial<Photo>) {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p))
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  function RatingStars({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => onChange(star)}
              className="p-1 transition-transform active:scale-110"
            >
              <Star className={`w-10 h-10 ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  async function submitFeedback() {
    if (!customerId || !propertyId) return
    setSubmitting(true)

    try {
      const response = await fetch('/api/walkthrough', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          customer_id: customerId,
          agent_id: agentId,
          showing_id: showingId,
          overall_rating: ratings.overall,
          location_rating: ratings.location,
          condition_rating: ratings.condition,
          value_rating: ratings.value,
          layout_rating: ratings.layout,
          overall_comments: comments.overall,
          likes: comments.likes,
          dislikes: comments.dislikes,
          questions: comments.questions,
          photos: photos,
          interest_level: interest.level,
          would_revisit: interest.wouldRevisit,
        })
      })

      if (response.ok) {
        setNotification('Feedback submitted! Your agent has been notified.')
        setTimeout(() => {
          router.push('/customer/dashboard?tab=showings')
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 px-4 py-3 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <p className="font-semibold text-gray-900 truncate">{property?.address}</p>
              <p className="text-xs text-gray-500">Walkthrough Feedback</p>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Step {step} of 5: {['Photos', 'Ratings', 'Comments', 'Interest', 'Review'][step - 1]}
          </p>
        </div>
      </header>

      {/* Property Summary */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            {property?.photos?.[0] ? (
              <img src={property.photos[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <Home className="w-8 h-8 m-auto mt-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg text-gray-900">{formatPrice(property?.price || 0)}</p>
            <p className="text-sm text-gray-600">{property?.bedrooms} bed • {property?.bathrooms} bath • {property?.sqft?.toLocaleString()} sqft</p>
            <p className="text-xs text-gray-500 truncate">{property?.city}, {property?.state}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Step 1: Photos */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">📸 Capture Photos</h2>
            <p className="text-sm text-gray-500 mb-4">Take photos of features, issues, or anything noteworthy</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 flex items-center justify-center gap-2 text-blue-600 font-medium mb-4"
            >
              <Camera className="w-6 h-6" />
              Take Photo or Upload
            </button>

            {photos.length > 0 && (
              <div className="space-y-4">
                {photos.map((photo, index) => (
                  <div key={index} className="bg-white rounded-xl border overflow-hidden">
                    <div className="relative">
                      <img src={photo.url} alt="" className="w-full h-48 object-cover" />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 space-y-3">
                      <select
                        value={photo.room}
                        onChange={(e) => updatePhoto(index, { room: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Select Room</option>
                        {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updatePhoto(index, { caption: e.target.value })}
                        placeholder="Add caption..."
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={photo.issue}
                          onChange={(e) => updatePhoto(index, { issue: e.target.checked })}
                          className="w-5 h-5 rounded text-red-600"
                        />
                        <span className="text-sm text-red-600">Flag as issue/concern</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} added • You can skip if none needed
            </p>
          </div>
        )}

        {/* Step 2: Ratings */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">⭐ Rate This Property</h2>
            <p className="text-sm text-gray-500 mb-6">How would you rate each aspect?</p>

            <RatingStars label="Overall Impression" value={ratings.overall} onChange={(v) => setRatings(p => ({ ...p, overall: v }))} />
            <RatingStars label="Location & Neighborhood" value={ratings.location} onChange={(v) => setRatings(p => ({ ...p, location: v }))} />
            <RatingStars label="Property Condition" value={ratings.condition} onChange={(v) => setRatings(p => ({ ...p, condition: v }))} />
            <RatingStars label="Value for Price" value={ratings.value} onChange={(v) => setRatings(p => ({ ...p, value: v }))} />
            <RatingStars label="Layout & Flow" value={ratings.layout} onChange={(v) => setRatings(p => ({ ...p, layout: v }))} />
          </div>
        )}

        {/* Step 3: Comments */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">💬 Your Thoughts</h2>
            <p className="text-sm text-gray-500 mb-6">Share what you liked and didn't like</p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  What did you like?
                </label>
                <textarea
                  value={comments.likes}
                  onChange={(e) => setComments(p => ({ ...p, likes: e.target.value }))}
                  placeholder="Great natural light, updated kitchen..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  What didn't you like?
                </label>
                <textarea
                  value={comments.dislikes}
                  onChange={(e) => setComments(p => ({ ...p, dislikes: e.target.value }))}
                  placeholder="Small backyard, needs new flooring..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Questions for your agent?
                </label>
                <textarea
                  value={comments.questions}
                  onChange={(e) => setComments(p => ({ ...p, questions: e.target.value }))}
                  placeholder="Is the roof new? What are the HOA fees?"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  Overall Comments
                </label>
                <textarea
                  value={comments.overall}
                  onChange={(e) => setComments(p => ({ ...p, overall: e.target.value }))}
                  placeholder="Any other thoughts about this property..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Interest Level */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">❤️ Your Interest</h2>
            <p className="text-sm text-gray-500 mb-6">How interested are you in this property?</p>

            <div className="space-y-3 mb-6">
              {[
                { value: 'not_interested', label: 'Not Interested', icon: '😐', color: 'bg-gray-100' },
                { value: 'maybe', label: 'Maybe / Need to Think', icon: '🤔', color: 'bg-yellow-100' },
                { value: 'interested', label: 'Interested', icon: '😊', color: 'bg-blue-100' },
                { value: 'very_interested', label: 'Very Interested', icon: '😍', color: 'bg-green-100' },
                { value: 'ready_to_offer', label: 'Ready to Make Offer!', icon: '🔥', color: 'bg-red-100' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setInterest(p => ({ ...p, level: option.value }))}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                    interest.level === option.value ? 'border-blue-500 ' + option.color : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                  {interest.level === option.value && <Check className="w-5 h-5 text-blue-600 ml-auto" />}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 p-4 bg-white rounded-xl border">
              <input
                type="checkbox"
                checked={interest.wouldRevisit}
                onChange={(e) => setInterest(p => ({ ...p, wouldRevisit: e.target.checked }))}
                className="w-6 h-6 rounded text-blue-600"
              />
              <span className="font-medium">I'd like to visit again</span>
            </label>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">📋 Review & Submit</h2>
            <p className="text-sm text-gray-500 mb-6">Your agent will receive this feedback instantly</p>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Photos</h3>
                {photos.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {photos.map((p, i) => (
                      <img key={i} src={p.url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No photos added</p>
                )}
              </div>

              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Ratings</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Overall</span><span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{ratings.overall || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{ratings.location || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Condition</span><span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{ratings.condition || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{ratings.value || '-'}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-medium text-gray-900 mb-2">Interest Level</h3>
                <p className="text-sm">{
                  { not_interested: '😐 Not Interested', maybe: '🤔 Maybe', interested: '😊 Interested', very_interested: '😍 Very Interested', ready_to_offer: '🔥 Ready to Offer!' }[interest.level] || 'Not selected'
                }</p>
                {interest.wouldRevisit && <p className="text-sm text-blue-600 mt-1">✓ Would like to visit again</p>}
              </div>

              {(comments.likes || comments.dislikes || comments.questions) && (
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Comments</h3>
                  {comments.likes && <p className="text-sm mb-2"><span className="text-green-600">Likes:</span> {comments.likes}</p>}
                  {comments.dislikes && <p className="text-sm mb-2"><span className="text-red-600">Dislikes:</span> {comments.dislikes}</p>}
                  {comments.questions && <p className="text-sm"><span className="text-blue-600">Questions:</span> {comments.questions}</p>}
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <Send className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">Your agent will be notified immediately and can follow up on your questions.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 border rounded-xl font-medium text-gray-700"
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submitFeedback}
            disabled={submitting || !ratings.overall}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            Submit Feedback
          </button>
        )}
      </div>
    </div>
  )
}
