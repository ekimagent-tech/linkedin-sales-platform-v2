import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((result) => {
      if (!result?.error) {
        redirect("/dashboard")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            LinkedIn Sales Platform
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Demo: Use any email/password to login
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
