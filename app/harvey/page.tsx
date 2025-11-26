// CLEAN BUILD: 2025-11-25 21:30 EST
// app/demo/tony-laura/page.tsx
// Custom Demo Site for Tony & Laura Harvey - Premiere Plus Realty

import Link from 'next/link'
import Image from 'next/image'
import { Home, Phone, Mail, MapPin, Bed, Bath, Square, DollarSign, Star, Heart, Search, Menu, ChevronRight, Award, Users, Clock, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Tony & Laura Harvey | Premiere Plus Realty | Naples FL Real Estate',
  description: 'Tony & Laura Harvey - Your Naples, Fort Myers, Bonita Springs & Lehigh Acres real estate experts. Husband and wife team helping you find your dream home since 2007.'
}

// Demo properties for Tony & Laura
const demoProperties = [
  {
    id: 1,
    title: "Stunning Waterfront Villa in Port Royal",
    address: "3200 Gordon Drive, Naples, FL 34102",
    price: 8950000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7200,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    agent: "Tony Harvey",
    featured: true,
    status: "Active"
  },
  {
    id: 2,
    title: "Golf Course Estate in Grey Oaks",
    address: "2850 Estates Drive, Naples, FL 34105",
    price: 3450000,
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4800,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    agent: "Laura Harvey",
    featured: true,
    status: "Active"
  },
  {
    id: 3,
    title: "Beachfront Condo at Park Shore",
    address: "4021 Gulf Shore Blvd N #1503, Naples, FL 34103",
    price: 2195000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    agent: "Tony Harvey",
    featured: true,
    status: "Active"
  },
  {
    id: 4,
    title: "Pelican Bay Classic Home",
    address: "707 Willowbrook Drive, Naples, FL 34108",
    price: 1875000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    agent: "Laura Harvey",
    featured: false,
    status: "Active"
  },
  {
    id: 5,
    title: "Modern Townhome in Mercato",
    address: "9115 Strada Place #5201, Naples, FL 34108",
    price: 1295000,
    bedrooms: 3,
    bathrooms: 4,
    sqft: 2800,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    agent: "Tony Harvey",
    featured: false,
    status: "Active"
  },
  {
    id: 6,
    title: "Lakefront Villa in Lely Resort",
    address: "8540 Mustang Drive, Naples, FL 34113",
    price: 895000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    agent: "Laura Harvey",
    featured: false,
    status: "Active"
  },
  {
    id: 7,
    title: "Estate Home in Quail West",
    address: "6461 Highcroft Drive, Naples, FL 34119",
    price: 5250000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6500,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
    agent: "Tony Harvey",
    featured: true,
    status: "Active"
  },
  {
    id: 8,
    title: "Starter Home in Golden Gate City",
    address: "4821 28th Place SW, Naples, FL 34116",
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
    agent: "Laura Harvey",
    featured: false,
    status: "Active"
  }
]

const testimonials = [
  {
    name: "Michael & Jennifer Thompson",
    location: "Pelican Bay",
    text: "Tony and Laura made our relocation from Chicago seamless. Their knowledge of Naples neighborhoods helped us find the perfect home for our family. Highly recommend!",
    rating: 5
  },
  {
    name: "Robert Patterson",
    location: "Grey Oaks",
    text: "Laura's local expertise is unmatched. Born and raised in Naples, she knew exactly which communities would fit our lifestyle. We couldn't be happier.",
    rating: 5
  },
  {
    name: "Sandra Williams",
    location: "Bonita Springs",
    text: "Tony's mortgage background gave us confidence throughout the negotiation process. He saved us over $30,000 on our purchase. True professionals!",
    rating: 5
  }
]

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  }
  return `$${(price / 1000).toFixed(0)}K`
}

