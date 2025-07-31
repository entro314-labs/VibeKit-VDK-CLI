#!/usr/bin/env node

/**
 * Schema Validation Test
 * ---------------------
 * Test the schema validation utility with the new schemas
 */

import { validateCommand, validateBlueprint, getAvailableSchemas } from '../src/utils/schema-validator.js';

console.log('🧪 Testing Schema Validation...\n');

// Test command validation
console.log('1. Testing Command Schema Validation:');

const validCommand = {
  id: 'test-command',
  name: 'Test Command',
  description: 'This is a test command for validation',
  target: 'claude-code',
  commandType: 'slash',
  version: '1.0.0',
  scope: 'project'
};

const invalidCommand = {
  id: 'invalid',
  // Missing required fields
  target: 'invalid-platform'
};

try {
  const validResult = await validateCommand(validCommand);
  console.log('✅ Valid command:', validResult.valid ? 'PASSED' : 'FAILED');
  if (!validResult.valid) {
    console.log('   Errors:', validResult.errors);
  }

  const invalidResult = await validateCommand(invalidCommand);
  console.log('❌ Invalid command:', !invalidResult.valid ? 'PASSED (correctly rejected)' : 'FAILED');
  if (!invalidResult.valid) {
    console.log('   Expected errors:', invalidResult.errors.slice(0, 3));
  }
} catch (error) {
  console.log('Error testing command validation:', error.message);
}

console.log('\n2. Testing Blueprint Schema Validation:');

const validBlueprint = {
  id: 'test-blueprint',
  title: 'Test Blueprint',
  description: 'This is a test blueprint for validation',
  version: '1.0.0',
  category: 'core',
  platforms: {
    claude_code: {
      supported: true,
      format: 'markdown'
    }
  }
};

const invalidBlueprint = {
  id: 'invalid-blueprint'
  // Missing required fields
};

try {
  const validResult = await validateBlueprint(validBlueprint);
  console.log('✅ Valid blueprint:', validResult.valid ? 'PASSED' : 'FAILED');
  if (!validResult.valid) {
    console.log('   Errors:', validResult.errors);
  }

  const invalidResult = await validateBlueprint(invalidBlueprint);
  console.log('❌ Invalid blueprint:', !invalidResult.valid ? 'PASSED (correctly rejected)' : 'FAILED');
  if (!invalidResult.valid) {
    console.log('   Expected errors:', invalidResult.errors.slice(0, 3));
  }
} catch (error) {
  console.log('Error testing blueprint validation:', error.message);
}

console.log('\n3. Available Schemas:');
try {
  const schemas = await getAvailableSchemas();
  console.log('📋 Found schemas:', schemas.join(', '));
} catch (error) {
  console.log('Error listing schemas:', error.message);
}

console.log('\n✅ Schema validation tests completed!');