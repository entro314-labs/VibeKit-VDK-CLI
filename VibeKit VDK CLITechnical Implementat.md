# VibeKit VDK CLI: Technical Implementation Guide

## What This Project Actually Does

VibeKit VDK CLI is a sophisticated code analysis tool that scans software projects to automatically generate AI assistant rules. It analyzes your codebase's structure, patterns, and technologies to create customized `.mdc` (Markdown with YAML frontmatter) rule files that make AI coding assistants understand your project like a senior developer.

## Core Architecture & Data Flow

### 1. Main Entry Point (`cli.js`)

The CLI uses `commander.js` with four primary commands:

```javascript
// Main scanning command
.command('init')
.action(async (options) => {
  const results = await runScanner(options);
  // Creates vdk.config.json with project metadata
})

// Hub synchronization  
.command('update') 
// Status checking
.command('status')
// Future deployment (placeholder)
.command('deploy')
```

### 2. Scanner Engine (`src/scanner/engine.js`)

The core orchestration happens in `runScanner()`:

```javascript
export async function runScanner(options) {
  // 1. Parse .gitignore for ignore patterns
  const gitignorePatterns = await parser.parse();
  
  // 2. Scan project structure
  const projectData = await scanner.scanProject(projectPath);
  
  // 3. Analyze technology stack
  const techData = await techAnalyzer.analyzeTechnologies(projectData);
  
  // 4. Detect code patterns and architecture
  const patterns = await patternDetector.detectPatterns(projectData, techData);
  
  // 5. Generate rule files using templates
  const generatedFiles = await ruleGenerator.generateRules(context);
  
  // 6. Validate generated rules
  await validator.validateRuleDirectory(outputPath);
  
  // 7. Set up IDE integration
  await ideIntegration.initialize(projectPath);
}
```

## Core Components Deep Dive

### ProjectScanner (`src/scanner/core/ProjectScanner.js`)

**Purpose**: Traverses and catalogs the entire project structure

**Key Implementation**:
```javascript
async scanProject(projectPath, options = {}) {
  // Use glob to find all files respecting .gitignore
  const allFiles = await glob('**/*', {
    cwd: this.projectPath,
    ignore: this.ignorePatterns,
    absolute: true
  });
  
  // Categorize each file
  const fileInfo = {
    path: filePath,
    name: path.basename(filePath),
    extension: path.extname(filePath).substring(1),
    type: this.determineFileType(filePath), // 'javascript', 'stylesheet', 'config', etc.
    size: stats.size
  };
}
```

**File Type Detection Logic**:
```javascript
determineFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath).toLowerCase();
  
  // Configuration files
  if (['package.json', 'tsconfig.json', 'webpack.config.js'].includes(fileName)) {
    return 'configuration';
  }
  
  // Language detection by extension
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) return 'javascript';
  if (['.py'].includes(ext)) return 'python';
  // ... more mappings
}
```

### TechnologyAnalyzer (`src/scanner/core/TechnologyAnalyzer.js`)

**Purpose**: Identifies frameworks, libraries, and technology stacks

**Implementation Strategy**:

1. **Language Detection by File Extensions**:
```javascript
identifyPrimaryLanguages(projectStructure) {
  const extensionCount = new Map();
  projectStructure.files.forEach(file => {
    const ext = path.extname(file.path).slice(1).toLowerCase();
    extensionCount.set(ext, (extensionCount.get(ext) || 0) + 1);
  });
  
  // Convert to percentages and filter significant languages
  const languagePercentage = new Map();
  for (const [ext, count] of extensionCount.entries()) {
    const language = EXTENSION_TO_LANGUAGE[ext];
    if (language) {
      languagePercentage.set(language, (count / totalFiles) * 100);
    }
  }
}
```

2. **Package Analysis** (Enhanced with `PackageAnalyzer`):
```javascript
static detectTechnologies(dependencies) {
  const result = { frameworks: [], libraries: [], buildTools: [] };
  const depNames = Object.keys(dependencies);
  
  // Technology mapping system
  for (const [category, techMap] of Object.entries(TECH_MAPPINGS)) {
    depNames.forEach(dep => {
      if (techMap[dep]) {
        result[category].push(techMap[dep]);
      }
    });
  }
  return result;
}
```

3. **Framework-Specific Detection**:
```javascript
// Next.js detection example
const nextjsConfigFiles = projectStructure.files
  .filter(file => file.name === 'next.config.js');
  
const hasAppDir = projectStructure.directories.some(dir =>
  dir.name === 'app' && dir.path.includes('/src/app'));
  
const hasNextDependency = this.libraries.includes('next');

if (nextjsConfigFiles.length > 0 || hasNextDependency) {
  if (!this.frameworks.includes('Next.js')) {
    this.frameworks.push('Next.js');
  }
}
```

### PatternDetector (`src/scanner/core/PatternDetector.js`)

**Purpose**: Analyzes code patterns, naming conventions, and architectural structures

**Key Mechanisms**:

