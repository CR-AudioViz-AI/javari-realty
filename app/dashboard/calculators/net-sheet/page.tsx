'use client'

import { useState, useEffect } from 'react'
import {
  Calculator, DollarSign, Download, Share2, Printer,
  Home, Percent, TrendingDown, FileText, Info, ChevronDown,
  HelpCircle, Check, AlertCircle, RefreshCw
} from 'lucide-react'

interface SellerNetSheet {
  salePrice: number
  existingMortgage: number
  commissionRate: number
  titleInsurance: number
  docStamps: number
  titleSearch: number
  surveyFee: number
  attorneyFees: number
  prorations: number
  repairs: number
  homeWarranty: number
  miscFees: number
}

interface BuyerClosingCosts {
  purchasePrice: number
  downPayment: number
  loanAmount: number
  loanOriginationFee: number
  appraisalFee: number
  creditReportFee: number
  floodCertification: number
  titleInsurance: number
  titleSearch: number
  surveyFee: number
  attorneyFees: number
  recordingFees: number
  docStamps: number
  intangibleTax: number
  prepaidInterest: number
  prepaidInsurance: number
  prepaidTaxes: number
  escrowReserves: number
  homeInspection: number
  pestInspection: number
  homeWarranty: number
}

export default function NetSheetCalculatorPage() {
  const [mode, setMode] = useState<'seller' | 'buyer'>('seller')
  
  // Seller inputs
  const [seller, setSeller] = useState<SellerNetSheet>({
    salePrice: 425000,
    existingMortgage: 280000,
    commissionRate: 6,
    titleInsurance: 0,
    docStamps: 0,
    titleSearch: 350,
    surveyFee: 400,
    attorneyFees: 500,
    prorations: 500,
    repairs: 0,
    homeWarranty: 500,
    miscFees: 250
  })

  // Buyer inputs
  const [buyer, setBuyer] = useState<BuyerClosingCosts>({
    purchasePrice: 425000,
    downPayment: 85000,
    loanAmount: 340000,
    loanOriginationFee: 0,
    appraisalFee: 500,
    creditReportFee: 50,
    floodCertification: 25,
    titleInsurance: 0,
    titleSearch: 350,
    surveyFee: 400,
    attorneyFees: 500,
    recordingFees: 250,
    docStamps: 0,
    intangibleTax: 0,
    prepaidInterest: 0,
    prepaidInsurance: 1800,
    prepaidTaxes: 2000,
    escrowReserves: 800,
    homeInspection: 400,
    pestInspection: 125,
    homeWarranty: 500
  })

  // Florida-specific calculations
  useEffect(() => {
    // Seller calculations
    const titleIns = seller.salePrice * 0.00575 // FL title insurance rate
    const docStamps = seller.salePrice * 0.007 // FL doc stamps rate
    setSeller(prev => ({
      ...prev,
      titleInsurance: Math.round(titleIns),
      docStamps: Math.round(docStamps)
    }))
  }, [seller.salePrice])

  useEffect(() => {
    // Buyer calculations
    const loanAmount = buyer.purchasePrice - buyer.downPayment
    const titleIns = buyer.purchasePrice * 0.00575
    const docStamps = loanAmount * 0.0035 // FL mortgage doc stamps
    const intangibleTax = loanAmount * 0.002
    const originationFee = loanAmount * 0.01
    const prepaidInterest = (loanAmount * 0.07 / 365) * 15 // 15 days at 7%
    
    setBuyer(prev => ({
      ...prev,
      loanAmount,
      titleInsurance: Math.round(titleIns),
      docStamps: Math.round(docStamps),
      intangibleTax: Math.round(intangibleTax),
      loanOriginationFee: Math.round(originationFee),
      prepaidInterest: Math.round(prepaidInterest)
    }))
  }, [buyer.purchasePrice, buyer.downPayment])

  // Seller Net Calculations
  const sellerCommission = seller.salePrice * (seller.commissionRate / 100)
  const sellerTotalCosts = sellerCommission + seller.titleInsurance + seller.docStamps +
    seller.titleSearch + seller.surveyFee + seller.attorneyFees + seller.prorations +
    seller.repairs + seller.homeWarranty + seller.miscFees
  const sellerNet = seller.salePrice - seller.existingMortgage - sellerTotalCosts

  // Buyer Total Calculations
  const buyerClosingCosts = buyer.loanOriginationFee + buyer.appraisalFee + buyer.creditReportFee +
    buyer.floodCertification + buyer.titleInsurance + buyer.titleSearch + buyer.surveyFee +
    buyer.attorneyFees + buyer.recordingFees + buyer.docStamps + buyer.intangibleTax +
    buyer.prepaidInterest + buyer.prepaidInsurance + buyer.prepaidTaxes + buyer.escrowReserves +
    buyer.homeInspection + buyer.pestInspection + buyer.homeWarranty
  const buyerTotalCashNeeded = buyer.downPayment + buyerClosingCosts

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const InputRow = ({ 
    label, 
    value, 
    onChange, 
    prefix = '$',
    suffix = '',
    tooltip,
    calculated = false
  }: {
    label: string
    value: number
    onChange?: (val: number) => void
    prefix?: string
    suffix?: string
    tooltip?: string
    calculated?: boolean
  }) => (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}</span>
        {tooltip && (
          <div className="group relative">
            <HelpCircle size={14} className="text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded w-48 z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-gray-500 text-sm">{prefix}</span>}
        {calculated ? (
          <span className="font-medium text-gray-600 w-24 text-right">
            {value.toLocaleString()}
          </span>
        ) : (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border rounded text-right text-sm"
          />
        )}
        {suffix && <span className="text-gray-500 text-sm">{suffix}</span>}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="text-blue-600" /> Net Sheet Calculator
          </h1>
          <p className="text-gray-600 mt-1">Estimate closing costs and net proceeds</p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Share2 size={16} /> Share
          </button>
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('seller')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            mode === 'seller' 
              ? 'bg-green-600 text-white' 
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Seller Net Sheet
        </button>
        <button
          onClick={() => setMode('buyer')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            mode === 'buyer' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Buyer Closing Costs
        </button>
      </div>

      {mode === 'seller' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Home className="text-green-600" size={20} />
              Seller Information
            </h2>

            <div className="space-y-1">
              <InputRow
                label="Sale Price"
                value={seller.salePrice}
                onChange={(v) => setSeller({ ...seller, salePrice: v })}
              />
              <InputRow
                label="Existing Mortgage Balance"
                value={seller.existingMortgage}
                onChange={(v) => setSeller({ ...seller, existingMortgage: v })}
                tooltip="Payoff amount for any existing mortgages"
              />
            </div>

            <h3 className="font-semibold mt-6 mb-3 text-sm text-gray-700">Closing Costs</h3>
            <div className="space-y-1">
              <InputRow
                label="Commission Rate"
                value={seller.commissionRate}
                onChange={(v) => setSeller({ ...seller, commissionRate: v })}
                prefix=""
                suffix="%"
              />
              <InputRow
                label="Title Insurance (Owner's)"
                value={seller.titleInsurance}
                calculated
                tooltip="Florida rate: $5.75 per $1,000"
              />
              <InputRow
                label="Documentary Stamps (Deed)"
                value={seller.docStamps}
                calculated
                tooltip="Florida rate: $7.00 per $1,000"
              />
              <InputRow
                label="Title Search"
                value={seller.titleSearch}
                onChange={(v) => setSeller({ ...seller, titleSearch: v })}
              />
              <InputRow
                label="Survey Fee"
                value={seller.surveyFee}
                onChange={(v) => setSeller({ ...seller, surveyFee: v })}
              />
              <InputRow
                label="Attorney/Closing Fees"
                value={seller.attorneyFees}
                onChange={(v) => setSeller({ ...seller, attorneyFees: v })}
              />
              <InputRow
                label="Prorations (Taxes/HOA)"
                value={seller.prorations}
                onChange={(v) => setSeller({ ...seller, prorations: v })}
                tooltip="Credits for prepaid taxes, HOA dues, etc."
              />
              <InputRow
                label="Repairs/Credits"
                value={seller.repairs}
                onChange={(v) => setSeller({ ...seller, repairs: v })}
              />
              <InputRow
                label="Home Warranty"
                value={seller.homeWarranty}
                onChange={(v) => setSeller({ ...seller, homeWarranty: v })}
              />
              <InputRow
                label="Miscellaneous"
                value={seller.miscFees}
                onChange={(v) => setSeller({ ...seller, miscFees: v })}
              />
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold mb-4">Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span>Sale Price</span>
                  <span className="font-semibold">{formatCurrency(seller.salePrice)}</span>
                </div>
                <div className="flex justify-between py-2 text-red-600">
                  <span>Less: Existing Mortgage</span>
                  <span className="font-semibold">-{formatCurrency(seller.existingMortgage)}</span>
                </div>
                <div className="flex justify-between py-2 text-red-600">
                  <span>Less: Commission ({seller.commissionRate}%)</span>
                  <span className="font-semibold">-{formatCurrency(sellerCommission)}</span>
                </div>
                <div className="flex justify-between py-2 text-red-600">
                  <span>Less: Other Closing Costs</span>
                  <span className="font-semibold">-{formatCurrency(sellerTotalCosts - sellerCommission)}</span>
                </div>
                
                <div className="border-t-2 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Estimated Net Proceeds</span>
                    <span className={`text-2xl font-bold ${sellerNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(sellerNet)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Important Notes
              </h3>
              <ul className="text-sm text-amber-900 space-y-1">
                <li>• This is an estimate only. Actual costs may vary.</li>
                <li>• Florida documentary stamp rates used.</li>
                <li>• Consult with a title company for exact figures.</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 mb-2">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Commission</span>
                  <span>{formatCurrency(sellerCommission)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Title & Recording</span>
                  <span>{formatCurrency(seller.titleInsurance + seller.titleSearch + seller.docStamps)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Fees</span>
                  <span>{formatCurrency(seller.surveyFee + seller.attorneyFees + seller.prorations + seller.repairs + seller.homeWarranty + seller.miscFees)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Buyer Input Section */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Home className="text-blue-600" size={20} />
              Buyer Information
            </h2>

            <div className="space-y-1">
              <InputRow
                label="Purchase Price"
                value={buyer.purchasePrice}
                onChange={(v) => setBuyer({ ...buyer, purchasePrice: v })}
              />
              <InputRow
                label="Down Payment"
                value={buyer.downPayment}
                onChange={(v) => setBuyer({ ...buyer, downPayment: v })}
              />
              <InputRow
                label="Loan Amount"
                value={buyer.loanAmount}
                calculated
              />
            </div>

            <h3 className="font-semibold mt-6 mb-3 text-sm text-gray-700">Lender Fees</h3>
            <div className="space-y-1">
              <InputRow
                label="Loan Origination (1%)"
                value={buyer.loanOriginationFee}
                calculated
              />
              <InputRow
                label="Appraisal"
                value={buyer.appraisalFee}
                onChange={(v) => setBuyer({ ...buyer, appraisalFee: v })}
              />
              <InputRow
                label="Credit Report"
                value={buyer.creditReportFee}
                onChange={(v) => setBuyer({ ...buyer, creditReportFee: v })}
              />
              <InputRow
                label="Flood Certification"
                value={buyer.floodCertification}
                onChange={(v) => setBuyer({ ...buyer, floodCertification: v })}
              />
            </div>

            <h3 className="font-semibold mt-6 mb-3 text-sm text-gray-700">Title & Government</h3>
            <div className="space-y-1">
              <InputRow label="Title Insurance" value={buyer.titleInsurance} calculated />
              <InputRow label="Title Search" value={buyer.titleSearch} onChange={(v) => setBuyer({ ...buyer, titleSearch: v })} />
              <InputRow label="Survey" value={buyer.surveyFee} onChange={(v) => setBuyer({ ...buyer, surveyFee: v })} />
              <InputRow label="Attorney/Closing" value={buyer.attorneyFees} onChange={(v) => setBuyer({ ...buyer, attorneyFees: v })} />
              <InputRow label="Recording Fees" value={buyer.recordingFees} onChange={(v) => setBuyer({ ...buyer, recordingFees: v })} />
              <InputRow label="Doc Stamps (Mortgage)" value={buyer.docStamps} calculated tooltip="FL rate: $3.50 per $1,000 of loan" />
              <InputRow label="Intangible Tax" value={buyer.intangibleTax} calculated tooltip="FL rate: $2.00 per $1,000 of loan" />
            </div>

            <h3 className="font-semibold mt-6 mb-3 text-sm text-gray-700">Prepaids & Reserves</h3>
            <div className="space-y-1">
              <InputRow label="Prepaid Interest (15 days)" value={buyer.prepaidInterest} calculated />
              <InputRow label="Prepaid Insurance (1 year)" value={buyer.prepaidInsurance} onChange={(v) => setBuyer({ ...buyer, prepaidInsurance: v })} />
              <InputRow label="Prepaid Taxes" value={buyer.prepaidTaxes} onChange={(v) => setBuyer({ ...buyer, prepaidTaxes: v })} />
              <InputRow label="Escrow Reserves" value={buyer.escrowReserves} onChange={(v) => setBuyer({ ...buyer, escrowReserves: v })} />
            </div>

            <h3 className="font-semibold mt-6 mb-3 text-sm text-gray-700">Inspections & Other</h3>
            <div className="space-y-1">
              <InputRow label="Home Inspection" value={buyer.homeInspection} onChange={(v) => setBuyer({ ...buyer, homeInspection: v })} />
              <InputRow label="Pest Inspection" value={buyer.pestInspection} onChange={(v) => setBuyer({ ...buyer, pestInspection: v })} />
              <InputRow label="Home Warranty" value={buyer.homeWarranty} onChange={(v) => setBuyer({ ...buyer, homeWarranty: v })} />
            </div>
          </div>

          {/* Buyer Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold mb-4">Cash to Close Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span>Down Payment ({((buyer.downPayment / buyer.purchasePrice) * 100).toFixed(0)}%)</span>
                  <span className="font-semibold">{formatCurrency(buyer.downPayment)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Closing Costs</span>
                  <span className="font-semibold">{formatCurrency(buyerClosingCosts)}</span>
                </div>
                
                <div className="border-t-2 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Cash Needed</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(buyerTotalCashNeeded)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Closing Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lender Fees</span>
                  <span>{formatCurrency(buyer.loanOriginationFee + buyer.appraisalFee + buyer.creditReportFee + buyer.floodCertification)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Title & Government</span>
                  <span>{formatCurrency(buyer.titleInsurance + buyer.titleSearch + buyer.surveyFee + buyer.attorneyFees + buyer.recordingFees + buyer.docStamps + buyer.intangibleTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prepaids & Reserves</span>
                  <span>{formatCurrency(buyer.prepaidInterest + buyer.prepaidInsurance + buyer.prepaidTaxes + buyer.escrowReserves)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspections & Other</span>
                  <span>{formatCurrency(buyer.homeInspection + buyer.pestInspection + buyer.homeWarranty)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Important Notes
              </h3>
              <ul className="text-sm text-amber-900 space-y-1">
                <li>• Estimates based on Florida rates and averages</li>
                <li>• Actual costs depend on lender and title company</li>
                <li>• PMI not included if down payment &lt; 20%</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
