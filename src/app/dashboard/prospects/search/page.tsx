"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Loader2, 
  Linkedin, 
  MapPin, 
  Building, 
  UserPlus,
  CheckCircle,
  Plus,
  Sparkles,
  Filter,
  RefreshCw
} from "lucide-react"

interface SearchResult {
  id: string
  name: string
  title: string
  company: string
  location: string
  connectionDegree: "1st" | "2nd" | "3rd" | "3rd+"
  profileUrl: string
  imported: boolean
}

export default function SmartSearchPage() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [attributes, setAttributes] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [importedIds, setImportedIds] = useState<string[]>([])
  const [lastSearch, setLastSearch] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("prospectAttributes")
    if (stored) {
      setAttributes(JSON.parse(stored))
    }
  }, [])

  const mockSearchResults: SearchResult[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "VP of Sales",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      connectionDegree: "2nd",
      profileUrl: "https://linkedin.com/in/sarahjohnson",
      imported: false
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Chief Revenue Officer",
      company: "Enterprise Solutions Ltd",
      location: "New York, NY",
      connectionDegree: "1st",
      profileUrl: "https://linkedin.com/in/michaelchen",
      imported: false
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "Head of Business Development",
      company: "CloudScale Systems",
      location: "Austin, TX",
      connectionDegree: "2nd",
      profileUrl: "https://linkedin.com/in/emilyrodriguez",
      imported: false
    },
    {
      id: "4",
      name: "David Park",
      title: "Sales Director",
      company: "DataFlow Analytics",
      location: "Seattle, WA",
      connectionDegree: "3rd",
      profileUrl: "https://linkedin.com/in/davidpark",
      imported: false
    },
    {
      id: "5",
      name: "Jessica Williams",
      title: "Director of Enterprise Accounts",
      company: "InnovateTech",
      location: "Boston, MA",
      connectionDegree: "2nd",
      profileUrl: "https://linkedin.com/in/jessicawilliams",
      imported: false
    },
    {
      id: "6",
      name: "Robert Taylor",
      title: "VP of Sales Operations",
      company: "GrowthStack",
      location: "Chicago, IL",
      connectionDegree: "3rd+",
      profileUrl: "https://linkedin.com/in/roberttaylor",
      imported: false
    },
    {
      id: "7",
      name: "Amanda Foster",
      title: "Head of Sales",
      company: "ScaleUp Inc",
      location: "Denver, CO",
      connectionDegree: "1st",
      profileUrl: "https://linkedin.com/in/amandafoster",
      imported: false
    },
    {
      id: "8",
      name: "James Wilson",
      title: "Chief Commercial Officer",
      company: "Enterprise Cloud Co",
      location: "London, UK",
      connectionDegree: "2nd",
      profileUrl: "https://linkedin.com/in/jameswilson",
      imported: false
    }
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchResults([])
    
    // Simulate API call to LinkedIn search
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, this would call the LinkedIn API with the saved attributes
    setSearchResults(mockSearchResults)
    setLastSearch(searchQuery || "All attributes")
    setIsSearching(false)
  }

  const handleImport = (result: SearchResult) => {
    // Add to imported list
    setImportedIds([...importedIds, result.id])
    
    // Mark as imported in results
    setSearchResults(prev => prev.map(r => 
      r.id === result.id ? { ...r, imported: true } : r
    ))
    
    // Get existing prospects
    const existingProspects = JSON.parse(localStorage.getItem("prospects") || "[]")
    
    // Add new prospect
    const newProspect = {
      id: `prospect-${Date.now()}`,
      userId: "user1",
      linkedinId: result.profileUrl.split("/").pop(),
      name: result.name,
      title: result.title,
      company: result.company,
      location: result.location,
      tags: "imported,search",
    }
    
    localStorage.setItem("prospects", JSON.stringify([...existingProspects, newProspect]))
  }

  const handleImportAll = () => {
    const unimported = searchResults.filter(r => !importedIds.includes(r.id))
    
    setImportedIds([...importedIds, ...unimported.map(r => r.id)])
    
    const existingProspects = JSON.parse(localStorage.getItem("prospects") || "[]")
    
    const newProspects = unimported.map(result => ({
      id: `prospect-${Date.now()}-${result.id}`,
      userId: "user1",
      linkedinId: result.profileUrl.split("/").pop(),
      name: result.name,
      title: result.title,
      company: result.company,
      location: result.location,
      tags: "imported,search",
    }))
    
    localStorage.setItem("prospects", JSON.stringify([...existingProspects, ...newProspects]))
  }

  const getDegreeColor = (degree: string) => {
    switch (degree) {
      case "1st": return "bg-green-100 text-green-800"
      case "2nd": return "bg-blue-100 text-blue-800"
      case "3rd": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Search</h1>
          <p className="text-gray-500 mt-1">
            Search LinkedIn using your saved prospect attributes
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.push("/dashboard/prospects/attributes")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          View Attributes
        </Button>
      </div>

      {/* Search Interface */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by keyword or use saved attributes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {/* Active Filters */}
          {attributes && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Using attributes:</span>
              {attributes.industries?.slice(0, 3).map((ind: string, i: number) => (
                <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {ind}
                </span>
              ))}
              {attributes.jobTitles?.slice(0, 3).map((title: string, i: number) => (
                <span key={i} className="text-xs px-2 py-1 bg-blue-100 rounded-full">
                  {title}
                </span>
              ))}
              {attributes.locations?.slice(0, 3).map((loc: string, i: number) => (
                <span key={i} className="text-xs px-2 py-1 bg-orange-100 rounded-full">
                  {loc}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">Searching LinkedIn...</p>
          <p className="text-sm text-gray-400 mt-1">This may take a few seconds</p>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Found {searchResults.length} results for "{lastSearch}"
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSearch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                size="sm" 
                onClick={handleImportAll}
                disabled={importedIds.length === searchResults.length}
              >
                <Plus className="w-4 h-4 mr-2" />
                Import All ({searchResults.length - importedIds.length})
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className={result.imported ? "bg-gray-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {result.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{result.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDegreeColor(result.connectionDegree)}`}>
                            {result.connectionDegree}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{result.title}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {result.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {result.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={result.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                      >
                        <Linkedin className="w-4 h-4" />
                        View
                      </a>
                      {result.imported ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Imported
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleImport(result)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Import
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {!isSearching && searchResults.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No search results yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Enter a search query or use your saved attributes
          </p>
        </div>
      )}
    </div>
  )
}
