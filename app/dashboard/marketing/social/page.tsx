'use client'

import { useState } from 'react'
import {
  Share2, Copy, Check, RefreshCw,
  Instagram, Facebook, Twitter, Linkedin, Home, DollarSign,
  Calendar, Sparkles, Wand2,
  Hash, FileText, Eye, Clock, TrendingUp
} from 'lucide-react'

interface PropertyData {
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  features: string[]
  type: string
  status: string
}

// Type-safe templates without as const
const TEMPLATES: Record<string, Record<string, string[]>> = {
  instagram: {
    newListing: [
      "✨ Just Listed! ✨\n\n📍 {address}\n💰 ${price}\n🛏️ {beds} Beds | 🛁 {baths} Baths | 📐 {sqft} sq ft\n\n{features}\n\nSchedule your private showing today! 🏠\n\n#JustListed #RealEstate #NewListing #HomeForSale #{city}Homes #DreamHome #HouseHunting",
      "🏡 NEW ON MARKET 🏡\n\nThis stunning {type} just hit the market in {city}!\n\n✅ {beds} bedrooms\n✅ {baths} bathrooms\n✅ {sqft} sq ft\n✅ ${price}\n\nDM me for details! 📩\n\n#ForSale #RealEstateLife #HomeGoals #{city}RealEstate",
    ],
    openHouse: [
      "🎉 OPEN HOUSE THIS WEEKEND! 🎉\n\n📍 {address}\n🗓️ Saturday & Sunday, 1-4 PM\n💰 ${price}\n\nCome see this beautiful {beds}BR/{baths}BA home!\n\n#OpenHouse #ComeVisit #{city}Homes #WeekendPlans",
    ],
    sold: [
      "🔑 SOLD! 🔑\n\nCongratulations to my amazing clients on their new home! 🏠✨\n\nAnother happy family in #{city}!\n\nThinking of buying or selling? Let's chat! 📱\n\n#JustSold #RealEstateAgent #HappyClients #ClosingDay",
    ],
    priceReduced: [
      "⚡ PRICE REDUCED! ⚡\n\n📍 {address}\n\n💰 NOW ${price}\n\nThis won't last long! Schedule your showing today!\n\n#PriceReduced #GreatDeal #{city}Homes #BuyersMarket",
    ]
  },
  facebook: {
    newListing: [
      "🏠 JUST LISTED! 🏠\n\n{address}\n\nThis beautiful {type} features:\n• {beds} Bedrooms\n• {baths} Bathrooms\n• {sqft} Square Feet\n• {features}\n\nPriced at ${price}\n\nContact me today for a private showing! This one won't last long!\n\n📞 Call/Text: [Your Phone]\n📧 Email: [Your Email]",
    ],
    openHouse: [
      "📣 OPEN HOUSE ALERT! 📣\n\nYou're invited to view this stunning property!\n\n📍 {address}\n🗓️ This Saturday & Sunday\n⏰ 1:00 PM - 4:00 PM\n💰 ${price}\n\nRefreshments will be served! Bring your friends and family!\n\nCan't make it? Schedule a private tour anytime!",
    ],
    marketUpdate: [
      "📊 {city} MARKET UPDATE 📊\n\nHere's what's happening in our local real estate market:\n\n📈 Median Home Price: ${price}\n🏘️ Active Listings: Growing\n⏱️ Days on Market: Decreasing\n\nWhether you're buying or selling, I'm here to help you navigate this market!\n\n💬 Drop a comment or send me a message with your questions!",
    ]
  },
  twitter: {
    newListing: [
      "🏠 Just Listed in {city}!\n\n📍 {address}\n💰 ${price}\n🛏️ {beds}BR | 🛁 {baths}BA\n\nSchedule your showing today! #RealEstate #JustListed #{city}",
    ],
    tip: [
      "💡 Home Buying Tip:\n\n{tip}\n\nNeed help navigating the market? DM me! 📩\n\n#RealEstateTips #HomeBuying #{city}Realtor",
    ]
  },
  linkedin: {
    newListing: [
      "Excited to announce a new listing in {city}! 🏠\n\nThis {type} offers {beds} bedrooms, {baths} bathrooms, and {sqft} square feet of living space.\n\nKey features:\n{features}\n\nListed at ${price}\n\nKnow someone looking to relocate to {city}? Feel free to share this post or connect them with me!\n\n#RealEstate #NewListing #{city} #HomeForSale",
    ],
    sold: [
      "Another successful closing! 🔑\n\nI'm thrilled to have helped my clients find their dream home in {city}.\n\nThe current market presents unique opportunities for both buyers and sellers. If you're considering a move, I'd be happy to discuss your options.\n\n#RealEstate #JustSold #ClientSuccess",
    ]
  }
}