1. **File & Directory Naming Analysis**:
```javascript
analyzeNamingConvention(name, category) {
  const stats = this.namingConventions[category];
  
  if (/^[a-z][a-zA-Z0-9]*$/.test(name) && /[A-Z]/.test(name)) {
    stats.patterns.camelCase++;
  } else if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    stats.patterns.PascalCase++;
  } else if (/^[a-z0-9_]+$/.test(name) && name.includes('_')) {
    stats.patterns.snake_case++;
  }
  // ... more pattern detection
}
```

2. **Architectural Pattern Detection**:
```javascript
detectMVCPattern(projectStructure) {
  const dirNames = projectStructure.directories.map(d => d.name.toLowerCase());
  let score = 0;
  
  if (dirNames.includes('models') || dirNames.includes('model')) score += 30;
  if (dirNames.includes('views') || dirNames.includes('view')) score += 30;
  if (dirNames.includes('controllers') || dirNames.includes('controller')) score += 30;
  
  // File-based pattern detection
  const fileBasenames = projectStructure.files.map(f => 
    path.basename(f.name, path.extname(f.name)).toLowerCase());
  const modelFiles = fileBasenames.filter(name => name.endsWith('model'));
  
  return Math.min(score, 100);
}
```

3. **Code Analysis with Language-Specific Analyzers**:
```javascript
async analyzeCodeSamples(projectStructure) {
  // Group files by type for targeted analysis
  const filesByType = {};
  projectStructure.files.forEach(file => {
    const type = file.type;
    if (!filesByType[type]) filesByType[type] = [];
    filesByType[type].push(file);
  });
  
  // Apply appropriate analyzer for each file type
  for (const [type, files] of Object.entries(filesByType)) {
    const analyzer = this.getAnalyzerForType(type, analyzers);
    if (analyzer) {
      await this.analyzeFilesWithAnalyzer(files, analyzer);
    }
  }
}
```

### Language-Specific Analyzers

#### JavaScript/TypeScript Analyzer (`src/scanner/analyzers/javascript.js`)

**Uses AST parsing with Acorn**:
```javascript
export async function analyzeJavaScript(content, filePath) {
  const ast = acorn.parse(content, {
    ecmaVersion: 2022,
    sourceType: 'module'
  });
  
  visitNodes(ast, {
    VariableDeclarator(node) {
      analysis.variables.push(node.id.name);
      
      // React component detection
      if (node.id.name[0] === node.id.name[0].toUpperCase() &&
          isReactFunctionComponent(node.init)) {
        analysis.components.push(node.id.name);
        analysis.patterns.push('React Component');
      }
    },
    
    ImportDeclaration(node) {
      const importPath = node.source.value;
      if (importPath.startsWith('react')) {
        analysis.patterns.push('React');
      }
      // ... more framework detection
    }
  });
}
```

#### Python Analyzer (`src/scanner/analyzers/python.js`)

**Uses regex-based parsing**:
```javascript
export async function analyzePython(content, filePath) {
  const functionPattern = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  const classPattern = /class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[:\(]/g;
  
  // Extract functions and classes
  while ((match = functionPattern.exec(content)) !== null) {
    analysis.functions.push(match[1]);
  }
  
  // Framework detection
  if (content.includes('from django') || content.includes('import django')) {
    analysis.patterns.push('Django');
  }
  if (content.includes('from flask import') || content.includes('Flask(__name__)')) {
    analysis.patterns.push('Flask');
  }
}
```

### RuleGenerator (`src/scanner/core/RuleGenerator.js`)

**Purpose**: Creates customized .mdc rule files using Handlebars templates

**Template System**:
```javascript
async generateRules(analysisData) {
  await this.generateCoreRules(analysisData);
  await this.generateProjectContextRule(analysisData);
  await this.generateCommonErrorsRule(analysisData);
  await this.generateMcpConfigRule(analysisData);
  await this.generateLanguageRules(analysisData);
  await this.generateFrameworkRules(analysisData);
}
```

**Template Processing**:
```javascript
async generateProjectContextRule(analysisData) {
  const templatePath = path.join(this.templatesDir, TEMPLATES.PROJECT_CONTEXT);
  const templateContent = await fs.readFile(templatePath, 'utf8');
  const template = Handlebars.compile(templateContent);
  
  const templateData = {
    projectName: path.basename(analysisData.projectStructure.root),
    primaryLanguages: analysisData.techStack.primaryLanguages,
    frameworks: analysisData.techStack.frameworks,
    namingConventions: analysisData.patterns.namingConventions,
    date: new Date().toISOString().split('T')[0]
  };
  
  const ruleContent = template(templateData);
  await fs.writeFile(projectContextPath, ruleContent, 'utf8');
}
```

### IDE Integration (`src/scanner/integrations/ide-integration.js`)

**Purpose**: Automatically configures AI assistants and IDEs

