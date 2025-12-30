-- =============================================================================
-- CONSENT-BASED ATTRIBUTION SYSTEM - Database Migration
-- CR AudioViz AI - Realtor Platform
-- Created: Monday, December 30, 2025 | 1:00 PM EST
-- =============================================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABLE: consent_records
-- Stores all user consent for agent attribution tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL,
  scope TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'granted', 'denied', 'withdrawn')),
  ip_address TEXT,
  user_agent TEXT,
  consent_text TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '1.0.0',
  granted_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for consent_records
CREATE INDEX IF NOT EXISTS idx_consent_user_agent ON consent_records(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_records(status);
CREATE INDEX IF NOT EXISTS idx_consent_expires ON consent_records(expires_at) WHERE expires_at IS NOT NULL;

-- RLS for consent_records
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Users can read their own consent records
CREATE POLICY "Users can view own consent" ON consent_records
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create consent records for themselves
CREATE POLICY "Users can create own consent" ON consent_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own consent
CREATE POLICY "Users can update own consent" ON consent_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Agents can view consents given to them
CREATE POLICY "Agents can view consents to them" ON consent_records
  FOR SELECT USING (auth.uid() = agent_id);

-- =============================================================================
-- TABLE: attribution_events
-- Records individual attribution touchpoints
-- =============================================================================
CREATE TABLE IF NOT EXISTS attribution_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('direct', 'referral', 'advertising', 'organic', 'social', 'email', 'partner')),
  campaign_id TEXT,
  referrer_url TEXT,
  landing_page TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  consent_id UUID NOT NULL REFERENCES consent_records(id) ON DELETE CASCADE,
  trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for attribution_events
CREATE INDEX IF NOT EXISTS idx_attribution_agent ON attribution_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_attribution_user ON attribution_events(user_id);
CREATE INDEX IF NOT EXISTS idx_attribution_source ON attribution_events(source);
CREATE INDEX IF NOT EXISTS idx_attribution_consent ON attribution_events(consent_id);
CREATE INDEX IF NOT EXISTS idx_attribution_created ON attribution_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attribution_campaign ON attribution_events(campaign_id) WHERE campaign_id IS NOT NULL;

-- RLS for attribution_events
ALTER TABLE attribution_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own attribution events
CREATE POLICY "Users can view own attributions" ON attribution_events
  FOR SELECT USING (auth.uid() = user_id);

-- Agents can view attributions to them (only with valid consent)
CREATE POLICY "Agents can view attributions to them" ON attribution_events
  FOR SELECT USING (
    auth.uid() = agent_id 
    AND EXISTS (
      SELECT 1 FROM consent_records 
      WHERE consent_records.id = attribution_events.consent_id 
      AND consent_records.status = 'granted'
      AND (consent_records.expires_at IS NULL OR consent_records.expires_at > NOW())
    )
  );

-- =============================================================================
-- TABLE: attribution_chains
-- Tracks the full attribution journey for a lead
-- =============================================================================
CREATE TABLE IF NOT EXISTS attribution_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  touchpoints JSONB NOT NULL DEFAULT '[]',
  first_touch_agent_id UUID NOT NULL,
  last_touch_agent_id UUID NOT NULL,
  converting_agent_id UUID,
  total_touchpoints INTEGER NOT NULL DEFAULT 0,
  attribution_model TEXT NOT NULL DEFAULT 'last_touch' CHECK (attribution_model IN ('first_touch', 'last_touch', 'linear', 'time_decay', 'position_based')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lead_id)
);

-- Indexes for attribution_chains
CREATE INDEX IF NOT EXISTS idx_chain_first_touch ON attribution_chains(first_touch_agent_id);
CREATE INDEX IF NOT EXISTS idx_chain_last_touch ON attribution_chains(last_touch_agent_id);
CREATE INDEX IF NOT EXISTS idx_chain_converting ON attribution_chains(converting_agent_id) WHERE converting_agent_id IS NOT NULL;

-- RLS for attribution_chains
ALTER TABLE attribution_chains ENABLE ROW LEVEL SECURITY;

