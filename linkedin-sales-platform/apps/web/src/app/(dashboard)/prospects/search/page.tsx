"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Search, Download, UserPlus, Filter, MapPin, Briefcase, Building } from "lucide-react"

interface Prospect {
  id: string
  name: string
  title: string
  company: string
  location: string
  profileUrl: string
  selected: boolean
}

const mockProspects: Prospect[] = [
  { id: "1", name: "Sarah Chen", title: "VP of Engineering", company: "TechCorp Inc", location: "San Francisco, CA", profileUrl: "#", selected: false },
  { id: "2", name: "Michael Rodriguez", title: "CTO", company: "StartupXYZ", location: "Austin, TX", profileUrl: "#", selected: false },
  { id: "3", name: "Emily Watson", title: "Director of Product", company: "InnovateTech", location: "New York, NY", profileUrl: "#", selected: false },
  { id: "4", name: "David Kim", title: "Head of Sales", company: "GrowthLabs", location: "Seattle, WA", profileUrl: "#", selected: false },
  { id: "5", name: "Jessica Brown", title: "CFO", company: "FinanceFirst", location: "Chicago, IL", profileUrl: "#", selected: false },
  { id: "6", name: "Alex Thompson", title: "CEO", company: "NewVentures", location: "Boston, MA", profileUrl: "#", selected: false },
]

export default function ProspectsSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem("prospectAttributes")
    if (!stored) {
      router.push("/prospects/setup")
      return
    }
    const attrs = JSON.parse(stored)
    setSelectedAttributes(attrs.map((a: { id: string }) => a.id))
  }, [router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
    toast.success(`Found ${prospects.length} prospects matching your criteria`)
  }

  const toggleProspect = (id: string) => {
    setProspects(prospects.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ))
  }

  const handleImport = () => {
    const selected = prospects.filter(p => p.selected)
    if (selected.length === 0) {
      toast.error("Please select at least one prospect")
      return
    }
    toast.success(`Imported ${selected.length} prospects`)
    router.push("/automation")
  }

  const selectedCount = prospects.filter(p => p.selected).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search Prospects</h1>
        <p className="text-muted-foreground mt-2">Find and import prospects matching your target criteria</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, title, company..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAttributes.slice(0, 5).map((attrId) => (
                <span key={attrId} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Attribute {attrId}
                </span>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{prospects.length} Results</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProspects(prospects.map(p => ({ ...p, selected: true })))}>
            Select All
          </Button>
          <Button onClick={handleImport} disabled={selectedCount === 0}>
            <UserPlus className="w-4 h-4 mr-2" />
            Import ({selectedCount})
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {prospects.map((prospect) => (
          <Card key={prospect.id} className={prospect.selected ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  id={prospect.id}
                  checked={prospect.selected}
                  onCheckedChange={() => toggleProspect(prospect.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{prospect.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {prospect.title}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {prospect.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {prospect.location}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
