/**
 * FCC Broadband Map API
 * FREE - No API key required
 * 
 * Provides internet availability and speed data
 * Source: https://broadbandmap.fcc.gov/
 */

interface BroadbandProvider {
  name: string
  technology: string
  maxDownload: number // Mbps
  maxUpload: number // Mbps
  type: 'fiber' | 'cable' | 'dsl' | 'fixed_wireless' | 'satellite' | 'other'
}

interface BroadbandData {
  hasHighSpeedInternet: boolean
  hasFiber: boolean
  providerCount: number
  maxDownloadSpeed: number
  maxUploadSpeed: number
  providers: BroadbandProvider[]
  underserved: boolean
  source: string
}

// Technology type mapping
const TECHNOLOGY_TYPES: Record<number, { name: string; type: BroadbandProvider['type'] }> = {
  10: { name: 'DSL', type: 'dsl' },
  40: { name: 'Cable', type: 'cable' },
  41: { name: 'Cable (DOCSIS 3.0)', type: 'cable' },
  42: { name: 'Cable (DOCSIS 3.1)', type: 'cable' },
  43: { name: 'Cable', type: 'cable' },
  50: { name: 'Fiber', type: 'fiber' },
  60: { name: 'Satellite', type: 'satellite' },
  70: { name: 'Fixed Wireless', type: 'fixed_wireless' },
  71: { name: 'Licensed Fixed Wireless', type: 'fixed_wireless' },
  72: { name: 'Unlicensed Fixed Wireless', type: 'fixed_wireless' },
}

/**
 * Get broadband availability by location
 */
export async function getBroadbandData(lat: number, lng: number): Promise<BroadbandData> {
  try {
    // FCC Broadband Map API endpoint
    const url = `https://broadbandmap.fcc.gov/api/public/v3/location/fixed?lat=${lat}&lon=${lng}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      console.error('FCC Broadband API error:', response.status)
      return getDefaultResult()
    }
    
    const data = await response.json()
    
    if (!data || !data.data) {
      return getDefaultResult()
    }
    
    return processProviders(data.data)
    
  } catch (error) {
    console.error('FCC Broadband API error:', error)
    return getDefaultResult()
  }
}

function processProviders(providers: any[]): BroadbandData {
  if (!providers || providers.length === 0) {
    return getDefaultResult()
  }
  
  const processed: BroadbandProvider[] = providers.map(p => {
    const techInfo = TECHNOLOGY_TYPES[p.technology_code] || { name: 'Unknown', type: 'other' as const }
    
    return {
      name: p.provider_name || 'Unknown Provider',
      technology: techInfo.name,
      maxDownload: p.max_advertised_download_speed || 0,
      maxUpload: p.max_advertised_upload_speed || 0,
      type: techInfo.type
    }
  })
  
  // Sort by download speed
  processed.sort((a, b) => b.maxDownload - a.maxDownload)
  
  const hasFiber = processed.some(p => p.type === 'fiber')
  const maxDown = Math.max(...processed.map(p => p.maxDownload))
  const maxUp = Math.max(...processed.map(p => p.maxUpload))
  
  // FCC defines high-speed as 25 Mbps down / 3 Mbps up
  const hasHighSpeed = maxDown >= 25 && maxUp >= 3
  
  // Underserved if no provider offers 100 Mbps or fiber
  const underserved = maxDown < 100 && !hasFiber
  
  return {
    hasHighSpeedInternet: hasHighSpeed,
    hasFiber,
    providerCount: processed.length,
    maxDownloadSpeed: maxDown,
    maxUploadSpeed: maxUp,
    providers: processed.slice(0, 10), // Top 10 providers
    underserved,
    source: 'FCC Broadband Map'
  }
}

function getDefaultResult(): BroadbandData {
  return {
    hasHighSpeedInternet: false,
    hasFiber: false,
    providerCount: 0,
    maxDownloadSpeed: 0,
    maxUploadSpeed: 0,
    providers: [],
    underserved: true,
    source: 'FCC Broadband Map'
  }
}

/**
 * Get internet quality rating for property listing
 */
export function getInternetRating(data: BroadbandData): {
  score: number // 0-100
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  description: string
  workFromHomeReady: boolean
  streamingReady: boolean
  gamingReady: boolean
} {
  let score = 0
  
  // Base score from max speed
  if (data.maxDownloadSpeed >= 1000) score += 40 // Gigabit
  else if (data.maxDownloadSpeed >= 500) score += 35
  else if (data.maxDownloadSpeed >= 200) score += 30
  else if (data.maxDownloadSpeed >= 100) score += 25
  else if (data.maxDownloadSpeed >= 50) score += 15
  else if (data.maxDownloadSpeed >= 25) score += 10
  
  // Bonus for fiber
  if (data.hasFiber) score += 20
  
  // Bonus for upload speed
  if (data.maxUploadSpeed >= 100) score += 15
  else if (data.maxUploadSpeed >= 50) score += 10
  else if (data.maxUploadSpeed >= 20) score += 5
  
  // Bonus for provider competition
  if (data.providerCount >= 4) score += 15
  else if (data.providerCount >= 2) score += 10
  else if (data.providerCount >= 1) score += 5
  
  // Penalties
  if (data.underserved) score -= 10
  
  // Cap at 100
  score = Math.min(Math.max(score, 0), 100)
  
  // Determine rating
  let rating: 'excellent' | 'good' | 'fair' | 'poor'
  let description: string
  
  if (score >= 80) {
    rating = 'excellent'
    description = 'Excellent internet options with high-speed fiber or gigabit cable available.'
  } else if (score >= 60) {
    rating = 'good'
    description = 'Good internet options with multiple high-speed providers.'
  } else if (score >= 40) {
    rating = 'fair'
    description = 'Adequate internet options, but may be limited for heavy use.'
  } else {
    rating = 'poor'
    description = 'Limited internet options. May not support work-from-home or streaming.'
  }
  
  return {
    score,
    rating,
    description,
    workFromHomeReady: data.maxDownloadSpeed >= 50 && data.maxUploadSpeed >= 10,
    streamingReady: data.maxDownloadSpeed >= 25,
    gamingReady: data.maxDownloadSpeed >= 50 && data.maxUploadSpeed >= 10
  }
}

/**
 * Format speed for display
 */
export function formatSpeed(mbps: number): string {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(1)} Gbps`
  }
  return `${mbps} Mbps`
}
