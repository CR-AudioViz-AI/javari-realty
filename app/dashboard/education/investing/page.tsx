'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, ChevronRight, ChevronLeft, CheckCircle, Circle, PlayCircle,
  DollarSign, Home, Building2, Calculator, FileText, Shield,
  Clock, Award, BookOpen, Target, Lightbulb, BarChart3, PieChart
} from 'lucide-react'

const MODULES = [
  {
    id: 1,
    title: 'Why Invest in Real Estate?',
    icon: TrendingUp,
    duration: '25 min',
    description: 'Understand the benefits and risks of real estate investing',
    lessons: [
      { title: 'Real Estate vs Other Investments', type: 'lesson' },
      { title: 'The 4 Ways Real Estate Builds Wealth', type: 'lesson' },
      { title: 'Common Investor Mistakes', type: 'lesson' },
      { title: 'Is Real Estate Right for You?', type: 'quiz' },
    ],
    keyTakeaways: [
      'Cash flow, appreciation, tax benefits, and equity buildup',
      'Real estate provides hedge against inflation',
      'Leverage allows controlling assets with less capital',
      'Requires active management vs. passive stock investing',
    ],
  },
  {
    id: 2,
    title: 'Investment Property Analysis',
    icon: Calculator,
    duration: '35 min',
    description: 'Learn to evaluate deals like a pro',
    lessons: [
      { title: 'Cap Rate Explained', type: 'lesson' },
      { title: 'Cash-on-Cash Return', type: 'lesson' },
      { title: 'The 1% Rule', type: 'lesson' },
      { title: 'Net Operating Income (NOI)', type: 'lesson' },
      { title: 'Investment Calculator Walkthrough', type: 'tool' },
    ],
    keyTakeaways: [
      'Cap Rate = NOI / Purchase Price',
      'Cash-on-Cash = Annual Cash Flow / Cash Invested',
      '1% Rule: Monthly rent should be 1% of purchase price',
      'Always analyze worst-case scenarios',
    ],
  },
  {
    id: 3,
    title: 'Rental Property Strategies',
    icon: Home,
    duration: '40 min',
    description: 'Different approaches to rental real estate',
    lessons: [
      { title: 'Long-Term Rentals', type: 'lesson' },
      { title: 'Short-Term/Vacation Rentals', type: 'lesson' },
      { title: 'House Hacking', type: 'lesson' },
      { title: 'BRRRR Strategy', type: 'lesson' },
      { title: 'Choosing Your Strategy', type: 'quiz' },
    ],
    keyTakeaways: [
      'Long-term: Stable income, less management',
      'Short-term: Higher income potential, more work',
      'House hacking: Live free while building equity',
      'BRRRR: Buy, Rehab, Rent, Refinance, Repeat',
    ],
  },
  {
    id: 4,
    title: 'Financing Investment Properties',
    icon: DollarSign,
    duration: '30 min',
    description: 'How to fund your real estate investments',
    lessons: [
      { title: 'Conventional Investment Loans', type: 'lesson' },
      { title: 'DSCR Loans', type: 'lesson' },
      { title: 'Hard Money & Private Lending', type: 'lesson' },
      { title: 'Creative Financing Options', type: 'lesson' },
      { title: 'Using OPM (Other People\'s Money)', type: 'lesson' },
    ],
    keyTakeaways: [
      'Investment properties require 15-25% down',
      'Interest rates are 0.5-1% higher than primary residence',
      'DSCR loans qualify based on property income, not personal',
      'Hard money is expensive but fast',
    ],
  },
  {
    id: 5,
    title: 'Finding Good Deals',
    icon: Target,
    duration: '30 min',
    description: 'Where and how to find profitable properties',
    lessons: [
      { title: 'On-Market vs Off-Market Deals', type: 'lesson' },
      { title: 'Working with Agents', type: 'lesson' },
      { title: 'Analyzing Markets', type: 'lesson' },
      { title: 'Due Diligence Checklist', type: 'checklist' },
    ],
    keyTakeaways: [
      'Best deals often come from networking',
      'Drive for dollars in target neighborhoods',
      'Look for motivated sellers',
      'Never skip due diligence',
    ],
  },
  {
    id: 6,
    title: 'Property Management',
    icon: Building2,
    duration: '35 min',
    description: 'Self-manage vs. hire a property manager',
    lessons: [
      { title: 'Self-Management Basics', type: 'lesson' },
      { title: 'Hiring a Property Manager', type: 'lesson' },
      { title: 'Tenant Screening', type: 'lesson' },
      { title: 'Lease Agreements', type: 'lesson' },
      { title: 'Handling Maintenance', type: 'lesson' },
    ],
    keyTakeaways: [
      'Property managers typically charge 8-10% of rent',
      'Good tenant screening prevents most problems',
      'Always use written lease agreements',
      'Budget 10% of rent for maintenance',
    ],
  },
  {
    id: 7,
    title: 'Tax Strategies for Investors',
    icon: FileText,
    duration: '30 min',
    description: 'Maximize tax benefits of real estate',
    lessons: [
      { title: 'Depreciation', type: 'lesson' },
      { title: 'Deductible Expenses', type: 'lesson' },
      { title: '1031 Exchanges', type: 'lesson' },
      { title: 'Entity Structure (LLC, S-Corp)', type: 'lesson' },
      { title: 'Working with a CPA', type: 'lesson' },
    ],
    keyTakeaways: [
      'Depreciation provides "paper losses" against income',
      '1031 exchanges defer capital gains taxes',
      'Keep meticulous records of all expenses',
      'Consult a real estate-specialized CPA',
    ],
  },
  {
    id: 8,
    title: 'Fix and Flip Basics',
    icon: Home,
    duration: '35 min',
    description: 'Make money buying, renovating, and selling',
    lessons: [
      { title: 'The 70% Rule', type: 'lesson' },
      { title: 'Estimating Rehab Costs', type: 'lesson' },
      { title: 'Managing Contractors', type: 'lesson' },
      { title: 'Selling for Maximum Profit', type: 'lesson' },
    ],
    keyTakeaways: [
      '70% Rule: Pay no more than 70% of ARV minus repairs',
      'Always add 20% buffer to rehab estimates',
      'Get multiple contractor bids',
      'Time is money - delays kill profits',
    ],
  },
  {
    id: 9,
    title: 'Building Your Portfolio',
    icon: BarChart3,
    duration: '25 min',
    description: 'Scale from one property to many',
    lessons: [
      { title: 'Reinvesting Cash Flow', type: 'lesson' },
      { title: 'Refinancing to Grow', type: 'lesson' },
      { title: 'Diversification Strategies', type: 'lesson' },
      { title: 'Setting Portfolio Goals', type: 'lesson' },
    ],
    keyTakeaways: [
      'Start small and scale gradually',
      'Reinvest profits into more properties',
      'Diversify across locations and property types',
      'Set clear financial goals with timelines',
    ],
  },
  {
    id: 10,
    title: 'Risk Management',
    icon: Shield,
    duration: '20 min',
    description: 'Protect yourself and your investments',
    lessons: [
      { title: 'Insurance Requirements', type: 'lesson' },
      { title: 'LLC Protection', type: 'lesson' },
      { title: 'Emergency Reserves', type: 'lesson' },
      { title: 'Exit Strategies', type: 'lesson' },
    ],
    keyTakeaways: [
      'Landlord insurance differs from homeowner insurance',
      'Umbrella policy provides additional liability protection',
      'Keep 6 months of expenses in reserves',
      'Always have multiple exit strategies',
    ],
  },
]

