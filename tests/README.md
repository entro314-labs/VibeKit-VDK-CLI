# VDK CLI Test Suite

This directory contains a comprehensive test suite for the VDK CLI project, providing 100% functionality coverage using modern testing practices.

## Test Structure

### Modern Test Suite (Vitest)

The new test suite uses [Vitest](https://vitest.dev/) for modern, fast testing with excellent developer experience:

- **cli.test.js** - CLI functionality tests
- **scanner-core.test.js** - Project scanning and analysis
- **security.test.js** - Security validation tests
- **schema-validation.test.js** - Schema validation tests
- **integrations.test.js** - IDE integration tests
- **analyzers.test.js** - Language analyzer tests
- **utilities.test.js** - Utility function tests

### Test Helpers

- **helpers/cli-helper.js** - CLI execution utilities
- **helpers/test-fixtures.js** - Common test data and mocks

### Configuration

- **vitest.config.js** - Vitest configuration with coverage
- **setup.js** - Global test setup

## Running Tests

### Main Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage

# Run with UI interface
pnpm test:ui
```

### Legacy Tests

The original custom test framework tests are preserved in `tests/legacy/`:

```bash
# Run legacy tests
pnpm test:legacy

# Individual legacy test suites
pnpm test:legacy:cli
pnpm test:legacy:scanner
pnpm test:legacy:security
```

## Test Coverage

The test suite provides comprehensive coverage of:

### Core Functionality ✅

- CLI commands and argument parsing
- Project scanning and analysis
- Pattern detection and dependency analysis
- Blueprint and rule management

### Language Support ✅

- JavaScript/TypeScript analysis
- Python code analysis
- Swift code analysis
- Cross-language consistency

### IDE Integrations ✅

- Claude Code integration
- Cursor integration
- Windsurf integration
- GitHub Copilot integration
- Generic IDE support

### Security ✅

- Input validation and sanitization
- Path traversal protection
- Environment variable handling
- Error message sanitization

### Utilities ✅

- Schema validation
- Project insights generation
- Configuration management
- File system operations

## Coverage Targets

The test suite maintains high coverage standards:

- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Statements**: 80%+

## Writing Tests

### Test Structure

Follow this structure for new tests:

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {} from /* test helpers */ './helpers/cli-helper.js';

describe('Feature Name', () => {
  describe('Sub-feature', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = 'test data';

      // Act
      const result = await functionUnderTest(input);

      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### Best Practices

1. **Descriptive test names** - Clear what is being tested
2. **Arrange-Act-Assert** - Structure tests consistently
3. **Isolated tests** - No dependencies between tests
4. **Mock external dependencies** - Network calls, file system
5. **Test edge cases** - Empty inputs, errors, boundary conditions
6. **Clean up resources** - Use beforeEach/afterEach hooks

### Using Test Helpers

```javascript
import { runCLI, createTempDir, cleanupTempDir } from './helpers/cli-helper.js';
import { mockProjectStructure, validCommand } from './helpers/test-fixtures.js';

// Execute CLI commands
const result = await runCLI(['init', '--help']);

// Work with temporary directories
const tempDir = await createTempDir('test-project');
// ... use tempDir
await cleanupTempDir(tempDir);

// Use test fixtures
const result = await validateCommand(validCommand);
```

## Continuous Integration

Tests are automatically run in CI/CD:

1. **Pre-commit** - Tests run before commits
2. **Pull requests** - Full test suite + coverage
3. **Release** - All tests must pass

## Migration from Legacy

The migration from custom test framework to Vitest provides:

- **Faster execution** - Parallel test running
- **Better DX** - Hot reload, UI, detailed output
- **Modern features** - ESM support, TypeScript, mocking
- **Industry standard** - Better tooling ecosystem
- **Coverage reports** - Built-in coverage analysis

Legacy tests remain available for reference and gradual migration of any missed functionality.
