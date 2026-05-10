import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { parseRepo, getRepoMeta, getCommits, getIssues, getPullRequests, getLanguages, getContributors, getPackageJson, getBranches, setSslVerify } from '../api/github';
import { analyzeCommits } from '../analyzers/commits';
import { analyzeIssues } from '../analyzers/issues';
import { analyzePRs } from '../analyzers/pull-requests';
import { analyzeCode } from '../analyzers/code';
import { analyzeDependencies } from '../analyzers/dependencies';
import { generateHTMLReport, generateJSONReport, ReportData } from '../report/generate';

export const analyzeCommand = new Command('analyze')
  .description('Analyze a GitHub repository and generate a health report')
  .argument('<repos...>', 'Repository in "owner/repo" format')
  .option('-s, --since <date>', 'Start date for analysis (YYYY-MM-DD)')
  .option('-u, --until <date>', 'End date for analysis (YYYY-MM-DD)')
  .option('-o, --output <dir>', 'Output directory', './reports')
  .option('-f, --format <format>', 'Output format: html or json', 'html')
  .option('--no-ssl-verify', 'Disable SSL certificate verification')
  .action(async (repos: string[], options) => {
    if (options.sslVerify === false) {
      setSslVerify(false);
    }
    for (const repoStr of repos) {
      await analyzeRepo(repoStr, options);
    }
  });

async function analyzeRepo(repoStr: string, options: any) {
  const info = parseRepo(repoStr);
  const spinner = ora();

  console.log(chalk.bold(`\nAnalyzing ${chalk.blue(repoStr)}...\n`));

  try {
    // Fetch all data
    spinner.start('Fetching repository info...');
    const repo = await getRepoMeta(info);
    spinner.succeed('Repository info fetched');

    spinner.start('Fetching commits...');
    const commits = await getCommits(info, options.since, options.until);
    spinner.succeed(`${commits.length} commits fetched`);

    spinner.start('Fetching contributors...');
    const contributors = await getContributors(info);
    spinner.succeed(`${contributors.length} contributors fetched`);

    spinner.start('Fetching issues...');
    const issues = await getIssues(info, options.since);
    spinner.succeed(`${issues.length} issues fetched`);

    spinner.start('Fetching pull requests...');
    const prs = await getPullRequests(info);
    spinner.succeed(`${prs.length} pull requests fetched`);

    spinner.start('Fetching languages...');
    const languages = await getLanguages(info);
    spinner.succeed('Languages fetched');

    spinner.start('Fetching branches...');
    const branches = await getBranches(info);
    spinner.succeed(`${branches.length} branches fetched`);

    spinner.start('Fetching package.json...');
    const packageJson = await getPackageJson(info);
    spinner.succeed(packageJson ? 'package.json found' : 'No package.json');

    // Analyze
    spinner.start('Analyzing data...');
    const commitAnalysis = analyzeCommits(commits, contributors);
    const issueAnalysis = analyzeIssues(issues);
    const prAnalysis = analyzePRs(prs);
    const codeAnalysis = analyzeCode(repo, languages as any, branches);
    const depAnalysis = analyzeDependencies(packageJson);
    spinner.succeed('Analysis complete');

    // Generate report
    spinner.start('Generating report...');
    const reportData: ReportData = {
      repo: repoStr,
      analysis: {
        code: codeAnalysis,
        commits: commitAnalysis,
        issues: issueAnalysis,
        prs: prAnalysis,
        dependencies: depAnalysis,
      },
      generatedAt: new Date().toLocaleString(),
    };

    let filepath: string;
    if (options.format === 'json') {
      filepath = generateJSONReport(reportData, options.output);
    } else {
      filepath = await generateHTMLReport(reportData, options.output);
    }
    spinner.succeed('Report generated');

    // Print summary
    console.log(chalk.bold('\n--- Summary ---'));
    console.log(`Commits:       ${chalk.green(commitAnalysis.totalCommits)} (${commitAnalysis.activeDays} active days)`);
    console.log(`Contributors:  ${chalk.green(commitAnalysis.topContributors.length)}`);
    console.log(`Issues:        ${chalk.yellow(issueAnalysis.openIssues)} open / ${chalk.green(issueAnalysis.closedIssues)} closed (${issueAnalysis.closeRate}% close rate)`);
    console.log(`Pull Requests: ${chalk.yellow(prAnalysis.openPRs)} open / ${chalk.green(prAnalysis.mergedPRs)} merged (${prAnalysis.mergeRate}% merge rate)`);
    console.log(`Languages:     ${codeAnalysis.languages.slice(0, 3).map((l: any) => l.name).join(', ')}`);
    console.log(`Stars:         ${chalk.yellow(codeAnalysis.stars)}`);
    console.log(chalk.bold(`\nReport saved to: ${chalk.blue(filepath)}\n`));

  } catch (error: any) {
    spinner.fail(chalk.red(`Error: ${error.message}`));
    if (error.status === 404) {
      console.log(chalk.yellow('Tip: Make sure the repository exists and is public, or set a token with: gitinsight config set token <your-token>'));
    }
    if (error.status === 403) {
      console.log(chalk.yellow('Tip: Rate limited. Set a GitHub token: gitinsight config set token <your-token>'));
    }
    process.exit(1);
  }
}
