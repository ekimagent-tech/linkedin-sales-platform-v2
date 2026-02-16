"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Filter, Plus, MoreHorizontal, Linkedin, MapPin, Building, Upload, Loader2, CheckCircle, AlertCircle, Sparkles, Target, Users, MessageSquare, ThumbsUp, UserPlus, Send, Play, Clock, X, ChevronRight, Briefcase } from "lucide-react"
import { Prospect, SearchedProspect, ProspectAction, ProspectProfileAttributes } from "@/types"

// Mock locations
const availableLocations = [
  "San Francisco, CA", "New York, NY", "Los Angeles, CA", "Seattle, WA",
  "Austin, TX", "Boston, MA", "Chicago, IL", "Denver, CO"
]

// Mock search results
const mockSearchResults: SearchedProspect[] = [
  { linkedinId: "john-smith-1", name: "John Smith", title: "VP of Engineering", company: "TechGiant", location: "San Francisco, CA", connectionDegree: "2nd", profileUrl: "https://linkedin.com/in/john-smith-1" },
  { linkedinId: "anna-kumar-2", name: "Anna Kumar", title: "CTO", company: "InnovateAI", location: "New York, NY", connectionDegree: "1st", profileUrl: "https://linkedin.com/in/anna-kumar-2" },
  { linkedinId: "robert-jones-3", name: "Robert Jones", title: "Director of Product", company: "BigCorp", location: "Seattle, WA", connectionDegree: "3rd", profileUrl: "https://linkedin.com/in/robert-jones-3" },
  { linkedinId: "lisa-chen-4", name: "Lisa Chen", title: "Head of Sales", company: "SalesForce Pro", location: "Boston, MA", connectionDegree: "2nd", profileUrl: "https://linkedin.com/in/lisa-chen-4" },
  { linkedinId: "marcus-wilson-5", name: "Marcus Wilson", title: "CEO", company: "StartupLab", location: "Austin, TX", connectionDegree: "1st", profileUrl: "https://linkedin.com/in/marcus-wilson-5" },
]

type ViewMode = 'list' | 'setup' | 'attributes' | 'search' | 'actions' | 'queue'

// Mock data for MVP
const initialProspects: Prospect[] = [
  {
    id: "1",
    userId: "user1",
    linkedinId: "sarah-johnson",
    name: "Sarah Johnson",
    title: "VP of Sales",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    tags: "enterprise,decision-maker",
  },
  {
    id: "2",
    userId: "user1",
    linkedinId: "mike-chen",
    name: "Mike Chen",
    title: "CEO",
    company: "StartupXYZ",
    location: "New York, NY",
    tags: "startup,founder",
  },
  {
    id: "3",
    userId: "user1",
    linkedinId: "emily-davis",
    name: "Emily Davis",
    title: "Marketing Director",
    company: "BrandCo",
    location: "Austin, TX",
    tags: "marketing,b2b",
  },
  {
    id: "4",
    userId: "user1",
    linkedinId: "alex-wong",
    name: "Alex Wong",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    tags: "product,tech",
  },
  {
    id: "5",
    userId: "user1",
    linkedinId: "jessica-lee",
    name: "Jessica Lee",
    title: "Head of Operations",
    company: "ScaleUp.io",
    location: "Boston, MA",
    tags: "operations,enterprise",
  },
  {
    id: "6",
    userId: "user1",
    linkedinId: "david-park",
    name: "David Park",
    title: "Sales Director",
    company: "Enterprise Solutions",
    location: "Chicago, IL",
    tags: "sales,enterprise",
  },
]

