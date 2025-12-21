'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircle, ArrowLeft, ArrowRight, DollarSign, 
  Home, CreditCard, Briefcase, PiggyBank, Calculator,
  Shield, Clock, FileCheck, AlertCircle, Sparkles,
  ChevronRight, Lock, TrendingUp, Building, Check
} from 'lucide-react'

type Step = 'income' | 'debts' | 'credit' | 'assets' | 'preferences' | 'results'

interface PreQualData {
  annualIncome: number
  additionalIncome: number
  employmentStatus: string
  yearsEmployed: number
  monthlyDebtPayments: number
  creditScoreRange: string
  savingsAmount: number
  giftFunds: number
  loanType: string
  downPaymentPercent: number
}

interface Results {
  maxPurchasePrice: number
  maxLoanAmount: number
  estimatedPayment: number
  estimatedRate: number
  dtiRatio: number
  isQualified: boolean
  qualificationLevel: 'strong' | 'moderate' | 'weak'
  recommendations: string[]
  programs: string[]
}

const defaultData: PreQualData = {
  annualIncome: 85000,
  additionalIncome: 0,
  employmentStatus: 'employed',
  yearsEmployed: 3,
  monthlyDebtPayments: 500,
  creditScoreRange: 'good',
  savingsAmount: 30000,
  giftFunds: 0,
  loanType: 'conventional',
  downPaymentPercent: 10,
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function calculateResults(data: PreQualData): Results {
  const baseRates: Record<string, number> = { 'excellent': 6.25, 'good': 6.75, 'fair': 7.50, 'poor': 8.50 }
  const loanAdjust: Record<string, number> = { 'conventional': 0, 'fha': 0.25, 'va': -0.25, 'usda': 0 }
  const minDown: Record<string, number> = { 'conventional': 3, 'fha': 3.5, 'va': 0, 'usda': 0 }
  
  const rate = (baseRates[data.creditScoreRange] || 7) + (loanAdjust[data.loanType] || 0)
  const monthlyIncome = (data.annualIncome + data.additionalIncome) / 12
  const maxDTI = data.loanType === 'fha' ? 0.50 : data.loanType === 'va' ? 0.55 : 0.45
  const maxHousingPayment = (monthlyIncome * maxDTI) - data.monthlyDebtPayments
  
  const monthlyRate = rate / 100 / 12
  const numPayments = 360
  const maxLoan = maxHousingPayment > 0 ? maxHousingPayment / (monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1)) * 0.8 : 0
  
  const effectiveDown = Math.max(data.downPaymentPercent, minDown[data.loanType] || 3)
  const maxPrice = maxLoan / (1 - effectiveDown / 100)
  const availableFunds = data.savingsAmount + data.giftFunds
  const cashLimitedPrice = availableFunds / ((effectiveDown / 100) + 0.03)
  const finalMaxPrice = Math.min(maxPrice, cashLimitedPrice)
  
  const finalLoan = finalMaxPrice * (1 - effectiveDown / 100)
  const payment = finalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const dti = ((payment + data.monthlyDebtPayments) / monthlyIncome) * 100

  const programs: string[] = []
  if (data.loanType === 'va') programs.push('VA Home Loan - 0% Down')
  if (data.loanType === 'fha') programs.push('FHA Loan - 3.5% Down')
  if (data.loanType === 'usda') programs.push('USDA Rural Development Loan')
  if (data.creditScoreRange === 'excellent') programs.push('Best Rate Programs Available')
  if (finalMaxPrice > 0 && dti < 36) programs.push('Conventional Loan Eligible')

  const recommendations: string[] = []
  if (dti > 43) recommendations.push('Consider paying down debts to improve qualification')
  if (data.creditScoreRange === 'fair' || data.creditScoreRange === 'poor') recommendations.push('Improving credit score could save thousands in interest')
  if (data.downPaymentPercent < 20) recommendations.push('20% down eliminates PMI (~$100-300/month savings)')
  if (availableFunds < finalMaxPrice * 0.06) recommendations.push('Build reserves for closing costs and emergencies')

  const qualified = finalMaxPrice > 100000 && dti < 50
  const level = dti < 36 && data.creditScoreRange !== 'poor' ? 'strong' : dti < 45 ? 'moderate' : 'weak'

  return {
    maxPurchasePrice: Math.round(finalMaxPrice),
    maxLoanAmount: Math.round(finalLoan),
    estimatedPayment: Math.round(payment),
    estimatedRate: rate,
    dtiRatio: Math.round(dti * 10) / 10,
    isQualified: qualified,
    qualificationLevel: level,
    recommendations,
    programs,
  }
}

