'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, Home, Percent, Building2,
  Calendar, RefreshCw, Loader2, ArrowUpRight, ArrowDownRight,
  BarChart3, LineChart, PieChart, Activity, Target, Zap,
  Info, ExternalLink, Clock, AlertTriangle
} from 'lucide-react'

interface FREDSeries {
  id: string
  title: string
  value: number
  previousValue: number
  change: number
  changePercent: number
  date: string
  unit: string
}

interface MarketData {
  mortgageRate30: FREDSeries | null
  mortgageRate15: FREDSeries | null
  caseShillerIndex: FREDSeries | null
  housingStarts: FREDSeries | null
  existingHomeSales: FREDSeries | null
  newHomeSales: FREDSeries | null
  medianHomePrice: FREDSeries | null
  unemploymentRate: FREDSeries | null
  cpi: FREDSeries | null
  fedFundsRate: FREDSeries | null
}

// FRED API Series IDs
const FRED_SERIES = {
  mortgageRate30: 'MORTGAGE30US',
  mortgageRate15: 'MORTGAGE15US',
  caseShillerIndex: 'CSUSHPINSA',
  housingStarts: 'HOUST',
  existingHomeSales: 'EXHOSLUSM495S',
  newHomeSales: 'HSN1F',
  medianHomePrice: 'MSPUS',
  unemploymentRate: 'UNRATE',
  cpi: 'CPIAUCSL',
  fedFundsRate: 'FEDFUNDS',
}

const FRED_API_KEY = '91357ea24e43b5c7a3fd690148a3fbc4'

