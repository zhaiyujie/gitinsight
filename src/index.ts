#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('gitinsight')
  .description('Analyze GitHub repository health and generate beautiful HTML reports')
  .version('1.0.0');

program.addCommand(analyzeCommand);
program.addCommand(configCommand);

program.parse();
