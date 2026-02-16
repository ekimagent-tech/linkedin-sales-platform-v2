import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/drafts/[id]/approve - Approve a draft
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
    const draft = await prisma.messageDraft.findFirst({
      where: { id, userId: user.id }
    })

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const updatedDraft = await prisma.messageDraft.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: user.email,
        approvedAt: new Date()
      }
    })

    return NextResponse.json(updatedDraft)
  } catch (error) {
    console.error('Error approving draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
