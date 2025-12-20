import Link from 'next/link'
import { Search, MapPin, Home, TrendingUp, Users, Award, Phone, Mail, ArrowRight, Star, CheckCircle } from 'lucide-react'

const FEATURED_PROPERTIES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    price: 425000,
    beds: 4, baths: 3, sqft: 2400,
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    status: 'Active'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    price: 389000,
    beds: 3, baths: 2, sqft: 2100,
    address: '1420 SE 47th St',
    city: 'Cape Coral',
    status: 'Active'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    price: 459000,
    beds: 4, baths: 2.5, sqft: 2650,
    address: '3500 Oasis Blvd',
    city: 'Cape Coral',
    status: 'Pending'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    price: 1250000,
    beds: 4, baths: 3.5, sqft: 3800,
    address: '1250 5th Ave S',
    city: 'Naples',
    status: 'Active'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    price: 675000,
    beds: 5, baths: 4, sqft: 3200,
    address: '8901 Cypress Lake Dr',
    city: 'Fort Myers',
    status: 'Active'
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80',
    price: 549000,
    beds: 4, baths: 3, sqft: 2800,
    address: '28500 Bonita Crossings Blvd',
    city: 'Bonita Springs',
    status: 'Active'
  }
]

const SERVICE_AREAS = [
  { name: 'Naples', count: 6596 },
  { name: 'Cape Coral', count: 5432 },
  { name: 'Lehigh Acres', count: 4753 },
  { name: 'Fort Myers', count: 4004 },
  { name: 'Bonita Springs', count: 1303 },
  { name: 'Golden Gate Estates', count: 860 },
  { name: 'Estero', count: 778 },
  { name: 'Marco Island', count: 710 }
]

const TESTIMONIALS = [
  {
    name: 'Michael & Sarah Johnson',
    text: 'Tony made our home buying experience seamless. His knowledge of the Southwest Florida market is unmatched!',
    rating: 5,
    location: 'Naples'
  },
  {
    name: 'Robert Williams',
    text: 'Sold our home in just 12 days! Tony\'s marketing strategy and negotiation skills are exceptional.',
    rating: 5,
    location: 'Cape Coral'
  },
  {
    name: 'Jennifer Martinez',
    text: 'As first-time buyers, we were nervous. Tony guided us through every step with patience and expertise.',
    rating: 5,
    location: 'Fort Myers'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Find Your Dream Home in<br />Southwest Florida
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Your trusted partner for buying and selling homes in Naples, Fort Myers, Cape Coral, and beyond. 
            Expert guidance from start to closing.
          </p>
          
          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by city, ZIP, or address..."
                  className="w-full pl-14 pr-4 py-5 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Link 
                href="/search"
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                Search Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold">24,000+</div>
              <div className="text-blue-200">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">1,200+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">8</div>
              <div className="text-blue-200">Markets Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Southwest Florida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICE_AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/search?city=${encodeURIComponent(area.name)}`}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-blue-600">{area.name}</h3>
                    <p className="text-gray-500">{area.count.toLocaleString()} listings</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link href="/search" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROPERTIES.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
              >
                <div className="relative h-64">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    property.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {property.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${property.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span>{property.beds} bd</span>
                    <span>{property.baths} ba</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.city}, FL
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Your Trusted Southwest Florida Real Estate Experts</h2>
              <p className="text-xl text-blue-100 mb-6">
                We are Tony & Laura Harvey! We're a husband and wife team that became realtors to help people 
                like you find their dream home.
              </p>
              <p className="text-blue-200 mb-6">
                We met in April 2007 in Key West, got engaged in 2012, and married here in beautiful Naples 
                a year later. Laura was fortunate to be born in Naples, giving us deep local roots. Tony brings 
                his mortgage industry background and strong negotiation skills to ensure you get the best deal.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Licensed REALTORS®</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Premiere Plus Realty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>Mortgage Expertise</span>
                </div>
              </div>
              <div className="flex gap-4">
                <a 
                  href="tel:239-777-0155"
                  className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  (239) 777-0155
                </a>
                <Link 
                  href="/contact"
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                alt="Southwest Florida Real Estate"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-xl p-6 shadow-xl">
                <div className="text-4xl font-bold text-blue-600">15+</div>
                <div className="text-gray-600">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.location}, FL</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let us help you navigate the Southwest Florida real estate market. 
            Contact us today for a free consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/search"
              className="px-8 py-4 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search Properties
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 flex items-center gap-2"
            >
              Agent Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Tony & Laura Harvey</h3>
              <p className="text-gray-400 mb-4">
                Premiere Plus Realty<br />
                9015 Strada Stell Ct Unit 104<br />
                Naples, FL 34109
              </p>
              <p className="text-gray-400">
                <Phone className="w-4 h-4 inline mr-2" />
                (239) 777-0155
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search" className="hover:text-white">Search Homes</Link></li>
                <li><Link href="/sell" className="hover:text-white">Sell Your Home</Link></li>
                <li><Link href="/buy" className="hover:text-white">Buy a Home</Link></li>
                <li><Link href="/finance" className="hover:text-white">Financing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Service Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/search?city=Naples" className="hover:text-white">Naples</Link></li>
                <li><Link href="/search?city=Fort+Myers" className="hover:text-white">Fort Myers</Link></li>
                <li><Link href="/search?city=Cape+Coral" className="hover:text-white">Cape Coral</Link></li>
                <li><Link href="/search?city=Bonita+Springs" className="hover:text-white">Bonita Springs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-white">Community Guides</Link></li>
                <li><Link href="/calculators" className="hover:text-white">Mortgage Calculator</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Tony & Laura Harvey, Premiere Plus Realty. All rights reserved.</p>
            <p className="mt-2">Powered by CR AudioViz AI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
