"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Activity, CheckCircle, TrendingUp, MessageSquare, ChevronRight } from "lucide-react"
import { DashboardStats } from "@/types"

// Better mock data for dashboard stats
async function getStats(): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    totalAccounts: 3,
    activeAccounts: 2,
    totalProspects: 156,
    pendingActivities: 12,
    completedActivities: 89,
    thisWeekConnections: 24,
    thisWeekMessages: 18,
    responseRate: 34,
  }
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function StatsCards() {
  const stats = await getStats()

  return (
    <>
      {/* Stats Cards - Clickable with Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/accounts" className="block">
          <Card className="cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalAccounts}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stats.activeAccounts} active
                <ChevronRight className="w-3 h-3 ml-auto" />
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/prospects" className="block">
          <Card className="cursor-pointer hover:shadow-lg hover:border-green-300 transition-all h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProspects}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12 this week
                <ChevronRight className="w-3 h-3 ml-auto" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/automation" className="block">
          <Card className="cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingActivities}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Awaiting execution
                <ChevronRight className="w-3 h-3 ml-auto" />
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/activity" className="block">
          <Card className="cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedActivities}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Total actions taken
                <ChevronRight className="w-3 h-3 ml-auto" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">This Week Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{stats.thisWeekConnections}</div>
            <p className="text-xs text-blue-600">New connections made</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">This Week Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{stats.thisWeekMessages}</div>
            <p className="text-xs text-green-600">Messages sent</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">{stats.responseRate}%</div>
            <p className="text-xs text-purple-600">Average response rate</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your LinkedIn sales activities</p>
      </div>

      {/* Stats with Suspense for loading state */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Recent Activity - Clickable items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Link href="/dashboard/activity" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "1", action: "Followed", target: "John Smith", time: "2 minutes ago", icon: Users, color: "text-purple-500", type: "follow" },
              { id: "2", action: "Liked post", target: "Sarah Johnson's post", time: "15 minutes ago", icon: Activity, color: "text-orange-500", type: "like" },
              { id: "3", action: "Connected with", target: "Mike Chen", time: "1 hour ago", icon: UserPlus, color: "text-blue-500", type: "connect" },
              { id: "4", action: "Sent message", target: "Emily Davis", time: "2 hours ago", icon: MessageSquare, color: "text-green-500", type: "message" },
              { id: "5", action: "Followed", target: "Alex Wong", time: "3 hours ago", icon: Users, color: "text-purple-500", type: "follow" },
            ].map((activity) => (
              <Link 
                key={activity.id}
                href={`/dashboard/activity?filter=${activity.type}`}
                className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  <span className="font-medium">{activity.action}</span>
                  <span className="text-gray-500">{activity.target}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{activity.time}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
