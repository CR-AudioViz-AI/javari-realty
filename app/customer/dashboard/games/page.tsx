// app/customer/dashboard/games/page.tsx
// Games Hub - All real estate learning games
'use client'

import Link from 'next/link'
import { 
  Gamepad2, 
  DollarSign, 
  Hammer, 
  MapPin, 
  Trophy,
  Flame,
  Star,
  ArrowRight,
  Lock,
  Sparkles
} from 'lucide-react'

interface GameCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgGradient: string
  href: string
  available: boolean
  comingSoon?: boolean
  stats?: {
    gamesPlayed?: number
    highScore?: number
    bestStreak?: number
  }
}

const GAMES: GameCard[] = [
  {
    id: 'price-guess',
    title: 'Price Guess',
    description: 'Guess property prices to sharpen your market intuition. Learn real estate values through play!',
    icon: DollarSign,
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-600',
    href: '/customer/dashboard/games/price-guess',
    available: true,
    stats: {
      gamesPlayed: 0,
      highScore: 0,
      bestStreak: 0
    }
  },
  {
    id: 'flip-or-flop',
    title: 'Flip or Flop',
    description: 'Analyze renovation scenarios and decide if they\'re profitable. Master investment analysis!',
    icon: Hammer,
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-red-600',
    href: '/customer/dashboard/games/flip-or-flop',
    available: false,
    comingSoon: true
  },
  {
    id: 'neighborhood-quiz',
    title: 'Neighborhood Quiz',
    description: 'Test your knowledge of local neighborhoods, schools, and amenities. Become a local expert!',
    icon: MapPin,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-indigo-600',
    href: '/customer/dashboard/games/neighborhood-quiz',
    available: false,
    comingSoon: true
  }
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Real Estate Games</h1>
          </div>
          <p className="text-purple-100 max-w-2xl">
            Learn real estate through play! These games are designed to help you understand 
            property values, investment analysis, and local market knowledge.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-500">Total Score</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-500">0</p>
              <p className="text-sm text-gray-500">Best Streak</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Gamepad2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500">Games Played</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-500">0</p>
              <p className="text-sm text-gray-500">Achievements</p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => {
            const Icon = game.icon
            
            return (
              <div
                key={game.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                  !game.available ? 'opacity-75' : ''
                }`}
              >
                {/* Game Header */}
                <div className={`bg-gradient-to-r ${game.bgGradient} p-6 text-white relative`}>
                  {game.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{game.title}</h3>
                </div>

                {/* Game Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{game.description}</p>

                  {/* Stats (if available) */}
                  {game.stats && game.available && (
                    <div className="flex gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">High Score:</span>
                        <span className="ml-1 font-semibold">{game.stats.highScore}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Streak:</span>
                        <span className="ml-1 font-semibold">{game.stats.bestStreak}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {game.available ? (
                    <Link
                      href={game.href}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r ${game.bgGradient} text-white hover:opacity-90 transition-opacity`}
                    >
                      Play Now
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      <Lock className="w-5 h-5" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Why Play Real Estate Games?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Market Intuition</h3>
              <p className="text-sm text-gray-600">
                Develop a natural feel for property values and market trends through practice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Competitive Edge</h3>
              <p className="text-sm text-gray-600">
                Sharpen your skills and outperform others in real estate decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fun Learning</h3>
              <p className="text-sm text-gray-600">
                Make learning about real estate enjoyable and engaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
