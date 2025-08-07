/**
 * CLI Tests - Consolidated CLI functionality tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { runCLI, createTempDir, cleanupTempDir } from './helpers/cli-helper.js';

describe('CLI Functionality', () => {
  let tempDir;

  afterEach(async () => {
    if (tempDir) {
      await cleanupTempDir(tempDir);
      tempDir = null;
    }
  });

  describe('Basic Commands', () => {
    it('should display help information', async () => {
      const result = await runCLI(['--help']);

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('VDK CLI');
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('Commands:');
      expect(result.stdout).toContain('init');
      expect(result.stdout).toContain('Options:');
    });

    it('should display version information', async () => {
      const result = await runCLI(['--version']);
      
      expect(result.success).toBe(true);
      expect(result.stdout.trim().length).toBeGreaterThan(0);

      // Check version matches package.json
      const packageJson = JSON.parse(
        await fs.readFile(path.join(global.TEST_ROOT, 'package.json'), 'utf8')
      );
      expect(result.stdout).toContain(packageJson.version);
    });

    it('should show init command help', async () => {
      const result = await runCLI(['init', '--help']);

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('init');
      expect(result.stdout).toContain('project');
      expect(result.stdout).toContain('Options:');
    });

    it('should execute status command', async () => {
      const result = await runCLI(['status']);

      expect(result.code).toBeDefined();
      expect(result.stdout.length + result.stderr.length).toBeGreaterThan(0);
    });

    it('should execute integrations command', async () => {
      const result = await runCLI(['integrations']);

      expect(result.code).toBeDefined();
      expect(result.stdout.length + result.stderr.length).toBeGreaterThan(0);
    });

    it('should handle invalid commands gracefully', async () => {
      const result = await runCLI(['nonexistent-command']);

      expect(result.success).toBe(false);
      expect(result.stderr + result.stdout).toMatch(/error/i);
    });
  });

  describe('Advanced Commands', () => {
    it('should handle init command with project path', async () => {
      tempDir = await createTempDir('test-init-project');

      const result = await runCLI(['init', '--projectPath', tempDir], { 
        timeout: 45000 
      });

      expect(result.code).toBeDefined();
      
      if (result.success) {
        expect(result.stdout).toMatch(/(✅|completed)/);
      } else {
        expect(result.stderr.length + result.stdout.length).toBeGreaterThan(0);
      }
    });

    it('should have deploy command available', async () => {
      const result = await runCLI(['deploy', '--help']);

      expect(
        result.success || result.stdout.includes('deploy')
      ).toBe(true);
    });

    it('should have update command available', async () => {
      const result = await runCLI(['update', '--help']);

      expect(
        result.success || result.stdout.includes('update')
      ).toBe(true);
    });

    it('should have claude-code command available', async () => {
      const result = await runCLI(['claude-code', '--help']);

      expect(
        result.success || result.stdout.includes('claude-code')
      ).toBe(true);
    });
  });

  describe('Performance & Format', () => {
    it('should complete commands within reasonable time', async () => {
      const startTime = Date.now();
      const result = await runCLI(['--help']);
      const duration = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(5000);
    });

    it('should have consistent output formatting', async () => {
      const result = await runCLI(['--help']);

      expect(result.success).toBe(true);

      const lines = result.stdout.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);

      expect(nonEmptyLines.length).toBeGreaterThan(5);

      const hasUsageLine = lines.some(line => line.includes('Usage:'));
      const hasCommandsSection = lines.some(line => line.includes('Commands:'));

      expect(hasUsageLine).toBe(true);
      expect(hasCommandsSection).toBe(true);
    });
  });
});