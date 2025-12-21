'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Calculator, DollarSign, TrendingUp, PieChart, 
  Home, Percent, Calendar, ArrowLeft, Download,
  Info, ChevronDown, ChevronUp, Sparkles, Building,
  Banknote, BarChart3, Target, Clock, Wallet
} from 'lucide-react'

interface InvestmentInputs {
  purchasePrice: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
  closingCostsPercent: number
  monthlyRent: number
  otherIncome: number
  vacancyRate: number
  propertyTaxAnnual: number
  insuranceAnnual: number
  hoaMonthly: number
  maintenancePercent: number
  propertyManagementPercent: number
  utilitiesMonthly: number
  appreciationRate: number
}

interface InvestmentResults {
  // Purchase
  downPaymentAmount: number
  loanAmount: number
  closingCosts: number
  totalCashNeeded: number
  // Monthly
  monthlyMortgage: number
  monthlyPropertyTax: number
  monthlyInsurance: number
  monthlyMaintenance: number
  monthlyPropertyManagement: number
  totalMonthlyExpenses: number
  effectiveGrossIncome: number
  netOperatingIncome: number
  monthlyCashFlow: number
  annualCashFlow: number
  // Metrics
  capRate: number
  cashOnCashReturn: number
  grossRentMultiplier: number
  debtServiceCoverageRatio: number
  breakEvenRatio: number
  // Projections
  equity1yr: number
  equity5yr: number
  equity10yr: number
  value5yr: number
  value10yr: number
  totalReturn5yr: number
  totalReturn10yr: number
  annualizedReturn5yr: number
  annualizedReturn10yr: number
}

const defaultInputs: InvestmentInputs = {
  purchasePrice: 350000,
  downPaymentPercent: 20,
  interestRate: 6.75,
  loanTermYears: 30,
  closingCostsPercent: 3,
  monthlyRent: 2200,
  otherIncome: 0,
  vacancyRate: 5,
  propertyTaxAnnual: 4200,
  insuranceAnnual: 1800,
  hoaMonthly: 0,
  maintenancePercent: 1,
  propertyManagementPercent: 8,
  utilitiesMonthly: 0,
  appreciationRate: 3,
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

function calculateMortgagePayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12
  if (monthlyRate === 0) return principal / numPayments
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
}

