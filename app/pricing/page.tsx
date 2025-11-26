// app/pricing/page.tsx
// Realtor Pricing Page - Show value proposition and plans
// Clear, transparent pricing that beats all competitors

import Link from 'next/link'
import { Check, X, Star, Zap, Shield, Users, Building2, BarChart3, Phone, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Pricing | CR Realtor Platform',
  description: 'Simple, transparent pricing for real estate professionals. Start free, upgrade when you grow.'
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for solo agents just getting started',
    price: 99,
    billing: 'per agent/month',
    features: [
      { text: 'Personal website & branding', included: true },
      { text: 'Up to 50 property listings', included: true },
      { text: 'Lead capture forms', included: true },
      { text: 'Basic CRM', included: true },
      { text: 'Email templates', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Javari AI Assistant', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Team management', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    description: 'For growing agents who want AI-powered tools',
    price: 199,
    billing: 'per agent/month',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Unlimited property listings', included: true },
      { text: 'Javari AI Assistant', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Automated follow-ups', included: true },
      { text: 'Virtual tour integration', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Team management (up to 5)', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For teams and brokerages scaling up',
    price: 399,
    billing: 'per agent/month',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'White-label branding', included: true },
      { text: 'Advanced team analytics', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'API access', included: true },
      { text: 'SSO authentication', included: true },
      { text: 'Custom training', included: true },
      { text: '24/7 phone support', included: true },
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

const competitors = [
  { name: 'kvCORE', price: '$499+', aiAssistant: false, allPropertyTypes: false, dataOwnership: false },
  { name: 'BoomTown', price: '$1,000+', aiAssistant: false, allPropertyTypes: false, dataOwnership: false },
  { name: 'Follow Up Boss', price: '$69+', aiAssistant: false, allPropertyTypes: false, dataOwnership: false },
  { name: 'Sierra', price: '$399+', aiAssistant: false, allPropertyTypes: false, dataOwnership: false },
  { name: 'Ylopo', price: '$395+', aiAssistant: false, allPropertyTypes: false, dataOwnership: false },
  { name: 'CR Platform', price: '$99+', aiAssistant: true, allPropertyTypes: true, dataOwnership: true },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.'
  },
  {
    q: 'Do I own my data?',
    a: 'Yes, 100%. Unlike other platforms, you have full ownership and can export all your data anytime.'
  },
  {
    q: 'What property types are supported?',
    a: 'We support all 6 categories: Residential Buy/Rent, Commercial Buy/Rent, and Industrial Buy/Rent.'
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term contracts. All plans are month-to-month. Cancel anytime.'
  },
  {
    q: 'What is Javari AI?',
    a: 'Javari is your 24/7 AI assistant that handles lead qualification, appointment scheduling, and client follow-ups automatically.'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CR</span>
              </div>
              <span className="text-xl font-bold">CR Realtor Platform</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 mr-2" />
            <span className="font-medium">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Plans That Grow <span className="text-blue-600">With You</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no long-term contracts, and you own all your data.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl scale-105' 
                    : 'bg-white border-2 border-gray-100 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className={plan.popular ? 'text-blue-100' : 'text-gray-500'}>/{plan.billing}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      {feature.included ? (
                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} />
                      ) : (
                        <X className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-blue-300' : 'text-gray-300'}`} />
                      )}
                      <span className={!feature.included ? (plan.popular ? 'text-blue-200' : 'text-gray-400') : ''}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}
                  className={`block w-full py-4 rounded-xl font-bold text-center transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Compare</h2>
            <p className="text-xl text-gray-600">See why agents are switching to CR Realtor Platform</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Platform</th>
                  <th className="px-6 py-4 text-center font-semibold">Starting Price</th>
                  <th className="px-6 py-4 text-center font-semibold">AI Assistant</th>
                  <th className="px-6 py-4 text-center font-semibold">All 6 Property Types</th>
                  <th className="px-6 py-4 text-center font-semibold">Data Ownership</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {competitors.map((comp, i) => (
                  <tr key={comp.name} className={comp.name === 'CR Platform' ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 font-semibold">
                      {comp.name === 'CR Platform' ? (
                        <span className="text-blue-600 flex items-center">
                          {comp.name}
                          <Star className="w-4 h-4 ml-2 text-yellow-500" />
                        </span>
                      ) : comp.name}
                    </td>
                    <td className="px-6 py-4 text-center">{comp.price}</td>
                    <td className="px-6 py-4 text-center">
                      {comp.aiAssistant ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {comp.allPropertyTypes ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {comp.dataOwnership ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Powerful tools included in every plan</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: 'Javari AI', desc: '24/7 AI assistant for lead qualification' },
              { icon: Building2, title: 'All Property Types', desc: 'Residential, commercial, industrial' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track every metric that matters' },
              { icon: Shield, title: 'Data Ownership', desc: '100% yours, export anytime' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto grid gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of agents who switched to CR Realtor Platform and never looked back.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Talk to Sales</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 CR Realtor Platform. Part of CR AudioViz AI, LLC | Fort Myers, Florida</p>
        </div>
      </footer>
    </div>
  )
}
