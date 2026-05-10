import { getMonthKey } from '../utils/date';

export interface CommitAnalysis {
  totalCommits: number;
  monthlyTrend: { month: string; count: number }[];
  topContributors: { name: string; commits: number }[];
  totalAdditions: number;
  totalDeletions: number;
  activeDays: number;
  lastCommitDate: string;
}

export function analyzeCommits(commits: any[], contributors: any[]): CommitAnalysis {
  const monthlyMap = new Map<string, number>();
  const authorMap = new Map<string, number>();

  for (const commit of commits) {
    const month = getMonthKey(commit.commit.author.date);
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);

    const author = commit.commit.author.name || 'Unknown';
    authorMap.set(author, (authorMap.get(author) || 0) + 1);
  }

  const monthlyTrend = Array.from(monthlyMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const topContributors = Array.from(authorMap.entries())
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 10);

  const activeDays = new Set(
    commits.map((c: any) => new Date(c.commit.author.date).toISOString().split('T')[0])
  ).size;

  const totalAdditions = contributors.reduce((sum: number, c: any) => sum + (c.additions || 0), 0);
  const totalDeletions = contributors.reduce((sum: number, c: any) => sum + (c.deletions || 0), 0);

  return {
    totalCommits: commits.length,
    monthlyTrend,
    topContributors,
    totalAdditions,
    totalDeletions,
    activeDays,
    lastCommitDate: commits[0]?.commit.author.date || 'N/A',
  };
}
