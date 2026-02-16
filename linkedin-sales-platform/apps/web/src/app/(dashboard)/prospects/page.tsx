"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Prospect {
  id: string
  name: string
  title: string
  company: string
  location: string
  profileUrl: string
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const mockProspects: Prospect[] = [
    { id: "1", name: "John Smith", title: "CEO", company: "Tech Corp", location: "San Francisco", profileUrl: "#" },
    { id: "2", name: "Sarah Johnson", title: "VP Sales", company: "Growth Inc", location: "New York", profileUrl: "#" },
    { id: "3", name: "Mike Chen", title: "Founder", company: "StartupXYZ", location: "Austin", profileUrl: "#" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setProspects(mockProspects)
    toast.success("Found 3 prospects")
  }

  const handleImportCSV = () => {
    toast.info("CSV import coming soon")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prospects</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleImportCSV}>
            Import CSV
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Prospect"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by name, title, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {prospects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prospects.map((prospect) => (
            <Card key={prospect.id}>
              <CardHeader>
                <CardTitle>{prospect.name}</CardTitle>
                <CardDescription>{prospect.title} at {prospect.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{prospect.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Search for prospects or add them manually</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
