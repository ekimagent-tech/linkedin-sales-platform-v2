import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, User, Bell, Shield, Key } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Your name" defaultValue="Demo User" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="your@email.com" defaultValue="demo@example.com" disabled />
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
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your activities</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activity Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when actions are completed</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage API keys for integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Your API Key</p>
              <code className="text-xs bg-white px-2 py-1 rounded border">
                lks_••••••••••••••••••••••••
              </code>
              <Button variant="outline" size="sm" className="ml-4">
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
