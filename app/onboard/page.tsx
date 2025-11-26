// app/onboard/page.tsx
// Automated Realtor Onboarding - Generate Demo in 60 Seconds
// Sales tool to instantly create demos from any realtor website

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, Sparkles, Users, Building2, CheckCircle, ArrowRight, Loader2, Copy, ExternalLink, Zap, Shield, BarChart3, Clock, DollarSign, Phone, Mail, MapPin } from 'lucide-react'

interface DemoResult {
  success: boolean
  demoId: string
  demoUrl: string
  previewUrl: string
  credentials: {
    admin: { email: string; password: string }
    agents: Array<{ name: string; email: string; password: string }>
  }
  summary: {
    brokerage: string
    agentCount: number
    propertyCount: number
    markets: string[]
    propertyTypes: string[]
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Manual entry form state
  const [manualData, setManualData] = useState({
    brokerageName: '',
    brokeragePhone: '',
    brokerageEmail: '',
    brokerageAddress: '',
    brokerageCity: '',
    brokerageState: 'FL',
    agentName1: '',
    agentPhone1: '',
    agentEmail1: '',
    agentBio1: '',
    agentName2: '',
    agentPhone2: '',
    agentEmail2: '',
    agentBio2: '',
    markets: [] as string[],
  })

  const floridaMarkets = [
    'Naples', 'Fort Myers', 'Bonita Springs', 'Cape Coral', 'Lehigh Acres',
    'Marco Island', 'Estero', 'Sanibel', 'Fort Myers Beach', 'Golden Gate'
  ]

  const simulateCrawl = async () => {
    setIsProcessing(true)
    setProgress(0)
    
    const steps = [
      { progress: 10, text: 'Connecting to website...' },
      { progress: 25, text: 'Extracting brokerage information...' },
      { progress: 40, text: 'Finding agent profiles...' },
      { progress: 55, text: 'Scanning property listings...' },
      { progress: 70, text: 'Analyzing market coverage...' },
      { progress: 85, text: 'Generating demo environment...' },
      { progress: 95, text: 'Creating login credentials...' },
      { progress: 100, text: 'Demo ready!' },
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(step.progress)
      setProgressText(step.text)
    }

    // Simulate result (would call API in production)
    const slug = manualData.brokerageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'demo-brokerage'

    const result: DemoResult = {
      success: true,
      demoId: `demo-${slug}-${Date.now()}`,
      demoUrl: `/demo/${slug}`,
      previewUrl: `https://cr-realtor-platform.vercel.app/demo/${slug}`,
      credentials: {
        admin: {
          email: `admin@${slug}.demo.cr-realtor.com`,
          password: 'Demo2024!Admin'
        },
        agents: [
          ...(manualData.agentName1 ? [{
            name: manualData.agentName1,
            email: `${manualData.agentName1.toLowerCase().replace(/\s+/g, '.')}@${slug}.demo.cr-realtor.com`,
            password: 'Demo2024!Agent'
          }] : []),
          ...(manualData.agentName2 ? [{
            name: manualData.agentName2,
            email: `${manualData.agentName2.toLowerCase().replace(/\s+/g, '.')}@${slug}.demo.cr-realtor.com`,
            password: 'Demo2024!Agent'
          }] : [])
        ]
      },
      summary: {
        brokerage: manualData.brokerageName || 'Demo Brokerage',
        agentCount: (manualData.agentName1 ? 1 : 0) + (manualData.agentName2 ? 1 : 0),
        propertyCount: 8,
        markets: manualData.markets.length > 0 ? manualData.markets : ['Naples', 'Fort Myers'],
        propertyTypes: ['Residential Sale', 'Residential Rent', 'Commercial']
      }
    }

    setDemoResult(result)
    setIsProcessing(false)
    setStep(3)
  }

  const copyCredentials = () => {
    if (!demoResult) return
    
    const text = `
${demoResult.summary.brokerage} - Demo Credentials
================================================
Demo URL: ${demoResult.previewUrl}

Admin Login:
Email: ${demoResult.credentials.admin.email}
Password: ${demoResult.credentials.admin.password}

${demoResult.credentials.agents.map(a => `
${a.name} Login:
Email: ${a.email}
Password: ${a.password}`).join('\n')}
    `.trim()
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleMarket = (market: string) => {
    setManualData(prev => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter(m => m !== market)
        : [...prev.markets, market]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CR</span>
              </div>
              <span className="text-xl font-bold">CR Realtor Platform</span>
            </Link>
            <div className="text-sm text-gray-500">
              Realtor Onboarding Tool
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-md mx-auto">
            <span>Enter Info</span>
            <span>Generate</span>
            <span>Ready!</span>
          </div>
        </div>

        {/* Step 1: Enter Information */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-medium">Generate Demo in 60 Seconds</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Onboard a New Realtor</h1>
              <p className="text-xl text-gray-600">
                Enter their information and we will generate a complete demo site instantly
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Brokerage Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-2 text-blue-600" />
                  Brokerage Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage Name *</label>
                    <input
                      type="text"
                      value={manualData.brokerageName}
                      onChange={(e) => setManualData({ ...manualData, brokerageName: e.target.value })}
                      placeholder="e.g., Premiere Plus Realty"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={manualData.brokeragePhone}
                      onChange={(e) => setManualData({ ...manualData, brokeragePhone: e.target.value })}
                      placeholder="(239) 555-0100"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={manualData.brokerageEmail}
                      onChange={(e) => setManualData({ ...manualData, brokerageEmail: e.target.value })}
                      placeholder="info@brokerage.com"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={manualData.brokerageCity}
                      onChange={(e) => setManualData({ ...manualData, brokerageCity: e.target.value })}
                      placeholder="Naples"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Agent 1 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Primary Agent
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={manualData.agentName1}
                      onChange={(e) => setManualData({ ...manualData, agentName1: e.target.value })}
                      placeholder="e.g., Tony Harvey"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={manualData.agentPhone1}
                      onChange={(e) => setManualData({ ...manualData, agentPhone1: e.target.value })}
                      placeholder="(239) 555-0101"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
                    <textarea
                      value={manualData.agentBio1}
                      onChange={(e) => setManualData({ ...manualData, agentBio1: e.target.value })}
                      placeholder="Brief bio about the agent..."
                      rows={2}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Agent 2 (Optional) */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-gray-400" />
                  Second Agent (Optional)
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={manualData.agentName2}
                      onChange={(e) => setManualData({ ...manualData, agentName2: e.target.value })}
                      placeholder="e.g., Laura Harvey"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={manualData.agentPhone2}
                      onChange={(e) => setManualData({ ...manualData, agentPhone2: e.target.value })}
                      placeholder="(239) 555-0102"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Markets */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Markets Served
                </h2>
                <div className="flex flex-wrap gap-2">
                  {floridaMarkets.map((market) => (
                    <button
                      key={market}
                      onClick={() => toggleMarket(market)}
                      className={`px-4 py-2 rounded-full font-medium transition ${
                        manualData.markets.includes(market)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={() => { setStep(2); simulateCrawl(); }}
                disabled={!manualData.brokerageName || !manualData.agentName1}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-6 h-6" />
                <span>Generate Demo Site</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-spin" />
              <h2 className="text-2xl font-bold mb-4">Generating Demo...</h2>
              <p className="text-gray-600 mb-8">{progressText}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && demoResult && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Demo Ready!</h1>
              <p className="text-xl text-gray-600">
                {demoResult.summary.brokerage} demo site is now live
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Demo URL Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Demo URL
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <code className="text-blue-600 break-all">{demoResult.previewUrl}</code>
                </div>
                <a
                  href={demoResult.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open Demo Site</span>
                </a>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Demo Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brokerage</span>
                    <span className="font-semibold">{demoResult.summary.brokerage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agents</span>
                    <span className="font-semibold">{demoResult.summary.agentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sample Properties</span>
                    <span className="font-semibold">{demoResult.summary.propertyCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Markets</span>
                    <span className="font-semibold">{demoResult.summary.markets.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Demo Credentials
                </h3>
                <button
                  onClick={copyCredentials}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-200 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Admin Login</div>
                  <div className="font-mono text-sm">
                    <div>Email: {demoResult.credentials.admin.email}</div>
                    <div>Password: {demoResult.credentials.admin.password}</div>
                  </div>
                </div>
                
                {demoResult.credentials.agents.map((agent, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">{agent.name}</div>
                    <div className="font-mono text-sm">
                      <div>Email: {agent.email}</div>
                      <div>Password: {agent.password}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <div className="font-semibold">Review Demo</div>
                    <div className="text-blue-100 text-sm">Walk through the demo site yourself</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <div className="font-semibold">Share with Client</div>
                    <div className="text-blue-100 text-sm">Send credentials to the realtor</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <div className="font-semibold">Close the Deal</div>
                    <div className="text-blue-100 text-sm">Convert to paid subscription</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Another */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setStep(1)
                  setDemoResult(null)
                  setManualData({
                    brokerageName: '',
                    brokeragePhone: '',
                    brokerageEmail: '',
                    brokerageAddress: '',
                    brokerageCity: '',
                    brokerageState: 'FL',
                    agentName1: '',
                    agentPhone1: '',
                    agentEmail1: '',
                    agentBio1: '',
                    agentName2: '',
                    agentPhone2: '',
                    agentEmail2: '',
                    agentBio2: '',
                    markets: [],
                  })
                }}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition"
              >
                Create Another Demo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
