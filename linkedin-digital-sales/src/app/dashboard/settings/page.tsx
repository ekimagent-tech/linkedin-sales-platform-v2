'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Settings, User, Bell, Shield, Key, Plus, Trash2, 
  Linkedin, MessageSquare, Bot, Monitor, CheckCircle, AlertCircle,
  Loader2
} from "lucide-react"

type LinkedInAccount = {
  id: string
  name: string
  email: string
  cookie: string
  status: string
  riskLevel: string
  dailyLimit: number
  dailyUsed: number
}

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('accounts')
  
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [accountForm, setAccountForm] = useState({ name: '', email: '', cookie: '' })

  const [devtoolsSettings, setDevtoolsSettings] = useState({
    workerHost: 'ekim-ubuntu-worker',
    workerPort: '9222',
    chromePath: '/usr/bin/chromium',
    sessionPoolSize: 5,
    headless: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const accountsRes = await fetch('/api/accounts')
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

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm)
      })
      if (res.ok) {
        const newAccount = await res.json()
        setAccounts([...accounts, newAccount])
        setShowAccountForm(false)
        setAccountForm({ name: '', email: '', cookie: '' })
      }
    } catch (error) {
      console.error('Error adding account:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Delete this account?')) return
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAccounts(accounts.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const getRiskBadge = (risk: string) => {
    const colors: Record<string, string> = {
      GREEN: 'bg-green-100 text-green-700',
      YELLOW: 'bg-yellow-100 text-yellow-700',
      RED: 'bg-red-100 text-red-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk] || colors.GREEN}`}>{risk}</span>
  }

  const sections = [
    { id: 'accounts', label: 'LinkedIn Accounts', icon: Linkedin },
    { id: 'devtools', label: 'Browser DevTools', icon: Monitor },
    { id: 'general', label: 'General Settings', icon: Settings },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your accounts and configuration</p>
      </div>

      <div className="flex gap-4 mb-6">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* LinkedIn Accounts Section */}
      {activeSection === 'accounts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>LinkedIn Accounts</span>
              <Button onClick={() => setShowAccountForm(!showAccountForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardTitle>
            <CardDescription>Manage your LinkedIn accounts for automation</CardDescription>
          </CardHeader>
          <CardContent>
            {showAccountForm && (
              <form onSubmit={handleAddAccount} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-4">Add LinkedIn Account</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Name</label>
                    <Input
                      value={accountForm.name}
                      onChange={e => setAccountForm({ ...accountForm, name: e.target.value })}
                      placeholder="e.g., Sales Account 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn Email</label>
                    <Input
                      type="email"
                      value={accountForm.email}
                      onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">li_at Cookie *</label>
                    <Input
                      value={accountForm.cookie}
                      onChange={e => setAccountForm({ ...accountForm, cookie: e.target.value })}
                      placeholder="Paste li_at cookie"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Add Account
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAccountForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Linkedin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No LinkedIn accounts added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${account.status === 'ACTIVE' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Linkedin className={`w-5 h-5 ${account.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{account.name}</h4>
                          {getRiskBadge(account.riskLevel || 'GREEN')}
                        </div>
                        <p className="text-sm text-gray-500">{account.email}</p>
                        <p className="text-xs text-gray-400">
                          Today: {account.dailyUsed || 0} / {account.dailyLimit || 100}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{"📋"} How to get li_at Cookie</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Log in to LinkedIn in your browser</li>
                <li>Press F12 to open Developer Tools</li>
                <li>Go to Application{'>'}Cookies</li>
                <li>Click linkedin.com</li>
                <li>Copy the Value of li_at</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DevTools Section */}
      {activeSection === 'devtools' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Browser DevTools Settings
            </CardTitle>
            <CardDescription>Configure browser automation connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Worker Host</label>
                <Input
                  value={devtoolsSettings.workerHost}
                  onChange={e => setDevtoolsSettings({ ...devtoolsSettings, workerHost: e.target.value })}
                  placeholder="ekim-ubuntu-worker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Worker Port</label>
                <Input
                  value={devtoolsSettings.workerPort}
                  onChange={e => setDevtoolsSettings({ ...devtoolsSettings, workerPort: e.target.value })}
                  placeholder="9222"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Connection Info</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">WebSocket:</span> ws://{devtoolsSettings.workerHost}:{devtoolsSettings.workerPort}</p>
              </div>
            </div>

            <Button>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* General Settings Section */}
      {activeSection === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" defaultValue="Demo User" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Risk Alerts</p>
                    <p className="text-sm text-gray-500">When account status changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
