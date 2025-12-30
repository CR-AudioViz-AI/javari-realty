// =============================================================================
// INTENT-BASED SEARCH PAGE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:48 PM EST
// Phase 3: AI as Actions, Not Chat - Persona-driven search
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  ChevronRight,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Loader2,
  Star,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import {
  BuyerPersona,
  PERSONA_PROFILES,
  SearchResult,
  ContextualAction,
  ActionType,
} from '@/types/intent-search';
import { QuickActionBar } from '@/components/search/ContextualActionButton';

export default function IntentSearchPage() {
  const [selectedPersona, setSelectedPersona] = useState<BuyerPersona | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);

  const handlePersonaSelect = (persona: BuyerPersona) => {
    setSelectedPersona(persona);
    setShowPersonaDetails(true);
    
    // Pre-fill search based on persona
    const profile = PERSONA_PROFILES[persona];
    if (persona === 'first_time_buyer') {
      setSearchQuery('Move-in ready homes under $400K with low HOA');
    } else if (persona === 'growing_family') {
      setSearchQuery('4+ bedroom homes near top-rated schools with a yard');
    } else if (persona === 'investor') {
      setSearchQuery('Multi-family or rental properties with positive cash flow');
    } else if (persona === 'downsizer') {
      setSearchQuery('Low maintenance condos or single-story homes');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate demo results based on persona
    const demoResults = generateDemoResults(selectedPersona);
    setResults(demoResults);
    
    // Generate AI summary
    const persona = selectedPersona ? PERSONA_PROFILES[selectedPersona] : null;
    setAiSummary(
      persona 
        ? `Found ${demoResults.length} properties matching your ${persona.name.toLowerCase()} criteria. Top recommendations prioritize ${persona.priority_factors.slice(0, 2).map(f => f.factor.toLowerCase()).join(' and ')}. ${demoResults[0]?.match_reasons[0] || ''}`
        : `Found ${demoResults.length} properties matching your search. Here are the best matches based on your criteria.`
    );
    
    setIsSearching(false);
  };

  const handleAction = useCallback((actionType: ActionType, data?: Record<string, unknown>) => {
    console.log('Action triggered:', actionType, data);
    // Would integrate with backend
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Intent-Based Search</h1>
              <p className="text-gray-600">Find your perfect home with AI-powered matching</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Persona Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">I'm looking as a...</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(PERSONA_PROFILES).slice(0, 5).map(([key, profile]) => (
              <button
                key={key}
                onClick={() => handlePersonaSelect(key as BuyerPersona)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedPersona === key
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-3xl mb-2 block">{profile.icon}</span>
                <span className={`text-sm font-medium ${
                  selectedPersona === key ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {profile.name}
                </span>
              </button>
            ))}
          </div>
          
          {/* More Personas */}
          <details className="mt-3">
            <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-700">
              Show more buyer types...
            </summary>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {Object.entries(PERSONA_PROFILES).slice(5).map(([key, profile]) => (
                <button
                  key={key}
                  onClick={() => handlePersonaSelect(key as BuyerPersona)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedPersona === key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{profile.icon}</span>
                  <span className={`text-xs font-medium block mt-1 ${
                    selectedPersona === key ? 'text-indigo-700' : 'text-gray-600'
                  }`}>
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Persona Details Panel */}
        <AnimatePresence>
          {selectedPersona && showPersonaDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{PERSONA_PROFILES[selectedPersona].icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{PERSONA_PROFILES[selectedPersona].name}</h3>
                      <p className="text-sm text-gray-600">{PERSONA_PROFILES[selectedPersona].description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPersonaDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Priority Factors */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Top Priorities</h4>
                    <div className="space-y-2">
                      {PERSONA_PROFILES[selectedPersona].priority_factors.slice(0, 3).map((factor) => (
                        <div key={factor.factor} className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${factor.weight}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{factor.factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deal Breakers */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Watch Out For</h4>
                    <div className="flex flex-wrap gap-1">
                      {PERSONA_PROFILES[selectedPersona].deal_breakers.slice(0, 3).map((item) => (
                        <span key={item} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                          ✗ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Nice to Haves */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Nice to Have</h4>
                    <div className="flex flex-wrap gap-1">
                      {PERSONA_PROFILES[selectedPersona].nice_to_haves.slice(0, 4).map((item) => (
                        <span key={item} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border p-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Describe what you're looking for in natural language..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  AI Search
                </>
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Price
              <ChevronDown className="h-3 w-3" />
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <Bed className="h-4 w-4" />
              Beds
              <ChevronDown className="h-3 w-3" />
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <Home className="h-4 w-4" />
              Type
              <ChevronDown className="h-3 w-3" />
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 flex items-center gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* AI Summary */}
        <AnimatePresence>
          {aiSummary && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-indigo-900">{aiSummary}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.property_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                {/* Image */}
                <div className="w-72 h-56 bg-gray-200 relative flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Home className="h-12 w-12" />
                  </div>
                  {/* Match Score Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{result.match_score}%</span>
                    <span className="text-xs text-gray-500">match</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${result.price.toLocaleString()}</p>
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {result.address}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Heart className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Share2 className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {result.bedrooms} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {result.bathrooms} baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {result.square_feet.toLocaleString()} sqft
                    </span>
                    <span className="text-sm text-gray-500">{result.property_type}</span>
                  </div>

                  {/* AI Insights */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {result.match_reasons.map((reason, i) => (
                        <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {reason}
                        </span>
                      ))}
                      {result.potential_concerns.slice(0, 1).map((concern, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs">
                          ⚠️ {concern}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Personalized Highlight */}
                  {result.personalized_highlights[0] && (
                    <p className="mt-3 text-sm text-indigo-600 italic">
                      💡 {result.personalized_highlights[0]}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4">
                    <QuickActionBar
                      propertyId={result.property_id}
                      propertyAddress={result.address}
                      actions={result.actions}
                      onAction={handleAction}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!isSearching && results.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
            <p className="text-gray-600">Click "AI Search" to find properties matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to generate demo results
function generateDemoResults(persona: BuyerPersona | null): SearchResult[] {
  const baseResults: SearchResult[] = [
    {
      property_id: 'prop_1',
      address: '123 Oak Street, Downtown',
      price: 385000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1650,
      property_type: 'Single Family',
      photos: [],
      match_score: 94,
      match_reasons: ['Within budget', 'Move-in ready', 'Near top school'],
      potential_concerns: ['HOA $150/mo'],
      personalized_highlights: ['Perfect starter home with room to grow equity'],
      actions: [
        { id: '1', type: 'schedule_tour', label: 'Schedule Tour', icon: 'calendar', description: 'Book a showing', primary: true },
        { id: '2', type: 'calculate_mortgage', label: 'Calculator', icon: 'calculator', description: 'Estimate payment', primary: false },
        { id: '3', type: 'view_schools', label: 'Schools', icon: 'graduation', description: 'View nearby schools', primary: false },
        { id: '4', type: 'contact_agent', label: 'Contact', icon: 'message', description: 'Ask a question', primary: false },
      ],
    },
    {
      property_id: 'prop_2',
      address: '456 Maple Avenue, West Side',
      price: 425000,
      bedrooms: 4,
      bathrooms: 2.5,
      square_feet: 2100,
      property_type: 'Single Family',
      photos: [],
      match_score: 88,
      match_reasons: ['Extra bedroom', 'Large yard', 'Updated kitchen'],
      potential_concerns: ['Slightly over budget'],
      personalized_highlights: ['Great family home in top school district'],
      actions: [
        { id: '1', type: 'schedule_tour', label: 'Schedule Tour', icon: 'calendar', description: 'Book a showing', primary: true },
        { id: '2', type: 'compare', label: 'Compare', icon: 'compare', description: 'Add to comparison', primary: false },
        { id: '3', type: 'neighborhood_report', label: 'Area Info', icon: 'map', description: 'Neighborhood details', primary: false },
      ],
    },
    {
      property_id: 'prop_3',
      address: '789 Pine Court, Suburbs',
      price: 349000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1450,
      property_type: 'Townhouse',
      photos: [],
      match_score: 82,
      match_reasons: ['Below budget', 'Low maintenance', 'New construction'],
      potential_concerns: ['Smaller lot', 'HOA $200/mo'],
      personalized_highlights: ['Turnkey townhome with modern finishes'],
      actions: [
        { id: '1', type: 'schedule_tour', label: 'Schedule Tour', icon: 'calendar', description: 'Book a showing', primary: true },
        { id: '2', type: 'virtual_tour', label: '3D Tour', icon: 'play', description: 'Virtual walkthrough', primary: false },
        { id: '3', type: 'similar_homes', label: 'Similar', icon: 'home', description: 'Find similar homes', primary: false },
      ],
    },
  ];

  // Customize based on persona
  if (persona === 'investor') {
    return baseResults.map(r => ({
      ...r,
      match_reasons: ['8% cap rate', 'Positive cash flow', 'Growing area'],
      personalized_highlights: ['Strong rental demand in this submarket'],
    }));
  }

  if (persona === 'growing_family') {
    return baseResults.map(r => ({
      ...r,
      match_reasons: ['Top-rated schools', 'Large backyard', 'Family neighborhood'],
      personalized_highlights: ['Perfect for growing families - park within walking distance'],
    }));
  }

  return baseResults;
}
