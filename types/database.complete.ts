// Auto-generated from complete Supabase schema
// Generated: 2025-11-19 15:12 EST
// Tables: 250

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      active_picks_view: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      activity_log: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      activity_logs: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      admin_policies: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      affiliate_tracking: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      agent_availability: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      agents: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      ai_generations: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      ai_models: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      ai_performance: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      alert_configs: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      alert_history: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      alert_settings: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      analytics_events: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      api_key_usage: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      api_keys: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      api_usage: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      api_usage_logs: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      appointments: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      approval_queue: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      areas: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      article_clusters: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      article_views: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      articles: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      assets: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      audit_log: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      backtesting_results: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      blog_posts: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_actions: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_activity: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_alerts: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_executions: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_findings: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_health_checks: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_health_metrics: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_issues: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bot_knowledge: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      bots: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      campaigns: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      challenge_daily_snapshots: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      challenges_90day: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      chat_conversations: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      chat_messages: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      commission_records: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      communications: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      community_likes: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      community_posts: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      community_votes: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      conversation_participants: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      conversations: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      [key: string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
    }
  }
}