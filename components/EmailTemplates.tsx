'use client'

import { useState } from 'react'
import { 
  Mail, Copy, Check, Send, FileText, Home, Calendar,
  UserPlus, Clock, DollarSign, Star, Loader2
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  icon: any
}

interface EmailTemplatesProps {
  recipientName?: string
  recipientEmail?: string
  propertyAddress?: string
  propertyPrice?: number
  agentName?: string
  agentPhone?: string
  className?: string
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: 'new_lead',
    name: 'New Lead Welcome',
    category: 'Lead Nurture',
    icon: UserPlus,
    subject: 'Welcome! Let\'s Find Your Perfect Home',
    body: `Hi {{RECIPIENT_NAME}},

Thank you for reaching out about your home search! I'm excited to help you find the perfect property.

To get started, I'd love to learn more about what you're looking for:
• Preferred locations/neighborhoods
• Must-have features
• Budget range
• Timeline for moving

Would you be available for a quick 15-minute call this week? I'm here to make your home buying experience as smooth as possible.

Best regards,
{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'showing_confirm',
    name: 'Showing Confirmation',
    category: 'Scheduling',
    icon: Calendar,
    subject: 'Showing Confirmed: {{PROPERTY_ADDRESS}}',
    body: `Hi {{RECIPIENT_NAME}},

Great news! Your showing has been confirmed:

📍 Property: {{PROPERTY_ADDRESS}}
💰 Price: {{PROPERTY_PRICE}}
📅 Date: [DATE]
⏰ Time: [TIME]

Please arrive 5 minutes early. I'll meet you at the property.

What to bring:
• Photo ID
• Pre-approval letter (if you have one)
• List of questions

Looking forward to showing you this property!

{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'post_showing',
    name: 'Post-Showing Follow Up',
    category: 'Follow Up',
    icon: Home,
    subject: 'Thoughts on {{PROPERTY_ADDRESS}}?',
    body: `Hi {{RECIPIENT_NAME}},

Thank you for viewing {{PROPERTY_ADDRESS}} today!

I'd love to hear your thoughts:
• What did you like most about the property?
• Any concerns or questions?
• Would you like to see it again or make an offer?

If this one isn't quite right, I have a few other properties that might be a better fit. Let me know your feedback and we can schedule more showings.

Talk soon,
{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'price_reduction',
    name: 'Price Reduction Alert',
    category: 'Marketing',
    icon: DollarSign,
    subject: '🔥 Price Drop Alert: {{PROPERTY_ADDRESS}}',
    body: `Hi {{RECIPIENT_NAME}},

Great news! A property you might love just had a price reduction:

📍 {{PROPERTY_ADDRESS}}
💰 NEW PRICE: {{PROPERTY_PRICE}}
📉 Reduced from: [OLD_PRICE]

This won't last long! Would you like to schedule a showing?

Reply to this email or call me directly to set up a time.

{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'open_house',
    name: 'Open House Invitation',
    category: 'Marketing',
    icon: Home,
    subject: 'You\'re Invited: Open House at {{PROPERTY_ADDRESS}}',
    body: `Hi {{RECIPIENT_NAME}},

You're invited to an exclusive open house!

🏠 {{PROPERTY_ADDRESS}}
💰 {{PROPERTY_PRICE}}
📅 Date: [DATE]
⏰ Time: [TIME]

Features:
• [FEATURE 1]
• [FEATURE 2]
• [FEATURE 3]

No appointment needed - just stop by! Refreshments will be served.

Can't make it? Reply to schedule a private showing.

See you there!
{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'listing_anniversary',
    name: '30-Day Check-In',
    category: 'Follow Up',
    icon: Clock,
    subject: 'Quick Update on Your Home Search',
    body: `Hi {{RECIPIENT_NAME}},

It's been about a month since we connected, and I wanted to check in on your home search.

Have your needs or timeline changed? I've seen some new listings that might interest you.

Let me know if you'd like to:
• See new properties in your price range
• Adjust your search criteria
• Discuss market conditions

I'm here whenever you're ready!

{{AGENT_NAME}}
{{AGENT_PHONE}}`
  },
  {
    id: 'testimonial_request',
    name: 'Testimonial Request',
    category: 'Post-Close',
    icon: Star,
    subject: 'Quick Favor? Share Your Experience',
    body: `Hi {{RECIPIENT_NAME}},

Congratulations again on your new home! I hope you're settling in nicely.

If you had a positive experience working with me, I'd be grateful if you could share a brief testimonial. It helps other buyers and sellers find trusted guidance.

You can:
• Reply to this email with a few sentences
• Leave a review on Google: [LINK]
• Share on Zillow: [LINK]

Thank you for trusting me with your real estate journey!

Warmly,
{{AGENT_NAME}}`
  },
]

export default function EmailTemplates({
  recipientName = '[Client Name]',
  recipientEmail,
  propertyAddress = '[Property Address]',
  propertyPrice,
  agentName = '[Your Name]',
  agentPhone = '[Your Phone]',
  className = ''
}: EmailTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{RECIPIENT_NAME\}\}/g, recipientName)
      .replace(/\{\{PROPERTY_ADDRESS\}\}/g, propertyAddress)
      .replace(/\{\{PROPERTY_PRICE\}\}/g, propertyPrice ? `$${propertyPrice.toLocaleString()}` : '[Price]')
      .replace(/\{\{AGENT_NAME\}\}/g, agentName)
      .replace(/\{\{AGENT_PHONE\}\}/g, agentPhone)
  }

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setCustomSubject(replaceVariables(template.subject))
    setCustomBody(replaceVariables(template.body))
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleSendEmail = () => {
    const mailtoUrl = `mailto:${recipientEmail || ''}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`
    window.location.href = mailtoUrl
  }

  const categories = [...new Set(TEMPLATES.map(t => t.category))]

  return (
    <div className={`bg-white rounded-xl border ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Mail className="text-blue-600" size={20} /> Email Templates
        </h3>
        <p className="text-sm text-gray-500">Professional templates for every situation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x">
        {/* Template List */}
        <div className="p-4 max-h-[500px] overflow-y-auto">
          {categories.map(category => (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{category}</h4>
              <div className="space-y-2">
                {TEMPLATES.filter(t => t.category === category).map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedTemplate?.id === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <template.icon size={18} className="text-gray-500" />
                      <span className="font-medium">{template.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Template Editor */}
        <div className="p-4">
          {selectedTemplate ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => handleCopy(customSubject, 'subject')}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {copied === 'subject' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                <div className="relative">
                  <textarea
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => handleCopy(customBody, 'body')}
                    className="absolute top-2 right-2 p-2 bg-white border rounded hover:bg-gray-50"
                  >
                    {copied === 'body' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSendEmail}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Send size={18} /> Open in Email Client
                </button>
                <button
                  onClick={() => handleCopy(`Subject: ${customSubject}\n\n${customBody}`, 'all')}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {copied === 'all' ? <Check size={18} className="text-green-600" /> : 'Copy All'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="mx-auto mb-2" size={48} />
                <p>Select a template to customize</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
