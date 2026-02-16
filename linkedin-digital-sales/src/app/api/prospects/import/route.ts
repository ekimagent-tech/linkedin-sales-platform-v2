import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/prospects/import - Bulk import prospects from CSV
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prospects, userId } = body;
    
    if (!prospects || !Array.isArray(prospects)) {
      return NextResponse.json({ error: 'Invalid prospects data' }, { status: 400 });
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    for (const prospect of prospects) {
      try {
        await prisma.prospect.upsert({
          where: { linkedinId: prospect.linkedinId },
          update: {
            name: prospect.name,
            title: prospect.title,
            company: prospect.company,
            location: prospect.location,
            profileUrl: prospect.profileUrl,
            notes: prospect.notes,
            tags: prospect.tags
          },
          create: {
            linkedinId: prospect.linkedinId,
            name: prospect.name,
            title: prospect.title,
            company: prospect.company,
            location: prospect.location,
            profileUrl: prospect.profileUrl,
            notes: prospect.notes,
            tags: prospect.tags,
            userId: userId || 'default'
          }
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import ${prospect.name || prospect.linkedinId}: ${error}`);
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error importing prospects:', error);
    return NextResponse.json({ error: 'Failed to import prospects' }, { status: 500 });
  }
}
