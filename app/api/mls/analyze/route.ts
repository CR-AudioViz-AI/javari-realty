import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''
const API_HOST = 'property-analysis-api.p.rapidapi.com'

interface PropertyAnalysis {
  address: string
  arv: number // After Repair Value
  asIsValue: number
  repairCosts: number
  cashFlow: {
    monthly: number
    annual: number
  }
  capRate: number
  roi: number
  rentEstimate: {
    low: number
    mid: number
    high: number
  }
  expenses: {
    propertyTax: number
    insurance: number
    maintenance: number
    vacancy: number
    management: number
    total: number
  }
  metrics: {
    pricePerSqft: number
    grossRentMultiplier: number
    debtServiceCoverageRatio: number
  }
}

// Analyze property for investors
async function analyzeProperty(address: string): Promise<PropertyAnalysis | null> {
  try {
    const response = await fetch(
      `https://${API_HOST}/analysis`,
      {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': API_HOST,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address })
      }
    )

    if (!response.ok) {
      console.error('Property Analysis API error:', response.status)
      return null
    }

    const data = await response.json()
    
    return {
      address: address,
      arv: data.arv || data.afterRepairValue || 0,
      asIsValue: data.asIsValue || data.currentValue || 0,
      repairCosts: data.repairCosts || data.estimatedRepairs || 0,
      cashFlow: {
        monthly: data.cashFlow?.monthly || data.monthlyCashFlow || 0,
        annual: data.cashFlow?.annual || (data.monthlyCashFlow ? data.monthlyCashFlow * 12 : 0)
      },
      capRate: data.capRate || data.capitalizationRate || 0,
      roi: data.roi || data.returnOnInvestment || 0,
      rentEstimate: {
        low: data.rentEstimate?.low || data.rentLow || 0,
        mid: data.rentEstimate?.mid || data.rentMid || data.estimatedRent || 0,
        high: data.rentEstimate?.high || data.rentHigh || 0
      },
      expenses: {
        propertyTax: data.expenses?.propertyTax || 0,
        insurance: data.expenses?.insurance || 0,
        maintenance: data.expenses?.maintenance || 0,
        vacancy: data.expenses?.vacancy || 0,
        management: data.expenses?.management || 0,
        total: data.expenses?.total || 0
      },
      metrics: {
        pricePerSqft: data.pricePerSqft || 0,
        grossRentMultiplier: data.grossRentMultiplier || data.grm || 0,
        debtServiceCoverageRatio: data.dscr || data.debtServiceCoverageRatio || 0
      }
    }
  } catch (error) {
    console.error('Property Analysis error:', error)
    return null
  }
}

