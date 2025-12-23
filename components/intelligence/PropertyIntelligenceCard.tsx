// components/intelligence/PropertyIntelligenceCard.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield, Droplets, AlertTriangle, Mountain, Cloud, 
  Leaf, ChevronDown, ChevronUp, Download, Share2, 
  ExternalLink, Loader2, Info, CheckCircle, RefreshCw
} from 'lucide-react'

interface PropertyIntelligenceCardProps {
  address: string
  lat: number
  lng: number
  fipsCode?: string
  censusTract?: string
  onDataLoaded?: (data: any) => void
}

interface Toggle {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
}

const TOGGLES: Toggle[] = [
  { id: 'flood', label: 'Flood Risk', icon: Droplets, color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { id: 'disasters', label: 'Disasters', icon: AlertTriangle, color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-300' },
  { id: 'earthquakes', label: 'Earthquakes', icon: Mountain, color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-300' },
  { id: 'environment', label: 'Environment', icon: Leaf, color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { id: 'weather', label: 'Weather', icon: Cloud, color: 'text-sky-700', bgColor: 'bg-sky-100', borderColor: 'border-sky-300' },
]

export default function PropertyIntelligenceCard({
  address, lat, lng, fipsCode, onDataLoaded
}: PropertyIntelligenceCardProps) {
  const [activeToggles, setActiveToggles] = useState<string[]>(['flood'])
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['flood'])
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleActive = useCallback((id: string) => {
    setActiveToggles(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }, [])

  const toggleExpanded = useCallback((id: string) => {
    setExpandedPanels(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }, [])

  const fetchData = useCallback(async () => {
    if (activeToggles.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/property-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, toggles: activeToggles, fipsCode })
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Unknown error')
      setData(result)
      onDataLoaded?.(result)
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [activeToggles, lat, lng, fipsCode, onDataLoaded])

  useEffect(() => { fetchData() }, [fetchData])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5" />
              <span className="text-blue-100 text-sm font-medium">Property Intelligence Report</span>
            </div>
            <h2 className="text-xl font-bold">{address}</h2>
            <p className="text-blue-100 text-sm mt-1">Powered by FEMA, EPA, USGS, NWS</p>
          </div>
          {data?.propertyScore && (
            <div className="text-center ml-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(data.propertyScore.score)}`}>
                <span className="text-3xl font-bold">{data.propertyScore.grade}</span>
              </div>
              <p className="text-sm mt-1 text-blue-100">{data.propertyScore.score}/100</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-gray-400" />
          <p className="text-sm text-gray-600">Select data layers:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((toggle) => {
            const isActive = activeToggles.includes(toggle.id)
            const Icon = toggle.icon
            return (
              <button
                key={toggle.id}
                onClick={() => toggleActive(toggle.id)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? `${toggle.bgColor} ${toggle.color} border-2 ${toggle.borderColor}`
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                } ${loading ? 'opacity-50' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{toggle.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-12 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Analyzing property intelligence...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-6 bg-red-50 border-b">
          <p className="font-medium text-red-800">Error: {error}</p>
          <button onClick={fetchData} className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}

      {/* Data Panels */}
      {!loading && data && (
        <div className="divide-y divide-gray-100">
          {activeToggles.includes('flood') && data.data?.flood && (
            <DataPanel
              title="Flood Risk Assessment"
              subtitle={`Zone ${data.data.flood.floodZone}`}
              icon={Droplets}
              iconColor="text-blue-600"
              borderColor="border-blue-500"
              riskLevel={data.data.flood.riskLevel}
              expanded={expandedPanels.includes('flood')}
              onToggle={() => toggleExpanded('flood')}
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Flood Zone</p>
                  <p className="font-bold text-xl">{data.data.flood.floodZone}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Insurance Required</p>
                  <p className="font-bold text-xl">{data.data.flood.insuranceRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900 whitespace-pre-line">{data.data.flood.explanation}</p>
              </div>
              <a href={data.data.flood.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mt-4">
                <ExternalLink className="w-4 h-4" /> View on FEMA
              </a>
            </DataPanel>
          )}

          {activeToggles.includes('disasters') && data.data?.disasters && (
            <DataPanel
              title="Disaster History"
              subtitle={`${data.data.disasters.totalDisasters} events in ${data.data.disasters.yearsAnalyzed} years`}
              icon={AlertTriangle}
              iconColor="text-orange-600"
              borderColor="border-orange-500"
              expanded={expandedPanels.includes('disasters')}
              onToggle={() => toggleExpanded('disasters')}
            >
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">{data.data.disasters.totalDisasters}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">{data.data.disasters.averageDisastersPerYear}</p>
                  <p className="text-xs text-gray-500">Per Year</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-bold">{data.data.disasters.mostCommonType}</p>
                  <p className="text-xs text-gray-500">Most Common</p>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-900">{data.data.disasters.riskAssessment}</p>
              </div>
            </DataPanel>
          )}

          {activeToggles.includes('earthquakes') && data.data?.earthquakes && (
            <DataPanel
              title="Seismic Activity"
              subtitle={`${data.data.earthquakes.totalEvents} events in ${data.data.earthquakes.searchYears} years`}
              icon={Mountain}
              iconColor="text-amber-600"
              borderColor="border-amber-500"
              riskLevel={data.data.earthquakes.riskLevel}
              expanded={expandedPanels.includes('earthquakes')}
              onToggle={() => toggleExpanded('earthquakes')}
            >
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-900">{data.data.earthquakes.riskExplanation}</p>
              </div>
            </DataPanel>
          )}

          {activeToggles.includes('environment') && data.data?.environment && (
            <DataPanel
              title="Environmental Assessment"
              subtitle={`Within ${data.data.environment.searchRadiusMiles} mile radius`}
              icon={Leaf}
              iconColor="text-green-600"
              borderColor="border-green-500"
              riskLevel={data.data.environment.overallRisk}
              expanded={expandedPanels.includes('environment')}
              onToggle={() => toggleExpanded('environment')}
            >
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{data.data.environment.superfundSites.length}</p>
                  <p className="text-xs text-gray-500">Superfund</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">{data.data.environment.toxicReleaseFacilities.length}</p>
                  <p className="text-xs text-gray-500">TRI Sites</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{data.data.environment.hazardousWasteSites.length}</p>
                  <p className="text-xs text-gray-500">RCRA</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-900">{data.data.environment.riskExplanation}</p>
              </div>
            </DataPanel>
          )}

          {activeToggles.includes('weather') && data.data?.weather && (
            <DataPanel
              title="Current Weather"
              subtitle={`${data.data.weather.location.city}, ${data.data.weather.location.state}`}
              icon={Cloud}
              iconColor="text-sky-600"
              borderColor="border-sky-500"
              expanded={expandedPanels.includes('weather')}
              onToggle={() => toggleExpanded('weather')}
              badge={data.data.weather.hasActiveAlerts ? `${data.data.weather.alerts.length} Alert${data.data.weather.alerts.length > 1 ? 's' : ''}` : undefined}
              badgeColor={data.data.weather.hasSevereAlerts ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
            >
              {data.data.weather.alerts.length > 0 && (
                <div className="space-y-2 mb-4">
                  {data.data.weather.alerts.slice(0, 3).map((alert: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="font-semibold text-sm text-red-800">{alert.event}</p>
                      <p className="text-xs text-red-600 mt-1">{alert.headline}</p>
                    </div>
                  ))}
                </div>
              )}
              {data.data.weather.forecast.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {data.data.weather.forecast.slice(0, 4).map((p: any, idx: number) => (
                    <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium truncate">{p.name}</p>
                      <p className="text-lg font-bold">{p.temperature}°</p>
                    </div>
                  ))}
                </div>
              )}
            </DataPanel>
          )}
        </div>
      )}

      {/* Score Summary */}
      {data?.propertyScore && !loading && (
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" /> Property Score Summary
          </h3>
          <p className="text-gray-600 text-sm mb-4">{data.propertyScore.summary}</p>
          {data.propertyScore.factors.length > 0 && (
            <div className="space-y-2">
              {data.propertyScore.factors.map((f: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${f.impact < 0 ? 'text-amber-500' : 'text-green-500'}`} />
                    <span>{f.name}</span>
                  </div>
                  <span className={`font-semibold ${f.impact < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {f.impact > 0 ? '+' : ''}{f.impact}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 bg-white border-t flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Download className="w-4 h-4" /> Download Report
        </button>
        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Share2 className="w-4 h-4" />
        </button>
        <button onClick={fetchData} disabled={loading} className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}

// Reusable panel component
function DataPanel({
  title, subtitle, icon: Icon, iconColor, borderColor, riskLevel, expanded, onToggle, badge, badgeColor, children
}: {
  title: string
  subtitle: string
  icon: React.ElementType
  iconColor: string
  borderColor: string
  riskLevel?: string
  expanded: boolean
  onToggle: () => void
  badge?: string
  badgeColor?: string
  children: React.ReactNode
}) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'minimal': case 'low': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'elevated': case 'high': return 'bg-orange-100 text-orange-800'
      case 'very-high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`border-l-4 ${borderColor}`}>
      <button onClick={onToggle} className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconColor.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {riskLevel && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskLevel)}`}>
              {riskLevel.replace('-', ' ').toUpperCase()}
            </span>
          )}
          {badge && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>{badge}</span>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
