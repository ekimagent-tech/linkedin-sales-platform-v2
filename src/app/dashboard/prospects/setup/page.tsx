"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Sparkles, 
  MapPin, 
  Loader2, 
  ArrowRight, 
  CheckCircle, 
  Package, 
  FileText, 
  Globe 
} from "lucide-react"

interface ProductSetup {
  name: string
  description: string
  locations: string[]
}

export default function ProductSetupPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [locations, setLocations] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const handleAnalyze = async () => {
    if (!productName || !description) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Save to localStorage for persistence (mock database)
    const setupData: ProductSetup = {
      name: productName,
      description: description,
      locations: locations.split(",").map(l => l.trim()).filter(l => l),
    }
    localStorage.setItem("productSetup", JSON.stringify(setupData))
    
    setIsAnalyzing(false)
    setIsComplete(true)
    
    // Redirect to attributes page
    setTimeout(() => {
      router.push("/dashboard/prospects/attributes")
    }, 1500)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product/Service Setup</h1>
        <p className="text-gray-500 mt-1">
          Define your product or service to generate prospect attributes
        </p>
      </div>

      {isComplete && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Analysis Complete!</p>
                <p className="text-sm text-green-600">Redirecting to prospect attributes...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Product Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product or Service Name
            </CardTitle>
            <CardDescription>
              What are you selling or promoting?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., Enterprise CRM Software, Marketing Consultancy"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="text-lg"
            />
          </CardContent>
        </Card>

        {/* Product Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Description
            </CardTitle>
            <CardDescription>
              Describe your product/service, key features, and target value proposition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Our CRM helps B2B companies streamline sales workflows, automate follow-ups, and close more deals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="text-base"
            />
          </CardContent>
        </Card>

        {/* Target Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Target Locations (Optional)
            </CardTitle>
            <CardDescription>
              Where are your ideal customers located? Separate multiple locations with commas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g., United States, United Kingdom, Germany, San Francisco, New York"
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              Leave empty to target all locations
            </p>
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            onClick={handleAnalyze}
            disabled={!productName || !description || isAnalyzing}
            className="min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze with AI
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        {productName && description && (
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Product:</span> {productName}</p>
                <p><span className="font-medium">Description:</span> {description}</p>
                {locations && (
                  <p><span className="font-medium">Locations:</span> {locations}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
