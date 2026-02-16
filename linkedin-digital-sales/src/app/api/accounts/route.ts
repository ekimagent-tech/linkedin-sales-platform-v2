import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/accounts - List all accounts
export async function GET(request: Request) {
  try {
    const accounts = await prisma.linkedInAccount.findMany({
      include: {
        _count: {
          select: { activities: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST /api/accounts - Create new account
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cookie, status, riskLevel, dailyLimit, userId } = body;
    
    const account = await prisma.linkedInAccount.create({
      data: {
        name,
        cookie,
        status: status || 'disconnected',
        riskLevel: riskLevel || 'low',
        dailyLimit: dailyLimit || 50,
        userId: userId || 'default'
      }
    });
    
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
