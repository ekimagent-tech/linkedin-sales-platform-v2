"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, Sparkles, User, Briefcase, Building } from "lucide-react"

interface ProspectAttribute {
  id: string
  category: "demographic" | "firmographic" | "behavioral"
  label: string
  selected: boolean
}

const aiSuggestedAttributes: ProspectAttribute[] = [
  { id: "1", category: "demographic", label: "Job Title: C-Level (CEO, CTO, CFO)", selected: true },
  { id: "2", category: "demographic", label: "Job Title: VP/Director Level", selected: true },
  { id: "3", category: "demographic", label: "Industry: Technology/SaaS", selected: true },
  { id: "4", category: "demographic", label: "Industry: Finance/Banking", selected: false },
  { id: "5", category: "firmographic", label: "Company Size: 50-500 employees", selected: true },
  { id: "6", category: "firmographic", label: "Company Size: 500-2000 employees", selected: false },
  { id: "7", category: "firmographic", label: "Funding Stage: Series A+", selected: true },
  { id: "8", category: "firmographic", label: "Location: United States", selected: true },
  { id: "9", category: "firmographic", label: "Location: Europe", selected: false },
  { id: "10", category: "behavioral", label: "Recently changed jobs (30 days)", selected: true },
  { id: "11", category: "behavioral", label: "Active on LinkedIn (weekly)", selected: false },
  { id: "12", category: "behavioral", label: "Has published content", selected: false },
]

export default function ProspectsAttributesPage() {
  const router = useRouter()
  const [attributes, setAttributes] = useState<ProspectAttribute[]>(aiSuggestedAttributes)
  const [productInfo, setProductInfo] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("productInfo")
    if (!stored) {
      router.push("/prospects/setup")
      return
    }
    setProductInfo(stored)
  }, [router])

  const toggleAttribute = (id: string) => {
    setAttributes(attributes.map(attr => 
      attr.id === id ? { ...attr, selected: !attr.selected } : attr
    ))
  }

  const handleConfirm = () => {
    const selectedAttributes = attributes.filter(a => a.selected)
    sessionStorage.setItem("prospectAttributes", JSON.stringify(selectedAttributes))
    toast.success(`Selected ${selectedAttributes.length} attributes`)
    router.push("/prospects/search")
  }

  const selectedCount = attributes.filter(a => a.selected).length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI-Generated Attributes</h1>
        <p className="text-muted-foreground mt-2">Based on your product analysis, we've suggested key prospect attributes</p>
      </div>

      {productInfo && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">AI Analysis Complete</h3>
                <p className="text-sm text-muted-foreground">
                  We've analyzed your product and identified the most effective targeting criteria for your ideal prospects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Target Attributes</span>
            <span className="text-sm font-normal text-muted-foreground">
              {selectedCount} selected
            </span>
          </CardTitle>
          <CardDescription>
            Select the attributes that match your ideal customer profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {["demographic", "firmographic", "behavioral"].map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                {category === "demographic" && <User className="w-4 h-4" />}
                {category === "firmographic" && <Building className="w-4 h-4" />}
                {category === "behavioral" && <Briefcase className="w-4 h-4" />}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="space-y-2">
                {attributes
                  .filter((attr) => attr.category === category)
                  .map((attr) => (
                    <div key={attr.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={attr.id}
                        checked={attr.selected}
                        onCheckedChange={() => toggleAttribute(attr.id)}
                      />
                      <Label htmlFor={attr.id} className="text-sm cursor-pointer">
                        {attr.label}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleConfirm} size="lg">
          Confirm & Continue to Search
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
