// app/demo/premiere-plus/page.tsx
// Demo Site for Tony & Laura Harvey - Premiere Plus Realty
// Showcasing CR Realtor Platform capabilities

import Link from 'next/link'
import { Home, Users, Building2, Factory, Phone, Mail, MapPin, Star, Award, TrendingUp, Calendar, Search, Heart, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Premiere Plus Realty | Tony & Laura Harvey | Naples FL Real Estate',
  description: 'Tony & Laura Harvey are a husband and wife real estate team serving Naples, Fort Myers, Bonita Springs and Southwest Florida. Find your dream home today!'
}

// Demo Data (would come from database in production)
const agents = [
  {
    id: 1,
    name: 'Tony Harvey',
    title: 'Real Estate Professional',
    phone: '(239) 777-0155',
    email: 'tony@listorbuyrealestate.com',
    photo: '👨‍💼',
    bio: 'Heidelberg University graduate with extensive mortgage industry background. Strong negotiation skills and market expertise.',
    specialties: ['Residential Sales', 'First-Time Buyers', 'Investment Properties'],
    stats: { sold: 87, volume: '$42.5M', satisfaction: 4.9 }
  },
  {
    id: 2,
    name: 'Laura Harvey',
    title: 'Real Estate Professional',
    phone: '(239) 777-0156',
    email: 'laura@listorbuyrealestate.com',
    photo: '👩‍💼',
    bio: 'Naples native with deep local knowledge. Lake Park Elementary, Gulfview Middle, Naples High 2001. Knows every neighborhood.',
    specialties: ['Local Expert', 'Luxury Homes', 'Waterfront Properties'],
    stats: { sold: 72, volume: '$38.2M', satisfaction: 4.95 }
  }
]

const properties = [
  {
    id: 1,
    title: 'Stunning Waterfront Estate',
    address: '4100 Gordon Drive, Naples',
    price: 12500000,
    beds: 6,
    baths: 7,
    sqft: 8500,
    type: 'Single Family',
    image: '🏰',
    features: ['Waterfront', 'Private Dock', 'Pool'],
    status: 'Active',
    daysOnMarket: 14
  },
  {
    id: 2,
    title: 'Pelican Bay Golf Home',
    address: '6955 Verde Way, Naples',
    price: 3250000,
    beds: 4,
    baths: 4.5,
    sqft: 4200,
    type: 'Single Family',
    image: '🏡',
    features: ['Golf Course', 'Beach Club', 'Pool'],
    status: 'Active',
    daysOnMarket: 7
  },
  {
    id: 3,
    title: 'Gulf Views Penthouse',
    address: '4051 Gulf Shore Blvd N #1201, Naples',
    price: 1875000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    type: 'Condo',
    image: '🌅',
    features: ['Gulf Views', 'Penthouse', 'Concierge'],
    status: 'Active',
    daysOnMarket: 21
  },
  {
    id: 4,
    title: 'Naples Park Family Home',
    address: '748 97th Ave N, Naples',
    price: 625000,
    beds: 4,
    baths: 2,
    sqft: 1850,
    type: 'Single Family',
    image: '🏠',
    features: ['No HOA', 'New Roof', 'Near Beach'],
    status: 'Active',
    daysOnMarket: 5
  },
  {
    id: 5,
    title: 'Prime 5th Ave Retail',
    address: '699 5th Ave S, Naples',
    price: 2100000,
    sqft: 3500,
    type: 'Commercial',
    image: '🏪',
    features: ['Prime Location', 'High Traffic', '6% Cap'],
    status: 'Active',
    daysOnMarket: 45
  },
  {
    id: 6,
    title: 'Gulf Access Cape Coral',
    address: '5418 Pelican Blvd, Cape Coral',
    price: 895000,
    beds: 4,
    baths: 3,
    sqft: 2600,
    type: 'Single Family',
    image: '⛵',
    features: ['Gulf Access', 'Private Dock', 'Pool'],
    status: 'Active',
    daysOnMarket: 12
  }
]

const stats = {
  totalListings: 24,
  soldThisYear: 87,
  totalVolume: '$42.5M',
  avgDaysOnMarket: 28,
  clientSatisfaction: 4.92
}

