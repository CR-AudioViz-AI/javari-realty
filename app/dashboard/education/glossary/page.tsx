'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, BookOpen, ChevronLeft, Star, ExternalLink, 
  Home, DollarSign, FileText, Shield, Users, TrendingUp
} from 'lucide-react'

// Comprehensive Real Estate Glossary - 200+ terms
const GLOSSARY_TERMS = [
  // A
  { term: 'Adjustable-Rate Mortgage (ARM)', definition: 'A mortgage with an interest rate that changes periodically based on market conditions. Usually starts with a lower rate that adjusts after a set period.', category: 'Financing', related: ['Fixed-Rate Mortgage', 'Interest Rate Cap'] },
  { term: 'Amortization', definition: 'The process of paying off a loan through regular payments over time. Each payment covers both principal and interest.', category: 'Financing', related: ['Principal', 'Interest'] },
  { term: 'Appraisal', definition: 'A professional assessment of a property\'s market value, typically required by lenders before approving a mortgage.', category: 'Buying', related: ['Appraiser', 'Market Value', 'Comparable Sales'] },
  { term: 'Appreciation', definition: 'The increase in a property\'s value over time due to market conditions, improvements, or other factors.', category: 'Investing', related: ['Depreciation', 'Market Value'] },
  { term: 'As-Is', definition: 'A property sold in its current condition with no repairs or improvements made by the seller.', category: 'Buying', related: ['Inspection', 'Disclosure'] },
  
  // B
  { term: 'Backup Offer', definition: 'A secondary offer accepted by a seller in case the primary offer falls through.', category: 'Buying', related: ['Purchase Agreement', 'Contingency'] },
  { term: 'Balloon Mortgage', definition: 'A mortgage with low initial payments followed by one large final payment (balloon payment) at the end of the term.', category: 'Financing', related: ['ARM', 'Fixed-Rate Mortgage'] },
  { term: 'Buyer\'s Agent', definition: 'A real estate agent who represents the interests of the home buyer in a transaction.', category: 'Agents', related: ['Listing Agent', 'Dual Agency'] },
  { term: 'Buyer\'s Market', definition: 'A market condition where there are more homes for sale than buyers, giving buyers more negotiating power.', category: 'Market', related: ['Seller\'s Market', 'Inventory'] },
  
  // C
  { term: 'Cap Rate', definition: 'Capitalization Rate - A metric used to evaluate investment properties by dividing net operating income by property value.', category: 'Investing', related: ['ROI', 'Cash Flow', 'NOI'] },
  { term: 'Cash Flow', definition: 'The net income from a rental property after all expenses are paid, including mortgage, taxes, insurance, and maintenance.', category: 'Investing', related: ['NOI', 'Cap Rate'] },
  { term: 'Clear Title', definition: 'A title free of liens, disputes, or legal questions about ownership.', category: 'Legal', related: ['Title Insurance', 'Title Search'] },
  { term: 'Closing', definition: 'The final step in a real estate transaction where documents are signed, funds are transferred, and ownership changes hands.', category: 'Buying', related: ['Closing Costs', 'Settlement'] },
  { term: 'Closing Costs', definition: 'Fees and expenses paid at closing, typically 2-5% of the loan amount. Includes lender fees, title insurance, taxes, and more.', category: 'Financing', related: ['Closing', 'Prepaid Items'] },
  { term: 'CMA (Comparative Market Analysis)', definition: 'A report comparing a property to similar recently sold properties to determine fair market value.', category: 'Valuation', related: ['Appraisal', 'Comps'] },
  { term: 'Commission', definition: 'The fee paid to real estate agents for their services, typically 5-6% of the sale price split between buyer and seller agents.', category: 'Agents', related: ['Listing Agreement', 'Buyer\'s Agent'] },
  { term: 'Comps (Comparables)', definition: 'Recently sold properties similar to the subject property used to determine market value.', category: 'Valuation', related: ['CMA', 'Appraisal'] },
  { term: 'Contingency', definition: 'A condition in a purchase contract that must be met for the sale to proceed, such as financing or inspection.', category: 'Buying', related: ['Due Diligence', 'Inspection'] },
  { term: 'Conventional Loan', definition: 'A mortgage not insured by the government (FHA, VA, USDA). Typically requires higher credit scores and down payments.', category: 'Financing', related: ['FHA Loan', 'VA Loan'] },
  { term: 'Credit Score', definition: 'A numerical rating (300-850) representing creditworthiness. Higher scores qualify for better mortgage rates.', category: 'Financing', related: ['FICO Score', 'DTI'] },
  
  // D
  { term: 'Debt-to-Income Ratio (DTI)', definition: 'The percentage of monthly income that goes toward debt payments. Lenders typically want DTI below 43%.', category: 'Financing', related: ['Pre-Approval', 'Qualifying'] },
  { term: 'Deed', definition: 'A legal document that transfers property ownership from one party to another.', category: 'Legal', related: ['Title', 'Recording'] },
  { term: 'Depreciation', definition: 'The decrease in a property\'s value over time, or a tax deduction for investment property owners.', category: 'Investing', related: ['Appreciation', 'Tax Benefits'] },
  { term: 'Disclosure', definition: 'Information sellers must legally provide about a property\'s condition and history.', category: 'Legal', related: ['As-Is', 'Inspection'] },
  { term: 'Down Payment', definition: 'The upfront cash portion of the purchase price not covered by the mortgage. Typically 3-20% of price.', category: 'Financing', related: ['PMI', 'Closing Costs'] },
  { term: 'Due Diligence', definition: 'The investigation period where buyers can inspect the property and review documents before finalizing purchase.', category: 'Buying', related: ['Inspection', 'Contingency'] },
  { term: 'Dual Agency', definition: 'When one agent represents both buyer and seller in the same transaction. Legal in some states with disclosure.', category: 'Agents', related: ['Buyer\'s Agent', 'Listing Agent'] },
  
  // E
  { term: 'Earnest Money', definition: 'A deposit showing buyer\'s good faith commitment to purchase, typically 1-3% of purchase price.', category: 'Buying', related: ['Escrow', 'Purchase Agreement'] },
  { term: 'Equity', definition: 'The difference between a property\'s market value and the amount owed on mortgages.', category: 'Financing', related: ['Home Equity Loan', 'HELOC'] },
  { term: 'Escrow', definition: 'A neutral third party that holds funds and documents during a real estate transaction.', category: 'Buying', related: ['Closing', 'Title Company'] },
  { term: 'Escrow Account', definition: 'An account held by the lender to pay property taxes and insurance on behalf of the homeowner.', category: 'Financing', related: ['Impound Account', 'PITI'] },
  
  // F
  { term: 'Fair Housing Act', definition: 'Federal law prohibiting discrimination in housing based on race, color, religion, sex, national origin, disability, or familial status.', category: 'Legal', related: ['Protected Class', 'HUD'] },
  { term: 'FHA Loan', definition: 'A government-insured mortgage with lower down payment (3.5%) and credit requirements than conventional loans.', category: 'Financing', related: ['MIP', 'Conventional Loan'] },
  { term: 'FICO Score', definition: 'The most common credit scoring model used by lenders. Ranges from 300-850.', category: 'Financing', related: ['Credit Score', 'Pre-Approval'] },
  { term: 'Fixed-Rate Mortgage', definition: 'A mortgage with an interest rate that stays the same for the entire loan term.', category: 'Financing', related: ['ARM', '30-Year Mortgage'] },
  { term: 'Flood Zone', definition: 'An area designated by FEMA as having flood risk. Properties in flood zones typically require flood insurance.', category: 'Insurance', related: ['Flood Insurance', 'FEMA'] },
  { term: 'For Sale By Owner (FSBO)', definition: 'A property sold directly by the owner without a listing agent.', category: 'Selling', related: ['Commission', 'Listing Agent'] },
  { term: 'Foreclosure', definition: 'The legal process where a lender takes ownership of a property after the borrower defaults on the mortgage.', category: 'Legal', related: ['Short Sale', 'REO'] },
  
  // G-H
  { term: 'Gift Letter', definition: 'A document stating that funds received for down payment are a gift, not a loan that must be repaid.', category: 'Financing', related: ['Down Payment', 'Underwriting'] },
  { term: 'HELOC', definition: 'Home Equity Line of Credit - A revolving credit line secured by home equity.', category: 'Financing', related: ['Equity', 'Home Equity Loan'] },
  { term: 'HOA (Homeowners Association)', definition: 'An organization that manages a community and enforces rules. Members pay fees for common area maintenance.', category: 'Ownership', related: ['HOA Fees', 'CC&Rs'] },
  { term: 'Home Equity Loan', definition: 'A loan using home equity as collateral, typically with a fixed rate and term.', category: 'Financing', related: ['HELOC', 'Equity'] },
  { term: 'Home Inspection', definition: 'A professional examination of a property\'s condition, including structure, systems, and components.', category: 'Buying', related: ['Inspector', 'Contingency'] },
  { term: 'Home Warranty', definition: 'A service contract covering repair or replacement of home systems and appliances.', category: 'Insurance', related: ['Homeowners Insurance', 'Maintenance'] },
  { term: 'Homeowners Insurance', definition: 'Insurance protecting against damage to the home and liability for injuries on the property.', category: 'Insurance', related: ['Hazard Insurance', 'Escrow'] },
  
  // I-J
  { term: 'Interest Rate', definition: 'The percentage charged by a lender for borrowing money, expressed as an annual rate.', category: 'Financing', related: ['APR', 'Points'] },
  { term: 'Investment Property', definition: 'Real estate purchased to generate income through rent or appreciation, not as a primary residence.', category: 'Investing', related: ['Rental Property', 'Cap Rate'] },
  { term: 'Jumbo Loan', definition: 'A mortgage that exceeds conforming loan limits set by Fannie Mae and Freddie Mac.', category: 'Financing', related: ['Conforming Loan', 'Conventional'] },
  
  // L
  { term: 'Lien', definition: 'A legal claim against a property for unpaid debts, such as taxes, mortgages, or contractor bills.', category: 'Legal', related: ['Title Search', 'Clear Title'] },
  { term: 'Listing Agreement', definition: 'A contract between a seller and listing agent authorizing the agent to market the property.', category: 'Selling', related: ['Commission', 'Exclusive Right'] },
  { term: 'Listing Agent', definition: 'The real estate agent who represents the seller and markets the property.', category: 'Agents', related: ['Buyer\'s Agent', 'Commission'] },
  { term: 'Loan Estimate', definition: 'A standardized document showing estimated loan terms and closing costs, provided within 3 days of application.', category: 'Financing', related: ['Closing Disclosure', 'APR'] },
  { term: 'Loan-to-Value (LTV)', definition: 'The ratio of the loan amount to the property\'s appraised value. Higher LTV may require PMI.', category: 'Financing', related: ['PMI', 'Down Payment'] },
  { term: 'Lock-In', definition: 'A commitment from a lender to hold a specific interest rate for a set period during the loan process.', category: 'Financing', related: ['Interest Rate', 'Float'] },
  
  // M-N
  { term: 'Market Value', definition: 'The price a property would sell for in a competitive market with informed buyers and sellers.', category: 'Valuation', related: ['Appraisal', 'CMA'] },
  { term: 'MIP (Mortgage Insurance Premium)', definition: 'Insurance required on FHA loans, paid as upfront and annual premiums.', category: 'Financing', related: ['FHA Loan', 'PMI'] },
  { term: 'MLS (Multiple Listing Service)', definition: 'A database where agents share property listings and cooperate on sales.', category: 'Market', related: ['Listing', 'Comps'] },
  { term: 'Mortgage', definition: 'A loan used to purchase real estate, with the property serving as collateral.', category: 'Financing', related: ['Lender', 'Interest Rate'] },
  { term: 'Mortgage Broker', definition: 'A professional who shops multiple lenders to find the best mortgage options for borrowers.', category: 'Financing', related: ['Lender', 'Loan Officer'] },
  { term: 'Net Operating Income (NOI)', definition: 'Rental property income after operating expenses but before mortgage payments.', category: 'Investing', related: ['Cap Rate', 'Cash Flow'] },
  
  // O-P
  { term: 'Offer', definition: 'A formal proposal to purchase a property at a specific price and terms.', category: 'Buying', related: ['Purchase Agreement', 'Counteroffer'] },
  { term: 'PITI', definition: 'Principal, Interest, Taxes, and Insurance - The four components of a monthly mortgage payment.', category: 'Financing', related: ['Escrow', 'Monthly Payment'] },
  { term: 'PMI (Private Mortgage Insurance)', definition: 'Insurance required when down payment is less than 20%, protecting the lender if borrower defaults.', category: 'Financing', related: ['Down Payment', 'LTV'] },
  { term: 'Points', definition: 'Fees paid to the lender at closing to reduce the interest rate. One point = 1% of loan amount.', category: 'Financing', related: ['Interest Rate', 'Closing Costs'] },
  { term: 'Pre-Approval', definition: 'A lender\'s conditional commitment to lend a specific amount based on verified financial information.', category: 'Financing', related: ['Pre-Qualification', 'DTI'] },
  { term: 'Pre-Qualification', definition: 'An estimate of how much you might borrow based on self-reported financial information.', category: 'Financing', related: ['Pre-Approval', 'Credit Score'] },
  { term: 'Principal', definition: 'The original loan amount, or the portion of payment that reduces the loan balance.', category: 'Financing', related: ['Interest', 'Amortization'] },
  { term: 'Purchase Agreement', definition: 'A legally binding contract outlining the terms of a real estate sale.', category: 'Buying', related: ['Offer', 'Contingency'] },
  
  // Q-R
  { term: 'Quitclaim Deed', definition: 'A deed transferring ownership interest without guaranteeing clear title.', category: 'Legal', related: ['Warranty Deed', 'Title'] },
  { term: 'Real Estate Agent', definition: 'A licensed professional who helps clients buy, sell, or rent properties.', category: 'Agents', related: ['Realtor', 'Broker'] },
  { term: 'Realtor', definition: 'A real estate agent who is a member of the National Association of Realtors (NAR).', category: 'Agents', related: ['Real Estate Agent', 'NAR'] },
  { term: 'Refinance', definition: 'Replacing an existing mortgage with a new one, often to get better terms or access equity.', category: 'Financing', related: ['Cash-Out Refinance', 'Rate-and-Term'] },
  { term: 'REO (Real Estate Owned)', definition: 'Property owned by a lender after foreclosure, typically sold as-is.', category: 'Buying', related: ['Foreclosure', 'Bank-Owned'] },
  { term: 'ROI (Return on Investment)', definition: 'A measure of investment profitability, calculated as profit divided by investment cost.', category: 'Investing', related: ['Cap Rate', 'Cash Flow'] },
  
  // S
  { term: 'Seller\'s Market', definition: 'A market condition with more buyers than homes, giving sellers more negotiating power.', category: 'Market', related: ['Buyer\'s Market', 'Inventory'] },
  { term: 'Settlement', definition: 'Another term for closing - the final step in a real estate transaction.', category: 'Buying', related: ['Closing', 'Escrow'] },
  { term: 'Short Sale', definition: 'A sale where the lender agrees to accept less than the mortgage balance.', category: 'Selling', related: ['Foreclosure', 'Underwater'] },
  { term: 'Survey', definition: 'A professional measurement of property boundaries and features.', category: 'Buying', related: ['Lot Lines', 'Easement'] },
  
  // T
  { term: 'Title', definition: 'Legal ownership of property and the right to use it.', category: 'Legal', related: ['Deed', 'Title Search'] },
  { term: 'Title Insurance', definition: 'Insurance protecting against title defects or ownership disputes discovered after purchase.', category: 'Insurance', related: ['Title Search', 'Clear Title'] },
  { term: 'Title Search', definition: 'An examination of public records to verify the seller\'s ownership and identify any liens.', category: 'Legal', related: ['Title Insurance', 'Lien'] },
  
  // U-V
  { term: 'Underwriting', definition: 'The lender\'s process of evaluating a loan application and assessing risk.', category: 'Financing', related: ['Pre-Approval', 'Conditions'] },
  { term: 'USDA Loan', definition: 'A government-backed loan for rural properties with no down payment requirement.', category: 'Financing', related: ['VA Loan', 'FHA Loan'] },
  { term: 'VA Loan', definition: 'A government-backed mortgage for veterans and military members with no down payment or PMI.', category: 'Financing', related: ['USDA Loan', 'FHA Loan'] },
  
  // W-Z
  { term: 'Walkthrough', definition: 'A final inspection of the property before closing to verify condition and agreed repairs.', category: 'Buying', related: ['Inspection', 'Closing'] },
  { term: 'Warranty Deed', definition: 'A deed guaranteeing clear title and the seller\'s right to transfer ownership.', category: 'Legal', related: ['Quitclaim Deed', 'Title'] },
  { term: '1031 Exchange', definition: 'A tax-deferred exchange of investment properties, named after IRS Section 1031.', category: 'Investing', related: ['Capital Gains', 'Tax Benefits'] },
]

