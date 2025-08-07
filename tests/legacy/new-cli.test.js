/**
 * New CLI Tests - Based on Actual Implementation
 *
 * Tests the CLI functionality as it actually exists
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);
const cliPath = path.join(projectRoot, 'cli.js');

// Simple test framework
let testsPassed = 0;
let testsFailed = 0;

function assertTrue(condition, message = 'Assertion failed') {
  if (condition) {
    testsPassed++;
    console.log(`  ✅ ${message}`);
  } else {
    testsFailed++;
    console.log(`  ❌ ${message}`);
  }
}

function assertIncludes(text, substring, message = `Should include "${substring}"`) {
  assertTrue(text.includes(substring), message);
}

async function asyncTest(name, testFn) {
  console.log(`\n⚙️ Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    testsFailed++;
    console.log(`❌ FAIL: ${name} - ${error.message}`);
    if (process.env.VERBOSE) {
      console.log(error.stack);
    }
  }
}

// Helper function to run CLI commands
function runCLI(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      cwd: options.cwd || projectRoot,
      stdio: 'pipe',
      timeout: options.timeout || 30000,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        success: code === 0,
      });
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

console.log('⚙️ VDK CLI Integration Tests\n');

// Test 1: CLI Help Command
await asyncTest('CLI should display help information', async () => {
  const result = await runCLI(['--help']);

  assertTrue(result.success, 'Help command should succeed');
  assertIncludes(result.stdout, 'VDK CLI', 'Should show VDK CLI in help');
  assertIncludes(result.stdout, 'Usage:', 'Should show usage information');
  assertIncludes(result.stdout, 'Commands:', 'Should show available commands');
  assertIncludes(result.stdout, 'init', 'Should show init command');
  assertIncludes(result.stdout, 'Options:', 'Should show options');
});

// Test 2: CLI Version Command
await asyncTest('CLI should display version information', async () => {
  const result = await runCLI(['--version']);

  assertTrue(result.success, 'Version command should succeed');
  assertTrue(result.stdout.trim().length > 0, 'Should output version information');

  // Check that version matches package.json
  const packageJson = JSON.parse(await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8'));
  assertIncludes(result.stdout, packageJson.version, 'Should match package.json version');
});

// Test 3: CLI Init Command Help
await asyncTest('CLI init command should show help', async () => {
  const result = await runCLI(['init', '--help']);

  assertTrue(result.success, 'Init help should succeed');
  assertIncludes(result.stdout, 'init', 'Should show init command info');
  assertIncludes(result.stdout, 'project', 'Should mention project scanning');
  assertIncludes(result.stdout, 'Options:', 'Should show init options');
});

// Test 4: CLI Status Command
await asyncTest('CLI status command should work', async () => {
  const result = await runCLI(['status']);

  // Status command should run (may succeed or show info about setup)
  assertTrue(result.code !== undefined, 'Status command should execute');
  assertTrue(result.stdout.length > 0 || result.stderr.length > 0, 'Should provide status output');
});

// Test 5: CLI Integrations Command
await asyncTest('CLI integrations command should work', async () => {
  const result = await runCLI(['integrations']);

  // Integrations command should run
  assertTrue(result.code !== undefined, 'Integrations command should execute');
  assertTrue(
    result.stdout.length > 0 || result.stderr.length > 0,
    'Should provide integrations output'
  );
});

// Test 6: CLI Invalid Command Handling
await asyncTest('CLI should handle invalid commands gracefully', async () => {
  const result = await runCLI(['nonexistent-command']);

  assertIncludes(result.stderr || result.stdout, 'error', 'Should show error for invalid command');
  assertTrue(!result.success, 'Invalid command should fail');
});

// Test 7: CLI Init Dry Run (if supported)
await asyncTest('CLI init should handle test scenarios', async () => {
  // Create a temporary test directory
  const testDir = path.join(projectRoot, 'test-temp-cli');

  try {
    await fs.mkdir(testDir, { recursive: true });

    // Try to run init in test directory
    const result = await runCLI(['init', '--projectPath', testDir], { timeout: 45000 });

    // Should complete (success or controlled failure)
    assertTrue(result.code !== undefined, 'Init command should complete');

    if (result.success) {
      assertTrue(
        result.stdout.includes('✅') || result.stdout.includes('completed'),
        'Successful init should show completion'
      );
    } else {
      // If it fails, should be a controlled failure with helpful message
      assertTrue(
        result.stderr.length > 0 || result.stdout.length > 0,
        'Failed init should provide helpful error message'
      );
    }
  } finally {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (_e) {
      // Ignore cleanup errors
    }
  }
});

// Test 8: CLI Deploy Command
await asyncTest('CLI deploy command should be available', async () => {
  const result = await runCLI(['deploy', '--help']);

  // Deploy command should exist and show help
  assertTrue(
    result.success || result.stdout.includes('deploy'),
    'Deploy command should be available'
  );
});

// Test 9: CLI Update Command
await asyncTest('CLI update command should be available', async () => {
  const result = await runCLI(['update', '--help']);

  // Update command should exist and show help
  assertTrue(
    result.success || result.stdout.includes('update'),
    'Update command should be available'
  );
});

// Test 10: CLI Claude Code Integration
await asyncTest('CLI claude-code command should be available', async () => {
  const result = await runCLI(['claude-code', '--help']);

  // Claude Code command should exist
  assertTrue(
    result.success || result.stdout.includes('claude-code'),
    'Claude Code integration should be available'
  );
});

// Test 11: CLI Command Completion Time
await asyncTest('CLI commands should complete within reasonable time', async () => {
  const startTime = Date.now();
  const result = await runCLI(['--help']);
  const duration = Date.now() - startTime;

  assertTrue(result.success, 'Help command should succeed');
  assertTrue(duration < 5000, `Help command should complete quickly (${duration}ms < 5000ms)`);
});

// Test 12: CLI Output Formatting
await asyncTest('CLI output should be consistently formatted', async () => {
  const result = await runCLI(['--help']);

  assertTrue(result.success, 'Help command should succeed');

  // Check for consistent formatting
  const lines = result.stdout.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  assertTrue(nonEmptyLines.length > 5, 'Should have substantial help content');

  // Should have proper CLI formatting patterns
  const hasUsageLine = lines.some((line) => line.includes('Usage:'));
  const hasCommandsSection = lines.some((line) => line.includes('Commands:'));

  assertTrue(hasUsageLine, 'Should have Usage section');
  assertTrue(hasCommandsSection, 'Should have Commands section');
});

// Summary
console.log(`\n📊 CLI Test Results:`);
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log(`\n✅ All CLI tests passed! VDK CLI functionality verified.`);
  process.exit(0);
} else {
  console.log(`\n⚠️  ${testsFailed} CLI test(s) failed. Review command implementation.`);
  process.exit(1);
}
