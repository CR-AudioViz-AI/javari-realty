'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Send, Bot, User, Sparkles, BookOpen, Calculator,
  Home, DollarSign, FileText, HelpCircle, Loader2, ChevronDown,
  Lightbulb, Target, Shield, ExternalLink
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_QUESTIONS = [
  { icon: Home, text: "What's the home buying process?", category: "Buying" },
  { icon: DollarSign, text: "How much house can I afford?", category: "Financing" },
  { icon: FileText, text: "What documents do I need for a mortgage?", category: "Financing" },
  { icon: Shield, text: "What is title insurance?", category: "Legal" },
  { icon: Target, text: "How do I make a competitive offer?", category: "Buying" },
  { icon: Calculator, text: "What are closing costs?", category: "Financing" },
]

// Expert knowledge base
const EXPERT_KNOWLEDGE: Record<string, string> = {
  "home buying process": `The home buying process typically involves these key steps:

**1. Get Pre-Approved (1-3 days)** - Start by getting pre-approved for a mortgage.

**2. Find a Real Estate Agent** - Choose an agent who knows your target area.

**3. House Hunting (2-8 weeks)** - View homes that match your criteria.

**4. Make an Offer** - Your agent will help craft a competitive offer.

**5. Under Contract (30-45 days)** - Inspection, appraisal, title search, loan approval.

**6. Closing Day** - Sign documents, transfer funds, get your keys!

💡 The entire process typically takes 30-60 days from offer to closing.`,

  "how much house can i afford": `Here's how to calculate what you can afford:

**The 28/36 Rule:**
- Housing costs shouldn't exceed **28%** of gross monthly income
- Total debt shouldn't exceed **36%**

**Example:** $100,000/year income = ~$2,333/month max housing

**Quick Estimate:** With 20% down and good credit, you can typically afford a home **3-4.5x your annual income**.

📱 Try the calculators in our Mortgage Rate Monitor app for personalized estimates!`,

  "closing costs": `**Closing costs typically range from 2-5% of the loan amount.**

Includes: Loan origination, appraisal, title insurance, inspections, prepaid taxes/insurance.

**Example on a $350,000 home:** $7,000 - $17,500

💡 You can often negotiate seller credits to cover some closing costs!`,

  "title insurance": `**Title insurance protects you from hidden problems with ownership.**

Without clear title, you could lose your home to unknown heirs, forged documents, or unpaid liens.

**Two Types:**
1. **Lender's Policy** (Required)
2. **Owner's Policy** (Recommended)

Cost: One-time premium at closing, typically $1,000-$3,000.

💡 Always get an owner's policy - it's peace of mind!`,

  "competitive offer": `**How to Make a Winning Offer:**

1. **Price Strategically** - Consider offering at or above asking in hot markets
2. **Increase Earnest Money** - 3-5% shows you're serious
3. **Minimize Contingencies** - But keep inspection if possible
4. **Get Fully Pre-Approved** - Not just pre-qualified
5. **Write a Personal Letter** - Make an emotional connection
6. **Consider Escalation Clause** - Beat other offers automatically

💡 A quick, clean offer often beats a higher messy one!`,

  "mortgage documents": `**Documents Needed for Pre-Approval:**

**Income:** Last 2 years W-2s, 30 days pay stubs, 2 years tax returns
**Assets:** 2 months bank statements, investment accounts
**ID:** Driver's license, Social Security card

💡 Gather these BEFORE you start shopping!`,
}

export default function AIAssistantClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm your Real Estate AI Assistant. I can help answer questions about:

• **Buying or Selling** a home
• **Mortgages & Financing** options
• **Legal terms** and processes
• **Market conditions**

What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findBestAnswer = (question: string): string => {
    const q = question.toLowerCase()
    
    for (const [key, answer] of Object.entries(EXPERT_KNOWLEDGE)) {
      if (q.includes(key) || key.split(' ').every(word => q.includes(word))) {
        return answer
      }
    }
    
    if (q.includes('buy') && q.includes('process')) return EXPERT_KNOWLEDGE["home buying process"]
    if (q.includes('afford')) return EXPERT_KNOWLEDGE["how much house can i afford"]
    if (q.includes('closing cost')) return EXPERT_KNOWLEDGE["closing costs"]
    if (q.includes('title insurance')) return EXPERT_KNOWLEDGE["title insurance"]
    if (q.includes('offer') && (q.includes('competitive') || q.includes('strong'))) return EXPERT_KNOWLEDGE["competitive offer"]
    if (q.includes('document') && q.includes('mortgage')) return EXPERT_KNOWLEDGE["mortgage documents"]
    
    return `Great question! I'd be happy to help with that. Could you give me a bit more detail about what you'd like to know?

In the meantime, here are some resources:
• 📚 **Education Center** - Comprehensive courses
• 🧮 **Mortgage Calculators** - Financial planning tools
• 📖 **Glossary** - Real estate terms explained

Feel free to ask about buying, selling, mortgages, or any real estate topic!`
  }

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

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: findBestAnswer(input),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
          <Bot className="text-white" size={28} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            AI Assistant Pro
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
          </h1>
          <p className="text-gray-600">Ask anything about real estate</p>
        </div>
        <a 
          href="https://mortgage.craudiovizai.com/calculators"
          target="_blank"
          className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
        >
          Calculators <ExternalLink size={14} />
        </a>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q.text)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
            >
              <q.icon size={14} className="text-blue-600" />
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 bg-white rounded-xl border overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={18} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}>
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600" size={18} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={18} />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about real estate..."
              className="flex-1 px-4 py-3 border rounded-xl"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI responses are for informational purposes. Consult professionals for specific advice.
          </p>
        </div>
      </div>
    </div>
  )
}
