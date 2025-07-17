<div align="center">

# 🚀 VibeKit VDK CLI Overview

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/entro314-labs/VibeKit-VDK-CLI?style=social)](https://github.com/entro314-labs/VibeKit-VDK-CLI)
[![Last Updated](https://img.shields.io/badge/Last%20Updated-July%202025-brightgreen)](https://github.com/entro314-labs/VibeKit-VDK-CLI)

**A sophisticated developer tool for making AI coding assistants project-aware.**

</div>

## 📋 Overview

The VibeKit VDK CLI is a command-line tool that analyzes your software projects to generate customized "rules." These rules provide deep, project-specific context to AI coding assistants, enabling them to deliver more accurate, consistent, and contextually relevant suggestions.

By understanding your project's unique technology stack, architecture, and coding patterns, the VDK-CLI bridges the gap between generic AI assistance and the specific needs of your codebase.

### ✨ Key Features

- **🚀 Intelligent Project Scanning**: The `vdk init` command analyzes your codebase to detect languages, frameworks, and architectural patterns.
- **📝 Automated Rule Generation**: Creates a set of tailored AI rules based on the project analysis.
- **🔄 Hub Integration**: Use `vdk status` to check for updates from the VDK Hub (with `vdk update` coming soon).
- **🔧 IDE Integration**: Configures your development environment to seamlessly connect the generated rules with your AI assistant.
- **✅ Status Checks**: The `vdk status` command helps you verify your setup and check for rule updates.

## 🏗️ Project Structure

After running `vdk init`, the CLI generates the following structure in your project root:

```
my-project/
├── .ai/
│   └── rules/
│       └── ... (generated rule files)
├── .vdk/
│   └── config.json
├── src/
└── package.json
```

- **`.ai/rules/`**: Contains the generated markdown rule files that provide context to the AI assistant.
- **`.vdk/config.json`**: Stores the configuration, metadata, and analysis results for your project.

## 📚 Next Steps

- **[🚀 Getting Started](GUIDE.md)**: A step-by-step guide to installing the CLI and generating your first set of rules.
- **[📖 CLI Reference](docs/cli/reference.mdx)**: Detailed documentation for all available commands and their options.
- **[🤝 Contribution Guide](CONTRIBUTING.md)**: Instructions for contributing to the VibeKit VDK ecosystem.

## 🔮 Future Plans

We have an extensive roadmap of planned enhancements, including:

- **`vdk deploy`**: A command to deploy rules to various AI assistants.
- **`vdk update`**: A command to update the CLI and rule templates.
- **Expanded Template Library**: More rules for more languages and frameworks.

Check out our detailed roadmap here: [**ROADMAP.md**](ROADMAP.md)

---

<div align="center">

© Original DevRules: Seth Rose - [GitHub](https://github.com/TheSethRose)
© VibeKit VDK CLI Enhancements: Dominikos Pritis - [GitHub](https://github.com/entro314-labs)
© 2025 VibeKit VDK CLI

</div>