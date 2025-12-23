// app/customer/dashboard/games/flip-or-flop/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Home, DollarSign, TrendingUp, TrendingDown, Trophy, 
  Star, Clock, CheckCircle, XCircle, RotateCcw, ArrowRight,
  Hammer, Paintbrush, Wrench, AlertTriangle, Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface Property {
  id: number
  address: string
  city: string
  image: string
  purchasePrice: number
  rehabCost: number
  afterRepairValue: number
  holdingCosts: number
  sellingCosts: number
  timeToFlip: string
  condition: 'poor' | 'fair' | 'good'
  issues: string[]
  improvements: string[]
  neighborhood: 'declining' | 'stable' | 'improving'
  marketTrend: 'hot' | 'normal' | 'cold'
}

const FLIP_PROPERTIES: Property[] = [
  {
    id: 1,
    address: '4521 Palm Beach Blvd',
    city: 'Fort Myers, FL',
    image: '/placeholder-house-1.jpg',
    purchasePrice: 185000,
    rehabCost: 45000,
    afterRepairValue: 295000,
    holdingCosts: 8500,
    sellingCosts: 17700,
    timeToFlip: '4-5 months',
    condition: 'poor',
    issues: ['Roof damage', 'Outdated kitchen', 'Foundation cracks', 'Old electrical'],
    improvements: ['New roof', 'Kitchen remodel', 'Foundation repair', 'Electrical update'],
    neighborhood: 'improving',
    marketTrend: 'hot'
  },
  {
    id: 2,
    address: '892 Coral Way',
    city: 'Cape Coral, FL',
    image: '/placeholder-house-2.jpg',
    purchasePrice: 220000,
    rehabCost: 85000,
    afterRepairValue: 340000,
    holdingCosts: 12000,
    sellingCosts: 20400,
    timeToFlip: '6-7 months',
    condition: 'poor',
    issues: ['Hurricane damage', 'Mold issues', 'Pool needs resurfacing', 'HVAC replacement'],
    improvements: ['Storm repairs', 'Mold remediation', 'Pool restoration', 'New HVAC'],
    neighborhood: 'stable',
    marketTrend: 'normal'
  },
  {
    id: 3,
    address: '1567 Gulf Shore Dr',
    city: 'Naples, FL',
    image: '/placeholder-house-3.jpg',
    purchasePrice: 425000,
    rehabCost: 55000,
    afterRepairValue: 580000,
    holdingCosts: 15000,
    sellingCosts: 34800,
    timeToFlip: '3-4 months',
    condition: 'fair',
    issues: ['Cosmetic updates needed', 'Outdated bathrooms', 'Landscaping overgrown'],
    improvements: ['Paint & flooring', 'Bathroom updates', 'Landscaping', 'Staging'],
    neighborhood: 'improving',
    marketTrend: 'hot'
  },
  {
    id: 4,
    address: '3344 Sunset Terrace',
    city: 'Lehigh Acres, FL',
    image: '/placeholder-house-4.jpg',
    purchasePrice: 125000,
    rehabCost: 95000,
    afterRepairValue: 225000,
    holdingCosts: 10000,
    sellingCosts: 13500,
    timeToFlip: '5-6 months',
    condition: 'poor',
    issues: ['Major water damage', 'Termite damage', 'No central AC', 'Needs permits'],
    improvements: ['Complete renovation', 'Termite treatment', 'Install HVAC', 'Permit work'],
    neighborhood: 'declining',
    marketTrend: 'cold'
  },
  {
    id: 5,
    address: '7892 Bayfront Ave',
    city: 'Bonita Springs, FL',
    image: '/placeholder-house-5.jpg',
    purchasePrice: 375000,
    rehabCost: 35000,
    afterRepairValue: 465000,
    holdingCosts: 11000,
    sellingCosts: 27900,
    timeToFlip: '2-3 months',
    condition: 'good',
    issues: ['Minor cosmetic updates', 'Appliances dated', 'Popcorn ceilings'],
    improvements: ['Paint refresh', 'New appliances', 'Ceiling update', 'Light staging'],
    neighborhood: 'stable',
    marketTrend: 'normal'
  },
  {
    id: 6,
    address: '2211 Everglades Way',
    city: 'Fort Myers, FL',
    image: '/placeholder-house-6.jpg',
    purchasePrice: 165000,
    rehabCost: 120000,
    afterRepairValue: 290000,
    holdingCosts: 14000,
    sellingCosts: 17400,
    timeToFlip: '7-8 months',
    condition: 'poor',
    issues: ['Fire damage', 'Structural issues', 'Complete gut needed', 'Zoning concerns'],
    improvements: ['Complete rebuild', 'Structural repair', 'New everything', 'Zoning approval'],
    neighborhood: 'stable',
    marketTrend: 'cold'
  }
]

