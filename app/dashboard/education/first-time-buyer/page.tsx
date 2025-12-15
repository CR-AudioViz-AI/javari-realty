'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, ChevronRight, ChevronLeft, CheckCircle, Circle, PlayCircle,
  FileText, Calculator, DollarSign, CreditCard, Search, Key, Shield,
  Users, Briefcase, Clock, Award, BookOpen, Target, AlertCircle, Lightbulb
} from 'lucide-react'

const MODULES = [
  {
    id: 1,
    title: 'Is Homeownership Right for You?',
    icon: Home,
    duration: '20 min',
    description: 'Evaluate your readiness and understand the responsibilities of homeownership',
    lessons: [
      { title: 'Rent vs. Buy Calculator', type: 'tool' },
      { title: 'Financial Readiness Checklist', type: 'lesson' },
      { title: 'Hidden Costs of Homeownership', type: 'lesson' },
      { title: 'Lifestyle Considerations', type: 'lesson' },
    ],
    keyTakeaways: [
      'Monthly costs include mortgage, taxes, insurance, maintenance',
      'Plan to stay 3-5 years minimum to recoup buying costs',
      'Budget 1-3% of home value annually for maintenance',
    ],
  },
  {
    id: 2,
    title: 'Understanding Your Credit',
    icon: CreditCard,
    duration: '25 min',
    description: 'Learn how credit scores work and how to improve yours for better rates',
    lessons: [
      { title: 'What is a Credit Score?', type: 'lesson' },
      { title: 'The 5 Factors of Credit', type: 'lesson' },
      { title: 'How to Check Your Credit (Free)', type: 'lesson' },
      { title: 'Improving Your Score Fast', type: 'lesson' },
      { title: 'Credit Myths Debunked', type: 'lesson' },
    ],
    keyTakeaways: [
      'Payment history is 35% of your score',
      'Keep credit utilization under 30%',
      'Don\'t close old accounts before buying',
      'Dispute errors - they\'re common!',
    ],
  },
  {
    id: 3,
    title: 'Saving for Your Down Payment',
    icon: DollarSign,
    duration: '30 min',
    description: 'Strategies to save and down payment assistance programs you may qualify for',
    lessons: [
      { title: 'How Much Do You Really Need?', type: 'lesson' },
      { title: 'Down Payment Assistance Programs', type: 'lesson' },
      { title: 'First-Time Buyer Programs by State', type: 'lesson' },
      { title: 'Gift Funds Rules', type: 'lesson' },
      { title: 'Saving Strategies That Work', type: 'lesson' },
    ],
    keyTakeaways: [
      'FHA loans require only 3.5% down',
      'VA and USDA loans offer 0% down',
      'Florida has multiple DPA programs',
      'Gift funds are allowed with documentation',
    ],
  },
  {
    id: 4,
    title: 'Mortgage Types Explained',
    icon: FileText,
    duration: '35 min',
    description: 'Understand all your loan options: Conventional, FHA, VA, USDA, and more',
    lessons: [
      { title: 'Conventional Loans', type: 'lesson' },
      { title: 'FHA Loans', type: 'lesson' },
      { title: 'VA Loans (Veterans)', type: 'lesson' },
      { title: 'USDA Rural Loans', type: 'lesson' },
      { title: 'Fixed vs. Adjustable Rates', type: 'lesson' },
      { title: 'Which Loan is Right for You?', type: 'quiz' },
    ],
    keyTakeaways: [
      'FHA = Lower down payment, more forgiving credit',
      'VA = Best deal for veterans (no PMI, 0% down)',
      'USDA = Rural areas, income limits, 0% down',
      'Conventional = Fewer restrictions, no MIP',
    ],
  },
  {
    id: 5,
    title: 'Getting Pre-Approved',
    icon: Shield,
    duration: '20 min',
    description: 'How to get pre-approved and what documents you\'ll need',
    lessons: [
      { title: 'Pre-Qualification vs. Pre-Approval', type: 'lesson' },
      { title: 'Documents You\'ll Need', type: 'checklist' },
      { title: 'Shopping for Lenders', type: 'lesson' },
      { title: 'Understanding Your Loan Estimate', type: 'lesson' },
    ],
    keyTakeaways: [
      'Pre-approval is stronger than pre-qualification',
      'Have 2 years of tax returns ready',
      'Compare at least 3 lenders',
      'Pre-approval is good for 60-90 days',
    ],
  },
  {
    id: 6,
    title: 'Working with a Real Estate Agent',
    icon: Users,
    duration: '15 min',
    description: 'How to find and work with the right agent for you',
    lessons: [
      { title: 'Why Use a Buyer\'s Agent?', type: 'lesson' },
      { title: 'How Agents Get Paid', type: 'lesson' },
      { title: 'Questions to Ask Agents', type: 'lesson' },
      { title: 'The Buyer Agency Agreement', type: 'lesson' },
    ],
    keyTakeaways: [
      'Buyer\'s agents are typically free to you',
      'Seller usually pays both agents',
      'Interview 2-3 agents before choosing',
      'Local expertise matters!',
    ],
  },
  {
    id: 7,
    title: 'House Hunting Like a Pro',
    icon: Search,
    duration: '25 min',
    description: 'How to search effectively and evaluate properties',
    lessons: [
      { title: 'Needs vs. Wants Worksheet', type: 'tool' },
      { title: 'Understanding Listing Information', type: 'lesson' },
      { title: 'What to Look for in Showings', type: 'lesson' },
      { title: 'Red Flags to Watch For', type: 'lesson' },
      { title: 'Evaluating Neighborhoods', type: 'lesson' },
    ],
    keyTakeaways: [
      'Make a needs vs. wants list before looking',
      'Look at 5-10 homes before making offers',
      'Drive by properties at different times',
      'Research flood zones and HOA rules',
    ],
  },
  {
    id: 8,
    title: 'Making an Offer',
    icon: Target,
    duration: '25 min',
    description: 'How to craft a winning offer and negotiate effectively',
    lessons: [
      { title: 'Components of an Offer', type: 'lesson' },
      { title: 'Pricing Strategy', type: 'lesson' },
      { title: 'Contingencies Explained', type: 'lesson' },
      { title: 'Negotiation Tactics', type: 'lesson' },
      { title: 'Multiple Offer Situations', type: 'lesson' },
    ],
    keyTakeaways: [
      'Earnest money shows you\'re serious (1-3%)',
      'Inspection contingency is critical',
      'Escalation clauses can help in hot markets',
      'Be prepared to move fast',
    ],
  },
  {
    id: 9,
    title: 'The Home Inspection',
    icon: Briefcase,
    duration: '20 min',
    description: 'What happens during inspection and how to respond to findings',
    lessons: [
      { title: 'What Inspectors Look For', type: 'lesson' },
      { title: 'Attending Your Inspection', type: 'lesson' },
      { title: 'Reading the Inspection Report', type: 'lesson' },
      { title: 'Negotiating Repairs', type: 'lesson' },
      { title: 'When to Walk Away', type: 'lesson' },
    ],
    keyTakeaways: [
      'Always attend your inspection',
      'Focus on major systems: roof, HVAC, foundation',
      'Cosmetic issues are not deal breakers',
      'Get repair estimates for negotiations',
    ],
  },
  {
    id: 10,
    title: 'The Appraisal Process',
    icon: Calculator,
    duration: '15 min',
    description: 'Understanding appraisals and what happens if it comes in low',
    lessons: [
      { title: 'Why Appraisals Matter', type: 'lesson' },
      { title: 'What Appraisers Evaluate', type: 'lesson' },
      { title: 'Low Appraisal Options', type: 'lesson' },
    ],
    keyTakeaways: [
      'Lender requires appraisal to protect their investment',
      'Low appraisal ≠ end of deal',
      'Options: negotiate, pay gap, or walk',
    ],
  },
  {
    id: 11,
    title: 'Closing Day Preparation',
    icon: Key,
    duration: '25 min',
    description: 'Everything you need to know about closing day',
    lessons: [
      { title: 'Final Walkthrough Checklist', type: 'checklist' },
      { title: 'Understanding Closing Costs', type: 'lesson' },
      { title: 'What to Bring to Closing', type: 'lesson' },
      { title: 'Reviewing Closing Documents', type: 'lesson' },
      { title: 'Wire Transfer Safety', type: 'lesson' },
    ],
    keyTakeaways: [
      'Do final walkthrough within 24 hours of closing',
      'Closing costs are typically 2-5% of loan amount',
      'Bring government ID and cashier\'s check',
      'Verify wire instructions by phone (fraud is common!)',
    ],
  },
  {
    id: 12,
    title: 'After You Get the Keys',
    icon: Award,
    duration: '15 min',
    description: 'First steps as a new homeowner',
    lessons: [
      { title: 'Change Your Locks', type: 'lesson' },
      { title: 'Set Up Utilities', type: 'checklist' },
      { title: 'Home Maintenance Schedule', type: 'tool' },
      { title: 'Building Your Emergency Fund', type: 'lesson' },
    ],
    keyTakeaways: [
      'Change locks immediately',
      'Create home maintenance calendar',
      'Build emergency fund (3-6 months)',
      'Keep all warranty documents organized',
    ],
  },
]

