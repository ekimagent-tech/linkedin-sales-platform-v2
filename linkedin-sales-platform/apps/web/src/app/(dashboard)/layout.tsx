import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">LinkedIn Sales</h1>
        </div>
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Dashboard
            </Button>
          </Link>
          <Link href="/accounts">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Accounts
            </Button>
          </Link>
          <Link href="/prospects">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Prospects
            </Button>
          </Link>
          <Link href="/automation">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Automation
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Settings
            </Button>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50">
        {children}
      </main>
    </div>
  )
}
