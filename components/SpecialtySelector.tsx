// components/SpecialtySelector.tsx
// Client Component for Selecting Agent Specialties

'use client'

import { useState } from 'react'
import { CheckCircle, Circle, TrendingUp } from 'lucide-react'

interface Specialty {
  id: string
  name: string
  description: string
  market: string
  icon: string
}

interface SpecialtySelectorProps {
  specialties: Specialty[]
  currentSpecialties: string[]
  userId: string
}

export default function SpecialtySelector({ specialties, currentSpecialties, userId }: SpecialtySelectorProps) {
  const [selected, setSelected] = useState<string[]>(currentSpecialties || [])
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const toggleSpecialty = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      if (selected.length >= 5) {
        alert('Maximum 5 specialties allowed')
        return
      }
      setSelected([...selected, id])
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/agent/specialties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          specialties: selected
        })
      })

      if (response.ok) {
        setSaveMessage('✅ Specialties saved! You\'ll now receive leads in these markets.')
      } else {
        setSaveMessage('❌ Failed to save. Please try again.')
      }
    } catch (error) {
      setSaveMessage('❌ Error saving specialties.')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedMarketValue = specialties
    .filter(s => selected.includes(s.id))
    .reduce((sum, s) => sum + parseFloat(s.market.replace(/[^0-9.]/g, '')), 0)

  return (
    <div>
      {/* Selection Counter */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Selected Specialties</div>
            <div className="text-3xl font-bold">
              {selected.length} <span className="text-lg text-gray-400">/ 5 maximum</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Your Market Potential</div>
            <div className="text-3xl font-bold text-emerald-600">
              ${selectedMarketValue.toFixed(0)}M
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || selected.length === 0}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Specialties'}
          </button>
        </div>
        {saveMessage && (
          <div className="mt-4 text-center font-semibold">{saveMessage}</div>
        )}
      </div>

      {/* Specialty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.map((specialty) => {
          const isSelected = selected.includes(specialty.id)
          
          return (
            <button
              key={specialty.id}
              onClick={() => toggleSpecialty(specialty.id)}
              className={`
                relative p-6 rounded-xl text-left transition-all transform hover:scale-105
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl' 
                  : 'bg-white border-2 border-gray-200 hover:border-blue-600 shadow-lg'
                }
              `}
            >
              {/* Selection Indicator */}
              <div className="absolute top-4 right-4">
                {isSelected ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4">{specialty.icon}</div>

              {/* Name */}
              <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {specialty.name}
              </h3>

              {/* Description */}
              <p className={`text-sm mb-4 ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                {specialty.description}
              </p>

              {/* Market Size */}
              <div className={`flex items-center ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">{specialty.market} Market</span>
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute bottom-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                  ACTIVE
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Pro Tips:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Start with 2-3 specialties you know well</li>
          <li>• Larger markets = more leads, but also more competition</li>
          <li>• Niche markets = fewer leads, but higher conversion rates</li>
          <li>• You can change your specialties anytime</li>
          <li>• Leads route to you automatically based on property tags</li>
        </ul>
      </div>
    </div>
  )
}
