import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}

export interface LinkedInAccount {
  id: string
  userId: string
  name: string
  cookie?: string
  status: 'connected' | 'disconnected' | 'error'
  riskLevel: 'low' | 'medium' | 'high'
  dailyLimit: number
  usedToday: number
  lastSync?: Date
}

export interface Prospect {
  id: string
  userId: string
  linkedinId: string
  name: string
  title?: string
  company?: string
  location?: string
  profileUrl?: string
  notes?: string
  tags?: string
}

export interface AutomationRule {
  id: string
  userId: string
  name: string
  trigger: string
  conditions?: string
  actions: string
  enabled: boolean
  schedule?: string
}

export interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  totalProspects: number
  pendingActivities: number
  completedActivities: number
}
