'use client'

import { useEffect, useState } from 'react'
import { Settings, ToggleLeft, ToggleRight, Shield, TrendingUp, Info } from 'lucide-react'

interface Feature {
  id: string
  name: string
  display_name: string
  description: string
  category: string
  is_social_impact: boolean
  social_impact_type: string | null
  is_enabled: boolean
}

interface FeaturesByCategory {
  [category: string]: Feature[]
}

export default function FeatureTogglesPage() {
  const [features, setFeatures] = useState<FeaturesByCategory>({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features')
      const data = await response.json()
      
      // Group features by category
      const grouped: FeaturesByCategory = {}
      data.features.forEach((feature: Feature) => {
        if (!grouped[feature.category]) {
          grouped[feature.category] = []
        }
        grouped[feature.category].push(feature)
      })
      
      setFeatures(grouped)
    } catch (error) {
      console.error('Failed to load features:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeature = async (featureId: string, currentState: boolean) => {
    setUpdating(featureId)
    try {
      const response = await fetch('/api/admin/features/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId,
          enabled: !currentState,
        }),
      })

      if (response.ok) {
        // Update local state
        setFeatures((prev) => {
          const updated = { ...prev }
          Object.keys(updated).forEach((category) => {
            updated[category] = updated[category].map((f) =>
              f.id === featureId ? { ...f, is_enabled: !currentState } : f
            )
          })
          return updated
        })
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error)
    } finally {
      setUpdating(null)
    }
  }

  const categoryNames: { [key: string]: string } = {
    property_search: 'Property Search',
    mls_integration: 'MLS Integration',
    market_analytics: 'Market Analytics',
    mortgage_calculator: 'Mortgage Calculator',
    agent_matching: 'Agent Matching',
    virtual_tours: 'Virtual Tours',
    document_management: 'Document Management',
    transaction_coordination: 'Transaction Coordination',
    crm: 'CRM System',
    lead_generation: 'Lead Generation',
    social_impact_module: 'Social Impact Modules',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Platform Feature Toggles
              </h2>
            </div>
            <p className="text-gray-600">
              Control which features are available platform-wide. Disabling a feature here
              will disable it for all brokers, offices, and realtors.
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Hierarchical Toggle System</p>
              <p>
                Platform → Broker → Office → Realtor. Features must be enabled at each
                level for users to access them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature categories */}
      {Object.entries(features).map(([category, categoryFeatures]) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {categoryNames[category] || category}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {categoryFeatures.filter((f) => f.is_enabled).length} of{' '}
              {categoryFeatures.length} enabled
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {categoryFeatures.map((feature) => (
              <div
                key={feature.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">
                        {feature.display_name}
                      </h4>
                      {feature.is_social_impact && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Social Impact
                        </span>
                      )}
                    </div>
                    {feature.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    )}
                    {feature.social_impact_type && (
                      <p className="text-xs text-gray-500 mt-1">
                        Module: {feature.social_impact_type.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFeature(feature.id, feature.is_enabled)}
                    disabled={updating === feature.id}
                    className={`ml-4 flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      feature.is_enabled
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${updating === feature.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updating === feature.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : feature.is_enabled ? (
                      <>
                        <ToggleRight className="w-5 h-5 mr-2" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 mr-2" />
                        Disabled
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Usage analytics preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Feature Usage Analytics
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Track how features are being used across the platform.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          View Full Analytics
        </button>
      </div>
    </div>
  )
}
