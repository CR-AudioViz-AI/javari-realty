// app/customer/dashboard/games/price-guess/page.tsx
// Price Guess Game - Guess property prices to learn market values
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Home, 
  DollarSign, 
  Trophy, 
  Flame, 
  ArrowRight,
  Share2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles
} from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  propertyType: string
  image: string
  actualPrice: number
  features: string[]
}

// Demo properties for the game (in production, these would come from MLS API)
const DEMO_PROPERTIES: Property[] = [
  {
    id: '1',
    address: '1234 Palm Beach Blvd',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33901',
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 2015,
    propertyType: 'Single Family',
    image: '/api/placeholder/800/500',
    actualPrice: 425000,
    features: ['Pool', 'Updated Kitchen', 'Corner Lot']
  },
  {
    id: '2',
    address: '567 Ocean View Dr',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33904',
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2020,
    propertyType: 'Single Family',
    image: '/api/placeholder/800/500',
    actualPrice: 575000,
    features: ['Gulf Access', 'Dock', 'Modern Design']
  },
  {
    id: '3',
    address: '890 Sunset Lane',
    city: 'Naples',
    state: 'FL',
    zip: '34102',
    beds: 2,
    baths: 2,
    sqft: 1200,
    yearBuilt: 2018,
    propertyType: 'Condo',
    image: '/api/placeholder/800/500',
    actualPrice: 385000,
    features: ['Beach Access', 'Community Pool', 'Renovated']
  },
  {
    id: '4',
    address: '432 Cypress Creek Rd',
    city: 'Bonita Springs',
    state: 'FL',
    zip: '34135',
    beds: 5,
    baths: 4,
    sqft: 3200,
    yearBuilt: 2022,
    propertyType: 'Single Family',
    image: '/api/placeholder/800/500',
    actualPrice: 895000,
    features: ['New Construction', 'Smart Home', 'Gated Community']
  },
  {
    id: '5',
    address: '789 Marina Way',
    city: 'Fort Myers Beach',
    state: 'FL',
    zip: '33931',
    beds: 3,
    baths: 2,
    sqft: 1600,
    yearBuilt: 2010,
    propertyType: 'Single Family',
    image: '/api/placeholder/800/500',
    actualPrice: 650000,
    features: ['Water View', 'Elevator', 'Hurricane Shutters']
  },
  {
    id: '6',
    address: '234 Garden Grove',
    city: 'Lehigh Acres',
    state: 'FL',
    zip: '33936',
    beds: 3,
    baths: 2,
    sqft: 1400,
    yearBuilt: 2008,
    propertyType: 'Single Family',
    image: '/api/placeholder/800/500',
    actualPrice: 285000,
    features: ['Large Lot', 'Garage', 'Tile Floors']
  }
]

type GameResult = 'correct' | 'high' | 'low' | null

