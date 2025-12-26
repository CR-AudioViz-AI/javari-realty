// components/property/PropertyIntelligenceCard.tsx
// Comprehensive property intelligence display component
// Shows Walk Score, Nearby Amenities, Flood Risk, Environmental Data, and more
// Added: December 25, 2025

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MapPin,
  Footprints,
  Train,
  Bike,
  Droplets,
  Wind,
  AlertTriangle,
  Star,
  Store,
  Coffee,
  ShoppingCart,
  Dumbbell,
  Building,
  Fuel,
  GraduationCap,
  Heart,
  TreePine,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react'

interface PropertyIntelligenceCardProps {
  lat: number
  lng: number
  address?: string
  propertyId?: string
  compact?: boolean
  showAllByDefault?: boolean
}

interface WalkScoreData {
  walkscore: number | null
  walkDescription: string
  transitScore: number | null
  transitDescription: string
  bikeScore: number | null
  bikeDescription: string
  moreInfoUrl: string
}

interface YelpBusiness {
  id: string
  name: string
  rating: number
  reviewCount: number
  price?: string
  distance: number
  categories: Array<{ title: string }>
  imageUrl: string
  url: string
}

interface PropertyIntelligenceData {
  walkScore?: WalkScoreData
  nearbyAmenities?: Record<string, { count: number; topPicks: YelpBusiness[] }>
  nearbyPlaces?: Record<string, { count: number; nearest: any }>
  flood?: {
    floodZone: string
    riskLevel: string
    insuranceRequired: boolean
  }
  environment?: {
    airQuality?: {
      aqi: number
      category: string
    }
  }
  propertyScore: {
    score: number
    grade: string
    summary: string
    factors: Array<{ name: string; impact: number; reason: string }>
  }
}

