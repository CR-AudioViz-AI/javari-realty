// lib/apis/nws-weather.ts
// National Weather Service API Integration
// Source: https://www.weather.gov/documentation/services-web-api
// No API key required (User-Agent header recommended)

export interface WeatherConditions {
  temperature: number
  temperatureUnit: 'F' | 'C'
  humidity?: number
  windSpeed: string
  windDirection: string
  description: string
  shortForecast: string
  icon: string
}

export interface ForecastPeriod {
  name: string
  startTime: string
  endTime: string
  temperature: number
  temperatureUnit: string
  temperatureTrend?: string
  windSpeed: string
  windDirection: string
  shortForecast: string
  detailedForecast: string
  icon: string
  isDaytime: boolean
  probabilityOfPrecipitation?: number
}

export interface WeatherAlert {
  id: string
  event: string
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Extreme' | 'Unknown'
  certainty: string
  urgency: string
  headline: string
  description: string
  instruction?: string
  areas: string
  onset?: string
  expires: string
  senderName: string
}

export interface WeatherData {
  location: {
    city: string
    state: string
    timeZone: string
    forecast: string
    office: string
    gridX: number
    gridY: number
  }
  currentConditions?: WeatherConditions
  forecast: ForecastPeriod[]
  alerts: WeatherAlert[]
  hasActiveAlerts: boolean
  hasSevereAlerts: boolean
  queriedAt: string
}

const USER_AGENT = 'CRRealtorPlatform/1.0 (contact@craudiovizai.com)'

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData> {
  try {
    // Step 1: Get gridpoint metadata
    const pointUrl = `https://api.weather.gov/points/${lat.toFixed(4)},${lng.toFixed(4)}`
    
    const pointResponse = await fetch(pointUrl, {
      headers: {
        'Accept': 'application/geo+json',
        'User-Agent': USER_AGENT
      },
      next: { revalidate: 3600 } // Cache location data for 1 hour
    })

    if (!pointResponse.ok) {
      throw new Error(`NWS Points API error: ${pointResponse.status}`)
    }

    const pointData = await pointResponse.json()
    const properties = pointData.properties

    // Step 2: Get forecast
    let forecast: ForecastPeriod[] = []
    try {
      const forecastResponse = await fetch(properties.forecast, {
        headers: {
          'Accept': 'application/geo+json',
          'User-Agent': USER_AGENT
        },
        next: { revalidate: 1800 } // Cache forecast for 30 minutes
      })

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json()
        forecast = (forecastData.properties?.periods || []).slice(0, 14).map((p: any) => ({
          name: p.name,
          startTime: p.startTime,
          endTime: p.endTime,
          temperature: p.temperature,
          temperatureUnit: p.temperatureUnit,
          temperatureTrend: p.temperatureTrend,
          windSpeed: p.windSpeed,
          windDirection: p.windDirection,
          shortForecast: p.shortForecast,
          detailedForecast: p.detailedForecast,
          icon: p.icon,
          isDaytime: p.isDaytime,
          probabilityOfPrecipitation: p.probabilityOfPrecipitation?.value
        }))
      }
    } catch (forecastError) {
      console.error('Forecast fetch error:', forecastError)
    }

    // Step 3: Get active alerts
    let alerts: WeatherAlert[] = []
    let hasActiveAlerts = false
    let hasSevereAlerts = false

    try {
      const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lng}`
      const alertsResponse = await fetch(alertsUrl, {
        headers: {
          'Accept': 'application/geo+json',
          'User-Agent': USER_AGENT
        },
        next: { revalidate: 300 } // Cache alerts for 5 minutes
      })

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        alerts = (alertsData.features || []).map((a: any) => {
          const props = a.properties
          return {
            id: a.id,
            event: props.event,
            severity: props.severity || 'Unknown',
            certainty: props.certainty,
            urgency: props.urgency,
            headline: props.headline,
            description: props.description,
            instruction: props.instruction,
            areas: props.areaDesc,
            onset: props.onset,
            expires: props.expires,
            senderName: props.senderName
          }
        })

        hasActiveAlerts = alerts.length > 0
        hasSevereAlerts = alerts.some(a => 
          a.severity === 'Severe' || a.severity === 'Extreme'
        )
      }
    } catch (alertsError) {
      console.error('Alerts fetch error:', alertsError)
    }

    // Build current conditions from first forecast period (approximation)
    let currentConditions: WeatherConditions | undefined
    if (forecast.length > 0) {
      const current = forecast[0]
      currentConditions = {
        temperature: current.temperature,
        temperatureUnit: current.temperatureUnit as 'F' | 'C',
        windSpeed: current.windSpeed,
        windDirection: current.windDirection,
        description: current.detailedForecast,
        shortForecast: current.shortForecast,
        icon: current.icon
      }
    }

    return {
      location: {
        city: properties.relativeLocation?.properties?.city || 'Unknown',
        state: properties.relativeLocation?.properties?.state || 'Unknown',
        timeZone: properties.timeZone,
        forecast: properties.forecast,
        office: properties.cwa,
        gridX: properties.gridX,
        gridY: properties.gridY
      },
      currentConditions,
      forecast,
      alerts,
      hasActiveAlerts,
      hasSevereAlerts,
      queriedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('NWS API error:', error)
    return {
      location: {
        city: 'Unknown',
        state: 'Unknown',
        timeZone: 'America/New_York',
        forecast: '',
        office: '',
        gridX: 0,
        gridY: 0
      },
      forecast: [],
      alerts: [],
      hasActiveAlerts: false,
      hasSevereAlerts: false,
      queriedAt: new Date().toISOString()
    }
  }
}

// Get alert severity color
export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'Extreme': return 'purple'
    case 'Severe': return 'red'
    case 'Moderate': return 'orange'
    case 'Minor': return 'yellow'
    default: return 'gray'
  }
}

// Get weather icon class
export function getWeatherIconClass(iconUrl: string): string {
  // NWS icons follow pattern: .../icons/land/day/skc or .../icons/land/night/skc
  const iconMatch = iconUrl.match(/icons\/land\/(day|night)\/(\w+)/)
  if (!iconMatch) return 'cloud'
  
  const condition = iconMatch[2]
  const iconMap: Record<string, string> = {
    'skc': 'sun', // Clear
    'few': 'cloud-sun', // Few clouds
    'sct': 'cloud-sun', // Scattered clouds
    'bkn': 'cloud', // Broken clouds
    'ovc': 'cloud', // Overcast
    'wind_skc': 'wind',
    'wind_few': 'wind',
    'rain': 'cloud-rain',
    'rain_showers': 'cloud-drizzle',
    'tsra': 'cloud-lightning',
    'snow': 'cloud-snow',
    'fog': 'cloud-fog',
    'haze': 'sun-dim'
  }
  
  return iconMap[condition] || 'cloud'
}

// Format temperature
export function formatTemperature(temp: number, unit: string = 'F'): string {
  return `${temp}°${unit}`
}

// Get Florida-specific weather context
export function getFloridaWeatherContext(month: number): string {
  if (month >= 6 && month <= 11) {
    return 'This is hurricane season in Florida (June 1 - November 30). Monitor tropical weather developments and have a hurricane plan.'
  }
  if (month >= 5 && month <= 9) {
    return 'Florida\'s wet season brings daily afternoon thunderstorms. Lightning is a significant hazard.'
  }
  return 'This is Florida\'s dry season with generally pleasant weather.'
}
