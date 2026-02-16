import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/analytics - Get dashboard analytics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Get counts
    const [totalAccounts, activeAccounts, totalProspects, recentProspects, totalActivities, recentActivities] = await Promise.all([
      prisma.linkedInAccount.count(),
      prisma.linkedInAccount.count({ where: { status: 'connected' } }),
      prisma.prospect.count(),
      prisma.prospect.count({ where: { createdAt: { gte: startDate } } }),
      prisma.prospectActivity.count(),
      prisma.prospectActivity.count({ where: { createdAt: { gte: startDate } } })
    ]);
    
    // Get activities by type
    const activitiesByType = await prisma.prospectActivity.groupBy({
      by: ['type'],
      _count: true,
      where: { createdAt: { gte: startDate } }
    });
    
    // Get activities by status
    const activitiesByStatus = await prisma.prospectActivity.groupBy({
      by: ['status'],
      _count: true,
      where: { createdAt: { gte: startDate } }
    });
    
    // Get recent activity
    const recentActivityList = await prisma.prospectActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        prospect: true,
        account: true
      }
    });
    
    // Get prospects by company (top 10)
    const prospectsByCompany = await prisma.prospect.groupBy({
      by: ['company'],
      _count: true,
      orderBy: { _count: { company: 'desc' } },
      take: 10
    });
    
    return NextResponse.json({
      summary: {
        totalAccounts,
        activeAccounts,
        totalProspects,
        recentProspects,
        totalActivities,
        recentActivities
      },
      activitiesByType: activitiesByType.map(a => ({ type: a.type, count: a._count })),
      activitiesByStatus: activitiesByStatus.map(a => ({ status: a.status, count: a._count })),
      recentActivity: recentActivityList,
      prospectsByCompany: prospectsByCompany.map(c => ({ company: c.company, count: c._count }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