const HOME_BUYING_TIPS = [
  "Get pre-approved BEFORE you start house hunting. It shows sellers you're serious and helps you know your budget!",
  "Don't skip the home inspection! It could save you thousands in unexpected repairs.",
  "Consider the resale value even if this is your 'forever home.' Life happens!",
  "Location matters more than you think. Visit the neighborhood at different times of day.",
  "Your down payment isn't the only cost. Budget for closing costs (2-5% of loan amount).",
  "Fixed-rate mortgages offer stability. ARMs can be risky if rates rise.",
  "Don't make big purchases (car, furniture) before closing. It can affect your loan approval!",
]

type PlatformKey = 'instagram' | 'facebook' | 'twitter' | 'linkedin'

export default function SocialMediaGeneratorPage() {
  const [platform, setPlatform] = useState<PlatformKey>('instagram')
  const [contentType, setContentType] = useState('newListing')
  const [property, setProperty] = useState<PropertyData>({
    address: '2850 Winkler Ave, Fort Myers, FL',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    features: ['Pool', 'Updated Kitchen', '2-Car Garage', 'Waterfront'],
    type: 'Single Family Home',
    status: 'active'
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedTip, setSelectedTip] = useState(HOME_BUYING_TIPS[0])

  const getCity = (address: string) => {
    const parts = address.split(',')
    return parts[1]?.trim() || 'Fort Myers'
  }

  const generateContent = () => {
    const platformTemplates = TEMPLATES[platform]
    const templates = platformTemplates?.[contentType]
    
    if (!templates || templates.length === 0) {
      setGeneratedContent('No template available for this combination.')
      return
    }

    const template = templates[Math.floor(Math.random() * templates.length)]
    const city = getCity(property.address)
    
    const content = template
      .replace(/{address}/g, property.address)
      .replace(/{price}/g, property.price.toLocaleString())
      .replace(/{beds}/g, property.beds.toString())
      .replace(/{baths}/g, property.baths.toString())
      .replace(/{sqft}/g, property.sqft.toLocaleString())
      .replace(/{type}/g, property.type)
      .replace(/{city}/g, city.replace(/\s+/g, ''))
      .replace(/{features}/g, property.features.map(f => `✓ ${f}`).join('\n'))
      .replace(/{tip}/g, selectedTip)

    setGeneratedContent(content)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const refreshTip = () => {
    const currentIndex = HOME_BUYING_TIPS.indexOf(selectedTip)
    const nextIndex = (currentIndex + 1) % HOME_BUYING_TIPS.length
    setSelectedTip(HOME_BUYING_TIPS[nextIndex])
  }

  const PLATFORM_OPTIONS = [
    { id: 'instagram' as PlatformKey, name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { id: 'facebook' as PlatformKey, name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
    { id: 'twitter' as PlatformKey, name: 'X / Twitter', icon: Twitter, color: 'from-gray-800 to-black' },
    { id: 'linkedin' as PlatformKey, name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-800' },
  ]

  const CONTENT_TYPES: Record<PlatformKey, {id: string, name: string, icon: React.ComponentType<{ size?: number }>}[]> = {
    instagram: [
      { id: 'newListing', name: 'New Listing', icon: Home },
      { id: 'openHouse', name: 'Open House', icon: Calendar },
      { id: 'sold', name: 'Just Sold', icon: Check },
      { id: 'priceReduced', name: 'Price Reduced', icon: DollarSign },
    ],
    facebook: [
      { id: 'newListing', name: 'New Listing', icon: Home },
      { id: 'openHouse', name: 'Open House', icon: Calendar },
      { id: 'marketUpdate', name: 'Market Update', icon: TrendingUp },
    ],
    twitter: [
      { id: 'newListing', name: 'New Listing', icon: Home },
      { id: 'tip', name: 'Buying Tip', icon: Sparkles },
    ],
    linkedin: [
      { id: 'newListing', name: 'New Listing', icon: Home },
      { id: 'sold', name: 'Just Sold', icon: Check },
    ],
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Wand2 className="text-purple-600" /> Social Media Generator
        </h1>
        <p className="text-gray-600 mt-1">Create engaging posts for your listings in seconds</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold mb-4">1. Choose Platform</h2>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlatform(p.id)
                    setContentType(CONTENT_TYPES[p.id][0].id)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    platform === p.id 
                      ? `border-transparent bg-gradient-to-r ${p.color} text-white`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p.icon className="mx-auto mb-2" size={24} />
                  <p className="text-sm font-medium">{p.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold mb-4">2. Content Type</h2>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES[platform]?.map(type => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    contentType === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <type.icon size={16} />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          {contentType !== 'tip' && contentType !== 'marketUpdate' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold mb-4">3. Property Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={property.address}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      value={property.price}
                      onChange={(e) => setProperty({ ...property, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sq Ft</label>
                    <input
                      type="number"
                      value={property.sqft}
                      onChange={(e) => setProperty({ ...property, sqft: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Beds</label>
                    <input
                      type="number"
                      value={property.beds}
                      onChange={(e) => setProperty({ ...property, beds: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Baths</label>
                    <input
                      type="number"
                      value={property.baths}
                      onChange={(e) => setProperty({ ...property, baths: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Key Features (comma separated)</label>
                  <input
                    type="text"
                    value={property.features.join(', ')}
                    onChange={(e) => setProperty({ ...property, features: e.target.value.split(',').map(f => f.trim()) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Pool, Updated Kitchen, 2-Car Garage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tip Selection for Twitter */}
          {contentType === 'tip' && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">3. Select Tip</h2>
                <button onClick={refreshTip} className="text-blue-600 hover:text-blue-700">
                  <RefreshCw size={18} />
                </button>
              </div>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedTip}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateContent}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Generate Content
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <h2 className="font-bold flex items-center gap-2">
              <FileText size={18} />
              Generated Content
            </h2>
            {generatedContent && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={generateContent}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            {generatedContent ? (
              <div className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border text-sm">
                {generatedContent}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Share2 className="mx-auto mb-4" size={48} />
                <p>Fill in the details and click &quot;Generate Content&quot;</p>
              </div>
            )}

            {generatedContent && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Character Count</h3>
                <div className="flex gap-4">
                  <div className={`px-3 py-2 rounded-lg ${
                    generatedContent.length <= 280 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className="text-sm">Twitter: {generatedContent.length}/280</span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${
                    generatedContent.length <= 2200 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className="text-sm">Instagram: {generatedContent.length}/2,200</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Sparkles className="text-purple-600" /> Pro Tips for Social Media Success
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <Clock className="text-blue-600 mb-2" size={20} />
            <h4 className="font-semibold text-sm mb-1">Best Posting Times</h4>
            <p className="text-xs text-gray-600">Instagram: 11am-1pm, Facebook: 1pm-4pm, LinkedIn: 7am-8am or 5pm-6pm</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <Hash className="text-purple-600 mb-2" size={20} />
            <h4 className="font-semibold text-sm mb-1">Hashtag Strategy</h4>
            <p className="text-xs text-gray-600">Use 20-30 hashtags on Instagram, 2-3 on Twitter, none on LinkedIn posts</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <Eye className="text-green-600 mb-2" size={20} />
            <h4 className="font-semibold text-sm mb-1">Visual Content</h4>
            <p className="text-xs text-gray-600">Posts with images get 2x more engagement. Use high-quality property photos!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