export default function InvestingCoursePage() {
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
      <Link href="/dashboard/education" className="text-blue-600 hover:underline flex items-center gap-1 mb-4">
        <ChevronLeft size={18} /> Back to Education Center
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
          <TrendingUp className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Real Estate Investing 101</h1>
          <p className="text-gray-600">Build wealth through strategic property investments</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Your Progress</span>
          <span className="text-purple-600 font-bold">{completedModules.length}/{MODULES.length} Modules</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border overflow-hidden sticky top-6">
            <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-violet-600 text-white">
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
                      isActive ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${isComplete ? 'text-green-600' : 'text-gray-300'}`}>
                        {isComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isActive ? 'text-purple-600' : ''}`}>
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
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const Icon = MODULES[activeModule].icon
                  return <Icon className="text-purple-600" size={28} />
                })()}
                <div>
                  <span className="text-sm text-gray-500">Module {MODULES[activeModule].id}</span>
                  <h2 className="text-xl font-bold">{MODULES[activeModule].title}</h2>
                </div>
              </div>
              <p className="text-gray-600">{MODULES[activeModule].description}</p>
            </div>

            <div className="p-6 border-b">
              <h3 className="font-semibold mb-4">Lessons</h3>
              <div className="space-y-3">
                {MODULES[activeModule].lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    {lesson.type === 'lesson' && <PlayCircle className="text-purple-500" size={20} />}
                    {lesson.type === 'tool' && <Calculator className="text-green-500" size={20} />}
                    {lesson.type === 'checklist' && <CheckCircle className="text-blue-500" size={20} />}
                    {lesson.type === 'quiz' && <Target className="text-orange-500" size={20} />}
                    <span className="flex-1">{lesson.title}</span>
                    <span className="text-xs text-gray-500 capitalize px-2 py-1 bg-white rounded">
                      {lesson.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-purple-50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="text-purple-600" size={20} /> Key Takeaways
              </h3>
              <ul className="space-y-2">
                {MODULES[activeModule].keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="text-purple-600 mt-0.5 flex-shrink-0" size={16} />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>

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
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
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
