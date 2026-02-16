import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/meetings - List all meetings
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

    const meetings = await prisma.meeting.findMany({
      where: { 
        userId: user.id,
        ...(status && { status })
      },
      include: {
        prospect: true,
        template: true
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/meetings - Create a new meeting
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
      prospectId, 
      templateId, 
      title, 
      description, 
      startTime, 
      endTime, 
      timezone 
    } = body

    // Get template duration if templateId is provided
    let duration = 30 // default 30 minutes
    if (templateId) {
      const template = await prisma.meetingTemplate.findUnique({
        where: { id: templateId }
      })
      if (template) {
        duration = template.duration
      }
    }

    const meeting = await prisma.meeting.create({
      data: {
        userId: user.id,
        prospectId: prospectId || null,
        templateId: templateId || null,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone: timezone || 'UTC',
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
