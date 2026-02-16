"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  ThumbsUp,
  UserPlus,
  MessageSquare,
  Eye,
  RefreshCw,
  Trash2,
  Activity,
  AlertCircle,
  ChevronRight,
  FileText
} from "lucide-react"

interface QueueItem {
  id: string
  prospectName: string
  prospectTitle: string
  prospectCompany: string
  action: "like" | "follow" | "connect" | "message"
  status: "pending" | "executing" | "completed" | "failed"
  recommendedMessage?: string
  errorMessage?: string
  createdAt: string
  executedAt?: string
  linkedinUrl: string
}

const initialQueue: QueueItem[] = [
  {
    id: "1",
    prospectName: "Sarah Johnson",
    prospectTitle: "VP of Sales",
    prospectCompany: "TechCorp Inc.",
    action: "follow",
    status: "pending",
    createdAt: "2 min ago",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson"
  },
  {
    id: "2",
    prospectName: "Michael Chen",
    prospectTitle: "Chief Revenue Officer",
    prospectCompany: "Enterprise Solutions",
    action: "connect",
    status: "pending",
    recommendedMessage: "Hi Michael, I noticed your impressive background in revenue growth. I'd love to connect and share some insights on B2B sales strategies that have worked for our clients.",
    createdAt: "5 min ago",
    linkedinUrl: "https://linkedin.com/in/michaelchen"
  },
  {
    id: "3",
    prospectName: "Emily Rodriguez",
    prospectTitle: "Head of Business Development",
    prospectCompany: "CloudScale Systems",
    action: "like",
    status: "pending",
    createdAt: "10 min ago",
    linkedinUrl: "https://linkedin.com/in/emilyrodriguez"
  },
  {
    id: "4",
    prospectName: "David Park",
    prospectTitle: "Sales Director",
    prospectCompany: "DataFlow Analytics",
    action: "message",
    status: "pending",
    recommendedMessage: "Hi David, I saw your post about data-driven sales. Would love to chat about how our platform has helped similar companies increase their pipeline velocity by 40%.",
    createdAt: "15 min ago",
    linkedinUrl: "https://linkedin.com/in/davidpark"
  },
  {
    id: "5",
    prospectName: "Jessica Williams",
    prospectTitle: "Director of Enterprise Accounts",
    prospectCompany: "InnovateTech",
    action: "follow",
    status: "completed",
    createdAt: "1 hour ago",
    executedAt: "45 min ago",
    linkedinUrl: "https://linkedin.com/in/jessicawilliams"
  },
  {
    id: "6",
    prospectName: "James Wilson",
    prospectTitle: "Chief Commercial Officer",
    prospectCompany: "Enterprise Cloud Co",
    action: "connect",
    status: "failed",
    errorMessage: "Connection request limit reached. Try again tomorrow.",
    createdAt: "2 hours ago",
    linkedinUrl: "https://linkedin.com/in/jameswilson"
  }
]

export default function AutomationQueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue)
  const [isPaused, setIsPaused] = useState(false)
  const [executingId, setExecutingId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null)

  const getActionIcon = (action: string) => {
    switch (action) {
      case "like": return <ThumbsUp className="w-4 h-4" />
      case "follow": return <UserPlus className="w-4 h-4" />
      case "connect": return <UserPlus className="w-4 h-4" />
      case "message": return <MessageSquare className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "like": return "bg-orange-100 text-orange-700"
      case "follow": return "bg-purple-100 text-purple-700"
      case "connect": return "bg-blue-100 text-blue-700"
      case "message": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-gray-400" />
      case "executing": return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const handleExecute = async (item: QueueItem) => {
    if (isPaused) return
    
    setExecutingId(item.id)
    
    // Update status to executing
    setQueue(prev => prev.map(q => 
      q.id === item.id ? { ...q, status: "executing" as const } : q
    ))
    
    // Simulate execution (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Randomly succeed or fail for demo
    const success = Math.random() > 0.2
    
    setQueue(prev => prev.map(q => 
      q.id === item.id ? { 
        ...q, 
        status: success ? "completed" as const : "failed" as const,
        executedAt: "Just now",
        errorMessage: success ? undefined : "Action failed. Please try again."
      } : q
    ))
    
    setExecutingId(null)
  }

  const handleExecuteAll = async () => {
    const pendingItems = queue.filter(q => q.status === "pending")
    
    for (const item of pendingItems) {
      await handleExecute(item)
      // Small delay between actions
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const handleDelete = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id))
  }

  const handleClearCompleted = () => {
    setQueue(prev => prev.filter(q => q.status !== "completed"))
  }

  const handleRetry = (item: QueueItem) => {
    setQueue(prev => prev.map(q => 
      q.id === item.id ? { ...q, status: "pending" as const, errorMessage: undefined } : q
    ))
  }

  const pendingCount = queue.filter(q => q.status === "pending").length
  const completedCount = queue.filter(q => q.status === "completed").length
  const failedCount = queue.filter(q => q.status === "failed").length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Queue</h1>
          <p className="text-gray-500 mt-1">
            Review and execute AI-recommended actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )}
          </Button>
          <Button 
            onClick={handleExecuteAll}
            disabled={pendingCount === 0 || isPaused}
          >
            <Play className="w-4 h-4 mr-2" />
            Execute All ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Items */}
      <div className="space-y-3">
        {queue.map((item) => (
          <Card 
            key={item.id} 
            className={`${item.status === 'executing' ? 'border-blue-300 bg-blue-50' : ''} ${item.status === 'failed' ? 'border-red-200' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${getActionColor(item.action)}`}>
                    {getActionIcon(item.action)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.prospectName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getActionColor(item.action)}`}>
                        {item.action}
                      </span>
                      {getStatusIcon(item.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {item.prospectTitle} at {item.prospectCompany}
                    </p>
                    {item.recommendedMessage && (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs text-blue-500 hover:underline mt-1 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View message
                      </button>
                    )}
                    {item.status === "failed" && item.errorMessage && (
                      <p className="text-xs text-red-500 mt-1">{item.errorMessage}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {item.createdAt}
                      {item.executedAt && ` • Executed: ${item.executedAt}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.status === "pending" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleExecute(item)}
                      disabled={isPaused || executingId !== null}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Execute
                    </Button>
                  )}
                  {item.status === "failed" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRetry(item)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  {item.status === "completed" && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {item.status === "executing" && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Executing...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {queue.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Queue is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Add prospects to generate action recommendations
          </p>
        </div>
      )}

      {/* Clear Completed */}
      {completedCount > 0 && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleClearCompleted}>
            Clear Completed
          </Button>
        </div>
      )}

      {/* Message Modal */}
      {selectedItem && (
        <dialog id="message-modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Recommended Message</h3>
                <p className="text-sm text-gray-500">
                  For {selectedItem.prospectName}
                </p>
              </div>
              <form method="dialog">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <XCircle className="w-4 h-4" />
                </Button>
              </form>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedItem.recommendedMessage || "No message available for this action."}
              </p>
            </div>
            
            <div className="modal-action">
              <form method="dialog">
                <Button variant="outline">Close</Button>
              </form>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.recommendedMessage || "")
                }}
              >
                Copy Message
              </Button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedItem(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}