export default function FirstTimeBuyerPage() {
  const [activeModule, setActiveModule] = useState(0)
  const [completedModules, setCompletedModules] = useState<number[]>([])

  const markComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId])
    }
  }

  const progress = (completedModules.length / MODULES.length) * 100

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/education" className="text-blue-600 hover:underline flex items-center gap-1 mb-2">
          <ChevronLeft size={18} /> Back to Education Center
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Home className="text-blue-600" /> First-Time Homebuyer Academy
        </h1>
        <p className="text-gray-600 mt-2">
          Your complete guide to buying your first home with confidence. 12 modules, 100% free.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Your Progress</span>
          <span className="text-blue-600 font-bold">{completedModules.length}/{MODULES.length} Modules</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Award className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-800">Congratulations! 🎉</p>
              <p className="text-sm text-green-700">You've completed all modules. Download your certificate below.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border overflow-hidden sticky top-6">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">Course Modules</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {MODULES.map((module, idx) => {
                const isComplete = completedModules.includes(module.id)
                const isActive = activeModule === idx
                
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(idx)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${isComplete ? 'text-green-600' : 'text-gray-300'}`}>
                        {isComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                          {module.id}. {module.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Clock size={12} /> {module.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border">
            {/* Module Header */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const Icon = MODULES[activeModule].icon
                  return <Icon className="text-blue-600" size={28} />
                })()}
                <div>
                  <span className="text-sm text-gray-500">Module {MODULES[activeModule].id}</span>
                  <h2 className="text-xl font-bold">{MODULES[activeModule].title}</h2>
                </div>
              </div>
              <p className="text-gray-600">{MODULES[activeModule].description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {MODULES[activeModule].duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen size={16} /> {MODULES[activeModule].lessons.length} Lessons
                </span>
              </div>
            </div>

            {/* Lessons */}
            <div className="p-6 border-b">
              <h3 className="font-semibold mb-4">Lessons</h3>
              <div className="space-y-3">
                {MODULES[activeModule].lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    {lesson.type === 'lesson' && <PlayCircle className="text-blue-500" size={20} />}
                    {lesson.type === 'tool' && <Calculator className="text-green-500" size={20} />}
                    {lesson.type === 'checklist' && <CheckCircle className="text-purple-500" size={20} />}
                    {lesson.type === 'quiz' && <Target className="text-orange-500" size={20} />}
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-xs text-gray-500 capitalize px-2 py-1 bg-white rounded">
                      {lesson.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-6 bg-amber-50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="text-amber-600" size={20} /> Key Takeaways
              </h3>
              <ul className="space-y-2">
                {MODULES[activeModule].keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={16} />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="p-6 flex justify-between items-center">
              <button
                onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                disabled={activeModule === 0}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              
              {!completedModules.includes(MODULES[activeModule].id) ? (
                <button
                  onClick={() => markComplete(MODULES[activeModule].id)}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle size={18} /> Mark Complete
                </button>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={18} /> Completed!
                </span>
              )}
              
              <button
                onClick={() => setActiveModule(Math.min(MODULES.length - 1, activeModule + 1))}
                disabled={activeModule === MODULES.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
