// =============================================================================
// CONTEXTUAL ACTION BUTTON COMPONENT
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:45 PM EST
// Phase 3: AI as Actions, Not Chat - One-click workflows
// =============================================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Heart,
  GitCompare,
  Calculator,
  Car,
  GraduationCap,
  MapPin,
  Share2,
  MessageCircle,
  FileText,
  Play,
  TrendingUp,
  Home,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
} from 'lucide-react';
import { ActionType, ContextualAction } from '@/types/intent-search';

interface ContextualActionButtonProps {
  action: ContextualAction;
  propertyId?: string;
  propertyAddress?: string;
  onAction?: (actionType: ActionType, data?: Record<string, unknown>) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ACTION_ICONS: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  schedule_tour: Calendar,
  save_property: Heart,
  compare: GitCompare,
  calculate_mortgage: Calculator,
  check_commute: Car,
  view_schools: GraduationCap,
  neighborhood_report: MapPin,
  share: Share2,
  contact_agent: MessageCircle,
  make_offer: FileText,
  request_info: Mail,
  virtual_tour: Play,
  price_history: TrendingUp,
  similar_homes: Home,
};

const ACTION_COLORS: Record<ActionType, { bg: string; text: string; hover: string }> = {
  schedule_tour: { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  save_property: { bg: 'bg-pink-100', text: 'text-pink-700', hover: 'hover:bg-pink-200' },
  compare: { bg: 'bg-purple-100', text: 'text-purple-700', hover: 'hover:bg-purple-200' },
  calculate_mortgage: { bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200' },
  check_commute: { bg: 'bg-orange-100', text: 'text-orange-700', hover: 'hover:bg-orange-200' },
  view_schools: { bg: 'bg-indigo-100', text: 'text-indigo-700', hover: 'hover:bg-indigo-200' },
  neighborhood_report: { bg: 'bg-teal-100', text: 'text-teal-700', hover: 'hover:bg-teal-200' },
  share: { bg: 'bg-gray-100', text: 'text-gray-700', hover: 'hover:bg-gray-200' },
  contact_agent: { bg: 'bg-emerald-600', text: 'text-white', hover: 'hover:bg-emerald-700' },
  make_offer: { bg: 'bg-red-600', text: 'text-white', hover: 'hover:bg-red-700' },
  request_info: { bg: 'bg-cyan-100', text: 'text-cyan-700', hover: 'hover:bg-cyan-200' },
  virtual_tour: { bg: 'bg-violet-100', text: 'text-violet-700', hover: 'hover:bg-violet-200' },
  price_history: { bg: 'bg-amber-100', text: 'text-amber-700', hover: 'hover:bg-amber-200' },
  similar_homes: { bg: 'bg-rose-100', text: 'text-rose-700', hover: 'hover:bg-rose-200' },
};

export function ContextualActionButton({
  action,
  propertyId,
  propertyAddress,
  onAction,
  size = 'md',
  variant = 'default',
}: ContextualActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const Icon = ACTION_ICONS[action.type] || MessageCircle;
  const colors = ACTION_COLORS[action.type];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-3 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = async () => {
    // Actions that need modals
    if (['schedule_tour', 'contact_agent', 'make_offer', 'calculate_mortgage'].includes(action.type)) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate action
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAction?.(action.type, { propertyId, propertyAddress, ...action.data });
    
    setIsLoading(false);
    setIsComplete(true);
    
    setTimeout(() => setIsComplete(false), 2000);
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
  `;

  const variantClasses = {
    default: `${colors.bg} ${colors.text} ${colors.hover}`,
    outline: `border-2 border-current ${colors.text} hover:bg-opacity-10`,
    ghost: `${colors.text} hover:bg-opacity-10`,
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isLoading}
        className={`${baseClasses} ${variantClasses[variant]}`}
        title={action.description}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : isComplete ? (
          <CheckCircle2 className={iconSizes[size]} />
        ) : (
          <Icon className={iconSizes[size]} />
        )}
        <span>{isComplete ? 'Done!' : action.label}</span>
      </motion.button>

      {/* Action Modals */}
      <AnimatePresence>
        {showModal && (
          <ActionModal
            action={action}
            propertyId={propertyId}
            propertyAddress={propertyAddress}
            onClose={() => setShowModal(false)}
            onSubmit={(data) => {
              onAction?.(action.type, data);
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Action Modal Component
interface ActionModalProps {
  action: ContextualAction;
  propertyId?: string;
  propertyAddress?: string;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

function ActionModal({ action, propertyId, propertyAddress, onClose, onSubmit }: ActionModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit({ propertyId, propertyAddress, ...formData });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{action.label}</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
          {propertyAddress && (
            <p className="text-sm text-blue-100 mt-1">{propertyAddress}</p>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {action.type === 'schedule_tour' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <select
                  required
                  value={formData.time || ''}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (9am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 8pm)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {action.type === 'contact_agent' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={3}
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="I'm interested in this property..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {action.type === 'calculate_mortgage' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.downPayment || '20'}
                  onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={formData.rate || '6.5'}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                <select
                  value={formData.term || '30'}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ChevronRight className="h-5 w-5" />
                {action.type === 'schedule_tour' ? 'Request Tour' :
                 action.type === 'contact_agent' ? 'Send Message' :
                 action.type === 'calculate_mortgage' ? 'Calculate' : 'Submit'}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Quick Action Bar - Shows contextual actions for a property
interface QuickActionBarProps {
  propertyId: string;
  propertyAddress: string;
  actions: ContextualAction[];
  onAction?: (actionType: ActionType, data?: Record<string, unknown>) => void;
}

export function QuickActionBar({ propertyId, propertyAddress, actions, onAction }: QuickActionBarProps) {
  const primaryAction = actions.find(a => a.primary);
  const secondaryActions = actions.filter(a => !a.primary);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryAction && (
        <ContextualActionButton
          action={primaryAction}
          propertyId={propertyId}
          propertyAddress={propertyAddress}
          onAction={onAction}
          size="md"
        />
      )}
      {secondaryActions.slice(0, 4).map((action) => (
        <ContextualActionButton
          key={action.id}
          action={action}
          propertyId={propertyId}
          propertyAddress={propertyAddress}
          onAction={onAction}
          size="sm"
          variant="outline"
        />
      ))}
    </div>
  );
}

export default ContextualActionButton;
