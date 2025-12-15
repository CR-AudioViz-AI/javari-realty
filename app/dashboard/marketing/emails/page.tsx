'use client'

import { useState } from 'react'
import {
  Mail, Copy, Check, Search, Filter, Home, Users, 
  Calendar, DollarSign, Star, Heart, Clock, Edit2,
  Send, Eye, FileText, Sparkles, ChevronRight, Plus
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  category: string
  subject: string
  body: string
  variables: string[]
  popular?: boolean
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  // New Lead Follow-up
  {
    id: 'new-lead-1',
    name: 'New Lead - First Contact',
    category: 'Lead Follow-up',
    subject: 'Thanks for your interest in {property_address}!',
    body: `Hi {first_name},

Thank you for your interest in the property at {property_address}! I'm excited to help you explore this opportunity.

Here are the key details:
• List Price: {price}
• Bedrooms: {beds} | Bathrooms: {baths}
• Square Feet: {sqft}

I'd love to schedule a time for you to see it in person. Are you available this week for a showing?

Please let me know what times work best for you, or feel free to call me directly at {agent_phone}.

Looking forward to connecting!

Best regards,
{agent_name}
{company_name}
{agent_phone}
{agent_email}`,
    variables: ['first_name', 'property_address', 'price', 'beds', 'baths', 'sqft', 'agent_name', 'agent_phone', 'agent_email', 'company_name'],
    popular: true
  },
  {
    id: 'new-lead-2',
    name: 'New Lead - Buyer Inquiry',
    category: 'Lead Follow-up',
    subject: 'Let\'s find your dream home in {city}!',
    body: `Hi {first_name},

Thank you for reaching out about finding a home in {city}! I'm thrilled to help you on this exciting journey.

To get started, I'd love to learn more about what you're looking for:
• Preferred neighborhoods
• Must-have features
• Budget range
• Timeline for moving

Would you have 15 minutes this week for a quick call? I'd be happy to share some listings that might be a perfect fit.

Talk soon!

{agent_name}
{company_name}
{agent_phone}`,
    variables: ['first_name', 'city', 'agent_name', 'company_name', 'agent_phone'],
    popular: true
  },
  // Open House
  {
    id: 'open-house-1',
    name: 'Open House Invitation',
    category: 'Open House',
    subject: '🏠 You\'re Invited: Open House at {property_address}',
    body: `Hi {first_name},

You're invited to an exclusive open house!

📍 {property_address}
📅 {date}
⏰ {time}

This stunning {beds}-bedroom, {baths}-bathroom home features:
{features}

List Price: {price}

Light refreshments will be served. Bring your friends and family!

Can't make it? Reply to schedule a private showing at your convenience.

See you there!

{agent_name}
{agent_phone}`,
    variables: ['first_name', 'property_address', 'date', 'time', 'beds', 'baths', 'features', 'price', 'agent_name', 'agent_phone'],
    popular: true
  },
  {
    id: 'open-house-2',
    name: 'Open House Thank You',
    category: 'Open House',
    subject: 'Great meeting you at {property_address}!',
    body: `Hi {first_name},

It was wonderful meeting you at the open house today! Thank you for taking the time to visit.

I'd love to hear your thoughts on the property. Did it check all your boxes? Is there anything else you'd like to know?

If you'd like to take another look or discuss making an offer, I'm here to help every step of the way.

Feel free to reach out anytime!

Warm regards,
{agent_name}
{agent_phone}`,
    variables: ['first_name', 'property_address', 'agent_name', 'agent_phone']
  },
  // Listing Updates
  {
    id: 'price-reduced',
    name: 'Price Reduction Alert',
    category: 'Listing Updates',
    subject: '⚡ Price Reduced: {property_address}',
    body: `Hi {first_name},

Great news! The property you were interested in just had a price reduction!

📍 {property_address}
💰 New Price: {new_price} (was {old_price})
📉 Savings: {savings}

This won't last long at this new price. Would you like to schedule a showing?

Reply to this email or call me at {agent_phone}.

Best,
{agent_name}`,
    variables: ['first_name', 'property_address', 'new_price', 'old_price', 'savings', 'agent_phone', 'agent_name']
  },
  {
    id: 'just-listed',
    name: 'Just Listed Alert',
    category: 'Listing Updates',
    subject: '🏡 Just Listed: Perfect match in {neighborhood}!',
    body: `Hi {first_name},

A new listing just hit the market that matches what you're looking for!

📍 {property_address}
💰 {price}
🛏️ {beds} beds | 🛁 {baths} baths | 📐 {sqft} sq ft

Key Features:
{features}

Properties like this move fast! Would you like to see it before it's gone?

Let me know your availability!

{agent_name}
{agent_phone}`,
    variables: ['first_name', 'neighborhood', 'property_address', 'price', 'beds', 'baths', 'sqft', 'features', 'agent_name', 'agent_phone'],
    popular: true
  },
  // Closing & Milestones
  {
    id: 'under-contract',
    name: 'Under Contract Congratulations',
    category: 'Milestones',
    subject: '🎉 Congratulations! Your offer was accepted!',
    body: `Dear {first_name},

Wonderful news - your offer on {property_address} has been accepted! 🎉

Here's what happens next:
1. Earnest money deposit due: {earnest_due_date}
2. Home inspection period: {inspection_period}
3. Estimated closing date: {closing_date}

I'll be with you every step of the way. Please don't hesitate to reach out with any questions.

Congratulations again!

{agent_name}
{agent_phone}`,
    variables: ['first_name', 'property_address', 'earnest_due_date', 'inspection_period', 'closing_date', 'agent_name', 'agent_phone']
  },
  {
    id: 'closing-congrats',
    name: 'Closing Day Congratulations',
    category: 'Milestones',
    subject: '🔑 Welcome Home! Closing Day Congratulations',
    body: `Dear {first_name},

CONGRATULATIONS! 🎉🏠🔑

Today marks the beginning of an exciting new chapter in your life. Welcome to your new home at {property_address}!

A few things to remember:
• Change your address with the post office
• Set up utilities in your name
• Update your driver's license
• Get to know your neighbors!

It has been an absolute pleasure working with you. If you ever need anything or know someone looking to buy or sell, I'm always here to help.

Wishing you all the best in your new home!

With warm regards,
{agent_name}
{company_name}
{agent_phone}`,
    variables: ['first_name', 'property_address', 'agent_name', 'company_name', 'agent_phone']
  },
  // Check-ins
  {
    id: 'check-in-30',
    name: '30-Day Check-in',
    category: 'Follow-up',
    subject: 'How are you settling in?',
    body: `Hi {first_name},

It's been about a month since you moved into {property_address}, and I wanted to check in!

How is everything going? Is there anything you need help with?

Also, if you know anyone looking to buy or sell in the area, I'd be grateful for a referral. Your recommendation means the world to me!

Take care,
{agent_name}
{agent_phone}`,
    variables: ['first_name', 'property_address', 'agent_name', 'agent_phone']
  },
  {
    id: 'home-anniversary',
    name: 'Home Anniversary',
    category: 'Follow-up',
    subject: '🎂 Happy Home Anniversary!',
    body: `Hi {first_name},

Happy Home Anniversary! 🏠🎉

Can you believe it's been {years} year(s) since you moved into {property_address}? Time flies!

I hope you're still loving your home. If you're curious about how the market has changed or what your home might be worth now, I'd be happy to run a complimentary market analysis for you.

Wishing you many more happy years!

{agent_name}
{agent_phone}`,
    variables: ['first_name', 'years', 'property_address', 'agent_name', 'agent_phone']
  }
]