function calculateResults(inputs: InvestmentInputs): InvestmentResults {
  // Purchase calculations
  const downPaymentAmount = inputs.purchasePrice * (inputs.downPaymentPercent / 100)
  const loanAmount = inputs.purchasePrice - downPaymentAmount
  const closingCosts = inputs.purchasePrice * (inputs.closingCostsPercent / 100)
  const totalCashNeeded = downPaymentAmount + closingCosts

  // Monthly expense calculations
  const monthlyMortgage = calculateMortgagePayment(loanAmount, inputs.interestRate, inputs.loanTermYears)
  const monthlyPropertyTax = inputs.propertyTaxAnnual / 12
  const monthlyInsurance = inputs.insuranceAnnual / 12
  const monthlyMaintenance = (inputs.purchasePrice * (inputs.maintenancePercent / 100)) / 12
  const monthlyPropertyManagement = inputs.monthlyRent * (inputs.propertyManagementPercent / 100)

  const totalMonthlyExpenses = 
    monthlyMortgage + 
    monthlyPropertyTax + 
    monthlyInsurance + 
    inputs.hoaMonthly + 
    monthlyMaintenance + 
    monthlyPropertyManagement + 
    inputs.utilitiesMonthly

  // Income calculations
  const grossMonthlyIncome = inputs.monthlyRent + inputs.otherIncome
  const vacancyLoss = grossMonthlyIncome * (inputs.vacancyRate / 100)
  const effectiveGrossIncome = grossMonthlyIncome - vacancyLoss
  
  // NOI (before mortgage - for cap rate)
  const operatingExpenses = 
    monthlyPropertyTax + 
    monthlyInsurance + 
    inputs.hoaMonthly + 
    monthlyMaintenance + 
    monthlyPropertyManagement + 
    inputs.utilitiesMonthly
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses

  // Cash flow (after mortgage)
  const monthlyCashFlow = effectiveGrossIncome - totalMonthlyExpenses
  const annualCashFlow = monthlyCashFlow * 12

  // Investment metrics
  const annualNOI = netOperatingIncome * 12
  const capRate = (annualNOI / inputs.purchasePrice) * 100
  const cashOnCashReturn = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0
  const grossRentMultiplier = inputs.monthlyRent > 0 ? inputs.purchasePrice / (inputs.monthlyRent * 12) : 0
  const annualDebtService = monthlyMortgage * 12
  const debtServiceCoverageRatio = annualDebtService > 0 ? annualNOI / annualDebtService : 0
  const breakEvenRatio = effectiveGrossIncome > 0 ? ((operatingExpenses + monthlyMortgage) / effectiveGrossIncome) * 100 : 0

  // Projections
  const appreciationMultiplier = 1 + (inputs.appreciationRate / 100)
  const value5yr = inputs.purchasePrice * Math.pow(appreciationMultiplier, 5)
  const value10yr = inputs.purchasePrice * Math.pow(appreciationMultiplier, 10)

  // Calculate principal paydown
  let remainingPrincipal1yr = loanAmount
  let remainingPrincipal5yr = loanAmount
  let remainingPrincipal10yr = loanAmount
  const monthlyRate = inputs.interestRate / 100 / 12

  for (let month = 1; month <= 120; month++) {
    const interestPayment = remainingPrincipal10yr * monthlyRate
    const principalPayment = monthlyMortgage - interestPayment
    remainingPrincipal10yr -= principalPayment
    
    if (month === 12) remainingPrincipal1yr = remainingPrincipal10yr
    if (month === 60) remainingPrincipal5yr = remainingPrincipal10yr
  }

  const equity1yr = (inputs.purchasePrice * appreciationMultiplier) - remainingPrincipal1yr
  const equity5yr = value5yr - remainingPrincipal5yr
  const equity10yr = value10yr - remainingPrincipal10yr

  // Total returns (equity gain + cash flow)
  const totalReturn5yr = (equity5yr - totalCashNeeded) + (annualCashFlow * 5)
  const totalReturn10yr = (equity10yr - totalCashNeeded) + (annualCashFlow * 10)
  
  // Annualized returns
  const annualizedReturn5yr = totalCashNeeded > 0 ? (Math.pow((totalCashNeeded + totalReturn5yr) / totalCashNeeded, 1/5) - 1) * 100 : 0
  const annualizedReturn10yr = totalCashNeeded > 0 ? (Math.pow((totalCashNeeded + totalReturn10yr) / totalCashNeeded, 1/10) - 1) * 100 : 0

  return {
    downPaymentAmount,
    loanAmount,
    closingCosts,
    totalCashNeeded,
    monthlyMortgage,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyMaintenance,
    monthlyPropertyManagement,
    totalMonthlyExpenses,
    effectiveGrossIncome,
    netOperatingIncome,
    monthlyCashFlow,
    annualCashFlow,
    capRate,
    cashOnCashReturn,
    grossRentMultiplier,
    debtServiceCoverageRatio,
    breakEvenRatio,
    equity1yr,
    equity5yr,
    equity10yr,
    value5yr,
    value10yr,
    totalReturn5yr,
    totalReturn10yr,
    annualizedReturn5yr,
    annualizedReturn10yr,
  }
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  color = 'blue',
  tooltip 
}: { 
  icon: any
  label: string
  value: string
  subtext?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  tooltip?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  }
  
  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5" />
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 opacity-50 cursor-help" />
            <div className="absolute right-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-75">{label}</div>
      {subtext && <div className="text-xs mt-1 opacity-60">{subtext}</div>}
    </div>
  )
}

