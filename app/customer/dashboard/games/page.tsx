// app/customer/dashboard/games/page.tsx
'use client'

import { Home, DollarSign, MapPin, Trophy, Star, Target, TrendingUp, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

const GAMES = [
  {
    id: 'price-guess',
    title: 'Price Guess',
    description: 'Test your property valuation skills! Guess the listing price and earn points for accuracy.',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    stats: { played: 0, bestScore: 0 },
    available: true,
    href: '/customer/dashboard/games/price-guess'
  },
  {
    id: 'flip-or-flop',
    title: 'Flip or Flop',
    description: 'Analyze real estate deals and decide: would you flip it for profit or pass on the risk?',
    icon: Home,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    stats: { played: 0, bestScore: 0 },
    available: true,
    href: '/customer/dashboard/games/flip-or-flop'
  },
  {
    id: 'neighborhood-quiz',
    title: 'Neighborhood Quiz',
    description: 'Test your knowledge of Southwest Florida neighborhoods, schools, and market data.',
    icon: MapPin,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    stats: { played: 0, bestScore: 0 },
    available: true,
    href: '/customer/dashboard/games/neighborhood-quiz'
  }
]

export default function GamesHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              Games & Learning
            </h1>
            <p className="text-gray-600 mt-1">Learn real estate while having fun!</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Total Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Star className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Games Played</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Achievements</div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {GAMES.map((game) => {
            const Icon = game.icon
            return (
              <Link key={game.id} href={game.href} className="block group">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Game Header */}
                  <div className={`h-32 bg-gradient-to-br ${game.color} p-6 flex items-end`}>
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Game Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{game.stats.played} played</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>Best: {game.stats.bestScore}</span>
                      </div>
                    </div>
                    
                    {/* Play Button */}
                    <div className={`w-full py-3 rounded-xl font-medium text-center transition-all bg-gradient-to-r ${game.color} text-white group-hover:opacity-90`}>
                      Play Now →
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Why Play These Games?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Learn Property Values</h3>
              <p className="text-sm text-gray-600">Develop an instinct for pricing by analyzing real market data.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Know Your Market</h3>
              <p className="text-sm text-gray-600">Master neighborhood demographics, schools, and amenities.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Spot Good Deals</h3>
              <p className="text-sm text-gray-600">Train your eye to identify profitable investment opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
