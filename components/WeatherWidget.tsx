'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Loader2 } from 'lucide-react'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  description: string
}

interface WeatherWidgetProps {
  latitude: number
  longitude: number
  date?: string // For future weather (open house date)
  className?: string
  compact?: boolean
}

const WEATHER_CODES: Record<number, { icon: any; description: string }> = {
  0: { icon: Sun, description: 'Clear sky' },
  1: { icon: Sun, description: 'Mainly clear' },
  2: { icon: Cloud, description: 'Partly cloudy' },
  3: { icon: Cloud, description: 'Overcast' },
  45: { icon: Cloud, description: 'Foggy' },
  48: { icon: Cloud, description: 'Depositing rime fog' },
  51: { icon: CloudRain, description: 'Light drizzle' },
  53: { icon: CloudRain, description: 'Moderate drizzle' },
  55: { icon: CloudRain, description: 'Dense drizzle' },
  61: { icon: CloudRain, description: 'Slight rain' },
  63: { icon: CloudRain, description: 'Moderate rain' },
  65: { icon: CloudRain, description: 'Heavy rain' },
  71: { icon: CloudSnow, description: 'Slight snow' },
  73: { icon: CloudSnow, description: 'Moderate snow' },
  75: { icon: CloudSnow, description: 'Heavy snow' },
  80: { icon: CloudRain, description: 'Rain showers' },
  81: { icon: CloudRain, description: 'Moderate rain showers' },
  82: { icon: CloudRain, description: 'Violent rain showers' },
  95: { icon: CloudRain, description: 'Thunderstorm' },
}

export default function WeatherWidget({
  latitude,
  longitude,
  date,
  className = '',
  compact = false
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeather()
  }, [latitude, longitude, date])

  const fetchWeather = async () => {
    if (!latitude || !longitude) {
      setError('No location provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Open-Meteo API is 100% FREE - no API key needed!
      // Supports current weather and 16-day forecast
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        timezone: 'America/New_York'
      })

      // If date is provided and in the future, get forecast
      if (date) {
        params.append('daily', 'temperature_2m_max,temperature_2m_min,weather_code')
        params.append('start_date', date)
        params.append('end_date', date)
      }

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      
      if (!response.ok) throw new Error('Weather API error')
      
      const data = await response.json()

      if (date && data.daily) {
        // Future date weather
        const weatherInfo = WEATHER_CODES[data.daily.weather_code[0]] || WEATHER_CODES[0]
        setWeather({
          temperature: Math.round((data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2),
          humidity: 0, // Not available in daily
          windSpeed: 0,
          weatherCode: data.daily.weather_code[0],
          description: weatherInfo.description
        })
      } else if (data.current) {
        // Current weather
        const weatherInfo = WEATHER_CODES[data.current.weather_code] || WEATHER_CODES[0]
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          description: weatherInfo.description
        })
      }
      
      setError(null)
    } catch (err) {
      setError('Unable to load weather')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading weather...</span>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-gray-500 text-center ${className}`}>
        <Cloud className="mx-auto mb-1" size={24} />
        <p className="text-sm">{error || 'Weather unavailable'}</p>
      </div>
    )
  }

  const WeatherIcon = WEATHER_CODES[weather.weatherCode]?.icon || Cloud

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <WeatherIcon size={20} className="text-blue-500" />
        <span className="font-medium">{weather.temperature}°F</span>
        <span className="text-gray-500 text-sm">{weather.description}</span>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm mb-1">
            {date ? `Forecast for ${new Date(date).toLocaleDateString()}` : 'Current Weather'}
          </p>
          <div className="flex items-center gap-3">
            <WeatherIcon size={48} />
            <div>
              <p className="text-4xl font-bold">{weather.temperature}°F</p>
              <p className="text-blue-100">{weather.description}</p>
            </div>
          </div>
        </div>
        
        {!date && (
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <Droplets size={16} className="text-blue-200" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Wind size={16} className="text-blue-200" />
              <span>{weather.windSpeed} mph</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Open House Advisory */}
      {weather.temperature > 85 && (
        <div className="mt-3 pt-3 border-t border-blue-400 text-sm">
          ☀️ Hot day! Consider providing water for visitors.
        </div>
      )}
      {weather.weatherCode >= 51 && weather.weatherCode <= 82 && (
        <div className="mt-3 pt-3 border-t border-blue-400 text-sm">
          🌧️ Rain expected. Prepare floor mats and consider rescheduling.
        </div>
      )}
    </div>
  )
}
