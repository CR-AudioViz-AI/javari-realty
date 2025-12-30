// =============================================================================
// AI LISTING LAUNCH PAGE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:28 PM EST
// Hero Workflow #1: Complete listing in 30 minutes
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  Hash,
  Zap,
} from 'lucide-react';
import { ListingLaunchRequest, ListingLaunchResult, ListingLaunchProgress } from '@/types/listing-launch';
import { launchListing } from '@/lib/services/listing-launch';

type WizardStep = 'details' | 'features' | 'generating' | 'results';

export default function AIListingLaunchPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [formData, setFormData] = useState<Partial<ListingLaunchRequest>>({
    property_type: 'single_family',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1800,
    target_buyers: [],
    special_features: [],
    recent_upgrades: [],
    neighborhood_highlights: [],
  });
  const [progress, setProgress] = useState<ListingLaunchProgress | null>(null);
  const [result, setResult] = useState<ListingLaunchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProgressUpdate = useCallback((p: ListingLaunchProgress) => {
    setProgress(p);
  }, []);

  const handleLaunch = async () => {
    setCurrentStep('generating');
    setError(null);

    try {
      // Get agent info from session/context (placeholder)
      const request: ListingLaunchRequest = {
        ...formData as ListingLaunchRequest,
        agent_id: 'agent_demo',
        agent_name: 'Demo Agent',
        agent_phone: '(555) 123-4567',
        agent_email: 'agent@demo.com',
      };

      const launchResult = await launchListing(request, handleProgressUpdate);
      setResult(launchResult);
      setCurrentStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Launch failed');
      setCurrentStep('features');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Rocket className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Listing Launch</h1>
              <p className="text-gray-600">Complete listing content in 30 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {['Property Details', 'Features & Upgrades', 'AI Generation', 'Your Content'].map((step, i) => {
            const stepKeys: WizardStep[] = ['details', 'features', 'generating', 'results'];
            const isActive = stepKeys.indexOf(currentStep) >= i;
            const isCurrent = stepKeys[i] === currentStep;
            
            return (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${isCurrent ? 'text-blue-600' : ''}`}>
                    {step}
                  </span>
                </div>
                {i < 3 && (
                  <ChevronRight className={`h-5 w-5 mx-2 ${isActive ? 'text-blue-300' : 'text-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg border p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={formData.property_address || ''}
                    onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                    placeholder="123 Main St, City, State 12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="inline h-4 w-4 mr-1" />
                    Property Type
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value as ListingLaunchRequest['property_type'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single_family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi_family">Multi-Family</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* List Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    List Price
                  </label>
                  <input
                    type="number"
                    value={formData.list_price || ''}
                    onChange={(e) => setFormData({ ...formData, list_price: parseInt(e.target.value) || 0 })}
                    placeholder="450000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bed className="inline h-4 w-4 mr-1" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bath className="inline h-4 w-4 mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Square Feet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Square className="inline h-4 w-4 mr-1" />
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={formData.square_feet}
                    onChange={(e) => setFormData({ ...formData, square_feet: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.year_built || ''}
                    onChange={(e) => setFormData({ ...formData, year_built: parseInt(e.target.value) || undefined })}
                    placeholder="2005"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCurrentStep('features')}
                  disabled={!formData.property_address || !formData.list_price}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg border p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Features & Target Audience</h2>
              
              <div className="space-y-6">
                {/* Special Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Features (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.special_features?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      special_features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Pool, Smart Home, Gourmet Kitchen, Hardwood Floors"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Recent Upgrades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recent Upgrades (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.recent_upgrades?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      recent_upgrades: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="New Roof 2023, HVAC 2022, Renovated Kitchen"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Neighborhood Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood Highlights (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood_highlights?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      neighborhood_highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Top-rated schools, Walking trails, Near downtown"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Target Buyers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Buyers
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['first_time', 'family', 'investor', 'downsizer', 'luxury'].map((buyer) => (
                      <button
                        key={buyer}
                        onClick={() => {
                          const current = formData.target_buyers || [];
                          setFormData({
                            ...formData,
                            target_buyers: current.includes(buyer as any)
                              ? current.filter(b => b !== buyer)
                              : [...current, buyer as any]
                          });
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.target_buyers?.includes(buyer as any)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {buyer.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleLaunch}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Launch AI Generation
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'generating' && progress && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">AI is Creating Your Content</h2>
                <p className="text-gray-600">This typically takes 2-5 minutes</p>
              </div>

              {/* Overall Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Overall Progress</span>
                  <span className="text-blue-600 font-bold">{progress.overall_progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.overall_progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Step Progress */}
              <div className="space-y-4">
                {progress.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : step.status === 'in_progress' ? (
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                      ) : step.status === 'failed' ? (
                        <XCircle className="h-6 w-6 text-red-500" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === 'in_progress' ? 'text-blue-600' : 
                        step.status === 'completed' ? 'text-green-600' : 
                        'text-gray-600'
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-bold">Content Generated Successfully!</h2>
                    <p className="text-green-100">
                      Generated in {(result.generation_time_ms / 1000).toFixed(1)}s • {result.credits_used} credits used
                    </p>
                  </div>
                </div>
              </div>

              {/* MLS Description */}
              <ContentCard
                title="MLS Description"
                icon={<FileText className="h-5 w-5" />}
                content={result.mls_description.content}
                wordCount={result.mls_description.word_count}
                onCopy={() => copyToClipboard(result.mls_description.content, 'MLS Description')}
              />

              {/* Feature Highlights */}
              <ContentCard
                title="Feature Highlights"
                icon={<Zap className="h-5 w-5" />}
                content={result.feature_highlights.content}
                wordCount={result.feature_highlights.word_count}
                onCopy={() => copyToClipboard(result.feature_highlights.content, 'Features')}
              />

              {/* Neighborhood Brief */}
              <ContentCard
                title="Neighborhood Brief"
                icon={<MapPin className="h-5 w-5" />}
                content={result.neighborhood_brief.content}
                wordCount={result.neighborhood_brief.word_count}
                onCopy={() => copyToClipboard(result.neighborhood_brief.content, 'Neighborhood')}
              />

              {/* Social Media Posts */}
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-600" />
                  Social Media Posts
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <SocialCard
                    platform="Facebook"
                    icon={<Facebook className="h-5 w-5" />}
                    color="bg-blue-600"
                    content={result.social_posts.facebook.content}
                    onCopy={() => copyToClipboard(result.social_posts.facebook.content, 'Facebook')}
                  />
                  <SocialCard
                    platform="Instagram"
                    icon={<Instagram className="h-5 w-5" />}
                    color="bg-gradient-to-br from-purple-500 to-pink-500"
                    content={result.social_posts.instagram.content}
                    onCopy={() => copyToClipboard(result.social_posts.instagram.content, 'Instagram')}
                  />
                  <SocialCard
                    platform="LinkedIn"
                    icon={<Linkedin className="h-5 w-5" />}
                    color="bg-blue-700"
                    content={result.social_posts.linkedin.content}
                    onCopy={() => copyToClipboard(result.social_posts.linkedin.content, 'LinkedIn')}
                  />
                  <SocialCard
                    platform="Twitter/X"
                    icon={<Twitter className="h-5 w-5" />}
                    color="bg-black"
                    content={result.social_posts.twitter.content}
                    onCopy={() => copyToClipboard(result.social_posts.twitter.content, 'Twitter')}
                  />
                </div>
              </div>

              {/* Email Templates */}
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Templates
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ContentCard
                    title="New Listing Announcement"
                    icon={<Mail className="h-4 w-4" />}
                    content={result.email_templates.announcement.content}
                    compact
                    onCopy={() => copyToClipboard(result.email_templates.announcement.content, 'Announcement Email')}
                  />
                  <ContentCard
                    title="Open House Invitation"
                    icon={<Home className="h-4 w-4" />}
                    content={result.email_templates.open_house.content}
                    compact
                    onCopy={() => copyToClipboard(result.email_templates.open_house.content, 'Open House Email')}
                  />
                </div>
              </div>

              {/* SEO Keywords & Hashtags */}
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Keywords & Hashtags</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.seo_keywords.map((keyword, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Hashtags</p>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setProgress(null);
                    setCurrentStep('details');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Start New Listing
                </button>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download All Content
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper Components
function ContentCard({ 
  title, 
  icon, 
  content, 
  wordCount, 
  compact = false,
  onCopy 
}: { 
  title: string; 
  icon: React.ReactNode; 
  content: string;
  wordCount?: number;
  compact?: boolean;
  onCopy: () => void;
}) {
  return (
    <div className={`bg-white rounded-xl ${compact ? 'p-4' : 'rounded-2xl shadow-lg border p-6'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-900 flex items-center gap-2 ${compact ? 'text-sm' : 'text-lg'}`}>
          <span className="text-blue-600">{icon}</span>
          {title}
        </h3>
        <button
          onClick={onCopy}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <div className={`prose prose-sm max-w-none text-gray-600 ${compact ? 'max-h-40 overflow-y-auto' : ''}`}>
        <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
      </div>
      {wordCount && (
        <p className="text-xs text-gray-400 mt-3">{wordCount} words</p>
      )}
    </div>
  );
}

function SocialCard({ 
  platform, 
  icon, 
  color, 
  content, 
  onCopy 
}: { 
  platform: string; 
  icon: React.ReactNode; 
  color: string; 
  content: string;
  onCopy: () => void;
}) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className={`${color} px-4 py-2 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{platform}</span>
        </div>
        <button onClick={onCopy} className="p-1 hover:bg-white/20 rounded">
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 max-h-40 overflow-y-auto">
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
