// app/customer/dashboard/investment-calculator/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { Calculator, DollarSign, TrendingUp, Building2, BarChart3, Info, Home, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function InvestmentCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(350000)
  const [closingCostsPercent, setClosingCostsPercent] = useState(3)
  const [rehabCosts, setRehabCosts] = useState(0)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25)
  const [interestRate, setInterestRate] = useState(7.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyRent, setMonthlyRent] = useState(2500)
  const [otherIncome, setOtherIncome] = useState(0)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.25)
  const [annualInsurance, setAnnualInsurance] = useState(2400)
  const [maintenancePercent, setMaintenancePercent] = useState(5)
  const [propertyMgmtPercent, setPropertyMgmtPercent] = useState(8)
  const [monthlyUtilities, setMonthlyUtilities] = useState(0)
  const [monthlyHoa, setMonthlyHoa] = useState(0)
  const [annualAppreciation, setAnnualAppreciation] = useState(3)

  const analysis = useMemo(() => {
    const closingCosts = purchasePrice * (closingCostsPercent / 100)
    const downPayment = purchasePrice * (downPaymentPercent / 100)
    const loanAmount = purchasePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm * 12
    
    let monthlyMortgage = 0
    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    }
    
    const annualGrossIncome = (monthlyRent + otherIncome) * 12
    const vacancyLoss = annualGrossIncome * (vacancyRate / 100)
    const effectiveGrossIncome = annualGrossIncome - vacancyLoss
    
    const propertyTax = purchasePrice * (propertyTaxRate / 100)
    const maintenance = effectiveGrossIncome * (maintenancePercent / 100)
    const propertyManagement = effectiveGrossIncome * (propertyMgmtPercent / 100)
    const utilities = monthlyUtilities * 12
    const hoa = monthlyHoa * 12
    const totalExpenses = propertyTax + annualInsurance + maintenance + propertyManagement + utilities + hoa
    
    const annualNOI = effectiveGrossIncome - totalExpenses
    const annualDebtService = monthlyMortgage * 12
    const annualCashFlow = annualNOI - annualDebtService
    const monthlyCashFlow = annualCashFlow / 12
    
    const cashInvested = downPayment + closingCosts + rehabCosts
    const capRate = (annualNOI / purchasePrice) * 100
    const cashOnCashReturn = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0
    const grossRentMultiplier = annualGrossIncome > 0 ? purchasePrice / annualGrossIncome : 0
    
    let currentValue = purchasePrice
    for (let i = 0; i < 5; i++) currentValue *= (1 + annualAppreciation / 100)
    const fiveYearAppreciation = currentValue - purchasePrice
    
    let remainingBalance = loanAmount
    for (let month = 0; month < 60; month++) {
      const interestPayment = remainingBalance * monthlyRate
      remainingBalance -= (monthlyMortgage - interestPayment)
    }
    const principalPaidDown = loanAmount - remainingBalance
    const fiveYearEquity = downPayment + principalPaidDown + fiveYearAppreciation
    const fiveYearTotalReturn = annualCashFlow * 5 + fiveYearAppreciation + principalPaidDown
    const fiveYearROI = cashInvested > 0 ? (fiveYearTotalReturn / cashInvested) * 100 : 0
    
    return { downPayment, closingCosts, loanAmount, monthlyMortgage, annualNOI, monthlyCashFlow, annualCashFlow, capRate, cashOnCashReturn, grossRentMultiplier, fiveYearAppreciation, fiveYearEquity, fiveYearROI }
  }, [purchasePrice, closingCostsPercent, rehabCosts, downPaymentPercent, interestRate, loanTerm, monthlyRent, otherIncome, vacancyRate, propertyTaxRate, annualInsurance, maintenancePercent, propertyMgmtPercent, monthlyUtilities, monthlyHoa, annualAppreciation])

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
  const formatPercent = (v: number) => `${v.toFixed(2)}%`
  const getReturnColor = (v: number) => v >= 8 ? 'text-green-600' : v >= 4 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/customer/dashboard" className="text-blue-600 hover:underline text-sm mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-xl"><Building2 className="w-8 h-8 text-white" /></div>
            Investment Property Calculator
          </h1>
          <p className="text-gray-600 mt-1">Analyze ROI, cash flow, and cap rate for rental properties</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Purchase */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Home className="w-5 h-5 text-purple-600" />Purchase Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full pl-9 pr-3 py-2 border rounded-lg" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Costs (%)</label>
                  <input type="number" step="0.5" value={closingCostsPercent} onChange={(e) => setClosingCostsPercent(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rehab/Repairs</label>
                  <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={rehabCosts} onChange={(e) => setRehabCosts(Number(e.target.value))} className="w-full pl-9 pr-3 py-2 border rounded-lg" /></div>
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-purple-600" />Financing</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
                  <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(analysis.downPayment)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input type="number" step="0.125" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                  <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg">
                    <option value={15}>15 years</option><option value={20}>20 years</option><option value={30}>30 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rental Income */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" />Rental Income</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                  <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full pl-9 pr-3 py-2 border rounded-lg" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Income ($/mo)</label>
                  <input type="number" value={otherIncome} onChange={(e) => setOtherIncome(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy Rate (%)</label>
                  <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-red-600" />Operating Expenses</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (%/yr)</label>
                  <input type="number" step="0.01" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Insurance ($/yr)</label>
                  <input type="number" value={annualInsurance} onChange={(e) => setAnnualInsurance(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Maintenance (%)</label>
                  <input type="number" value={maintenancePercent} onChange={(e) => setMaintenancePercent(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Mgmt (%)</label>
                  <input type="number" value={propertyMgmtPercent} onChange={(e) => setPropertyMgmtPercent(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Utilities ($/mo)</label>
                  <input type="number" value={monthlyUtilities} onChange={(e) => setMonthlyUtilities(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">HOA ($/mo)</label>
                  <input type="number" value={monthlyHoa} onChange={(e) => setMonthlyHoa(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="text-purple-100 mb-4">Monthly Cash Flow</h3>
              <div className={`text-4xl font-bold mb-2 ${analysis.monthlyCashFlow >= 0 ? '' : 'text-red-200'}`}>{formatCurrency(analysis.monthlyCashFlow)}</div>
              <div className="text-purple-100 text-sm">{formatCurrency(analysis.annualCashFlow)}/year</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Return Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Cap Rate</span><span className={`font-bold ${getReturnColor(analysis.capRate)}`}>{formatPercent(analysis.capRate)}</span></div>
                <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Cash-on-Cash</span><span className={`font-bold ${getReturnColor(analysis.cashOnCashReturn)}`}>{formatPercent(analysis.cashOnCashReturn)}</span></div>
                <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">GRM</span><span className="font-bold text-gray-900">{analysis.grossRentMultiplier.toFixed(1)}x</span></div>
                <div className="flex justify-between items-center py-2"><span className="text-gray-600">Monthly Mortgage</span><span className="font-bold text-gray-900">{formatCurrency(analysis.monthlyMortgage)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cash Required</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Down Payment</span><span>{formatCurrency(analysis.downPayment)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Closing Costs</span><span>{formatCurrency(analysis.closingCosts)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Rehab</span><span>{formatCurrency(rehabCosts)}</span></div>
                <div className="flex justify-between pt-2 border-t font-semibold"><span>Total</span><span className="text-purple-600">{formatCurrency(analysis.downPayment + analysis.closingCosts + rehabCosts)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />5-Year Projection</h3>
              <div className="mb-4"><label className="block text-sm text-gray-600 mb-1">Annual Appreciation (%)</label>
                <input type="number" step="0.5" value={annualAppreciation} onChange={(e) => setAnnualAppreciation(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Appreciation</span><span className="text-green-600">+{formatCurrency(analysis.fiveYearAppreciation)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Cash Flow</span><span className={analysis.annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(analysis.annualCashFlow * 5)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Equity</span><span className="text-green-600">{formatCurrency(analysis.fiveYearEquity)}</span></div>
                <div className="flex justify-between pt-2 border-t font-semibold"><span>5-Year ROI</span><span className={getReturnColor(analysis.fiveYearROI / 5)}>{formatPercent(analysis.fiveYearROI)}</span></div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${analysis.cashOnCashReturn >= 10 && analysis.capRate >= 7 ? 'bg-green-50 border-2 border-green-500' : analysis.cashOnCashReturn >= 6 && analysis.capRate >= 5 ? 'bg-yellow-50 border-2 border-yellow-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${analysis.cashOnCashReturn >= 10 && analysis.capRate >= 7 ? 'text-green-700' : analysis.cashOnCashReturn >= 6 && analysis.capRate >= 5 ? 'text-yellow-700' : 'text-red-700'}`}>
                  {analysis.cashOnCashReturn >= 10 && analysis.capRate >= 7 ? '🏆 Great Deal' : analysis.cashOnCashReturn >= 6 && analysis.capRate >= 5 ? '👍 Decent Deal' : '⚠️ Needs Analysis'}
                </div>
                <p className="text-sm text-gray-600">{analysis.cashOnCashReturn >= 10 ? 'Strong returns. Consider this investment.' : analysis.cashOnCashReturn >= 6 ? 'Moderate returns. Negotiate better terms.' : 'Below target. Look for lower price or higher rent.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