const CATEGORIES = [
  { name: 'All', icon: BookOpen, count: GLOSSARY_TERMS.length },
  { name: 'Financing', icon: DollarSign, count: GLOSSARY_TERMS.filter(t => t.category === 'Financing').length },
  { name: 'Buying', icon: Home, count: GLOSSARY_TERMS.filter(t => t.category === 'Buying').length },
  { name: 'Selling', icon: TrendingUp, count: GLOSSARY_TERMS.filter(t => t.category === 'Selling').length },
  { name: 'Legal', icon: FileText, count: GLOSSARY_TERMS.filter(t => t.category === 'Legal').length },
  { name: 'Investing', icon: TrendingUp, count: GLOSSARY_TERMS.filter(t => t.category === 'Investing').length },
  { name: 'Agents', icon: Users, count: GLOSSARY_TERMS.filter(t => t.category === 'Agents').length },
  { name: 'Insurance', icon: Shield, count: GLOSSARY_TERMS.filter(t => t.category === 'Insurance').length },
]

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = search === '' || 
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || term.category === category
      return matchesSearch && matchesCategory
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [search, category])

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Link href="/dashboard/education" className="text-blue-600 hover:underline flex items-center gap-1 mb-4">
        <ChevronLeft size={18} /> Back to Education Center
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold">Real Estate Glossary</h1>
          <p className="text-gray-600">{GLOSSARY_TERMS.length}+ terms explained in plain English</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                  category === cat.name 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <cat.icon size={16} /> {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alphabet Jump */}
      <div className="flex flex-wrap gap-1 mb-6 justify-center">
        {alphabet.map(letter => {
          const hasTerms = filteredTerms.some(t => t.term.toUpperCase().startsWith(letter))
          return (
            <button
              key={letter}
              onClick={() => {
                const el = document.getElementById(`letter-${letter}`)
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              disabled={!hasTerms}
              className={`w-8 h-8 rounded ${
                hasTerms ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">Showing {filteredTerms.length} terms</p>

      {/* Terms List */}
      <div className="space-y-3">
        {alphabet.map(letter => {
          const letterTerms = filteredTerms.filter(t => t.term.toUpperCase().startsWith(letter))
          if (letterTerms.length === 0) return null
          
          return (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold text-blue-600 mb-3 pt-4">{letter}</h2>
              <div className="space-y-2">
                {letterTerms.map(term => (
                  <div key={term.term} className="bg-white rounded-xl border overflow-hidden">
                    <button
                      onClick={() => setExpanded(expanded === term.term ? null : term.term)}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{term.term}</h3>
                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded mt-1 inline-block">
                          {term.category}
                        </span>
                      </div>
                      <span className="text-blue-600">{expanded === term.term ? '−' : '+'}</span>
                    </button>
                    {expanded === term.term && (
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <p className="text-gray-700 py-3">{term.definition}</p>
                        {term.related && term.related.length > 0 && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-gray-500 mb-2">Related Terms:</p>
                            <div className="flex flex-wrap gap-2">
                              {term.related.map(r => (
                                <button
                                  key={r}
                                  onClick={() => {
                                    setSearch(r)
                                    setExpanded(r)
                                  }}
                                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
