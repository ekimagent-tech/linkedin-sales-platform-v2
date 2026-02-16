import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Profile settings coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">API key management coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>Configure LinkedIn action limits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Rate limit settings coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
