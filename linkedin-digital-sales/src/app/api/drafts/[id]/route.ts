import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET/PUT/DELETE /api/drafts/[id]
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
    const draft = await prisma.messageDraft.findFirst({
      where: { id, userId: user.id },
      include: {
        prospect: true,
        account: true
      }
    })

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Error fetching draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const existingDraft = await prisma.messageDraft.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingDraft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    const body = await request.json()
    const { content, actionType, status } = body

    const draft = await prisma.messageDraft.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(actionType && { actionType }),
        ...(status && { status })
      }
    })

    return NextResponse.json(draft)
  } catch (error) {
    console.error('Error updating draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const existingDraft = await prisma.messageDraft.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingDraft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    await prisma.messageDraft.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
