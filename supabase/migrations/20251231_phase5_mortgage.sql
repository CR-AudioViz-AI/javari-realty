-- Javari Mortgage Enhancement Migration
-- Phase 5: Rate Comparison, Alerts, Value Tracking
-- Run in Supabase SQL Editor

-- Rate Alerts
CREATE TABLE IF NOT EXISTS rate_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_type TEXT NOT NULL,
  term_years INTEGER NOT NULL DEFAULT 30,
  target_rate DECIMAL(5,3) NOT NULL,
  current_rate DECIMAL(5,3),
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rate_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON rate_alerts FOR ALL USING (auth.uid() = user_id);

-- Lenders (for future real data)
CREATE TABLE IF NOT EXISTS lenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  type TEXT DEFAULT 'bank',
  nmls_id TEXT,
  website TEXT,
  phone TEXT,
  states_licensed TEXT[] DEFAULT '{}',
  loan_types TEXT[] DEFAULT '{}',
  min_credit_score INTEGER DEFAULT 620,
  min_down_payment DECIMAL(5,2) DEFAULT 3,
  avg_closing_days INTEGER DEFAULT 30,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lender Reviews
CREATE TABLE IF NOT EXISTS lender_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id UUID REFERENCES lenders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  loan_type TEXT,
  loan_amount DECIMAL(12,2),
  closing_time_days INTEGER,
  title TEXT,
  review_text TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  would_recommend BOOLEAN DEFAULT TRUE,
  verified_customer BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lender_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON lender_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON lender_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add home value fields to profiles if not exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_purchase_price DECIMAL(12,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_purchase_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_address TEXT;

SELECT 'Phase 5 migration complete!' as status;