-- Users can view their own chain
CREATE POLICY "Users can view own chain" ON attribution_chains
  FOR SELECT USING (auth.uid() = lead_id);

-- Agents can view chains where they're involved
CREATE POLICY "Agents can view relevant chains" ON attribution_chains
  FOR SELECT USING (
    auth.uid() = first_touch_agent_id 
    OR auth.uid() = last_touch_agent_id 
    OR auth.uid() = converting_agent_id
  );

-- =============================================================================
-- TABLE: privacy_disclosures
-- Versioned privacy disclosure content
-- =============================================================================
CREATE TABLE IF NOT EXISTS privacy_disclosures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL UNIQUE,
  effective_date DATE NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID
);

-- Insert initial privacy disclosure
INSERT INTO privacy_disclosures (version, effective_date, content, is_active)
VALUES (
  '1.0.0',
  CURRENT_DATE,
  '{
    "what_we_collect": [
      "Property viewing history",
      "Search preferences and criteria",
      "Communication with your agent",
      "Device and browser information"
    ],
    "how_we_use": [
      "Help your agent serve you better",
      "Provide personalized property recommendations",
      "Improve our platform experience",
      "Analyze market trends (anonymized)"
    ],
    "who_we_share_with": [
      "Your assigned real estate agent",
      "Service providers who help us operate",
      "As required by law"
    ],
    "your_rights": [
      "Access your data anytime",
      "Request data deletion",
      "Withdraw consent at any time",
      "Port your data to another service"
    ],
    "how_to_opt_out": "Visit your account settings and click 'Privacy Preferences' to manage or withdraw your consent at any time.",
    "contact_info": "privacy@craudiovizai.com"
  }'::jsonb,
  true
)
ON CONFLICT (version) DO NOTHING;

-- =============================================================================
-- FUNCTION: Check if user has valid consent
-- =============================================================================
CREATE OR REPLACE FUNCTION has_valid_consent(
  p_user_id UUID,
  p_agent_id UUID,
  p_scope TEXT DEFAULT 'attribution'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM consent_records 
    WHERE user_id = p_user_id 
    AND agent_id = p_agent_id 
    AND status = 'granted'
    AND (p_scope = ANY(scope) OR 'all' = ANY(scope))
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

-- =============================================================================
-- FUNCTION: Get attribution stats for agent
-- =============================================================================
CREATE OR REPLACE FUNCTION get_agent_attribution_stats(
  p_agent_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_attributions', COUNT(*),
    'consented_attributions', COUNT(*) FILTER (WHERE cr.status = 'granted'),
    'average_trust_score', ROUND(AVG(ae.trust_score)),
    'by_source', (
      SELECT jsonb_object_agg(source, cnt)
      FROM (
        SELECT source, COUNT(*) as cnt
        FROM attribution_events
        WHERE agent_id = p_agent_id
        AND created_at BETWEEN p_start_date AND p_end_date
        GROUP BY source
      ) s
    )
  )
  INTO result
  FROM attribution_events ae
  JOIN consent_records cr ON ae.consent_id = cr.id
  WHERE ae.agent_id = p_agent_id
  AND ae.created_at BETWEEN p_start_date AND p_end_date;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- =============================================================================
-- TRIGGER: Update timestamps
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consent_records_updated_at
  BEFORE UPDATE ON consent_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER attribution_chains_updated_at
  BEFORE UPDATE ON attribution_chains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- COMMENTS for documentation
-- =============================================================================
COMMENT ON TABLE consent_records IS 'Stores user consent for agent attribution tracking. GDPR/CCPA compliant.';
COMMENT ON TABLE attribution_events IS 'Individual attribution touchpoints, only recorded with valid consent.';
COMMENT ON TABLE attribution_chains IS 'Full attribution journey for a lead across multiple touchpoints.';
COMMENT ON TABLE privacy_disclosures IS 'Versioned privacy policy content shown to users.';
COMMENT ON FUNCTION has_valid_consent IS 'Check if user has granted valid, non-expired consent for a specific scope.';
COMMENT ON FUNCTION get_agent_attribution_stats IS 'Get aggregated attribution statistics for an agent.';
