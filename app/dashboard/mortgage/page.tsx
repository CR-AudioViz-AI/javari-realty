import MortgageCalculator from '@/components/MortgageCalculator'
import { Calculator, TrendingUp, FileText, Users, Home, Building2, Shield, Landmark, DollarSign, Clock, CheckCircle, Briefcase, Heart, Leaf } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Mortgage Tools | CR Realtor Platform',
  description: 'Calculate payments, explore all loan types, and understand your financing options.',
}

const LOAN_TYPES = [
  {
    name: 'Conventional',
    icon: Home,
    color: 'blue',
    downPayment: '3-20%',
    creditScore: '620+',
    features: ['Fixed or adjustable rates', 'PMI required under 20% down', 'Conforming loan limits apply', 'Best rates with 740+ credit'],
  },
  {
    name: 'FHA',
    icon: Shield,
    color: 'green',
    downPayment: '3.5%',
    creditScore: '580+',
    features: ['Government-backed', 'Lower credit requirements', 'Upfront & annual MIP', 'Great for first-time buyers'],
  },
  {
    name: 'VA',
    icon: Heart,
    color: 'purple',
    downPayment: '0%',
    creditScore: '620+',
    features: ['Veterans & military only', 'No PMI required', 'Competitive rates', 'Funding fee may apply'],
  },
  {
    name: 'USDA',
    icon: Leaf,
    color: 'emerald',
    downPayment: '0%',
    creditScore: '640+',
    features: ['Rural areas only', 'Income limits apply', 'No down payment', 'Government guaranteed'],
  },
  {
    name: 'Jumbo',
    icon: Building2,
    color: 'amber',
    downPayment: '10-20%',
    creditScore: '700+',
    features: ['Above conforming limits', 'Higher credit required', 'Larger down payments', 'Luxury properties'],
  },
  {
    name: 'FHA 203(k)',
    icon: Briefcase,
    color: 'orange',
    downPayment: '3.5%',
    creditScore: '580+',
    features: ['Purchase + renovation', 'One loan, one closing', 'Streamline or full options', 'Finance repairs into mortgage'],
  },
  {
    name: 'ARM',
    icon: TrendingUp,
    color: 'red',
    downPayment: '5-20%',
    creditScore: '620+',
    features: ['Lower initial rate', 'Rate adjusts after fixed period', '5/1, 7/1, 10/1 options', 'Best for short-term ownership'],
  },
  {
    name: 'Interest-Only',
    icon: Clock,
    color: 'indigo',
    downPayment: '20%+',
    creditScore: '720+',
    features: ['Lower initial payments', 'Principal paid later', 'Investment properties', 'Higher long-term cost'],
  },
  {
    name: 'Construction',
    icon: Building2,
    color: 'teal',
    downPayment: '20-25%',
    creditScore: '680+',
    features: ['Build new home', 'Converts to permanent loan', 'Draw schedule', 'Builder approval required'],
  },
  {
    name: 'Bridge Loan',
    icon: Landmark,
    color: 'slate',
    downPayment: '20%',
    creditScore: '680+',
    features: ['Short-term financing', 'Buy before selling', '6-12 month term', 'Higher interest rates'],
  },
  {
    name: 'Hard Money',
    icon: DollarSign,
    color: 'rose',
    downPayment: '25-30%',
    creditScore: 'N/A',
    features: ['Asset-based lending', 'Fast closing', 'Short term', 'Investors & flippers'],
  },
  {
    name: 'Portfolio',
    icon: Briefcase,
    color: 'cyan',
    downPayment: 'Varies',
    creditScore: 'Varies',
    features: ['In-house lending', 'Flexible terms', 'Non-conforming situations', 'Relationship-based'],
  },
]

const SPECIAL_PROGRAMS = [
  { name: 'First-Time Buyer Programs', desc: 'Down payment assistance and reduced rates' },
  { name: 'State Housing Finance', desc: 'Florida Housing (FHFC) programs available' },
  { name: 'Doctor/Professional Loans', desc: 'Special terms for medical professionals' },
  { name: 'Self-Employed Options', desc: 'Bank statement loans, asset depletion' },
  { name: 'Foreign National Loans', desc: 'Non-resident financing options' },
  { name: 'Reverse Mortgage (HECM)', desc: 'For seniors 62+, no monthly payments' },
]

export default function MortgageToolsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mortgage & Financing Tools</h1>
        <p className="text-green-100">
          Explore all financing options, calculate payments, and find the right loan for your situation
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">30-Year Fixed</p>
              <p className="text-xl font-bold text-gray-900">~6.75%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">15-Year Fixed</p>
              <p className="text-xl font-bold text-gray-900">~6.00%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">FHA Rate</p>
              <p className="text-xl font-bold text-gray-900">~6.50%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">5/1 ARM</p>
              <p className="text-xl font-bold text-gray-900">~6.25%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Calculator */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="text-blue-600" /> Mortgage Calculator
        </h2>
        <MortgageCalculator />
      </div>

      {/* All Loan Types */}
      <div>
        <h2 className="text-xl font-bold mb-4">All Loan Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOAN_TYPES.map((loan) => (
            <div key={loan.name} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-${loan.color}-50 rounded-lg`}>
                  <loan.icon className={`w-6 h-6 text-${loan.color}-600`} />
                </div>
                <h3 className="font-semibold text-lg">{loan.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Down:</span>
                  <span className="ml-1 font-medium">{loan.downPayment}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Credit:</span>
                  <span className="ml-1 font-medium">{loan.creditScore}</span>
                </div>
              </div>
              <ul className="space-y-1">
                {loan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Special Programs */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Special Financing Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPECIAL_PROGRAMS.map((program) => (
            <div key={program.name} className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900">{program.name}</h3>
              <p className="text-sm text-gray-600">{program.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold">Quick Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Loan Type</th>
                <th className="px-4 py-3 text-left">Min Down</th>
                <th className="px-4 py-3 text-left">Min Credit</th>
                <th className="px-4 py-3 text-left">PMI/MIP</th>
                <th className="px-4 py-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Conventional</td>
                <td className="px-4 py-3">3%</td>
                <td className="px-4 py-3">620</td>
                <td className="px-4 py-3">Yes (if &lt;20%)</td>
                <td className="px-4 py-3">Good credit buyers</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">FHA</td>
                <td className="px-4 py-3">3.5%</td>
                <td className="px-4 py-3">580</td>
                <td className="px-4 py-3">Yes (lifetime)</td>
                <td className="px-4 py-3">First-time buyers</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">VA</td>
                <td className="px-4 py-3">0%</td>
                <td className="px-4 py-3">620</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">Veterans/Military</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">USDA</td>
                <td className="px-4 py-3">0%</td>
                <td className="px-4 py-3">640</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">Rural buyers</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Jumbo</td>
                <td className="px-4 py-3">10-20%</td>
                <td className="px-4 py-3">700</td>
                <td className="px-4 py-3">Varies</td>
                <td className="px-4 py-3">Luxury homes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Need Help Choosing?</h2>
        <p className="text-blue-100 mb-4">Connect with a trusted lender to explore your options</p>
        <Link href="/dashboard/vendors?category=mortgage" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
          Find a Lender
        </Link>
      </div>
    </div>
  )
}