// Calculate investor metrics locally as fallback
function calculateInvestorMetrics(params: {
  purchasePrice: number
  monthlyRent: number
  propertyTaxRate?: number
  insuranceRate?: number
  maintenanceRate?: number
  vacancyRate?: number
  managementRate?: number
  downPayment?: number
  interestRate?: number
  loanTerm?: number
}): PropertyAnalysis {
  const {
    purchasePrice,
    monthlyRent,
    propertyTaxRate = 0.012, // 1.2% default
    insuranceRate = 0.005, // 0.5% default
    maintenanceRate = 0.01, // 1% default
    vacancyRate = 0.08, // 8% default
    managementRate = 0.10, // 10% default
    downPayment = 0.20, // 20% default
    interestRate = 0.07, // 7% default
    loanTerm = 30
  } = params

  const annualRent = monthlyRent * 12
  const effectiveGrossIncome = annualRent * (1 - vacancyRate)

  // Calculate expenses
  const propertyTax = purchasePrice * propertyTaxRate
  const insurance = purchasePrice * insuranceRate
  const maintenance = purchasePrice * maintenanceRate
  const vacancy = annualRent * vacancyRate
  const management = effectiveGrossIncome * managementRate
  const totalExpenses = propertyTax + insurance + maintenance + management

  // Calculate NOI (Net Operating Income)
  const noi = effectiveGrossIncome - totalExpenses

  // Calculate mortgage payment if financed
  const loanAmount = purchasePrice * (1 - downPayment)
  const monthlyInterest = interestRate / 12
  const numPayments = loanTerm * 12
  const monthlyMortgage = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, numPayments)) / (Math.pow(1 + monthlyInterest, numPayments) - 1)
  const annualDebtService = monthlyMortgage * 12

  // Cash flow
  const annualCashFlow = noi - annualDebtService
  const monthlyCashFlow = annualCashFlow / 12

  // Cap Rate
  const capRate = (noi / purchasePrice) * 100

  // Cash on Cash ROI
  const totalCashInvested = purchasePrice * downPayment
  const cashOnCashReturn = (annualCashFlow / totalCashInvested) * 100

  // Gross Rent Multiplier
  const grm = purchasePrice / annualRent

  // DSCR
  const dscr = noi / annualDebtService

  return {
    address: 'Calculated',
    arv: purchasePrice * 1.2, // Estimate 20% increase after repairs
    asIsValue: purchasePrice,
    repairCosts: purchasePrice * 0.1, // Estimate 10% for repairs
    cashFlow: {
      monthly: Math.round(monthlyCashFlow),
      annual: Math.round(annualCashFlow)
    },
    capRate: Math.round(capRate * 100) / 100,
    roi: Math.round(cashOnCashReturn * 100) / 100,
    rentEstimate: {
      low: Math.round(monthlyRent * 0.9),
      mid: monthlyRent,
      high: Math.round(monthlyRent * 1.1)
    },
    expenses: {
      propertyTax: Math.round(propertyTax),
      insurance: Math.round(insurance),
      maintenance: Math.round(maintenance),
      vacancy: Math.round(vacancy),
      management: Math.round(management),
      total: Math.round(totalExpenses)
    },
    metrics: {
      pricePerSqft: 0,
      grossRentMultiplier: Math.round(grm * 100) / 100,
      debtServiceCoverageRatio: Math.round(dscr * 100) / 100
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const address = searchParams.get('address')
  
  if (!address) {
    return NextResponse.json({
      error: 'Please provide an address parameter',
      analysis: null
    }, { status: 400 })
  }

  if (!RAPIDAPI_KEY) {
    return NextResponse.json({
      error: 'RapidAPI key not configured',
      analysis: null
    }, { status: 500 })
  }

  try {
    const analysis = await analyzeProperty(address)
    
    if (analysis) {
      return NextResponse.json({
        success: true,
        analysis,
        source: 'Property Analysis API'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Unable to analyze property',
        analysis: null,
        tip: 'Use POST /api/mls/analyze with purchasePrice and monthlyRent for manual calculation'
      })
    }
  } catch (error) {
    console.error('Property analysis error:', error)
    return NextResponse.json({
      error: 'Failed to analyze property',
      analysis: null
    }, { status: 500 })
  }
}

// POST for manual calculations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { purchasePrice, monthlyRent } = body
    
    if (!purchasePrice || !monthlyRent) {
      return NextResponse.json({
        error: 'Please provide purchasePrice and monthlyRent',
        analysis: null
      }, { status: 400 })
    }

    const analysis = calculateInvestorMetrics({
      purchasePrice,
      monthlyRent,
      propertyTaxRate: body.propertyTaxRate,
      insuranceRate: body.insuranceRate,
      maintenanceRate: body.maintenanceRate,
      vacancyRate: body.vacancyRate,
      managementRate: body.managementRate,
      downPayment: body.downPayment,
      interestRate: body.interestRate,
      loanTerm: body.loanTerm
    })

    return NextResponse.json({
      success: true,
      analysis,
      source: 'Local Calculation',
      inputs: {
        purchasePrice,
        monthlyRent,
        ...body
      }
    })
  } catch (error) {
    console.error('Manual calculation error:', error)
    return NextResponse.json({
      error: 'Failed to calculate metrics',
      analysis: null
    }, { status: 500 })
  }
}
