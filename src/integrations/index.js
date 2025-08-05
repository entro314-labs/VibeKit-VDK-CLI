/**
 * VDK Integrations Module
 * ----------------------
 * Central export point for all VDK integrations.
 * Provides a clean interface for importing integration components.
 */

// Core integration infrastructure
export { BaseIntegration } from './base-integration.js';
export { IntegrationManager } from './integration-manager.js';

// Specific integrations
export { ClaudeCodeIntegration } from './claude-code-integration.js';
export { GenericIDEIntegration } from './generic-ide-integration.js';
export { CursorIntegration } from './cursor-integration.js';
export { WindsurfIntegration } from './windsurf-integration.js';
export { GitHubCopilotIntegration } from './github-copilot-integration.js';

// Import for internal use
import { IntegrationManager } from './integration-manager.js';
import { ClaudeCodeIntegration } from './claude-code-integration.js';
import { GenericIDEIntegration } from './generic-ide-integration.js';
import { CursorIntegration } from './cursor-integration.js';
import { WindsurfIntegration } from './windsurf-integration.js';
import { GitHubCopilotIntegration } from './github-copilot-integration.js';

// Helper function to create a pre-configured integration manager
export function createIntegrationManager(projectPath = process.cwd()) {
  const manager = new IntegrationManager(projectPath);
  
  // Auto-register all available integrations
  manager.register(new ClaudeCodeIntegration(projectPath));
  manager.register(new CursorIntegration(projectPath));
  manager.register(new WindsurfIntegration(projectPath));
  manager.register(new GitHubCopilotIntegration(projectPath));
  manager.register(new GenericIDEIntegration(projectPath));
  
  return manager;
}

