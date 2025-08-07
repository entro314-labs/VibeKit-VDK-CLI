/**
 * New Scanner Core Tests - Based on Actual Implementation
 *
 * These tests are designed to work with the actual codebase structure
 * rather than trying to fit mismatched expectations.
 */

// fs is imported but not directly used - it's used in async imports
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

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

function assertExists(value, message = 'Value should exist') {
  assertTrue(value !== null && value !== undefined, message);
}

function assertArray(value, message = 'Should be array') {
  assertTrue(Array.isArray(value), message);
}

function assertObject(value, message = 'Should be object') {
  assertTrue(typeof value === 'object' && value !== null, message);
}

async function asyncTest(name, testFn) {
  console.log(`\n🧪 Testing: ${name}`);
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

// Test with a real project - use the VDK project itself
const testProjectPath = projectRoot;

console.log('🚀 VDK CLI New Scanner Core Tests\n');

// Test 1: ProjectScanner Basic Functionality
await asyncTest('ProjectScanner.scanProject should return expected structure', async () => {
  const { ProjectScanner } = await import('../src/scanner/core/ProjectScanner.js');

  const scanner = new ProjectScanner();
  const results = await scanner.scanProject(testProjectPath);

  assertExists(results, 'Scanner should return results');
  assertExists(results.projectPath, 'Results should include projectPath');
  assertExists(results.projectName, 'Results should include projectName');
  assertArray(results.files, 'Results should include files array');
  assertArray(results.directories, 'Results should include directories array');
  assertObject(results.fileTypes, 'Results should include fileTypes object');
  assertArray(results.fileExtensions, 'Results should include fileExtensions array');
  assertObject(results.directoryStructure, 'Results should include directoryStructure');

  // Check that we found some files
  assertTrue(results.files.length > 0, 'Should detect files in project');
  assertTrue(results.directories.length > 0, 'Should detect directories in project');

  // Check file structure
  if (results.files.length > 0) {
    const firstFile = results.files[0];
    assertExists(firstFile.path, 'Files should have path');
    assertExists(firstFile.name, 'Files should have name');
    assertExists(firstFile.type, 'Files should have type');
  }
});

// Test 2: PatternDetector Basic Functionality
await asyncTest('PatternDetector.detectPatterns should analyze patterns', async () => {
  const { PatternDetector } = await import('../src/scanner/core/PatternDetector.js');
  const { ProjectScanner } = await import('../src/scanner/core/ProjectScanner.js');

  // First get project structure
  const scanner = new ProjectScanner();
  const projectStructure = await scanner.scanProject(testProjectPath);

  // Then detect patterns
  const detector = new PatternDetector();
  const patterns = await detector.detectPatterns(projectStructure);

  assertExists(patterns, 'Should return pattern analysis');
  assertObject(patterns.namingConventions, 'Should include naming conventions');
  assertArray(patterns.architecturalPatterns, 'Should include architectural patterns');
  assertArray(patterns.codePatterns, 'Should include code patterns');
  assertObject(patterns.consistencyMetrics, 'Should include consistency metrics');

  // Check naming conventions structure
  assertObject(patterns.namingConventions.files, 'Should analyze file naming');
  assertObject(patterns.namingConventions.directories, 'Should analyze directory naming');
});

// Test 3: DependencyAnalyzer Basic Functionality
await asyncTest(
  'DependencyAnalyzer.analyzeDependencies should build dependency graph',
  async () => {
    const { DependencyAnalyzer } = await import('../src/scanner/core/DependencyAnalyzer.js');
    const { ProjectScanner } = await import('../src/scanner/core/ProjectScanner.js');

    // First get project structure
    const scanner = new ProjectScanner();
    const projectStructure = await scanner.scanProject(testProjectPath);

    // Then analyze dependencies
    const analyzer = new DependencyAnalyzer();
    const analysis = await analyzer.analyzeDependencies(projectStructure);

    assertExists(analysis, 'Should return dependency analysis');
    assertExists(analysis.dependencyGraph, 'Should include dependency graph');
    assertExists(analysis.inverseGraph, 'Should include inverse graph');
    assertTrue(typeof analysis.moduleCount === 'number', 'Should include module count');
    assertTrue(typeof analysis.edgeCount === 'number', 'Should include edge count');
    assertArray(analysis.centralModules, 'Should include central modules');
    assertArray(analysis.layeredStructure, 'Should include layered structure');
    assertTrue(typeof analysis.cyclesDetected === 'boolean', 'Should include cycles detection');
    assertArray(analysis.architecturalHints, 'Should include architectural hints');
  }
);

// Test 4: Hub Client Basic Functionality
await asyncTest('Hub client functions should be available', async () => {
  const { fetchRuleList, downloadRule } = await import('../src/blueprints-client.js');

  assertTrue(typeof fetchRuleList === 'function', 'fetchRuleList should be a function');
  assertTrue(typeof downloadRule === 'function', 'downloadRule should be a function');

  // Note: We won't test actual network calls in unit tests
  // but we can verify the functions exist and are callable
});

// Test 5: Integration Test - Full Pipeline
await asyncTest('Full scanner pipeline should work end-to-end', async () => {
  const { ProjectScanner } = await import('../src/scanner/core/ProjectScanner.js');
  const { PatternDetector } = await import('../src/scanner/core/PatternDetector.js');
  const { DependencyAnalyzer } = await import('../src/scanner/core/DependencyAnalyzer.js');

  // Step 1: Scan project
  const scanner = new ProjectScanner({ verbose: false });
  const projectStructure = await scanner.scanProject(testProjectPath);

  // Step 2: Detect patterns
  const detector = new PatternDetector({ verbose: false });
  const patterns = await detector.detectPatterns(projectStructure);

  // Step 3: Analyze dependencies
  const analyzer = new DependencyAnalyzer({ verbose: false });
  const dependencies = await analyzer.analyzeDependencies(projectStructure);

  // Verify all components worked
  assertTrue(projectStructure.files.length > 0, 'Project scan found files');
  assertTrue(
    Object.keys(patterns.namingConventions).length > 0,
    'Pattern detection found conventions'
  );
  assertTrue(dependencies.moduleCount >= 0, 'Dependency analysis completed');

  console.log(
    `  📊 Scanned ${projectStructure.files.length} files in ${projectStructure.directories.length} directories`
  );
  console.log(`  📊 Found ${patterns.architecturalPatterns.length} architectural patterns`);
  console.log(
    `  📊 Analyzed ${dependencies.moduleCount} modules with ${dependencies.edgeCount} dependencies`
  );
});

// Summary
console.log(`\n📊 Test Results:`);
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log(`\n✅ All tests passed! VDK CLI scanner functionality verified.`);
  process.exit(0);
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed. Review implementation.`);
  process.exit(1);
}
