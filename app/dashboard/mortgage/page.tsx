import MortgageCalculator from '@/components/MortgageCalculator'
import { Calculator, TrendingUp, FileText, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Mortgage Tools | Tony Harvey Real Estate',
  description: 'Calculate your mortgage payments, explore rates, and get pre-approved.',
}

export default function MortgageToolsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mortgage Tools</h1>
        <p className="text-green-100">
          Calculate payments, explore rates, and understand your buying power
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
              <p className="text-sm text-gray-500">30-Year Rate</p>
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
              <p className="text-sm text-gray-500">15-Year Rate</p>
              <p className="text-xl font-bold text-gray-900">~6.00%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">FHA Min Down</p>
              <p className="text-xl font-bold text-gray-900">3.5%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">VA Loans</p>
              <p className="text-xl font-bold text-gray-900">0% Down</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Calculator */}
      <MortgageCalculator />

      {/* Loan Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Conventional Loans</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Typically requires 5-20% down</li>
            <li>• PMI required if less than 20% down</li>
            <li>• Competitive rates for good credit</li>
            <li>• Fixed or adjustable rate options</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">FHA Loans</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Only 3.5% down payment required</li>
            <li>• More flexible credit requirements</li>
            <li>• Great for first-time buyers</li>
            <li>• Mortgage insurance required</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">VA Loans</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 0% down payment for veterans</li>
            <li>• No PMI required</li>
            <li>• Competitive interest rates</li>
            <li>• Certificate of Eligibility needed</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Need Help Understanding Your Options?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          With my background in the mortgage industry, I can help you navigate the financing process 
          and connect you with trusted lenders who offer the best rates.
        </p>
        <Link
          href="/dashboard/contact"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
        >
          Get Pre-Approval Guidance
        </Link>
      </div>
    </div>
  )
}
