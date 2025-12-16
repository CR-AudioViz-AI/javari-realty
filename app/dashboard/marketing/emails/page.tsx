'use client'

import { useState } from 'react'
import {
  Mail, Copy, Check, Search, Filter, Star, Send,
  FileText, Clock, Users, Home, Calendar, Heart,
  ChevronRight, ExternalLink, Sparkles
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  category: string
  subject: string
  body: string
  popular?: boolean
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'New Lead Welcome',
    category: 'Lead Follow-up',
    subject: 'Thanks for your interest in [PROPERTY_ADDRESS]',
    body: `Hi [FIRST_NAME],

Thank you for your interest in the property at [PROPERTY_ADDRESS]. I would love to help you learn more about this home and the neighborhood.

This [BEDS] bedroom, [BATHS] bathroom home is listed at [PRICE] and offers [SQFT] square feet of living space.

Would you be available for a showing this week? I have openings on [DATE] or [DATE].

Looking forward to connecting with you!

Best regards,
[AGENT_NAME]
[AGENT_PHONE]
[AGENT_EMAIL]`,
    popular: true
  },
  {
    id: '2',
    name: 'Buyer Inquiry Response',
    category: 'Lead Follow-up',
    subject: 'Your Southwest Florida Home Search',
    body: `Hello [FIRST_NAME],

Thank you for reaching out about finding your perfect home in Southwest Florida. I am excited to help you with your search.

To better assist you, could you share a bit more about what you are looking for?

- Preferred areas or neighborhoods
- Number of bedrooms and bathrooms
- Must-have features (pool, waterfront, etc.)
- Timeline for purchase

Once I understand your needs, I can curate a list of properties that match your criteria.

Best regards,
[AGENT_NAME]`,
    popular: true
  },
  {
    id: '3',
    name: 'Open House Invitation',
    category: 'Open House',
    subject: 'You are Invited: Open House at [PROPERTY_ADDRESS]',
    body: `Hi [FIRST_NAME],

You are invited to an exclusive open house event!

Property: [PROPERTY_ADDRESS]
Date: [DATE]
Time: [TIME]

This stunning [BEDS] bed, [BATHS] bath home features:
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

Refreshments will be served. Feel free to bring family and friends who might be interested.

RSVP by replying to this email or calling [AGENT_PHONE].

See you there!
[AGENT_NAME]`,
    popular: true
  },
  {
    id: '4',
    name: 'Open House Thank You',
    category: 'Open House',
    subject: 'Great meeting you at the open house!',
    body: `Hi [FIRST_NAME],

It was wonderful meeting you at the open house for [PROPERTY_ADDRESS] on [DATE].

I hope you enjoyed touring the property. As a reminder, this home offers:
- [BEDS] bedrooms, [BATHS] bathrooms
- [SQFT] square feet
- Listed at [PRICE]

If you have any questions or would like to schedule a private showing, please do not hesitate to reach out.

Best regards,
[AGENT_NAME]
[AGENT_PHONE]`
  },
  {
    id: '5',
    name: 'Price Reduction Alert',
    category: 'Listing Updates',
    subject: 'Price Reduced: [PROPERTY_ADDRESS] now [PRICE]!',
    body: `Hi [FIRST_NAME],

Great news! The property you viewed at [PROPERTY_ADDRESS] has just been reduced to [PRICE].

This is an excellent opportunity to make your move on this [BEDS] bed, [BATHS] bath home.

At this new price point, I expect increased interest. Would you like to schedule another viewing or discuss making an offer?

Let me know your thoughts!

[AGENT_NAME]
[AGENT_PHONE]`,
    popular: true
  },
  {
    id: '6',
    name: 'Just Listed Announcement',
    category: 'Listing Updates',
    subject: 'Just Listed: [PROPERTY_ADDRESS]',
    body: `Hi [FIRST_NAME],

I wanted to share an exciting new listing that just hit the market:

[PROPERTY_ADDRESS]
[CITY], [STATE] [ZIP]

Offered at: [PRICE]
Bedrooms: [BEDS]
Bathrooms: [BATHS]
Square Feet: [SQFT]

Key Features:
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]

This property will not last long. Contact me to schedule a private showing.

Best,
[AGENT_NAME]`
  },
  {
    id: '7',
    name: 'Under Contract Celebration',
    category: 'Milestones',
    subject: 'Congratulations - You are Under Contract!',
    body: `Dear [FIRST_NAME],

Congratulations! Your offer on [PROPERTY_ADDRESS] has been accepted.

Here are the next steps:
1. Earnest money deposit due by [DATE]
2. Home inspection to be scheduled within [X] days
3. Loan application deadline: [DATE]
4. Estimated closing date: [DATE]

I will be with you every step of the way. Please do not hesitate to reach out with any questions.

Exciting times ahead!

[AGENT_NAME]`,
    popular: true
  },
  {
    id: '8',
    name: 'Closing Day Congratulations',
    category: 'Milestones',
    subject: 'Congratulations on Your New Home!',
    body: `Dear [FIRST_NAME],

CONGRATULATIONS! You are officially a homeowner!

It has been an absolute pleasure helping you find and purchase your new home at [PROPERTY_ADDRESS].

A few helpful tips for your first weeks:
- Change the locks and update security codes
- Set up utilities in your name
- Update your address with important contacts

If you ever need anything real estate related, I am always here to help. And if you know anyone looking to buy or sell, I would be honored to receive your referral.

Welcome home!

Warmly,
[AGENT_NAME]`
  },
  {
    id: '9',
    name: '30-Day Check-In',
    category: 'Follow-up',
    subject: 'How is your new home?',
    body: `Hi [FIRST_NAME],

It has been about a month since you closed on [PROPERTY_ADDRESS], and I wanted to check in!

How are you settling in? Is everything with the home meeting your expectations?

If any questions or concerns have come up, I am happy to help connect you with trusted local vendors and service providers.

Also, if you have a moment, I would truly appreciate a review of your experience working with me. [REVIEW_LINK]

Hope you are loving your new home!

Best,
[AGENT_NAME]`
  },
  {
    id: '10',
    name: 'Home Anniversary',
    category: 'Follow-up',
    subject: 'Happy Home Anniversary!',
    body: `Hi [FIRST_NAME],

Can you believe it has been [X] year(s) since you purchased [PROPERTY_ADDRESS]?

I hope your home has brought you as much joy as it brought me to help you find it.

If you are curious about how your homes value has changed, I would be happy to provide a complimentary market analysis.

Also, if you know anyone thinking about buying or selling, I am always grateful for referrals.

Cheers to another wonderful year in your home!

[AGENT_NAME]
[AGENT_PHONE]`
  }
]