function ProgressBar({ currentStep, steps }: { currentStep: Step, steps: Step[] }) {
  const currentIndex = steps.indexOf(currentStep)
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            i < currentIndex ? 'bg-green-500 text-white' : 
            i === currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {i < currentIndex ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 md:w-24 h-1 mx-2 ${i < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PreQualificationPage() {
  const [step, setStep] = useState<Step>('income')
  const [data, setData] = useState<PreQualData>(defaultData)
  const [results, setResults] = useState<Results | null>(null)

  const steps: Step[] = ['income', 'debts', 'credit', 'assets', 'preferences', 'results']
  
  const updateField = (field: keyof PreQualData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      if (steps[currentIndex + 1] === 'results') {
        setResults(calculateResults(data))
      }
      setStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) setStep(steps[currentIndex - 1])
  }

  const restart = () => {
    setStep('income')
    setResults(null)
    setData(defaultData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/search" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Instant Pre-Qualification</h1>
          </div>
          <p className="text-green-100">Find out how much home you can afford in 2 minutes • No credit pull required</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {step !== 'results' && <ProgressBar currentStep={step} steps={steps.slice(0, -1)} />}

        {/* Step: Income */}
        {step === 'income' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl"><Briefcase className="w-6 h-6 text-blue-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Employment & Income</h2>
                <p className="text-gray-500">Tell us about your income sources</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['employed', 'W-2 Employee'], ['self_employed', 'Self-Employed'], ['retired', 'Retired'], ['other', 'Other']].map(([val, label]) => (
                    <button key={val} onClick={() => updateField('employmentStatus', val)}
                      className={`p-4 rounded-xl border-2 text-left ${data.employmentStatus === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Gross Income (before taxes)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={data.annualIncome} onChange={(e) => updateField('annualIncome', parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Annual Income (optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={data.additionalIncome} onChange={(e) => updateField('additionalIncome', parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" placeholder="Bonuses, rental income, etc." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years at Current Job</label>
                <input type="number" value={data.yearsEmployed} onChange={(e) => updateField('yearsEmployed', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" />
              </div>
            </div>
          </div>
        )}

        {/* Step: Debts */}
        {step === 'debts' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl"><CreditCard className="w-6 h-6 text-red-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Monthly Debt Payments</h2>
                <p className="text-gray-500">Your existing monthly obligations</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Monthly Debt Payments</label>
                <p className="text-sm text-gray-500 mb-2">Include: car payments, student loans, credit card minimums, other loans</p>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={data.monthlyDebtPayments} onChange={(e) => updateField('monthlyDebtPayments', parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-800"><strong>Tip:</strong> Don't include utilities, insurance, or subscriptions - only loans and credit cards.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step: Credit */}
        {step === 'credit' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Credit Profile</h2>
                <p className="text-gray-500">Estimate your credit score range</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { val: 'excellent', label: 'Excellent (740+)', desc: 'Best rates available', color: 'green' },
                { val: 'good', label: 'Good (670-739)', desc: 'Competitive rates', color: 'blue' },
                { val: 'fair', label: 'Fair (580-669)', desc: 'FHA/VA options available', color: 'yellow' },
                { val: 'poor', label: 'Needs Work (<580)', desc: 'Limited options', color: 'red' },
              ].map(({ val, label, desc, color }) => (
                <button key={val} onClick={() => updateField('creditScoreRange', val)}
                  className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between ${
                    data.creditScoreRange === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div>
                    <span className="font-semibold text-lg">{label}</span>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>This does NOT affect your credit score</span>
            </div>
          </div>
        )}

        {/* Step: Assets */}
        {step === 'assets' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl"><PiggyBank className="w-6 h-6 text-green-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Savings</h2>
                <p className="text-gray-500">Available funds for down payment & closing costs</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Savings & Checking</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={data.savingsAmount} onChange={(e) => updateField('savingsAmount', parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gift Funds from Family (optional)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={data.giftFunds} onChange={(e) => updateField('giftFunds', parseInt(e.target.value) || 0)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-xl focus:border-blue-500 focus:ring-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Preferences */}
        {step === 'preferences' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl"><Home className="w-6 h-6 text-orange-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Loan Preferences</h2>
                <p className="text-gray-500">Choose your ideal loan program</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Loan Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'conventional', label: 'Conventional', desc: '3-20% down' },
                    { val: 'fha', label: 'FHA', desc: '3.5% down min' },
                    { val: 'va', label: 'VA', desc: '0% down (veterans)' },
                    { val: 'usda', label: 'USDA', desc: '0% down (rural)' },
                  ].map(({ val, label, desc }) => (
                    <button key={val} onClick={() => updateField('loanType', val)}
                      className={`p-4 rounded-xl border-2 text-left ${data.loanType === val ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="font-semibold">{label}</span>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Down Payment</label>
                <div className="flex gap-3">
                  {[3, 5, 10, 20].map(pct => (
                    <button key={pct} onClick={() => updateField('downPaymentPercent', pct)}
                      className={`flex-1 py-3 rounded-xl font-semibold ${data.downPaymentPercent === pct ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && results && (
          <div className="space-y-6">
            {/* Main Result Card */}
            <div className={`rounded-2xl shadow-xl p-8 text-white ${
              results.qualificationLevel === 'strong' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
              results.qualificationLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {results.qualificationLevel === 'strong' ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                <div>
                  <h2 className="text-2xl font-bold">
                    {results.qualificationLevel === 'strong' ? "You're Pre-Qualified!" :
                     results.qualificationLevel === 'moderate' ? "Conditionally Qualified" : "Let's Improve Your Numbers"}
                  </h2>
                  <p className="text-white/80">Based on the information you provided</p>
                </div>
              </div>
              <div className="text-center py-8">
                <p className="text-white/80 mb-2">You may qualify for up to</p>
                <p className="text-6xl font-bold mb-2">{formatCurrency(results.maxPurchasePrice)}</p>
                <p className="text-white/80">Purchase Price</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Est. Monthly Payment</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.estimatedPayment)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Est. Interest Rate</p>
                <p className="text-2xl font-bold text-gray-800">{results.estimatedRate}%</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.maxLoanAmount)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Debt-to-Income</p>
                <p className="text-2xl font-bold text-gray-800">{results.dtiRatio}%</p>
              </div>
            </div>

            {/* Programs */}
            {results.programs.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" /> Programs You May Qualify For
                </h3>
                <div className="space-y-2">
                  {results.programs.map((program, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-800">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Recommendations to Improve</h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/search?maxPrice=${results.maxPurchasePrice}`}
                className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                <Home className="w-5 h-5" /> Search Homes in Your Budget
              </Link>
              <button onClick={restart}
                className="flex items-center justify-center gap-2 p-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
                <Calculator className="w-5 h-5" /> Recalculate
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <Lock className="w-4 h-4 inline mr-1" />
              This pre-qualification is for informational purposes only. Final approval requires full documentation review.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step !== 'results' && (
          <div className="flex justify-between mt-8">
            <button onClick={prevStep} disabled={step === 'income'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                step === 'income' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
              {steps.indexOf(step) === steps.length - 2 ? 'Get Results' : 'Continue'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
