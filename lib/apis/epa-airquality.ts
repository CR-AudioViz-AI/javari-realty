/**
 * EPA AirNow API
 * FREE - No API key required for basic endpoints
 * 
 * Provides current air quality data by location
 * Source: https://www.airnow.gov/
 */

interface AirQualityData {
  aqi: number
  category: string
  categoryColor: string
  pollutant: string
  healthMessage: string
  reportingArea: string
  stateCode: string
  dateObserved: string
  hourObserved: number
  source: string
}

interface AirQualityForecast {
  date: string
  aqi: number
  category: string
  pollutant: string
}

// AQI Categories
const AQI_CATEGORIES = [
  { min: 0, max: 50, category: 'Good', color: '#00E400', health: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { min: 51, max: 100, category: 'Moderate', color: '#FFFF00', health: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' },
  { min: 101, max: 150, category: 'Unhealthy for Sensitive Groups', color: '#FF7E00', health: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
  { min: 151, max: 200, category: 'Unhealthy', color: '#FF0000', health: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
  { min: 201, max: 300, category: 'Very Unhealthy', color: '#8F3F97', health: 'Health alert: The risk of health effects is increased for everyone.' },
  { min: 301, max: 500, category: 'Hazardous', color: '#7E0023', health: 'Health warning of emergency conditions: everyone is more likely to be affected.' }
]

/**
 * Get current air quality by ZIP code
 * Note: AirNow API key is free but requires registration
 * This uses the public data endpoint
 */
export async function getAirQuality(zipCode: string): Promise<AirQualityData | null> {
  try {
    // Public AirNow data endpoint
    const url = `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      // Fallback: try to get data from alternative endpoint
      return await getAirQualityFallback(zipCode)
    }
    
    const data = await response.json()
    
    if (!data || data.length === 0) {
      return null
    }
    
    // Get the primary pollutant reading (usually PM2.5 or Ozone)
    const primary = data.reduce((prev: any, curr: any) => 
      (curr.AQI > prev.AQI) ? curr : prev
    , data[0])
    
    const aqiInfo = getAQICategory(primary.AQI)
    
    return {
      aqi: primary.AQI,
      category: aqiInfo.category,
      categoryColor: aqiInfo.color,
      pollutant: primary.ParameterName || 'PM2.5',
      healthMessage: aqiInfo.health,
      reportingArea: primary.ReportingArea || 'Unknown',
      stateCode: primary.StateCode || '',
      dateObserved: primary.DateObserved || new Date().toISOString().split('T')[0],
      hourObserved: primary.HourObserved || new Date().getHours(),
      source: 'EPA AirNow'
    }
    
  } catch (error) {
    console.error('AirNow API error:', error)
    return null
  }
}

/**
 * Fallback using public RSS/JSON feed
 */
async function getAirQualityFallback(zipCode: string): Promise<AirQualityData | null> {
  try {
    // This is a simplified fallback - in production you'd cache data from the full API
    // For now, return a "no data" response
    return null
  } catch {
    return null
  }
}

/**
 * Get AQI category info
 */
function getAQICategory(aqi: number): { category: string; color: string; health: string } {
  for (const cat of AQI_CATEGORIES) {
    if (aqi >= cat.min && aqi <= cat.max) {
      return { category: cat.category, color: cat.color, health: cat.health }
    }
  }
  return AQI_CATEGORIES[0] // Default to Good if unknown
}

/**
 * Get air quality recommendation for property listing
 */
export function getAirQualityRecommendation(aqi: number): {
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'very_poor'
  recommendation: string
  icon: string
} {
  if (aqi <= 50) {
    return {
      rating: 'excellent',
      recommendation: 'Excellent air quality. Great for outdoor activities and open windows.',
      icon: '🌿'
    }
  } else if (aqi <= 100) {
    return {
      rating: 'good',
      recommendation: 'Good air quality. Generally safe for most outdoor activities.',
      icon: '✅'
    }
  } else if (aqi <= 150) {
    return {
      rating: 'fair',
      recommendation: 'Moderate air quality. Sensitive individuals should limit prolonged outdoor exertion.',
      icon: '⚠️'
    }
  } else if (aqi <= 200) {
    return {
      rating: 'poor',
      recommendation: 'Poor air quality. Everyone should reduce prolonged outdoor exertion.',
      icon: '🟠'
    }
  } else {
    return {
      rating: 'very_poor',
      recommendation: 'Very poor air quality. Avoid outdoor activities when possible.',
      icon: '🔴'
    }
  }
}

/**
 * Get annual air quality summary for a location
 * (Would require historical data API access)
 */
export function getAirQualitySummary(monthlyAverages: number[]): {
  annualAverage: number
  goodDaysPercent: number
  trend: 'improving' | 'stable' | 'worsening'
  summary: string
} {
  if (monthlyAverages.length === 0) {
    return {
      annualAverage: 0,
      goodDaysPercent: 0,
      trend: 'stable',
      summary: 'No historical data available'
    }
  }
  
  const avg = monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length
  const goodDays = monthlyAverages.filter(aqi => aqi <= 50).length / monthlyAverages.length * 100
  
  // Calculate trend from first half vs second half
  const firstHalf = monthlyAverages.slice(0, 6).reduce((a, b) => a + b, 0) / 6
  const secondHalf = monthlyAverages.slice(6).reduce((a, b) => a + b, 0) / 6
  
  let trend: 'improving' | 'stable' | 'worsening'
  if (secondHalf < firstHalf - 5) trend = 'improving'
  else if (secondHalf > firstHalf + 5) trend = 'worsening'
  else trend = 'stable'
  
  return {
    annualAverage: Math.round(avg),
    goodDaysPercent: Math.round(goodDays),
    trend,
    summary: `Average AQI: ${Math.round(avg)}. ${Math.round(goodDays)}% of days have good air quality.`
  }
}
