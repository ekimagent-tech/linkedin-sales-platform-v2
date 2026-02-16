import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/prospects/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prospect = await prisma.prospect.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }
    
    return NextResponse.json(prospect);
  } catch (error) {
    console.error('Error fetching prospect:', error);
    return NextResponse.json({ error: 'Failed to fetch prospect' }, { status: 500 });
  }
}

// PUT /api/prospects/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const prospect = await prisma.prospect.update({
      where: { id },
      data: body
    });
    
    return NextResponse.json(prospect);
  } catch (error) {
    console.error('Error updating prospect:', error);
    return NextResponse.json({ error: 'Failed to update prospect' }, { status: 500 });
  }
}

// DELETE /api/prospects/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await prisma.prospect.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prospect:', error);
    return NextResponse.json({ error: 'Failed to delete prospect' }, { status: 500 });
  }
}
