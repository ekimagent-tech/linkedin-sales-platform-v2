"use client"

import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  )
}
