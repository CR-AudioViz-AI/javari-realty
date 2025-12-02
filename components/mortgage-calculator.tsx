'use client'

import { useState, useEffect } from 'react'
import { Calculator, DollarSign, Percent, Calendar, Home, Info, TrendingDown, PiggyBank } from 'lucide-react'

interface MortgageResults {
  monthlyPayment: number
  principalInterest: number
  propertyTax: number
  homeInsurance: number
  pmi: number
  totalInterest: number
  totalPayment: number
  amortizationSchedule: AmortizationRow[]
}

interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export default function MortgageCalculator({ 
  defaultPrice = 0,
  compact = false 
}: { 
  defaultPrice?: number
  compact?: boolean 
}) {
  // Input state
  const [homePrice, setHomePrice] = useState(defaultPrice || 450000)
  const [downPayment, setDownPayment] = useState(90000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2)
  const [annualInsurance, setAnnualInsurance] = useState(1800)
  const [includePMI, setIncludePMI] = useState(true)
  const [showAmortization, setShowAmortization] = useState(false)
  
  // Results
  const [results, setResults] = useState<MortgageResults | null>(null)

  // Sync down payment with percentage
  useEffect(() => {
    const newDownPayment = Math.round(homePrice * (downPaymentPercent / 100))
    setDownPayment(newDownPayment)
  }, [homePrice, downPaymentPercent])

  // Calculate mortgage
  useEffect(() => {
    calculateMortgage()
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, annualInsurance, includePMI])

  function calculateMortgage() {
    const principal = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12

    // Monthly principal & interest (P&I)
    let monthlyPI: number
    if (monthlyRate === 0) {
      monthlyPI = principal / numPayments
    } else {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1)
    }

    // Monthly property tax
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12

    // Monthly insurance
    const monthlyInsurance = annualInsurance / 12

    // PMI (if down payment < 20%)
    let monthlyPMI = 0
    if (includePMI && downPaymentPercent < 20) {
      // Typical PMI is 0.5% to 1% of loan amount annually
      monthlyPMI = (principal * 0.007) / 12
    }

    // Total monthly payment
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI

    // Total interest over life of loan
    const totalInterest = (monthlyPI * numPayments) - principal

    // Total amount paid
    const totalPayment = totalMonthly * numPayments

    // Generate amortization schedule (first 12 months + years 5, 10, 15, 20, 25, 30)
    const schedule: AmortizationRow[] = []
    let balance = principal

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPI - interestPayment
      balance -= principalPayment

      // Include key months
      if (month <= 12 || month === 60 || month === 120 || month === 180 || 
          month === 240 || month === 300 || month === numPayments) {
        schedule.push({
          month,
          payment: monthlyPI,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        })
      }
    }

    setResults({
      monthlyPayment: totalMonthly,
      principalInterest: monthlyPI,
      propertyTax: monthlyTax,
      homeInsurance: monthlyInsurance,
      pmi: monthlyPMI,
      totalInterest,
      totalPayment,
      amortizationSchedule: schedule
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatCurrencyDetailed = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Quick Mortgage Estimate</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500">Home Price</label>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Down Payment</label>
            <select
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded text-sm"
            >
              <option value={5}>5%</option>
              <option value={10}>10%</option>
              <option value={15}>15%</option>
              <option value={20}>20%</option>
              <option value={25}>25%</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Interest Rate</label>
            <input
              type="number"
              step="0.125"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Loan Term</label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded text-sm"
            >
              <option value={15}>15 years</option>
              <option value={20}>20 years</option>
              <option value={30}>30 years</option>
            </select>
          </div>
        </div>

        {results && (
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 mb-1">Estimated Monthly Payment</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(results.monthlyPayment)}</p>
            <p className="text-xs text-gray-500 mt-1">
              P&I: {formatCurrency(results.principalInterest)} | Tax: {formatCurrency(results.propertyTax)} | Ins: {formatCurrency(results.homeInsurance)}
              {results.pmi > 0 && ` | PMI: ${formatCurrency(results.pmi)}`}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mortgage Calculator</h2>
            <p className="text-blue-100 text-sm">Estimate your monthly payment</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Home Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4" />
                Home Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <PiggyBank className="w-4 h-4" />
                Down Payment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => {
                      setDownPayment(Number(e.target.value))
                      setDownPaymentPercent(Math.round((Number(e.target.value) / homePrice) * 100))
                    }}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              {downPaymentPercent < 20 && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  PMI required for down payments under 20%
                </p>
              )}
            </div>

            {/* Interest Rate & Term */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4" />
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.125"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Loan Term
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>

            {/* Property Tax & Insurance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Property Tax Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                    className="w-full pl-4 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Annual Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={annualInsurance}
                    onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* PMI Toggle */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={includePMI}
                onChange={(e) => setIncludePMI(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">Include PMI (if applicable)</span>
            </label>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Monthly Payment */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                <p className="text-sm text-blue-600 font-medium mb-2">Estimated Monthly Payment</p>
                <p className="text-4xl font-bold text-blue-900">{formatCurrency(results.monthlyPayment)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Loan Amount: {formatCurrency(homePrice - downPayment)}
                </p>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Payment Breakdown</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-medium">{formatCurrencyDetailed(results.principalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Property Tax</span>
                    <span className="font-medium">{formatCurrencyDetailed(results.propertyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Home Insurance</span>
                    <span className="font-medium">{formatCurrencyDetailed(results.homeInsurance)}</span>
                  </div>
                  {results.pmi > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 flex items-center gap-1">
                        PMI
                        <Info className="w-3 h-3 text-gray-400" />
                      </span>
                      <span className="font-medium text-amber-600">{formatCurrencyDetailed(results.pmi)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Loan Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Interest</p>
                    <p className="font-semibold text-lg">{formatCurrency(results.totalInterest)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total of {loanTerm * 12} Payments</p>
                    <p className="font-semibold text-lg">{formatCurrency(results.totalPayment)}</p>
                  </div>
                </div>
              </div>

              {/* Amortization Toggle */}
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
              </button>

              {/* Amortization Table */}
              {showAmortization && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-600">Month</th>
                        <th className="px-3 py-2 text-right text-gray-600">Payment</th>
                        <th className="px-3 py-2 text-right text-gray-600">Principal</th>
                        <th className="px-3 py-2 text-right text-gray-600">Interest</th>
                        <th className="px-3 py-2 text-right text-gray-600">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {results.amortizationSchedule.map((row) => (
                        <tr key={row.month} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            {row.month <= 12 ? row.month : `Year ${Math.floor(row.month / 12)}`}
                          </td>
                          <td className="px-3 py-2 text-right">{formatCurrencyDetailed(row.payment)}</td>
                          <td className="px-3 py-2 text-right text-green-600">{formatCurrencyDetailed(row.principal)}</td>
                          <td className="px-3 py-2 text-right text-red-600">{formatCurrencyDetailed(row.interest)}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(row.balance)}</td>
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
    </div>
  )
}
