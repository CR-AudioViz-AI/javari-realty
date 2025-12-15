import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Bot, Lock, Zap, CheckCircle, MessageSquare, Users, 
  Code, Star, ArrowRight
} from 'lucide-react'
import AIAssistantClient from './client'

export const metadata = {
  title: 'AI Assistant | CR Realtor Platform',
  description: 'AI-powered real estate assistant for you and your clients',
}

export default async function AIAssistantPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  // Check if user has AI Assistant add-on
  const { data: addon } = await supabase
    .from('addon_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('addon_id', ['ai-assistant', 'full-bundle'])
    .eq('status', 'active')
    .single()

  const hasAccess = !!addon

  // Check for realtor subscription discount
  const { data: realtorSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const hasRealtorAccount = !!realtorSub
  const discountPercent = hasRealtorAccount ? 20 : 0
  const basePrice = 49
  const finalPrice = Math.round(basePrice * (1 - discountPercent / 100))

  if (!hasAccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 text-white text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <Bot size={20} />
            <span className="font-medium">Premium Add-On</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Assistant Pro</h1>
          <p className="text-xl text-cyan-100 mb-6 max-w-2xl mx-auto">
            24/7 AI-powered assistant that answers your clients' real estate questions 
            with expert knowledge. Embed on your website or share directly.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <MessageSquare size={18} />
              <span>Instant Answers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Users size={18} />
              <span>Client Access</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Code size={18} />
              <span>Embeddable</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 max-w-md mx-auto mb-6">
            {hasRealtorAccount && (
              <div className="text-sm text-green-300 mb-2">
                ✓ Realtor account discount applied!
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              {discountPercent > 0 && (
                <span className="text-2xl text-white/50 line-through">${basePrice}</span>
              )}
              <span className="text-5xl font-bold">${finalPrice}</span>
              <span className="text-xl text-white/70">/month</span>
            </div>
          </div>

          <Link href={`/dashboard/checkout?addon=ai-assistant&discount=${discountPercent}`}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
              Unlock AI Assistant
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="p-3 bg-cyan-50 rounded-lg w-fit mb-4">
              <MessageSquare className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Expert Knowledge Base</h3>
            <p className="text-gray-600">
              Answers questions about buying, selling, mortgages, legal terms, 
              market conditions, and more with accurate, helpful information.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="p-3 bg-cyan-50 rounded-lg w-fit mb-4">
              <Users className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Share With Clients</h3>
            <p className="text-gray-600">
              Give clients access to instant answers 24/7. They get help 
              even when you're unavailable, improving their experience.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="p-3 bg-cyan-50 rounded-lg w-fit mb-4">
              <Code className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Embed on Your Website</h3>
            <p className="text-gray-600">
              Add the assistant to your personal website with a simple code snippet. 
              Branded with your name and contact info.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <div className="p-3 bg-cyan-50 rounded-lg w-fit mb-4">
              <Star className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Always Learning</h3>
            <p className="text-gray-600">
              The AI is continuously updated with the latest real estate 
              knowledge, market trends, and best practices.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">💡 Why Realtors Love This</h3>
          <ul className="space-y-2 text-amber-900">
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Reduces repetitive questions from clients</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Clients get instant help when you're busy or after hours</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Professional, consistent answers every time</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Makes your website more valuable and engaging</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  // Full access - render the actual assistant
  return <AIAssistantClient />
}
