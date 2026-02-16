"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

// Mock data for MVP
const initialAccounts = [
  {
    id: "1",
    name: "Primary Account",
    status: "connected",
    riskLevel: "low",
    dailyLimit: 50,
    usedToday: 23,
    lastSync: "2 min ago",
  },
  {
    id: "2",
    name: "Secondary Account",
    status: "connected",
    riskLevel: "medium",
    dailyLimit: 30,
    usedToday: 28,
    lastSync: "5 min ago",
  },
  {
    id: "3",
    name: "Test Account",
    status: "disconnected",
    riskLevel: "high",
    dailyLimit: 20,
    usedToday: 0,
    lastSync: "Never",
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccountName, setNewAccountName] = useState("")
  const [newCookie, setNewCookie] = useState("")

  const handleAddAccount = () => {
    if (!newAccountName) return
    
    const newAccount = {
      id: String(accounts.length + 1),
      name: newAccountName,
      status: "connected",
      riskLevel: "low",
      dailyLimit: 50,
      usedToday: 0,
      lastSync: "Just now",
    }
    
    setAccounts([...accounts, newAccount])
    setNewAccountName("")
    setNewCookie("")
    setShowAddForm(false)
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
                  Extract cookie from browser developer tools
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
          <Card key={account.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                {getStatusIcon(account.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Settings
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