export default function FlipOrFlopGame() {
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0)
  const [usedProperties, setUsedProperties] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [userChoice, setUserChoice] = useState<'flip' | 'flop' | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const currentProperty = FLIP_PROPERTIES[currentPropertyIndex]

  // Calculate if it's a good flip
  const calculateFlipAnalysis = useCallback((property: Property) => {
    const totalInvestment = property.purchasePrice + property.rehabCost + property.holdingCosts + property.sellingCosts
    const profit = property.afterRepairValue - totalInvestment
    const roi = (profit / (property.purchasePrice + property.rehabCost)) * 100
    const isGoodFlip = roi >= 15 && profit >= 25000 && property.neighborhood !== 'declining'
    
    return {
      totalInvestment,
      profit,
      roi,
      isGoodFlip,
      riskLevel: property.condition === 'poor' && property.rehabCost > 80000 ? 'high' : 
                 property.condition === 'fair' ? 'medium' : 'low',
      marketScore: property.marketTrend === 'hot' ? 3 : property.marketTrend === 'normal' ? 2 : 1,
      neighborhoodScore: property.neighborhood === 'improving' ? 3 : property.neighborhood === 'stable' ? 2 : 1
    }
  }, [])

  const analysis = calculateFlipAnalysis(currentProperty)

  const handleChoice = (choice: 'flip' | 'flop') => {
    setUserChoice(choice)
    setShowResult(true)
    setGamesPlayed(prev => prev + 1)

    const isCorrect = (choice === 'flip' && analysis.isGoodFlip) || (choice === 'flop' && !analysis.isGoodFlip)

    if (isCorrect) {
      const basePoints = 100
      const streakBonus = streak * 25
      const roiBonus = Math.floor(Math.abs(analysis.roi) / 5) * 10
      setScore(prev => prev + basePoints + streakBonus + roiBonus)
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }
  }

  const nextProperty = () => {
    setShowResult(false)
    setUserChoice(null)
    setShowAnalysis(false)

    const newUsed = [...usedProperties, currentPropertyIndex]
    setUsedProperties(newUsed)

    // Find next unused property
    const available = FLIP_PROPERTIES.map((_, i) => i).filter(i => !newUsed.includes(i))
    
    if (available.length === 0) {
      // Reset if all used
      setUsedProperties([])
      setCurrentPropertyIndex(Math.floor(Math.random() * FLIP_PROPERTIES.length))
    } else {
      setCurrentPropertyIndex(available[Math.floor(Math.random() * available.length)])
    }
  }

  const resetGame = () => {
    setCurrentPropertyIndex(0)
    setUsedProperties([])
    setShowResult(false)
    setUserChoice(null)
    setScore(0)
    setStreak(0)
    setGamesPlayed(0)
    setCorrectAnswers(0)
    setShowAnalysis(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'poor': return 'bg-red-100 text-red-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'good': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMarketColor = (trend: string) => {
    switch (trend) {
      case 'hot': return 'text-red-600'
      case 'normal': return 'text-gray-600'
      case 'cold': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard/games" className="text-orange-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Games
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Home className="w-8 h-8 text-white" />
              </div>
              Flip or Flop
            </h1>
            <p className="text-gray-600 mt-1">Analyze the deal - would you flip it or pass?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600">{score}</div>
            <div className="text-sm text-gray-500">points</div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500 mt-1">
                <span>🔥</span>
                <span className="font-bold">{streak} streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-xs text-gray-500">Total Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Star className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{bestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Home className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{gamesPlayed}</div>
            <div className="text-xs text-gray-500">Deals Analyzed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">
              {gamesPlayed > 0 ? Math.round((correctAnswers / gamesPlayed) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>

        {/* Property Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Property Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{currentProperty.address}</h2>
                <p className="text-orange-100">{currentProperty.city}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(currentProperty.condition)}`}>
                  {currentProperty.condition.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                  {currentProperty.timeToFlip}
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Financial Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Financial Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-semibold">{formatCurrency(currentProperty.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Estimated Rehab</span>
                    <span className="font-semibold text-red-600">+ {formatCurrency(currentProperty.rehabCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Holding Costs</span>
                    <span className="font-semibold text-red-600">+ {formatCurrency(currentProperty.holdingCosts)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Selling Costs (6%)</span>
                    <span className="font-semibold text-red-600">+ {formatCurrency(currentProperty.sellingCosts)}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-gray-50 -mx-2 px-2 rounded">
                    <span className="font-semibold text-gray-900">After Repair Value (ARV)</span>
                    <span className="font-bold text-green-600">{formatCurrency(currentProperty.afterRepairValue)}</span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Property Issues
                </h3>
                <div className="space-y-2">
                  {currentProperty.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mt-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Planned Improvements
                </h3>
                <div className="space-y-2">
                  {currentProperty.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Hammer className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Market Trend</div>
                <div className={`font-semibold flex items-center gap-2 ${getMarketColor(currentProperty.marketTrend)}`}>
                  {currentProperty.marketTrend === 'hot' && <TrendingUp className="w-5 h-5" />}
                  {currentProperty.marketTrend === 'cold' && <TrendingDown className="w-5 h-5" />}
                  {currentProperty.marketTrend.toUpperCase()} MARKET
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Neighborhood</div>
                <div className="font-semibold text-gray-900">
                  {currentProperty.neighborhood.charAt(0).toUpperCase() + currentProperty.neighborhood.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Decision Buttons */}
          {!showResult && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-center text-gray-600 mb-4 font-medium">Would you flip this property?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice('flip')}
                  className="flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all hover:scale-105"
                >
                  <TrendingUp className="w-6 h-6" />
                  FLIP IT!
                </button>
                <button
                  onClick={() => handleChoice('flop')}
                  className="flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all hover:scale-105"
                >
                  <TrendingDown className="w-6 h-6" />
                  FLOP IT!
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div className={`p-6 ${
              (userChoice === 'flip' && analysis.isGoodFlip) || (userChoice === 'flop' && !analysis.isGoodFlip)
                ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-center mb-6">
                {((userChoice === 'flip' && analysis.isGoodFlip) || (userChoice === 'flop' && !analysis.isGoodFlip)) ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-green-800">Correct!</h3>
                    <p className="text-green-600">Great investment analysis!</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-red-800">Not Quite!</h3>
                    <p className="text-red-600">Let&apos;s see why...</p>
                  </>
                )}
              </div>

              {/* Analysis */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Deal Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analysis.totalInvestment)}
                    </div>
                    <div className="text-xs text-gray-500">Total Investment</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${analysis.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(analysis.profit)}
                    </div>
                    <div className="text-xs text-gray-500">Profit</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${analysis.roi >= 15 ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.roi.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${analysis.isGoodFlip ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.isGoodFlip ? 'FLIP' : 'FLOP'}
                    </div>
                    <div className="text-xs text-gray-500">Verdict</div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {analysis.isGoodFlip ? (
                      <>
                        <strong className="text-green-600">This is a good flip!</strong> With a {analysis.roi.toFixed(1)}% ROI 
                        and {formatCurrency(analysis.profit)} profit potential, this deal meets the 15% minimum ROI threshold. 
                        The {currentProperty.neighborhood} neighborhood and {currentProperty.marketTrend} market conditions 
                        support the investment.
                      </>
                    ) : (
                      <>
                        <strong className="text-red-600">This one should be passed.</strong> The {analysis.roi.toFixed(1)}% ROI 
                        {analysis.roi < 15 ? ' is below the 15% minimum threshold' : ''}.
                        {currentProperty.neighborhood === 'declining' && ' The declining neighborhood adds significant risk.'}
                        {analysis.profit < 25000 && ` The ${formatCurrency(analysis.profit)} profit doesn't justify the risk.`}
                        {currentProperty.rehabCost > 80000 && ' The high rehab costs increase project risk significantly.'}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={nextProperty}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
                >
                  Next Property
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pro Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Pro Flip Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Target minimum 15% ROI to account for unexpected costs</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Avoid declining neighborhoods - appreciation matters</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Keep rehab under 50% of purchase price when possible</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Factor in 6% selling costs and 3-6 months holding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
