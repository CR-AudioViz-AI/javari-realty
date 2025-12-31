// Post-Purchase Homeowner Portal Types
// CR AudioViz AI - Javari Realtor Platform

// ============ DOCUMENTS ============
export interface HomeDocument {
  id: string;
  user_id: string;
  home_id?: string;
  category: DocumentCategory;
  subcategory?: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  updated_at: string;
  tags: string[];
  expiration_date?: string;
  reminder_days_before?: number;
}

export type DocumentCategory = 
  | 'closing' | 'warranty' | 'insurance' | 'hoa' | 'permits' 
  | 'inspections' | 'manuals' | 'invoices' | 'receipts' 
  | 'contracts' | 'tax' | 'photos' | 'other';

// ============ EXPENSES ============
export interface HomeExpense {
  id: string;
  user_id: string;
  home_id?: string;
  category: ExpenseCategory;
  vendor?: string;
  description: string;
  amount: number;
  date: string;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'annually';
  next_due_date?: string;
  receipt_id?: string;
  is_tax_deductible: boolean;
  is_capital_improvement: boolean;
  tags: string[];
  created_at: string;
}

export type ExpenseCategory = 
  | 'mortgage' | 'property_tax' | 'insurance' | 'hoa' | 'utilities'
  | 'maintenance' | 'repairs' | 'improvements' | 'landscaping' 
  | 'cleaning' | 'pest_control' | 'pool' | 'security' | 'other';

// ============ WARRANTIES ============
export interface Warranty {
  id: string;
  user_id: string;
  home_id?: string;
  item_name: string;
  item_category: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_type: 'manufacturer' | 'extended' | 'home_warranty' | 'service_contract';
  coverage_details?: string;
  provider_name?: string;
  provider_phone?: string;
  document_id?: string;
  status: 'active' | 'expiring_soon' | 'expired';
  created_at: string;
}

// ============ MAINTENANCE ============
export interface MaintenanceTask {
  id: string;
  user_id: string;
  home_id?: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  last_completed?: string;
  next_due: string;
  estimated_cost?: number;
  priority: 'low' | 'medium' | 'high';
  assigned_vendor_id?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'overdue';
  notes?: string;
  created_at: string;
}

// ============ HOME VALUE ============
export interface HomeValueHistory {
  id: string;
  user_id: string;
  home_id: string;
  date: string;
  estimated_value: number;
  source: 'manual' | 'zillow' | 'redfin' | 'realtor' | 'appraisal';
  change_from_previous?: number;
  change_percent?: number;
}

// ============ REMINDERS ============
export interface Reminder {
  id: string;
  user_id: string;
  type: 'warranty_expiring' | 'maintenance_due' | 'bill_due' | 'insurance_renewal' | 'custom';
  title: string;
  message: string;
  due_date: string;
  related_id?: string;
  related_type?: string;
  is_sent: boolean;
  sent_at?: string;
  send_via: ('email' | 'sms' | 'push')[];
}
