'use client';

import React, { useState, useEffect } from 'react';
import { ServiceProvider, ProviderCategory, PROVIDER_CATEGORIES } from '@/types/marketplace';

export default function MarketplacePage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price'>('rating');

  useEffect(() => {
    loadProviders();
  }, [selectedCategory, zipCode]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (zipCode) params.set('zip', zipCode);
      
      const response = await fetch(`/api/marketplace/providers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers
    .filter(p => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return p.business_name.toLowerCase().includes(query) ||
               p.description.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.review_count - a.review_count;
      return a.price_range.length - b.price_range.length;
    });

  const categories = Object.entries(PROVIDER_CATEGORIES);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">🏪 Service Provider Directory</h1>
          <p className="text-indigo-100 mt-1">Find trusted professionals for all your home needs</p>
          
          {/* Search Bar */}
          <div className="mt-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-3 rounded-lg text-gray-900"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-32 px-4 py-3 rounded-lg text-gray-900"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 rounded-lg text-gray-900"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as ProviderCategory)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedCategory === key ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{val.icon}</span>
                    <span className="text-sm">{val.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Category Selector */}
            <div className="lg:hidden mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProviderCategory | 'all')}
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="all">All Categories</option>
                {categories.map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Provider Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-600">No providers found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ provider }: { provider: ServiceProvider }) {
  const category = PROVIDER_CATEGORIES[provider.category];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Logo/Icon */}
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
          {provider.logo_url ? (
            <img src={provider.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            category?.icon || '🏢'
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{provider.business_name}</h3>
              <p className="text-sm text-gray-500">{category?.label}</p>
            </div>
            {provider.subscription_tier === 'premium' || provider.subscription_tier === 'website' ? (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                ⭐ Featured
              </span>
            ) : null}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= provider.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {provider.rating.toFixed(1)} ({provider.review_count} reviews)
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {provider.is_verified && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">✓ Verified</span>
            )}
            {provider.is_licensed && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Licensed</span>
            )}
            {provider.is_insured && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Insured</span>
            )}
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {provider.price_range}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{provider.description}</p>

          {/* Response Time */}
          {provider.response_time_hours && (
            <p className="text-xs text-gray-500 mt-2">
              ⚡ Usually responds in {provider.response_time_hours < 24 ? `${provider.response_time_hours} hours` : `${Math.round(provider.response_time_hours / 24)} days`}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t">
        <a
          href={`tel:${provider.phone}`}
          className="flex-1 py-2 text-center border rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          📞 Call
        </a>
        <button className="flex-1 py-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          Get Quote
        </button>
        <button className="py-2 px-3 border rounded-lg hover:bg-gray-50">
          ❤️
        </button>
      </div>
    </div>
  );
}
