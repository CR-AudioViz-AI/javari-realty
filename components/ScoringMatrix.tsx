'use client';

import React, { useState, useEffect } from 'react';
import { 
  ScoringPreferences, 
  ScoringFactor, 
  ScoringCategory,
  DEFAULT_SCORING_FACTORS,
  SCORING_PRESETS 
} from '@/types/scoring';

interface ScoringMatrixProps {
  preferences: ScoringPreferences;
  onPreferencesChange: (preferences: ScoringPreferences) => void;
  onSave?: () => void;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<ScoringCategory, string> = {
  location: '📍 Location',
  property: '🏠 Property',
  financial: '💰 Financial',
  lifestyle: '🌟 Lifestyle',
  safety: '🛡️ Safety',
  schools: '🎓 Schools',
  environment: '🌿 Environment',
  amenities: '✨ Amenities',
};

const CATEGORY_COLORS: Record<ScoringCategory, string> = {
  location: 'bg-blue-50 border-blue-200',
  property: 'bg-purple-50 border-purple-200',
  financial: 'bg-green-50 border-green-200',
  lifestyle: 'bg-pink-50 border-pink-200',
  safety: 'bg-red-50 border-red-200',
  schools: 'bg-yellow-50 border-yellow-200',
  environment: 'bg-emerald-50 border-emerald-200',
  amenities: 'bg-indigo-50 border-indigo-200',
};

export function ScoringMatrix({ 
  preferences, 
  onPreferencesChange, 
  onSave,
  compact = false 
}: ScoringMatrixProps) {
  const [activeCategory, setActiveCategory] = useState<ScoringCategory | 'all'>('all');
  const [hasChanges, setHasChanges] = useState(false);

  const categories = Array.from(
    new Set(preferences.factors.map(f => f.category))
  ) as ScoringCategory[];

  const filteredFactors = activeCategory === 'all' 
    ? preferences.factors 
    : preferences.factors.filter(f => f.category === activeCategory);

  const updateFactor = (factorId: string, updates: Partial<ScoringFactor>) => {
    const updatedFactors = preferences.factors.map(f => 
      f.id === factorId ? { ...f, ...updates } : f
    );
    onPreferencesChange({
      ...preferences,
      factors: updatedFactors,
      preset: 'custom',
      updated_at: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const applyPreset = (presetName: string) => {
    const preset = SCORING_PRESETS[presetName as keyof typeof SCORING_PRESETS];
    if (!preset) return;

    const updatedFactors = preferences.factors.map(factor => {
      const override = preset.find(p => p.id === factor.id);
      return override ? { ...factor, ...override } : factor;
    });

    onPreferencesChange({
      ...preferences,
      factors: updatedFactors,
      preset: presetName as ScoringPreferences['preset'],
      updated_at: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    onPreferencesChange({
      ...preferences,
      factors: DEFAULT_SCORING_FACTORS,
      preset: 'custom',
      updated_at: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  const enabledCount = preferences.factors.filter(f => f.enabled).length;
  const totalWeight = preferences.factors
    .filter(f => f.enabled)
    .reduce((sum, f) => sum + f.weight, 0);

  return (
    <div className={`bg-white rounded-xl shadow-lg ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Scoring Matrix</h2>
          <p className="text-gray-600 text-sm mt-1">
            Define what matters most to you. Properties will be scored based on your preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {enabledCount} factors active • Total weight: {totalWeight}
          </span>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'family', label: '👨‍👩‍👧‍👦 Family', desc: 'Schools, safety, space' },
            { id: 'investor', label: '📈 Investor', desc: 'ROI, appreciation' },
            { id: 'retiree', label: '🏖️ Retiree', desc: 'Walkability, quiet' },
            { id: 'first-time', label: '🔑 First-Time', desc: 'Budget, commute' },
            { id: 'luxury', label: '💎 Luxury', desc: 'Size, amenities' },
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                preferences.preset === preset.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{preset.label}</span>
              <span className="text-xs text-gray-500 block">{preset.desc}</span>
            </button>
          ))}
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-400 text-gray-600"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({preferences.factors.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_LABELS[cat]} ({preferences.factors.filter(f => f.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Factors Grid */}
      <div className="space-y-3">
        {filteredFactors.map(factor => (
          <FactorRow
            key={factor.id}
            factor={factor}
            onUpdate={(updates) => updateFactor(factor.id, updates)}
            compact={compact}
          />
        ))}
      </div>

      {/* Save Button */}
      {onSave && hasChanges && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              onSave();
              setHasChanges(false);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}

interface FactorRowProps {
  factor: ScoringFactor;
  onUpdate: (updates: Partial<ScoringFactor>) => void;
  compact?: boolean;
}

function FactorRow({ factor, onUpdate, compact }: FactorRowProps) {
  return (
    <div 
      className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
        factor.enabled 
          ? CATEGORY_COLORS[factor.category]
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      {/* Enable Toggle */}
      <button
        onClick={() => onUpdate({ enabled: !factor.enabled })}
        className={`w-10 h-6 rounded-full transition-colors relative ${
          factor.enabled ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
      >
        <span 
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            factor.enabled ? 'left-5' : 'left-1'
          }`}
        />
      </button>

      {/* Factor Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{factor.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            {factor.category}
          </span>
        </div>
        {!compact && (
          <p className="text-sm text-gray-500 truncate">{factor.description}</p>
        )}
      </div>

      {/* Weight Slider */}
      <div className="flex items-center gap-3 w-48">
        <input
          type="range"
          min="1"
          max="10"
          value={factor.weight}
          onChange={(e) => onUpdate({ weight: parseInt(e.target.value) })}
          disabled={!factor.enabled}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
        />
        <span className={`w-8 text-center font-bold text-lg ${
          factor.enabled ? 'text-indigo-600' : 'text-gray-400'
        }`}>
          {factor.weight}
        </span>
      </div>
    </div>
  );
}

export default ScoringMatrix;
