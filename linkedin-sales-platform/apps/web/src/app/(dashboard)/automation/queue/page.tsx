"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Play, Pause, CheckCircle, XCircle, Clock, ThumbsUp, UserPlus, MessageSquare, Eye, ChevronDown, ChevronUp } from "lucide-react"

interface QueuedAction {
  id: string
  prospectName: string
  actionType: "like" | "follow" | "message" | "view_profile"
  status: "pending" | "in_progress" | "completed" | "failed"
  scheduledTime: string
  accountName: string
  logs: string[]
}

const mockActions: QueuedAction[] = [
  {
    id: "1",
    prospectName: "Sarah Chen",
    actionType: "follow",
    status: "pending",
    scheduledTime: "2024-01-15T10:00:00",
    accountName: "My LinkedIn",
    logs: ["Action queued for execution"],
  },
  {
    id: "2",
    prospectName: "Michael Rodriguez",
    actionType: "like",
    status: "pending",
    scheduledTime: "2024-01-15T10:05:00",
    accountName: "My LinkedIn",
    logs: ["Action queued for execution"],
  },
  {
    id: "3",
    prospectName: "Emily Watson",
    actionType: "message",
    status: "in_progress",
    scheduledTime: "2024-01-15T10:10:00",
    accountName: "My LinkedIn",
    logs: ["Action queued for execution", "Opening LinkedIn...", "Navigating to profile..."],
  },
  {
    id: "4",
    prospectName: "David Kim",
    actionType: "view_profile",
    status: "completed",
    scheduledTime: "2024-01-15T09:00:00",
    accountName: "My LinkedIn",
    logs: ["Action queued for execution", "Opening LinkedIn...", "Profile viewed successfully"],
  },
  {
    id: "5",
    prospectName: "Jessica Brown",
    actionType: "like",
    status: "failed",
    scheduledTime: "2024-01-15T08:00:00",
    accountName: "My LinkedIn",
    logs: ["Action queued for execution", "Opening LinkedIn...", "Error: Rate limit exceeded"],
  },
]

const actionIcons = {
  like: ThumbsUp,
  follow: UserPlus,
  message: MessageSquare,
  view_profile: Eye,
}

const actionLabels = {
  like: "Like Profile",
  follow: "Follow",
  message: "Send Message",
  view_profile: "View Profile",
}

export default function AutomationQueuePage() {
  const [actions, setActions] = useState<QueuedAction[]>(mockActions)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleSelection = (id: string) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]
    )
  }

  const selectAll = () => {
    if (selectedIds.length === actions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(actions.map(a => a.id))
    }
  }

  const confirmActions = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one action")
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setActions(actions.map(a => 
      selectedIds.includes(a.id) 
        ? { ...a, status: "pending" as const, logs: [...a.logs, "Confirmed for execution"] }
        : a
    ))
    setSelectedIds([])
    setIsProcessing(false)
    toast.success(`${selectedIds.length} actions confirmed`)
  }

  const getStatusBadge = (status: QueuedAction["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case "in_progress":
        return <Badge variant="default"><Play className="w-3 h-3 mr-1" /> In Progress</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Action Queue</h1>
        <p className="text-muted-foreground mt-2">Review and confirm automated actions before execution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{actions.filter(a => a.status === "pending").length}</div>
            <p className="text-sm text-muted-foreground">Pending Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{actions.filter(a => a.status === "in_progress").length}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{actions.filter(a => a.status === "completed").length}</div>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Queued Actions</CardTitle>
            <CardDescription>{actions.length} total actions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll}>
              {selectedIds.length === actions.length ? "Deselect All" : "Select All"}
            </Button>
            <Button onClick={confirmActions} disabled={selectedIds.length === 0 || isProcessing}>
              {isProcessing ? "Processing..." : `Confirm ${selectedIds.length} Actions`}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {actions.map((action) => {
              const ActionIcon = actionIcons[action.actionType]
              return (
                <div key={action.id} className="border rounded-lg">
                  <div className="p-4 flex items-center gap-4">
                    <Checkbox
                      id={action.id}
                      checked={selectedIds.includes(action.id)}
                      onCheckedChange={() => toggleSelection(action.id)}
                    />
                    <ActionIcon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{action.prospectName}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm">{actionLabels[action.actionType]}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{action.accountName}</span>
                        <span>•</span>
                        <span>{new Date(action.scheduledTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    {getStatusBadge(action.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(action.id)}
                    >
                      {expandedId === action.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {expandedId === action.id && (
                    <div className="border-t p-4 bg-muted/30">
                      <h4 className="text-sm font-medium mb-2">Execution Logs</h4>
                      <div className="space-y-1">
                        {action.logs.map((log, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/50" />
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
