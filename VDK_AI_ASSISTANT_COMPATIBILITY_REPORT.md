# VibeKit VDK CLI: AI Assistant Compatibility & Format Standardization Report

**Document Version:** 1.0  
**Date:** July 17, 2025  
**Author:** Claude Code Analysis  
**Project:** VibeKit VDK CLI Enhancement  

---

## Executive Summary

This report provides a comprehensive analysis of AI assistant rule formats and recommends a unified approach for the VibeKit VDK CLI to maximize compatibility across all major AI coding assistants and IDEs. The analysis covers Claude Code, Cursor, Windsurf, GitHub Copilot, VS Code, JetBrains IDEs, and other development environments.

**Key Recommendation:** Migrate from the current `.mdc.hbs` template system to a unified **Markdown (.md) with YAML frontmatter** approach to achieve maximum compatibility and future-proofing.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [AI Assistant Ecosystem Analysis](#ai-assistant-ecosystem-analysis)
3. [File Format Compatibility Matrix](#file-format-compatibility-matrix)
4. [Unified Format Specification](#unified-format-specification)
5. [Implementation Strategy](#implementation-strategy)
6. [Migration Plan](#migration-plan)
7. [Benefits & Risk Assessment](#benefits--risk-assessment)
8. [Appendices](#appendices)

---

## Current State Analysis

### VibeKit VDK CLI Architecture

The VibeKit VDK CLI currently operates as a sophisticated project analysis and rule generation system:

**Core Components:**
- **Project Scanner**: Analyzes codebases to detect technologies, patterns, and conventions
- **Rule Generator**: Creates tailored AI rules based on project analysis
- **Template System**: Uses Handlebars (.hbs) templates to generate rules
- **Multi-Platform Support**: Targets 7+ AI assistants and IDEs
- **Hub Integration**: Connects to VDK Hub for rule synchronization

**Current Template Structure:**
```
src/scanner/templates/
├── core-agent.hbs
├── project-context.hbs
├── common-errors.hbs
├── mcp-configuration.hbs
├── frameworks/
│   ├── Angular-Modern.mdc.hbs
│   ├── React-Modern.mdc.hbs
│   └── [others].mdc.hbs
├── languages/
│   └── TypeScript-Modern.mdc.hbs
└── technologies/
    ├── NextJS.mdc.hbs
    └── [others].mdc.hbs
```

**Generated Output Structure:**
```
.ai/rules/
├── 00-core-agent.mdc
├── 01-project-context.mdc
├── 02-common-errors.mdc
├── 03-mcp-configuration.mdc
├── tasks/
├── languages/
└── technologies/
```

### Current Challenges

1. **Format Fragmentation**: `.mdc` format has limited compatibility outside Cursor
2. **Platform-Specific Requirements**: Each AI assistant has different file format expectations
3. **Maintenance Overhead**: Multiple template variations for similar functionality
4. **Future-Proofing**: Risk of format obsolescence as tools evolve

---

## AI Assistant Ecosystem Analysis

### Claude Code
**Format Support:** `.md` with YAML frontmatter  
**Location:** `CLAUDE.md`, `.claude/` directory  
**Key Features:**
- Project and user memory separation
- Slash command integration
- IDE integrations (VS Code, JetBrains)
- Memory lookup recursion
- Hook system for automation

**Memory Structure:**
```
project/
├── CLAUDE.md              # Team-shared conventions
├── CLAUDE.local.md        # Personal project preferences
└── .claude/
    ├── settings.json      # Configuration
    ├── commands/          # Custom slash commands
    └── hooks/             # Automation hooks
```

**Metadata Example:**
```yaml
---
description: "Project-specific coding standards"
type: "project-memory"
scope: "team-shared"
---
```

### Cursor IDE
**Format Support:** `.mdc` (preferred), `.md` (legacy)  
**Location:** `.cursor/rules/` directory  
**Key Features:**
- Enhanced MDC format with rich metadata
- Auto-attachment based on glob patterns
- Agent-requested rules with descriptions
- Manual activation via @mentions
- File reference system (@filename.ts)

**Rule Types:**
- **Always**: Automatically included
- **Auto Attached**: Triggered by file patterns
- **Agent Requested**: AI decides when to apply
- **Manual**: Explicitly activated

**Metadata Example:**
```yaml
---
type: auto-attached
globs: ["**/*.tsx", "**/*.jsx"]
description: "React component guidelines"
alwaysApply: false
---
```

### Windsurf
**Format Support:** `.md` with YAML frontmatter  
**Location:** `.windsurf/rules/`, global rules  
**Key Features:**
- Memory system for persistent context
- Workspace-specific rules
- Activation modes (Manual, Always On, Model Decision, Glob)
- Character limits (6K per file, 12K total)
- Workflow integration

**Activation Modes:**
1. **Manual**: Via @mention
2. **Always On**: Applied to all interactions
3. **Model Decision**: AI decides based on context
4. **Glob**: File pattern matching

**Metadata Example:**
```yaml
---
activation: "glob"
scope: "workspace"
priority: "high"
globs: ["**/*.ts", "**/*.js"]
---
```

### GitHub Copilot
**Format Support:** Enterprise UI-based guidelines only  
**Location:** Repository Settings → Copilot → Code review  
**Key Features:**
- Limited to Enterprise customers
- Maximum 6 guidelines per repository
- File path patterns using fnmatch syntax
- Code review integration only

**Limitations:**
- No file-based rule system
- Enterprise-only feature
- Limited to code review comments
- Being deprecated in favor of custom instructions

### VS Code Ecosystem
**Format Support:** `.md` (universal), `.mdx` (with extensions)  
**Key Features:**
- Built-in markdown preview
- YAML frontmatter support
- Extensive extension ecosystem
- Syntax highlighting for multiple formats

### JetBrains IDEs
**Format Support:** `.md` (built-in), plugins for others  
**Key Features:**
- Markdown plugin with preview
- Structure view for documents
- YAML frontmatter support (with formatting quirks)
- Integration with various AI assistant plugins

---

## File Format Compatibility Matrix

| Format | Claude Code | Cursor | Windsurf | GitHub Copilot | VS Code | JetBrains | Future-Proof |
|--------|-------------|--------|----------|----------------|---------|-----------|---------------|
| **`.md`** | ✅ Primary | ✅ Legacy | ✅ Primary | ❌ No file support | ✅ Excellent | ✅ Built-in | ✅ Standard |
| **`.mdc`** | ❌ Not supported | ✅ Preferred | ❌ Not supported | ❌ No file support | ⚠️ Extension needed | ⚠️ Basic support | ❌ Cursor-specific |
| **`.mdx`** | ❌ Not supported | ⚠️ With extensions | ❌ Not supported | ❌ No file support | ⚠️ Extension needed | ⚠️ Plugin required | ⚠️ React ecosystem |

### Metadata Support Analysis

| Feature | `.md` + YAML | `.mdc` | `.mdx` |
|---------|-------------|--------|--------|
| **Universal compatibility** | ✅ All platforms | ❌ Cursor only | ⚠️ Limited |
| **Rich metadata** | ✅ YAML frontmatter | ✅ Enhanced processing | ✅ JSX props |
| **Platform-specific features** | ✅ Flexible schema | ✅ Cursor optimized | ⚠️ React focused |
| **IDE support** | ✅ Universal | ⚠️ Limited | ⚠️ Extension dependent |
| **Rendering quality** | ✅ Excellent | ✅ Cursor enhanced | ✅ Rich (with setup) |

---

## Unified Format Specification

### Recommended Format: Markdown (.md) with Standardized YAML Frontmatter

**Rationale:**
1. **Maximum Compatibility**: Works across all AI assistants and IDEs
2. **Future-Proof**: Standard format unlikely to become obsolete
3. **Flexible Metadata**: YAML frontmatter provides rich configuration options
4. **No Vendor Lock-in**: Not tied to any specific tool or platform
5. **Excellent Tooling**: Best IDE support and ecosystem

### Standardized YAML Schema

```yaml
---
# Core metadata
description: "Human-readable description for AI assistants"
version: "1.0.0"
lastUpdated: "2025-07-17"
author: "VDK CLI"

# Activation patterns
globs: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"]
type: "auto-attached"  # auto-attached, manual, always, agent-requested

# Platform-specific configuration
cursor:
  alwaysApply: false
  fileReferences: ["@component-template.tsx"]
windsurf:
  activation: "glob"
  scope: "workspace"
  characterBudget: 2000
claude:
  memoryType: "project"  # project, user, local
  slashCommands: ["review", "refactor"]
github:
  enterprise: true
  reviewGuidelines: true

# Categorization
tags: ["react", "typescript", "best-practices", "performance"]
priority: "medium"  # high, medium, low
category: "framework"  # language, framework, task, pattern
applicability: "frontend"  # frontend, backend, fullstack, devops

# Rule behavior
conflicts: ["legacy-react-rules.md"]
dependencies: ["typescript-base.md"]
supersedes: ["old-react-guidelines.md"]
---
```

### Universal Rule Template Structure

```markdown
---
description: "React component development guidelines"
version: "1.0.0"
globs: ["**/*.tsx", "**/*.jsx"]
type: "auto-attached"
tags: ["react", "components", "frontend"]
priority: "high"
---

# React Component Guidelines

## Core Principles
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow naming conventions

## Platform-Specific Notes

### For Cursor Users
- Use @component-template.tsx for scaffolding
- Enable auto-attachment for .tsx files

### For Windsurf Users  
- Activate via glob pattern matching
- Integrated with component workflows

### For Claude Code Users
- Available via /component slash command
- Stored in project memory

## Implementation Details
[Rule content that works across all platforms]
```

---

## Implementation Strategy

### Phase 1: Template Migration (Week 1-2)

**Objective:** Convert existing `.mdc.hbs` templates to `.md.hbs` with unified YAML frontmatter

**Tasks:**
1. **Audit Current Templates**
   - Catalog all existing `.mdc.hbs` files
   - Document current metadata usage
   - Identify platform-specific requirements

2. **Create Universal Schema**
   - Define standardized YAML frontmatter structure
   - Map current metadata to new schema
   - Design platform-specific sections

3. **Template Conversion**
   - Convert core templates (core-agent, project-context, etc.)
   - Migrate framework templates (React, Angular, Vue, etc.)
   - Update language templates (TypeScript, Python, etc.)

4. **Validation System**
   - Create YAML schema validation
   - Implement template testing framework
   - Ensure backward compatibility

### Phase 2: Claude Code Integration (Week 2-3)

**Objective:** Add native Claude Code support to VDK CLI

**Tasks:**
1. **Claude Code Detection**
   - Detect Claude Code installations
   - Identify CLAUDE.md file locations
   - Map project structure to VDK patterns

2. **Rule Generation Logic**
   - Generate CLAUDE.md files
   - Create .claude/commands/ slash commands
   - Implement project/user memory separation

3. **Integration Features**
   - Hook system integration
   - Settings.json configuration
   - IDE integration support

### Phase 3: Enhanced Compatibility (Week 3-4)

**Objective:** Ensure seamless operation across all platforms

**Tasks:**
1. **Cross-Platform Testing**
   - Test rule generation for all supported platforms
   - Validate metadata parsing across tools
   - Ensure rendering quality in all IDEs

2. **Migration Tools**
   - Create migration utility for existing .mdc files
   - Implement format conversion helpers
   - Provide upgrade path documentation

3. **Documentation Updates**
   - Update README and user guides
   - Create platform-specific setup guides
   - Document new unified format specification

### Phase 4: Advanced Features (Week 4-5)

**Objective:** Leverage unified format for enhanced functionality

**Tasks:**
1. **Smart Rule Selection**
   - Implement conflict resolution
   - Add dependency management
   - Create rule supersession logic

2. **Dynamic Configuration**
   - Platform-specific rule activation
   - Context-aware rule selection
   - Performance optimization

3. **Hub Integration Enhancement**
   - Update VDK Hub for new format
   - Implement rule validation service
   - Add community contribution features

---

## Migration Plan

### Pre-Migration Checklist

- [ ] Complete current template audit
- [ ] Document existing integrations
- [ ] Create backup of current system
- [ ] Set up testing environment
- [ ] Prepare rollback procedures

### Migration Steps

1. **Preparation**
   ```bash
   # Backup current templates
   cp -r src/scanner/templates/ src/scanner/templates.backup/
   
   # Create new template structure
   mkdir -p src/scanner/templates-unified/
   ```

2. **Schema Implementation**
   ```javascript
   // Add YAML schema validation
   const ruleSchema = {
     type: 'object',
     required: ['description', 'version'],
     properties: {
       description: { type: 'string' },
       version: { type: 'string' },
       globs: { type: 'array', items: { type: 'string' } },
       type: { enum: ['auto-attached', 'manual', 'always', 'agent-requested'] }
     }
   };
   ```

3. **Template Conversion**
   ```handlebars
   {{!-- Convert from .mdc.hbs to .md.hbs --}}
   ---
   description: "{{description}}"
   version: "{{version}}"
   globs: {{json globs}}
   type: "{{type}}"
   tags: {{json tags}}
   {{#if cursor}}
   cursor:
     alwaysApply: {{cursor.alwaysApply}}
   {{/if}}
   ---
   
   # {{title}}
   
   {{content}}
   ```

4. **Testing & Validation**
   ```bash
   # Test rule generation
   vdk init --template unified-format
   
   # Validate across platforms
   npm run test:compatibility
   ```

### Backward Compatibility

- Maintain support for existing `.mdc` output during transition period
- Provide conversion tools for existing rule sets
- Support both formats in VDK Hub initially
- Gradual deprecation of `.mdc` format over 6 months

---

## Benefits & Risk Assessment

### Benefits

**Immediate Benefits:**
- **Universal Compatibility**: Rules work across all AI assistants
- **Reduced Maintenance**: Single template system instead of format variations
- **Better IDE Support**: Enhanced editing and preview capabilities
- **Future-Proofing**: Standard format reduces obsolescence risk

**Long-term Benefits:**
- **Ecosystem Growth**: Easier adoption by new AI assistants
- **Community Contributions**: Standard format encourages rule sharing
- **Enhanced Features**: Unified metadata enables advanced functionality
- **Platform Independence**: No vendor lock-in risks

### Risks & Mitigation

**Technical Risks:**
- **Migration Complexity**: Mitigated by phased approach and testing
- **Metadata Loss**: Mitigated by comprehensive schema mapping
- **Performance Impact**: Mitigated by optimization and caching

**Adoption Risks:**
- **User Confusion**: Mitigated by clear documentation and migration tools
- **Breaking Changes**: Mitigated by backward compatibility period
- **Platform Resistance**: Mitigated by maintaining platform-specific features

**Mitigation Strategies:**
1. **Comprehensive Testing**: Multi-platform validation before release
2. **Clear Communication**: Detailed migration guides and support
3. **Gradual Rollout**: Phased deployment with rollback capabilities
4. **Community Engagement**: Early feedback from power users

---

## Success Metrics

### Technical Metrics
- **Compatibility Score**: 100% rule parsing across all supported platforms
- **Migration Success Rate**: >95% successful template conversions
- **Performance**: No degradation in rule generation speed
- **Error Rate**: <1% rule validation failures

### User Experience Metrics
- **Adoption Rate**: >80% users migrate within 3 months
- **User Satisfaction**: >4.5/5 rating for new format
- **Support Tickets**: <10% increase during migration period
- **Community Contributions**: 20% increase in rule submissions

### Business Metrics
- **Platform Coverage**: Support for 2+ new AI assistants within 6 months
- **Hub Engagement**: 25% increase in rule downloads/updates
- **Enterprise Adoption**: 5+ enterprise customers adopt unified format
- **Ecosystem Growth**: 3+ third-party integrations built on unified format

---

## Appendices

### Appendix A: Current Template Inventory

**Core Templates:**
- `core-agent.hbs` - Base AI behavior guidelines
- `project-context.hbs` - Project-specific patterns
- `common-errors.hbs` - Anti-patterns to avoid
- `mcp-configuration.hbs` - MCP server settings

**Framework Templates:**
- `Angular-Modern.mdc.hbs` - Angular best practices
- `React-Modern.mdc.hbs` - React development guidelines
- `Vue-Modern.mdc.hbs` - Vue.js conventions
- `NextJS.mdc.hbs` - Next.js specific patterns
- `Django-Modern.mdc.hbs` - Django backend guidelines
- `Node-Express.mdc.hbs` - Express.js API patterns

**Language Templates:**
- `TypeScript-Modern.mdc.hbs` - TypeScript conventions

**Technology Templates:**
- Platform-specific variations of framework templates

### Appendix B: Platform-Specific Requirements

**Claude Code Requirements:**
- YAML frontmatter for memory classification
- Support for slash command integration
- Project vs user memory separation
- Hook system compatibility

**Cursor Requirements:**
- Rich metadata for auto-attachment
- Glob pattern support
- File reference system (@filename)
- Agent-requested rule descriptions

**Windsurf Requirements:**
- Character limit compliance (6K/12K)
- Activation mode specification
- Workflow integration support
- Memory system compatibility

### Appendix C: YAML Schema Specification

```yaml
# Complete YAML schema for unified format
$schema: "http://json-schema.org/draft-07/schema#"
title: "VDK Rule Format"
type: "object"
required: ["description", "version"]
properties:
  description:
    type: "string"
    maxLength: 200
  version:
    type: "string"
    pattern: "^\\d+\\.\\d+\\.\\d+$"
  lastUpdated:
    type: "string"
    format: "date"
  globs:
    type: "array"
    items:
      type: "string"
  type:
    enum: ["auto-attached", "manual", "always", "agent-requested"]
  tags:
    type: "array"
    items:
      type: "string"
  priority:
    enum: ["high", "medium", "low"]
  cursor:
    type: "object"
    properties:
      alwaysApply:
        type: "boolean"
      fileReferences:
        type: "array"
        items:
          type: "string"
  windsurf:
    type: "object"
    properties:
      activation:
        enum: ["manual", "always", "model", "glob"]
      scope:
        enum: ["workspace", "global"]
      characterBudget:
        type: "integer"
        minimum: 0
        maximum: 6000
  claude:
    type: "object"
    properties:
      memoryType:
        enum: ["project", "user", "local"]
      slashCommands:
        type: "array"
        items:
          type: "string"
```

### Appendix D: Implementation Timeline

**Week 1:**
- [ ] Template audit and documentation
- [ ] YAML schema design and validation
- [ ] Core template conversion (4 templates)

**Week 2:**
- [ ] Framework template conversion (6 templates)
- [ ] Claude Code integration planning
- [ ] Testing framework implementation

**Week 3:**
- [ ] Claude Code rule generation logic
- [ ] Cross-platform compatibility testing
- [ ] Migration tool development

**Week 4:**
- [ ] Advanced features implementation
- [ ] Documentation updates
- [ ] Community feedback integration

**Week 5:**
- [ ] Final testing and validation
- [ ] Release preparation
- [ ] Rollback procedures finalization

---

**End of Report**

*This report serves as the foundation for implementing unified rule format support in the VibeKit VDK CLI. Regular updates will be provided as implementation progresses and new requirements are discovered.*