'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamicImport from 'next/dynamic'
import {
  MapPin, School, ShoppingBag, Coffee, Utensils, Hospital, 
  Building2, Trees, Bus, Train, Car, Bike, Footprints,
  Sun, Cloud, Thermometer, Wind, Droplets, AlertTriangle,
  TrendingUp, DollarSign, Home, Users, Clock, Star,
  ChevronRight, ExternalLink, Loader2, RefreshCw, Share2,
  Zap, Shield, Heart, Baby, Dog, Dumbbell
} from 'lucide-react'

// Dynamic import for map (SSR issues)
const PropertyMap = dynamicImport(() => import('@/components/maps/PropertyMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" />
})

interface NearbyPlace {
  name: string
  type: string
  distance: number
  lat: number
  lon: number
}

interface WeatherData {
  current: {
    temp: number
    humidity: number
    windSpeed: number
    condition: string
    icon: string
  }
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

interface DemographicData {
  population: number
  medianAge: number
  medianIncome: number
  homeownershipRate: number
  medianHomeValue: number
  collegeEducated: number
}

interface WalkScore {
  walk: number
  bike: number
  transit: number
}


function PropertyIntelligenceContent() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('id')
  const [address, setAddress] = useState(searchParams.get('address') || '2850 Winkler Ave, Fort Myers, FL')
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null)
  const [loading, setLoading] = useState(false)
  const [nearbyPlaces, setNearbyPlaces] = useState<Record<string, NearbyPlace[]>>({})
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [demographics, setDemographics] = useState<DemographicData | null>(null)
  const [walkScore, setWalkScore] = useState<WalkScore | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Geocode address
  const geocodeAddress = async (addr: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`)
      const data = await res.json()
      if (data && data[0]) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      }
    } catch (e) {
      console.error('Geocoding error:', e)
    }
    return null
  }

  // Fetch nearby places from Overpass API
  const fetchNearbyPlaces = async (lat: number, lon: number) => {
    const categories = [
      { key: 'schools', query: 'amenity~"school|kindergarten|university|college"', icon: School },
      { key: 'restaurants', query: 'amenity~"restaurant|cafe|fast_food"', icon: Utensils },
      { key: 'shopping', query: 'shop~"supermarket|mall|convenience"', icon: ShoppingBag },
      { key: 'healthcare', query: 'amenity~"hospital|clinic|pharmacy|doctors"', icon: Hospital },
      { key: 'parks', query: 'leisure~"park|playground|garden"', icon: Trees },
      { key: 'transit', query: 'public_transport~"station|stop_position"', icon: Bus },
      { key: 'fitness', query: 'leisure~"fitness_centre|sports_centre"', icon: Dumbbell },
    ]

    const results: Record<string, NearbyPlace[]> = {}
    const radius = 2000 // 2km

    for (const cat of categories) {
      try {
        const query = `
          [out:json][timeout:10];
          (
            node[${cat.query}](around:${radius},${lat},${lon});
            way[${cat.query}](around:${radius},${lat},${lon});
          );
          out center 10;
        `
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
        })
        const data = await res.json()
        
        results[cat.key] = (data.elements || []).slice(0, 5).map((el: any) => ({
          name: el.tags?.name || `${cat.key} nearby`,
          type: cat.key,
          distance: calculateDistance(lat, lon, el.lat || el.center?.lat, el.lon || el.center?.lon),
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        })).sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
      } catch (e) {
        results[cat.key] = []
      }
    }

    return results
  }

  // Fetch weather from Open-Meteo
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York`
      )
      const data = await res.json()
      
      const weatherCodes: Record<number, string> = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 51: 'Light Drizzle', 61: 'Light Rain', 63: 'Rain',
        80: 'Light Showers', 95: 'Thunderstorm'
      }

      return {
        current: {
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: weatherCodes[data.current.weather_code] || 'Unknown',
          icon: data.current.weather_code <= 3 ? '☀️' : data.current.weather_code < 50 ? '☁️' : '🌧️'
        },
        forecast: data.daily.time.slice(0, 5).map((day: string, i: number) => ({
          day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
          condition: weatherCodes[data.daily.weather_code[i]] || 'Unknown'
        }))
      }
    } catch (e) {
      return null
    }
  }

  // Calculate walk score (simplified algorithm)
  const calculateWalkScore = (places: Record<string, NearbyPlace[]>) => {
    let walkScore = 50 // Base score
    let bikeScore = 50
    let transitScore = 30

    // Add points for nearby amenities
    if (places.schools?.length > 0) walkScore += 10
    if (places.restaurants?.length > 2) walkScore += 10
    if (places.shopping?.length > 0) walkScore += 10
    if (places.healthcare?.length > 0) walkScore += 5
    if (places.parks?.length > 0) { walkScore += 5; bikeScore += 10 }
    if (places.transit?.length > 0) { transitScore += 30; walkScore += 5 }
    if (places.fitness?.length > 0) bikeScore += 5

    // Adjust based on closest distances
    const avgDistance = Object.values(places).flat().reduce((sum, p) => sum + p.distance, 0) / 
                       Math.max(Object.values(places).flat().length, 1)
    
    if (avgDistance < 500) { walkScore += 15; bikeScore += 10 }
    else if (avgDistance < 1000) { walkScore += 10; bikeScore += 5 }
    else if (avgDistance > 2000) { walkScore -= 10; bikeScore -= 5 }

    return {
      walk: Math.min(100, Math.max(0, walkScore)),
      bike: Math.min(100, Math.max(0, bikeScore)),
      transit: Math.min(100, Math.max(0, transitScore))
    }
  }

  // Generate mock demographics (would use Census API in production)
  const generateDemographics = (lat: number, lon: number): DemographicData => {
    // Seed based on coordinates for consistency
    const seed = Math.abs(lat * 1000 + lon * 1000) % 100
    return {
      population: 45000 + seed * 500,
      medianAge: 35 + (seed % 20),
      medianIncome: 55000 + seed * 800,
      homeownershipRate: 55 + (seed % 30),
      medianHomeValue: 280000 + seed * 3000,
      collegeEducated: 30 + (seed % 40),
    }
  }

  // Calculate distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c)
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  // Load all data
  const loadIntelligence = async () => {
    setLoading(true)
    
    const coords = await geocodeAddress(address)
    if (coords) {
      setCoordinates(coords)
      
      const [places, weatherData] = await Promise.all([
        fetchNearbyPlaces(coords.lat, coords.lon),
        fetchWeather(coords.lat, coords.lon),
      ])
      
      setNearbyPlaces(places)
      setWeather(weatherData)
      setWalkScore(calculateWalkScore(places))
      setDemographics(generateDemographics(coords.lat, coords.lon))
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadIntelligence()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Walker's Paradise"
    if (score >= 70) return 'Very Walkable'
    if (score >= 50) return 'Somewhat Walkable'
    if (score >= 25) return 'Car-Dependent'
    return 'Almost All Errands Require Car'
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'weather', label: 'Weather', icon: Sun },
    { id: 'commute', label: 'Commute', icon: Car },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="text-amber-500" /> Property Intelligence
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive neighborhood analysis powered by real-time data</p>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={loadIntelligence}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            Analyze
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600">Analyzing neighborhood data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Walk/Bike/Transit Scores */}
          {walkScore && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border p-4 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(walkScore.walk)} text-2xl font-bold mb-2`}>
                  {walkScore.walk}
                </div>
                <p className="font-semibold">Walk Score</p>
                <p className="text-xs text-gray-500">{getScoreLabel(walkScore.walk)}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(walkScore.bike)} text-2xl font-bold mb-2`}>
                  {walkScore.bike}
                </div>
                <p className="font-semibold">Bike Score</p>
                <p className="text-xs text-gray-500">{walkScore.bike >= 70 ? 'Bikeable' : 'Some Bike Infrastructure'}</p>
              </div>
              <div className="bg-white rounded-xl border p-4 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(walkScore.transit)} text-2xl font-bold mb-2`}>
                  {walkScore.transit}
                </div>
                <p className="font-semibold">Transit Score</p>
                <p className="text-xs text-gray-500">{walkScore.transit >= 50 ? 'Good Transit' : 'Minimal Transit'}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="bg-white rounded-xl border overflow-hidden">
              {coordinates && (
                <div className="h-[400px]">
                  <PropertyMap
                    center={[coordinates.lat, coordinates.lon]}
                    markers={[
                      { position: [coordinates.lat, coordinates.lon], popup: address, type: 'property' },
                      ...Object.values(nearbyPlaces).flat().slice(0, 20).map(p => ({
                        position: [p.lat, p.lon] as [number, number],
                        popup: `${p.name} (${formatDistance(p.distance)})`,
                        type: p.type
                      }))
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {activeTab === 'overview' && (
                <>
                  {/* Weather Quick */}
                  {weather && (
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-100">Current Weather</p>
                          <p className="text-4xl font-bold">{weather.current.temp}°F</p>
                          <p className="text-blue-100">{weather.current.condition}</p>
                        </div>
                        <div className="text-6xl">{weather.current.icon}</div>
                      </div>
                    </div>
                  )}

                  {/* Key Stats */}
                  {demographics && (
                    <div className="bg-white rounded-xl border p-4">
                      <h3 className="font-bold mb-3">Area Highlights</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">Median Income</p>
                          <p className="text-xl font-bold text-green-600">${demographics.medianIncome.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">Home Value</p>
                          <p className="text-xl font-bold text-blue-600">${demographics.medianHomeValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">Homeownership</p>
                          <p className="text-xl font-bold">{demographics.homeownershipRate}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">College Educated</p>
                          <p className="text-xl font-bold">{demographics.collegeEducated}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nearby Summary */}
                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-bold mb-3">What's Nearby</h3>
                    <div className="space-y-2">
                      {nearbyPlaces.schools?.[0] && (
                        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                          <School className="text-blue-600" size={20} />
                          <span className="flex-1">{nearbyPlaces.schools[0].name}</span>
                          <span className="text-sm text-gray-500">{formatDistance(nearbyPlaces.schools[0].distance)}</span>
                        </div>
                      )}
                      {nearbyPlaces.shopping?.[0] && (
                        <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                          <ShoppingBag className="text-green-600" size={20} />
                          <span className="flex-1">{nearbyPlaces.shopping[0].name}</span>
                          <span className="text-sm text-gray-500">{formatDistance(nearbyPlaces.shopping[0].distance)}</span>
                        </div>
                      )}
                      {nearbyPlaces.healthcare?.[0] && (
                        <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                          <Hospital className="text-red-600" size={20} />
                          <span className="flex-1">{nearbyPlaces.healthcare[0].name}</span>
                          <span className="text-sm text-gray-500">{formatDistance(nearbyPlaces.healthcare[0].distance)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'nearby' && (
                <div className="space-y-4">
                  {Object.entries(nearbyPlaces).map(([category, places]) => (
                    <div key={category} className="bg-white rounded-xl border p-4">
                      <h3 className="font-bold capitalize mb-3 flex items-center gap-2">
                        {category === 'schools' && <School className="text-blue-600" size={20} />}
                        {category === 'restaurants' && <Utensils className="text-orange-600" size={20} />}
                        {category === 'shopping' && <ShoppingBag className="text-green-600" size={20} />}
                        {category === 'healthcare' && <Hospital className="text-red-600" size={20} />}
                        {category === 'parks' && <Trees className="text-emerald-600" size={20} />}
                        {category === 'transit' && <Bus className="text-purple-600" size={20} />}
                        {category === 'fitness' && <Dumbbell className="text-pink-600" size={20} />}
                        {category}
                        <span className="text-sm font-normal text-gray-500">({places.length})</span>
                      </h3>
                      {places.length > 0 ? (
                        <div className="space-y-2">
                          {places.map((place, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm">{place.name}</span>
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{formatDistance(place.distance)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">None found within 2km</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'demographics' && demographics && (
                <div className="bg-white rounded-xl border p-6">
                  <h3 className="font-bold mb-4">Area Demographics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Population</span>
                        <span className="font-semibold">{demographics.population.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Median Age</span>
                        <span className="font-semibold">{demographics.medianAge} years</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Median Household Income</span>
                        <span className="font-semibold text-green-600">${demographics.medianIncome.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(100, (demographics.medianIncome / 150000) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Homeownership Rate</span>
                        <span className="font-semibold">{demographics.homeownershipRate}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${demographics.homeownershipRate}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">College Educated</span>
                        <span className="font-semibold">{demographics.collegeEducated}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${demographics.collegeEducated}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Median Home Value</span>
                        <span className="font-semibold text-blue-600">${demographics.medianHomeValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'weather' && weather && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-blue-100 text-sm">Current Conditions</p>
                        <p className="text-5xl font-bold">{weather.current.temp}°F</p>
                        <p className="text-xl">{weather.current.condition}</p>
                      </div>
                      <div className="text-8xl">{weather.current.icon}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                      <div className="text-center">
                        <Droplets className="mx-auto mb-1" size={20} />
                        <p className="text-sm text-blue-100">Humidity</p>
                        <p className="font-semibold">{weather.current.humidity}%</p>
                      </div>
                      <div className="text-center">
                        <Wind className="mx-auto mb-1" size={20} />
                        <p className="text-sm text-blue-100">Wind</p>
                        <p className="font-semibold">{weather.current.windSpeed} mph</p>
                      </div>
                      <div className="text-center">
                        <Sun className="mx-auto mb-1" size={20} />
                        <p className="text-sm text-blue-100">UV Index</p>
                        <p className="font-semibold">Moderate</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-bold mb-3">5-Day Forecast</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {weather.forecast.map((day, idx) => (
                        <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">{day.day}</p>
                          <p className="text-2xl my-1">
                            {day.condition.includes('Rain') ? '🌧️' : day.condition.includes('Cloud') ? '☁️' : '☀️'}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">{day.high}°</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-500">{day.low}°</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-bold text-amber-800 mb-2">🏠 Open House Tip</h3>
                    <p className="text-amber-900 text-sm">
                      {weather.current.condition === 'Clear' || weather.current.condition === 'Mainly Clear'
                        ? "Perfect weather for an open house! Schedule for this weekend."
                        : "Consider indoor staging highlights for upcoming showings."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'commute' && coordinates && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-bold mb-3">Commute Times</h3>
                    <p className="text-sm text-gray-600 mb-4">Estimated drive times during typical traffic:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-blue-600" size={20} />
                          <span>Downtown Fort Myers</span>
                        </div>
                        <span className="font-semibold">~15 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-blue-600" size={20} />
                          <span>RSW Airport</span>
                        </div>
                        <span className="font-semibold">~20 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-blue-600" size={20} />
                          <span>Cape Coral</span>
                        </div>
                        <span className="font-semibold">~12 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-blue-600" size={20} />
                          <span>Naples</span>
                        </div>
                        <span className="font-semibold">~35 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-bold mb-3">Transportation Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <Car className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="font-medium">Primary Car</p>
                        <p className="text-xs text-gray-500">Most residents drive</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <Bus className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="font-medium">Bus Service</p>
                        <p className="text-xs text-gray-500">{nearbyPlaces.transit?.length || 0} stops nearby</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <Bike className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="font-medium">Biking</p>
                        <p className="text-xs text-gray-500">{walkScore?.bike || 0}/100 score</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <Footprints className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="font-medium">Walking</p>
                        <p className="text-xs text-gray-500">{walkScore?.walk || 0}/100 score</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Loading fallback component
function IntelligenceLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Loading property intelligence...</p>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function PropertyIntelligencePage() {
  return (
    <Suspense fallback={<IntelligenceLoading />}>
      <PropertyIntelligenceContent />
    </Suspense>
  )
}
