import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/prospects - List all prospects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { title: { contains: search } }
      ];
    }
    
    if (tag) {
      where.tags = { contains: tag };
    }
    
    const prospects = await prisma.prospect.findMany({
      where,
      include: {
        _count: {
          select: { activities: true }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(prospects);
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json({ error: 'Failed to fetch prospects' }, { status: 500 });
  }
}

// POST /api/prospects - Create new prospect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { linkedinId, name, title, company, location, profileUrl, notes, tags, userId } = body;
    
    const prospect = await prisma.prospect.create({
      data: {
        linkedinId,
        name,
        title,
        company,
        location,
        profileUrl,
        notes,
        tags,
        userId: userId || 'default'
      }
    });
    
    return NextResponse.json(prospect, { status: 201 });
  } catch (error) {
    console.error('Error creating prospect:', error);
    return NextResponse.json({ error: 'Failed to create prospect' }, { status: 500 });
  }
}
