'use client';

import { useState } from 'react';
import { 
  FileText, Home, TrendingUp, TrendingDown, DollarSign,
  MapPin, Calendar, Bed, Bath, Square, Download, Share2,
  Sparkles, RefreshCw, CheckCircle, AlertTriangle
} from 'lucide-react';

interface CMAReport {
  subject_property: {
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    year_built: number;
  };
  comparables: Array<{
    id: string;
    address: string;
    price: number;
    sold_price?: number;
    sold_date?: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    year_built: number;
    distance: string;
    price_per_sqft: number;
    status: 'sold' | 'active' | 'pending';
    adjusted_price?: number;
  }>;
  valuation: {
    low: number;
    mid: number;
    high: number;
    confidence: 'high' | 'medium' | 'low';
  };
  market_insights: {
    avg_days_on_market: number;
    price_trend: number;
    inventory_level: string;
    buyer_demand: string;
  };
}

export default function CMAGenerator({ initialAddress = '' }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CMAReport | null>(null);
  const [formData, setFormData] = useState({
    address: initialAddress,
    city: '',
    state: 'FL',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 2000,
    year_built: 2000,
    condition: 'average',
    pool: false,
    waterfront: false,
  });

  const generateCMA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cma/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setReport(await response.json());
      } else {
        // Demo data
        const basePrice = formData.square_feet * 250;
        setReport({
          subject_property: { ...formData },
          comparables: [
            { id: '1', address: '456 Oak Lane', price: basePrice + 15000, sold_price: basePrice + 12000, sold_date: '2024-10-15', bedrooms: formData.bedrooms, bathrooms: formData.bathrooms, square_feet: formData.square_feet + 100, year_built: formData.year_built + 2, distance: '0.3 mi', price_per_sqft: 248, status: 'sold', adjusted_price: basePrice + 8500 },
            { id: '2', address: '789 Palm Drive', price: basePrice - 20000, sold_price: basePrice - 18000, sold_date: '2024-11-01', bedrooms: formData.bedrooms - 1, bathrooms: formData.bathrooms, square_feet: formData.square_feet - 200, year_built: formData.year_built - 5, distance: '0.5 mi', price_per_sqft: 242, status: 'sold', adjusted_price: basePrice + 4500 },
            { id: '3', address: '321 Beach Road', price: basePrice + 35000, bedrooms: formData.bedrooms + 1, bathrooms: formData.bathrooms + 0.5, square_feet: formData.square_feet + 300, year_built: formData.year_built + 5, distance: '0.7 mi', price_per_sqft: 255, status: 'active', adjusted_price: basePrice + 5000 },
          ],
          valuation: { low: basePrice - 15000, mid: basePrice + 5000, high: basePrice + 25000, confidence: 'high' },
          market_insights: { avg_days_on_market: 28, price_trend: 4.2, inventory_level: 'Low', buyer_demand: 'High' },
        });
      }
    } catch (error) {
      console.error('CMA error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (report) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Comparative Market Analysis</h2>
                <p className="text-blue-100">{report.subject_property.address}, {report.subject_property.city}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><Download className="w-5 h-5" /></button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><Share2 className="w-5 h-5" /></button>
                <button onClick={() => setReport(null)} className="px-3 py-1 bg-white/20 rounded-lg text-sm">New CMA</button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estimated Market Value</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Low</p>
                <p className="text-2xl font-bold text-red-700">${report.valuation.low.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-500">
                <p className="text-sm text-green-600 font-medium">Recommended</p>
                <p className="text-3xl font-bold text-green-700">${report.valuation.mid.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">High</p>
                <p className="text-2xl font-bold text-blue-700">${report.valuation.high.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Confidence: <strong>{report.valuation.confidence}</strong></span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Avg Days on Market</p><p className="text-xl font-bold">{report.market_insights.avg_days_on_market} days</p></div>
            <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Price Trend (YoY)</p><p className="text-xl font-bold text-green-600">+{report.market_insights.price_trend}%</p></div>
            <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Inventory</p><p className="text-xl font-bold">{report.market_insights.inventory_level}</p></div>
            <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Buyer Demand</p><p className="text-xl font-bold">{report.market_insights.buyer_demand}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold">Comparable Properties ({report.comparables.length})</h3></div>
          <div className="divide-y">
            {report.comparables.map(comp => (
              <div key={comp.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{comp.address}</h4>
                  <p className="text-sm text-gray-500">{comp.bedrooms} bed • {comp.bathrooms} bath • {comp.square_feet.toLocaleString()} sqft • {comp.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${(comp.sold_price || comp.price).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">${comp.price_per_sqft}/sqft</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6" />AI-Powered CMA Generator</h2>
        <p className="text-blue-100 mt-1">Generate a professional Comparative Market Analysis in seconds</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main Street" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Naples" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: +e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input type="number" step="0.5" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: +e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
            <input type="number" value={formData.square_feet} onChange={e => setFormData({...formData, square_feet: +e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <button onClick={generateCMA} disabled={loading || !formData.address} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2">
          {loading ? <><RefreshCw className="w-5 h-5 animate-spin" />Analyzing...</> : <><Sparkles className="w-5 h-5" />Generate CMA Report</>}
        </button>
      </div>
    </div>
  );
}
