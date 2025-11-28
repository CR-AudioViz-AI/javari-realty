-- Contacts table for CRM
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_type TEXT DEFAULT 'buyer', -- buyer, seller, investor, vendor, other
  status TEXT DEFAULT 'active', -- active, inactive, archived
  
  -- Company info
  company TEXT,
  job_title TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Preferences (for buyers/investors)
  budget_min INTEGER,
  budget_max INTEGER,
  property_type TEXT,
  preferred_areas TEXT,
  
  -- Metadata
  source TEXT, -- referral, website, zillow, etc
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  last_contact_date TIMESTAMPTZ,
  
  -- Ownership
  agent_id UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_agent ON contacts(agent_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contacts in their org" ON contacts
  FOR SELECT USING (
    agent_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert contacts" ON contacts
  FOR INSERT WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Users can update their contacts" ON contacts
  FOR UPDATE USING (
    agent_id = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their contacts" ON contacts
  FOR DELETE USING (agent_id = auth.uid());

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();
