'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Check, X, Plus, Loader2, Trash2, Video, MapPin } from "lucide-react"

type Meeting = {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  timezone: string
  status: string
  prospectId: string | null
  prospect: { name: string } | null
  templateId: string | null
  template: { name: string; duration: number } | null
  createdAt: string
}

type MeetingTemplate = {
  id: string
  name: string
  title: string
  description: string | null
  duration: number
  isDefault: boolean
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: '已排程', color: 'text-blue-600', bg: 'bg-blue-100' },
  CONFIRMED: { label: '已確認', color: 'text-green-600', bg: 'bg-green-100' },
  COMPLETED: { label: '已完成', color: 'text-gray-600', bg: 'bg-gray-100' },
  CANCELLED: { label: '已取消', color: 'text-red-600', bg: 'bg-red-100' },
  NO_SHOW: { label: '未出席', color: 'text-orange-600', bg: 'bg-orange-100' }
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [templates, setTemplates] = useState<MeetingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    templateId: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [meetingsRes, templatesRes] = await Promise.all([
        fetch('/api/meetings'),
        fetch('/api/meetings/templates')
      ])
      if (meetingsRes.ok) setMeetings(await meetingsRes.json())
      if (templatesRes.ok) setTemplates(await templatesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const template = templates.find(t => t.id === formData.templateId)
      const duration = template?.duration || 30
      
      const startDate = new Date(formData.startTime)
      const endDate = new Date(formData.endTime) || new Date(startDate.getTime() + duration * 60000)

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        })
      })

      if (res.ok) {
        const newMeeting = await res.json()
        setMeetings([...meetings, newMeeting])
        setShowForm(false)
        setFormData({ title: '', description: '', startTime: '', endTime: '', templateId: '' })
      }
    } catch (error) {
      console.error('Error creating meeting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/meetings/${id}/confirm`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setMeetings(meetings.map(m => m.id === id ? updated : m))
      }
    } catch (error) {
      console.error('Error confirming meeting:', error)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('確定要取消這個會議嗎?')) return
    try {
      const res = await fetch(`/api/meetings/${id}/cancel`, { method: 'POST' })
      if (res.ok) {
        const updated = await res.json()
        setMeetings(meetings.map(m => m.id === id ? updated : m))
      }
    } catch (error) {
      console.error('Error cancelling meeting:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個會議嗎?')) return
    try {
      const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMeetings(meetings.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Error deleting meeting:', error)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const upcomingMeetings = meetings.filter(m => 
    ['SCHEDULED', 'CONFIRMED'].includes(m.status) && 
    new Date(m.startTime) > new Date()
  )
  const pastMeetings = meetings.filter(m => 
    new Date(m.startTime) <= new Date() || 
    ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(m.status)
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">會面預約</h1>
          <p className="text-gray-500 mt-1">管理會議和預約時段</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          建立會議
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>建立新會議</CardTitle>
            <CardDescription>安排與潛在客戶的會議</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">會議標題</label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="例如：產品演示"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">模板</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.templateId}
                    onChange={e => setFormData({ ...formData, templateId: e.target.value })}
                  >
                    <option value="">無模板</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.duration}分鐘)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">開始時間</label>
                  <Input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">結束時間 (可選)</label>
                  <Input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="會議描述..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                  建立會議
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : meetings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">尚無會議</h3>
            <p className="text-gray-500 mb-4">建立您的第一個會議來安排與潛在客戶的會面。</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              建立會議
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Meetings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">即將舉行的會議</h2>
            {upcomingMeetings.length === 0 ? (
              <p className="text-gray-500">沒有即將舉行的會議</p>
            ) : (
              <div className="grid gap-4">
                {upcomingMeetings.map((meeting) => {
                  const config = statusConfig[meeting.status] || statusConfig.SCHEDULED
                  return (
                    <Card key={meeting.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                                {config.label}
                              </span>
                              {meeting.template && (
                                <span className="text-sm text-gray-500">{meeting.template.name}</span>
                              )}
                            </div>
                            <h3 className="font-medium text-lg">{meeting.title}</h3>
                            {meeting.prospect && (
                              <p className="text-sm text-gray-500 mb-2">與 {meeting.prospect.name}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatTime(meeting.startTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {meeting.template?.duration || 30} 分鐘
                              </span>
                            </div>
                            {meeting.description && (
                              <p className="text-sm text-gray-500 mt-2">{meeting.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            {meeting.status === 'SCHEDULED' && (
                              <Button size="sm" onClick={() => handleConfirm(meeting.id)}>
                                <Check className="w-4 h-4 mr-1" />
                                確認
                              </Button>
                            )}
                            {['SCHEDULED', 'CONFIRMED'].includes(meeting.status) && (
                              <Button size="sm" variant="outline" onClick={() => handleCancel(meeting.id)}>
                                <X className="w-4 h-4 mr-1" />
                                取消
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(meeting.id)}>
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
          </div>

          {/* Past Meetings */}
          {pastMeetings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">過往會議</h2>
              <div className="grid gap-4">
                {pastMeetings.map((meeting) => {
                  const config = statusConfig[meeting.status] || statusConfig.COMPLETED
                  return (
                    <Card key={meeting.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                            <h3 className="font-medium">{meeting.title}</h3>
                            <p className="text-sm text-gray-500">{formatTime(meeting.startTime)}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(meeting.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