export default function PriceGuessGame() {
  const [property, setProperty] = useState<Property | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState<GameResult>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [usedPropertyIds, setUsedPropertyIds] = useState<string[]>([])

  const loadNewProperty = useCallback(() => {
    // Filter out already used properties
    const availableProperties = DEMO_PROPERTIES.filter(p => !usedPropertyIds.includes(p.id))
    
    // If all properties used, reset
    if (availableProperties.length === 0) {
      setUsedPropertyIds([])
      const randomIndex = Math.floor(Math.random() * DEMO_PROPERTIES.length)
      setProperty(DEMO_PROPERTIES[randomIndex])
      setUsedPropertyIds([DEMO_PROPERTIES[randomIndex].id])
    } else {
      const randomIndex = Math.floor(Math.random() * availableProperties.length)
      const newProperty = availableProperties[randomIndex]
      setProperty(newProperty)
      setUsedPropertyIds(prev => [...prev, newProperty.id])
    }
    
    setGuess('')
    setResult(null)
    setShowHint(false)
  }, [usedPropertyIds])

  useEffect(() => {
    loadNewProperty()
  }, []) // Only run once on mount

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  const parseGuess = (value: string): number => {
    // Remove all non-numeric characters except decimal
    const cleaned = value.replace(/[^0-9]/g, '')
    return parseInt(cleaned) || 0
  }

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and format as currency
    const numericValue = parseGuess(value)
    if (numericValue > 0) {
      setGuess(formatCurrency(numericValue))
    } else {
      setGuess('')
    }
  }

  const submitGuess = () => {
    if (!property || !guess) return

    const guessValue = parseGuess(guess)
    const actual = property.actualPrice
    const tolerance = actual * 0.10 // 10% tolerance

    setGamesPlayed(prev => prev + 1)

    if (Math.abs(guessValue - actual) <= tolerance) {
      // Correct guess!
      setResult('correct')
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }
      
      // Calculate points: base 100 + streak bonus + accuracy bonus
      const accuracyBonus = Math.round((1 - Math.abs(guessValue - actual) / actual) * 50)
      const streakBonus = streak * 10
      const points = 100 + streakBonus + accuracyBonus
      setScore(prev => prev + points)
      setCorrectGuesses(prev => prev + 1)
    } else if (guessValue > actual) {
      setResult('high')
      setStreak(0)
    } else {
      setResult('low')
      setStreak(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !result) {
      submitGuess()
    }
  }

  const resetGame = () => {
    setScore(0)
    setStreak(0)
    setGamesPlayed(0)
    setCorrectGuesses(0)
    setUsedPropertyIds([])
    loadNewProperty()
  }

  const pricePerSqft = property ? Math.round(property.actualPrice / property.sqft) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Price Guess</h1>
                <p className="text-indigo-200 text-sm">How well do you know the market?</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-2xl font-bold">{score}</span>
                </div>
                <p className="text-xs text-indigo-200">Score</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-indigo-300'}`} />
                  <span className="text-2xl font-bold">{streak}</span>
                </div>
                <p className="text-xs text-indigo-200">Streak</p>
              </div>
              <div className="text-center hidden sm:block">
                <span className="text-2xl font-bold">
                  {gamesPlayed > 0 ? Math.round((correctGuesses / gamesPlayed) * 100) : 0}%
                </span>
                <p className="text-xs text-indigo-200">Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {property && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Property Image */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <Home className="w-20 h-20 text-gray-300" />
              </div>
              {/* Property Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
                  {property.propertyType}
                </span>
              </div>
              {/* Streak Badge */}
              {streak > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {streak} Streak!
                  </span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{property.address}</h2>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {showHint ? 'Hide Hint' : 'Need a hint?'}
                </button>
              </div>

              {/* Property Features */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Bed className="w-5 h-5" />
                  <span className="font-medium">{property.beds}</span>
                  <span className="text-sm">Beds</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Bath className="w-5 h-5" />
                  <span className="font-medium">{property.baths}</span>
                  <span className="text-sm">Baths</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Square className="w-5 h-5" />
                  <span className="font-medium">{property.sqft.toLocaleString()}</span>
                  <span className="text-sm">Sq Ft</span>
                </div>
                <div className="text-gray-600">
                  <span className="text-sm">Built </span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
              </div>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {property.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Hint */}
              {showHint && !result && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-indigo-800">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Hint:</strong> The average price per sq ft in {property.city} is around 
                    ${Math.round(pricePerSqft * (0.9 + Math.random() * 0.2))}/sqft for similar properties.
                  </p>
                </div>
              )}

              {/* Guess Input */}
              {!result ? (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    What&apos;s this home worth?
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={guess}
                        onChange={handleGuessChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your guess..."
                        className="w-full pl-10 pr-4 py-4 text-xl font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={submitGuess}
                      disabled={!guess}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                    >
                      Submit
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Result */
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl text-center ${
                    result === 'correct' 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-amber-50 border-2 border-amber-200'
                  }`}>
                    {result === 'correct' ? (
                      <div>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-green-800 mb-1">
                          🎉 Correct!
                        </h3>
                        <p className="text-green-600">
                          You earned {100 + (streak > 1 ? (streak - 1) * 10 : 0)} points!
                        </p>
                      </div>
                    ) : (
                      <div>
                        {result === 'high' ? (
                          <TrendingUp className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        ) : (
                          <TrendingDown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                        )}
                        <h3 className="text-2xl font-bold text-amber-800 mb-1">
                          {result === 'high' ? '📈 Too High!' : '📉 Too Low!'}
                        </h3>
                        <p className="text-amber-600">Keep practicing to learn the market!</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm">Actual Price</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(property.actualPrice)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ${pricePerSqft}/sq ft • Your guess: {guess}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={loadNewProperty}
                      className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold flex items-center justify-center gap-2"
                    >
                      Next Property
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Stats Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600">{gamesPlayed}</p>
              <p className="text-sm text-gray-500">Games Played</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{correctGuesses}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{bestStreak}</p>
              <p className="text-sm text-gray-500">Best Streak</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{score}</p>
              <p className="text-sm text-gray-500">Total Score</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="font-semibold text-indigo-900 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li>• Consider price per square foot - typically $200-400/sqft in SW Florida</li>
            <li>• Water access and gulf views can add 30-50% to property values</li>
            <li>• Newer construction (2020+) commands premium pricing</li>
            <li>• Location matters - Naples prices are typically higher than Lehigh Acres</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
