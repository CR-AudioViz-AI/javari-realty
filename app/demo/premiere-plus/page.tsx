// app/demo/premiere-plus/page.tsx
// ULTIMATE Demo Site for Tony & Laura Harvey - Premiere Plus Realty
// Showcasing CR Realtor Platform - THE FUTURE OF REAL ESTATE

import Link from 'next/link'
import { Home, Users, Building2, Factory, Phone, Mail, MapPin, Star, TrendingUp, Search, Heart, ArrowRight, CheckCircle, Shield, Zap, BarChart3, MessageSquare, Calendar, Clock, DollarSign, Award, Target, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Premiere Plus Realty | Tony & Laura Harvey | Naples FL Real Estate',
  description: 'Tony and Laura Harvey are a husband and wife real estate team serving Naples, Fort Myers, Bonita Springs and Southwest Florida. Find your dream home today!'
}

const agents = [
  {
    id: 1,
    name: 'Tony Harvey',
    title: 'Real Estate Professional',
    phone: '(239) 777-0155',
    email: 'tony@listorbuyrealestate.com',
    bio: 'Heidelberg University graduate with extensive mortgage industry background. Strong negotiation skills and market expertise.',
    specialties: ['Residential Sales', 'First-Time Buyers', 'Investment Properties'],
    background: 'Cincinnati, Ohio native. Moved to Fort Myers in 2005.',
    stats: { sold: 87, volume: 42500000, satisfaction: 4.9 }
  },
  {
    id: 2,
    name: 'Laura Harvey',
    title: 'Real Estate Professional', 
    phone: '(239) 777-0156',
    email: 'laura@listorbuyrealestate.com',
    bio: 'Naples native with deep local knowledge. Lake Park Elementary, Gulfview Middle, Naples High 2001. Knows every neighborhood.',
    specialties: ['Local Expert', 'Luxury Homes', 'Waterfront Properties'],
    background: 'Born and raised in Naples. True local expert.',
    stats: { sold: 72, volume: 38200000, satisfaction: 4.95 }
  }
]

const properties = [
  {
    id: 1,
    title: 'Stunning Waterfront Estate in Port Royal',
    address: '4100 Gordon Drive, Naples, FL 34102',
    price: 12500000,
    beds: 6,
    baths: 7,
    sqft: 8500,
    type: 'Single Family',
    features: ['Waterfront', 'Private Dock', 'Pool', 'Gulf Access'],
    status: 'Active',
    days: 14,
    agent: 'Tony Harvey'
  },
  {
    id: 2,
    title: 'Luxury Golf Course Home in Pelican Bay',
    address: '6955 Verde Way, Naples, FL 34108',
    price: 3250000,
    beds: 4,
    baths: 5,
    sqft: 4200,
    type: 'Single Family',
    features: ['Golf Course', 'Beach Club', 'Pool', 'Gated'],
    status: 'Active',
    days: 7,
    agent: 'Laura Harvey'
  },
  {
    id: 3,
    title: 'Gulf Views Penthouse Condo',
    address: '4051 Gulf Shore Blvd N #1201, Naples, FL 34103',
    price: 1875000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    type: 'Condo',
    features: ['Gulf Views', 'Penthouse', 'Concierge', 'Beach Access'],
    status: 'Active',
    days: 21,
    agent: 'Tony Harvey'
  },
  {
    id: 4,
    title: 'Naples Park Family Home',
    address: '748 97th Ave N, Naples, FL 34108',
    price: 625000,
    beds: 4,
    baths: 2,
    sqft: 1850,
    type: 'Single Family',
    features: ['No HOA', 'New Roof', 'Near Beach', 'Great Schools'],
    status: 'Active',
    days: 5,
    agent: 'Laura Harvey'
  },
  {
    id: 5,
    title: 'Prime 5th Avenue Retail Space',
    address: '699 5th Ave S, Naples, FL 34102',
    price: 2100000,
    sqft: 3500,
    type: 'Commercial',
    features: ['Prime Location', 'High Traffic', '6% Cap Rate', 'NNN Lease'],
    status: 'Active',
    days: 45,
    agent: 'Tony Harvey'
  },
  {
    id: 6,
    title: 'Gulf Access Home in Cape Coral',
    address: '5418 Pelican Blvd, Cape Coral, FL 33914',
    price: 895000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    type: 'Single Family',
    features: ['Gulf Access', 'Private Dock', 'Heated Pool', 'Boat Lift'],
    status: 'Active',
    days: 12,
    agent: 'Laura Harvey'
  }
]

