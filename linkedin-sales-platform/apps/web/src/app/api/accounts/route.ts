import { NextResponse } from "next/server"

// Mock data store (replace with database in production)
const accounts = [
  {
    id: "1",
    name: "Demo Account",
    status: "active",
    riskLevel: 25,
    dailyLimit: 50,
    usedToday: 12,
    lastSync: new Date().toISOString(),
  }
]

export async function GET() {
  return NextResponse.json(accounts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, cookie } = body
  
  // Validate input
  if (!name || !cookie) {
    return NextResponse.json(
      { error: "Name and cookie are required" },
      { status: 400 }
    )
  }
  
  // Create new account (mock)
  const newAccount = {
    id: Date.now().toString(),
    name,
    status: "active",
    riskLevel: Math.floor(Math.random() * 30),
    dailyLimit: 50,
    usedToday: 0,
    lastSync: new Date().toISOString(),
  }
  
  accounts.push(newAccount)
  
  return NextResponse.json(newAccount, { status: 201 })
}
