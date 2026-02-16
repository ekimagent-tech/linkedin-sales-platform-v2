// Stub automation engine - backend implementation pending
export type ExecutionLog = {
  id: string;
  ruleId: string;
  ruleName: string;
  accountId: string;
  accountName: string;
  action: string;
  targetName: string;
  targetUrl: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  details: string;
  linkedinRef: string;
};

export const automationEngine = {
  async executeRule(rule: any): Promise<ExecutionLog[]> {
    console.log('Execute rule:', rule);
    return [];
  },
  isRuleRunning(ruleId: string): boolean {
    return false;
  }
};
