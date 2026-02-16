import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/activity - List activities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get('prospectId');
    const accountId = searchParams.get('accountId');
    const type = searchParams.get('type');
    
    const where: any = {};
    
    if (prospectId) where.prospectId = prospectId;
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;
    
    const activities = await prisma.prospectActivity.findMany({
      where,
      include: {
        prospect: true,
        account: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST /api/activity - Create new activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prospectId, accountId, type, status, content, scheduledAt } = body;
    
    const activity = await prisma.prospectActivity.create({
      data: {
        prospectId,
        accountId,
        type,
        status: status || 'pending',
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });
    
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
