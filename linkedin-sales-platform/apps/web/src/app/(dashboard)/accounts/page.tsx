"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, CheckCircle, XCircle, Wifi } from "lucide-react"

interface LinkedInAccount {
  id: string
  name: string
  status: string
  riskLevel: number
  dailyLimit: number
  usedToday: number
  lastSync: string | null
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [accountName, setAccountName] = useState("")
  const [cookie, setCookie] = useState("")

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newAccount: LinkedInAccount = {
      id: Date.now().toString(),
      name: accountName,
      status: "active",
      riskLevel: 0,
      dailyLimit: 50,
      usedToday: 0,
      lastSync: new Date().toISOString(),
    }
    
    setAccounts([...accounts, newAccount])
    toast.success("Account connected!")
    setShowAddForm(false)
    setAccountName("")
    setCookie("")
  }

  const getRiskColor = (level: number) => {
    if (level < 30) return "text-green-500"
    if (level < 70) return "text-yellow-500"
    return "text-red-500"
  }

  const testConnection = async (accountId: string) => {
    toast.promise(
      (async () => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const success = Math.random() > 0.2
        if (!success) throw new Error("Connection failed")
        setAccounts(accounts.map(acc => 
          acc.id === accountId ? { ...acc, status: "active" } : acc
        ))
        return "Connection successful!"
      })(),
      {
        loading: "Validating cookie...",
        success: "Connection successful!",
        error: "Connection failed. Please re-authenticate.",
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">LinkedIn Accounts</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Connect Account"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect LinkedIn Account</CardTitle>
            <CardDescription>
              Enter your LinkedIn session cookie to connect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  placeholder="My LinkedIn Account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookie">LinkedIn Session Cookie</Label>
                <Input
                  id="cookie"
                  type="password"
                  placeholder="li_at=..."
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Connect Account</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No accounts connected yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowAddForm(true)}>
              Connect Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {account.name}
                  <span className={`text-xs px-2 py-1 rounded ${
                    account.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {account.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className={getRiskColor(account.riskLevel)}>{account.riskLevel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Limit</span>
                    <span>{account.usedToday}/{account.dailyLimit}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => testConnection(account.id)}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
