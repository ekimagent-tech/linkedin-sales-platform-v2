"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Sparkles, ArrowRight } from "lucide-react"

interface ProductInfo {
  name: string
  description: string
  targetAudience: string
  keyBenefits: string
}

export default function ProspectsSetupPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: "",
    description: "",
    targetAudience: "",
    keyBenefits: "",
  })

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    sessionStorage.setItem("productInfo", JSON.stringify(productInfo))
    
    setIsAnalyzing(false)
    toast.success("Analysis complete!")
    router.push("/prospects/attributes")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Prospect Setup</h1>
        <p className="text-muted-foreground mt-2">Define your product to identify ideal prospects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter details about your product or service. Our AI will analyze this to find the best prospects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g., Enterprise SaaS Platform"
                value={productInfo.name}
                onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what your product does..."
                value={productInfo.description}
                onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., CTOs at B2B SaaS companies"
                value={productInfo.targetAudience}
                onChange={(e) => setProductInfo({ ...productInfo, targetAudience: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyBenefits">Key Benefits</Label>
              <Textarea
                id="keyBenefits"
                placeholder="List the main benefits of your product..."
                value={productInfo.keyBenefits}
                onChange={(e) => setProductInfo({ ...productInfo, keyBenefits: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze & Find Attributes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
