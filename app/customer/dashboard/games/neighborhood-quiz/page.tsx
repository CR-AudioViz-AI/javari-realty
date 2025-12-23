// app/customer/dashboard/games/neighborhood-quiz/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, Trophy, Star, CheckCircle, XCircle, 
  RotateCcw, ArrowRight, Home, School, ShoppingBag,
  Trees, Car, Users, TrendingUp, Shield, Clock
} from 'lucide-react'
import Link from 'next/link'

interface QuizQuestion {
  id: number
  category: 'demographics' | 'schools' | 'amenities' | 'market' | 'safety' | 'lifestyle'
  question: string
  neighborhood: string
  city: string
  options: string[]
  correctAnswer: number
  explanation: string
  source: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'demographics',
    question: 'What is the median household income in Downtown Fort Myers?',
    neighborhood: 'Downtown Fort Myers',
    city: 'Fort Myers, FL',
    options: ['$35,000 - $45,000', '$45,000 - $55,000', '$55,000 - $65,000', '$65,000 - $75,000'],
    correctAnswer: 1,
    explanation: 'Downtown Fort Myers has a median household income around $48,000, reflecting its mix of young professionals and established residents.',
    source: 'US Census Bureau ACS 2023'
  },
  {
    id: 2,
    category: 'schools',
    question: 'How many elementary schools are within 5 miles of Gulf Harbour in Fort Myers?',
    neighborhood: 'Gulf Harbour',
    city: 'Fort Myers, FL',
    options: ['3-5 schools', '6-8 schools', '9-11 schools', '12+ schools'],
    correctAnswer: 2,
    explanation: 'Gulf Harbour has access to 9 elementary schools within 5 miles, including highly-rated options like Treeline Elementary.',
    source: 'GreatSchools.org'
  },
  {
    id: 3,
    category: 'market',
    question: 'What was the median home price in Cape Coral in 2024?',
    neighborhood: 'Cape Coral',
    city: 'Cape Coral, FL',
    options: ['$325,000', '$375,000', '$425,000', '$475,000'],
    correctAnswer: 1,
    explanation: 'Cape Coral\'s median home price in 2024 was approximately $375,000, making it more affordable than nearby Naples while still offering waterfront options.',
    source: 'Redfin Market Data 2024'
  },
  {
    id: 4,
    category: 'amenities',
    question: 'How many golf courses are within Naples city limits?',
    neighborhood: 'Naples',
    city: 'Naples, FL',
    options: ['20-30', '40-50', '60-70', '80+'],
    correctAnswer: 3,
    explanation: 'Naples boasts over 80 golf courses within city limits, earning it the nickname "Golf Capital of the World."',
    source: 'Naples Area Board of Realtors'
  },
  {
    id: 5,
    category: 'safety',
    question: 'What is Sanibel Island\'s violent crime rate compared to Florida average?',
    neighborhood: 'Sanibel Island',
    city: 'Sanibel, FL',
    options: ['50% higher', 'About the same', '50% lower', '80% lower'],
    correctAnswer: 3,
    explanation: 'Sanibel Island has an exceptionally low crime rate, approximately 80% below the Florida state average, making it one of the safest communities.',
    source: 'FBI Crime Statistics 2023'
  },
  {
    id: 6,
    category: 'lifestyle',
    question: 'What percentage of Bonita Springs residents are 55 or older?',
    neighborhood: 'Bonita Springs',
    city: 'Bonita Springs, FL',
    options: ['25-30%', '35-40%', '45-50%', '55-60%'],
    correctAnswer: 2,
    explanation: 'About 47% of Bonita Springs residents are 55+, making it a popular retirement destination with numerous 55+ communities.',
    source: 'US Census Bureau 2023'
  },
  {
    id: 7,
    category: 'market',
    question: 'What is the average days on market for homes in Fort Myers Beach?',
    neighborhood: 'Fort Myers Beach',
    city: 'Fort Myers Beach, FL',
    options: ['15-25 days', '30-45 days', '50-70 days', '75-90 days'],
    correctAnswer: 2,
    explanation: 'Post-Hurricane Ian, Fort Myers Beach homes average 55-65 days on market as the area rebuilds, compared to 30 days pre-storm.',
    source: 'MLS Data 2024'
  },
  {
    id: 8,
    category: 'demographics',
    question: 'What is the population density of Lehigh Acres per square mile?',
    neighborhood: 'Lehigh Acres',
    city: 'Lehigh Acres, FL',
    options: ['500-700', '900-1,100', '1,300-1,500', '1,700-1,900'],
    correctAnswer: 1,
    explanation: 'Lehigh Acres has a population density around 1,000 per square mile, giving it a suburban feel despite being one of the largest communities in Lee County.',
    source: 'US Census Bureau 2023'
  },
  {
    id: 9,
    category: 'schools',
    question: 'What is the average GreatSchools rating for Estero area schools?',
    neighborhood: 'Estero',
    city: 'Estero, FL',
    options: ['5-6 out of 10', '6-7 out of 10', '7-8 out of 10', '8-9 out of 10'],
    correctAnswer: 2,
    explanation: 'Estero schools average 7-8 out of 10 on GreatSchools, with Three Oaks Elementary and Estero High School being top performers.',
    source: 'GreatSchools.org 2024'
  },
  {
    id: 10,
    category: 'amenities',
    question: 'How many public beach access points does Marco Island have?',
    neighborhood: 'Marco Island',
    city: 'Marco Island, FL',
    options: ['3-5', '6-8', '9-11', '12-15'],
    correctAnswer: 1,
    explanation: 'Marco Island has 7 public beach access points, including the popular Tigertail Beach and South Beach.',
    source: 'City of Marco Island'
  },
  {
    id: 11,
    category: 'market',
    question: 'What percentage did Immokalee home values increase from 2020-2024?',
    neighborhood: 'Immokalee',
    city: 'Immokalee, FL',
    options: ['20-30%', '40-50%', '60-70%', '80-90%'],
    correctAnswer: 2,
    explanation: 'Immokalee saw approximately 65% home value growth from 2020-2024, outpacing many larger communities due to affordability.',
    source: 'Zillow Home Value Index'
  },
  {
    id: 12,
    category: 'lifestyle',
    question: 'What percentage of Pelican Bay residents own their homes?',
    neighborhood: 'Pelican Bay',
    city: 'Naples, FL',
    options: ['55-65%', '70-80%', '85-90%', '95%+'],
    correctAnswer: 2,
    explanation: 'Pelican Bay has an extremely high homeownership rate of 87%, reflecting its affluent, established community.',
    source: 'US Census Bureau ACS'
  }
]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  demographics: Users,
  schools: School,
  amenities: ShoppingBag,
  market: TrendingUp,
  safety: Shield,
  lifestyle: Trees
}

