"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, RefreshCw, AlertTriangle, CheckCircle, XCircle, Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react"

// Mock data for MVP
const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Primary Account",
    status: "connected",
    riskLevel: "low",
    dailyLimit: 50,
    usedToday: 23,
    lastSync: "2 min ago",
    cookie: "li_at=xxx",
  },
  {
    id: "2",
    name: "Secondary Account",
    status: "connected",
    riskLevel: "medium",
    dailyLimit: 30,
    usedToday: 28,
    lastSync: "5 min ago",
    cookie: "li_at=yyy",
  },
  {
    id: "3",
    name: "Test Account",
    status: "disconnected",
    riskLevel: "high",
    dailyLimit: 20,
    usedToday: 0,
    lastSync: "Never",
    cookie: "",
  },
]

interface Account {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  riskLevel: 'low' | 'medium' | 'high'
  dailyLimit: number
  usedToday: number
  lastSync: string
  cookie?: string
  testStatus?: 'idle' | 'testing' | 'success' | 'failed'
  testError?: string
}

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccountName, setNewAccountName] = useState("")
  const [newCookie, setNewCookie] = useState("")

  const handleAddAccount = () => {
    if (!newAccountName) return
    
    const newAccount: Account = {
      id: String(accounts.length + 1),
      name: newAccountName,
      status: newCookie ? "connected" : "disconnected",
      riskLevel: "low",
      dailyLimit: 50,
      usedToday: 0,
      lastSync: "Just now",
      cookie: newCookie,
    }
    
    setAccounts([...accounts, newAccount])
    setNewAccountName("")
    setNewCookie("")
    setShowAddForm(false)
  }

  // Test connection - simulates validating the LinkedIn cookie
  const testConnection = async (accountId: string) => {
    const accountIndex = accounts.findIndex(a => a.id === accountId)
    if (accountIndex === -1) return

    // Set testing state
    setAccounts(prev => prev.map(a => 
      a.id === accountId ? { ...a, testStatus: 'testing', testError: undefined } : a
    ))

    // Simulate API call to validate cookie (1.5s delay)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock validation - in real app would call LinkedIn API
    const account = accounts[accountIndex]
    const isValid = account.cookie && account.cookie.length > 5

    if (isValid) {
      setAccounts(prev => prev.map(a => 
        a.id === accountId ? { ...a, testStatus: 'success', status: 'connected' as const } : a
      ))
    } else {
      setAccounts(prev => prev.map(a => 
        a.id === accountId ? { 
          ...a, 
          testStatus: 'failed', 
          status: 'error' as const,
          testError: 'Invalid or expired cookie. Please update your LinkedIn session cookie.' 
        } : a
      ))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "disconnected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your LinkedIn accounts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect New LinkedIn Account</CardTitle>
            <CardDescription>
              Enter your LinkedIn session cookie to connect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Account Name</label>
                <Input
                  placeholder="My LinkedIn Account"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">LinkedIn Cookie</label>
                <Input
                  placeholder="li_at=..."
                  value={newCookie}
                  onChange={(e) => setNewCookie(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Extract cookie from browser developer tools (Applications → Cookies → li_at)
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAccount}>Connect Account</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className={account.testStatus === 'failed' ? 'border-red-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                {getStatusIcon(account.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Test Connection Status */}
                {account.testStatus === 'testing' && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing connection...
                  </div>
                )}
                {account.testStatus === 'success' && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Connection successful!
                  </div>
                )}
                {account.testStatus === 'failed' && (
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{account.testError || 'Connection failed'}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Risk Level</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(account.riskLevel)}`}>
                    {account.riskLevel.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Daily Usage</span>
                    <span className="font-medium">{account.usedToday} / {account.dailyLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(account.usedToday / account.dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Sync</span>
                  <span>{account.lastSync}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => testConnection(account.id)}
                    disabled={account.testStatus === 'testing'}
                  >
                    {account.testStatus === 'testing' ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : account.status === 'connected' ? (
                      <Wifi className="w-3 h-3 mr-1" />
                    ) : (
                      <WifiOff className="w-3 h-3 mr-1" />
                    )}
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
