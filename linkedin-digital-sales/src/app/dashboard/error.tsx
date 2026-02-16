"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto mt-20">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-red-600 mb-4">
          {error.message || "Failed to load dashboard data"}
        </p>
        {error.digest && (
          <p className="text-xs text-red-400 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-2 justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <Button onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
