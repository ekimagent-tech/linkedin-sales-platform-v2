"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Plus, MoreHorizontal, Linkedin, MapPin, Building } from "lucide-react"

// Mock data for MVP
const initialProspects = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "VP of Sales",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    linkedinId: "sarah-johnson",
    tags: ["enterprise", "decision-maker"],
  },
  {
    id: "2",
    name: "Mike Chen",
    title: "CEO",
    company: "StartupXYZ",
    location: "New York, NY",
    linkedinId: "mike-chen",
    tags: ["startup", "founder"],
  },
  {
    id: "3",
    name: "Emily Davis",
    title: "Marketing Director",
    company: "BrandCo",
    location: "Austin, TX",
    linkedinId: "emily-davis",
    tags: ["marketing", "b2b"],
  },
  {
    id: "4",
    name: "Alex Wong",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    linkedinId: "alex-wong",
    tags: ["product", "tech"],
  },
  {
    id: "5",
    name: "Jessica Lee",
    title: "Head of Operations",
    company: "ScaleUp.io",
    location: "Boston, MA",
    linkedinId: "jessica-lee",
    tags: ["operations", "enterprise"],
  },
  {
    id: "6",
    name: "David Park",
    title: "Sales Director",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    linkedinId: "david-park",
    tags: ["sales", "enterprise"],
  },
]

export default function ProspectsPage() {
  const [prospects] = useState(initialProspects)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])

  const filteredProspects = prospects.filter((prospect) =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prospect.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prospect.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([])
    } else {
      setSelectedProspects(filteredProspects.map((p) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedProspects.includes(id)) {
      setSelectedProspects(selectedProspects.filter((p) => p !== id))
    } else {
      setSelectedProspects([...selectedProspects, id])
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">Manage your potential customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Prospect
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search prospects by name, company, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProspects.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedProspects.length} prospect(s) selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Follow Selected
            </Button>
            <Button size="sm" variant="outline">
              Send Message
            </Button>
            <Button size="sm" variant="outline">
              Add to List
            </Button>
          </div>
        </div>
      )}

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProspects.map((prospect) => (
          <Card key={prospect.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect.id)}
                    onChange={() => toggleSelect(prospect.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {prospect.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{prospect.name}</CardTitle>
                    <a
                      href={`https://linkedin.com/in/${prospect.linkedinId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Linkedin className="w-3 h-3" />
                      View Profile
                    </a>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{prospect.title} at {prospect.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{prospect.location}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-2">
                  {prospect.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prospects found matching your search.</p>
        </div>
      )}
    </div>
  )
}
