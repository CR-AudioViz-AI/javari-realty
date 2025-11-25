// lib/javari-client.ts
// Javari AI Integration for CR Realtor Platform
// Provides autonomous monitoring, error tracking, and AI assistance

import { createClient } from '@/lib/supabase/client'

interface JavariConfig {
  appId: string
  appName: string
  apiUrl: string
  autoMonitor?: boolean
}

interface ErrorReport {
  error_type: string
  message: string
  file_path?: string
  line_number?: number
  stack_trace?: string
  severity: 'error' | 'warning' | 'info'
  user_context?: Record<string, any>
}

interface PerformanceMetric {
  metric_name: string
  value: number
  url: string
  metadata?: Record<string, any>
}

class JavariSDK {
  private config: JavariConfig
  private supabase = createClient()
  private errorCount = 0
  private startTime = Date.now()

  constructor(config: JavariConfig) {
    this.config = {
      autoMonitor: true,
      ...config
    }
  }

  /**
   * Ask Javari AI for real estate help
   */
  async ask(question: string, context?: Record<string, any>) {
    try {
      const response = await fetch(`${this.config.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          appId: this.config.appId,
          context: {
            ...context,
            timestamp: new Date().toISOString(),
            page: typeof window !== 'undefined' ? window.location.pathname : ''
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Javari API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[Javari] Ask failed:', error)
      
      // Fallback response if Javari is unavailable
      return {
        message: "I'm currently unavailable, but I'll be back soon! In the meantime, try using our search to find properties, or contact one of our expert realtors.",
        fallback: true
      }
    }
  }

  /**
   * Get property recommendations based on user criteria
   */
  async recommendProperties(criteria: {
    budget?: number
    location?: string
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
    specialNeeds?: string[] // veterans, first-responders, seniors, etc.
  }) {
    try {
      const response = await fetch(`${this.config.apiUrl}/recommend/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...criteria,
          appId: this.config.appId
        })
      })

      if (!response.ok) throw new Error(`API error: ${response.statusText}`)
      
      return await response.json()
    } catch (error) {
      console.error('[Javari] Recommendation failed:', error)
      return { properties: [], error: true }
    }
  }

  /**
   * Generate market analysis for a location
   */
  async analyzeMarket(location: string) {
    try {
      const response = await fetch(`${this.config.apiUrl}/analyze/market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          appId: this.config.appId
        })
      })

      if (!response.ok) throw new Error(`API error: ${response.statusText}`)
      
      return await response.json()
    } catch (error) {
      console.error('[Javari] Market analysis failed:', error)
      return { error: true }
    }
  }

  /**
   * Track errors for self-healing
   */
  async trackError(error: ErrorReport) {
    this.errorCount++

    try {
      await fetch(`${this.config.apiUrl}/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...error,
          appId: this.config.appId,
          timestamp: new Date().toISOString()
        })
      })
    } catch (err) {
      // Silent fail - don't break the app if error tracking fails
      console.error('[Javari] Error tracking failed:', err)
    }
  }

  /**
   * Track performance metrics
   */
  async trackPerformance(metric: PerformanceMetric) {
    try {
      await fetch(`${this.config.apiUrl}/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metric,
          appId: this.config.appId,
          timestamp: new Date().toISOString()
        })
      })
    } catch (err) {
      // Silent fail
      console.error('[Javari] Performance tracking failed:', err)
    }
  }
}

let javariInstance: JavariSDK | null = null

/**
 * Initialize Javari SDK for CR Realtor Platform
 */
export function initJavari(): JavariSDK {
  if (javariInstance) {
    return javariInstance
  }

  javariInstance = new JavariSDK({
    appId: 'cr-realtor-platform',
    appName: 'CR Realtor Platform',
    apiUrl: process.env.NEXT_PUBLIC_JAVARI_API || 'https://javariai.com/api',
    autoMonitor: true
  })

  return javariInstance
}

/**
 * Get current Javari instance
 */
export function getJavari(): JavariSDK | null {
  return javariInstance
}

/**
 * Auto-initialize Javari on client side
 */
if (typeof window !== 'undefined') {
  const javari = initJavari()

  // Global error handler
  window.addEventListener('error', (event) => {
    javari.trackError({
      error_type: 'runtime',
      message: event.message,
      file_path: event.filename,
      line_number: event.lineno,
      stack_trace: event.error?.stack,
      severity: 'error',
      user_context: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    })
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    javari.trackError({
      error_type: 'runtime',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack_trace: event.reason?.stack,
      severity: 'error',
      user_context: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    })
  })

  // Performance monitoring
  if (window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart

        javari.trackPerformance({
          metric_name: 'page_load',
          value: pageLoadTime,
          url: window.location.pathname,
          metadata: {
            dns: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcp: perfData.connectEnd - perfData.connectStart,
            ttfb: perfData.responseStart - perfData.navigationStart,
            download: perfData.responseEnd - perfData.responseStart,
            domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart
          }
        })
      }, 0)
    })
  }
}

export { JavariSDK }
export default javariInstance
