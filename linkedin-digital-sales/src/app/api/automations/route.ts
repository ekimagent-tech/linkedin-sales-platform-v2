import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/automations - List all automation rules
export async function GET(request: NextRequest) {
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

    const rules = await prisma.automationRule.findMany({
      where: { userId: user.id },
      include: {
        account: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Parse JSON fields
    const parsedRules = rules.map(rule => ({
      ...rule,
      targetKeywords: rule.targetKeywords ? JSON.parse(rule.targetKeywords) : [],
      targetCompanies: rule.targetCompanies ? JSON.parse(rule.targetCompanies) : [],
      targetTitles: rule.targetTitles ? JSON.parse(rule.targetTitles) : [],
      excludeKeywords: rule.excludeKeywords ? JSON.parse(rule.excludeKeywords) : [],
      delayMin: rule.delayMin || 30,
      delayMax: rule.delayMax || 120,
      triggerTime: rule.triggerTime || '09:00-12:00, 14:00-18:00',
      status: rule.status || 'DRAFT'
    }))

    return NextResponse.json(parsedRules)
  } catch (error) {
    console.error('Error fetching automation rules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/automations - Create a new automation rule
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      name,
      type,
      status,
      isActive,
      accountId,
      targetKeywords,
      targetCompanies,
      targetTitles,
      excludeKeywords,
      actionType,
      messageTemplate,
      aiPrompt,
      triggerTime,
      dayOfWeek,
      dailyLimit,
      totalLimit,
      delayMin,
      delayMax
    } = body

    const rule = await prisma.automationRule.create({
      data: {
        userId: user.id,
        name,
        type,
        status: status || 'DRAFT',
        isActive: isActive ?? true,
        accountId: accountId || null,
        targetKeywords: targetKeywords ? JSON.stringify(targetKeywords) : null,
        targetCompanies: targetCompanies ? JSON.stringify(targetCompanies) : null,
        targetTitles: targetTitles ? JSON.stringify(targetTitles) : null,
        excludeKeywords: excludeKeywords ? JSON.stringify(excludeKeywords) : null,
        actionType,
        messageTemplate,
        aiPrompt,
        triggerTime,
        dayOfWeek,
        dailyLimit: dailyLimit ?? 20,
        totalLimit,
        delayMin: delayMin ?? 30,
        delayMax: delayMax ?? 120
      }
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Error creating automation rule:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