export default function ProspectsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [prospects, setProspects] = useState(initialProspects)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  // Product/Service Setup states
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [targetLocations, setTargetLocations] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // AI Generated Attributes
  const [generatedAttributes, setGeneratedAttributes] = useState<ProspectProfileAttributes | null>(null)
  const [editedAttributes, setEditedAttributes] = useState<ProspectProfileAttributes | null>(null)
  
  // Smart Search states
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchedProspect[]>([])
  const [selectedSearchResults, setSelectedSearchResults] = useState<string[]>([])
  
  // Action Recommendations
  const [prospectActions, setProspectActions] = useState<ProspectAction[]>([])
  
  // Automation Queue
  const [actionQueue, setActionQueue] = useState<ProspectAction[]>([])
  const [executionLogs, setExecutionLogs] = useState<{ id: string; actionType: string; prospectName: string; status: string; executedAt: string }[]>([])

  // CSV Import states
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  // Toggle location selection
  const toggleLocation = (location: string) => {
    setTargetLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  // AI Analysis
  const handleAnalyzeWithAI = async () => {
    if (!productName || !productDescription || targetLocations.length === 0) return
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const attributes: ProspectProfileAttributes = {
      industries: ["Technology", "SaaS", "Enterprise Software", "Fintech"],
      jobTitles: ["VP of Sales", "CEO", "CTO", "Director of Engineering", "Product Manager"],
      companySizes: ["50-200", "200-500", "500-1000", "1000+"],
      locations: targetLocations,
      seniorities: ["C-Level", "VP", "Director", "Senior Manager"]
    }
    
    setGeneratedAttributes(attributes)
    setEditedAttributes(attributes)
    setIsAnalyzing(false)
    setViewMode('attributes')
  }

  // Confirm attributes
  const handleConfirmAttributes = () => {
    if (editedAttributes) setGeneratedAttributes(editedAttributes)
    setViewMode('search')
  }

  // Smart Search
  const handleSearchProspects = async () => {
    setIsSearching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSearchResults(mockSearchResults)
    setIsSearching(false)
  }

  // Import selected
  const handleImportSelected = () => {
    const newProspects: Prospect[] = selectedSearchResults.map((id) => {
      const result = searchResults.find(r => r.linkedinId === id)!
      return {
        id: `imported-${Date.now()}-${id}`,
        userId: "user1",
        linkedinId: result.linkedinId,
        name: result.name,
        title: result.title,
        company: result.company,
        location: result.location,
        connectionDegree: result.connectionDegree,
        tags: "smart-search,imported"
      }
    })
    
    setProspects([...prospects, ...newProspects])
    setSelectedSearchResults([])
    setSearchResults([])
    generateActionRecommendations(newProspects)
    setViewMode('actions')
  }

  // Generate recommendations
  const generateActionRecommendations = (importedProspects: Prospect[]) => {
    const actions: ProspectAction[] = importedProspects.map(prospect => {
      const types: ProspectAction['actionType'][] = ['follow', 'like', 'connect', 'message']
      const type = types[Math.floor(Math.random() * types.length)]
      return {
        id: `action-${Date.now()}-${prospect.id}`,
        prospectId: prospect.id,
        prospectName: prospect.name,
        actionType: type,
        targetUrl: `https://linkedin.com/in/${prospect.linkedinId}`,
        messageDraft: type === 'message' ? `Hi ${prospect.name.split(' ')[0]}, I came across your profile and was impressed by your work at ${prospect.company}.` : undefined,
        recommendation: `AI recommends ${type} based on prospect's recent activity.`,
        status: 'pending' as const,
        createdAt: new Date()
      }
    })
    setProspectActions(actions)
  }

  // Add to queue
  const handleAddToQueue = () => {
    setActionQueue(prospectActions.map(a => ({ ...a, status: 'pending' as const })))
    setViewMode('queue')
  }

  // Confirm action
  const handleConfirmAction = (actionId: string) => {
    setActionQueue(prev => prev.map(a => a.id === actionId ? { ...a, status: 'confirmed' as const } : a))
  }

  // Execute action
  const handleExecuteAction = async (actionId: string) => {
    const action = actionQueue.find(a => a.id === actionId)
    if (!action) return
    await new Promise(resolve => setTimeout(resolve, 1000))
    setExecutionLogs(prev => [{
      id: `log-${Date.now()}`,
      actionType: action.actionType,
      prospectName: action.prospectName,
      status: 'success',
      executedAt: new Date().toLocaleString()
    }, ...prev])
    setActionQueue(prev => prev.map(a => a.id === actionId ? { ...a, status: 'executed' as const } : a))
  }

  // Execute all
  const handleExecuteAll = async () => {
    const confirmed = actionQueue.filter(a => a.status === 'confirmed')
    for (const action of confirmed) {
      await handleExecuteAction(action.id)
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'like': return ThumbsUp
      case 'follow': return Users
      case 'connect': return UserPlus
      case 'message': return MessageSquare
      default: return Target
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-orange-500 bg-orange-50'
      case 'follow': return 'text-purple-500 bg-purple-50'
      case 'connect': return 'text-blue-500 bg-blue-50'
      case 'message': return 'text-green-500 bg-green-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const filteredProspects = prospects.filter((prospect) =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prospect.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prospect.title?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleProspectClick = (id: string) => {
    router.push(`/dashboard/prospects/${id}`)
  }

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportProgress(0)
    setImportResult(null)
    setImportError(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        throw new Error("CSV file is empty or has no data rows")
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      // Expected columns: name, title, company, location, linkedinId, email
      const nameIndex = headers.findIndex(h => h.includes('name'))
      const titleIndex = headers.findIndex(h => h.includes('title') || h.includes('job'))
      const companyIndex = headers.findIndex(h => h.includes('company') || h.includes('org'))
      const locationIndex = headers.findIndex(h => h.includes('location') || h.includes('city'))
      const linkedinIndex = headers.findIndex(h => h.includes('linkedin') || h.includes('url'))
      const emailIndex = headers.findIndex(h => h.includes('email'))

      if (nameIndex === -1) {
        throw new Error("CSV must have a 'name' column")
      }

      let successCount = 0
      let failedCount = 0
      const newProspects: Prospect[] = []

      // Process each row
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
        
        if (columns[nameIndex] && columns[nameIndex].length > 0) {
          const prospect: Prospect = {
            id: `imported-${Date.now()}-${i}`,
            userId: "user1",
            linkedinId: linkedinIndex !== -1 ? columns[linkedinIndex].split('/').pop() || '' : `imported-${i}`,
            name: columns[nameIndex],
            title: titleIndex !== -1 ? columns[titleIndex] : undefined,
            company: companyIndex !== -1 ? columns[companyIndex] : undefined,
            location: locationIndex !== -1 ? columns[locationIndex] : undefined,
            email: emailIndex !== -1 ? columns[emailIndex] : undefined,
            tags: "imported",
          }
          newProspects.push(prospect)
          successCount++
        } else {
          failedCount++
        }

        // Update progress
        setImportProgress(Math.round((i / (lines.length - 1)) * 100))
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      setProspects([...prospects, ...newProspects])
      setImportResult({ success: successCount, failed: failedCount })
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Failed to import CSV")
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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
          <Button variant="outline" onClick={() => setViewMode('setup')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Smart Search
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleCSVImport}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Import CSV
          </Button>
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

      {/* Import Progress/Result */}
      {isImporting && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Importing prospects...</span>
            <span className="text-sm text-gray-500">{importProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
        </div>
      )}

      {importResult && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Import completed successfully!
            </p>
            <p className="text-sm text-green-600">
              {importResult.success} prospects imported, {importResult.failed} failed
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto"
            onClick={() => setImportResult(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {importError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">Import failed</p>
            <p className="text-sm text-red-600">{importError}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto"
            onClick={() => setImportError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* CSV Import Help */}
      {!isImporting && !importResult && !importError && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-1">CSV Import Format</p>
          <p>Expected columns: name, title, company, location, linkedin_url (optional), email (optional)</p>
          <p className="text-xs text-gray-400 mt-1">Example: John Doe,CEO,Acme Corp,New York,linkedin.com/in/johndoe,john@acme.com</p>
        </div>
      )}

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
          <Card 
            key={prospect.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProspectClick(prospect.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      toggleSelect(prospect.id)
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div 
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-3 h-3" />
                      View Profile
                    </a>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
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
                  {(prospect.tags || '').split(',').map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag.trim()}
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
