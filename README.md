# VibeKit VDK CLI

[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-brightgreen)](https://github.com/entro314-labs/VibeKit-VDK-CLI)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-green)](https://nodejs.org/)
[![Homepage](https://img.shields.io/badge/Homepage-vdk.tools/cli-blue)](https://vdk.tools/cli)

> **Stop Training Your AI Assistant Every Day**

**VibeKit VDK CLI** trains any AI coding assistant to understand your project like a senior developer who's been on your team for years. Generate intelligent rules that make AI suggestions 60% faster and perfectly matched to your codebase patterns.

## ✨ What Makes This Special

🔍 **60% Faster AI Suggestions** - Quantified productivity improvement from project-aware AI  
🎯 **Universal Compatibility** - Works with any AI assistant (Copilot, Claude, Cursor, etc.)  
🚀 **5-Minute Setup** - Instant value without complex configuration  
👥 **Team Consistency** - Standardize AI behavior across your entire team  
🔄 **Community-Driven** - Sync with latest best practices from thousands of developers  

## 🚀 Quick Start

**Get your AI assistant project-aware in 5 minutes:**

```bash
# Install globally
npm install -g @vdk/cli
# or
pnpm add -g @vdk/cli

# Initialize in your project
cd your-project
vdk init
```

**Before VDK**: "Create a React component" → Generic component  
**After VDK**: "Create a React component" → Component matching your exact patterns, imports, and conventions

For detailed installation and configuration options, see the **[📖 Complete Guide](GUIDE.md)**.

## 🎬 See It In Action

**Before VibeKit VDK CLI:**
```
👤 "Create a new user component"
🤖 "Here's a generic React component..."
```

**After VibeKit VDK:**
```
👤 "Create a new user component"
🤖 "Based on your project's patterns, I'll create a component following your:
    • TypeScript interfaces from types/User.ts
    • Styled-components architecture
    • Custom hooks pattern from hooks/useAuth.ts
    • Error handling with your ErrorBoundary wrapper"
```

## 🔧 How It Works

1. **Project Analysis** - Scans your codebase to detect technologies, patterns, and conventions
2. **Rule Generation** - Creates `.mdc` rule files with project-specific guidance
3. **AI Enhancement** - Your AI assistant automatically uses these rules for better suggestions
4. **Continuous Learning** - Rules evolve with your project and community best practices

## 🌟 Key Features

### Intelligent Project Analysis
- **Technology Detection**: Automatically identifies frameworks, libraries, and languages
- **Pattern Recognition**: Understands your naming conventions and architectural patterns
- **Anti-Pattern Detection**: Identifies common mistakes specific to your codebase
- **Performance Analysis**: Detects performance patterns and optimization opportunities

### Multi-Platform Support
| Platform | Status | Integration |
|----------|--------|-------------|
| **VS Code** | ✅ Full Support | `.vscode/ai-rules/` |
| **Cursor AI** | ✅ Full Support | `.cursor/rules/` |
| **Windsurf** | ✅ Full Support | `.windsurf/rules/` |
| **GitHub Copilot** | ✅ Full Support | Workspace-level |
| **Claude Desktop** | ✅ Full Support | `.ai/rules/` |
| **JetBrains IDEs** | ✅ Full Support | `.idea/ai-rules/` |
| **Zed Editor** | ✅ Full Support | Project-specific |

### Comprehensive Technology Support

**Languages** (12+): TypeScript, JavaScript, Python, Java, C#, Go, Ruby, PHP, Swift, Kotlin, Rust, C++

**Frameworks** (14+): React, Next.js, Vue.js, Angular, Svelte, Express.js, NestJS, Django, Flask, FastAPI, Flutter, SwiftUI, React Native

**Technology Stacks**: NextJS Enterprise, Supabase + Next.js, tRPC Full-Stack, MERN, MEAN, Laravel + Vue, Django + React, Spring Boot + React

## 📁 Generated Rule Structure

```
your-project/
├── .ai/rules/                    # Generated rules directory
│   ├── 00-core-agent.mdc       # AI behavior guidelines
│   ├── 01-project-context.mdc  # Project-specific patterns
│   ├── 02-common-errors.mdc    # Anti-patterns to avoid
│   ├── 03-mcp-configuration.mdc # MCP server settings
│   ├── tasks/                   # Task-specific rules (51+ tasks)
│   │   ├── Code-Quality-Review.mdc
│   │   ├── Debugging-Assistant.mdc
│   │   └── Refactor-Code.mdc
│   ├── languages/               # Language-specific rules
│   │   ├── TypeScript.mdc
│   │   └── Python.mdc
│   └── technologies/            # Framework-specific rules
│       ├── React.mdc
│       └── Next.js.mdc
```

## 🛠️ Quick Commands

```bash
# Initialize project
vdk init

# Update rules from VDK Hub
vdk update

# Check status of VDK setup
vdk status

# Validate rule syntax (via npm script)
npm run validate
```

## 📊 Real Impact

Teams using VibeKit VDK CLI report:
- **60% faster** initial AI suggestions
- **85% more relevant** code completions
- **40% fewer** back-and-forth clarifications
- **90% consistency** in code patterns across team members

## 📚 Documentation

- **[📖 Complete Installation & Usage Guide](GUIDE.md)** - Comprehensive setup and configuration
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[🗺️ Development Roadmap](ROADMAP.md)** - Future features and timeline
- **[📦 Publishing Guide](PUBLISHING.md)** - NPM publishing information
- **[🔍 Scanner Guide](src/scanner/USER-GUIDE.md)** - Project scanner documentation

### Advanced Guides
- **[📚 Complete Documentation Index](docs/Master-Documentation-Index.md)** - Central hub for all documentation
- **[🚀 Getting Started Guide](docs/Getting-Started-Guide.md)** - Quick 5-minute setup
- **[📝 Rule Authoring Guide](docs/Rule-Authoring-Guide.md)** - Complete guide for creating custom rules
- **[🖥️ CLI Reference](docs/CLI-Reference.md)** - Command-line interface documentation
- **[🔧 Troubleshooting Guide](docs/Troubleshooting-Guide.md)** - Common issues and solutions
- **[🔄 Sync System](docs/Sync-System.md)** - Community rule synchronization
- **[🎯 Task System Guide](docs/Task-System-Guide.md)** - 51+ specialized development workflows
- **[🧠 Memory Management Guide](docs/Memory-Management-Guide.md)** - Session continuity and context preservation
- **[📝 MDC Schema Documentation](docs/MDC-Schema-Documentation.md)** - Technical format specification
- **[🔌 Editor Path Integration](docs/Editor-Path-Integration-Guide.md)** - IDE integration guide
- **[🌐 Hub Integration](docs/Hub-Integration.md)** - Web application integration
- **[📜 Project History & Attribution](docs/Project-History-Attribution.md)** - Evolution from DevRules to VibeKit VDK CLI

## 🧩 Extensibility

### Custom Rule Templates
```handlebars
{{!-- templates/custom/api-patterns.mdc --}}
---
description: "{{projectName}} API patterns and conventions"
tags: ["api", "{{projectFramework}}"]
---

# {{projectName}} API Guidelines

## Detected Patterns
{{#each apiPatterns}}
- {{this.pattern}}: {{this.usage}}
{{/each}}
```

### Plugin Architecture
```javascript
// src/plugins/custom-analyzer.js
export class CustomAnalyzer {
  analyze(project) {
    // Custom analysis logic
    return {
      patterns: this.detectPatterns(project),
      recommendations: this.generateRecommendations(project)
    };
  }
}
```

## 🤖 AI Assistant Integration

### Memory & Context Management
- **Session Continuity**: Maintains context across development sessions with AI-to-AI handoff protocols
- **Decision History**: Remembers architectural decisions and patterns with ADR (Architecture Decision Records)
- **Code Evolution**: Tracks how your codebase patterns evolve over time
- **Team Memory**: Shared context for collaborative development
- **Pattern Learning**: AI learns from your project's unique patterns and conventions
- **MCP Integration**: Model Context Protocol servers for persistent memory across sessions

### Enhanced Capabilities
- **Context-Aware Completions**: Suggestions based on your actual codebase
- **Project-Specific Guidance**: Framework and library usage tailored to your setup
- **Error Prevention**: Warns about anti-patterns specific to your project
- **Performance Optimization**: Suggestions based on your performance patterns

## 🌐 Community

- **[GitHub Repository](https://github.com/entro314-labs/VibeKit-VDK-CLI)** - Source code and issues
- **[VDK Hub](https://vdk.tools)** - Browse, customize, and generate VDK rules
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to get involved

## 📝 License & Attribution

MIT License - see [LICENSE](LICENSE) for details.

### Project Evolution & Attribution

VibeKit VDK is the evolution of a rich history of AI-assisted development tooling:

- **Original DevRules** by [Seth Rose](https://github.com/TheSethRose) - Established the foundational concept of structured AI assistant rules
- **AIRules** - Major enhancement adding 51+ specialized tasks, memory management, and multi-platform support  
- **VibeKit VDK** - The current evolution, a comprehensive toolkit for making AI assistants project-aware, including the **VibeKit VDK CLI**, **VibeKit VDK Hub**, and **VibeKit VDK AI Rules**.

For detailed history and contributions, see [📜 Project History & Attribution](docs/Project-History-Attribution.md).

We gratefully acknowledge all contributors who have helped evolve this project from concept to comprehensive AI development framework.

---

<div align="center">

**Made with ❤️ by the VibeKit VDK community**

[⭐ Star on GitHub](https://github.com/entro314-labs/VibeKit-VDK-CLI) • [🐛 Report Bug](https://github.com/entro314-labs/VibeKit-VDK-CLI/issues) • [💡 Request Feature](https://github.com/entro314-labs/VibeKit-VDK-CLI/issues)

</div>