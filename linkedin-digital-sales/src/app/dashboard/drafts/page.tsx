'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Check, X, Clock, Send, Loader2, Sparkles, Trash2, Edit } from "lucide-react"

type MessageDraft = {
  id: string
  content: string
  actionType: string
  status: string
  scheduledAt: string | null
  sentAt: string | null
  approvedBy: string | null
  approvedAt: string | null
  rejectionReason: string | null
  prospectId: string | null
  prospect: { name: string } | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: '草稿', color: 'text-gray-600', bg: 'bg-gray-100' },
  PENDING_APPROVAL: { label: '待審批', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  APPROVED: { label: '已批准', color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { label: '已拒絕', color: 'text-red-600', bg: 'bg-red-100' },
  SCHEDULED: { label: '已排程', color: 'text-blue-600', bg: 'bg-blue-100' },
  SENT: { label: '已發送', color: 'text-green-600', bg: 'bg-green-100' },
  FAILED: { label: '失敗', color: 'text-red-600', bg: 'bg-red-100' }
}

const actionLabels: Record<string, string> = {
  MESSAGE: '私訊',
  CONNECT: '連接邀請',
  FOLLOW: '追蹤'
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<MessageDraft[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<MessageDraft | null>(null)
  const [editContent, setEditContent] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchDrafts()
  }, [filter])

  const fetchDrafts = async () => {
    try {
      const url = filter === 'all' ? '/api/drafts' : `/api/drafts?status=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setDrafts(data)
      }
    } catch (error) {
      console.error('Error fetching drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'MESSAGE',
          prospectId: null,
          accountId: null
        })
      })
      if (res.ok) {
        const newDraft = await res.json()
        setDrafts([newDraft, ...drafts])
      }
    } catch (error) {
      console.error('Error generating draft:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/drafts/${id}/approve`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setDrafts(drafts.map(d => d.id === id ? updated : d))
      }
    } catch (error) {
      console.error('Error approving draft:', error)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('請輸入拒絕原因:')
    if (reason === null) return
    try {
      const res = await fetch(`/api/drafts/${id}/reject?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason })
      })
      if (res.ok) {
        const updated = await res.json()
        setDrafts(drafts.map(d => d.id === id ? updated : d))
      }
    } catch (error) {
      console.error('Error rejecting draft:', error)
    }
  }

  const handleSchedule = async (id: string) => {
    const dateStr = prompt('請輸入排程時間 (YYYY-MM-DDTHH:MM):', new Date(Date.now() + 86400000).toISOString().slice(0, 16))
    if (!dateStr) return
    try {
      const res = await fetch(`/api/drafts/${id}/schedule?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: dateStr })
      })
      if (res.ok) {
        const updated = await res.json()
        setDrafts(drafts.map(d => d.id === id ? updated : d))
      }
    } catch (error) {
      console.error('Error scheduling draft:', error)
    }
  }

  const handleSend = async (id: string) => {
    try {
      const res = await fetch(`/api/drafts/${id}/send?id=${id}`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setDrafts(drafts.map(d => d.id === id ? updated : d))
      }
    } catch (error) {
      console.error('Error sending draft:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個草稿嗎?')) return
    try {
      const res = await fetch(`/api/drafts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDrafts(drafts.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Error deleting draft:', error)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedDraft) return
    try {
      const res = await fetch(`/api/drafts/${selectedDraft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })
      if (res.ok) {
        const updated = await res.json()
        setDrafts(drafts.map(d => d.id === selectedDraft.id ? updated : d))
        setSelectedDraft(null)
        setEditContent('')
      }
    } catch (error) {
      console.error('Error saving edit:', error)
    }
  }

  const openEdit = (draft: MessageDraft) => {
    setSelectedDraft(draft)
    setEditContent(draft.content)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">審批工作流</h1>
          <p className="text-gray-500 mt-1">管理訊息草稿並審批自動化訊息</p>
        </div>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          AI 生成草稿
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'PENDING_APPROVAL', 'APPROVED', 'SENT'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : statusConfig[f]?.label || f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : drafts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">尚無草稿</h3>
            <p className="text-gray-500 mb-4">點擊「AI 生成草稿」來創建新的訊息草稿。</p>
            <Button onClick={handleGenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI 生成草稿
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => {
            const config = statusConfig[draft.status] || statusConfig.DRAFT
            return (
              <Card key={draft.id} className={selectedDraft?.id === draft.id ? 'ring-2 ring-blue-500' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {actionLabels[draft.actionType] || draft.actionType}
                        </span>
                        {draft.prospect && (
                          <span className="text-sm text-gray-500">
                            • {draft.prospect.name}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                        {draft.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        建立於: {new Date(draft.createdAt).toLocaleString('zh-TW')}
                        {draft.scheduledAt && ` • 排程: ${new Date(draft.scheduledAt).toLocaleString('zh-TW')}`}
                        {draft.sentAt && ` • 發送於: ${new Date(draft.sentAt).toLocaleString('zh-TW')}`}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {draft.status === 'PENDING_APPROVAL' && (
                        <>
                          <Button size="sm" onClick={() => handleApprove(draft.id)}>
                            <Check className="w-4 h-4 mr-1" />
                            批准
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(draft.id)}>
                            <X className="w-4 h-4 mr-1" />
                            拒絕
                          </Button>
                        </>
                      )}
                      {draft.status === 'APPROVED' && (
                        <>
                          <Button size="sm" onClick={() => handleSchedule(draft.id)}>
                            <Clock className="w-4 h-4 mr-1" />
                            排程
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSend(draft.id)}>
                            <Send className="w-4 h-4 mr-1" />
                            立即發送
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(draft)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(draft.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>編輯草稿</CardTitle>
              <CardDescription>修改訊息內容</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit}>儲存</Button>
                <Button variant="outline" onClick={() => { setSelectedDraft(null); setEditContent('') }}>取消</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
