"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Linkedin, 
  MapPin, 
  Building, 
  Mail, 
  Phone, 
  Users, 
  UserPlus,
  MessageSquare,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Calendar,
  Edit,
  Trash2,
  Loader2
} from "lucide-react"

// Mock data for prospects - in production, this would come from API
const mockProspects: Record<string, {
  id: string
  name: string
  title: string
  company: string
  location: string
  linkedinId: string
  email?: string
  phone?: string
  connections: number
  followers: number
  bio: string
  tags: string[]
  notes: string
  activities: {
    type: string
    date: string
    description: string
  }[]
}> = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    title: "VP of Sales",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    linkedinId: "sarah-johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (415) 555-0123",
    connections: 2500,
    followers: 3200,
    bio: "Results-driven VP of Sales with 15+ years of experience in enterprise B2B sales. Passionate about building high-performing teams and driving revenue growth.",
    tags: ["enterprise", "decision-maker", "vip"],
    notes: "Met at SaaS Conference 2024. Interested in automation solutions. Follow up in Q2.",
    activities: [
      { type: "connected", date: "2024-01-15", description: "Connected on LinkedIn" },
      { type: "message", date: "2024-01-20", description: "Sent introduction message" },
      { type: "view", date: "2024-01-25", description: "Viewed profile" },
    ]
  },
  "2": {
    id: "2",
    name: "Mike Chen",
    title: "CEO",
    company: "StartupXYZ",
    location: "New York, NY",
    linkedinId: "mike-chen",
    email: "mike@startupxyz.com",
    connections: 5000,
    followers: 8500,
    bio: "Serial entrepreneur. Building the future of fintech. Previously founded 2 successful exits.",
    tags: ["startup", "founder", "tech"],
    notes: "Referral from John Smith. Fast decision maker.",
    activities: [
      { type: "follow", date: "2024-02-01", description: "Followed" },
      { type: "like", date: "2024-02-02", description: "Liked post about funding" },
    ]
  },
  "3": {
    id: "3",
    name: "Emily Davis",
    title: "Marketing Director",
    company: "BrandCo",
    location: "Austin, TX",
    linkedinId: "emily-davis",
    email: "emily.davis@brandco.com",
    connections: 1800,
    followers: 2100,
    bio: "Marketing leader specializing in digital transformation and brand strategy.",
    tags: ["marketing", "b2b", "growth"],
    notes: "Interested in content marketing automation.",
    activities: [
      { type: "message", date: "2024-01-10", description: "Sent product demo request" },
    ]
  },
  "4": {
    id: "4",
    name: "Alex Wong",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    linkedinId: "alex-wong",
    connections: 1200,
    followers: 950,
    bio: "Product manager focused on developer tools and API products.",
    tags: ["product", "tech", "developer"],
    notes: "Tech-savvy, good fit for API integration product.",
    activities: []
  },
  "5": {
    id: "5",
    name: "Jessica Lee",
    title: "Head of Operations",
    company: "ScaleUp.io",
    location: "Boston, MA",
    linkedinId: "jessica-lee",
    connections: 3200,
    followers: 2800,
    bio: "Operations expert helping startups scale efficiently.",
    tags: ["operations", "enterprise", "scale"],
    notes: "Looking for automation solutions for her team.",
    activities: [
      { type: "follow", date: "2024-01-05", description: "Followed" },
      { type: "connect", date: "2024-01-06", description: "Connected" },
    ]
  },
  "6": {
    id: "6",
    name: "David Park",
    title: "Sales Director",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    linkedinId: "david-park",
    email: "d.park@enterprisesolutions.com",
    connections: 4100,
    followers: 3600,
    bio: "Sales leader with expertise in enterprise accounts and strategic partnerships.",
    tags: ["sales", "enterprise", "partnerships"],
    notes: "Large enterprise account. Long sales cycle expected.",
    activities: [
      { type: "like", date: "2024-02-05", description: "Liked company update" },
      { type: "comment", date: "2024-02-06", description: "Commented on post" },
    ]
  },
}

export default function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const prospect = mockProspects[resolvedParams.id]

  if (!prospect) {
    return (
      <div className="p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Prospects
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Prospect not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert(`${action} action would be performed on ${prospect.name}`)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {prospect.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{prospect.name}</CardTitle>
                    <p className="text-gray-500">{prospect.title}</p>
                    <a
                      href={`https://linkedin.com/in/${prospect.linkedinId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Linkedin className="w-3 h-3" />
                      View LinkedIn Profile
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Building className="w-4 h-4" />
                  </div>
                  <p className="font-semibold">{prospect.company}</p>
                  <p className="text-xs text-gray-500">Company</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="font-semibold">{prospect.location}</p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="font-semibold">{prospect.connections.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Connections</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <p className="font-semibold">{prospect.followers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{prospect.bio}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {prospect.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t space-y-2">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prospect.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{prospect.email}</span>
                    </div>
                  )}
                  {prospect.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{prospect.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity History */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {prospect.activities.length > 0 ? (
                <div className="space-y-4">
                  {prospect.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.type === 'connected' && <UserPlus className="w-4 h-4 text-blue-500" />}
                        {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-green-500" />}
                        {activity.type === 'follow' && <Users className="w-4 h-4 text-purple-500" />}
                        {activity.type === 'like' && <ThumbsUp className="w-4 h-4 text-orange-500" />}
                        {activity.type === 'view' && <Users className="w-4 h-4 text-gray-500" />}
                        {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Notes */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => handleAction('Connect')}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                Connect
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('Follow')}
                disabled={isLoading}
              >
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('Message')}
                disabled={isLoading}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('Like')}
                disabled={isLoading}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAction('Share')}
                disabled={isLoading}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Content
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notes</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{prospect.notes}</p>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Last updated: Jan 15, 2024
              </p>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 text-sm">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Prospect
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
