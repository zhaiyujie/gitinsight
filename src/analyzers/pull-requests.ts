import { daysBetween } from '../utils/date';

export interface PRAnalysis {
  totalPRs: number;
  mergedPRs: number;
  openPRs: number;
  mergeRate: number;
  avgMergeDays: number;
  monthlyTrend: { month: string; opened: number; merged: number }[];
  topAuthors: { name: string; prs: number }[];
}

export function analyzePRs(prs: any[]): PRAnalysis {
  const merged = prs.filter((p) => p.merged_at);
  const open = prs.filter((p) => p.state === 'open');
  const total = prs.length;

  const mergeRate = total > 0 ? Math.round((merged.length / total) * 100) : 0;

  const mergeDays = merged
    .filter((p) => p.merged_at)
    .map((p) => daysBetween(p.created_at, p.merged_at));
  const avgMergeDays = mergeDays.length > 0
    ? Math.round(mergeDays.reduce((a, b) => a + b, 0) / mergeDays.length)
    : 0;

  const monthlyMap = new Map<string, { opened: number; merged: number }>();
  for (const pr of prs) {
    const month = new Date(pr.created_at).toISOString().slice(0, 7);
    const entry = monthlyMap.get(month) || { opened: 0, merged: 0 };
    entry.opened++;
    if (pr.merged_at) entry.merged++;
    monthlyMap.set(month, entry);
  }

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const authorMap = new Map<string, number>();
  for (const pr of prs) {
    const name = pr.user?.login || 'Unknown';
    authorMap.set(name, (authorMap.get(name) || 0) + 1);
  }
  const topAuthors = Array.from(authorMap.entries())
    .map(([name, prs]) => ({ name, prs }))
    .sort((a, b) => b.prs - a.prs)
    .slice(0, 10);

  return {
    totalPRs: total,
    mergedPRs: merged.length,
    openPRs: open.length,
    mergeRate,
    avgMergeDays,
    monthlyTrend,
    topAuthors,
  };
}
