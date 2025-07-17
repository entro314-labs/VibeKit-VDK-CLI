#!/usr/bin/env node

/**
 * VibeKit VDK CLI
 * -----------------------
 * This is the main entry point for the VDK command-line interface.
 * It orchestrates commands for initializing projects, managing rules, and deploying to the VDK Hub.
 *
 * Repository: https://github.com/entro314-labs/VDK-CLI
 */

import dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import { runScanner } from './src/scanner/index.js';
import { fetchRuleList, downloadRule } from './src/hub-client.js';
import fs from 'fs/promises';
import path from 'path';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const program = new Command();

program
  .name('vdk')
  .description("VDK CLI: The world's first Vibe Development Kit - Make your AI assistant project-aware")
  .version(pkg.version);

program
  .command('init')
  .description('Initialize VDK and generate project-aware AI rules by scanning the project')
  .option('-p, --projectPath <path>', 'Path to the project to scan', process.cwd())
  .option('-o, --outputPath <path>', 'Path where generated rules should be saved', './.ai/rules')
  .option('-d, --deep', 'Enable deep scanning for more thorough pattern detection', false)
  .option('-i, --ignorePattern <patterns...>', 'Glob patterns to ignore', ['**/node_modules/**', '**/dist/**', '**/build/**'])
  .option('--use-gitignore', 'Automatically parse .gitignore files for additional ignore patterns', true)
  .option('-t, --template <name>', 'Name of the rule template to use', 'default')
  .option('--overwrite', 'Overwrite existing rule files without prompting', false)
  .option('--ide-integration', 'Enable IDE integration setup', true)
  .option('--watch', 'Enable watch mode for continuous IDE integration updates', false)
  .option('-v, --verbose', 'Enable verbose output for debugging', false)
  .action(async (options) => {
    try {
      const results = await runScanner(options);

      // Create the VDK configuration file
      const configPath = path.join(options.projectPath, 'vdk.config.json');
      const config = {
        project: {
          name: results.projectName,
        },
        ide: results.initializedIDEs[0] || 'generic',
        rulesPath: options.outputPath,
        lastUpdated: new Date().toISOString(),
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green(`\n✅ VDK configuration created at ${chalk.cyan(configPath)}`));

      // Handle watch mode
      if (options.watch && results.ideIntegration) {
        console.log(chalk.blue('\nWatch mode enabled. Press Ctrl+C to exit.'));
        process.on('SIGINT', () => {
          results.ideIntegration.shutdown();
          process.exit(0);
        });
        // Keep the process running in watch mode
        await new Promise(() => {});
      }
    } catch (error) {
      // The scanner engine already logs errors, so we just exit to prevent double logging
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Deploy project-aware rules (Under Development)')
  .action(() => {
    console.log(chalk.yellow('⚠️ This command is under development.'));
    console.log('The `deploy` command will be used to send your VDK rules to the VDK Hub.');
  });

program
  .command('update')
  .description('Update VDK rules from the VDK Hub')
  .option('-o, --outputPath <path>', 'Path to the rules directory', './.ai/rules')
  .action(async (options) => {
    const rulesDir = path.resolve(options.outputPath);
    console.log(chalk.blue(`Checking for updates in VDK Hub...`));

    try {
      // Ensure local rules directory exists
      await fs.mkdir(rulesDir, { recursive: true });

      const remoteRules = await fetchRuleList();
      if (remoteRules.length === 0) {
        console.log(chalk.yellow('No rules found in the VDK Hub or failed to connect.'));
        return;
      }

      const localRules = await fs.readdir(rulesDir).catch(() => []);
      let updatedCount = 0;
      let newCount = 0;

      console.log(chalk.blue(`Found ${remoteRules.length} rules in the Hub. Comparing with local rules...`));

      for (const remoteRule of remoteRules) {
        const localPath = path.join(rulesDir, remoteRule.name);
        const ruleContent = await downloadRule(remoteRule.download_url);

        if (ruleContent) {
          if (localRules.includes(remoteRule.name)) {
            await fs.writeFile(localPath, ruleContent);
            updatedCount++;
          } else {
            await fs.writeFile(localPath, ruleContent);
            newCount++;
          }
        }
      }

      if (newCount > 0 || updatedCount > 0) {
         console.log(chalk.green(`✅ Update complete!`));
         if (newCount > 0) console.log(chalk.green(`   - Added ${newCount} new rule(s).`));
         if (updatedCount > 0) console.log(chalk.green(`   - Updated ${updatedCount} existing rule(s).`));
      } else {
        console.log(chalk.green('✅ Your rules are already up to date.'));
      }

    } catch (error) {
      console.error(chalk.red(`An error occurred during the update: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check the status of your VDK setup')
  .option('-c, --configPath <path>', 'Path to the VDK configuration file', './vdk.config.json')
  .option('-o, --outputPath <path>', 'Path to the rules directory', './.ai/rules')
  .action(async (options) => {
    console.log(chalk.blue('Checking VDK status...\n'));
    const configPath = path.resolve(options.configPath);
    const rulesDir = path.resolve(options.outputPath);
    let isConfigured = false;

    // 1. Check for VDK configuration file
    try {
      await fs.access(configPath);
      const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
      console.log(chalk.green('✅ VDK Configuration: Found and valid.'));
      console.log(`   - Project: ${chalk.cyan(config.project.name)}`);
      console.log(`   - IDE: ${chalk.cyan(config.ide)}`);
      isConfigured = true;
    } catch (error) {
      console.log(chalk.yellow('⚠️ VDK Configuration: Not found or invalid.'));
      console.log(`   - Run ${chalk.cyan('vdk init')} to get started.`);
    }

    // 2. Check local and remote rules
    try {
      const localRules = await fs.readdir(rulesDir).catch(() => []);
      console.log(`\n${chalk.green('✅ Local Rules:')} Found ${chalk.cyan(localRules.length)} rule(s) in ${chalk.dim(rulesDir)}`);

      const remoteRules = await fetchRuleList();
      if (remoteRules.length > 0) {
        const remoteRuleNames = remoteRules.map(r => r.name);
        const newRules = remoteRuleNames.filter(r => !localRules.includes(r));

        console.log(`\n${chalk.green('✅ VDK Hub Status:')} Hub contains ${chalk.cyan(remoteRules.length)} total rules.`);
        if (newRules.length > 0) {
          console.log(chalk.yellow(`   - Updates available: ${chalk.cyan(newRules.length)} new or updated rule(s).`));
          console.log(`   - Run ${chalk.cyan('vdk update')} to get the latest rules.`);
        } else {
          console.log(chalk.green('   - Your local rules are up to date.'));
        }
      }
    } catch (error) {
        console.log(chalk.red(`\n❌ Could not check rule status: ${error.message}`));
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