**IDE Detection & Configuration**:
```javascript
async detectIDEs(projectPath) {
  const detectedConfigs = detectIDEConfigs(projectPath);
  return detectedConfigs
    .filter(config => this.options.supportedIDEs.includes(config.id))
    .map(config => config.id);
}

async initializeIntegration(ideId, projectPath) {
  const paths = getIDEConfigPaths(ideId, projectPath);
  
  this.integrations[ideId] = {
    id: ideId,
    name: ideConfig.name,
    configPath: paths.configPath,
    rulePath: paths.rulePath,
    handlers: this.getHandlers(ideId)
  };
  
  // Create rule directory if it doesn't exist
  if (!fs.existsSync(rulePath)) {
    fs.mkdirSync(rulePath, { recursive: true });
  }
  
  // Set up file watchers for real-time updates
  await this.startWatcher(ideId, projectPath);
}
```

**Supported IDE Configurations**:
```javascript
const IDE_CONFIGURATIONS = [
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    configFolder: '.vscode',
    rulesFolder: '.ai/rules',
    mcpConfigFile: 'mcp.json'
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    configFolder: '.cursor',
    rulesFolder: '.ai/rules', 
    mcpConfigFile: 'mcp.json'
  }
  // ... more IDE configs
];
```

## Template System Architecture

### Template Structure
The system uses Handlebars templates with YAML frontmatter:

```handlebars
---
description: "{{description}}"
globs: ["{{globs}}"]
version: "{{version}}"
---

# {{title}}

{{#if complexity.level}}
{{#eq complexity.level "high"}}
This is a high-complexity {{framework}} project requiring careful attention to:
- Performance optimization
- Scalability patterns  
- Advanced architecture
{{/eq}}
{{/if}}

## Naming Conventions
{{#with namingConventions}}
{{#if variables.dominant}}
- **Variables**: Use {{variables.dominant}} naming
{{/if}}
{{/with}}
```

### Template Categories

1. **Core Templates** (`templates/`):
   - `core-agent.hbs` - AI behavior guidelines
   - `project-context.hbs` - Project-specific context
   - `common-errors.hbs` - Anti-patterns to avoid
   - `mcp-configuration.hbs` - MCP server settings

2. **Framework Templates** (`templates/frameworks/`):
   - `React-Modern.mdc.hbs`
   - `Angular-Modern.mdc.hbs` 
   - `Django-Modern.mdc.hbs`
   - `NextJS.mdc.hbs`

3. **Language Templates** (`templates/languages/`):
   - `TypeScript-Modern.mdc.hbs`

4. **Pattern Templates** (`templates/patterns/`):
   - `MVC.hbs`
   - `MVVM.hbs`
   - `Microservices.hbs`

## Generated Output Structure

After running `vdk init`, the tool generates:

```
project/
├── .ai/rules/
│   ├── 00-core-agent.mdc
│   ├── 01-project-context.mdc  
│   ├── 02-common-errors.mdc
│   ├── 03-mcp-configuration.mdc
│   ├── languages/
│   │   └── TypeScript-Modern.mdc
│   └── technologies/
│       └── React-Modern.mdc
└── vdk.config.json
```

## Hub Integration & Synchronization

### GitHub API Client (`src/hub-client.js`)

**Rule Fetching**:
```javascript
async function fetchRuleList() {
  const response = await fetch(HUB_REPO_API_URL, { headers });
  const data = await response.json();
  return data.filter(item => item.type === 'file' && item.name.endsWith('.mdc'));
}

async function downloadRule(downloadUrl) {
  const response = await fetch(downloadUrl);
  return await response.text();
}
```

**Update Logic**:
```javascript
// Compare local vs remote rules
const localRules = await fs.readdir(rulesDir);
remoteRules.forEach(async (remoteRule) => {
  const localPath = path.join(rulesDir, remoteRule.name);
  const ruleContent = await downloadRule(remoteRule.download_url);
  
  if (localRules.includes(remoteRule.name)) {
    // Update existing rule
    await fs.writeFile(localPath, ruleContent);
    updatedCount++;
  } else {
    // Add new rule
    await fs.writeFile(localPath, ruleContent);
    newCount++;
  }
});
```

## Key Data Structures

### Project Analysis Result
```javascript
{
  projectStructure: {
    root: '/path/to/project',
    files: [{ path, name, type, extension, size }],
    directories: [{ name, path, depth }],
    fileTypes: { javascript: 45, python: 12, ... }
  },
  
  techStack: {
    primaryLanguages: ['TypeScript', 'JavaScript'],
    frameworks: ['React', 'Next.js'],
    libraries: ['styled-components', 'axios'],
    buildTools: ['webpack', 'babel'],
    testingFrameworks: ['jest', 'react-testing-library']
  },
  
  patterns: {
    architecturalPatterns: [
      { name: 'Component Architecture', confidence: 85 }
    ],
    namingConventions: {
      variables: { dominant: 'camelCase', confidence: 90 },
      functions: { dominant: 'camelCase', confidence: 85 },
      files: { dominant: 'kebab-case', confidence: 75 }
    },
    codePatterns: ['React Hooks', 'Async/Await', 'ES6 Modules']
  }
}
```

This technical implementation provides a comprehensive foundation for making AI assistants project-aware through intelligent code analysis and rule generation.