export default function TonyLauraDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tony & Laura Harvey</h1>
                <p className="text-sm text-blue-600">Premiere Plus Realty</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#properties" className="text-gray-700 hover:text-blue-600 font-medium">Properties</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About Us</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </nav>
            
            {/* CTA */}
            <div className="flex items-center space-x-4">
              <a href="tel:239-555-TEAM" className="hidden md:flex items-center text-blue-600 font-semibold">
                <Phone className="w-4 h-4 mr-2" />
                (239) 555-TEAM
              </a>
              <a href="#contact" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                Schedule Showing
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920')] opacity-20 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-500/30 backdrop-blur-sm px-6 py-2 rounded-full mb-8">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-blue-100">Naples' #1 Husband & Wife Real Estate Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Home in<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Southwest Florida</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              We're Tony & Laura Harvey — a husband and wife team with deep Naples roots 
              and the expertise to help you find your perfect home.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Naples, Bonita Springs, Fort Myers..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select className="px-4 py-4 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Single Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Commercial</option>
                </select>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">200+</div>
                <div className="text-blue-200 text-sm">Homes Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">17</div>
                <div className="text-blue-200 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">4.9</div>
                <div className="text-blue-200 text-sm">Star Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400">$250M+</div>
                <div className="text-blue-200 text-sm">In Sales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Listings</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked properties in Naples, Bonita Springs, and Southwest Florida
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {property.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-sm font-bold rounded-full">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    {property.status}
                  </div>
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address.split(',')[0]}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                    <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> {property.bedrooms} Beds</span>
                    <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> {property.bathrooms} Baths</span>
                    <span className="flex items-center"><Square className="w-4 h-4 mr-1" /> {property.sqft.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-gray-500">Listed by {property.agent}</span>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">View Details →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition inline-flex items-center">
              View All Listings
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Tony & Laura</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  <strong>We are a husband and wife team</strong> that both became realtors to help people like you find their dream home. 
                  We met in April of 2007 in Key West, got engaged in Key West in 2012, and married here in beautiful Naples a year later (2013).
                </p>
                <p className="mb-4">
                  <strong>Laura</strong> was fortunate enough to be born in the quaint little town of Naples. She attended Lake Park Elementary, 
                  Gulfview Middle, and graduated from Naples High School in 2001. Her deep local roots give her unmatched knowledge of 
                  Collier County neighborhoods.
                </p>
                <p className="mb-4">
                  <strong>Tony</strong> grew up in Cincinnati, Ohio and graduated from Heidelberg University in Tiffin, Ohio. 
                  He moved to Fort Myers in 2005 and has lived throughout Southwest Florida. With his mortgage industry background 
                  and strong negotiation skills, Tony brings financial expertise to every transaction.
                </p>
                <p>
                  <strong>Together, we're confident</strong> that we are the team that can meet and exceed your real estate needs 
                  in Naples, Fort Myers, Bonita Springs, and Lehigh Acres.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-900">Local Expertise</div>
                  <div className="text-sm text-gray-600">Laura: Naples native since birth</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-900">Financial Savvy</div>
                  <div className="text-sm text-gray-600">Tony: Mortgage industry veteran</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-900">Full Coverage</div>
                  <div className="text-sm text-gray-600">Naples to Fort Myers & beyond</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-900">Dedicated Team</div>
                  <div className="text-sm text-gray-600">Two agents, one focused goal</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                      👨‍💼
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900">Tony Harvey</h3>
                    <p className="text-blue-600 text-center text-sm mb-3">REALTOR®</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✓ Heidelberg University</p>
                      <p>✓ Mortgage Expert</p>
                      <p>✓ Negotiation Pro</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                      👩‍💼
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900">Laura Harvey</h3>
                    <p className="text-blue-600 text-center text-sm mb-3">REALTOR®</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>✓ Naples Native</p>
                      <p>✓ Local Expert</p>
                      <p>✓ Community Ties</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-white rounded-xl p-4 text-center">
                  <p className="text-gray-600 italic">"Your dream home is our mission."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-blue-200">Real reviews from real homeowners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-blue-800/50 rounded-2xl p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t border-blue-700 pt-4">
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-blue-300 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Areas We Serve</h2>
            <p className="text-xl text-gray-600">Your Southwest Florida real estate experts</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Naples', 'Fort Myers', 'Bonita Springs', 'Lehigh Acres'].map((city) => (
              <div key={city} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition">
                <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 text-lg">{city}</h3>
                <p className="text-gray-500 text-sm">FL</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Find Your Dream Home?</h2>
              <p className="text-xl text-gray-600">Contact Tony & Laura today</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="tel:239-555-TEAM" className="flex items-center text-gray-700 hover:text-blue-600">
                    <Phone className="w-6 h-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">(239) 555-TEAM</div>
                      <div className="text-sm text-gray-500">Call or Text Anytime</div>
                    </div>
                  </a>
                  <a href="mailto:team@listorbuyrealestate.com" className="flex items-center text-gray-700 hover:text-blue-600">
                    <Mail className="w-6 h-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">team@listorbuyrealestate.com</div>
                      <div className="text-sm text-gray-500">Email Us</div>
                    </div>
                  </a>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-6 h-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">Premiere Plus Realty</div>
                      <div className="text-sm text-gray-500">Naples, FL</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-6 h-6 mr-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">Available 7 Days a Week</div>
                      <div className="text-sm text-gray-500">Flexible scheduling</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                  <option>I'm looking to...</option>
                  <option>Buy a Home</option>
                  <option>Sell My Home</option>
                  <option>Both Buy and Sell</option>
                  <option>Just Browsing</option>
                </select>
                <textarea 
                  placeholder="Tell us about your dream home..." 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold">Tony & Laura Harvey</div>
                  <div className="text-sm text-gray-400">Premiere Plus Realty</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Husband and wife team helping you find your dream home in Southwest Florida since 2007.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#properties" className="hover:text-white">Properties</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-white">Reviews</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Naples</a></li>
                <li><a href="#" className="hover:text-white">Fort Myers</a></li>
                <li><a href="#" className="hover:text-white">Bonita Springs</a></li>
                <li><a href="#" className="hover:text-white">Lehigh Acres</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>(239) 555-TEAM</li>
                <li>team@listorbuyrealestate.com</li>
                <li>Premiere Plus Realty</li>
                <li>Naples, FL</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Tony & Laura Harvey | Premiere Plus Realty | All Rights Reserved</p>
            <p className="mt-2">Powered by <span className="text-blue-400">CR Realtor Platform</span> by CR AudioViz AI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
