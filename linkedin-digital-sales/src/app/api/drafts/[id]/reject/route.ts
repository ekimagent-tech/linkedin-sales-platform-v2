import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/drafts/[id]/reject - Reject a draft
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Draft ID required' }, { status: 400 })
    }

    const draft = await prisma.messageDraft.findFirst({
      where: { id, userId: user.id }
    })

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const body = await request.json()
    const { rejectionReason } = body

    const updatedDraft = await prisma.messageDraft.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason || null
      }
    })

    return NextResponse.json(updatedDraft)
  } catch (error) {
    console.error('Error rejecting draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
