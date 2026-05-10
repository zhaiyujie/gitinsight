import { renderFile } from 'ejs';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { generateChartConfigs } from './charts';

export interface ReportData {
  repo: string;
  analysis: {
    code: any;
    commits: any;
    issues: any;
    prs: any;
    dependencies: any;
  };
  generatedAt: string;
}

export async function generateHTMLReport(data: ReportData, outputDir: string): Promise<string> {
  const charts = generateChartConfigs(data.analysis);
  const templatePath = join(__dirname, '../../templates/report.ejs');

  const html = await renderFile(templatePath, {
    ...data,
    charts: JSON.stringify(charts),
  });

  const dir = resolve(outputDir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const filename = `gitinsight-${data.repo.replace('/', '-')}-${new Date().toISOString().slice(0, 10)}.html`;
  const filepath = join(dir, filename);
  writeFileSync(filepath, html, 'utf-8');
  return filepath;
}

export function generateJSONReport(data: ReportData, outputDir: string): string {
  const dir = resolve(outputDir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const filename = `gitinsight-${data.repo.replace('/', '-')}-${new Date().toISOString().slice(0, 10)}.json`;
  const filepath = join(dir, filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filepath;
}
