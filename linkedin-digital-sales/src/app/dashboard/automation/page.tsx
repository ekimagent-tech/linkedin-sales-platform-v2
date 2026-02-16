'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Zap, Plus, ToggleLeft, ToggleRight, Trash2, X, Loader2, 
  Clock, AlertCircle, CheckCircle, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react"

type AutomationRule = {
  id: string
  name: string
  type: string
  isActive: boolean
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ERROR' | 'COMPLETED'
  actionType: string
  accountId?: string
  accountName?: string
  targetKeywords: string | null
  targetCompanies: string | null
  targetTitles: string | null
  messageTemplate: string | null
  triggerTime: string
  dailyLimit: number
  totalLimit: number | null
  delayMin: number
  delayMax: number
  createdAt: string
}

type AutomationLog = {
  id: string
  ruleId: string
  ruleName: string
  accountName: string
  action: string
  targetName: string
  targetUrl: string
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED'
  details: string
  linkedinRef: string
  createdAt: string
}

type LinkedInAccount = {
  id: string
  name: string
  email: string
  status: string
}

// New automation types with user-requested features
const automationTypes = [
  { value: 'DIRECT_FOLLOW', label: 'DIRECT_FOLLOW', desc: 'Follow specific profiles' },
  { value: 'DIRECT_CONNECT', label: 'DIRECT_CONNECT', desc: 'Send connection requests' },
  { value: 'NETWORK_EXPAND', label: 'NETWORK_EXPAND', desc: 'Search 1st/2nd connections → Check role → Connect if relevant' },
  { value: 'POST_ENGAGE', label: 'POST_ENGAGE', desc: 'Find new posts → AI generates engaging replies' },
  { value: 'POST_REPLY', label: 'POST_REPLY', desc: 'Reply to specific posts/threads' },
]

