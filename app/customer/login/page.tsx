'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Phone,
  CheckCircle,
} from 'lucide-react'

export default function CustomerLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Save to localStorage for demo
      const customers = JSON.parse(localStorage.getItem('cr_customers') || '[]')
      const exists = customers.find((c: any) => c.email === formData.email)
      if (exists) {
        setError('An account with this email already exists')
        setLoading(false)
        return
      }

      const newCustomer = {
        id: crypto.randomUUID(),
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        created_at: new Date().toISOString(),
        saved_properties: [],
        saved_searches: [],
        showing_requests: [],
      }
      customers.push(newCustomer)
      localStorage.setItem('cr_customers', JSON.stringify(customers))
      localStorage.setItem('cr_current_customer', JSON.stringify(newCustomer))
      
      setLoading(false)
      router.push('/customer/dashboard')
      return
    }

    if (mode === 'login') {
      const customers = JSON.parse(localStorage.getItem('cr_customers') || '[]')
      const customer = customers.find((c: any) => c.email === formData.email && c.password === formData.password)
      
      if (!customer) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      localStorage.setItem('cr_current_customer', JSON.stringify(customer))
      setLoading(false)
      router.push('/customer/dashboard')
      return
    }

    if (mode === 'forgot') {
      // Demo: just show success message
      setSuccess('If an account exists with this email, you will receive a password reset link.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">CR Realty</span>
          </div>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-6">Find Your Dream Home</h1>
          <p className="text-xl text-blue-100 mb-8">
            Access your personalized property search, saved listings, and connect with your dedicated agent.
          </p>
          
          <div className="space-y-4">
            {[
              'Save your favorite properties',
              'Schedule showings online',
              'Track your home search progress',
              'Direct messaging with your agent',
              'Get instant listing alerts',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-sm">
          © 2024 CR Realty. Powered by CR AudioViz AI
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CR Realty</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-gray-500 mb-6">
              {mode === 'login' && 'Sign in to access your property dashboard'}
              {mode === 'register' && 'Join us to start your home search journey'}
              {mode === 'forgot' && 'Enter your email to reset your password'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        required
                        placeholder="John Smith"
                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              {mode === 'login' && (
                <p className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <button onClick={() => setMode('login')} className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Are you a real estate agent?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Agent Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
