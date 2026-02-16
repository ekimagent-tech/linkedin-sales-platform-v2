import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET/PUT/DELETE /api/meetings/[id]
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
    const meeting = await prisma.meeting.findFirst({
      where: { id, userId: user.id },
      include: {
        prospect: true,
        template: true
      }
    })

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error fetching meeting:', error)
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
    const existingMeeting = await prisma.meeting.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, timezone, status } = body

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(timezone && { timezone }),
        ...(status && { status })
      }
    })

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error updating meeting:', error)
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
    const existingMeeting = await prisma.meeting.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    await prisma.meeting.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting meeting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
