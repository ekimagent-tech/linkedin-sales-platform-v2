"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Search,
  ListOrdered,
  Sparkles,
  ChevronDown,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/accounts", label: "Accounts", icon: Users },
  { href: "/dashboard/prospects", label: "Prospects", icon: UserPlus, children: [
    { href: "/dashboard/prospects", label: "All Prospects", icon: UserPlus },
    { href: "/dashboard/prospects/setup", label: "Setup Product", icon: Sparkles },
    { href: "/dashboard/prospects/search", label: "Smart Search", icon: Search },
  ]},
  { href: "/dashboard/activity", label: "Activity Log", icon: Activity },
  { href: "/dashboard/automation", label: "Automation", icon: Zap, children: [
    { href: "/dashboard/automation", label: "Rules", icon: Zap },
    { href: "/dashboard/automation/queue", label: "Queue", icon: ListOrdered },
  ]},
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function Navigation({ session }: { session: any }) {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.children && item.children.some((c: any) => pathname === c.href))
          
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                )}
              </Link>
              
              {item.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child: any) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors ${pathname === child.href ? 'bg-slate-700' : ''}`}
                    >
                      <child.icon className="w-4 h-4" />
                      <span className="text-sm">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm font-medium">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || session?.user?.email}
            </p>
          </div>
        </div>
        <form action={async () => {
          const { signOut } = await import("next-auth/react")
          signOut({ callbackUrl: "/login" })
        }}>
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
    </>
  )
}

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/login")
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
        
        <Navigation session={session} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
