'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Send, Bot, User, Sparkles, BookOpen, Calculator,
  Home, DollarSign, FileText, HelpCircle, Loader2, ChevronDown,
  Lightbulb, Target, Shield
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

const EXPERT_KNOWLEDGE = {
  "home buying process": `The home buying process typically involves these key steps:

**1. Get Pre-Approved (1-3 days)**
Start by getting pre-approved for a mortgage. This shows sellers you're serious and tells you how much you can afford.

**2. Find a Real Estate Agent**
Choose an agent who knows your target area. They'll help you navigate the entire process.

**3. House Hunting (2-8 weeks)**
View homes that match your criteria. Take notes and photos at each showing.

**4. Make an Offer**
When you find "the one," your agent will help you craft a competitive offer with appropriate contingencies.

**5. Under Contract (30-45 days)**
- Home inspection (7-10 days)
- Appraisal (1-2 weeks)
- Title search
- Final loan approval

**6. Closing Day**
Sign documents, transfer funds, and get your keys!

💡 **Pro Tip:** The entire process typically takes 30-60 days from offer to closing.`,

  "how much house can i afford": `Great question! Here's how to calculate what you can afford:

**The 28/36 Rule:**
- Housing costs shouldn't exceed **28%** of gross monthly income
- Total debt (including housing) shouldn't exceed **36%**

**Example:**
If you earn $100,000/year ($8,333/month):
- Max housing payment: $2,333/month (28%)
- Max total debt: $3,000/month (36%)

**Factors Lenders Consider:**
✅ Credit score (higher = better rates)
✅ Down payment amount
✅ Debt-to-income ratio
✅ Employment history
✅ Savings/reserves

**Quick Estimate:**
With 20% down and good credit, you can typically afford a home **3-4.5x your annual income**.

📱 **Try our Affordability Calculator** for a personalized estimate!`,

  "closing costs": `**Closing costs typically range from 2-5% of the loan amount.**

**Buyer's Closing Costs Include:**

*Lender Fees:*
- Loan origination fee (0.5-1%)
- Appraisal ($400-600)
- Credit report ($30-50)
- Underwriting fee ($300-500)

*Third-Party Fees:*
- Title insurance ($1,000-3,000)
- Title search ($200-400)
- Survey ($300-500)
- Home inspection ($300-500)
- Attorney fees (varies by state)

*Prepaid Items:*
- Property taxes (2-6 months)
- Homeowner's insurance (1 year)
- Prepaid interest (15-30 days)
- PMI (if applicable)

**Example on a $350,000 home:**
- Low estimate: $7,000 (2%)
- High estimate: $17,500 (5%)

💡 **Pro Tip:** You can often negotiate seller credits to cover some closing costs!`,

  "title insurance": `**Title insurance protects you from hidden problems with the property's ownership history.**

**Why It's Important:**
Without clear title, you could lose your home to:
- Unknown heirs claiming ownership
- Forged documents in the chain of title
- Unpaid liens (contractor, tax, or HOA)
- Recording errors
- Fraud

**Two Types:**
1. **Lender's Policy** (Required) - Protects the lender's investment
2. **Owner's Policy** (Optional but recommended) - Protects YOUR equity

**Cost:**
- One-time premium at closing
- Typically $1,000-$3,000
- Protects you as long as you own the home

**What Happens Before Closing:**
A title company will:
✅ Search public records
✅ Identify any issues
✅ Work to resolve problems
✅ Issue insurance policy

💡 **Pro Tip:** Always get an owner's policy - it's a small price for peace of mind!`,

  "competitive offer": `**How to Make a Winning Offer:**

**1. Price Strategically**
- In a hot market, consider offering at or above asking
- Look at recent comparable sales
- Your agent can advise on local conditions

**2. Increase Earnest Money**
- Standard: 1-3% of price
- Stronger offer: 3-5%
- Shows seller you're serious

**3. Minimize Contingencies (carefully)**
- Keep inspection contingency if possible
- Shorter inspection periods (7 days vs 14)
- Flexible closing date

**4. Get Fully Pre-Approved**
- Not just pre-qualified
- Have all documents ready
- Lender letter from local/reputable company

**5. Write a Personal Letter**
- Explain why you love the home
- Make an emotional connection
- Keep it brief and sincere

**6. Consider Escalation Clause**
- "I'll beat any offer by $X up to $Y"
- Protects you from overpaying

💡 **Pro Tip:** A quick, clean offer often beats a higher messy one!`,

  "mortgage documents": `**Documents Needed for Mortgage Pre-Approval:**

**Income Verification:**
✅ Last 2 years of W-2s
✅ Last 30 days of pay stubs
✅ Last 2 years of tax returns (all pages)
✅ If self-employed: Business tax returns + P&L

**Asset Documentation:**
✅ Last 2 months of bank statements (all pages)
✅ Retirement account statements
✅ Investment account statements
✅ Gift letter (if receiving gift funds)

**Identification:**
✅ Driver's license or passport
✅ Social Security card

**Other:**
✅ Rental history (landlord contact info)
✅ Divorce decree (if applicable)
✅ Bankruptcy discharge papers (if applicable)
✅ Explanation letters for any credit issues

**Tips for Success:**
📁 Keep digital copies organized
📁 Don't open new credit accounts
📁 Don't make large purchases
📁 Keep job stable during process

💡 **Pro Tip:** Gather these documents BEFORE you start shopping!`,
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm your Real Estate AI Assistant. I can help answer questions about:

• **Buying or Selling** a home
• **Mortgages & Financing** options
• **Legal terms** and processes
• **Market conditions**
• **Investment strategies**

What would you like to know?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestAnswer = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('buy') && q.includes('process') || q.includes('steps to buy')) {
      return EXPERT_KNOWLEDGE["home buying process"]
    }
    if (q.includes('afford') || q.includes('how much house') || q.includes('budget')) {
      return EXPERT_KNOWLEDGE["how much house can i afford"]
    }
    if (q.includes('closing cost')) {
      return EXPERT_KNOWLEDGE["closing costs"]
    }
    if (q.includes('title insurance')) {
      return EXPERT_KNOWLEDGE["title insurance"]
    }
    if (q.includes('offer') && (q.includes('competitive') || q.includes('strong') || q.includes('winning'))) {
      return EXPERT_KNOWLEDGE["competitive offer"]
    }
    if (q.includes('document') && (q.includes('mortgage') || q.includes('loan') || q.includes('pre-approval'))) {
      return EXPERT_KNOWLEDGE["mortgage documents"]
    }
    
    // Default helpful response
    return `That's a great question! While I have extensive knowledge about real estate, I want to make sure I give you accurate information.

Here are some resources that might help:
• 📚 **Education Center** - Comprehensive courses and guides
• 🧮 **Calculators** - Financial tools for planning
• 📖 **Glossary** - Real estate terms explained
• 👥 **Vendor Directory** - Connect with local experts

You can also try rephrasing your question, or ask about specific topics like:
- Home buying/selling process
- Mortgage and financing
- Closing costs
- Making offers
- Working with agents

How else can I help you?`
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

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const answer = findBestAnswer(input)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
          <Bot className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Real Estate AI Assistant
            <Sparkles className="text-yellow-500" size={20} />
          </h1>
          <p className="text-gray-600">Ask me anything about buying, selling, or financing</p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q.text)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              <q.icon size={14} className="text-blue-600" />
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl border overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={18} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>
                    }
                    if (line.startsWith('*') && line.endsWith('*')) {
                      return <p key={i} className="italic text-gray-600">{line.replace(/\*/g, '')}</p>
                    }
                    if (line.startsWith('✅') || line.startsWith('📁') || line.startsWith('💡') || line.startsWith('📱')) {
                      return <p key={i} className="ml-2">{line}</p>
                    }
                    if (line.startsWith('•')) {
                      return <p key={i} className="ml-4">{line}</p>
                    }
                    return <p key={i}>{line}</p>
                  })}
                </div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={18} />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="animate-spin text-gray-400" size={20} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about real estate..."
              className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI responses are for informational purposes. Always consult professionals for specific advice.
          </p>
        </div>
      </div>
    </div>
  )
}
