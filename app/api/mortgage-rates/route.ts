// app/api/mortgage-rates/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  getLiveMortgageRates, 
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateAffordability,
  generateAmortizationSchedule,
  compareLoanScenarios
} from '@/lib/apis/fred-mortgage'

export const runtime = 'edge'
export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'rates'
  
  try {
    switch (action) {
      case 'rates': {
        const rates = await getLiveMortgageRates()
        return NextResponse.json(rates)
      }
      
      case 'calculate': {
        const principal = parseFloat(searchParams.get('principal') || '300000')
        const rate = parseFloat(searchParams.get('rate') || '6.5')
        const term = parseInt(searchParams.get('term') || '30')
        
        const monthlyPayment = calculateMonthlyPayment(principal, rate, term)
        const totalInterest = calculateTotalInterest(principal, monthlyPayment, term)
        
        return NextResponse.json({
          principal,
          rate,
          termYears: term,
          monthlyPayment,
          totalInterest,
          totalCost: principal + totalInterest,
          breakdown: {
            principalAndInterest: monthlyPayment,
            estimatedTaxes: Math.round(principal * 0.0125 / 12), // ~1.25% annual property tax
            estimatedInsurance: Math.round(principal * 0.005 / 12), // ~0.5% annual insurance
            estimatedPMI: principal > 0 ? Math.round(principal * 0.008 / 12) : 0 // ~0.8% if < 20% down
          }
        })
      }
      
      case 'affordability': {
        const monthlyIncome = parseFloat(searchParams.get('income') || '8000')
        const monthlyDebts = parseFloat(searchParams.get('debts') || '500')
        const downPayment = parseFloat(searchParams.get('downPayment') || '50000')
        const rate = parseFloat(searchParams.get('rate') || '6.5')
        const term = parseInt(searchParams.get('term') || '30')
        
        const result = calculateAffordability(monthlyIncome, monthlyDebts, downPayment, rate, term)
        
        return NextResponse.json({
          ...result,
          monthlyIncome,
          monthlyDebts,
          downPayment,
          rate,
          termYears: term,
          assumptions: {
            maxDTI: '43%',
            includesPI: true,
            excludesTaxesInsurance: true
          }
        })
      }
      
      case 'amortization': {
        const principal = parseFloat(searchParams.get('principal') || '300000')
        const rate = parseFloat(searchParams.get('rate') || '6.5')
        const term = parseInt(searchParams.get('term') || '30')
        const summary = searchParams.get('summary') === 'true'
        
        const schedule = generateAmortizationSchedule(principal, rate, term)
        
        if (summary) {
          // Return yearly summaries instead of monthly
          const yearlySummary = []
          for (let year = 1; year <= term; year++) {
            const yearStart = (year - 1) * 12
            const yearEnd = year * 12
            const yearEntries = schedule.slice(yearStart, yearEnd)
            
            yearlySummary.push({
              year,
              totalPayments: yearEntries.reduce((sum, e) => sum + e.payment, 0),
              totalPrincipal: yearEntries.reduce((sum, e) => sum + e.principal, 0),
              totalInterest: yearEntries.reduce((sum, e) => sum + e.interest, 0),
              endingBalance: yearEntries[yearEntries.length - 1]?.balance || 0
            })
          }
          return NextResponse.json({ yearlySummary })
        }
        
        return NextResponse.json({ schedule })
      }
      
      case 'compare': {
        const principal = parseFloat(searchParams.get('principal') || '300000')
        
        // Get live rates for comparison
        const liveRates = await getLiveMortgageRates()
        
        const scenarios = [
          { name: '30-Year Fixed', rate: liveRates.thirtyYear.rate, termYears: 30 },
          { name: '15-Year Fixed', rate: liveRates.fifteenYear.rate, termYears: 15 },
          { name: '30-Year at -0.5%', rate: liveRates.thirtyYear.rate - 0.5, termYears: 30 },
          { name: '30-Year at +0.5%', rate: liveRates.thirtyYear.rate + 0.5, termYears: 30 }
        ]
        
        if (liveRates.fiveOneArm) {
          scenarios.push({ name: '5/1 ARM', rate: liveRates.fiveOneArm.rate, termYears: 30 })
        }
        
        const comparison = compareLoanScenarios(principal, scenarios)
        
        return NextResponse.json({
          principal,
          currentRates: {
            thirtyYear: liveRates.thirtyYear.rate,
            fifteenYear: liveRates.fifteenYear.rate,
            fiveOneArm: liveRates.fiveOneArm?.rate || null
          },
          comparison,
          recommendation: generateRecommendation(comparison)
        })
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Mortgage rates API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mortgage data' },
      { status: 500 }
    )
  }
}

function generateRecommendation(comparison: any[]): string {
  const thirtyYear = comparison.find(c => c.name === '30-Year Fixed')
  const fifteenYear = comparison.find(c => c.name === '15-Year Fixed')
  
  if (!thirtyYear || !fifteenYear) {
    return 'Unable to generate recommendation.'
  }
  
  const interestSavings = thirtyYear.totalInterest - fifteenYear.totalInterest
  const paymentDiff = fifteenYear.monthlyPayment - thirtyYear.monthlyPayment
  
  if (paymentDiff < thirtyYear.monthlyPayment * 0.3) {
    return `Consider the 15-year option to save $${interestSavings.toLocaleString()} in interest. Your payment would only be $${paymentDiff.toLocaleString()} more per month.`
  }
  
  return `The 30-year fixed offers the lowest monthly payment at $${thirtyYear.monthlyPayment.toLocaleString()}. If you can afford $${paymentDiff.toLocaleString()} more monthly, the 15-year saves $${interestSavings.toLocaleString()} in interest.`
}
