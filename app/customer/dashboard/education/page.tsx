// app/customer/dashboard/education/page.tsx
'use client'

import { useState } from 'react'
import { 
  GraduationCap, BookOpen, Award, Clock, CheckCircle, 
  Lock, Play, ChevronRight, Star, Users, TrendingUp,
  Home, DollarSign, FileText, Shield, Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  category: 'buyer' | 'seller' | 'investor' | 'florida-specific'
  duration: string
  lessons: number
  level: 'beginner' | 'intermediate' | 'advanced'
  completedLessons: number
  enrolled: boolean
  certificate: boolean
  icon: React.ElementType
  color: string
}

const COURSES: Course[] = [
  {
    id: 'first-time-buyer',
    title: 'First-Time Homebuyer Essentials',
    description: 'Everything you need to know about buying your first home, from pre-approval to closing.',
    category: 'buyer',
    duration: '2 hours',
    lessons: 8,
    level: 'beginner',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: Home,
    color: 'blue'
  },
  {
    id: 'florida-disclosure',
    title: 'Florida Disclosure Requirements',
    description: 'Master all required disclosures for Florida real estate transactions.',
    category: 'florida-specific',
    duration: '1.5 hours',
    lessons: 6,
    level: 'intermediate',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: FileText,
    color: 'orange'
  },
  {
    id: 'investment-fundamentals',
    title: 'Real Estate Investment 101',
    description: 'Learn to analyze deals, calculate ROI, and build your investment portfolio.',
    category: 'investor',
    duration: '3 hours',
    lessons: 12,
    level: 'intermediate',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: TrendingUp,
    color: 'green'
  },
  {
    id: 'selling-success',
    title: 'Selling Your Home for Top Dollar',
    description: 'Strategies to prepare, price, and market your home for maximum value.',
    category: 'seller',
    duration: '1.5 hours',
    lessons: 6,
    level: 'beginner',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: DollarSign,
    color: 'purple'
  },
  {
    id: 'florida-insurance',
    title: 'Florida Property Insurance Guide',
    description: 'Navigate homeowners, flood, and wind insurance in the Sunshine State.',
    category: 'florida-specific',
    duration: '1 hour',
    lessons: 4,
    level: 'beginner',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: Shield,
    color: 'red'
  },
  {
    id: 'flip-mastery',
    title: 'House Flipping Mastery',
    description: 'Advanced strategies for finding, renovating, and selling properties for profit.',
    category: 'investor',
    duration: '4 hours',
    lessons: 15,
    level: 'advanced',
    completedLessons: 0,
    enrolled: false,
    certificate: true,
    icon: Sparkles,
    color: 'amber'
  }
]

const CATEGORY_LABELS: Record<string, string> = {
  'buyer': 'Buyer Education',
  'seller': 'Seller Education',
  'investor': 'Investment Training',
  'florida-specific': 'Florida Specific'
}

const LEVEL_COLORS: Record<string, string> = {
  'beginner': 'bg-green-100 text-green-800',
  'intermediate': 'bg-yellow-100 text-yellow-800',
  'advanced': 'bg-red-100 text-red-800'
}

export default function EducationHub() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})

  const filteredCourses = activeCategory === 'all' 
    ? COURSES 
    : COURSES.filter(c => c.category === activeCategory)

  const handleEnroll = (courseId: string) => {
    setEnrolledCourses(prev => [...prev, courseId])
    setCourseProgress(prev => ({ ...prev, [courseId]: 0 }))
  }

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, border: string, gradient: string }> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', gradient: 'from-blue-500 to-blue-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500', gradient: 'from-orange-500 to-orange-600' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', gradient: 'from-green-500 to-green-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', gradient: 'from-purple-500 to-purple-600' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-500', gradient: 'from-red-500 to-red-600' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500', gradient: 'from-amber-500 to-amber-600' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/customer/dashboard" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              Education Center
            </h1>
            <p className="text-gray-600 mt-1">Free courses to become a smarter buyer, seller, or investor</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-center px-4 border-r">
              <div className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</div>
              <div className="text-xs text-gray-500">Enrolled</div>
            </div>
            <div className="text-center px-4 border-r">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-xs text-gray-500">Certificates</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            All Courses
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === key 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Featured Course Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-blue-100 font-medium">Featured Course</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">First-Time Homebuyer Essentials</h2>
          <p className="text-blue-100 mb-4 max-w-2xl">
            Start your homebuying journey with confidence. This comprehensive course covers everything from 
            getting pre-approved to closing on your dream home.
          </p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>8 lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Certificate included</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1,234 enrolled</span>
            </div>
          </div>
          <button 
            onClick={() => handleEnroll('first-time-buyer')}
            disabled={isEnrolled('first-time-buyer')}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              isEnrolled('first-time-buyer')
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {isEnrolled('first-time-buyer') ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Enrolled - Start Learning
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Enroll for Free
              </>
            )}
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const colors = getColorClasses(course.color)
            const enrolled = isEnrolled(course.id)
            const progress = courseProgress[course.id] || 0
            const Icon = course.icon

            return (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                {/* Course Header */}
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
                
                <div className="p-6">
                  {/* Icon & Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${colors.bg} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[course.level]}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Progress or Certificate Badge */}
                  {enrolled ? (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${colors.bg} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    course.certificate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span>Includes certificate</span>
                      </div>
                    )
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => !enrolled && handleEnroll(course.id)}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      enrolled
                        ? `${colors.bg} text-white hover:opacity-90`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {enrolled ? (
                      <>
                        Continue Learning
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Certificates Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Certificates</h2>
              <p className="text-gray-600">Complete courses to earn verifiable certificates</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No certificates yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Complete your enrolled courses to earn certificates that you can share with agents, 
              lenders, or add to your professional profile.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-sm text-gray-600">All courses are completely free, forever. No hidden fees or premium tiers.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Certificates</h3>
            <p className="text-sm text-gray-600">Get verifiable certificates to showcase your real estate knowledge.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Florida Focused</h3>
            <p className="text-sm text-gray-600">Content specifically tailored to Florida real estate laws and practices.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
