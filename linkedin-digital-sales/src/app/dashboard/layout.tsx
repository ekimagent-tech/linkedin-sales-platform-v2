import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Zap,
  Settings,
  LogOut,
  Linkedin,
  Activity,
  FileText,
  Calendar,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Users },
  { href: "/dashboard/prospects", label: "Prospects", icon: UserPlus },
  { href: "/dashboard/automation", label: "Automation", icon: Zap },
  { href: "/dashboard/drafts", label: "Drafts", icon: FileText },
  { href: "/dashboard/meetings", label: "Meetings", icon: Calendar },
  { href: "/dashboard/activity", label: "Activity Log", icon: Activity },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  async function handleSignOut() {
    "use server"
    await signOut({ redirect: true, redirectTo: "/login" })
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Linkedin className="w-8 h-8 text-blue-500" />
            <span className="font-bold text-lg">LinkedIn Sales</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium">
                {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.user?.name || session.user?.email}
              </p>
            </div>
          </div>
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
