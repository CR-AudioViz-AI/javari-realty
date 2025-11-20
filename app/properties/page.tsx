import Link from 'next/link'
import { Search, Bed, Bath, Square, MapPin } from 'lucide-react'

export default function PropertiesPage() {
  // Mock data - will connect to real data later
  const properties = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Fort Myers',
      state: 'FL',
      price: 450000,
      beds: 3,
      baths: 2,
      sqft: 2100,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600',
      status: 'For Sale'
    },
    {
      id: 2,
      address: '456 Ocean Drive',
      city: 'Cape Coral',
      state: 'FL',
      price: 675000,
      beds: 4,
      baths: 3,
      sqft: 2800,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
      status: 'For Sale'
    },
    {
      id: 3,
      address: '789 Palm Avenue',
      city: 'Naples',
      state: 'FL',
      price: 325000,
      beds: 2,
      baths: 2,
      sqft: 1600,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      status: 'For Sale'
    },
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

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Your Dream Home</h1>
          <p className="text-blue-100 mb-6">Search thousands of properties across Florida</p>
          
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                className="px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500">
                <option>Any Price</option>
                <option>$0 - $250k</option>
                <option>$250k - $500k</option>
                <option>$500k - $1M</option>
                <option>$1M+</option>
              </select>
              <select className="px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500">
                <option>Any Beds</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Properties <span className="text-gray-500 font-normal">({properties.length} results)</span>
          </h2>
          <select className="px-4 py-2 border rounded-lg text-sm">
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={property.image}
                  alt={property.address}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                  {property.status}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-bold text-blue-600 mb-1">
                  ${property.price.toLocaleString()}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}, {property.city}, {property.state}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.beds} bd
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.baths} ba
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {property.sqft.toLocaleString()} sqft
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Not finding what you're looking for?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Work with one of our expert realtors to find the perfect home for your needs.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  )
}
