export function generateChartConfigs(analysis: any) {
  return {
    commitTrend: {
      type: 'line',
      data: {
        labels: analysis.commits.monthlyTrend.map((t: any) => t.month),
        datasets: [{
          label: 'Commits',
          data: analysis.commits.monthlyTrend.map((t: any) => t.count),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
        }],
      },
    },
    contributors: {
      type: 'bar',
      data: {
        labels: analysis.commits.topContributors.slice(0, 8).map((c: any) => c.name),
        datasets: [{
          label: 'Commits',
          data: analysis.commits.topContributors.slice(0, 8).map((c: any) => c.commits),
          backgroundColor: '#8b5cf6',
        }],
      },
    },
    languages: {
      type: 'doughnut',
      data: {
        labels: analysis.code.languages.slice(0, 8).map((l: any) => l.name),
        datasets: [{
          data: analysis.code.languages.slice(0, 8).map((l: any) => l.percentage),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1'],
        }],
      },
    },
    issueTrend: {
      type: 'bar',
      data: {
        labels: analysis.issues.monthlyTrend.map((t: any) => t.month),
        datasets: [
          {
            label: 'Opened',
            data: analysis.issues.monthlyTrend.map((t: any) => t.opened),
            backgroundColor: '#ef4444',
          },
          {
            label: 'Closed',
            data: analysis.issues.monthlyTrend.map((t: any) => t.closed),
            backgroundColor: '#10b981',
          },
        ],
      },
    },
    prTrend: {
      type: 'bar',
      data: {
        labels: analysis.prs.monthlyTrend.map((t: any) => t.month),
        datasets: [
          {
            label: 'Opened',
            data: analysis.prs.monthlyTrend.map((t: any) => t.opened),
            backgroundColor: '#f59e0b',
          },
          {
            label: 'Merged',
            data: analysis.prs.monthlyTrend.map((t: any) => t.merged),
            backgroundColor: '#8b5cf6',
          },
        ],
      },
    },
  };
}
