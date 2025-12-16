'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, Loader2, User, Sparkles, MessageSquare,
  Home, DollarSign, TrendingUp, FileText, Calendar,
  HelpCircle, Lightbulb, ChevronRight, Copy, Check,
  RefreshCw, Trash2, Clock
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { icon: Home, label: 'Listing description', prompt: 'Write a compelling listing description for a 4-bed, 3-bath pool home in Cape Coral' },
  { icon: DollarSign, label: 'Price analysis', prompt: 'What factors should I consider when pricing a waterfront property?' },
  { icon: TrendingUp, label: 'Market trends', prompt: 'What are the current market trends in Southwest Florida real estate?' },
  { icon: FileText, label: 'Email template', prompt: 'Write a follow-up email for a buyer who viewed a property yesterday' },
  { icon: Calendar, label: 'Open house tips', prompt: 'Give me tips for hosting a successful open house' },
  { icon: MessageSquare, label: 'Objection handling', prompt: 'How should I respond when a buyer says the price is too high?' },
]

const SAMPLE_RESPONSES: Record<string, string> = {
  'listing': `🏠 **Stunning Cape Coral Pool Home - Your Tropical Paradise Awaits!**

Welcome to this beautifully designed 4-bedroom, 3-bathroom residence that perfectly blends modern luxury with Florida living. 

**Key Features:**
• Sparkling pool with extended lanai - perfect for entertaining
• Open-concept floor plan with soaring ceilings
• Gourmet kitchen with granite counters & stainless appliances
• Split bedroom layout for privacy
• Hurricane impact windows throughout
• Attached 2-car garage

Located in a prime Cape Coral neighborhood with easy access to shopping, dining, and Gulf beaches. This home is move-in ready and waiting for its new owners!

**Price:** Contact for details | **MLS#:** Coming Soon`,

  'price': `**Key Factors for Pricing Waterfront Properties:**

1. **Water Access Type**
   - Direct Gulf access (highest premium)
   - Sailboat water vs. powerboat only
   - Canal width and bridge restrictions

2. **Waterfront Features**
   - Dock condition and size
   - Boat lift capacity
   - Seawall condition (concrete vs. riprap)

3. **View Quality**
   - Wide water views command 15-25% premium
   - Sunset exposure is highly desirable

4. **Comparable Sales**
   - Look at similar waterfront sales within 6 months
   - Adjust for dock, lift, and access differences

5. **Market Conditions**
   - Current inventory levels
   - Days on market for similar properties
   - Seasonal demand patterns

Would you like me to analyze a specific property?`,

  'default': `I'm your AI real estate assistant! I can help you with:

• **Listing Descriptions** - Compelling property write-ups
• **Market Analysis** - Trends and pricing insights
• **Email Templates** - Follow-ups, newsletters, updates
• **Negotiation Tips** - Handling objections professionally
• **Marketing Ideas** - Social media, open houses, ads
• **Transaction Support** - Checklists and timelines

What would you like help with today?`
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: SAMPLE_RESPONSES['default'],
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = SAMPLE_RESPONSES['default']
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('listing') || lowerInput.includes('description')) {
      response = SAMPLE_RESPONSES['listing']
    } else if (lowerInput.includes('price') || lowerInput.includes('waterfront')) {
      response = SAMPLE_RESPONSES['price']
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: SAMPLE_RESPONSES['default'],
      timestamp: new Date()
    }])
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r p-4 hidden lg:block">
        <div className="mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-2">
            <Sparkles className="text-amber-500" size={20} />
            Quick Prompts
          </h2>
          <p className="text-sm text-gray-500">Click to use these starter prompts</p>
        </div>

        <div className="space-y-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt.prompt)}
              className="w-full text-left p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <prompt.icon className="text-gray-400 group-hover:text-blue-500" size={18} />
                <span className="text-sm font-medium">{prompt.label}</span>
                <ChevronRight className="ml-auto text-gray-300 group-hover:text-blue-500" size={16} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
            <Lightbulb size={16} />
            Pro Tip
          </h3>
          <p className="text-sm text-amber-700">
            Be specific in your prompts! Include property details, target audience, and tone preferences for better results.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold">AI Real Estate Assistant</h1>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100"
            title="Clear chat"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
              )}
              
              <div className={`max-w-2xl ${message.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white border rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
                <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copied === message.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-500" size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-white border rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about real estate..."
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI responses are for assistance only. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
