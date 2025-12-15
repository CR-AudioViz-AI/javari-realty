import Link from 'next/link'
import {
  GraduationCap, BookOpen, Video, FileText, Calculator, DollarSign,
  Home, Shield, Users, Award, ChevronRight, PlayCircle, Download,
  CheckCircle, Star, Clock, Target, TrendingUp, Key, Briefcase
} from 'lucide-react'

export const metadata = {
  title: 'Education Center | CR Realtor Platform',
  description: 'Free real estate education for homebuyers, sellers, investors, and professionals.',
}

const LEARNING_TRACKS = [
  {
    id: 'first-time-buyer',
    title: 'First-Time Homebuyer Academy',
    description: 'Everything you need to know to buy your first home with confidence',
    icon: Home,
    color: 'from-blue-500 to-indigo-600',
    modules: 12,
    duration: '4-6 hours',
    level: 'Beginner',
    topics: ['Credit Basics', 'Saving for Down Payment', 'Mortgage Types', 'Home Search', 'Making Offers', 'Closing Process'],
    href: '/dashboard/education/first-time-buyer'
  },
  {
    id: 'seller-guide',
    title: 'Home Seller Masterclass',
    description: 'Maximize your home\'s value and navigate the selling process',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    modules: 8,
    duration: '3-4 hours',
    level: 'All Levels',
    topics: ['Pricing Strategy', 'Staging Tips', 'Marketing Your Home', 'Negotiations', 'Closing Costs'],
    href: '/dashboard/education/seller-guide'
  },
  {
    id: 'investor',
    title: 'Real Estate Investing 101',
    description: 'Build wealth through strategic property investments',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    modules: 10,
    duration: '5-7 hours',
    level: 'Intermediate',
    topics: ['Investment Analysis', 'Rental Properties', 'Fix & Flip', '1031 Exchanges', 'Tax Strategies'],
    href: '/dashboard/education/investing'
  },
  {
    id: 'realtor-pro',
    title: 'Realtor Success Program',
    description: 'Advanced strategies for real estate professionals',
    icon: Award,
    color: 'from-amber-500 to-orange-600',
    modules: 15,
    duration: '8-10 hours',
    level: 'Professional',
    topics: ['Lead Generation', 'Client Management', 'Listing Presentations', 'Negotiation Scripts', 'Marketing'],
    href: '/dashboard/education/realtor-pro'
  },
]

const QUICK_GUIDES = [
  { title: 'Understanding Credit Scores', icon: Target, time: '10 min', category: 'Financing' },
  { title: 'Down Payment Options', icon: DollarSign, time: '15 min', category: 'Financing' },
  { title: 'FHA vs Conventional Loans', icon: FileText, time: '12 min', category: 'Financing' },
  { title: 'VA Loan Benefits', icon: Shield, time: '8 min', category: 'Financing' },
  { title: 'Home Inspection Checklist', icon: CheckCircle, time: '10 min', category: 'Buying' },
  { title: 'Making a Strong Offer', icon: Key, time: '15 min', category: 'Buying' },
  { title: 'Closing Cost Breakdown', icon: Calculator, time: '12 min', category: 'Buying' },
  { title: 'Property Tax Basics', icon: Briefcase, time: '8 min', category: 'Ownership' },
]

const FREE_RESOURCES = [
  { title: 'Homebuyer Checklist (PDF)', type: 'download', icon: Download },
  { title: 'Budget Worksheet', type: 'download', icon: Download },
  { title: 'Mortgage Comparison Tool', type: 'tool', icon: Calculator },
  { title: 'Home Search Criteria Worksheet', type: 'download', icon: Download },
  { title: 'Closing Cost Calculator', type: 'tool', icon: Calculator },
  { title: 'First-Time Buyer Video Series', type: 'video', icon: PlayCircle },
]

export default function EducationCenterPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap size={40} />
          <h1 className="text-3xl font-bold">Education Center</h1>
        </div>
        <p className="text-xl text-blue-100 mb-6 max-w-2xl">
          Free, comprehensive real estate education for everyone. Whether you're buying your first home 
          or building an investment portfolio, we have the resources to help you succeed.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <BookOpen size={18} />
            <span>45+ Courses</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <Video size={18} />
            <span>100+ Videos</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <FileText size={18} />
            <span>Free Downloads</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <Calculator size={18} />
            <span>Interactive Tools</span>
          </div>
        </div>
      </div>

      {/* Learning Tracks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Learning Tracks</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {LEARNING_TRACKS.map(track => (
            <Link key={track.id} href={track.href}>
              <div className="bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className={`bg-gradient-to-r ${track.color} p-6 text-white`}>
                  <track.icon size={32} className="mb-3" />
                  <h3 className="text-xl font-bold mb-2">{track.title}</h3>
                  <p className="text-white/80 text-sm">{track.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <BookOpen size={16} /> {track.modules} Modules
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock size={16} /> {track.duration}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{track.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {track.topics.slice(0, 4).map(topic => (
                      <span key={topic} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {topic}
                      </span>
                    ))}
                    {track.topics.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        +{track.topics.length - 4} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all">
                    Start Learning <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Guides */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quick Guides</h2>
          <Link href="/dashboard/education/guides" className="text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_GUIDES.map(guide => (
            <div key={guide.title} className="bg-white rounded-xl border p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <guide.icon size={20} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {guide.time}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
              <span className="text-xs text-gray-500">{guide.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Free Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Free Resources & Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FREE_RESOURCES.map(resource => (
            <div key={resource.title} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`p-3 rounded-lg ${
                resource.type === 'download' ? 'bg-green-50' :
                resource.type === 'tool' ? 'bg-blue-50' : 'bg-purple-50'
              }`}>
                <resource.icon size={24} className={
                  resource.type === 'download' ? 'text-green-600' :
                  resource.type === 'tool' ? 'text-blue-600' : 'text-purple-600'
                } />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Video */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <span className="text-yellow-400 text-sm font-medium">FEATURED VIDEO SERIES</span>
              <h2 className="text-2xl font-bold mt-2 mb-4">First-Time Homebuyer Bootcamp</h2>
              <p className="text-gray-300 mb-6">
                Our most popular course! Learn everything from getting pre-approved to getting your keys. 
                6 comprehensive videos covering the entire homebuying journey.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} className="text-yellow-400" />
                  <span>6 Videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-yellow-400" />
                  <span>2.5 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" />
                  <span>4.9 Rating</span>
                </div>
              </div>
              <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 flex items-center gap-2">
                <PlayCircle size={20} /> Watch Free
              </button>
            </div>
            <div className="w-full md:w-80 h-48 bg-gray-700 rounded-xl flex items-center justify-center">
              <PlayCircle size={64} className="text-white/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Earn Certificates</h2>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Award size={32} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Homebuyer Certificate Program</h3>
              <p className="text-gray-600 mb-4">
                Complete our courses and earn certificates that may qualify you for down payment assistance 
                programs and special financing options. Many lenders and programs require homebuyer education!
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">HUD Approved Content</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">Florida Housing Eligible</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">Free Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