const platformFeatures = [
  {
    icon: Sparkles,
    title: 'Javari AI Assistant',
    description: 'Your 24/7 AI-powered assistant handles lead qualification, appointment scheduling, and client communication automatically.'
  },
  {
    icon: Target,
    title: 'Smart Lead Routing',
    description: 'Leads automatically matched to the right agent based on specialty, location, and availability.'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track every metric that matters - from lead conversion to days on market to revenue forecasting.'
  },
  {
    icon: MessageSquare,
    title: 'Unified Communications',
    description: 'Email, text, and chat all in one place. Never miss a lead or client message again.'
  },
  {
    icon: Calendar,
    title: 'Automated Scheduling',
    description: 'Showings, open houses, and appointments sync across all calendars automatically.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption, SOC 2 compliance, and full data ownership. Your data stays yours.'
  }
]

const comparisonData = [
  { feature: 'AI Lead Qualification', us: true, them: false },
  { feature: 'All 6 Property Types', us: true, them: false },
  { feature: 'Automated Follow-up', us: true, them: false },
  { feature: 'Real-Time Analytics', us: true, them: false },
  { feature: 'Mobile App', us: true, them: true },
  { feature: 'IDX Integration', us: true, them: true },
  { feature: 'No Monthly Platform Fee', us: true, them: false },
  { feature: 'Full Data Ownership', us: true, them: false },
  { feature: 'White Label Option', us: true, them: false },
  { feature: 'Javari AI Assistant', us: true, them: false }
]

