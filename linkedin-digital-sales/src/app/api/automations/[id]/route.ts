import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/automations/[id] - Get a single automation rule
export async function GET(
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
    const rule = await prisma.automationRule.findFirst({
      where: { id, userId: user.id },
      include: {
        account: true
      }
    })

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error fetching automation rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/automations/[id] - Update an automation rule
export async function PUT(
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

    const body = await request.json()
    const {
      name,
      type,
      isActive,
      accountId,
      targetKeywords,
      targetCompanies,
      targetTitles,
      actionType,
      messageTemplate,
      dailyLimit,
      totalLimit
    } = body

    const rule = await prisma.automationRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        ...(accountId !== undefined && { accountId: accountId || null }),
        ...(targetKeywords && { targetKeywords: JSON.stringify(targetKeywords) }),
        ...(targetCompanies && { targetCompanies: JSON.stringify(targetCompanies) }),
        ...(targetTitles && { targetTitles: JSON.stringify(targetTitles) }),
        ...(actionType && { actionType }),
        ...(messageTemplate !== undefined && { messageTemplate }),
        ...(dailyLimit && { dailyLimit }),
        ...(totalLimit !== undefined && { totalLimit })
      }
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error updating automation rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/automations/[id] - Delete an automation rule
export async function DELETE(
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

    await prisma.automationRule.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting automation rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
