export interface CodeAnalysis {
  languages: { name: string; bytes: number; percentage: number }[];
  branchCount: number;
  defaultBranch: string;
  repoSize: number;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  description: string;
  createdAt: string;
  lastPush: string;
}

export function analyzeCode(repo: any, languages: Record<string, number>, branches: any[]): CodeAnalysis {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const langEntries = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    languages: langEntries,
    branchCount: branches.length,
    defaultBranch: repo.default_branch || 'main',
    repoSize: repo.size || 0,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    watchers: repo.watchers_count || 0,
    openIssues: repo.open_issues_count || 0,
    description: repo.description || '',
    createdAt: repo.created_at,
    lastPush: repo.pushed_at,
  };
}
