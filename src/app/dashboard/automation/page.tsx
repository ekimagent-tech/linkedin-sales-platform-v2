import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Plus, ToggleLeft, Trash2 } from "lucide-react"

const automationRules = [
  {
    id: "1",
    name: "Auto-follow prospects",
    trigger: "New prospect added",
    actions: "Follow on LinkedIn",
    enabled: true,
    schedule: "Immediate",
  },
  {
    id: "2",
    name: "Auto-like posts",
    trigger: "Prospect posts content",
    actions: "Like post",
    enabled: true,
    schedule: "Every 2 hours",
  },
  {
    id: "3",
    name: "Welcome message",
    trigger: "New connection",
    actions: "Send welcome DM",
    enabled: false,
    schedule: "Immediate",
  },
]

export default function AutomationPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-500 mt-1">Configure your automation rules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="space-y-4">
        {automationRules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Zap className={`w-5 h-5 ${rule.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-500">
                      Trigger: {rule.trigger} • {rule.schedule}
                    </p>
                    <p className="text-sm text-gray-500">
                      Actions: {rule.actions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ToggleLeft className="w-4 h-4 mr-1" />
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>
            Configure daily limits to avoid account restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Daily Actions</h4>
              <p className="text-2xl font-bold">50</p>
              <p className="text-sm text-gray-500">Max per account</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Hourly Limit</h4>
              <p className="text-2xl font-bold">10</p>
              <p className="text-sm text-gray-500">Max per hour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
