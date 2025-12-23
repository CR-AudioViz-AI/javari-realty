// app/customer/dashboard/mortgage/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Calculator, DollarSign, TrendingUp, TrendingDown, Minus,
  Home, PiggyBank, Percent, Calendar, Info, RefreshCw,
  ChevronDown, ChevronUp, Download, Share2, ExternalLink,
  AlertCircle, CheckCircle, Clock, BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface MortgageRates {
  thirtyYear: { date: string; rate: number; change: number; changePercent: number }
  fifteenYear: { date: string; rate: number; change: number; changePercent: number }
  fiveOneArm: { date: string; rate: number; change: number; changePercent: number } | null
  lastUpdated: string
  marketTrend: 'rising' | 'falling' | 'stable'
  prediction: string
  sourceUrl: string
  historicalData: {
    thirtyYear: { date: string; value: number }[]
    fifteenYear: { date: string; value: number }[]
  }
}

interface CalculationResult {
  monthlyPayment: number
  totalInterest: number
  totalCost: number
  breakdown: {
    principalAndInterest: number
    estimatedTaxes: number
    estimatedInsurance: number
    estimatedPMI: number
  }
}

interface AffordabilityResult {
  maxHomePrice: number
  maxMonthlyPayment: number
  dti: number
}

interface ComparisonScenario {
  name: string
  rate: number
  termYears: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}

