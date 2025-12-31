-- Javari Realtor Platform - Full Ecosystem Migration
-- CR AudioViz AI, LLC
-- Run this in Supabase SQL Editor

-- ============ SCORING PREFERENCES ============
CREATE TABLE IF NOT EXISTS scoring_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  factors JSONB NOT NULL DEFAULT '[]',
  preset TEXT DEFAULT 'custom',
  user_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scoring_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON scoring_preferences FOR ALL USING (auth.uid() = user_id);

-- ============ HOMEOWNER PORTAL ============

-- Home Documents
CREATE TABLE IF NOT EXISTS home_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID,
  category TEXT NOT NULL,
  subcategory TEXT,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  tags TEXT[] DEFAULT '{}',
  expiration_date DATE,
  reminder_days_before INTEGER DEFAULT 30,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE home_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own documents" ON home_documents FOR ALL USING (auth.uid() = user_id);

-- Home Expenses
CREATE TABLE IF NOT EXISTS home_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID,
  category TEXT NOT NULL,
  subcategory TEXT,
  vendor TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT,
  next_due_date DATE,
  receipt_id UUID,
  is_tax_deductible BOOLEAN DEFAULT FALSE,
  is_capital_improvement BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE home_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own expenses" ON home_expenses FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_expenses_user_date ON home_expenses(user_id, date);

-- Warranties
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID,
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_start_date DATE,
  warranty_end_date DATE NOT NULL,
  warranty_type TEXT DEFAULT 'manufacturer',
  coverage_details TEXT,
  provider_name TEXT,
  provider_phone TEXT,
  provider_email TEXT,
  provider_website TEXT,
  document_id UUID,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own warranties" ON warranties FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_warranties_end_date ON warranties(warranty_end_date);

-- Maintenance Tasks
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  frequency TEXT DEFAULT 'one_time',
  last_completed TIMESTAMPTZ,
  next_due DATE NOT NULL,
  estimated_cost DECIMAL(10,2),
  priority TEXT DEFAULT 'medium',
  assigned_vendor_id UUID,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON maintenance_tasks FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_maintenance_next_due ON maintenance_tasks(next_due);

-- Home Value History
CREATE TABLE IF NOT EXISTS home_value_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID,
  date DATE NOT NULL,
  estimated_value DECIMAL(12,2) NOT NULL,
  source TEXT DEFAULT 'manual',
  change_from_previous DECIMAL(12,2),
  change_percent DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE home_value_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own value history" ON home_value_history FOR ALL USING (auth.uid() = user_id);

-- Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  related_id UUID,
  related_type TEXT,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  send_via TEXT[] DEFAULT '{email}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);

-- ============ MARKETING AUTOMATION ============

-- Message Templates
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents can manage own templates" ON message_templates FOR ALL USING (auth.uid() = agent_id);

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  trigger TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  template_id UUID REFERENCES message_templates(id),
  send_via TEXT[] DEFAULT '{email}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents can manage own rules" ON automation_rules FOR ALL USING (auth.uid() = agent_id);

-- Automated Messages (History)
CREATE TABLE IF NOT EXISTS automated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID,
  rule_id UUID REFERENCES automation_rules(id),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  send_via TEXT[] DEFAULT '{email}',
  scheduled_date TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automated_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents can view own messages" ON automated_messages FOR ALL USING (auth.uid() = agent_id);

-- ============ 3RD PARTY MARKETPLACE ============

-- Service Providers
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategories TEXT[] DEFAULT '{}',
  description TEXT,
  logo_url TEXT,
  photos TEXT[] DEFAULT '{}',
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  service_areas TEXT[] DEFAULT '{}',
  price_range TEXT DEFAULT '$$',
  is_verified BOOLEAN DEFAULT FALSE,
  is_licensed BOOLEAN DEFAULT FALSE,
  is_insured BOOLEAN DEFAULT FALSE,
  license_number TEXT,
  years_in_business INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'basic',
  subscription_price DECIMAL(10,2) DEFAULT 25,
  subscription_status TEXT DEFAULT 'trial',
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  response_time_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active providers" ON service_providers FOR SELECT USING (subscription_status = 'active');
CREATE POLICY "Owners can manage own providers" ON service_providers FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_providers_category ON service_providers(category);
CREATE INDEX idx_providers_areas ON service_providers USING GIN(service_areas);

-- Provider Reviews
CREATE TABLE IF NOT EXISTS provider_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  response TEXT,
  response_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON provider_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON provider_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE INDEX idx_reviews_provider ON provider_reviews(provider_id);

-- Provider Leads
CREATE TABLE IF NOT EXISTS provider_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  message TEXT,
  service_needed TEXT,
  property_address TEXT,
  preferred_contact TEXT DEFAULT 'email',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE provider_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can view own leads" ON provider_leads FOR SELECT USING (
  provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create leads" ON provider_leads FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Create storage bucket for home documents
INSERT INTO storage.buckets (id, name, public) VALUES ('home-documents', 'home-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'home-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT 
USING (bucket_id = 'home-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE 
USING (bucket_id = 'home-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Success message
SELECT 'Migration complete! All tables created successfully.' as status;
