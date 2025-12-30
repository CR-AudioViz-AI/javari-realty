// =============================================================================
// ATTRIBUTION TRACKING API
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 12:59 PM EST
// Endpoint: POST /api/attribution
// Only tracks when user has granted consent
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AttributionRequest, AttributionSource } from '@/types/attribution';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Record attribution event (only with consent)
export async function POST(request: NextRequest) {
  try {
    const body: AttributionRequest = await request.json();
    const { 
      user_id, 
      agent_id, 
      source, 
      landing_page, 
      referrer_url, 
      utm_params 
    } = body;

    // Validate required fields
    if (!user_id || !agent_id || !source || !landing_page) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // CRITICAL: Check if user has granted attribution consent
    const { data: consent, error: consentError } = await supabase
      .from('consent_records')
      .select('id, scope, status, expires_at')
      .eq('user_id', user_id)
      .eq('agent_id', agent_id)
      .eq('status', 'granted')
      .single();

    if (consentError || !consent) {
      // No consent - do NOT track
      return NextResponse.json({
        success: false,
        tracked: false,
        message: 'Attribution not recorded - user has not granted consent',
      });
    }

    // Check if consent has expired
    if (consent.expires_at && new Date(consent.expires_at) < new Date()) {
      return NextResponse.json({
        success: false,
        tracked: false,
        message: 'Attribution not recorded - consent has expired',
      });
    }

    // Check if attribution scope is included in consent
    if (!consent.scope.includes('attribution') && !consent.scope.includes('all')) {
      return NextResponse.json({
        success: false,
        tracked: false,
        message: 'Attribution not recorded - attribution scope not consented',
      });
    }

    // Calculate trust score based on data quality
    const trustScore = calculateTrustScore(body);

    // Record the attribution event
    const { data, error } = await supabase
      .from('attribution_events')
      .insert({
        user_id,
        agent_id,
        source,
        campaign_id: utm_params?.campaign || null,
        referrer_url: referrer_url || null,
        landing_page,
        utm_source: utm_params?.source || null,
        utm_medium: utm_params?.medium || null,
        utm_campaign: utm_params?.campaign || null,
        utm_term: utm_params?.term || null,
        utm_content: utm_params?.content || null,
        consent_id: consent.id,
        trust_score: trustScore,
      })
      .select()
      .single();

    if (error) throw error;

    // Update attribution chain if exists, or create new one
    await updateAttributionChain(user_id, agent_id, data.id, source);

    return NextResponse.json({
      success: true,
      tracked: true,
      attribution_id: data.id,
      trust_score: trustScore,
      message: 'Attribution recorded with consent',
    });
  } catch (error) {
    console.error('Attribution API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record attribution' },
      { status: 500 }
    );
  }
}

// GET - Get attribution data for an agent (with consent verification)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!agentId) {
      return NextResponse.json(
        { success: false, message: 'Missing agent_id' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('attribution_events')
      .select(`
        *,
        consent_records!inner(status, scope)
      `)
      .eq('agent_id', agentId)
      .eq('consent_records.status', 'granted');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Aggregate stats
    const stats = aggregateAttributionStats(data || []);

    return NextResponse.json({
      success: true,
      events: data,
      stats,
      message: 'Attribution data retrieved',
    });
  } catch (error) {
    console.error('Attribution GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve attribution data' },
      { status: 500 }
    );
  }
}

// Helper: Calculate trust score based on data quality
function calculateTrustScore(data: AttributionRequest): number {
  let score = 50; // Base score

  // Add points for data completeness
  if (data.referrer_url) score += 10;
  if (data.utm_params?.source) score += 10;
  if (data.utm_params?.medium) score += 10;
  if (data.utm_params?.campaign) score += 10;

  // Source quality bonuses
  const sourceScores: Record<AttributionSource, number> = {
    direct: 5,
    referral: 8,
    organic: 7,
    email: 9,
    social: 6,
    advertising: 10,
    partner: 8,
  };
  score += sourceScores[data.source] || 0;

  // Cap at 100
  return Math.min(score, 100);
}

// Helper: Update or create attribution chain
async function updateAttributionChain(
  userId: string,
  agentId: string,
  eventId: string,
  source: AttributionSource
) {
  try {
    // Check for existing chain
    const { data: existingChain } = await supabase
      .from('attribution_chains')
      .select('id, touchpoints, total_touchpoints')
      .eq('lead_id', userId)
      .single();

    const touchpoint = {
      id: eventId,
      agent_id: agentId,
      source,
      timestamp: new Date().toISOString(),
    };

    if (existingChain) {
      // Update existing chain
      const touchpoints = [...(existingChain.touchpoints || []), touchpoint];
      
      await supabase
        .from('attribution_chains')
        .update({
          touchpoints,
          last_touch_agent_id: agentId,
          total_touchpoints: touchpoints.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingChain.id);
    } else {
      // Create new chain
      await supabase
        .from('attribution_chains')
        .insert({
          lead_id: userId,
          touchpoints: [touchpoint],
          first_touch_agent_id: agentId,
          last_touch_agent_id: agentId,
          total_touchpoints: 1,
          attribution_model: 'last_touch', // Default model
        });
    }
  } catch (error) {
    console.error('Failed to update attribution chain:', error);
    // Don't throw - chain update failure shouldn't break attribution
  }
}

// Helper: Aggregate attribution stats
function aggregateAttributionStats(events: any[]) {
  if (events.length === 0) {
    return {
      total: 0,
      by_source: {},
      average_trust_score: 0,
    };
  }

  const bySource: Record<string, number> = {};
  let totalTrustScore = 0;

  events.forEach((event) => {
    bySource[event.source] = (bySource[event.source] || 0) + 1;
    totalTrustScore += event.trust_score || 0;
  });

  return {
    total: events.length,
    by_source: bySource,
    average_trust_score: Math.round(totalTrustScore / events.length),
  };
}