export default function MortgageCalculatorPage() {
  // Live rates state
  const [liveRates, setLiveRates] = useState<MortgageRates | null>(null)
  const [loadingRates, setLoadingRates] = useState(true)
  const [ratesError, setRatesError] = useState<string | null>(null)

  // Calculator inputs
  const [homePrice, setHomePrice] = useState(400000)
  const [downPayment, setDownPayment] = useState(80000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanTerm, setLoanTerm] = useState(30)
  const [interestRate, setInterestRate] = useState(6.5)
  const [propertyTax, setPropertyTax] = useState(1.25)
  const [homeInsurance, setHomeInsurance] = useState(1800)
  const [pmiRate, setPmiRate] = useState(0.8)
  const [hoaFees, setHoaFees] = useState(0)

  // Affordability inputs
  const [monthlyIncome, setMonthlyIncome] = useState(10000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)

  // Results
  const [calculation, setCalculation] = useState<CalculationResult | null>(null)
  const [affordability, setAffordability] = useState<AffordabilityResult | null>(null)
  const [comparison, setComparison] = useState<ComparisonScenario[]>([])

  // UI state
  const [activeTab, setActiveTab] = useState<'calculator' | 'affordability' | 'compare'>('calculator')
  const [showAmortization, setShowAmortization] = useState(false)
  const [amortizationData, setAmortizationData] = useState<any[]>([])

  // Fetch live rates
  const fetchLiveRates = useCallback(async () => {
    setLoadingRates(true)
    setRatesError(null)
    try {
      const res = await fetch('/api/mortgage-rates?action=rates')
      if (!res.ok) throw new Error('Failed to fetch rates')
      const data = await res.json()
      setLiveRates(data)
      setInterestRate(data.thirtyYear.rate)
    } catch (error) {
      setRatesError('Unable to fetch live rates. Using estimated rates.')
      console.error(error)
    } finally {
      setLoadingRates(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveRates()
  }, [fetchLiveRates])

  // Calculate mortgage
  const calculateMortgage = useCallback(async () => {
    const principal = homePrice - downPayment
    try {
      const res = await fetch(
        `/api/mortgage-rates?action=calculate&principal=${principal}&rate=${interestRate}&term=${loanTerm}`
      )
      if (!res.ok) throw new Error('Calculation failed')
      const data = await res.json()
      setCalculation(data)
    } catch (error) {
      console.error('Calculation error:', error)
    }
  }, [homePrice, downPayment, interestRate, loanTerm])

  // Calculate affordability
  const calculateAffordability = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/mortgage-rates?action=affordability&income=${monthlyIncome}&debts=${monthlyDebts}&downPayment=${downPayment}&rate=${interestRate}&term=${loanTerm}`
      )
      if (!res.ok) throw new Error('Affordability calculation failed')
      const data = await res.json()
      setAffordability(data)
    } catch (error) {
      console.error('Affordability error:', error)
    }
  }, [monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm])

  // Compare scenarios
  const fetchComparison = useCallback(async () => {
    const principal = homePrice - downPayment
    try {
      const res = await fetch(`/api/mortgage-rates?action=compare&principal=${principal}`)
      if (!res.ok) throw new Error('Comparison failed')
      const data = await res.json()
      setComparison(data.comparison)
    } catch (error) {
      console.error('Comparison error:', error)
    }
  }, [homePrice, downPayment])

  // Fetch amortization
  const fetchAmortization = useCallback(async () => {
    const principal = homePrice - downPayment
    try {
      const res = await fetch(
        `/api/mortgage-rates?action=amortization&principal=${principal}&rate=${interestRate}&term=${loanTerm}&summary=true`
      )
      if (!res.ok) throw new Error('Amortization failed')
      const data = await res.json()
      setAmortizationData(data.yearlySummary)
    } catch (error) {
      console.error('Amortization error:', error)
    }
  }, [homePrice, downPayment, interestRate, loanTerm])

  useEffect(() => {
    calculateMortgage()
  }, [calculateMortgage])

  useEffect(() => {
    if (activeTab === 'affordability') calculateAffordability()
  }, [activeTab, calculateAffordability])

  useEffect(() => {
    if (activeTab === 'compare') fetchComparison()
  }, [activeTab, fetchComparison])

  // Sync down payment percent and amount
  const handleDownPaymentChange = (value: number, isPercent: boolean) => {
    if (isPercent) {
      setDownPaymentPercent(value)
      setDownPayment(Math.round(homePrice * value / 100))
    } else {
      setDownPayment(value)
      setDownPaymentPercent(Math.round((value / homePrice) * 100))
    }
  }

  const handleHomePriceChange = (value: number) => {
    setHomePrice(value)
    setDownPayment(Math.round(value * downPaymentPercent / 100))
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-600' // Rates up = bad for buyers
    if (change < 0) return 'text-green-600' // Rates down = good for buyers
    return 'text-gray-600'
  }

  const principal = homePrice - downPayment
  const needsPMI = downPaymentPercent < 20
  
  // Total monthly payment including taxes, insurance, PMI, HOA
  const totalMonthly = calculation ? (
    calculation.breakdown.principalAndInterest +
    Math.round(homePrice * propertyTax / 100 / 12) +
    Math.round(homeInsurance / 12) +
    (needsPMI ? Math.round(principal * pmiRate / 100 / 12) : 0) +
    hoaFees
  ) : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              Mortgage Calculator
            </h1>
            <p className="text-gray-600 mt-1">Calculate payments with live rates from the Federal Reserve</p>
          </div>
          <button 
            onClick={fetchLiveRates}
            disabled={loadingRates}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRates ? 'animate-spin' : ''}`} />
            Refresh Rates
          </button>
        </div>

        {/* Live Rates Banner */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Live Mortgage Rates
            </h2>
            {liveRates && (
              <a 
                href={liveRates.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Source: FRED <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {loadingRates ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : ratesError ? (
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{ratesError}</span>
            </div>
          ) : liveRates && (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* 30-Year Rate */}
                <div 
                  onClick={() => { setInterestRate(liveRates.thirtyYear.rate); setLoanTerm(30) }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    loanTerm === 30 && interestRate === liveRates.thirtyYear.rate
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="text-sm text-gray-500 mb-1">30-Year Fixed</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{liveRates.thirtyYear.rate}%</span>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(liveRates.thirtyYear.change)}`}>
                      {getTrendIcon(liveRates.thirtyYear.change)}
                      <span>{liveRates.thirtyYear.change > 0 ? '+' : ''}{liveRates.thirtyYear.change}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Updated {liveRates.thirtyYear.date}</div>
                </div>

                {/* 15-Year Rate */}
                <div 
                  onClick={() => { setInterestRate(liveRates.fifteenYear.rate); setLoanTerm(15) }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    loanTerm === 15 && interestRate === liveRates.fifteenYear.rate
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="text-sm text-gray-500 mb-1">15-Year Fixed</div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{liveRates.fifteenYear.rate}%</span>
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor(liveRates.fifteenYear.change)}`}>
                      {getTrendIcon(liveRates.fifteenYear.change)}
                      <span>{liveRates.fifteenYear.change > 0 ? '+' : ''}{liveRates.fifteenYear.change}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Updated {liveRates.fifteenYear.date}</div>
                </div>

                {/* 5/1 ARM */}
                {liveRates.fiveOneArm && (
                  <div 
                    onClick={() => { setInterestRate(liveRates.fiveOneArm!.rate); setLoanTerm(30) }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      interestRate === liveRates.fiveOneArm.rate
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="text-sm text-gray-500 mb-1">5/1 ARM</div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-gray-900">{liveRates.fiveOneArm.rate}%</span>
                      <div className={`flex items-center gap-1 text-sm ${getTrendColor(liveRates.fiveOneArm.change)}`}>
                        {getTrendIcon(liveRates.fiveOneArm.change)}
                        <span>{liveRates.fiveOneArm.change > 0 ? '+' : ''}{liveRates.fiveOneArm.change}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Updated {liveRates.fiveOneArm.date}</div>
                  </div>
                )}
              </div>

              {/* Market Insight */}
              <div className={`p-4 rounded-lg ${
                liveRates.marketTrend === 'rising' ? 'bg-red-50 border border-red-100' :
                liveRates.marketTrend === 'falling' ? 'bg-green-50 border border-green-100' :
                'bg-blue-50 border border-blue-100'
              }`}>
                <div className="flex items-start gap-3">
                  <Info className={`w-5 h-5 mt-0.5 ${
                    liveRates.marketTrend === 'rising' ? 'text-red-600' :
                    liveRates.marketTrend === 'falling' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">Market Insight</div>
                    <p className="text-sm text-gray-700">{liveRates.prediction}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(['calculator', 'affordability', 'compare'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {tab === 'calculator' && 'Payment Calculator'}
              {tab === 'affordability' && 'Affordability'}
              {tab === 'compare' && 'Compare Loans'}
            </button>
          ))}
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Loan Details</h3>
              
              {/* Home Price */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => handleHomePriceChange(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <input
                  type="range"
                  min="100000"
                  max="2000000"
                  step="10000"
                  value={homePrice}
                  onChange={(e) => handleHomePriceChange(parseInt(e.target.value))}
                  className="w-full mt-2 accent-green-600"
                />
              </div>

              {/* Down Payment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(parseInt(e.target.value) || 0, false)}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => handleDownPaymentChange(parseInt(e.target.value) || 0, true)}
                      className="w-full pl-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {needsPMI && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>PMI required (less than 20% down)</span>
                  </div>
                )}
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.125"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map(term => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        loanTerm === term
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {term} years
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Costs */}
              <div className="border-t pt-6 mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Additional Monthly Costs</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Property Tax Rate (%/yr)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Home Insurance ($/yr)</label>
                    <input
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">HOA Fees ($/mo)</label>
                    <input
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  {needsPMI && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">PMI Rate (%/yr)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pmiRate}
                        onChange={(e) => setPmiRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Monthly Payment Summary */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="text-green-100 mb-2">Estimated Monthly Payment</div>
                <div className="text-5xl font-bold mb-4">{formatCurrency(totalMonthly)}</div>
                <div className="text-green-100 text-sm">
                  Loan Amount: {formatCurrency(principal)} • {loanTerm} years @ {interestRate}%
                </div>
              </div>

              {/* Payment Breakdown */}
              {calculation && (
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-semibold">{formatCurrency(calculation.breakdown.principalAndInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-semibold">{formatCurrency(Math.round(homePrice * propertyTax / 100 / 12))}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Home Insurance</span>
                      <span className="font-semibold">{formatCurrency(Math.round(homeInsurance / 12))}</span>
                    </div>
                    {needsPMI && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">PMI</span>
                        <span className="font-semibold">{formatCurrency(Math.round(principal * pmiRate / 100 / 12))}</span>
                      </div>
                    )}
                    {hoaFees > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">HOA Fees</span>
                        <span className="font-semibold">{formatCurrency(hoaFees)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 bg-gray-50 -mx-2 px-2 rounded-lg">
                      <span className="font-semibold text-gray-900">Total Monthly</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(totalMonthly)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Loan Summary */}
              {calculation && (
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Total Interest</div>
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(calculation.totalInterest)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Total Cost</div>
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(calculation.totalCost)}</div>
                    </div>
                  </div>

                  {/* Amortization Toggle */}
                  <button
                    onClick={() => {
                      setShowAmortization(!showAmortization)
                      if (!showAmortization && amortizationData.length === 0) {
                        fetchAmortization()
                      }
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 border rounded-xl hover:bg-gray-50"
                  >
                    {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
                  </button>

                  {showAmortization && amortizationData.length > 0 && (
                    <div className="mt-4 max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left">Year</th>
                            <th className="px-3 py-2 text-right">Principal</th>
                            <th className="px-3 py-2 text-right">Interest</th>
                            <th className="px-3 py-2 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortizationData.map((year: any) => (
                            <tr key={year.year} className="border-b">
                              <td className="px-3 py-2">{year.year}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(year.totalPrincipal)}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(year.totalInterest)}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(year.endingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Affordability Tab */}
        {activeTab === 'affordability' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Financial Picture</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Monthly Income</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Debts (car, student loans, credit cards)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Down Payment</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {affordability && (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="text-blue-100 mb-2">Maximum Home Price You Can Afford</div>
                    <div className="text-5xl font-bold mb-4">{formatCurrency(affordability.maxHomePrice)}</div>
                    <div className="text-blue-100 text-sm">
                      Based on {affordability.dti}% max debt-to-income ratio
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Affordability Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Max Monthly Payment</span>
                        <span className="font-semibold">{formatCurrency(affordability.maxMonthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Down Payment</span>
                        <span className="font-semibold">{formatCurrency(downPayment)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Max Loan Amount</span>
                        <span className="font-semibold">{formatCurrency(affordability.maxHomePrice - downPayment)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Note:</strong> This estimate includes principal and interest only. 
                        Add property taxes, insurance, PMI, and HOA fees for a complete picture.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && comparison.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Loan Comparison</h3>
              <p className="text-gray-600 text-sm">Comparing scenarios for {formatCurrency(principal)} loan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loan Type</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Rate</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Term</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Monthly Payment</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total Interest</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((scenario, idx) => (
                    <tr key={scenario.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{scenario.name}</td>
                      <td className="px-6 py-4 text-right">{scenario.rate}%</td>
                      <td className="px-6 py-4 text-right">{scenario.termYears} years</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(scenario.monthlyPayment)}</td>
                      <td className="px-6 py-4 text-right text-red-600">{formatCurrency(scenario.totalInterest)}</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(scenario.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
