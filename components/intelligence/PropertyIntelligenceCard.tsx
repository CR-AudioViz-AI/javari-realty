// components/intelligence/PropertyIntelligenceCard.tsx (continued)
// Panel sub-components

function DisasterPanel({ data, expanded, onToggle }: { data: any; expanded: boolean; onToggle: () => void }) {
  const getDisasterIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Hurricane': '🌀',
      'Flood': '🌊',
      'Severe Storm': '⛈️',
      'Tornado': '🌪️',
      'Fire': '🔥',
      'Earthquake': '🌍',
      'Snow': '❄️',
      'Drought': '☀️'
    }
    return icons[type] || '⚠️'
  }

  return (
    <div className="border-l-4 border-orange-500">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Disaster History</h3>
            <p className="text-sm text-gray-500">
              {data.totalDisasters} events in {data.yearsAnalyzed} years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Last: {data.lastDisaster 
              ? new Date(data.lastDisaster.declarationDate).getFullYear() 
              : 'N/A'}
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{data.totalDisasters}</p>
              <p className="text-xs text-gray-500">Total Events</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">{data.averageDisastersPerYear}</p>
              <p className="text-xs text-gray-500">Per Year</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-lg font-bold text-gray-700">{getDisasterIcon(data.mostCommonType)}</p>
              <p className="text-xs text-gray-500 truncate">{data.mostCommonType}</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-900">{data.riskAssessment}</p>
          </div>

          {data.floridaSpecificContext && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-900">
                <strong>Florida Context:</strong> {data.floridaSpecificContext}
              </p>
            </div>
          )}

          {/* Disaster Type Breakdown */}
          {Object.keys(data.disastersByType).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">By Type:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.disastersByType).map(([type, count]: [string, any]) => (
                  <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <span>{getDisasterIcon(type)}</span>
                    <span>{type}</span>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Disasters List */}
          {data.disasters.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Recent Events:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.disasters.slice(0, 5).map((disaster: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span>{getDisasterIcon(disaster.type)}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-900 line-clamp-1">{disaster.title}</p>
                        <p className="text-xs text-gray-500">{disaster.type}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(disaster.declarationDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EarthquakePanel({ data, expanded, onToggle }: { data: any; expanded: boolean; onToggle: () => void }) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800 border-green-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="border-l-4 border-amber-500">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Mountain className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Seismic Activity</h3>
            <p className="text-sm text-gray-500">
              {data.totalEvents} events in {data.searchYears} years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(data.riskLevel)}`}>
            {data.riskLevel.toUpperCase()}
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-600">{data.totalEvents}</p>
              <p className="text-xs text-gray-500">Total (M2.5+)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{data.significantEvents}</p>
              <p className="text-xs text-gray-500">M4.0+</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{data.majorEvents}</p>
              <p className="text-xs text-gray-500">M5.0+</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-900">{data.riskExplanation}</p>
          </div>

          {data.recommendations && data.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Recommendations:</p>
              <ul className="space-y-1">
                {data.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.largestEvent && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Largest Event</p>
              <p className="font-semibold text-gray-900">
                M{data.largestEvent.magnitude.toFixed(1)} - {data.largestEvent.place}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(data.largestEvent.time).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EnvironmentPanel({ data, expanded, onToggle }: { data: any; expanded: boolean; onToggle: () => void }) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'elevated': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="border-l-4 border-green-500">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Environmental Assessment</h3>
            <p className="text-sm text-gray-500">
              Within {data.searchRadiusMiles} mile radius
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(data.overallRisk)}`}>
            {data.overallRisk.toUpperCase()}
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{data.superfundSites.length}</p>
              <p className="text-xs text-gray-500">Superfund</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{data.toxicReleaseFacilities.length}</p>
              <p className="text-xs text-gray-500">TRI Sites</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{data.hazardousWasteSites.length}</p>
              <p className="text-xs text-gray-500">RCRA Sites</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-900">{data.riskExplanation}</p>
          </div>

          {data.recommendations && data.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Recommendations:</p>
              <ul className="space-y-1">
                {data.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.closestConcern && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-gray-500 uppercase font-medium mb-1">Closest Facility</p>
              <p className="font-semibold text-gray-900">{data.closestConcern.name}</p>
              <p className="text-sm text-gray-600">
                {data.closestConcern.type} • {data.closestConcern.distance} miles away
              </p>
            </div>
          )}

          <a
            href="https://www.epa.gov/enviro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View EPA Envirofacts
          </a>
        </div>
      )}
    </div>
  )
}

function WeatherPanel({ data, expanded, onToggle }: { data: any; expanded: boolean; onToggle: () => void }) {
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'Extreme': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Severe': return 'bg-red-100 text-red-800 border-red-200'
      case 'Moderate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="border-l-4 border-sky-500">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Cloud className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Current Weather</h3>
            <p className="text-sm text-gray-500">
              {data.location.city}, {data.location.state}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {data.hasActiveAlerts && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              data.hasSevereAlerts ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {data.alerts.length} Alert{data.alerts.length > 1 ? 's' : ''}
            </span>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Active Alerts */}
          {data.alerts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">⚠️ Active Alerts:</p>
              {data.alerts.map((alert: any, idx: number) => (
                <div key={idx} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <p className="font-semibold text-sm">{alert.event}</p>
                  <p className="text-xs mt-1 line-clamp-2">{alert.headline}</p>
                  {alert.expires && (
                    <p className="text-xs mt-1 opacity-75">
                      Expires: {new Date(alert.expires).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current Conditions */}
          {data.currentConditions && (
            <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.currentConditions.temperature}°{data.currentConditions.temperatureUnit}
                  </p>
                  <p className="text-sm text-gray-600">{data.currentConditions.shortForecast}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Wind: {data.currentConditions.windSpeed}</p>
                  <p>{data.currentConditions.windDirection}</p>
                </div>
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          {data.forecast.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Forecast:</p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {data.forecast.slice(0, 7).filter((p: any) => p.isDaytime).map((period: any, idx: number) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 truncate">{period.name}</p>
                    <p className="text-lg font-bold text-gray-900">{period.temperature}°</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{period.shortForecast}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href="https://www.weather.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View on Weather.gov
          </a>
        </div>
      )}
    </div>
  )
}

// Export sub-components for potential reuse
export { FloodPanel, DisasterPanel, EarthquakePanel, EnvironmentPanel, WeatherPanel }
