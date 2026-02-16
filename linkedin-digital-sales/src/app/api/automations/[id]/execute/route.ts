// API Route: Execute Automation
// POST /api/automations/:id/execute

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { automationEngine } from '@/lib/automation-engine';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get the rule
    const rule = await prisma.automationRule.findUnique({
      where: { id },
      include: {
        account: true
      }
    });

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    if (!rule.isActive) {
      return NextResponse.json({ error: 'Rule is not active' }, { status: 400 });
    }

    if (automationEngine.isRuleRunning(id)) {
      return NextResponse.json({ error: 'Rule is already running' }, { status: 409 });
    }

    // Execute the rule
    const logs = await automationEngine.executeRule(rule as any);

    return NextResponse.json({
      success: true,
      ruleId: id,
      ruleName: rule.name,
      executedActions: logs.length,
      logs: logs.map(l => ({
        id: l.id,
        action: l.action,
        targetName: l.targetName,
        status: l.status,
        linkedinRef: l.linkedinRef
      }))
    });
  } catch (error) {
    console.error('Automation execution error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isRunning = automationEngine.isRuleRunning(id);
    
    return NextResponse.json({ ruleId: id, isRunning });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
