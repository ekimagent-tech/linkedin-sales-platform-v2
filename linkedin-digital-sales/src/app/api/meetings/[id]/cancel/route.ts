import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/meetings/[id]/cancel - Cancel a meeting
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
    const meeting = await prisma.meeting.findFirst({
      where: { id, userId: user.id }
    })

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json(updatedMeeting)
  } catch (error) {
    console.error('Error cancelling meeting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
