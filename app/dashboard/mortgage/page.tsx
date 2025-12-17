// CR AudioViz AI - Realtor Platform
// Enhanced Mortgage Tools - Real-time Rates + Loan Education
// December 16, 2025
//
// Integrates Mortgage Rate Monitor API with comprehensive loan type education

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Calculator, Bell, Users,
  Home, DollarSign, Percent, ArrowRight, ExternalLink,
  Building2, Clock, ChevronRight, Sparkles, Send,
  RefreshCw, Star, AlertCircle, Info, Shield, Heart,
  Leaf, Landmark, Briefcase, CheckCircle, FileText
} from 'lucide-react'

// Mortgage Rate Monitor API
const MORTGAGE_API = 'https://mortgage-rate-monitor.vercel.app'

interface MortgageRate {
  rateType: string
  rate: number
  change: number
  apr?: number
  points?: number
  lastUpdated: string
}

interface QuickCalcResult {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
}

const LOAN_TYPES = [
  {
    name: 'Conventional',
    icon: Home,
    color: 'blue',
    downPayment: '3-20%',
    creditScore: '620+',
    features: ['Fixed or adjustable rates', 'PMI required under 20% down', 'Conforming loan limits apply', 'Best rates with 740+ credit'],
  },
  {
    name: 'FHA',
    icon: Shield,
    color: 'green',
    downPayment: '3.5%',
    creditScore: '580+',
    features: ['Government-backed', 'Lower credit requirements', 'Upfront & annual MIP', 'Great for first-time buyers'],
  },
  {
    name: 'VA',
    icon: Heart,
    color: 'purple',
    downPayment: '0%',
    creditScore: '620+',
    features: ['Veterans & military only', 'No PMI required', 'Competitive rates', 'Funding fee may apply'],
  },
  {
    name: 'USDA',
    icon: Leaf,
    color: 'emerald',
    downPayment: '0%',
    creditScore: '640+',
    features: ['Rural areas only', 'Income limits apply', 'No down payment', 'Government guaranteed'],
  },
  {
    name: 'Jumbo',
    icon: Building2,
    color: 'amber',
    downPayment: '10-20%',
    creditScore: '700+',
    features: ['Above conforming limits', 'Higher credit required', 'Larger down payments', 'Luxury properties'],
  },
]

