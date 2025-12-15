'use client'

import { useState, useEffect } from 'react'
import {
  Calculator, DollarSign, Home, FileText, Download, Share2,
  TrendingUp, TrendingDown, Percent, PiggyBank, Building2,
  ArrowRight, Info, Check, Printer, ChevronDown, ChevronUp
} from 'lucide-react'

type SheetType = 'seller' | 'buyer'

interface SellerInputs {
  salePrice: number
  mortgageBalance: number
  commissionRate: number
  titleInsurance: number
  escrowFees: number
  prorations: number
  repairCredits: number
  homeWarranty: number
  otherCredits: number
}

interface BuyerInputs {
  purchasePrice: number
  downPaymentPercent: number
  loanType: 'conventional' | 'fha' | 'va' | 'usda'
  interestRate: number
  closingCostPercent: number
  titleInsurance: number
  escrowFees: number
  prepaidInsurance: number
  prepaidTaxes: number
  inspectionFees: number
  appraisalFee: number
  sellerCredits: number
}

export default function NetSheetCalculatorPage() {
  const [sheetType, setSheetType] = useState<SheetType>('seller')
  const [showBreakdown, setShowBreakdown] = useState(true)
  
  // Seller inputs
  const [seller, setSeller] = useState<SellerInputs>({
    salePrice: 425000,
    mortgageBalance: 280000,
    commissionRate: 6,
    titleInsurance: 2500,
    escrowFees: 1200,
    prorations: 800,
    repairCredits: 0,
    homeWarranty: 500,
    otherCredits: 0,
  })

  // Buyer inputs
  const [buyer, setBuyer] = useState<BuyerInputs>({
    purchasePrice: 425000,
    downPaymentPercent: 20,
    loanType: 'conventional',
    interestRate: 6.875,
    closingCostPercent: 3,
    titleInsurance: 1800,
    escrowFees: 1200,
    prepaidInsurance: 2400,
    prepaidTaxes: 3500,
    inspectionFees: 450,
    appraisalFee: 550,
    sellerCredits: 0,
  })

  // Seller calculations
  const sellerCalcs = {
    grossProceeds: seller.salePrice,
    commission: seller.salePrice * (seller.commissionRate / 100),
    titleInsurance: seller.titleInsurance,
    escrowFees: seller.escrowFees,
    prorations: seller.prorations,
    repairCredits: seller.repairCredits,
    homeWarranty: seller.homeWarranty,
    otherCredits: seller.otherCredits,
    get totalClosingCosts() {
      return this.commission + this.titleInsurance + this.escrowFees + 
             this.prorations + this.repairCredits + this.homeWarranty + this.otherCredits
    },
    get netBeforeMortgage() {
      return this.grossProceeds - this.totalClosingCosts
    },
    get mortgagePayoff() {
      return seller.mortgageBalance
    },
    get estimatedNetProceeds() {
      return this.netBeforeMortgage - this.mortgagePayoff
    }
  }

  // Buyer calculations
  const buyerCalcs = {
    purchasePrice: buyer.purchasePrice,
    downPayment: buyer.purchasePrice * (buyer.downPaymentPercent / 100),
    loanAmount: buyer.purchasePrice * (1 - buyer.downPaymentPercent / 100),
    get closingCosts() {
      const base = this.loanAmount * (buyer.closingCostPercent / 100)
      return base + buyer.titleInsurance + buyer.escrowFees + 
             buyer.prepaidInsurance + buyer.prepaidTaxes + 
             buyer.inspectionFees + buyer.appraisalFee
    },
    sellerCredits: buyer.sellerCredits,
    get totalCashNeeded() {
      return this.downPayment + this.closingCosts - this.sellerCredits
    },
    get monthlyPayment() {
      const principal = this.loanAmount
      const monthlyRate = buyer.interestRate / 100 / 12
      const numPayments = 360 // 30 years
      return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
             (Math.pow(1 + monthlyRate, numPayments) - 1)
    },
    get monthlyPMI() {
      if (buyer.downPaymentPercent >= 20 || buyer.loanType === 'va') return 0
      if (buyer.loanType === 'fha') return this.loanAmount * 0.0055 / 12 // 0.55% annual
      return this.loanAmount * 0.005 / 12 // ~0.5% annual for conventional
    },
    get monthlyTaxes() {
      return buyer.prepaidTaxes / 12
    },
    get monthlyInsurance() {
      return buyer.prepaidInsurance / 12
    },
    get totalMonthlyPayment() {
      return this.monthlyPayment + this.monthlyPMI + this.monthlyTaxes + this.monthlyInsurance
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCurrencyDecimal = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const LineItem = ({ label, amount, type = 'neutral', info }: { 
    label: string, 
    amount: number, 
    type?: 'add' | 'subtract' | 'neutral' | 'total',
    info?: string 
  }) => (
    <div className={`flex justify-between items-center py-2 ${type === 'total' ? 'border-t-2 border-gray-300 pt-3 mt-2' : ''}`}>
      <span className={`flex items-center gap-2 ${type === 'total' ? 'font-bold text-lg' : ''}`}>
        {type === 'subtract' && <span className="text-red-500">−</span>}
        {type === 'add' && <span className="text-green-500">+</span>}
        {label}
        {info && (
          <span className="text-gray-400 cursor-help" title={info}>
            <Info size={14} />
          </span>
        )}
      </span>
      <span className={`font-mono ${
        type === 'total' ? 'font-bold text-lg' : ''
      } ${
        type === 'subtract' ? 'text-red-600' : 
        type === 'add' ? 'text-green-600' : ''
      } ${
        type === 'total' && amount >= 0 ? 'text-green-600' : 
        type === 'total' && amount < 0 ? 'text-red-600' : ''
      }`}>
        {type === 'subtract' ? `(${formatCurrency(Math.abs(amount))})` : formatCurrency(amount)}
      </span>
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="text-green-600" /> Net Sheet Calculator
        </h1>
        <p className="text-gray-600 mt-1">Calculate estimated proceeds for sellers or cash needed for buyers</p>
      </div>

      {/* Type Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSheetType('seller')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            sheetType === 'seller' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <TrendingUp className={`mx-auto mb-2 ${sheetType === 'seller' ? 'text-green-600' : 'text-gray-400'}`} size={32} />
          <p className="font-semibold">Seller Net Sheet</p>
          <p className="text-sm text-gray-500">Calculate proceeds from sale</p>
        </button>
        <button
          onClick={() => setSheetType('buyer')}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            sheetType === 'buyer' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Home className={`mx-auto mb-2 ${sheetType === 'buyer' ? 'text-blue-600' : 'text-gray-400'}`} size={32} />
          <p className="font-semibold">Buyer Estimate</p>
          <p className="text-sm text-gray-500">Calculate cash needed to close</p>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FileText size={18} />
            {sheetType === 'seller' ? 'Seller Information' : 'Buyer Information'}
          </h2>

          {sheetType === 'seller' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sale Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={seller.salePrice}
                    onChange={(e) => setSeller({ ...seller, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Mortgage Balance</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={seller.mortgageBalance}
                    onChange={(e) => setSeller({ ...seller, mortgageBalance: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commission Rate (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    value={seller.commissionRate}
                    onChange={(e) => setSeller({ ...seller, commissionRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3"
                >
                  {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  Additional Costs
                </button>
                {showBreakdown && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Title Insurance</label>
                      <input
                        type="number"
                        value={seller.titleInsurance}
                        onChange={(e) => setSeller({ ...seller, titleInsurance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Escrow Fees</label>
                      <input
                        type="number"
                        value={seller.escrowFees}
                        onChange={(e) => setSeller({ ...seller, escrowFees: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Prorations</label>
                      <input
                        type="number"
                        value={seller.prorations}
                        onChange={(e) => setSeller({ ...seller, prorations: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Repair Credits</label>
                      <input
                        type="number"
                        value={seller.repairCredits}
                        onChange={(e) => setSeller({ ...seller, repairCredits: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Home Warranty</label>
                      <input
                        type="number"
                        value={seller.homeWarranty}
                        onChange={(e) => setSeller({ ...seller, homeWarranty: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Other Credits</label>
                      <input
                        type="number"
                        value={seller.otherCredits}
                        onChange={(e) => setSeller({ ...seller, otherCredits: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={buyer.purchasePrice}
                    onChange={(e) => setBuyer({ ...buyer, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Down Payment (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={buyer.downPaymentPercent}
                    onChange={(e) => setBuyer({ ...buyer, downPaymentPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.125"
                    value={buyer.interestRate}
                    onChange={(e) => setBuyer({ ...buyer, interestRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loan Type</label>
                <select
                  value={buyer.loanType}
                  onChange={(e) => setBuyer({ ...buyer, loanType: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="usda">USDA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seller Credits</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="number"
                    value={buyer.sellerCredits}
                    onChange={(e) => setBuyer({ ...buyer, sellerCredits: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3"
                >
                  {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  Closing Cost Details
                </button>
                {showBreakdown && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Title Insurance</label>
                      <input
                        type="number"
                        value={buyer.titleInsurance}
                        onChange={(e) => setBuyer({ ...buyer, titleInsurance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Escrow Fees</label>
                      <input
                        type="number"
                        value={buyer.escrowFees}
                        onChange={(e) => setBuyer({ ...buyer, escrowFees: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Prepaid Insurance (1yr)</label>
                      <input
                        type="number"
                        value={buyer.prepaidInsurance}
                        onChange={(e) => setBuyer({ ...buyer, prepaidInsurance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Prepaid Taxes</label>
                      <input
                        type="number"
                        value={buyer.prepaidTaxes}
                        onChange={(e) => setBuyer({ ...buyer, prepaidTaxes: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Inspection Fees</label>
                      <input
                        type="number"
                        value={buyer.inspectionFees}
                        onChange={(e) => setBuyer({ ...buyer, inspectionFees: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Appraisal Fee</label>
                      <input
                        type="number"
                        value={buyer.appraisalFee}
                        onChange={(e) => setBuyer({ ...buyer, appraisalFee: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-1.5 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {sheetType === 'seller' ? (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <PiggyBank className="text-green-600" size={18} />
                  Seller Net Sheet
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Printer size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <LineItem label="Sale Price" amount={sellerCalcs.grossProceeds} />
                
                <div className="bg-red-50 rounded-lg p-3 my-3">
                  <p className="text-sm font-medium text-red-800 mb-2">Less: Closing Costs</p>
                  <div className="space-y-1 text-sm">
                    <LineItem label="Commission" amount={sellerCalcs.commission} type="subtract" />
                    <LineItem label="Title Insurance" amount={sellerCalcs.titleInsurance} type="subtract" />
                    <LineItem label="Escrow Fees" amount={sellerCalcs.escrowFees} type="subtract" />
                    <LineItem label="Prorations" amount={sellerCalcs.prorations} type="subtract" />
                    {sellerCalcs.repairCredits > 0 && <LineItem label="Repair Credits" amount={sellerCalcs.repairCredits} type="subtract" />}
                    {sellerCalcs.homeWarranty > 0 && <LineItem label="Home Warranty" amount={sellerCalcs.homeWarranty} type="subtract" />}
                  </div>
                </div>

                <LineItem label="Net Before Mortgage" amount={sellerCalcs.netBeforeMortgage} />
                <LineItem label="Mortgage Payoff" amount={sellerCalcs.mortgagePayoff} type="subtract" />
                
                <div className={`mt-4 p-4 rounded-xl ${sellerCalcs.estimatedNetProceeds >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <LineItem 
                    label="ESTIMATED NET PROCEEDS" 
                    amount={sellerCalcs.estimatedNetProceeds} 
                    type="total"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold flex items-center gap-2">
                    <DollarSign className="text-blue-600" size={18} />
                    Cash Needed to Close
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Printer size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <LineItem label="Purchase Price" amount={buyerCalcs.purchasePrice} />
                  <LineItem label="Down Payment" amount={buyerCalcs.downPayment} type="subtract" />
                  <LineItem label="Loan Amount" amount={buyerCalcs.loanAmount} />
                  
                  <div className="bg-blue-50 rounded-lg p-3 my-3">
                    <p className="text-sm font-medium text-blue-800 mb-2">Plus: Closing Costs</p>
                    <div className="space-y-1 text-sm">
                      <LineItem label="Loan Costs (~3%)" amount={buyerCalcs.loanAmount * (buyer.closingCostPercent / 100)} type="add" />
                      <LineItem label="Title Insurance" amount={buyer.titleInsurance} type="add" />
                      <LineItem label="Escrow Fees" amount={buyer.escrowFees} type="add" />
                      <LineItem label="Prepaid Insurance" amount={buyer.prepaidInsurance} type="add" />
                      <LineItem label="Prepaid Taxes" amount={buyer.prepaidTaxes} type="add" />
                      <LineItem label="Inspections" amount={buyer.inspectionFees} type="add" />
                      <LineItem label="Appraisal" amount={buyer.appraisalFee} type="add" />
                    </div>
                  </div>

                  <LineItem label="Total Closing Costs" amount={buyerCalcs.closingCosts} />
                  {buyer.sellerCredits > 0 && (
                    <LineItem label="Seller Credits" amount={buyer.sellerCredits} type="subtract" />
                  )}
                  
                  <div className="mt-4 p-4 rounded-xl bg-blue-100">
                    <LineItem 
                      label="TOTAL CASH NEEDED" 
                      amount={buyerCalcs.totalCashNeeded} 
                      type="total"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Payment Estimate */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-4">Monthly Payment Estimate</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Principal & Interest</span>
                    <span className="font-mono">{formatCurrencyDecimal(buyerCalcs.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Property Taxes</span>
                    <span className="font-mono">{formatCurrencyDecimal(buyerCalcs.monthlyTaxes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Insurance</span>
                    <span className="font-mono">{formatCurrencyDecimal(buyerCalcs.monthlyInsurance)}</span>
                  </div>
                  {buyerCalcs.monthlyPMI > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-200">PMI/MIP</span>
                      <span className="font-mono">{formatCurrencyDecimal(buyerCalcs.monthlyPMI)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/20 pt-2 mt-2">
                    <span className="font-bold">Total PITI</span>
                    <span className="font-mono font-bold text-xl">{formatCurrencyDecimal(buyerCalcs.totalMonthlyPayment)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800">
              <strong>Disclaimer:</strong> This is an estimate only. Actual closing costs may vary. 
              Consult with your lender and title company for accurate figures. 
              This calculator does not constitute financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
