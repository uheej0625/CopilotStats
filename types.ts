export interface Quota {
  entitlement: number
  remaining: number
  percent_remaining: number
  overage_permitted: boolean
  quota_id: string
  unlimited?: boolean
}

export interface ApiData {
  quota_snapshots: Record<string, Quota>
  assigned_date: string
  quota_reset_date: string
  access_type_sku: string
  copilot_plan: string
  chat_enabled: boolean
  can_signup_for_limited: boolean
  analytics_tracking_id: string
}
