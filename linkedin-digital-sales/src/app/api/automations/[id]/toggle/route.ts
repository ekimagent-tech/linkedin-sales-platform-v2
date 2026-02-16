import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/automations/[id]/toggle - Toggle automation rule on/off
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    const existingRule = await prisma.automationRule.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    const newActiveState = !existingRule.isActive
    
    const rule = await prisma.automationRule.update({
      where: { id },
      data: {
        isActive: newActiveState,
        status: newActiveState ? 'ACTIVE' : 'PAUSED'
      }
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error toggling automation rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
