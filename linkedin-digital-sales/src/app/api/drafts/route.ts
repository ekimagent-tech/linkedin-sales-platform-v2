import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/drafts - List all message drafts
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const drafts = await prisma.messageDraft.findMany({
      where: { 
        userId: user.id,
        ...(status && { status })
      },
      include: {
        prospect: true,
        account: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(drafts)
  } catch (error) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/drafts - Create a new draft
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
    const { prospectId, accountId, content, actionType, status } = body

    const draft = await prisma.messageDraft.create({
      data: {
        userId: user.id,
        prospectId: prospectId || null,
        accountId: accountId || null,
        content,
        actionType,
        status: status || 'DRAFT'
      }
    })

    return NextResponse.json(draft, { status: 201 })
  } catch (error) {
    console.error('Error creating draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
