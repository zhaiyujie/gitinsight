<p align="center">
  <h1 align="center">GitInsight</h1>
  <p align="center">Analyze GitHub repository health and generate beautiful, interactive HTML reports.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome">
</p>

---

**GitInsight** is a CLI tool that connects to any GitHub repository, analyzes its health across multiple dimensions, and generates a self-contained HTML report with interactive charts — no server required, just open the file in your browser.

## Why GitInsight?

| Problem | GitInsight Solution |
|---------|---------------------|
| Hard to gauge project health at a glance | One command generates a full dashboard |
| GitHub Insights is limited to paid plans | Free, open-source, works on any public repo |
| Existing tools output raw JSON/CSV | Beautiful HTML reports with interactive charts |
| Need to compare multiple repos | Analyze several repos in a single run |

## Features

### Commit Intelligence
- Commit frequency trends (monthly breakdown)
- Top contributors leaderboard with share percentages
- Total lines added / deleted
- Active days count and last commit date

### Issue & PR Health
- Open / Closed issue ratio with close rate
- Average issue close time (days)
- Stale issue detection (>30 days without activity)
- PR merge rate and average merge time
- Monthly opened vs. merged trend charts

### Codebase Overview
- Language distribution (doughnut chart + visual bar)
- Repository size, star count, fork count
- Branch count and default branch info
- Repository age and last push date

### Dependency Analysis
- Production vs. dev dependency breakdown
- Full dependency listing
- NPM scripts overview

### Report Output
- **HTML** — Self-contained, interactive, dark-themed dashboard with Chart.js
- **JSON** — Raw data for further processing or CI integration

## Quick Start

```bash
# Install globally
npm install -g gitinsight

# Analyze any public repository
gitinsight analyze facebook/react

# Open the generated report in your browser
```

That's it. A beautiful HTML report will be generated in the `./reports` directory.

## Usage

```bash
# Single repository
gitinsight analyze owner/repo

# Multiple repositories (generates separate reports)
gitinsight analyze facebook/react vuejs/core angular/angular

# Date range filtering
gitinsight analyze owner/repo --since 2025-01-01 --until 2025-12-31

# Custom output directory
gitinsight analyze owner/repo --output ./my-reports

# JSON output (for CI pipelines or further processing)
gitinsight analyze owner/repo --format json
```

### CLI Options

```
gitinsight analyze [options] <repos...>

Arguments:
  repos                  Repository in "owner/repo" format

Options:
  -s, --since <date>     Start date for analysis (YYYY-MM-DD)
  -u, --until <date>     End date for analysis (YYYY-MM-DD)
  -o, --output <dir>     Output directory (default: "./reports")
  -f, --format <format>  Output format: html or json (default: "html")
  -h, --help             Display help
```

## Configuration

For private repositories or to avoid GitHub API rate limits, set a personal access token:

```bash
# Set token
gitinsight config set token ghp_xxxxxxxxxxxxxxxxxxxx

# View current config
gitinsight config get

# Remove token
gitinsight config set token ""
```

> **Tip:** Generate a token at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens). No scopes are required for public repositories.

## Sample Report

The generated HTML report is a self-contained dark-themed dashboard:

```
┌─────────────────────────────────────────────────────────┐
│                    GitInsight Report                     │
│              facebook/react · 12,847 commits             │
├─────────┬─────────┬─────────┬─────────┬─────────┬───────┤
│ Commits │Contrib. │ Issues  │   PRs   │ Branches│  Deps │
│ 12,847  │  2,100+ │  842    │ 15,200+ │   42    │  28   │
├─────────┴─────────┴─────────┴─────────┴─────────┴───────┤
│  [Commit Trend Line Chart]  [Contributors Bar Chart]     │
├─────────────────────────────────────────────────────────┤
│  [Language Doughnut]        [Language Distribution Bar]  │
├─────────────────────────────────────────────────────────┤
│  [Issue Trend Chart]        [PR Trend Chart]             │
├─────────────────────────────────────────────────────────┤
│  Top Contributors Table                                  │
│  #1  gaearon        1,234 commits   9.6%                 │
│  #2  sophiebits     876 commits     6.8%                 │
├─────────────────────────────────────────────────────────┤
│  Dependencies / NPM Scripts                              │
└─────────────────────────────────────────────────────────┘
```

## Architecture

```
gitinsight/
├── src/
│   ├── index.ts              # CLI entry point (Commander.js)
│   ├── commands/
│   │   ├── analyze.ts        # Main analysis command
│   │   └── config.ts         # Configuration management
│   ├── analyzers/
│   │   ├── commits.ts        # Commit frequency & contributors
│   │   ├── issues.ts         # Issue health metrics
│   │   ├── pull-requests.ts  # PR merge analytics
│   │   ├── code.ts           # Language & repo metadata
│   │   └── dependencies.ts   # package.json analysis
│   ├── api/
│   │   └── github.ts         # GitHub REST API (Octokit)
│   ├── report/
│   │   ├── generate.ts       # HTML/JSON report generator
│   │   └── charts.ts         # Chart.js configuration builder
│   └── utils/
│       └── date.ts           # Date formatting helpers
├── templates/
│   └── report.ejs            # HTML report template
├── package.json
└── tsconfig.json
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Runtime | Node.js |
| CLI Framework | Commander.js |
| GitHub API | Octokit (REST) |
| Report Engine | EJS templates |
| Charts | Chart.js (CDN, embedded) |
| Terminal UI | chalk, ora, cli-progress |

## Development

```bash
# Clone
git clone https://github.com/your-username/gitinsight.git
cd gitinsight

# Install dependencies
npm install

# Build
npm run build

# Test locally
node dist/index.js analyze octocat/Hello-World
```

## Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please make sure `npm run build` passes before submitting.

## License

[MIT](LICENSE)