const CATEGORIES = ['All', 'Lead Follow-up', 'Open House', 'Listing Updates', 'Milestones', 'Follow-up']

export default function EmailTemplatesPage() {
  const [templates] = useState<EmailTemplate[]>(TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(TEMPLATES[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const fillPreview = (text: string) => {
    return text
      .replace(/\[FIRST_NAME\]/g, 'John')
      .replace(/\[PROPERTY_ADDRESS\]/g, '2850 Winkler Ave')
      .replace(/\[CITY\]/g, 'Fort Myers')
      .replace(/\[STATE\]/g, 'FL')
      .replace(/\[ZIP\]/g, '33916')
      .replace(/\[PRICE\]/g, '$425,000')
      .replace(/\[BEDS\]/g, '4')
      .replace(/\[BATHS\]/g, '3')
      .replace(/\[SQFT\]/g, '2,400')
      .replace(/\[DATE\]/g, 'December 20, 2024')
      .replace(/\[TIME\]/g, '2:00 PM - 4:00 PM')
      .replace(/\[AGENT_NAME\]/g, 'Your Name')
      .replace(/\[AGENT_PHONE\]/g, '(239) 555-0100')
      .replace(/\[AGENT_EMAIL\]/g, 'agent@email.com')
      .replace(/\[FEATURE_1\]/g, 'Stunning pool with waterfall')
      .replace(/\[FEATURE_2\]/g, 'Updated gourmet kitchen')
      .replace(/\[FEATURE_3\]/g, 'Hurricane impact windows')
      .replace(/\[X\]/g, '1')
      .replace(/\[REVIEW_LINK\]/g, 'www.example.com/review')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Mail className="text-blue-600" /> Email Templates
          </h1>
          <p className="text-gray-600 mt-1">Professional email templates for every situation</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {template.popular && <Star className="text-amber-500" size={14} fill="currentColor" />}
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{template.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">{selectedTemplate.name}</h2>
                  <span className="text-sm text-gray-500">{selectedTemplate.category}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      previewMode ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}
                  >
                    {previewMode ? 'Edit Mode' : 'Preview'}
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Subject Line</label>
                    <button
                      onClick={() => copyToClipboard(
                        previewMode ? fillPreview(selectedTemplate.subject) : selectedTemplate.subject,
                        'subject'
                      )}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      {copiedField === 'subject' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedField === 'subject' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    {previewMode ? fillPreview(selectedTemplate.subject) : selectedTemplate.subject}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Email Body</label>
                    <button
                      onClick={() => copyToClipboard(
                        previewMode ? fillPreview(selectedTemplate.body) : selectedTemplate.body,
                        'body'
                      )}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      {copiedField === 'body' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedField === 'body' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border whitespace-pre-wrap text-sm min-h-64">
                    {previewMode ? fillPreview(selectedTemplate.body) : selectedTemplate.body}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => copyToClipboard(
                      `Subject: ${previewMode ? fillPreview(selectedTemplate.subject) : selectedTemplate.subject}\n\n${previewMode ? fillPreview(selectedTemplate.body) : selectedTemplate.body}`,
                      'all'
                    )}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    {copiedField === 'all' ? <Check size={18} /> : <Copy size={18} />}
                    {copiedField === 'all' ? 'Copied!' : 'Copy All'}
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <ExternalLink size={18} />
                    Open in Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <Mail className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-700">Select a Template</h3>
              <p className="text-gray-500">Choose a template to view and customize</p>
            </div>
          )}

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              Email Best Practices
            </h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>Send follow-up emails within 24 hours of showing</li>
              <li>Best send times: Tuesday-Thursday, 10am-12pm</li>
              <li>Keep subject lines under 50 characters</li>
              <li>Personalize every email with client details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