// Score color helper
function getScoreColor(score: number | null): string {
  if (score === null) return 'bg-gray-400'
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-green-400'
  if (score >= 50) return 'bg-yellow-500'
  if (score >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'bg-green-500 text-white'
  if (grade.startsWith('B')) return 'bg-blue-500 text-white'
  if (grade.startsWith('C')) return 'bg-yellow-500 text-black'
  if (grade.startsWith('D')) return 'bg-orange-500 text-white'
  return 'bg-red-500 text-white'
}

// Category icons
const categoryIcons: Record<string, any> = {
  restaurants: Store,
  grocery: ShoppingCart,
  gyms: Dumbbell,
  coffee: Coffee,
  banks: Building,
  pharmacy: Heart,
  park: TreePine,
  gas_station: Fuel,
  school: GraduationCap,
  transit_station: Train,
}

// Score badge component
function ScoreBadge({
  label,
  score,
  icon: Icon,
  description,
}: {
  label: string
  score: number | null
  icon: any
  description: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${getScoreColor(score)}`}
      >
        <span className="text-lg font-bold text-white">{score ?? 'N/A'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </div>
  )
}

// Amenity card component
function AmenityCard({
  category,
  count,
  topPicks,
}: {
  category: string
  count: number
  topPicks: YelpBusiness[]
}) {
  const [expanded, setExpanded] = useState(false)
  const Icon = categoryIcons[category] || Store

  const formatCategory = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')
  }

  const formatDistance = (meters: number) => {
    const miles = meters / 1609.34
    return miles < 0.1 ? `${Math.round(meters)} m` : `${miles.toFixed(1)} mi`
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">{formatCategory(category)}</p>
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'place' : 'places'} nearby
            </p>
          </div>
        </div>
        {topPicks.length > 0 &&
          (expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ))}
      </button>

      {expanded && topPicks.length > 0 && (
        <div className="border-t divide-y">
          {topPicks.map((biz) => (
            <a
              key={biz.id}
              href={biz.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
            >
              {biz.imageUrl && (
                <img
                  src={biz.imageUrl}
                  alt={biz.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{biz.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {biz.rating}
                  </span>
                  <span>({biz.reviewCount})</span>
                  {biz.price && <span>{biz.price}</span>}
                  <span>• {formatDistance(biz.distance)}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PropertyIntelligenceCard({
  lat,
  lng,
  address,
  propertyId,
  compact = false,
  showAllByDefault = false,
}: PropertyIntelligenceCardProps) {
  const [data, setData] = useState<PropertyIntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/property-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          address,
          toggles: ['all'],
          radius: 1609, // 1 mile
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch property intelligence')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Unknown error')
      }

      setData(result.data ? { ...result.data, propertyScore: result.propertyScore } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lat && lng) {
      fetchData()
    }
  }, [lat, lng, address])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  // Compact view for property cards in lists
  if (compact) {
    return (
      <div className="flex items-center gap-4 py-2">
        {data.walkScore && (
          <div className="flex items-center gap-2">
            <Footprints className="h-4 w-4 text-muted-foreground" />
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(data.walkScore.walkscore)} text-white`}
            >
              {data.walkScore.walkscore ?? 'N/A'}
            </span>
          </div>
        )}
        {data.propertyScore && (
          <Badge className={getGradeColor(data.propertyScore.grade)}>
            {data.propertyScore.grade}
          </Badge>
        )}
        {data.flood && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="h-3 w-3" />
            Zone {data.flood.floodZone}
          </div>
        )}
      </div>
    )
  }

  // Full view
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Property Intelligence</CardTitle>
          </div>
          {data.propertyScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall:</span>
              <Badge className={`text-lg px-3 py-1 ${getGradeColor(data.propertyScore.grade)}`}>
                {data.propertyScore.grade}
              </Badge>
              <span className="text-sm font-medium">{data.propertyScore.score}/100</span>
            </div>
          )}
        </div>
        {data.propertyScore && (
          <p className="text-sm text-muted-foreground mt-2">{data.propertyScore.summary}</p>
        )}
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="walkability"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Walkability
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Nearby
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Risk Factors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-4">
          {/* Walk Scores Summary */}
          {data.walkScore && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ScoreBadge
                label="Walk Score"
                score={data.walkScore.walkscore}
                icon={Footprints}
                description={data.walkScore.walkDescription}
              />
              <ScoreBadge
                label="Transit Score"
                score={data.walkScore.transitScore}
                icon={Train}
                description={data.walkScore.transitDescription}
              />
              <ScoreBadge
                label="Bike Score"
                score={data.walkScore.bikeScore}
                icon={Bike}
                description={data.walkScore.bikeDescription}
              />
            </div>
          )}

          {/* Score Factors */}
          {data.propertyScore?.factors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Score Factors</h4>
              {data.propertyScore.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className={`w-8 text-right font-medium ${
                      factor.impact > 0
                        ? 'text-green-500'
                        : factor.impact < 0
                          ? 'text-red-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {factor.impact > 0 ? '+' : ''}
                    {factor.impact}
                  </span>
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-muted-foreground flex-1 truncate">{factor.reason}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="walkability" className="p-4">
          {data.walkScore ? (
            <div className="space-y-6">
              {/* Detailed Walk Score */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(data.walkScore.walkscore)}`}
                >
                  <span className="text-3xl font-bold text-white">
                    {data.walkScore.walkscore ?? 'N/A'}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold">Walk Score®</h3>
                <p className="text-sm text-muted-foreground">{data.walkScore.walkDescription}</p>
                <a
                  href={data.walkScore.moreInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                >
                  View on Walk Score
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Transit & Bike */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(data.walkScore.transitScore)}`}
                  >
                    <span className="text-xl font-bold text-white">
                      {data.walkScore.transitScore ?? 'N/A'}
                    </span>
                  </div>
                  <h4 className="mt-2 font-medium text-sm">Transit Score</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.walkScore.transitDescription}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(data.walkScore.bikeScore)}`}
                  >
                    <span className="text-xl font-bold text-white">
                      {data.walkScore.bikeScore ?? 'N/A'}
                    </span>
                  </div>
                  <h4 className="mt-2 font-medium text-sm">Bike Score</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.walkScore.bikeDescription}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Walk Score data not available for this location
            </p>
          )}
        </TabsContent>

        <TabsContent value="amenities" className="p-4">
          {data.nearbyAmenities && Object.keys(data.nearbyAmenities).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.nearbyAmenities).map(([category, { count, topPicks }]) => (
                <AmenityCard key={category} category={category} count={count} topPicks={topPicks} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No nearby amenities data available
            </p>
          )}
        </TabsContent>

        <TabsContent value="risk" className="p-4 space-y-4">
          {/* Flood Risk */}
          {data.flood && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Flood Risk</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium">{data.flood.floodZone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className="font-medium">{data.flood.riskLevel}</p>
                </div>
              </div>
              {data.flood.insuranceRequired && (
                <Badge variant="destructive" className="mt-2">
                  Flood Insurance Required
                </Badge>
              )}
            </div>
          )}

          {/* Air Quality */}
          {data.environment?.airQuality && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Air Quality</h4>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-lg ${
                    data.environment.airQuality.aqi <= 50
                      ? 'bg-green-100 text-green-700'
                      : data.environment.airQuality.aqi <= 100
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  <span className="text-2xl font-bold">{data.environment.airQuality.aqi}</span>
                  <span className="text-sm ml-1">AQI</span>
                </div>
                <div>
                  <p className="font-medium">{data.environment.airQuality.category}</p>
                  <p className="text-sm text-muted-foreground">Air Quality Index</p>
                </div>
              </div>
            </div>
          )}

          {!data.flood && !data.environment?.airQuality && (
            <p className="text-center text-muted-foreground py-8">No risk data available</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="border-t p-3 bg-muted/20">
        <Button variant="ghost" size="sm" onClick={fetchData} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </Card>
  )
}