export default function MarketAnalyticsPage() {
  const [data, setData] = useState<MarketData>({
    mortgageRate30: null,
    mortgageRate15: null,
    caseShillerIndex: null,
    housingStarts: null,
    existingHomeSales: null,
    newHomeSales: null,
    medianHomePrice: null,
    unemploymentRate: null,
    cpi: null,
    fedFundsRate: null,
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState('rates')

  const fetchFREDData = async (seriesId: string): Promise<FREDSeries | null> => {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=2`
      )
      const result = await response.json()
      
      if (result.observations && result.observations.length >= 2) {
        const current = parseFloat(result.observations[0].value)
        const previous = parseFloat(result.observations[1].value)
        const change = current - previous
        const changePercent = (change / previous) * 100

        // Get series info for title
        const infoRes = await fetch(
          `https://api.stlouisfed.org/fred/series?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
        )
        const infoData = await infoRes.json()
        
        return {
          id: seriesId,
          title: infoData.seriess?.[0]?.title || seriesId,
          value: current,
          previousValue: previous,
          change,
          changePercent,
          date: result.observations[0].date,
          unit: infoData.seriess?.[0]?.units || '',
        }
      }
    } catch (error) {
      console.error(`Error fetching ${seriesId}:`, error)
    }
    return null
  }

  const loadAllData = async () => {
    setLoading(true)
    
    const results = await Promise.all([
      fetchFREDData(FRED_SERIES.mortgageRate30),
      fetchFREDData(FRED_SERIES.mortgageRate15),
      fetchFREDData(FRED_SERIES.caseShillerIndex),
      fetchFREDData(FRED_SERIES.housingStarts),
      fetchFREDData(FRED_SERIES.existingHomeSales),
      fetchFREDData(FRED_SERIES.newHomeSales),
      fetchFREDData(FRED_SERIES.medianHomePrice),
      fetchFREDData(FRED_SERIES.unemploymentRate),
      fetchFREDData(FRED_SERIES.cpi),
      fetchFREDData(FRED_SERIES.fedFundsRate),
    ])

    setData({
      mortgageRate30: results[0],
      mortgageRate15: results[1],
      caseShillerIndex: results[2],
      housingStarts: results[3],
      existingHomeSales: results[4],
      newHomeSales: results[5],
      medianHomePrice: results[6],
      unemploymentRate: results[7],
      cpi: results[8],
      fedFundsRate: results[9],
    })

    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const formatValue = (series: FREDSeries | null, prefix = '', suffix = '') => {
    if (!series) return 'N/A'
    if (series.id === 'MSPUS') return `$${(series.value / 1000).toFixed(0)}K`
    if (series.id.includes('MORTGAGE') || series.id === 'UNRATE' || series.id === 'FEDFUNDS') return `${series.value.toFixed(2)}%`
    if (series.id === 'HOUST' || series.id === 'HSN1F') return `${(series.value / 1000).toFixed(0)}K`
    if (series.id === 'EXHOSLUSM495S') return `${(series.value / 1000000).toFixed(2)}M`
    return `${prefix}${series.value.toLocaleString()}${suffix}`
  }

  const getTrend = (series: FREDSeries | null) => {
    if (!series) return null
    return series.change >= 0 ? 'up' : 'down'
  }

  const MetricCard = ({ 
    title, 
    series, 
    icon: Icon, 
    color,
    invertTrend = false,
    description 
  }: { 
    title: string
    series: FREDSeries | null
    icon: any
    color: string
    invertTrend?: boolean
    description?: string
  }) => {
    const trend = getTrend(series)
    const isPositive = invertTrend ? trend === 'down' : trend === 'up'
    
    return (
      <div className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(series?.changePercent || 0).toFixed(2)}%
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold">{formatValue(series)}</p>
        {series && (
          <p className="text-xs text-gray-400 mt-1">
            Updated: {new Date(series.date).toLocaleDateString()}
          </p>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-2 border-t pt-2">{description}</p>
        )}
      </div>
    )
  }

  const TABS = [
    { id: 'rates', label: 'Interest Rates', icon: Percent },
    { id: 'housing', label: 'Housing Market', icon: Home },
    { id: 'economy', label: 'Economy', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Zap },
  ]

  // Generate AI insights based on data
  const generateInsights = () => {
    const insights = []
    
    if (data.mortgageRate30) {
      if (data.mortgageRate30.value < 7) {
        insights.push({
          type: 'positive',
          title: 'Favorable Rate Environment',
          text: `30-year rates at ${data.mortgageRate30.value.toFixed(2)}% are historically moderate. Good time for buyers to lock in rates.`
        })
      } else {
        insights.push({
          type: 'neutral',
          title: 'Rate Watch',
          text: `Rates at ${data.mortgageRate30.value.toFixed(2)}% may soften as Fed signals potential cuts. Consider rate locks with float-down options.`
        })
      }
    }

    if (data.medianHomePrice && data.caseShillerIndex) {
      if (data.caseShillerIndex.changePercent > 0) {
        insights.push({
          type: 'positive',
          title: 'Appreciation Continues',
          text: `Home prices up ${data.caseShillerIndex.changePercent.toFixed(1)}% - equity building remains strong for homeowners.`
        })
      }
    }

    if (data.housingStarts && data.housingStarts.change > 0) {
      insights.push({
        type: 'positive',
        title: 'Inventory Relief Coming',
        text: `Housing starts increased - new construction may ease tight inventory conditions in 6-12 months.`
      })
    }

    if (data.unemploymentRate && data.unemploymentRate.value < 5) {
      insights.push({
        type: 'positive',
        title: 'Strong Employment',
        text: `Unemployment at ${data.unemploymentRate.value}% supports housing demand and mortgage qualification rates.`
      })
    }

    // Add market timing insight
    insights.push({
      type: 'strategy',
      title: 'Buyer Strategy',
      text: data.mortgageRate30 && data.mortgageRate30.change < 0 
        ? 'Rates trending down - consider waiting briefly but be ready to act quickly.'
        : 'In rising rate environments, buyers benefit from acting decisively. Every 0.5% rate increase adds ~5% to monthly payments.'
    })

    insights.push({
      type: 'strategy',
      title: 'Seller Strategy',
      text: data.existingHomeSales && data.existingHomeSales.change < 0
        ? 'Sales volume declining - price competitively and consider incentives like rate buydowns.'
        : 'Active buyer demand - well-priced homes moving quickly. Focus on presentation and strategic pricing.'
    })

    return insights
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Market Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time economic indicators powered by Federal Reserve (FRED) data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock size={14} />
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={loadAllData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 mb-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-blue-200 text-sm">30-Year Fixed</p>
            <p className="text-2xl font-bold">
              {data.mortgageRate30 ? `${data.mortgageRate30.value.toFixed(2)}%` : '...'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">Median Home Price</p>
            <p className="text-2xl font-bold">
              {data.medianHomePrice ? `$${(data.medianHomePrice.value / 1000).toFixed(0)}K` : '...'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">Unemployment</p>
            <p className="text-2xl font-bold">
              {data.unemploymentRate ? `${data.unemploymentRate.value.toFixed(1)}%` : '...'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-sm">Fed Funds Rate</p>
            <p className="text-2xl font-bold">
              {data.fedFundsRate ? `${data.fedFundsRate.value.toFixed(2)}%` : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600">Loading market data from FRED...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="30-Year Fixed Rate"
                  series={data.mortgageRate30}
                  icon={Home}
                  color="bg-blue-100 text-blue-600"
                  invertTrend
                  description="Most common mortgage type"
                />
                <MetricCard
                  title="15-Year Fixed Rate"
                  series={data.mortgageRate15}
                  icon={Home}
                  color="bg-green-100 text-green-600"
                  invertTrend
                  description="Lower rate, higher payments"
                />
                <MetricCard
                  title="Fed Funds Rate"
                  series={data.fedFundsRate}
                  icon={Building2}
                  color="bg-purple-100 text-purple-600"
                  description="Influences all interest rates"
                />
                <MetricCard
                  title="Inflation (CPI)"
                  series={data.cpi}
                  icon={TrendingUp}
                  color="bg-orange-100 text-orange-600"
                  invertTrend
                  description="Consumer Price Index"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <Info size={18} /> Rate Impact Calculator
                </h3>
                <p className="text-amber-900 text-sm mb-3">
                  On a $400,000 loan, every 0.25% rate change affects monthly payment by ~$60
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">At 6.0%</p>
                    <p className="font-bold">$2,398/mo</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">At 6.5%</p>
                    <p className="font-bold">$2,528/mo</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">At 7.0%</p>
                    <p className="font-bold">$2,661/mo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'housing' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Median Home Price"
                  series={data.medianHomePrice}
                  icon={DollarSign}
                  color="bg-green-100 text-green-600"
                  description="U.S. median sale price"
                />
                <MetricCard
                  title="Case-Shiller Index"
                  series={data.caseShillerIndex}
                  icon={LineChart}
                  color="bg-blue-100 text-blue-600"
                  description="Home price index (20 cities)"
                />
                <MetricCard
                  title="Housing Starts"
                  series={data.housingStarts}
                  icon={Building2}
                  color="bg-purple-100 text-purple-600"
                  description="New construction (annualized)"
                />
                <MetricCard
                  title="Existing Home Sales"
                  series={data.existingHomeSales}
                  icon={Home}
                  color="bg-amber-100 text-amber-600"
                  description="Monthly sales volume"
                />
                <MetricCard
                  title="New Home Sales"
                  series={data.newHomeSales}
                  icon={Home}
                  color="bg-cyan-100 text-cyan-600"
                  description="New construction sales"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-2">📊 Market Snapshot</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Price Trend</p>
                    <p className="font-semibold text-lg flex items-center gap-1">
                      {data.caseShillerIndex && data.caseShillerIndex.changePercent > 0 ? (
                        <><TrendingUp className="text-green-600" size={18} /> Appreciating</>
                      ) : (
                        <><TrendingDown className="text-red-600" size={18} /> Cooling</>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sales Activity</p>
                    <p className="font-semibold text-lg flex items-center gap-1">
                      {data.existingHomeSales && data.existingHomeSales.changePercent > 0 ? (
                        <><TrendingUp className="text-green-600" size={18} /> Increasing</>
                      ) : (
                        <><TrendingDown className="text-amber-600" size={18} /> Slowing</>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New Supply</p>
                    <p className="font-semibold text-lg flex items-center gap-1">
                      {data.housingStarts && data.housingStarts.changePercent > 0 ? (
                        <><TrendingUp className="text-green-600" size={18} /> Growing</>
                      ) : (
                        <><TrendingDown className="text-amber-600" size={18} /> Contracting</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'economy' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Unemployment Rate"
                  series={data.unemploymentRate}
                  icon={Activity}
                  color="bg-blue-100 text-blue-600"
                  invertTrend
                  description="U.S. unemployment rate"
                />
                <MetricCard
                  title="Consumer Price Index"
                  series={data.cpi}
                  icon={DollarSign}
                  color="bg-amber-100 text-amber-600"
                  description="Inflation measure"
                />
                <MetricCard
                  title="Fed Funds Rate"
                  series={data.fedFundsRate}
                  icon={Building2}
                  color="bg-purple-100 text-purple-600"
                  description="Federal Reserve target rate"
                />
              </div>

              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold mb-4">Economic Impact on Real Estate</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Employment Strength</p>
                      <p className="text-sm text-gray-600">
                        Strong employment supports mortgage qualification rates and housing demand.
                        Current level: {data.unemploymentRate?.value.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <TrendingUp className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Inflation Impact</p>
                      <p className="text-sm text-gray-600">
                        Higher inflation typically leads to higher mortgage rates but can boost home values as a hedge.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Building2 className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">Fed Policy</p>
                      <p className="text-sm text-gray-600">
                        The Fed Funds rate directly influences mortgage rates. Current rate: {data.fedFundsRate?.value.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap /> AI-Powered Market Insights
                </h2>
                <p className="text-purple-100">
                  Strategic recommendations based on current market conditions
                </p>
              </div>

              {generateInsights().map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-xl border p-5 ${
                    insight.type === 'positive' ? 'border-l-4 border-l-green-500' :
                    insight.type === 'strategy' ? 'border-l-4 border-l-blue-500' :
                    'border-l-4 border-l-amber-500'
                  }`}
                >
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    {insight.type === 'positive' && <TrendingUp className="text-green-500" size={18} />}
                    {insight.type === 'strategy' && <Target className="text-blue-500" size={18} />}
                    {insight.type === 'neutral' && <AlertTriangle className="text-amber-500" size={18} />}
                    {insight.title}
                  </h3>
                  <p className="text-gray-600">{insight.text}</p>
                </div>
              ))}

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  Data sourced from Federal Reserve Economic Data (FRED) • Updated regularly
                </p>
                <a 
                  href="https://fred.stlouisfed.org" 
                  target="_blank" 
                  className="text-blue-600 hover:underline text-sm flex items-center justify-center gap-1 mt-1"
                >
                  Visit FRED <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
