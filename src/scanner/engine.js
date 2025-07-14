/**
 * VDK Project Scanner
 * Core logic for analyzing a codebase to generate custom rules.
 */

import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs/promises';

import { ProjectScanner } from './core/ProjectScanner.js';
import { PatternDetector } from './core/PatternDetector.js';
import { TechnologyAnalyzer } from './core/TechnologyAnalyzer.js';
import { RuleGenerator } from './core/RuleGenerator.js';
import { RuleValidator } from './utils/validator.js';
import { IDEIntegrationManager } from './integrations/ide-integration.js';
import { getVersion } from './utils/version.js';
import { GitIgnoreParser } from './utils/gitignore-parser.js';

/**
 * Orchestrates the project scanning process.
 * @param {object} options - The configuration options for the scanner.
 * @param {string} options.projectPath - Path to the project to scan.
 * @param {string} options.outputPath - Path where generated rules should be saved.
 * @param {boolean} options.deep - Enable deep scanning.
 * @param {string[]} options.ignorePattern - Glob patterns to ignore.
 * @param {boolean} options.useGitignore - Automatically parse .gitignore files.
 * @param {string} options.template - The name of the rule template to use.
 * @param {boolean} options.overwrite - Overwrite existing rule files.
 * @param {boolean} options.verbose - Enable verbose logging.
 * @param {boolean} options.ideIntegration - Enable IDE integration.
 * @param {boolean} options.watch - Enable watch mode for IDE integration.
 */
export async function runScanner(options) {
  const spinner = ora({ text: 'Starting project analysis...', color: 'cyan' }).start();

  try {
    const projectPath = path.resolve(options.projectPath);
    const outputPath = path.resolve(options.outputPath);

    spinner.text = 'Parsing ignore patterns...';
    let ignorePatterns = options.ignorePattern || [];
    if (options.useGitignore) {
      const gitignorePath = path.join(projectPath, '.gitignore');
      try {
        const parser = new GitIgnoreParser(gitignorePath);
        const gitignorePatterns = await parser.parse();
        ignorePatterns = [...ignorePatterns, ...gitignorePatterns];
        if (options.verbose) {
          spinner.info('Successfully parsed .gitignore file.');
        }
      } catch (error) {
        spinner.warn('Could not parse .gitignore file. Proceeding without it.');
      }
    }

    spinner.text = 'Scanning project files...';
    const scanner = new ProjectScanner({
      projectPath,
      ignorePatterns,
      useGitIgnore: options.useGitignore,
      deepScan: options.deep,
      verbose: options.verbose,
    });
    const projectData = await scanner.scanProject(projectPath);
    spinner.succeed(`Project scan completed in ${projectData.scanDuration}ms`);

    spinner.text = 'Analyzing files...';
    const files = projectData.files;
    spinner.succeed(`Found ${files.length} files to analyze.`);

    spinner.text = 'Analyzing technology stack...';
    const techAnalyzer = new TechnologyAnalyzer({ verbose: options.verbose });
    const techData = await techAnalyzer.analyzeTechnologies(projectData);
    const techSummary = [
      ...new Set([
        ...(techData.frameworks || []),
        ...(techData.primaryLanguages || []),
        ...(techData.stacks || []),
      ]),
    ]
      .filter(Boolean)
      .join(', ');
    spinner.succeed(`Detected technologies: ${techSummary || 'N/A'}`);

    spinner.text = 'Detecting code patterns...';
    const patternDetector = new PatternDetector({
      verbose: options.verbose,
      sampleSize: options.deep ? 100 : 50,
    });
    const patterns = await patternDetector.detectPatterns(projectData, techData);
    spinner.succeed('Code patterns detected.');

    spinner.text = 'Generating AI rules...';
    const ruleGenerator = new RuleGenerator(outputPath, options.template, options.overwrite);
    const context = {
      technologies: techData,
      patterns,
      projectName: path.basename(projectPath),
      fileList: files.map(f => path.relative(projectPath, f.path)),
      version: getVersion(),
    };
    const generatedFiles = await ruleGenerator.generateRules(context);
    spinner.succeed('AI rules generated successfully.');

    spinner.text = 'Validating generated rules...';
    const validator = new RuleValidator({ verbose: options.verbose });
    await validator.validateRuleDirectory(outputPath);
    spinner.succeed('All generated rules are valid.');

    let initializedIDEs = [];
    let ideIntegration = null;

    if (options.ideIntegration) {
      spinner.text = 'Setting up IDE integration...';
      try {
        ideIntegration = new IDEIntegrationManager({
          watchMode: options.watch,
          verbose: options.verbose,
        });
        initializedIDEs = await ideIntegration.initialize(projectPath);
        spinner.succeed('IDE integration setup complete.');
      } catch (error) {
        spinner.fail(`IDE integration setup failed: ${error.message}`);
        if (options.verbose) {
          console.error(chalk.red(error.stack));
        }
      }
    }

    console.log('\n' + chalk.green('✅ Project scanning completed successfully!'));
    console.log(chalk.green('Generated rule files:'));
    if (generatedFiles && Array.isArray(generatedFiles)) {
      generatedFiles.forEach(file => {
        console.log(chalk.green(`- ${file}`));
      });
    } else {
      console.log(chalk.green(`- Rules saved to ${outputPath}`));
    }

    console.log('\n' + chalk.cyan('Next steps:'));
    console.log(chalk.cyan('1. Review the generated rules in your editor'));
    console.log(chalk.cyan('2. Customize any specific details as needed'));
    console.log(chalk.cyan('3. Activate the rules in your AI assistant\n'));

    return {
      projectName: path.basename(projectPath),
      initializedIDEs,
      generatedFiles,
      ideIntegration,
    };

  } catch (error) {
    spinner.fail(chalk.red(`An error occurred during scanning: ${error.message}`));
    if (options.verbose && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    // Re-throw the error so the caller (cli.js) can handle it
    throw error;
  }
}
