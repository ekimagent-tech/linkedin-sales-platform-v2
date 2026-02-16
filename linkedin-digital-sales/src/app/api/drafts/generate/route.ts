import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// Mock AI draft generation - in production, this would call OpenAI/Claude
function generateMockDraft(prospectName: string, actionType: string): string {
  const templates = {
    MESSAGE: `Hi ${prospectName},

I came across your profile and was impressed by your work in the industry. I'd love to connect and learn more about your experience.

Would you be open to a brief conversation?

Best regards`,
    CONNECT: `Hi ${prospectName},

I noticed we're in the same industry and I'd love to connect. I'm always looking to learn from professionals like yourself.

Let's connect!

Best regards`,
    FOLLOW: `Hi ${prospectName},

Just wanted to follow up on your recent post. Great insights!

Best regards`
  }
  return templates[actionType as keyof typeof templates] || templates.MESSAGE
}

// POST /api/drafts/generate - AI generate a draft
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
    const { prospectId, accountId, actionType } = body

    // Get prospect info if provided
    let prospectName = 'there'
    if (prospectId) {
      const prospect = await prisma.prospect.findUnique({
        where: { id: prospectId }
      })
      if (prospect) {
        prospectName = prospect.name.split(' ')[0]
      }
    }

    // Generate mock AI content
    const content = generateMockDraft(prospectName, actionType || 'MESSAGE')

    // Create draft
    const draft = await prisma.messageDraft.create({
      data: {
        userId: user.id,
        prospectId: prospectId || null,
        accountId: accountId || null,
        content,
        actionType: actionType || 'MESSAGE',
        status: 'PENDING_APPROVAL'
      }
    })

    return NextResponse.json(draft, { status: 201 })
  } catch (error) {
    console.error('Error generating draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
