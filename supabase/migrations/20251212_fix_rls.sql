-- CR Realtor Platform RLS Fix
-- Run this in Supabase SQL Editor

-- Fix properties table RLS
DROP POLICY IF EXISTS "properties_public_read" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;

CREATE POLICY "Public can view all properties" 
ON public.properties FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert properties"
ON public.properties FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update own properties"
ON public.properties FOR UPDATE
TO authenticated
USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own properties"
ON public.properties FOR DELETE
TO authenticated
USING (auth.uid() = agent_id);

-- Grant permissions
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;

-- Fix profiles table RLS  
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;

-- Fix other tables
GRANT SELECT ON public.javari_knowledge_base TO anon;
GRANT SELECT ON public.javari_knowledge_base TO authenticated;
GRANT SELECT ON public.javari_market_data TO anon;
GRANT SELECT ON public.javari_market_data TO authenticated;

-- Verify
SELECT 'RLS Fix Complete' as status;