export default function PremierePlusDemoPage() {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 text-center">
        <div className="container mx-auto px-4 flex items-center justify-center space-x-4">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold">LIVE DEMO - Premiere Plus Realty on CR Realtor Platform</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-emerald-100">See how we transformed their business</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">PP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Premiere Plus Realty</h1>
                <p className="text-sm text-gray-500">Tony and Laura Harvey</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="#properties" className="text-gray-700 hover:text-blue-600 font-medium">Properties</Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
              <Link href="#platform" className="text-gray-700 hover:text-blue-600 font-medium">Our Platform</Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <a href="tel:239-777-0155" className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <Phone className="w-4 h-4" />
                <span className="font-medium">(239) 777-0155</span>
              </a>
              <Link href="/auth/signup" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur px-5 py-2 rounded-full mb-8 border border-white/20">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-medium">Southwest Florida Trusted Real Estate Team Since 2007</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Find Your Dream Home in{' '}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Naples</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Tony and Laura Harvey are a husband and wife team dedicated to helping you find your perfect home in Southwest Florida.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search Naples, Fort Myers, Bonita Springs..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <select className="px-4 py-4 rounded-xl border-0 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Property Types</option>
                  <option>Residential - Buy</option>
                  <option>Residential - Rent</option>
                  <option>Commercial - Buy</option>
                  <option>Commercial - Lease</option>
                  <option>Industrial</option>
                </select>
                <button className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center space-x-2 shadow-lg">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center p-4">
                <div className="text-5xl font-bold mb-2">159</div>
                <div className="text-blue-200 font-medium">Homes Sold</div>
              </div>
              <div className="text-center p-4">
                <div className="text-5xl font-bold mb-2">$80M+</div>
                <div className="text-blue-200 font-medium">Total Volume</div>
              </div>
              <div className="text-center p-4">
                <div className="text-5xl font-bold mb-2">28</div>
                <div className="text-blue-200 font-medium">Avg Days Listed</div>
              </div>
              <div className="text-center p-4">
                <div className="text-5xl font-bold mb-2">4.9</div>
                <div className="text-blue-200 font-medium">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Browse by Property Type</h2>
            <p className="text-xl text-gray-600">We handle ALL property types across Southwest Florida</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Home, label: 'Homes for Sale', count: 124, color: 'blue' },
              { icon: Home, label: 'Homes for Rent', count: 38, color: 'green' },
              { icon: Building2, label: 'Commercial Sale', count: 15, color: 'purple' },
              { icon: Building2, label: 'Commercial Lease', count: 22, color: 'orange' },
              { icon: Factory, label: 'Industrial Sale', count: 8, color: 'red' },
              { icon: Factory, label: 'Industrial Lease', count: 12, color: 'amber' },
            ].map((cat, i) => (
              <Link 
                key={i} 
                href={`/search?type=${cat.label.toLowerCase().replace(/ /g, '_')}`}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center group border border-gray-100"
              >
                <div className={`w-14 h-14 mx-auto mb-4 bg-${cat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition`}>
                  <cat.icon className={`w-7 h-7 text-${cat.color}-600`} />
                </div>
                <span className="font-semibold text-gray-800 block mb-1">{cat.label}</span>
                <span className="text-sm text-gray-500">{cat.count} listings</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Properties</h2>
              <p className="text-xl text-gray-600">Hand-picked listings from Tony and Laura</p>
            </div>
            <Link href="/search" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition">
              View All 219 Listings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group border border-gray-100">
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Home className="w-20 h-20 text-blue-300" />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {property.status}
                  </div>
                  <button className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition group">
                    <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {property.days} days on market
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">{property.type}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-1">{property.title}</h3>
                  <p className="text-gray-600 flex items-center mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address}</span>
                  </p>
                  {property.beds && (
                    <div className="flex items-center space-x-4 text-gray-700 mb-4 font-medium">
                      <span>{property.beds} Beds</span>
                      <span className="text-gray-300">|</span>
                      <span>{property.baths} Baths</span>
                      <span className="text-gray-300">|</span>
                      <span>{property.sqft?.toLocaleString()} sqft</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {property.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">Listed by {property.agent}</span>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="text-blue-600 font-semibold hover:text-blue-700 flex items-center"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Meet Tony and Laura Harvey</h2>
            <p className="text-xl text-gray-600">A husband and wife team dedicated to your success</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-5xl text-white font-bold shadow-lg">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                    <p className="text-gray-500 mb-3">{agent.title}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <a href={`tel:${agent.phone}`} className="flex items-center text-blue-600 hover:text-blue-700">
                        <Phone className="w-4 h-4 mr-1" />
                        {agent.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{agent.bio}</p>
                <p className="text-gray-500 text-sm mb-4 italic">{agent.background}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {agent.specialties.map((spec, i) => (
                    <span key={i} className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{agent.stats.sold}</div>
                    <div className="text-sm text-gray-500">Homes Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">${(agent.stats.volume / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-500">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{agent.stats.satisfaction}</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Their Story */}
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-4xl mx-auto border border-gray-100">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold">Our Story</h3>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 text-center">
              <p className="text-xl leading-relaxed mb-6">
                We are Tony and Laura Harvey! Why are we here? One reason... We are a husband and wife team that both became realtors to help people like you find their dream home.
              </p>
              <p className="text-xl leading-relaxed mb-6">
                We met in April of 2007 in Key West, got engaged in Key West in 2012, and married here in beautiful Naples a year later in 2013.
              </p>
              <p className="text-xl leading-relaxed">
                Together, we bring Tonys mortgage expertise and strong negotiation skills combined with Lauras deep local knowledge of Southwest Florida. We are confident that we are the team that can meet and exceed your real estate needs.
              </p>
            </div>
            <div className="flex justify-center space-x-6 mt-10">
              {[
                { year: '2007', event: 'Met in Key West' },
                { year: '2012', event: 'Engaged' },
                { year: '2013', event: 'Married in Naples' },
                { year: '2024', event: 'CR Platform Launch' }
              ].map((item, i) => (
                <div key={i} className="text-center px-6 py-4 bg-blue-50 rounded-xl">
                  <div className="text-xl font-bold text-blue-600">{item.year}</div>
                  <div className="text-sm text-gray-600">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features - What Makes Us Different */}
      <section id="platform" className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-white/10 px-5 py-2 rounded-full mb-6">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="font-medium">Powered by CR Realtor Platform</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Why We Switched to CR Realtor Platform</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              The most advanced real estate technology in the industry - now powering our business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {platformFeatures.map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto text-gray-900">
            <h3 className="text-2xl font-bold text-center mb-8">CR Platform vs Traditional Websites</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-4 font-bold">Feature</th>
                    <th className="text-center py-4 px-4 font-bold text-blue-600">CR Platform</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-400">Old Website</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-4 px-4 font-medium">{row.feature}</td>
                      <td className="text-center py-4 px-4">
                        {row.us ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {row.them ? (
                          <CheckCircle className="w-6 h-6 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-red-400 font-bold">✕</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Served */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Markets We Serve</h2>
            <p className="text-xl text-gray-600">Covering all of Southwest Florida</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Naples', listings: 124 },
              { name: 'Fort Myers', listings: 87 },
              { name: 'Bonita Springs', listings: 45 },
              { name: 'Cape Coral', listings: 62 },
              { name: 'Lehigh Acres', listings: 38 }
            ].map((market) => (
              <Link 
                key={market.name}
                href={`/search?city=${market.name}`}
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl text-center hover:from-blue-700 hover:to-blue-800 transition shadow-xl group"
              >
                <MapPin className="w-10 h-10 mx-auto mb-3 group-hover:scale-110 transition" />
                <span className="font-bold text-lg block mb-1">{market.name}</span>
                <span className="text-blue-200 text-sm">{market.listings} listings</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Let Tony and Laura help you navigate the Southwest Florida real estate market with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="px-10 py-5 bg-white text-emerald-700 rounded-xl font-bold hover:bg-gray-100 transition flex items-center justify-center space-x-2 shadow-xl">
              <Search className="w-5 h-5" />
              <span>Search Properties</span>
            </Link>
            <a href="tel:239-777-0155" className="px-10 py-5 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-emerald-700 transition flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Call (239) 777-0155</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">PP</span>
                </div>
                <div>
                  <span className="text-white font-bold block">Premiere Plus Realty</span>
                  <span className="text-sm">Tony and Laura Harvey</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">Your trusted real estate team in Southwest Florida since 2007.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <div className="space-y-3 text-sm">
                <Link href="/search" className="block hover:text-white transition">Search Properties</Link>
                <Link href="#about" className="block hover:text-white transition">About Us</Link>
                <Link href="#contact" className="block hover:text-white transition">Contact</Link>
                <Link href="/help" className="block hover:text-white transition">Help Center</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Property Types</h4>
              <div className="space-y-3 text-sm">
                <Link href="/search?type=residential" className="block hover:text-white transition">Residential</Link>
                <Link href="/search?type=commercial" className="block hover:text-white transition">Commercial</Link>
                <Link href="/search?type=industrial" className="block hover:text-white transition">Industrial</Link>
                <Link href="/search?type=rental" className="block hover:text-white transition">Rentals</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <p className="flex items-center"><Phone className="w-4 h-4 mr-3" /> (239) 777-0155</p>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-3" /> info@listorbuyrealestate.com</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-3" /> Naples, FL 34109</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-10 text-center">
            <p className="mb-2">© 2024 Premiere Plus Realty. All rights reserved.</p>
            <p className="text-sm">
              Powered by <span className="text-blue-400 font-semibold">CR Realtor Platform</span> | 
              Part of <span className="text-blue-400">CR AudioViz AI, LLC</span> | Fort Myers, Florida
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
