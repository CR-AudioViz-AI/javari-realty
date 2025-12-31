// Marketing Automation Types
// CR AudioViz AI - Javari Realtor Platform

export interface AutomatedMessage {
  id: string;
  agent_id: string;
  customer_id?: string;
  type: MessageType;
  trigger: MessageTrigger;
  template_id?: string;
  subject: string;
  body: string;
  send_via: ('email' | 'sms' | 'push')[];
  scheduled_date?: string;
  sent_at?: string;
  status: 'pending' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
}

export type MessageType = 
  | 'birthday'
  | 'home_anniversary'
  | 'holiday'
  | 'market_update'
  | 'refinance_opportunity'
  | 'home_value_update'
  | 'check_in'
  | 'referral_request'
  | 'custom';

export type MessageTrigger = 
  | 'date_based'      // Birthdays, anniversaries
  | 'event_based'     // Holidays
  | 'condition_based' // Rate drops, value changes
  | 'scheduled'       // Manual scheduling
  | 'immediate';      // Send now

export interface MessageTemplate {
  id: string;
  agent_id: string;
  name: string;
  type: MessageType;
  subject: string;
  body: string;
  variables: string[]; // e.g., {{first_name}}, {{home_address}}
  is_default: boolean;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  agent_id: string;
  name: string;
  type: MessageType;
  is_active: boolean;
  trigger: MessageTrigger;
  trigger_config: TriggerConfig;
  template_id: string;
  send_via: ('email' | 'sms' | 'push')[];
  created_at: string;
}

export interface TriggerConfig {
  // For date_based
  days_before?: number;
  days_after?: number;
  
  // For event_based (holidays)
  holiday?: string;
  
  // For condition_based
  condition_type?: 'rate_drop' | 'value_increase' | 'anniversary';
  threshold?: number;
  
  // For scheduled
  send_time?: string; // HH:MM
  send_day?: number;  // Day of week (0-6) or month (1-31)
}

export const DEFAULT_TEMPLATES: Partial<MessageTemplate>[] = [
  {
    name: 'Birthday Greeting',
    type: 'birthday',
    subject: 'Happy Birthday, {{first_name}}! 🎂',
    body: `Dear {{first_name}},

Wishing you a wonderful birthday filled with joy and happiness!

It's been a pleasure working with you, and I hope this year brings you everything you've been hoping for.

Warm regards,
{{agent_name}}
{{agent_phone}}`,
    variables: ['first_name', 'agent_name', 'agent_phone'],
  },
  {
    name: 'Home Anniversary',
    type: 'home_anniversary',
    subject: 'Happy Home Anniversary! 🏠',
    body: `Dear {{first_name}},

Can you believe it's been {{years}} year(s) since you moved into {{home_address}}? Time flies when you're in a place you love!

I hope your home continues to bring you joy. If you ever have questions about your home's value or the market, I'm always here to help.

Best,
{{agent_name}}`,
    variables: ['first_name', 'years', 'home_address', 'agent_name'],
  },
  {
    name: 'Holiday - Thanksgiving',
    type: 'holiday',
    subject: 'Happy Thanksgiving! 🦃',
    body: `Dear {{first_name}},

Wishing you and your family a wonderful Thanksgiving filled with gratitude, good food, and great company.

I'm thankful to have clients like you!

Warmly,
{{agent_name}}`,
    variables: ['first_name', 'agent_name'],
  },
  {
    name: 'Market Update',
    type: 'market_update',
    subject: 'Your Quarterly Market Update',
    body: `Dear {{first_name}},

Here's what's happening in your local real estate market:

• Average home prices: {{avg_price}}
• Homes sold this quarter: {{homes_sold}}
• Average days on market: {{days_on_market}}
• Your estimated home value: {{estimated_value}}

Want a more detailed analysis? I'd be happy to provide a free home valuation.

Best,
{{agent_name}}`,
    variables: ['first_name', 'avg_price', 'homes_sold', 'days_on_market', 'estimated_value', 'agent_name'],
  },
  {
    name: 'Refinance Opportunity',
    type: 'refinance_opportunity',
    subject: 'Rates are down - Time to refinance? 📉',
    body: `Dear {{first_name}},

Great news! Mortgage rates have dropped to {{current_rate}}%, which could mean significant savings on your monthly payment.

Based on your purchase price of {{purchase_price}}, refinancing could potentially save you {{estimated_savings}}/month.

Would you like me to connect you with a lender to explore your options?

Best,
{{agent_name}}`,
    variables: ['first_name', 'current_rate', 'purchase_price', 'estimated_savings', 'agent_name'],
  },
];

export const HOLIDAYS = [
  { id: 'new_year', name: "New Year's Day", date: '01-01' },
  { id: 'valentines', name: "Valentine's Day", date: '02-14' },
  { id: 'easter', name: 'Easter', date: 'variable' },
  { id: 'mothers_day', name: "Mother's Day", date: 'variable' },
  { id: 'memorial_day', name: 'Memorial Day', date: 'variable' },
  { id: 'fathers_day', name: "Father's Day", date: 'variable' },
  { id: 'independence_day', name: 'Independence Day', date: '07-04' },
  { id: 'labor_day', name: 'Labor Day', date: 'variable' },
  { id: 'halloween', name: 'Halloween', date: '10-31' },
  { id: 'thanksgiving', name: 'Thanksgiving', date: 'variable' },
  { id: 'christmas', name: 'Christmas', date: '12-25' },
];