const CATEGORY_COLORS: Record<string, string> = {
  demographics: 'bg-blue-100 text-blue-700 border-blue-300',
  schools: 'bg-green-100 text-green-700 border-green-300',
  amenities: 'bg-purple-100 text-purple-700 border-purple-300',
  market: 'bg-orange-100 text-orange-700 border-orange-300',
  safety: 'bg-red-100 text-red-700 border-red-300',
  lifestyle: 'bg-teal-100 text-teal-700 border-teal-300'
}

export default function NeighborhoodQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [usedQuestions, setUsedQuestions] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number, total: number }>>({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(true)

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const CategoryIcon = CATEGORY_ICONS[currentQuestion.category]

  // Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1) // Time's up
    }
  }, [timeLeft, timerActive, showResult])

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    setTimerActive(false)
    setQuestionsAnswered(prev => prev + 1)

    const isCorrect = answerIndex === currentQuestion.correctAnswer

    // Update category stats
    setCategoryStats(prev => ({
      ...prev,
      [currentQuestion.category]: {
        correct: (prev[currentQuestion.category]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[currentQuestion.category]?.total || 0) + 1
      }
    }))

    if (isCorrect) {
      const basePoints = 100
      const timeBonus = timeLeft * 3
      const streakBonus = streak * 20
      setScore(prev => prev + basePoints + timeBonus + streakBonus)
      setStreak(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1)
      }
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    setShowResult(false)
    setSelectedAnswer(null)
    setTimeLeft(30)
    setTimerActive(true)

    const newUsed = [...usedQuestions, currentQuestionIndex]
    setUsedQuestions(newUsed)

    const available = QUIZ_QUESTIONS.map((_, i) => i).filter(i => !newUsed.includes(i))
    
    if (available.length === 0) {
      setUsedQuestions([])
      setCurrentQuestionIndex(Math.floor(Math.random() * QUIZ_QUESTIONS.length))
    } else {
      setCurrentQuestionIndex(available[Math.floor(Math.random() * available.length)])
    }
  }

  const resetGame = () => {
    setCurrentQuestionIndex(0)
    setUsedQuestions([])
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setStreak(0)
    setQuestionsAnswered(0)
    setCorrectAnswers(0)
    setCategoryStats({})
    setTimeLeft(30)
    setTimerActive(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard/games" className="text-purple-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Games
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              Neighborhood Quiz
            </h1>
            <p className="text-gray-600 mt-1">Test your local market knowledge!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{score}</div>
            <div className="text-sm text-gray-500">points</div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-purple-500 mt-1">
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
            <Star className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{bestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">{questionsAnswered}</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-gray-900">
              {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Timer & Category */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CATEGORY_COLORS[currentQuestion.category]}`}>
                  <span className="flex items-center gap-1">
                    <CategoryIcon className="w-4 h-4" />
                    {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                  </span>
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-white/20'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xl">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Location Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{currentQuestion.neighborhood}, {currentQuestion.city}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.question}</h2>
          </div>

          {/* Answer Options */}
          <div className="p-6">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentQuestion.correctAnswer
                const showCorrectness = showResult

                let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all font-medium '
                
                if (showCorrectness) {
                  if (isCorrect) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-800'
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-800'
                  } else {
                    buttonClass += 'border-gray-200 bg-gray-50 text-gray-500'
                  }
                } else {
                  buttonClass += isSelected 
                    ? 'border-purple-500 bg-purple-50 text-purple-800' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          showCorrectness && isCorrect ? 'bg-green-500 text-white' :
                          showCorrectness && isSelected ? 'bg-red-500 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {showCorrectness && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {showCorrectness && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Result Explanation */}
          {showResult && (
            <div className={`p-6 ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50' : 'bg-red-50'} border-t`}>
              <div className="flex items-start gap-3 mb-4">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite!'}
                    {selectedAnswer === currentQuestion.correctAnswer && timeLeft > 0 && (
                      <span className="text-sm font-normal ml-2">+{timeLeft * 3} time bonus!</span>
                    )}
                  </h3>
                  <p className="text-gray-700 mt-2">{currentQuestion.explanation}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">Source: {currentQuestion.source}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={nextQuestion}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                >
                  Next Question
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

        {/* Category Stats */}
        {Object.keys(categoryStats).length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Category Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const Icon = CATEGORY_ICONS[category]
                const percentage = Math.round((stats.correct / stats.total) * 100)
                return (
                  <div key={category} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
                      <span className="text-xs text-gray-500 mb-1">({stats.correct}/{stats.total})</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