const CATEGORIES = ['All', 'Lead Follow-up', 'Open House', 'Listing Updates', 'Milestones', 'Follow-up']

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copied, setCopied] = useState(false)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const filteredTemplates = EMAIL_TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const processTemplate = (text: string) => {
    let processed = text
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{${key}}`, 'g'), value || `{${key}}`)
    })
    return processed
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(processTemplate(text))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Mail className="text-blue-600" /> Email Templates
        </h1>
        <p className="text-gray-600 mt-1">Professional templates for every stage of the journey</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template)
                  setVariables({})
                  setShowPreview(false)
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {template.name}
                      {template.popular && <Star className="text-amber-500" size={14} />}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{template.category}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold">{selectedTemplate.name}</h2>
                  <p className="text-sm text-gray-500">{selectedTemplate.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                      showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>

              {/* Variables */}
              {selectedTemplate.variables.length > 0 && !showPreview && (
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Edit2 size={14} /> Personalize
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTemplate.variables.slice(0, 8).map(v => (
                      <div key={v}>
                        <label className="block text-xs text-gray-500 mb-1">
                          {v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          value={variables[v] || ''}
                          onChange={(e) => setVariables({ ...variables, [v]: e.target.value })}
                          className="w-full px-2 py-1.5 border rounded text-sm"
                          placeholder={`{${v}}`}
                        />
                      </div>
                    ))}
                  </div>
                  {selectedTemplate.variables.length > 8 && (
                    <p className="text-xs text-gray-400 mt-2">
                      +{selectedTemplate.variables.length - 8} more variables available
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Subject Line</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={showPreview ? processTemplate(selectedTemplate.subject) : selectedTemplate.subject}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.subject)}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Email Body</label>
                    <button
                      onClick={() => copyToClipboard(selectedTemplate.body)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                        copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Body'}
                    </button>
                  </div>
                  <textarea
                    value={showPreview ? processTemplate(selectedTemplate.body) : selectedTemplate.body}
                    readOnly
                    rows={15}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono text-sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send size={18} />
                    Open in Email Client
                  </button>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${selectedTemplate.subject}\n\n${selectedTemplate.body}`)}
                    className="px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                  >
                    <Copy size={18} />
                    Copy All
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
              <Mail className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Template</h3>
              <p className="text-gray-500">Choose a template from the list to preview and customize</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles className="text-amber-500" /> Email Best Practices
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium mb-1">📧 Subject Lines</p>
            <p className="text-gray-600">Keep them under 50 characters. Use emojis sparingly but effectively.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium mb-1">⏰ Timing</p>
            <p className="text-gray-600">Best open rates: Tuesday-Thursday, 10am-12pm or 1pm-3pm.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-medium mb-1">📱 Mobile-Friendly</p>
            <p className="text-gray-600">60%+ of emails are read on mobile. Keep paragraphs short!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
