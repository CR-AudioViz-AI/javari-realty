import Link from 'next/link'
import { Heart, Shield, Home, Users } from 'lucide-react'

export default function ModulesPage() {
  const modules = [
    { icon: '🎖️', title: 'Veterans', description: 'Specialized support for military veterans transitioning to civilian life', color: 'bg-red-50 border-red-200' },
    { icon: '🚒', title: 'First Responders', description: 'Dedicated programs for firefighters, police, and EMTs', color: 'bg-blue-50 border-blue-200' },
    { icon: '👴', title: 'Seniors (55+)', description: 'Age-friendly housing and downsizing assistance', color: 'bg-purple-50 border-purple-200' },
    { icon: '🏡', title: 'First-Time Buyers', description: 'Education and support for first-time home purchasers', color: 'bg-green-50 border-green-200' },
    { icon: '⛪', title: 'Faith-Based', description: 'Connecting faith communities with appropriate housing', color: 'bg-indigo-50 border-indigo-200' },
    { icon: '💙', title: 'Low-Income Housing', description: 'Affordable housing options and assistance programs', color: 'bg-cyan-50 border-cyan-200' },
    { icon: '✈️', title: 'Military Families', description: 'Support for active duty and military families during relocation', color: 'bg-amber-50 border-amber-200' },
    { icon: '♿', title: 'Special Needs', description: 'Accessible housing for individuals with disabilities', color: 'bg-teal-50 border-teal-200' },
    { icon: '👨‍👩‍👧', title: 'Foster/Adoption', description: 'Housing solutions for foster and adoptive families', color: 'bg-pink-50 border-pink-200' },
    { icon: '🏢', title: 'Nonprofits', description: 'Real estate services for nonprofit organizations', color: 'bg-orange-50 border-orange-200' },
    { icon: '🦽', title: 'Accessibility', description: 'Universal design and ADA-compliant properties', color: 'bg-lime-50 border-lime-200' },
    { icon: '🆘', title: 'Emergency Housing', description: 'Rapid rehousing for those facing homelessness', color: 'bg-red-50 border-red-200' },
    { icon: '🌱', title: 'Green/Sustainable', description: 'Eco-friendly homes and sustainable living', color: 'bg-emerald-50 border-emerald-200' },
    { icon: '👪', title: 'Multigenerational', description: 'Homes designed for multiple generations living together', color: 'bg-violet-50 border-violet-200' },
    { icon: '🏘️', title: 'Tiny Homes', description: 'Minimalist living and tiny home communities', color: 'bg-fuchsia-50 border-fuchsia-200' },
    { icon: '🤲', title: 'Co-Housing', description: 'Intentional communities and shared living spaces', color: 'bg-rose-50 border-rose-200' },
    { icon: '🌾', title: 'Rural/Homesteading', description: 'Rural properties and self-sufficient living', color: 'bg-yellow-50 border-yellow-200' },
    { icon: '🏙️', title: 'Urban Revitalization', description: 'Supporting urban renewal and community development', color: 'bg-sky-50 border-sky-200' },
    { icon: '🤝', title: 'Community Land Trusts', description: 'Affordable housing through community ownership', color: 'bg-slate-50 border-slate-200' },
    { icon: '🌍', title: 'Cultural Communities', description: 'Serving diverse cultural and ethnic communities', color: 'bg-stone-50 border-stone-200' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold">CR Realtor Platform</span>
          </Link>
          <div className="space-x-4">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-primary hover:underline">
              Sign In
            </Link>
            <Link href="/dashboard/realtor" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90">
              For Realtors
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">20 Social Impact Modules</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Specialized programs serving underserved communities with dedicated support, resources, and expertise
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">20</div>
              <div className="text-gray-600">Impact Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Families Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Realtors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">$50M+</div>
              <div className="text-gray-600">In Assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact Modules</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each module is designed with specific expertise, resources, and partnerships to serve its community effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`${module.color} border-2 rounded-xl p-6 hover:shadow-lg transition cursor-pointer`}
            >
              <div className="text-4xl mb-3">{module.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600">{module.description}</p>
              <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Our Modules Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Identify Your Module</h3>
              <p className="text-gray-600">
                Select the module that matches your community or specific needs
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Connect with Experts</h3>
              <p className="text-gray-600">
                Work with realtors trained specifically for your community
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Find Your Home</h3>
              <p className="text-gray-600">
                Access specialized resources and programs to achieve your housing goals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have found their perfect home through our specialized programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Create Free Account
            </Link>
            <Link
              href="/properties"
              className="px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
