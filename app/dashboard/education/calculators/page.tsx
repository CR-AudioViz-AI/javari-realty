'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calculator, ChevronLeft, DollarSign, Home, TrendingUp, 
  Percent, Calendar, PiggyBank, RefreshCcw, Scale, FileText
} from 'lucide-react'

type CalculatorType = 'mortgage' | 'affordability' | 'refinance' | 'rent-vs-buy' | 'closing-costs' | 'investment'

export default function CalculatorsPage() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('mortgage')
  
  // Mortgage Calculator State
  const [homePrice, setHomePrice] = useState(350000)
  const [downPayment, setDownPayment] = useState(70000)
  const [interestRate, setInterestRate] = useState(6.75)
  const [loanTerm, setLoanTerm] = useState(30)
  const [propertyTax, setPropertyTax] = useState(4200)
  const [homeInsurance, setHomeInsurance] = useState(1800)
  const [pmi, setPmi] = useState(0)
  const [hoa, setHoa] = useState(0)
  
  // Affordability Calculator State
  const [annualIncome, setAnnualIncome] = useState(100000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  
  // Rent vs Buy State
  const [monthlyRent, setMonthlyRent] = useState(2000)
  const [rentIncrease, setRentIncrease] = useState(3)
  const [homeAppreciation, setHomeAppreciation] = useState(4)
  const [yearsToStay, setYearsToStay] = useState(7)
  
  // Investment Calculator State
  const [purchasePrice, setPurchasePrice] = useState(300000)
  const [monthlyRentIncome, setMonthlyRentIncome] = useState(2500)
  const [operatingExpenses, setOperatingExpenses] = useState(500)
  const [vacancyRate, setVacancyRate] = useState(5)

  // Calculate Mortgage Payment
  const loanAmount = homePrice - downPayment
  const monthlyRate = interestRate / 100 / 12
  const numPayments = loanTerm * 12
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
  const monthlyTax = propertyTax / 12
  const monthlyInsurance = homeInsurance / 12
  const ltv = (loanAmount / homePrice) * 100
  const estimatedPmi = ltv > 80 ? (loanAmount * 0.005) / 12 : 0
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + (pmi || estimatedPmi) + hoa
  
  // Calculate Affordability
  const maxMonthlyPayment = (annualIncome / 12) * 0.28
  const maxWithDebts = ((annualIncome / 12) * 0.36) - monthlyDebts
  const affordablePayment = Math.min(maxMonthlyPayment, maxWithDebts)
  const estimatedAffordableHome = (affordablePayment / 0.006) * (1 / (1 - downPaymentPct / 100))
  
  // Calculate Rent vs Buy
  const totalRentCost = Array.from({ length: yearsToStay }, (_, i) => monthlyRent * 12 * Math.pow(1 + rentIncrease / 100, i)).reduce((a, b) => a + b, 0)
  const homeValueAfter = homePrice * Math.pow(1 + homeAppreciation / 100, yearsToStay)
  const totalMortgageCost = totalMonthly * 12 * yearsToStay
  const equityBuilt = homeValueAfter - loanAmount * 0.7 // Rough estimate
  const buyAdvantage = equityBuilt - totalMortgageCost + totalRentCost
  
  // Calculate Investment Returns
  const grossRent = monthlyRentIncome * 12
  const effectiveGrossIncome = grossRent * (1 - vacancyRate / 100)
  const noi = effectiveGrossIncome - (operatingExpenses * 12)
  const capRate = (noi / purchasePrice) * 100
  const cashOnCash = ((noi - (monthlyPI * 12)) / downPayment) * 100

  const CALCULATORS = [
    { id: 'mortgage' as const, name: 'Mortgage Payment', icon: Home, description: 'Calculate your monthly payment' },
    { id: 'affordability' as const, name: 'Affordability', icon: DollarSign, description: 'How much home can you afford?' },
    { id: 'rent-vs-buy' as const, name: 'Rent vs. Buy', icon: Scale, description: 'Compare the costs of renting vs buying' },
    { id: 'investment' as const, name: 'Investment Analysis', icon: TrendingUp, description: 'Analyze rental property returns' },
    { id: 'closing-costs' as const, name: 'Closing Costs', icon: FileText, description: 'Estimate your closing costs' },
    { id: 'refinance' as const, name: 'Refinance', icon: RefreshCcw, description: 'Should you refinance?' },
  ]

  const formatCurrency = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link href="/dashboard/education" className="text-blue-600 hover:underline flex items-center gap-1 mb-4">
        <ChevronLeft size={18} /> Back to Education Center
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Calculator className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Financial Calculators</h1>
          <p className="text-gray-600">Make informed decisions with accurate numbers</p>
        </div>
      </div>

      {/* Calculator Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CALCULATORS.map(calc => (
          <button
            key={calc.id}
            onClick={() => setActiveCalc(calc.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeCalc === calc.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <calc.icon size={18} />
            {calc.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl border p-6">
          {activeCalc === 'mortgage' && (
            <>
              <h2 className="text-xl font-bold mb-6">Mortgage Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Home Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                  </div>
                  <input type="range" min="100000" max="2000000" step="10000" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full mt-2" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Down Payment ({((downPayment/homePrice)*100).toFixed(0)}%)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                  </div>
                  <input type="range" min="0" max={homePrice * 0.5} step="5000" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full mt-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                    <input type="number" step="0.125" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Loan Term (Years)</label>
                    <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg">
                      <option value={30}>30 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={10}>10 Years</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Property Tax (Annual)</label>
                    <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Home Insurance (Annual)</label>
                    <input type="number" value={homeInsurance} onChange={(e) => setHomeInsurance(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">HOA Fees (Monthly)</label>
                  <input type="number" value={hoa} onChange={(e) => setHoa(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </>
          )}

          {activeCalc === 'affordability' && (
            <>
              <h2 className="text-xl font-bold mb-6">Affordability Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Gross Income</label>
                  <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Debt Payments</label>
                  <p className="text-xs text-gray-500 mb-1">Car loans, student loans, credit cards, etc.</p>
                  <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Down Payment (%)</label>
                  <input type="range" min="3" max="30" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full" />
                  <p className="text-center font-medium">{downPaymentPct}%</p>
                </div>
              </div>
            </>
          )}

          {activeCalc === 'rent-vs-buy' && (
            <>
              <h2 className="text-xl font-bold mb-6">Rent vs. Buy Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Monthly Rent</label>
                  <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Rent Increase (%)</label>
                  <input type="number" step="0.5" value={rentIncrease} onChange={(e) => setRentIncrease(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Home Appreciation (%)</label>
                  <input type="number" step="0.5" value={homeAppreciation} onChange={(e) => setHomeAppreciation(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Years You Plan to Stay</label>
                  <input type="range" min="1" max="30" value={yearsToStay} onChange={(e) => setYearsToStay(Number(e.target.value))} className="w-full" />
                  <p className="text-center font-medium">{yearsToStay} years</p>
                </div>
              </div>
            </>
          )}

          {activeCalc === 'investment' && (
            <>
              <h2 className="text-xl font-bold mb-6">Investment Property Analysis</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Purchase Price</label>
                  <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Rent Income</label>
                  <input type="number" value={monthlyRentIncome} onChange={(e) => setMonthlyRentIncome(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Operating Expenses</label>
                  <p className="text-xs text-gray-500 mb-1">Maintenance, management, utilities, etc.</p>
                  <input type="number" value={operatingExpenses} onChange={(e) => setOperatingExpenses(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vacancy Rate (%)</label>
                  <input type="number" value={vacancyRate} onChange={(e) => setVacancyRate(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </>
          )}

          {activeCalc === 'closing-costs' && (
            <>
              <h2 className="text-xl font-bold mb-6">Closing Cost Estimator</h2>
              <p className="text-gray-600 mb-4">Based on your {formatCurrency(homePrice)} home purchase:</p>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>Loan Origination (1%)</span>
                  <span className="font-medium">{formatCurrency(loanAmount * 0.01)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Appraisal Fee</span>
                  <span className="font-medium">{formatCurrency(500)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Title Insurance</span>
                  <span className="font-medium">{formatCurrency(homePrice * 0.005)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Home Inspection</span>
                  <span className="font-medium">{formatCurrency(450)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Survey</span>
                  <span className="font-medium">{formatCurrency(400)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Recording Fees</span>
                  <span className="font-medium">{formatCurrency(150)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Prepaid Interest (15 days)</span>
                  <span className="font-medium">{formatCurrency((loanAmount * interestRate/100) / 365 * 15)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Prepaid Taxes (3 months)</span>
                  <span className="font-medium">{formatCurrency(propertyTax / 4)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Prepaid Insurance (1 year)</span>
                  <span className="font-medium">{formatCurrency(homeInsurance)}</span>
                </div>
              </div>
            </>
          )}

          {activeCalc === 'refinance' && (
            <>
              <h2 className="text-xl font-bold mb-6">Refinance Calculator</h2>
              <p className="text-gray-600">Compare your current mortgage to a new one to see if refinancing makes sense.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Rule of thumb:</strong> Refinancing typically makes sense if you can reduce your rate by at least 0.5-1% 
                  and plan to stay in the home long enough to recoup closing costs (usually 2-3 years).
                </p>
              </div>
            </>
          )}
        </div>

        {/* Results Section */}
        <div>
          {activeCalc === 'mortgage' && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <h3 className="text-lg opacity-80 mb-2">Estimated Monthly Payment</h3>
              <p className="text-5xl font-bold mb-6">{formatCurrency(totalMonthly)}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">Principal & Interest</span>
                  <span className="font-medium">{formatCurrency(monthlyPI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Property Tax</span>
                  <span className="font-medium">{formatCurrency(monthlyTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Home Insurance</span>
                  <span className="font-medium">{formatCurrency(monthlyInsurance)}</span>
                </div>
                {(ltv > 80 || pmi > 0) && (
                  <div className="flex justify-between">
                    <span className="opacity-80">PMI</span>
                    <span className="font-medium">{formatCurrency(pmi || estimatedPmi)}</span>
                  </div>
                )}
                {hoa > 0 && (
                  <div className="flex justify-between">
                    <span className="opacity-80">HOA</span>
                    <span className="font-medium">{formatCurrency(hoa)}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-80">Loan Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total Interest</p>
                    <p className="text-xl font-bold">{formatCurrency((monthlyPI * numPayments) - loanAmount)}</p>
                  </div>
                </div>
              </div>
              
              {ltv > 80 && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <p className="text-sm">💡 Put {formatCurrency(homePrice * 0.2 - downPayment)} more down to avoid PMI!</p>
                </div>
              )}
            </div>
          )}

          {activeCalc === 'affordability' && (
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white">
              <h3 className="text-lg opacity-80 mb-2">You Can Afford Up To</h3>
              <p className="text-5xl font-bold mb-6">{formatCurrency(estimatedAffordableHome)}</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-80">Max Monthly Payment (28% rule)</p>
                  <p className="text-2xl font-bold">{formatCurrency(affordablePayment)}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-80">Required Down Payment ({downPaymentPct}%)</p>
                  <p className="text-2xl font-bold">{formatCurrency(estimatedAffordableHome * downPaymentPct / 100)}</p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">
                  💡 The 28/36 rule: Housing costs shouldn't exceed 28% of income, total debt shouldn't exceed 36%.
                </p>
              </div>
            </div>
          )}

          {activeCalc === 'rent-vs-buy' && (
            <div className={`rounded-xl p-6 text-white ${buyAdvantage > 0 ? 'bg-gradient-to-br from-green-600 to-emerald-700' : 'bg-gradient-to-br from-orange-600 to-red-700'}`}>
              <h3 className="text-lg opacity-80 mb-2">Over {yearsToStay} Years</h3>
              <p className="text-3xl font-bold mb-6">
                {buyAdvantage > 0 ? '🏠 Buying is Better' : '🏢 Renting May Be Better'}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">Total Rent Paid</span>
                  <span className="font-medium">{formatCurrency(totalRentCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Total Mortgage Payments</span>
                  <span className="font-medium">{formatCurrency(totalMortgageCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Estimated Home Value</span>
                  <span className="font-medium">{formatCurrency(homeValueAfter)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Estimated Equity</span>
                  <span className="font-medium">{formatCurrency(equityBuilt)}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm">
                  {buyAdvantage > 0 
                    ? `Buying could save you approximately ${formatCurrency(buyAdvantage)} compared to renting.`
                    : `Consider your lifestyle needs - renting offers flexibility while buying builds equity.`
                  }
                </p>
              </div>
            </div>
          )}

          {activeCalc === 'investment' && (
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl p-6 text-white">
              <h3 className="text-lg opacity-80 mb-2">Investment Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-80">Cap Rate</p>
                  <p className="text-3xl font-bold">{capRate.toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-80">Cash-on-Cash</p>
                  <p className="text-3xl font-bold">{cashOnCash.toFixed(2)}%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">Gross Annual Rent</span>
                  <span className="font-medium">{formatCurrency(grossRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Vacancy Loss</span>
                  <span className="font-medium">-{formatCurrency(grossRent * vacancyRate / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Operating Expenses</span>
                  <span className="font-medium">-{formatCurrency(operatingExpenses * 12)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/20">
                  <span className="font-medium">Net Operating Income</span>
                  <span className="font-bold">{formatCurrency(noi)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">
                  💡 A cap rate of 5-10% is typically considered good for residential rentals. 
                  Higher cap rates mean higher returns but often more risk.
                </p>
              </div>
            </div>
          )}

          {activeCalc === 'closing-costs' && (
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-6 text-white">
              <h3 className="text-lg opacity-80 mb-2">Estimated Closing Costs</h3>
              <p className="text-5xl font-bold mb-2">
                {formatCurrency(
                  loanAmount * 0.01 + 500 + homePrice * 0.005 + 450 + 400 + 150 + 
                  ((loanAmount * interestRate/100) / 365 * 15) + 
                  propertyTax / 4 + homeInsurance
                )}
              </p>
              <p className="text-sm opacity-80 mb-6">
                ({((loanAmount * 0.01 + 500 + homePrice * 0.005 + 450 + 400 + 150 + 
                  ((loanAmount * interestRate/100) / 365 * 15) + 
                  propertyTax / 4 + homeInsurance) / homePrice * 100).toFixed(1)}% of purchase price)
              </p>
              
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="font-medium mb-2">Cash Needed at Closing</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    downPayment + 
                    loanAmount * 0.01 + 500 + homePrice * 0.005 + 450 + 400 + 150 + 
                    ((loanAmount * interestRate/100) / 365 * 15) + 
                    propertyTax / 4 + homeInsurance
                  )}
                </p>
                <p className="text-sm opacity-80 mt-1">Down payment + closing costs</p>
              </div>
              
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">
                  💡 You may be able to negotiate seller credits to cover some closing costs, 
                  or roll them into your loan with a slightly higher rate.
                </p>
              </div>
            </div>
          )}

          {activeCalc === 'refinance' && (
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-lg opacity-80 mb-2">Refinance Checklist</h3>
              
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">1</div>
                  <p>Current rates at least 0.5% lower than your rate?</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">2</div>
                  <p>Plan to stay 2+ years to recoup costs?</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">3</div>
                  <p>Credit score same or better than original?</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">4</div>
                  <p>At least 20% equity for best rates?</p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">
                  💡 Refinance closing costs are typically 2-5% of the loan. 
                  Calculate your break-even point: Closing costs ÷ Monthly savings = Months to recoup.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