function InputField({ 
  label, 
  value, 
  onChange, 
  prefix, 
  suffix, 
  min = 0, 
  max,
  step = 1,
  tooltip
}: {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
  tooltip?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {tooltip && (
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-0 top-5 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
        )}
      </div>
    </div>
  )
}

export default function InvestmentCalculatorPage() {
  const [inputs, setInputs] = useState<InvestmentInputs>(defaultInputs)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [scenario2, setScenario2] = useState<InvestmentInputs>({...defaultInputs, downPaymentPercent: 25})
  
  const results = useMemo(() => calculateResults(inputs), [inputs])
  const results2 = useMemo(() => compareMode ? calculateResults(scenario2) : null, [scenario2, compareMode])

  const updateInput = (key: keyof InvestmentInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const cashFlowColor = results.monthlyCashFlow >= 0 ? 'green' : 'red'
  const cocColor = results.cashOnCashReturn >= 8 ? 'green' : results.cashOnCashReturn >= 4 ? 'yellow' : 'red'
  const capRateColor = results.capRate >= 6 ? 'green' : results.capRate >= 4 ? 'yellow' : 'red'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/search" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Investment Calculator Pro</h1>
            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">PREMIUM</span>
          </div>
          <p className="text-blue-100">
            Analyze any property's investment potential with professional-grade metrics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Purchase Details
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Purchase Price"
                  value={inputs.purchasePrice}
                  onChange={(v) => updateInput('purchasePrice', v)}
                  prefix="$"
                  step={5000}
                />
                <InputField
                  label="Down Payment"
                  value={inputs.downPaymentPercent}
                  onChange={(v) => updateInput('downPaymentPercent', v)}
                  suffix="%"
                  max={100}
                  step={5}
                  tooltip="Typical: 20% conventional, 3.5% FHA, 0% VA"
                />
                <InputField
                  label="Interest Rate"
                  value={inputs.interestRate}
                  onChange={(v) => updateInput('interestRate', v)}
                  suffix="%"
                  step={0.125}
                  tooltip="Current average: ~6.5-7% for investment properties"
                />
                <InputField
                  label="Loan Term"
                  value={inputs.loanTermYears}
                  onChange={(v) => updateInput('loanTermYears', v)}
                  suffix="years"
                  min={10}
                  max={30}
                  step={5}
                />
                <InputField
                  label="Closing Costs"
                  value={inputs.closingCostsPercent}
                  onChange={(v) => updateInput('closingCostsPercent', v)}
                  suffix="%"
                  max={10}
                  step={0.5}
                  tooltip="Typically 2-5% of purchase price"
                />
              </div>
            </div>

            {/* Income */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-green-600" />
                Rental Income
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Monthly Rent"
                  value={inputs.monthlyRent}
                  onChange={(v) => updateInput('monthlyRent', v)}
                  prefix="$"
                  step={50}
                />
                <InputField
                  label="Other Income"
                  value={inputs.otherIncome}
                  onChange={(v) => updateInput('otherIncome', v)}
                  prefix="$"
                  tooltip="Parking, laundry, storage, etc."
                />
                <InputField
                  label="Vacancy Rate"
                  value={inputs.vacancyRate}
                  onChange={(v) => updateInput('vacancyRate', v)}
                  suffix="%"
                  max={50}
                  tooltip="Industry standard: 5-10%"
                />
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-red-600" />
                Operating Expenses
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Property Tax (Annual)"
                  value={inputs.propertyTaxAnnual}
                  onChange={(v) => updateInput('propertyTaxAnnual', v)}
                  prefix="$"
                  step={100}
                />
                <InputField
                  label="Insurance (Annual)"
                  value={inputs.insuranceAnnual}
                  onChange={(v) => updateInput('insuranceAnnual', v)}
                  prefix="$"
                  step={100}
                />
                <InputField
                  label="HOA (Monthly)"
                  value={inputs.hoaMonthly}
                  onChange={(v) => updateInput('hoaMonthly', v)}
                  prefix="$"
                />
                
                {/* Advanced toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-blue-600 text-sm font-medium"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
                
                {showAdvanced && (
                  <div className="space-y-4 pt-2 border-t">
                    <InputField
                      label="Maintenance Reserve"
                      value={inputs.maintenancePercent}
                      onChange={(v) => updateInput('maintenancePercent', v)}
                      suffix="% / yr"
                      max={5}
                      step={0.5}
                      tooltip="Industry standard: 1-2% of property value"
                    />
                    <InputField
                      label="Property Management"
                      value={inputs.propertyManagementPercent}
                      onChange={(v) => updateInput('propertyManagementPercent', v)}
                      suffix="%"
                      max={15}
                      tooltip="Typical: 8-10% of rent"
                    />
                    <InputField
                      label="Utilities (Monthly)"
                      value={inputs.utilitiesMonthly}
                      onChange={(v) => updateInput('utilitiesMonthly', v)}
                      prefix="$"
                      tooltip="If landlord pays any utilities"
                    />
                    <InputField
                      label="Appreciation Rate"
                      value={inputs.appreciationRate}
                      onChange={(v) => updateInput('appreciationRate', v)}
                      suffix="% / yr"
                      max={15}
                      step={0.5}
                      tooltip="Historical average: 3-4%"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                icon={DollarSign}
                label="Monthly Cash Flow"
                value={formatCurrency(results.monthlyCashFlow)}
                subtext={`${formatCurrency(results.annualCashFlow)}/year`}
                color={cashFlowColor}
                tooltip="Net income after all expenses including mortgage"
              />
              <MetricCard
                icon={Percent}
                label="Cash on Cash Return"
                value={formatPercent(results.cashOnCashReturn)}
                subtext="Annual return on cash invested"
                color={cocColor}
                tooltip="Annual cash flow ÷ total cash invested. Good: 8%+"
              />
              <MetricCard
                icon={Target}
                label="Cap Rate"
                value={formatPercent(results.capRate)}
                subtext="Net Operating Income / Price"
                color={capRateColor}
                tooltip="NOI ÷ Purchase Price. Good: 6%+"
              />
              <MetricCard
                icon={BarChart3}
                label="GRM"
                value={results.grossRentMultiplier.toFixed(1)}
                subtext="Gross Rent Multiplier"
                color="blue"
                tooltip="Price ÷ Annual Rent. Lower is better. Good: <15"
              />
            </div>

            {/* Cash Needed Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                Cash Required to Close
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{formatCurrency(results.downPaymentAmount)}</div>
                  <div className="text-sm text-gray-500">Down Payment ({inputs.downPaymentPercent}%)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{formatCurrency(results.closingCosts)}</div>
                  <div className="text-sm text-gray-500">Closing Costs ({inputs.closingCostsPercent}%)</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(results.totalCashNeeded)}</div>
                  <div className="text-sm text-purple-600 font-medium">Total Cash Needed</div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Monthly Cash Flow Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income */}
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">Income</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Rent</span>
                      <span className="font-medium">{formatCurrency(inputs.monthlyRent)}</span>
                    </div>
                    {inputs.otherIncome > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Other Income</span>
                        <span className="font-medium">{formatCurrency(inputs.otherIncome)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-red-500">
                      <span>Vacancy Loss ({inputs.vacancyRate}%)</span>
                      <span>-{formatCurrency((inputs.monthlyRent + inputs.otherIncome) * inputs.vacancyRate / 100)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold text-green-600">
                      <span>Effective Gross Income</span>
                      <span>{formatCurrency(results.effectiveGrossIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h3 className="font-semibold text-red-600 mb-3">Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mortgage (P&I)</span>
                      <span className="font-medium">{formatCurrency(results.monthlyMortgage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium">{formatCurrency(results.monthlyPropertyTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">{formatCurrency(results.monthlyInsurance)}</span>
                    </div>
                    {inputs.hoaMonthly > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">HOA</span>
                        <span className="font-medium">{formatCurrency(inputs.hoaMonthly)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maintenance</span>
                      <span className="font-medium">{formatCurrency(results.monthlyMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Management</span>
                      <span className="font-medium">{formatCurrency(results.monthlyPropertyManagement)}</span>
                    </div>
                    {inputs.utilitiesMonthly > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Utilities</span>
                        <span className="font-medium">{formatCurrency(inputs.utilitiesMonthly)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t font-semibold text-red-600">
                      <span>Total Expenses</span>
                      <span>{formatCurrency(results.totalMonthlyExpenses)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Cash Flow */}
              <div className={`mt-6 p-4 rounded-lg ${results.monthlyCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${results.monthlyCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    Net Monthly Cash Flow
                  </span>
                  <span className={`text-3xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.monthlyCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* Long-Term Projections */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Long-Term Wealth Building ({inputs.appreciationRate}% appreciation)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Metric</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Year 1</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Year 5</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Year 10</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-700">Property Value</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(inputs.purchasePrice * (1 + inputs.appreciationRate/100))}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.value5yr)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.value10yr)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-700">Equity</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.equity1yr)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.equity5yr)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.equity10yr)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 text-gray-700">Cumulative Cash Flow</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.annualCashFlow)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.annualCashFlow * 5)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(results.annualCashFlow * 10)}</td>
                    </tr>
                    <tr className="border-b bg-green-50">
                      <td className="py-3 px-4 text-green-700 font-semibold">Total Return</td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {formatCurrency(results.equity1yr - results.totalCashNeeded + results.annualCashFlow)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(results.totalReturn5yr)}</td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">{formatCurrency(results.totalReturn10yr)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Annualized Return</td>
                      <td className="py-3 px-4 text-right font-medium">-</td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">{formatPercent(results.annualizedReturn5yr)}</td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">{formatPercent(results.annualizedReturn10yr)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advanced Metrics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Professional Investor Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">DSCR</div>
                  <div className="text-xl font-bold text-gray-800">{results.debtServiceCoverageRatio.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Lenders want 1.25+</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Break-Even Ratio</div>
                  <div className="text-xl font-bold text-gray-800">{formatPercent(results.breakEvenRatio)}</div>
                  <div className="text-xs text-gray-400">Below 85% is good</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Monthly NOI</div>
                  <div className="text-xl font-bold text-gray-800">{formatCurrency(results.netOperatingIncome)}</div>
                  <div className="text-xs text-gray-400">Before mortgage</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Price per $ Rent</div>
                  <div className="text-xl font-bold text-gray-800">{(inputs.purchasePrice / inputs.monthlyRent).toFixed(0)}x</div>
                  <div className="text-xs text-gray-400">Lower is better</div>
                </div>
              </div>
            </div>

            {/* Investment Rating */}
            <div className={`rounded-xl shadow-md p-6 ${
              results.cashOnCashReturn >= 8 && results.monthlyCashFlow > 0 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : results.cashOnCashReturn >= 4 && results.monthlyCashFlow >= 0
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Investment Rating</h3>
                  <p className="text-white/80">
                    {results.cashOnCashReturn >= 8 && results.monthlyCashFlow > 0 
                      ? '🎯 Strong Investment - This property meets professional investor criteria'
                      : results.cashOnCashReturn >= 4 && results.monthlyCashFlow >= 0
                      ? '⚠️ Moderate Investment - Consider negotiating price or increasing rent'
                      : '❌ Weak Investment - Numbers don\'t work at this price point'}
                  </p>
                </div>
                <div className="text-5xl font-bold">
                  {results.cashOnCashReturn >= 8 && results.monthlyCashFlow > 0 
                    ? 'A'
                    : results.cashOnCashReturn >= 4 && results.monthlyCashFlow >= 0
                    ? 'B'
                    : 'C'}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Ready to Make an Offer?</h3>
              <p className="text-blue-600 mb-4">Get pre-qualified and lock in your rate today</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/tools/mortgage-calculator" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Calculate Mortgage
                </Link>
                <Link href="/search" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                  Find More Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
