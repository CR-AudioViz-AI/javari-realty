'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, User, DollarSign, Clock, Mail, Phone, Home,
  Star, AlertCircle, CheckCircle, Activity, Target
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  budget_min?: number
  budget_max?: number
  property_type?: string
  timeline?: string
  source?: string
  created_at: string
  last_contact?: string
  email_opens?: number
  property_views?: number
  showings_attended?: number
  notes?: string
}

interface LeadScore {
  total: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  factors: {
    name: string
    score: number
    maxScore: number
    reason: string
  }[]
  recommendation: string
  priority: 'hot' | 'warm' | 'cold'
}

interface LeadScoringProps {
  lead: Lead
  className?: string
  showDetails?: boolean
}

export function calculateLeadScore(lead: Lead): LeadScore {
  const factors: LeadScore['factors'] = []
  let totalScore = 0
  const maxPossible = 100

  // 1. Budget Qualification (25 points max)
  if (lead.budget_max) {
    const budgetScore = lead.budget_max >= 500000 ? 25 :
                        lead.budget_max >= 300000 ? 20 :
                        lead.budget_max >= 200000 ? 15 :
                        lead.budget_max >= 100000 ? 10 : 5
    factors.push({
      name: 'Budget',
      score: budgetScore,
      maxScore: 25,
      reason: lead.budget_max >= 500000 ? 'High-value buyer' :
              lead.budget_max >= 300000 ? 'Strong budget' :
              'Moderate budget'
    })
    totalScore += budgetScore
  } else {
    factors.push({ name: 'Budget', score: 0, maxScore: 25, reason: 'No budget specified' })
  }

  // 2. Timeline/Urgency (20 points max)
  const timeline = lead.timeline?.toLowerCase() || ''
  const timelineScore = timeline.includes('asap') || timeline.includes('immediate') ? 20 :
                        timeline.includes('1 month') || timeline.includes('30 day') ? 18 :
                        timeline.includes('3 month') || timeline.includes('90 day') ? 15 :
                        timeline.includes('6 month') ? 10 :
                        timeline.includes('year') ? 5 : 8
  factors.push({
    name: 'Timeline',
    score: timelineScore,
    maxScore: 20,
    reason: timelineScore >= 18 ? 'Ready to buy NOW' :
            timelineScore >= 15 ? 'Active in next 90 days' :
            'Longer timeline'
  })
  totalScore += timelineScore

  // 3. Engagement Level (25 points max)
  let engagementScore = 0
  const views = lead.property_views || 0
  const opens = lead.email_opens || 0
  const showings = lead.showings_attended || 0

  engagementScore += Math.min(views * 2, 10) // Up to 10 points for views
  engagementScore += Math.min(opens * 1.5, 8) // Up to 8 points for email opens
  engagementScore += Math.min(showings * 3, 7) // Up to 7 points for showings

  factors.push({
    name: 'Engagement',
    score: Math.round(engagementScore),
    maxScore: 25,
    reason: engagementScore >= 20 ? 'Highly engaged' :
            engagementScore >= 10 ? 'Moderately engaged' :
            'Low engagement'
  })
  totalScore += Math.round(engagementScore)

  // 4. Contact Completeness (15 points max)
  let contactScore = 0
  if (lead.email) contactScore += 5
  if (lead.phone) contactScore += 5
  if (lead.name && lead.name.includes(' ')) contactScore += 5 // Full name
  
  factors.push({
    name: 'Contact Info',
    score: contactScore,
    maxScore: 15,
    reason: contactScore >= 15 ? 'Complete contact info' :
            contactScore >= 10 ? 'Partial info' :
            'Minimal info'
  })
  totalScore += contactScore

  // 5. Recency (15 points max)
  const daysSinceContact = lead.last_contact 
    ? Math.floor((Date.now() - new Date(lead.last_contact).getTime()) / (1000 * 60 * 60 * 24))
    : Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
  
  const recencyScore = daysSinceContact <= 1 ? 15 :
                       daysSinceContact <= 3 ? 12 :
                       daysSinceContact <= 7 ? 10 :
                       daysSinceContact <= 14 ? 7 :
                       daysSinceContact <= 30 ? 4 : 1

  factors.push({
    name: 'Recency',
    score: recencyScore,
    maxScore: 15,
    reason: recencyScore >= 12 ? 'Very recent activity' :
            recencyScore >= 7 ? 'Recent contact' :
            'Needs follow-up'
  })
  totalScore += recencyScore

  // Calculate grade
  const percentage = (totalScore / maxPossible) * 100
  const grade: LeadScore['grade'] = 
    percentage >= 80 ? 'A' :
    percentage >= 60 ? 'B' :
    percentage >= 40 ? 'C' :
    percentage >= 20 ? 'D' : 'F'

  // Determine priority
  const priority: LeadScore['priority'] = 
    percentage >= 70 ? 'hot' :
    percentage >= 40 ? 'warm' : 'cold'

  // Generate recommendation
  let recommendation = ''
  if (priority === 'hot') {
    recommendation = 'High priority! Schedule showing or call within 24 hours.'
  } else if (priority === 'warm') {
    const lowestFactor = factors.reduce((min, f) => 
      (f.score / f.maxScore) < (min.score / min.maxScore) ? f : min
    )
    recommendation = `Follow up on ${lowestFactor.name.toLowerCase()} to increase conversion chance.`
  } else {
    recommendation = 'Add to nurture campaign. Check back in 30 days.'
  }

  return {
    total: totalScore,
    grade,
    factors,
    recommendation,
    priority
  }
}

export default function LeadScoring({ lead, className = '', showDetails = true }: LeadScoringProps) {
  const [score, setScore] = useState<LeadScore | null>(null)

  useEffect(() => {
    setScore(calculateLeadScore(lead))
  }, [lead])

  if (!score) return null

  const gradeColors = {
    A: 'bg-green-500',
    B: 'bg-blue-500',
    C: 'bg-yellow-500',
    D: 'bg-orange-500',
    F: 'bg-red-500'
  }

  const priorityConfig = {
    hot: { color: 'text-red-600 bg-red-50', icon: '🔥', label: 'HOT LEAD' },
    warm: { color: 'text-orange-600 bg-orange-50', icon: '☀️', label: 'WARM' },
    cold: { color: 'text-blue-600 bg-blue-50', icon: '❄️', label: 'NURTURE' }
  }

  return (
    <div className={`bg-white rounded-xl border ${className}`}>
      {/* Score Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${gradeColors[score.grade]} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
              {score.grade}
            </div>
            <div>
              <p className="font-semibold text-lg">{score.total}/100 Points</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityConfig[score.priority].color}`}>
                {priorityConfig[score.priority].icon} {priorityConfig[score.priority].label}
              </span>
            </div>
          </div>
          <Target className="text-gray-400" size={24} />
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-blue-50 border-b">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-blue-600 mt-0.5" size={18} />
          <p className="text-sm text-blue-800">{score.recommendation}</p>
        </div>
      </div>

      {/* Score Breakdown */}
      {showDetails && (
        <div className="p-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Activity size={16} /> Score Breakdown
          </h4>
          <div className="space-y-3">
            {score.factors.map((factor) => (
              <div key={factor.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{factor.name}</span>
                  <span className="font-medium">{factor.score}/{factor.maxScore}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      factor.score / factor.maxScore >= 0.7 ? 'bg-green-500' :
                      factor.score / factor.maxScore >= 0.4 ? 'bg-yellow-500' : 'bg-red-400'
                    }`}
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
