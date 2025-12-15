'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, MapPin, ExternalLink, Loader2, School } from 'lucide-react'

interface School {
  id: number
  name: string
  type: string
  distance: number
  lat: number
  lon: number
}

interface NearbySchoolsProps {
  latitude: number
  longitude: number
  radius?: number // in meters
  className?: string
}

export default function NearbySchools({
  latitude,
  longitude,
  radius = 5000, // 5km default
  className = ''
}: NearbySchoolsProps) {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchools()
  }, [latitude, longitude, radius])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const fetchSchools = async () => {
    try {
      setLoading(true)
      
      // Overpass API query for schools - FREE
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="school"](around:${radius},${latitude},${longitude});
          way["amenity"="school"](around:${radius},${latitude},${longitude});
          node["amenity"="kindergarten"](around:${radius},${latitude},${longitude});
          node["amenity"="college"](around:${radius},${latitude},${longitude});
          node["amenity"="university"](around:${radius},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      })

      if (!response.ok) throw new Error('Failed to fetch schools')

      const data = await response.json()
      
      const schoolList: School[] = data.elements
        .filter((el: any) => el.tags?.name)
        .map((el: any) => ({
          id: el.id,
          name: el.tags.name,
          type: el.tags.amenity === 'kindergarten' ? 'Pre-K' :
                el.tags.amenity === 'university' ? 'University' :
                el.tags.amenity === 'college' ? 'College' :
                el.tags['school:type'] || el.tags.isced || 'School',
          distance: calculateDistance(latitude, longitude, el.lat || el.center?.lat, el.lon || el.center?.lon),
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon
        }))
        .filter((s: School) => s.lat && s.lon)
        .sort((a: School, b: School) => a.distance - b.distance)
        .slice(0, 10) // Limit to 10 nearest

      setSchools(schoolList)
      setError(null)
    } catch (err) {
      console.error('Schools fetch error:', err)
      setError('Unable to load nearby schools')
    } finally {
      setLoading(false)
    }
  }

  const getSchoolTypeColor = (type: string) => {
    const t = type.toLowerCase()
    if (t.includes('pre-k') || t.includes('kindergarten')) return 'bg-pink-100 text-pink-700'
    if (t.includes('elementary') || t.includes('primary')) return 'bg-green-100 text-green-700'
    if (t.includes('middle') || t.includes('junior')) return 'bg-yellow-100 text-yellow-700'
    if (t.includes('high') || t.includes('secondary')) return 'bg-blue-100 text-blue-700'
    if (t.includes('university') || t.includes('college')) return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border p-6 ${className}`}>
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="animate-spin text-blue-600" size={24} />
          <span className="text-gray-600">Finding nearby schools...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border ${className}`}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <GraduationCap className="text-blue-600" size={20} /> Nearby Schools
        </h3>
        <p className="text-sm text-gray-500">Within {(radius/1609).toFixed(1)} miles</p>
      </div>

      {error ? (
        <div className="p-6 text-center text-gray-500">
          <School className="mx-auto mb-2" size={32} />
          <p>{error}</p>
        </div>
      ) : schools.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <School className="mx-auto mb-2" size={32} />
          <p>No schools found nearby</p>
        </div>
      ) : (
        <div className="divide-y">
          {schools.map(school => (
            <div key={school.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{school.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSchoolTypeColor(school.type)}`}>
                      {school.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> {school.distance.toFixed(1)} miles away
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${school.lat},${school.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-xl flex items-center justify-between">
        <span>Data from OpenStreetMap</span>
        <a 
          href={`https://www.greatschools.org/search/search.page?lat=${latitude}&lon=${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View ratings on GreatSchools →
        </a>
      </div>
    </div>
  )
}
