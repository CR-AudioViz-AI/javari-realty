'use client'

import MortgageCalculator from '@/components/mortgage-calculator'

export default function MortgageCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <MortgageCalculator />
      
      {/* Educational Content */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Understanding Your Mortgage</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Principal & Interest:</strong> The main portion of your payment that goes toward paying off the loan balance and interest charges.
            </p>
            <p>
              <strong>Property Tax:</strong> Taxes assessed by your local government, usually based on the assessed value of your home.
            </p>
            <p>
              <strong>Homeowner&apos;s Insurance:</strong> Protects your home against damage from fire, storms, theft, and other covered events.
            </p>
            <p>
              <strong>PMI:</strong> Private Mortgage Insurance is required when your down payment is less than 20%. It protects the lender if you default.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tips for First-Time Buyers</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Get pre-approved before house hunting to know your budget</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Aim for 20% down to avoid PMI payments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Compare rates from multiple lenders - even 0.25% difference matters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Factor in closing costs (typically 2-5% of loan amount)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Keep your debt-to-income ratio under 43%</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Don&apos;t forget to budget for maintenance (1-2% of home value/year)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">
          <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
          Actual payments may vary based on your specific situation, credit score, and lender requirements. 
          Contact a mortgage professional for accurate quotes and pre-approval.
        </p>
      </div>
    </div>
  )
}
