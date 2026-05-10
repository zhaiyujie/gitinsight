import { daysBetween } from '../utils/date';

export interface IssueAnalysis {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  closeRate: number;
  avgCloseDays: number;
  staleIssues: number;
  monthlyTrend: { month: string; opened: number; closed: number }[];
  topLabels: { name: string; count: number }[];
}

export function analyzeIssues(issues: any[]): IssueAnalysis {
  const open = issues.filter((i) => i.state === 'open');
  const closed = issues.filter((i) => i.state === 'closed');
  const total = issues.length;

  const closeRate = total > 0 ? Math.round((closed.length / total) * 100) : 0;

  const closeDays = closed
    .filter((i) => i.closed_at)
    .map((i) => daysBetween(i.created_at, i.closed_at));
  const avgCloseDays = closeDays.length > 0
    ? Math.round(closeDays.reduce((a, b) => a + b, 0) / closeDays.length)
    : 0;

  const now = new Date();
  const staleIssues = open.filter((i) => daysBetween(i.created_at, now) > 30).length;

  const monthlyMap = new Map<string, { opened: number; closed: number }>();
  for (const issue of issues) {
    const month = new Date(issue.created_at).toISOString().slice(0, 7);
    const entry = monthlyMap.get(month) || { opened: 0, closed: 0 };
    entry.opened++;
    if (issue.state === 'closed') entry.closed++;
    monthlyMap.set(month, entry);
  }

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const labelMap = new Map<string, number>();
  for (const issue of issues) {
    for (const label of issue.labels || []) {
      labelMap.set(label.name, (labelMap.get(label.name) || 0) + 1);
    }
  }
  const topLabels = Array.from(labelMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalIssues: total,
    openIssues: open.length,
    closedIssues: closed.length,
    closeRate,
    avgCloseDays,
    staleIssues,
    monthlyTrend,
    topLabels,
  };
}
