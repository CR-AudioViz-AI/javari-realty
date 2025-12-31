// Javari Mortgage Enhancement Types
// CR AudioViz AI - Javari Realtor Platform

export interface Lender {
  id: string;
  name: string;
  logo_url?: string;
  type: 'bank' | 'credit_union' | 'mortgage_company' | 'online_lender';
  nmls_id: string;
  website?: string;
  phone?: string;
  states_licensed: string[];
  loan_types: LoanType[];
  min_credit_score: number;
  min_down_payment: number;
  avg_closing_days: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
}

export type LoanType = 
  | 'conventional'
  | 'fha'
  | 'va'
  | 'usda'
  | 'jumbo'
  | 'arm'
  | 'fixed'
  | 'interest_only'
  | 'heloc'
  | 'reverse';

export interface MortgageRate {
  id: string;
  lender_id: string;
  lender_name: string;
  loan_type: LoanType;
  term_years: number;
  rate: number;
  apr: number;
  points: number;
  fees: number;
  min_credit_score: number;
  min_down_payment: number;
  rate_lock_days: number;
  last_updated: string;
}

export interface RateAlert {
  id: string;
  user_id: string;
  loan_type: LoanType;
  term_years: number;
  target_rate: number;
  current_rate?: number;
  is_triggered: boolean;
  triggered_at?: string;
  notification_sent: boolean;
  created_at: string;
}

export interface LenderReview {
  id: string;
  lender_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  loan_type: LoanType;
  loan_amount?: number;
  closing_time_days?: number;
  title?: string;
  review_text: string;
  pros?: string[];
  cons?: string[];
  would_recommend: boolean;
  verified_customer: boolean;
  helpful_votes: number;
  created_at: string;
}

export interface MortgageCalculation {
  loan_amount: number;
  down_payment: number;
  down_payment_percent: number;
  interest_rate: number;
  term_years: number;
  monthly_payment: number;
  monthly_principal: number;
  monthly_interest: number;
  monthly_pmi?: number;
  monthly_taxes?: number;
  monthly_insurance?: number;
  monthly_hoa?: number;
  total_monthly: number;
  total_interest: number;
  total_cost: number;
  amortization_schedule?: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  total_interest: number;
  total_principal: number;
}

export interface LenderComparison {
  lenders: Lender[];
  rates: MortgageRate[];
  loan_amount: number;
  down_payment: number;
  credit_score: number;
  rankings: {
    lender_id: string;
    monthly_payment: number;
    total_cost: number;
    closing_costs: number;
    score: number;
  }[];
}

export const LOAN_TYPE_INFO: Record<LoanType, { label: string; desc: string; icon: string }> = {
  conventional: { label: 'Conventional', desc: 'Standard loan, 3-20% down', icon: '🏠' },
  fha: { label: 'FHA', desc: 'Low down payment, flexible credit', icon: '🏛️' },
  va: { label: 'VA', desc: 'For veterans, 0% down', icon: '🎖️' },
  usda: { label: 'USDA', desc: 'Rural areas, 0% down', icon: '🌾' },
  jumbo: { label: 'Jumbo', desc: 'High-value properties', icon: '💎' },
  arm: { label: 'ARM', desc: 'Adjustable rate', icon: '📊' },
  fixed: { label: 'Fixed', desc: 'Stable rate', icon: '🔒' },
  interest_only: { label: 'Interest Only', desc: 'Lower initial payments', icon: '💰' },
  heloc: { label: 'HELOC', desc: 'Home equity line', icon: '🏦' },
  reverse: { label: 'Reverse', desc: '62+ homeowners', icon: '🔄' },
};
