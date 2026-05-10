import { Octokit } from '@octokit/rest';
import { getConfig } from '../commands/config';

let octokitInstance: Octokit | null = null;
let sslVerify = true;

export function setSslVerify(value: boolean) {
  sslVerify = value;
  if (!value) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  octokitInstance = null;
}

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    const config = getConfig();
    const token = config.token;
    octokitInstance = new Octokit(token ? { auth: token } : undefined);
  }
  return octokitInstance;
}

export interface RepoInfo {
  owner: string;
  repo: string;
}

export function parseRepo(repoStr: string): RepoInfo {
  const parts = repoStr.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(`Invalid repo format: "${repoStr}". Expected "owner/repo"`);
  }
  return { owner: parts[0], repo: parts[1] };
}

export async function getRepoMeta({ owner, repo }: RepoInfo) {
  const octokit = getOctokit();
  const { data } = await octokit.repos.get({ owner, repo });
  return data;
}

export async function getCommits({ owner, repo }: RepoInfo, since?: string, until?: string) {
  const octokit = getOctokit();
  const commits: any[] = [];
  for await (const response of octokit.paginate.iterator(octokit.rest.repos.listCommits, {
    owner,
    repo,
    since: since || undefined,
    until: until || undefined,
    per_page: 100,
  })) {
    commits.push(...response.data);
    if (commits.length >= 1000) break;
  }
  return commits;
}

export async function getIssues({ owner, repo }: RepoInfo, since?: string) {
  const octokit = getOctokit();
  const issues: any[] = [];
  for await (const response of octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'all',
    since: since || undefined,
    per_page: 100,
  })) {
    issues.push(...response.data.filter((i: any) => !i.pull_request));
    if (issues.length >= 1000) break;
  }
  return issues;
}

export async function getPullRequests({ owner, repo }: RepoInfo) {
  const octokit = getOctokit();
  const prs: any[] = [];
  for await (const response of octokit.paginate.iterator(octokit.rest.pulls.list, {
    owner,
    repo,
    state: 'all',
    per_page: 100,
  })) {
    prs.push(...response.data);
    if (prs.length >= 1000) break;
  }
  return prs;
}

export async function getLanguages({ owner, repo }: RepoInfo) {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listLanguages({ owner, repo });
  return data;
}

export async function getContributors({ owner, repo }: RepoInfo) {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listContributors({ owner, repo, per_page: 100 });
  return data;
}

export async function getPackageJson({ owner, repo }: RepoInfo): Promise<any | null> {
  const octokit = getOctokit();
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'package.json' });
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    }
  } catch {
    return null;
  }
  return null;
}

export async function getBranches({ owner, repo }: RepoInfo) {
  const octokit = getOctokit();
  const { data } = await octokit.repos.listBranches({ owner, repo, per_page: 100 });
  return data;
}
