// app/help/realtors/page.tsx
// Realtor Help Guide

import Link from 'next/link'
import { Users, Target, DollarSign, TrendingUp, Shield, CheckCircle, Book, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Realtor Help Guide | CR Realtor Platform',
  description: 'Complete guide for realtors using CR Realtor Platform. Learn how to serve all 20 social impact markets and grow your business.'
}

export default function RealtorHelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
              <span className="text-xl font-bold">CR Realtor Platform</span>
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Help Center
            </Link>
          </div>
        </div>
      </nav>

      <section className="py-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <Users className="w-16 h-16 mb-4" />
          <h1 className="text-5xl font-bold mb-4">Realtor Help Guide</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Everything you need to serve clients, close deals, and dominate 20 underserved markets worth $3.8 billion.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Getting Started (5 Minutes)</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Create Your Account</h3>
                  <p className="text-gray-600">Sign up at <Link href="/auth/signup" className="text-blue-600 hover:underline">craudiovizai.com/signup</Link>. Use your professional email. Complete your profile with license number, broker affiliation, and service areas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Explore All 20 Programs</h3>
                  <p className="text-gray-600">Visit each of the 20 social impact program pages. Bookmark the ones most relevant to your market. Use Javari AI to learn program details quickly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Add Your Listings</h3>
                  <p className="text-gray-600">Import listings via MLS, add manually, or sync from your existing CRM. Tag properties with relevant social impact categories.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Share With Clients</h3>
                  <p className="text-gray-600">Send program links to qualified clients. Use calculators during consultations. Let Javari handle initial Q&A 24/7.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">5</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Close More Deals</h3>
                  <p className="text-gray-600">Track leads, manage pipeline, coordinate with lenders. Platform handles program education so you focus on service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Mastering The 20 Programs</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">High-Volume Markets (Start Here)</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-blue-600 mb-1">Veterans ($239M Market)</div>
                  <p className="text-sm text-gray-600">VA loans, $0 down, no PMI. Base proximity search. Leverage military networks. Average commission: $12,500.</p>
                  <Link href="/veterans" className="text-sm text-blue-600 hover:underline">View Veterans Program →</Link>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 mb-1">Seniors 55+ ($478M Market)</div>
                  <p className="text-sm text-gray-600">Downsizing, accessibility features. Big opportunity in FL. Referrals common. Average commission: $15,200.</p>
                  <Link href="/seniors" className="text-sm text-blue-600 hover:underline">View Seniors Program →</Link>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 mb-1">First-Time Buyers ($120M Market)</div>
                  <p className="text-sm text-gray-600">Education-focused. Down payment assistance. Build long-term relationships. Average commission: $8,900.</p>
                  <Link href="/first-time-buyers" className="text-sm text-blue-600 hover:underline">View First-Time Buyers Program →</Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Niche Markets (Less Competition)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-green-600 mb-1">Remote Workers ($312M)</div>
                  <p className="text-xs text-gray-600">Gigabit internet, home office</p>
                  <Link href="/remote-workers" className="text-xs text-blue-600 hover:underline">Learn More →</Link>
                </div>
                <div>
                  <div className="font-semibold text-green-600 mb-1">Eco-Living ($287M)</div>
                  <p className="text-xs text-gray-600">Solar, sustainable, green certified</p>
                  <Link href="/eco-living" className="text-xs text-blue-600 hover:underline">Learn More →</Link>
                </div>
                <div>
                  <div className="font-semibold text-green-600 mb-1">LGBTQ+ ($234M)</div>
                  <p className="text-xs text-gray-600">Inclusive communities, safe spaces</p>
                  <Link href="/lgbtq" className="text-xs text-blue-600 hover:underline">Learn More →</Link>
                </div>
                <div>
                  <div className="font-semibold text-green-600 mb-1">Healthcare Workers ($98M)</div>
                  <p className="text-xs text-gray-600">Hospital proximity, shift-friendly</p>
                  <Link href="/healthcare-workers" className="text-xs text-blue-600 hover:underline">Learn More →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Using Javari AI Effectively</h2>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold mb-2">What Javari Does For You:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>24/7 Lead Qualification:</strong> Answers initial questions while you sleep</span></li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Property Recommendations:</strong> Suggests homes based on criteria</span></li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Program Education:</strong> Explains all 20 programs in detail</span></li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Market Analysis:</strong> Provides neighborhood insights</span></li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Warm Handoffs:</strong> Notifies you when lead is ready to talk</span></li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold mb-2">Best Practices:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Tell clients "Javari is available 24/7 - just click the chat button"</li>
                  <li>• Review Javari conversation logs to understand client needs</li>
                  <li>• Let Javari handle program details, you handle personal service</li>
                  <li>• Javari works WITH you, not instead of you</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Pricing & Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-transparent">
                <h3 className="text-xl font-bold mb-2">Solo Agent</h3>
                <div className="text-3xl font-bold mb-4">$399<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ All 20 programs</li>
                  <li>✓ Unlimited leads</li>
                  <li>✓ Javari AI access</li>
                  <li>✓ Property management</li>
                  <li>✓ Email support</li>
                </ul>
                <Link href="/auth/signup" className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700">Start Free Trial</Link>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-600">
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">MOST POPULAR</div>
                <h3 className="text-xl font-bold mb-2">Team (3-10)</h3>
                <div className="text-3xl font-bold mb-4">$349<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Everything in Solo</li>
                  <li>✓ Team collaboration</li>
                  <li>✓ Shared leads</li>
                  <li>✓ Team analytics</li>
                  <li>✓ Priority support</li>
                </ul>
                <Link href="/auth/signup" className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700">Start Free Trial</Link>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-transparent">
                <h3 className="text-xl font-bold mb-2">Broker (11+)</h3>
                <div className="text-3xl font-bold mb-4">$299<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Everything in Team</li>
                  <li>✓ White-label option</li>
                  <li>✓ Custom branding</li>
                  <li>✓ Broker dashboard</li>
                  <li>✓ Dedicated support</li>
                </ul>
                <Link href="/auth/signup" className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700">Start Free Trial</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions? We're Here to Help</h2>
          <p className="text-xl text-gray-600 mb-8">Email support@craudiovizai.com or call (239) 555-1234</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/help" className="px-8 py-4 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700">
              Back to Help Center
            </Link>
            <Link href="/auth/signup" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