const actionTypes = [
  { value: 'FOLLOW_PROFILE', label: 'Follow Profile' },
  { value: 'SEND_CONNECTION', label: 'Send Connection' },
  { value: 'LIKE_POST', label: 'Like Post' },
  { value: 'SEND_MESSAGE', label: 'Send Message' },
  { value: 'AI_COMMENT', label: 'AI Comment' },
]

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([])
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules')
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'NETWORK_EXPAND',
    actionType: 'SEND_CONNECTION',
    accountId: '',
    targetKeywords: '',
    targetCompanies: '',
    targetTitles: '',
    excludeKeywords: '',
    messageTemplate: '',
    triggerTime: '09:00-12:00, 14:00-18:00',
    dailyLimit: 20,
    totalLimit: '',
    delayMin: 30,
    delayMax: 120,
    aiPrompt: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [rulesRes, accountsRes] = await Promise.all([
        fetch('/api/automations'),
        fetch('/api/accounts')
      ])
      
      if (rulesRes.ok) {
        const data = await rulesRes.json()
        setRules(data)
      }
      if (accountsRes.ok) {
        const data = await accountsRes.json()
        setAccounts(Array.isArray(data) ? data : data.accounts || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/activity?limit=50')
      if (res.ok) {
        const data = await res.json()
        setLogs(data.activities || data || [])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/automations/${id}/toggle`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setRules(rules.map(r => r.id === id ? updated : r))
      }
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return
    try {
      const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRules(rules.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        accountId: formData.accountId || undefined,
        targetKeywords: formData.targetKeywords ? formData.targetKeywords.split(',').map(k => k.trim()) : [],
        targetCompanies: formData.targetCompanies ? formData.targetCompanies.split(',').map(c => c.trim()) : [],
        targetTitles: formData.targetTitles ? formData.targetTitles.split(',').map(t => t.trim()) : [],
        excludeKeywords: formData.excludeKeywords ? formData.excludeKeywords.split(',').map(k => k.trim()) : [],
        totalLimit: formData.totalLimit ? parseInt(formData.totalLimit) : null
      }

      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const newRule = await res.json()
        setRules([newRule, ...rules])
        setShowForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating rule:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'NETWORK_EXPAND',
      actionType: 'SEND_CONNECTION',
      accountId: '',
      targetKeywords: '',
      targetCompanies: '',
      targetTitles: '',
      excludeKeywords: '',
      messageTemplate: '',
      triggerTime: '09:00-12:00, 14:00-18:00',
      dailyLimit: 20,
      totalLimit: '',
      delayMin: 30,
      delayMax: 120,
      aiPrompt: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-700', icon: Clock },
      ACTIVE: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      PAUSED: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      ERROR: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
      COMPLETED: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    )
  }

  const getTypeLabel = (type: string) => automationTypes.find(t => t.value === type)?.label || type

  const getLogStatusBadge = (status: string) => {
    const colors = {
      SUCCESS: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
      SKIPPED: 'bg-gray-100 text-gray-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>{status}</span>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">自動化引擎</h1>
          <p className="text-gray-500 mt-1">配置自動化規則 LinkedIn 互動</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchLogs(); setActiveTab('logs') }}>
            <Clock className="w-4 h-4 mr-2" />
            檢視日誌
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            建立規則
          </Button>
        </div>
      </div>

      {/* Automation Types Info */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🤖 自動化規則類型</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
            {automationTypes.map(type => (
              <div key={type.value} className="bg-white p-2 rounded border">
                <div className="font-medium text-blue-800">{type.label}</div>
                <div className="text-xs text-gray-600">{type.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Creation Form */}
      {showForm && (
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>建立自動化規則</CardTitle>
            <CardDescription>設定觸發條件、動作和LinkedIn帳戶</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">規則名稱 *</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：網絡擴展 - SaaS決策者"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn 帳戶 *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.accountId}
                    onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                    required
                  >
                    <option value="">選擇帳戶...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} ({acc.email})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rule Type */}
              <div>
                <label className="block text-sm font-medium mb-2">自動化類型 *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {automationTypes.map(type => (
                    <label 
                      key={type.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ruleType"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">動作類型</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.actionType}
                    onChange={e => setFormData({ ...formData, actionType: e.target.value })}
                  >
                    {actionTypes.map(action => (
                      <option key={action.value} value={action.value}>{action.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">觸發時間</label>
                  <Input
                    value={formData.triggerTime}
                    onChange={e => setFormData({ ...formData, triggerTime: e.target.value })}
                    placeholder="09:00-12:00, 14:00-18:00"
                  />
                  <p className="text-xs text-gray-500 mt-1">格式: HH:MM-HH:MM, 可以多個時段</p>
                </div>
              </div>

              {/* Target Filters */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">🎯 目標篩選條件</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">目標關鍵詞</label>
                    <Input
                      value={formData.targetKeywords}
                      onChange={e => setFormData({ ...formData, targetKeywords: e.target.value })}
                      placeholder="VP, Director, CTO, Head of"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">目標公司</label>
                    <Input
                      value={formData.targetCompanies}
                      onChange={e => setFormData({ ...formData, targetCompanies: e.target.value })}
                      placeholder="Google, Microsoft, Apple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">目標職位</label>
                    <Input
                      value={formData.targetTitles}
                      onChange={e => setFormData({ ...formData, targetTitles: e.target.value })}
                      placeholder="CEO, CTO, 銷售總監"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">排除關鍵詞</label>
                    <Input
                      value={formData.excludeKeywords}
                      onChange={e => setFormData({ ...formData, excludeKeywords: e.target.value })}
                      placeholder="Recruiter, HR, Talent"
                    />
                  </div>
                </div>
              </div>

              {/* Limits & Delays */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">⚡ 限制與延遲</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">每日限制</label>
                    <Input
                      type="number"
                      value={formData.dailyLimit}
                      onChange={e => setFormData({ ...formData, dailyLimit: parseInt(e.target.value) })}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">總限制</label>
                    <Input
                      type="number"
                      value={formData.totalLimit}
                      onChange={e => setFormData({ ...formData, totalLimit: e.target.value })}
                      placeholder="無限制"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">最小延遲 (秒)</label>
                    <Input
                      type="number"
                      value={formData.delayMin}
                      onChange={e => setFormData({ ...formData, delayMin: parseInt(e.target.value) })}
                      min={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">最大延遲 (秒)</label>
                    <Input
                      type="number"
                      value={formData.delayMax}
                      onChange={e => setFormData({ ...formData, delayMax: parseInt(e.target.value) })}
                      min={30}
                    />
                  </div>
                </div>
              </div>

              {/* Message Template */}
              {(formData.type === 'DIRECT_CONNECT' || formData.type === 'NETWORK_EXPAND') && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">💬 訊息模板</h4>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={formData.messageTemplate}
                    onChange={e => setFormData({ ...formData, messageTemplate: e.target.value })}
                    placeholder="Hi {{firstName}}, I noticed you're connected to {{mutualConnection}}... 
                    
可用變量: {{firstName}}, {{lastName}}, {{company}}, {{headline}}, {{mutualConnection}}"
                  />
                </div>
              )}

              {/* AI Prompt for POST_ENGAGE */}
              {formData.type === 'POST_ENGAGE' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">🤖 AI 評論 Prompt</h4>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={formData.aiPrompt}
                    onChange={e => setFormData({ ...formData, aiPrompt: e.target.value })}
                    placeholder="You are a professional sales executive. Write thoughtful, value-adding comments on LinkedIn posts.
                    
Requirements:
- Be specific to post content
- Add insight or question
- Keep under 200 characters
- No generic 'Great post!'"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  建立規則
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm() }}>
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Activity Logs Panel */}
      {showLogs && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 自動化日誌</span>
              <Button variant="outline" size="sm" onClick={fetchLogs}>
                <Loader2 className="w-4 h-4 mr-1" /> 刷新
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暫無日誌記錄</p>
            ) : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.ruleName}</span>
                        {getLogStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {log.action} → {log.targetName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString()} • {log.accountName}
                      </p>
                    </div>
                    {log.linkedinRef && (
                      <a 
                        href={log.linkedinRef} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        查看
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Zap className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">尚無自動化規則</h3>
            <p className="text-gray-500 mb-4">建立您的第一個自動化規則來開始自動化和潛在客戶互動。</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              建立規則
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={rule.isActive ? 'border-green-200' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Zap className={`w-5 h-5 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{rule.name}</h3>
                        {getStatusBadge(rule.status || (rule.isActive ? 'ACTIVE' : 'PAUSED'))}
                      </div>
                      <p className="text-sm text-gray-500">
                        類型: <span className="font-medium">{getTypeLabel(rule.type)}</span> 
                        {rule.accountName && ` • 帳戶: ${rule.accountName}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        每日限制: {rule.dailyLimit} • 延遲: {rule.delayMin}-{rule.delayMax}秒
                        {rule.triggerTime && ` • 觸發: ${rule.triggerTime}`}
                      </p>
                      {rule.targetKeywords && (
                        <p className="text-xs text-gray-400 mt-1">
                          目標: {Array.isArray(rule.targetKeywords) ? rule.targetKeywords.join(', ') : rule.targetKeywords}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggle(rule.id)}
                    >
                      {rule.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1 text-green-600" />
                          已啟用
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1" />
                          已停用
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rate Limits Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>⚡ 速率限制建議</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">每日動作上限</h4>
              <p className="text-2xl font-bold text-blue-600">50</p>
              <p className="text-sm text-gray-500">每帳戶</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">每小時限制</h4>
              <p className="text-2xl font-bold text-yellow-600">10</p>
              <p className="text-sm text-gray-500">安全範圍</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">請求間隔</h4>
              <p className="text-2xl font-bold text-green-600">30-120s</p>
              <p className="text-sm text-gray-500">隨機延遲</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">連接驗證</h4>
              <p className="text-2xl font-bold text-purple-600">每次</p>
              <p className="text-sm text-gray-500">前檢查</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
