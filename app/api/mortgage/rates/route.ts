import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Mock rate data - in production, this would come from rate aggregators
const MOCK_LENDERS = [
  { id: '1', name: 'First National Bank', type: 'bank', rating: 4.5 },
  { id: '2', name: 'QuickLoans Direct', type: 'online_lender', rating: 4.3 },
  { id: '3', name: 'Credit Union Plus', type: 'credit_union', rating: 4.7 },
  { id: '4', name: 'Rocket Mortgage', type: 'online_lender', rating: 4.4 },
  { id: '5', name: 'Wells Fargo Home', type: 'bank', rating: 4.1 },
  { id: '6', name: 'Better.com', type: 'online_lender', rating: 4.2 },
  { id: '7', name: 'Chase Home Lending', type: 'bank', rating: 4.3 },
  { id: '8', name: 'Navy Federal CU', type: 'credit_union', rating: 4.8 },
];

function generateRates(loanType: string, termYears: number, creditScore: number) {
  // Base rate varies by term
  let baseRate = termYears === 30 ? 6.875 : termYears === 15 ? 6.125 : 6.5;
  
  // Adjust for loan type
  if (loanType === 'fha') baseRate += 0.125;
  if (loanType === 'va') baseRate -= 0.25;
  if (loanType === 'jumbo') baseRate += 0.375;
  
  // Adjust for credit score
  if (creditScore >= 760) baseRate -= 0.25;
  else if (creditScore >= 720) baseRate -= 0.125;
  else if (creditScore < 680) baseRate += 0.375;
  else if (creditScore < 640) baseRate += 0.75;

  return MOCK_LENDERS.map((lender, idx) => {
    const variance = (Math.random() - 0.5) * 0.5; // +/- 0.25%
    const rate = Math.round((baseRate + variance) * 1000) / 1000;
    const apr = Math.round((rate + 0.1 + Math.random() * 0.15) * 1000) / 1000;
    
    return {
      id: `rate_${lender.id}_${termYears}`,
      lender_id: lender.id,
      lender_name: lender.name,
      loan_type: loanType,
      term_years: termYears,
      rate,
      apr,
      points: Math.round(Math.random() * 2 * 10) / 10,
      fees: Math.round(2000 + Math.random() * 3000),
      min_credit_score: 620,
      min_down_payment: loanType === 'va' ? 0 : loanType === 'fha' ? 3.5 : 5,
      rate_lock_days: 30,
      last_updated: new Date().toISOString(),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const loanType = searchParams.get('loanType') || 'conventional';
    const termYears = parseInt(searchParams.get('termYears') || '30');
    const creditScore = parseInt(searchParams.get('creditScore') || '720');

    const rates = generateRates(loanType, termYears, creditScore);
    
    return NextResponse.json({
      rates,
      lenders: MOCK_LENDERS,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
