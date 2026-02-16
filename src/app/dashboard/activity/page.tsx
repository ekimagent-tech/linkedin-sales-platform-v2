"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  Users, 
  MessageSquare, 
  UserPlus, 
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { ActivityLog } from "@/types"

// Extended mock data for activity log
const mockActivities: ActivityLog[] = [
  {
    id: "1",
    userId: "user1",
    prospectId: "1",
    prospectName: "Sarah Johnson",
    action: "like",
    targetUrl: "https://linkedin.com/posts/sarah-johnson-123",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
  },
  {
    id: "2",
    userId: "user1",
    prospectId: "2",
    prospectName: "Mike Chen",
    action: "follow",
    status: "completed",
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
  },
  {
    id: "3",
    userId: "user1",
    prospectId: "3",
    prospectName: "Emily Davis",
    action: "connect",
    status: "completed",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "4",
    userId: "user1",
    prospectId: "4",
    prospectName: "Alex Wong",
    action: "message",
    targetUrl: "https://linkedin.com/inbox/4",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "5",
    userId: "user1",
    prospectId: "5",
    prospectName: "Jessica Lee",
    action: "follow",
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: "6",
    userId: "user1",
    prospectId: "6",
    prospectName: "David Park",
    action: "like",
    targetUrl: "https://linkedin.com/posts/david-park-456",
    status: "completed",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "7",
    userId: "user1",
    prospectId: "1",
    prospectName: "Sarah Johnson",
    action: "view",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "8",
    userId: "user1",
    prospectId: "2",
    prospectName: "Mike Chen",
    action: "message",
    status: "pending",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "9",
    userId: "user1",
    prospectId: "3",
    prospectName: "Emily Davis",
    action: "like",
    status: "failed",
    errorMessage: "Rate limit exceeded",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
  },
  {
    id: "10",
    userId: "user1",
    prospectId: "4",
    prospectName: "Alex Wong",
    action: "connect",
    status: "completed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "11",
    userId: "user1",
    prospectId: "5",
    prospectName: "Jessica Lee",
    action: "comment",
    targetUrl: "https://linkedin.com/posts/jessica-lee-789",
    status: "completed",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "12",
    userId: "user1",
    prospectId: "6",
    prospectName: "David Park",
    action: "view",
    status: "completed",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  },
]

const actionIcons: Record<string, React.ElementType> = {
  like: ThumbsUp,
  follow: Users,
  connect: UserPlus,
  message: MessageSquare,
  view: Eye,
  comment: MessageSquare,
  share: RefreshCw,
}

const actionColors: Record<string, string> = {
  like: "bg-orange-100 text-orange-600",
  follow: "bg-purple-100 text-purple-600",
  connect: "bg-blue-100 text-blue-600",
  message: "bg-green-100 text-green-600",
  view: "bg-gray-100 text-gray-600",
  comment: "bg-indigo-100 text-indigo-600",
  share: "bg-teal-100 text-teal-600",
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function ActivityLogPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.prospectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === "all" || activity.action === actionFilter
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter
    return matchesSearch && matchesAction && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleRetry = async (activityId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert(`Retrying activity ${activityId}`)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  // Stats calculations
  const stats = {
    total: mockActivities.length,
    completed: mockActivities.filter(a => a.status === "completed").length,
    pending: mockActivities.filter(a => a.status === "pending").length,
    failed: mockActivities.filter(a => a.status === "failed").length,
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-1">Track all your LinkedIn actions</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Activities</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by prospect name or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All Actions</option>
          <option value="like">Likes</option>
          <option value="follow">Follows</option>
          <option value="connect">Connections</option>
          <option value="message">Messages</option>
          <option value="view">Views</option>
          <option value="comment">Comments</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedActivities.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedActivities.map((activity) => {
                  const IconComponent = actionIcons[activity.action] || Clock
                  const colorClass = actionColors[activity.action] || "bg-gray-100 text-gray-600"

                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{activity.action}</span>
                            {activity.prospectName && (
                              <span className="text-gray-500">
                                {activity.prospectName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatTimeAgo(activity.createdAt)}
                          </div>
                          {activity.errorMessage && (
                            <p className="text-sm text-red-500 mt-1">
                              Error: {activity.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {activity.status === "completed" && (
                          <span className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                        {activity.status === "pending" && (
                          <span className="flex items-center gap-1 text-sm text-yellow-600">
                            <Clock className="w-4 h-4" />
                            Pending
                          </span>
                        )}
                        {activity.status === "failed" && (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-red-600">
                              <XCircle className="w-4 h-4" />
                              Failed
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRetry(activity.id)}
                              disabled={isLoading}
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                        {activity.targetUrl && activity.status === "completed" && (
                          <a
                            href={activity.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No activities found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