export default function PremierePlusDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-2 text-center text-sm">
        <span className="font-semibold">🎯 DEMO MODE</span> - This is a demonstration of CR Realtor Platform for Premiere Plus Realty
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
                <p className="text-sm text-gray-500">Tony & Laura Harvey</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#properties" className="text-gray-700 hover:text-blue-600 font-medium">Properties</Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
              <Link href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <a href="tel:239-777-0155" className="hidden md:flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span>(239) 777-0155</span>
              </a>
              <Link href="/auth/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/demo/naples-skyline.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-500/30 px-4 py-2 rounded-full mb-6">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              <span>Southwest Florida\'s Trusted Real Estate Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Home in <span className="text-blue-300">Naples</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Tony & Laura Harvey are a husband and wife team dedicated to helping you find your perfect home in Southwest Florida.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search by city, neighborhood, or ZIP..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.soldThisYear}</div>
                <div className="text-blue-200">Homes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.totalVolume}</div>
                <div className="text-blue-200">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.avgDaysOnMarket}</div>
                <div className="text-blue-200">Avg Days Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.clientSatisfaction}⭐</div>
                <div className="text-blue-200">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Property Type</h2>
            <p className="text-gray-600">We handle all property types across Southwest Florida</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Home, label: 'Homes for Sale', color: 'blue' },
              { icon: Home, label: 'Homes for Rent', color: 'green' },
              { icon: Building2, label: 'Commercial Sale', color: 'purple' },
              { icon: Building2, label: 'Commercial Lease', color: 'orange' },
              { icon: Factory, label: 'Industrial Sale', color: 'red' },
              { icon: Factory, label: 'Industrial Lease', color: 'yellow' },
            ].map((cat, i) => (
              <Link 
                key={i} 
                href={`/search?type=${cat.label.toLowerCase().replace(/ /g, '_')}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center group"
              >
                <cat.icon className={`w-10 h-10 mx-auto mb-3 text-${cat.color}-600 group-hover:scale-110 transition`} />
                <span className="font-medium text-gray-800">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-gray-600">{stats.totalListings} active listings across Southwest Florida</p>
            </div>
            <Link href="/search" className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition">
              View All Properties
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="text-8xl">{property.image}</span>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {property.status}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                    {property.daysOnMarket} days on market
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${property.price.toLocaleString()}{property.type === 'Rental' ? '/mo' : ''}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{property.type}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">{property.title}</h3>
                  <p className="text-gray-600 flex items-center mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address}
                  </p>
                  {property.beds && (
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <span>{property.beds} Beds</span>
                      <span>•</span>
                      <span>{property.baths} Baths</span>
                      <span>•</span>
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/properties/${property.id}`}
                    className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Tony & Laura Harvey</h2>
            <p className="text-xl text-gray-600">
              A husband and wife team dedicated to helping you find your dream home
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center text-5xl">
                    {agent.photo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{agent.name}</h3>
                    <p className="text-gray-500 mb-2">{agent.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {agent.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-6 mb-4">{agent.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {agent.specialties.map((spec, i) => (
                    <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agent.stats.sold}</div>
                    <div className="text-sm text-gray-500">Properties Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agent.stats.volume}</div>
                    <div className="text-sm text-gray-500">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agent.stats.satisfaction}⭐</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Story</h3>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                We are Tony & Laura Harvey! Why are we here? One reason… We are a husband and wife team that both became realtors to help people like you find their dream home.
              </p>
              <p>
                We met in April of 2007 in Key West, got engaged in Key West in 2012, and Married here in beautiful Naples a year later (2013).
              </p>
              <p>
                Tony grew up in Cincinnati, Ohio and graduated from Heidelberg University. After working in the mortgage industry for several years, he decided real estate was his passion. Laura was fortunate enough to be born right here in Naples, attending Lake Park Elementary, Gulfview Middle, and graduating from Naples High School in 2001.
              </p>
              <p>
                Together, we bring a unique combination of Tony\'s mortgage expertise and strong negotiation skills with Laura\'s deep local knowledge of Southwest Florida. We are confident that we are the team that can meet and exceed your real estate needs.
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold">2007</div>
                <div className="text-sm text-gray-500">Met in Key West</div>
              </div>
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold">2012</div>
                <div className="text-sm text-gray-500">Engaged</div>
              </div>
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold">2013</div>
                <div className="text-sm text-gray-500">Married in Naples</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Served */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Markets We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {['Naples', 'Fort Myers', 'Bonita Springs', 'Cape Coral', 'Lehigh Acres'].map((market) => (
              <Link 
                key={market}
                href={`/search?city=${market}`}
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl text-center hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
              >
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <span className="font-semibold">{market}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let Tony & Laura help you navigate the Southwest Florida real estate market with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search" className="px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:bg-gray-100 flex items-center justify-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Properties</span>
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-700 transition flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PP</span>
                </div>
                <span className="text-white font-bold">Premiere Plus Realty</span>
              </div>
              <p className="text-sm">Tony & Laura Harvey</p>
              <p className="text-sm">Your Dream Home Awaits</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/search" className="block hover:text-white">Search Properties</Link>
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/contact" className="block hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Property Types</h4>
              <div className="space-y-2 text-sm">
                <Link href="/search?type=residential" className="block hover:text-white">Residential</Link>
                <Link href="/search?type=commercial" className="block hover:text-white">Commercial</Link>
                <Link href="/search?type=industrial" className="block hover:text-white">Industrial</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> (239) 777-0155</p>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> info@listorbuyrealestate.com</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Naples, FL 34109</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 Premiere Plus Realty. Powered by <span className="text-blue-400 font-semibold">CR Realtor Platform</span></p>
            <p className="mt-2">Part of CR AudioViz AI, LLC | Fort Myers, Florida</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
