'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  Check,
  Loader2,
  Home,
  Sparkles,
  RefreshCw,
  Hash,
} from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  description: string
  photos: string[]
}

export default function SocialMediaPage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const supabase = createClient()

  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('professional')
  const [generatedPost, setGeneratedPost] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperties() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setProperties(data || [])

      if (propertyId && data) {
        const prop = data.find(p => p.id === propertyId)
        if (prop) setSelectedProperty(prop)
      }

      setLoading(false)
    }
    loadProperties()
  }, [propertyId, supabase])

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', maxLength: 2200 },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', maxLength: 63206 },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-800', maxLength: 3000 },
    { id: 'twitter', name: 'X/Twitter', icon: Twitter, color: 'from-gray-800 to-gray-900', maxLength: 280 },
  ]

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual & Friendly' },
    { id: 'luxury', name: 'Luxury & Exclusive' },
    { id: 'urgent', name: 'Urgent & Exciting' },
  ]

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  const generatePost = async () => {
    if (!selectedProperty) return
    setGenerating(true)

    try {
      const response = await fetch('/api/javari/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate a ${platform} post for this real estate listing. Use a ${tone} tone.

Property: ${selectedProperty.title}
Price: ${formatPrice(selectedProperty.price)}
Location: ${selectedProperty.city}, ${selectedProperty.state}
Beds: ${selectedProperty.bedrooms || 'N/A'}
Baths: ${selectedProperty.bathrooms || 'N/A'}
Sqft: ${selectedProperty.square_feet?.toLocaleString() || 'N/A'}
Description: ${selectedProperty.description || 'Beautiful property'}

Requirements:
- ${platform === 'twitter' ? 'Keep under 280 characters' : 'Engaging and shareable'}
- Include a call to action
- ${platform === 'instagram' ? 'Add relevant emojis' : 'Professional formatting'}
- DO NOT include hashtags in the post (I will add them separately)

Just output the post text, nothing else.`
          }]
        })
      })

      const data = await response.json()
      setGeneratedPost(data.message || 'Could not generate post')

      // Generate hashtags
      const cityTag = selectedProperty.city.toLowerCase().replace(/\s+/g, '')
      const stateTag = selectedProperty.state.toLowerCase()
      setHashtags([
        'realestate',
        'forsale',
        'dreamhome',
        cityTag,
        `${stateTag}realestate`,
        'luxuryhomes',
        'homeforsale',
        'realtor',
        'newlisting',
        'househunting'
      ])

    } catch (error) {
      setGeneratedPost('Failed to generate post. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const fullPost = `${generatedPost}\n\n${hashtags.map(h => `#${h}`).join(' ')}`
    navigator.clipboard.writeText(fullPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentPlatform = platforms.find(p => p.id === platform)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard/marketing" className="hover:text-blue-600">Marketing</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Social Media</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Social Media Post Generator</h1>
        <p className="text-gray-500">Create engaging posts for your listings with AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Property Selection */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Select Property</h2>
            
            {selectedProperty ? (
              <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {selectedProperty.photos?.[0] ? (
                    <img src={selectedProperty.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{selectedProperty.title}</h3>
                  <p className="text-xs text-gray-500">{selectedProperty.city}, {selectedProperty.state}</p>
                  <p className="text-sm font-bold text-emerald-600 mt-1">{formatPrice(selectedProperty.price)}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {properties.map(property => (
                  <button
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="w-full flex gap-3 p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      {property.photos?.[0] ? (
                        <img src={property.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{property.title}</p>
                      <p className="text-xs text-gray-500">{property.city}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600">{formatPrice(property.price)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Platform</h2>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map(p => {
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                      platform === p.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Tone</h2>
            <div className="flex flex-wrap gap-2">
              {tones.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    tone === t.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePost}
            disabled={!selectedProperty || generating}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Post
              </>
            )}
          </button>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Post Preview */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Generated Post</h2>
              {generatedPost && (
                <button
                  onClick={generatePost}
                  disabled={generating}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              )}
            </div>

            {generatedPost ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${currentPlatform?.color} text-white`}>
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/20">
                    {currentPlatform && <currentPlatform.icon className="w-5 h-5" />}
                    <span className="font-medium">{currentPlatform?.name} Preview</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedPost}</p>
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Hashtags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Character Count */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{generatedPost.length + hashtags.join(' #').length + 2} characters</span>
                  {currentPlatform && (
                    <span className={generatedPost.length > currentPlatform.maxLength ? 'text-red-500' : ''}>
                      Max: {currentPlatform.maxLength.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Post + Hashtags
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-2" />
                  <p>Select a property and generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