export default function MortgageToolsPage() {
  const [rates, setRates] = useState<MortgageRate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<'rates' | 'calculator' | 'loans'>('rates')
  
  // Quick Calculator State
  const [loanAmount, setLoanAmount] = useState(400000)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(6.85)
  const [loanTerm, setLoanTerm] = useState(30)
  const [calcResult, setCalcResult] = useState<QuickCalcResult | null>(null)

  // Fetch current rates
  useEffect(() => {
    fetchRates()
  }, [])

  // Auto-calculate when inputs change
  useEffect(() => {
    calculatePayment()
  }, [loanAmount, downPayment, interestRate, loanTerm])

  async function fetchRates() {
    setLoading(true)
    try {
      const res = await fetch(`${MORTGAGE_API}/api/mortgage/rates`)
      const data = await res.json()
      if (data.success && data.rates) {
        setRates(data.rates)
        setLastUpdate(new Date())
        // Set calculator rate to current 30-year fixed
        const rate30 = data.rates.find((r: MortgageRate) => r.rateType === '30-Year Fixed')
        if (rate30) setInterestRate(rate30.rate)
      }
    } catch (err) {
      console.error('Failed to fetch rates:', err)
    } finally {
      setLoading(false)
    }
  }

  function calculatePayment() {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      setCalcResult(null)
      return
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    const totalPayment = monthlyPayment * numPayments
    const totalInterest = totalPayment - principal

    setCalcResult({
      monthlyPayment,
      totalInterest,
      totalPayment,
    })
  }

  const getRateColor = (change: number) => {
    if (change < 0) return 'text-green-600'
    if (change > 0) return 'text-red-600'
    return 'text-gray-500'
  }

  const getRateBg = (change: number) => {
    if (change < 0) return 'bg-green-50 border-green-200'
    if (change > 0) return 'bg-red-50 border-red-200'
    return 'bg-gray-50 border-gray-200'
  }

  // Hero rates (main ones to show)
  const heroRates = rates.filter(r => ['30-Year Fixed', '15-Year Fixed', '5/1 ARM'].includes(r.rateType))
  const otherRates = rates.filter(r => !['30-Year Fixed', '15-Year Fixed', '5/1 ARM'].includes(r.rateType))

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Building2 className="text-blue-600" />
            Mortgage Tools
          </h1>
          <p className="text-gray-600 mt-1">Real-time rates & calculators to help close deals faster</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={MORTGAGE_API}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Full Rate Monitor
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'rates' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Current Rates
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'calculator' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calculator className="w-4 h-4 inline mr-2" />
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            activeTab === 'loans' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Loan Types
        </button>
      </div>

      {/* Current Rates Tab */}
      {activeTab === 'rates' && (
        <div>
          {/* Hero Rate Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-10 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))
            ) : heroRates.length > 0 ? (
              heroRates.map(rate => (
                <div key={rate.rateType} className={`bg-white rounded-xl border-2 p-6 ${getRateBg(rate.change)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{rate.rateType}</span>
                    {rate.rateType === '30-Year Fixed' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-bold text-gray-900">{rate.rate.toFixed(2)}</span>
                    <span className="text-2xl text-gray-400 mb-1">%</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getRateColor(rate.change)}`}>
                    {rate.change < 0 ? <TrendingDown className="w-4 h-4" /> : rate.change > 0 ? <TrendingUp className="w-4 h-4" /> : null}
                    {rate.change !== 0 ? `${rate.change > 0 ? '+' : ''}${rate.change.toFixed(3)}%` : 'No change'} this week
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-yellow-800">Unable to load rates. Please try refreshing.</p>
              </div>
            )}
          </div>

          {/* All Rates Table */}
          {rates.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">All Current Rates</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rates.map(rate => (
                  <div key={rate.rateType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{rate.rateType}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{rate.rate.toFixed(2)}%</span>
                      <span className={`text-xs ${getRateColor(rate.change)}`}>
                        {rate.change > 0 ? '+' : ''}{rate.change.toFixed(3)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {lastUpdate && (
                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {lastUpdate.toLocaleString()} • Source: Freddie Mac PMMS via FRED
                </p>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <a
              href={`${MORTGAGE_API}/compare`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold">Compare Lenders</p>
                <p className="text-sm text-gray-500">500+ lenders</p>
              </div>
            </a>
            <a
              href={`${MORTGAGE_API}/historical`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-semibold">Historical Trends</p>
                <p className="text-sm text-gray-500">50+ years of data</p>
              </div>
            </a>
            <a
              href={`${MORTGAGE_API}/alerts`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <Bell className="w-8 h-8 text-orange-600" />
              <div>
                <p className="font-semibold">Rate Alerts</p>
                <p className="text-sm text-gray-500">Get notified</p>
              </div>
            </a>
            <a
              href={`${MORTGAGE_API}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold">API Access</p>
                <p className="text-sm text-gray-500">For developers</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-6">Payment Calculator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={e => setLoanAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment ({((downPayment / loanAmount) * 100).toFixed(0)}%)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={e => setDownPayment(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={loanAmount * 0.5}
                  value={downPayment}
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Term
                  </label>
                  <select
                    value={loanTerm}
                    onChange={e => setLoanTerm(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={30}>30 years</option>
                    <option value={20}>20 years</option>
                    <option value={15}>15 years</option>
                    <option value={10}>10 years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium text-blue-100 mb-4">Estimated Monthly Payment</h3>
            {calcResult ? (
              <>
                <div className="text-5xl font-bold mb-6">
                  ${calcResult.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-lg text-blue-200 font-normal">/mo</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-blue-100">Loan Amount:</span>
                    <span className="font-medium">${(loanAmount - downPayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span className="text-blue-100">Total Interest:</span>
                    <span className="font-medium">${calcResult.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-blue-100">Total Cost:</span>
                    <span className="font-bold text-lg">${calcResult.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <p className="text-xs text-blue-200 mt-6 flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Principal & interest only. Does not include taxes, insurance, or PMI.
                </p>
                <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition">
                  <Send className="w-4 h-4" />
                  Send Quote to Client
                </button>
              </>
            ) : (
              <p className="text-blue-200">Enter valid values to calculate</p>
            )}
          </div>
        </div>
      )}

      {/* Loan Types Tab */}
      {activeTab === 'loans' && (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOAN_TYPES.map(loan => {
              const colors = colorClasses[loan.color]
              const Icon = loan.icon
              return (
                <div key={loan.name} className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{loan.name}</h3>
                      <p className={`text-sm ${colors.text}`}>Loan</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Down Payment</p>
                      <p className="font-bold">{loan.downPayment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credit Score</p>
                      <p className="font-bold">{loan.creditScore}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {loan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Pro Tip */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Agent Pro Tip</h3>
                <p className="text-gray-700">
                  Understanding loan types helps you guide clients to the best financing options. 
                  First-time buyers often benefit from FHA loans, veterans should always explore VA options, 
                  and clients in rural areas may qualify for zero-down USDA loans.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
