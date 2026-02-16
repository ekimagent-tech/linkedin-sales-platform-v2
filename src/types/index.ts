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
  email?: string
  phone?: string
  connections?: number
  followers?: number
  bio?: string
  connectionDegree?: '1st' | '2nd' | '3rd' | 'Out of network'
  createdAt?: Date
  updatedAt?: Date
}

export interface ActivityLog {
  id: string
  userId: string
  prospectId?: string
  prospectName?: string
  action: 'like' | 'follow' | 'connect' | 'message' | 'view' | 'comment' | 'share'
  targetUrl?: string
  status: 'pending' | 'completed' | 'failed'
  errorMessage?: string
  createdAt: Date
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
  thisWeekConnections: number
  thisWeekMessages: number
  responseRate: number
}

// New types for v2 features
export interface Product {
  id: string
  userId: string
  name: string
  description: string
  targetLocations: string[]
  createdAt: Date
}

export interface ProspectProfileAttributes {
  industries: string[]
  jobTitles: string[]
  companySizes: string[]
  locations: string[]
  seniorities: string[]
}

export interface SearchedProspect {
  linkedinId: string
  name: string
  title: string
  company: string
  location: string
  connectionDegree: '1st' | '2nd' | '3rd' | 'Out of network'
  profileUrl: string
}

export interface ProspectAction {
  id: string
  prospectId: string
  prospectName: string
  actionType: 'like' | 'follow' | 'connect' | 'message'
  targetUrl?: string
  messageDraft?: string
  recommendation: string
  status: 'pending' | 'confirmed' | 'executed' | 'failed'
  createdAt: Date
}

export interface ExecutionLog {
  id: string
  actionId: string
  prospectName: string
  actionType: string
  status: 'success' | 'failed'
  errorMessage?: string
  executedAt: Date
}
