// =============================================================================
// TRUST BADGE COMPONENT
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:18 PM EST
// Visual indicator showing data source, confidence, and freshness
// =============================================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion,
  Info,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { TrustLayer, ConfidenceLevel, DataFreshness } from '@/types/property-intelligence';

interface TrustBadgeProps {
  trust: TrustLayer;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const confidenceColors: Record<ConfidenceLevel, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  unverified: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
};

const confidenceIcons: Record<ConfidenceLevel, React.ReactNode> = {
  high: <ShieldCheck className="h-4 w-4" />,
  medium: <Shield className="h-4 w-4" />,
  low: <ShieldAlert className="h-4 w-4" />,
  unverified: <ShieldQuestion className="h-4 w-4" />,
};

const verificationIcons: Record<string, React.ReactNode> = {
  verified: <CheckCircle2 className="h-3 w-3 text-green-600" />,
  unverified: <AlertTriangle className="h-3 w-3 text-yellow-600" />,
  disputed: <XCircle className="h-3 w-3 text-red-600" />,
  outdated: <Clock className="h-3 w-3 text-orange-600" />,
};

const freshnessLabels: Record<DataFreshness, string> = {
  real_time: 'Real-time',
  daily: 'Updated daily',
  weekly: 'Updated weekly',
  monthly: 'Updated monthly',
  quarterly: 'Updated quarterly',
  annual: 'Updated annually',
  unknown: 'Update frequency unknown',
};

export function TrustBadge({ 
  trust, 
  size = 'md', 
  showDetails = false,
  className = '' 
}: TrustBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const colors = confidenceColors[trust.confidence];
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Badge Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          inline-flex items-center gap-1 rounded-full border
          ${colors.bg} ${colors.text} ${colors.border}
          ${sizeClasses[size]}
          hover:opacity-90 transition-opacity cursor-pointer
        `}
        aria-label={`Data confidence: ${trust.confidence}. Click for details.`}
      >
        {confidenceIcons[trust.confidence]}
        <span className="font-medium">{trust.confidence_score}%</span>
        <Info className="h-3 w-3 opacity-60" />
      </button>

      {/* Expanded Details Popover */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-72 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {/* Header */}
            <div className={`px-4 py-3 ${colors.bg} border-b ${colors.border}`}>
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${colors.text}`}>
                  Data Trust Score
                </span>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {trust.confidence_score}%
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Source */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Source</p>
                  <p className="font-medium text-gray-900 truncate">{trust.source_name}</p>
                  {trust.source_url && (
                    <a 
                      href={trust.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                    >
                      Visit source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {verificationIcons[trust.verification_status]}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {trust.verification_status}
                  </p>
                  {trust.verified_by && (
                    <p className="text-xs text-gray-500">by {trust.verified_by}</p>
                  )}
                </div>
              </div>

              {/* Freshness */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Freshness</p>
                  <p className="font-medium text-gray-900">
                    {freshnessLabels[trust.freshness]}
                  </p>
                  <p className="text-xs text-gray-500">
                    Retrieved: {formatDate(trust.retrieved_at)}
                  </p>
                  {trust.data_date && (
                    <p className="text-xs text-gray-500">
                      Data from: {formatDate(trust.data_date)}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {trust.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{trust.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 text-center">
              Click badge to collapse
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Inline trust indicator for compact displays
 */
export function TrustIndicator({ trust, className = '' }: { trust: TrustLayer; className?: string }) {
  const colors = confidenceColors[trust.confidence];
  
  return (
    <span 
      className={`inline-flex items-center gap-0.5 ${colors.text} ${className}`}
      title={`${trust.source_name} - ${trust.confidence_score}% confidence`}
    >
      {confidenceIcons[trust.confidence]}
      <span className="text-xs">{trust.confidence_score}</span>
    </span>
  );
}

/**
 * Data point wrapper that shows value with trust badge
 */
interface TrustedValueProps<T> {
  data: { value: T; trust: TrustLayer };
  format?: (value: T) => string;
  showBadge?: boolean;
  className?: string;
}

export function TrustedValue<T>({ 
  data, 
  format, 
  showBadge = true,
  className = '' 
}: TrustedValueProps<T>) {
  const displayValue = format ? format(data.value) : String(data.value);
  
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span>{displayValue}</span>
      {showBadge && <TrustBadge trust={data.trust} size="sm" />}
    </span>
  );
}

export default TrustBadge;
