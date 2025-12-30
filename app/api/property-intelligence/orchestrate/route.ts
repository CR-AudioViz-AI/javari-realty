// =============================================================================
// PROPERTY INTELLIGENCE ORCHESTRATOR API
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:20 PM EST
// Endpoint: GET /api/property-intelligence/orchestrate
// Returns comprehensive property data with trust layers
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  PropertyDataOrchestrator 
} from '@/lib/services/property-orchestrator';
import { PropertyIntelligenceRequest } from '@/types/property-intelligence';

const orchestrator = new PropertyDataOrchestrator({
  cache_ttl_seconds: 3600,
  parallel_requests: true,
  include_fallbacks: true,
  min_confidence_threshold: 30,
  timeout_ms: 15000,
  retry_attempts: 2,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const requestData: PropertyIntelligenceRequest = {
      address: searchParams.get('address') || undefined,
      lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
      lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined,
      property_id: searchParams.get('property_id') || undefined,
    };

    // Validate request
    if (!requestData.address && (!requestData.lat || !requestData.lng)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either address or lat/lng coordinates are required' 
        },
        { status: 400 }
      );
    }

    // Get property intelligence
    const result = await orchestrator.getPropertyIntelligence(requestData);

    // Set cache headers
    const headers = new Headers();
    if (result.metadata.cache_hit) {
      headers.set('X-Cache', 'HIT');
    } else {
      headers.set('X-Cache', 'MISS');
    }
    headers.set('X-Request-ID', result.metadata.request_id);
    headers.set('X-Processing-Time', `${result.metadata.processing_time_ms}ms`);

    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error('Property Intelligence API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requestData: PropertyIntelligenceRequest = {
      address: body.address,
      lat: body.lat,
      lng: body.lng,
      property_id: body.property_id,
      sections: body.sections,
      config: body.config,
    };

    // Validate request
    if (!requestData.address && (!requestData.lat || !requestData.lng)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either address or lat/lng coordinates are required' 
        },
        { status: 400 }
      );
    }

    // Get property intelligence
    const result = await orchestrator.getPropertyIntelligence(requestData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Property Intelligence API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
