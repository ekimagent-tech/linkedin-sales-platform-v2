"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface AutomationRule {
  id: string
  name: string
  trigger: string
  actions: string
  enabled: boolean
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [ruleName, setRuleName] = useState("")
  const [trigger, setTrigger] = useState("new_prospect")
  const [actions, setActions] = useState("like,follow")

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: ruleName,
      trigger,
      actions,
      enabled: true,
    }
    
    setRules([...rules, newRule])
    toast.success("Automation rule created!")
    setShowAddForm(false)
    setRuleName("")
  }

  const toggleRule = (id: string) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id))
    toast.success("Rule deleted")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Automation Rules</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Create Rule"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Automation Rule</CardTitle>
            <CardDescription>Set up automated actions for your prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  placeholder="My Automation Rule"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger</Label>
                <select
                  id="trigger"
                  className="w-full p-2 border rounded-md"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                >
                  <option value="new_prospect">New Prospect Added</option>
                  <option value="daily">Daily Scheduled</option>
                  <option value="manual">Manual Trigger</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actions">Actions</Label>
                <Input
                  id="actions"
                  placeholder="like,follow,message"
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                />
              </div>
              <Button type="submit">Create Rule</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {rules.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No automation rules yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowAddForm(true)}>
              Create Your First Rule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Trigger: {rule.trigger} to Actions: {rule.actions}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={rule.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRule(rule.id)}
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
