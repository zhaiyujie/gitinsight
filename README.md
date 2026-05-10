# GitInsight

Analyze GitHub repository health and generate beautiful HTML reports.

## Features

- **Commit Analysis** - Frequency trends, top contributors, active days
- **Issue & PR Health** - Close rates, merge times, stale issue detection
- **Language Distribution** - Visual breakdown of codebase languages
- **Dependency Overview** - Package.json analysis with script listing
- **Beautiful Reports** - Interactive HTML reports with embedded Chart.js charts
- **Multiple Formats** - HTML (interactive) or JSON output

## Installation

```bash
npm install -g gitinsight
```

## Usage

```bash
# Analyze a public repository
gitinsight analyze facebook/react

# Analyze with date range
gitinsight analyze owner/repo --since 2025-01-01

# Output JSON instead of HTML
gitinsight analyze owner/repo --format json

# Custom output directory
gitinsight analyze owner/repo --output ./my-reports

# Analyze multiple repos
gitinsight analyze owner/repo1 owner/repo2
```

## Configuration

```bash
# Set GitHub token (for private repos or higher rate limits)
gitinsight config set token ghp_xxxxxxxxxxxx

# View current config
gitinsight config get
```

## Report Contents

The generated HTML report includes:

- Overview cards (commits, contributors, issues, PRs, branches, dependencies)
- Commit activity trend chart
- Top contributors bar chart
- Language distribution (doughnut chart + visual bar)
- Issue & PR trend charts
- Detailed contributor table
- Issue label tags
- Dependency listing with npm scripts

## Development

```bash
git clone https://github.com/your-username/gitinsight.git
cd gitinsight
npm install
npm run build
node dist/index.js analyze facebook/react
```

## License

MIT
