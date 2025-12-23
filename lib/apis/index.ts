// lib/apis/index.ts
// Central export for all property intelligence APIs

export * from './fema-flood'
export * from './fema-disasters'
export * from './epa-environment'
export * from './usgs-earthquakes'
export * from './nws-weather'

// Utility types
export interface PropertyLocation {
  lat: number
  lng: number
  address?: string
  fipsCode?: string
  censusTract?: string
}

// Batch fetch all intelligence data
export async function fetchAllPropertyIntelligence(location: PropertyLocation) {
  const { lat, lng, fipsCode } = location
  
  const [flood, disasters, environment, earthquakes, weather] = await Promise.allSettled([
    import('./fema-flood').then(m => m.getFloodRisk(lat, lng)),
    fipsCode ? import('./fema-disasters').then(m => m.getDisasterHistory(fipsCode)) : Promise.resolve(null),
    import('./epa-environment').then(m => m.getEnvironmentalData(lat, lng)),
    import('./usgs-earthquakes').then(m => m.getEarthquakeHistory(lat, lng)),
    import('./nws-weather').then(m => m.getWeatherData(lat, lng))
  ])

  return {
    flood: flood.status === 'fulfilled' ? flood.value : null,
    disasters: disasters.status === 'fulfilled' ? disasters.value : null,
    environment: environment.status === 'fulfilled' ? environment.value : null,
    earthquakes: earthquakes.status === 'fulfilled' ? earthquakes.value : null,
    weather: weather.status === 'fulfilled' ? weather.value : null
  }
}
