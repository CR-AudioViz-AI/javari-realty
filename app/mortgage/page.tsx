// CR AudioViz AI - Realtor Platform
// Mortgage Tools Module - Integrated Rate Monitor
// December 16, 2025
//
// This embeds the Mortgage Rate Monitor functionality directly into the Realtor Platform
// Uses central auth from craudiovizai.com

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Calculator, Bell, Users,
  Home, DollarSign, Percent, ArrowRight, ExternalLink,
  Building2, Clock, ChevronRight, Sparkles, Send,
  RefreshCw, Star, AlertCircle, Info
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

export default function MortgageToolsPage() {
  const [rates, setRates] = useState<MortgageRate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Mortgage Tools</h1>
                  <p className="text-blue-100 text-sm">Real-time rates to help close deals faster</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRates}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Rates
              </button>
              <a
                href={MORTGAGE_API}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Full Rate Monitor
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-blue-200 text-xs mt-4 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {lastUpdate.toLocaleTimeString()} • Source: Freddie Mac PMMS via FRED
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Rate Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Quick Payment Calculator
                </h2>
                <span className="text-xs text-gray-500">Share with clients</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
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

                {/* Results */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Estimated Monthly Payment</h3>
                  {calcResult ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-4">
                        ${calcResult.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="text-lg text-gray-500 font-normal">/mo</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-medium">${(loanAmount - downPayment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Interest:</span>
                          <span className="font-medium">${calcResult.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="font-bold">${calcResult.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Principal & interest only. Does not include taxes, insurance, or PMI.
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">Enter valid values to calculate</p>
                  )}
                </div>
              </div>

              {/* Share with Client */}
              <div className="mt-6 pt-6 border-t">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Send className="w-4 h-4" />
                  Send Quote to Client
                </button>
              </div>
            </div>

            {/* Other Rates */}
            {otherRates.length > 0 && (
              <div className="bg-white rounded-xl border p-6 mt-6">
                <h2 className="text-lg font-bold mb-4">All Current Rates</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {otherRates.map(rate => (
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4">Agent Tools</h3>
              <div className="space-y-2">
                <a
                  href={`${MORTGAGE_API}/compare`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Compare 500+ Lenders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </a>
                <a
                  href={`${MORTGAGE_API}/calculators`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Full Calculator Suite</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </a>
                <a
                  href={`${MORTGAGE_API}/historical`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Historical Trends</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </a>
                <a
                  href={`${MORTGAGE_API}/alerts`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Set Rate Alerts</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                </a>
              </div>
            </div>

            {/* Client Resources */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Share with Clients
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Help your clients understand their buying power with these tools:
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                  <span className="text-sm font-medium">Affordability Calculator</span>
                  <Send className="w-4 h-4 text-green-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                  <span className="text-sm font-medium">Current Rate Summary</span>
                  <Send className="w-4 h-4 text-green-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition">
                  <span className="text-sm font-medium">Payment Comparison</span>
                  <Send className="w-4 h-4 text-green-600" />
                </button>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Star className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 text-sm">Pro Tip</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Set up rate alerts to notify your clients when rates drop. 
                    This shows you're proactive and keeps you top-of-mind!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
