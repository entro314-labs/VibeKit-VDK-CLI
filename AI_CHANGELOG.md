# Changelog

## [Unreleased] - 2025-08-06

### 📋 Release Summary

Release latest includes 10 commits (6 chore, 2 docs, 1 style, 1 feature). Complexity: medium. Affected areas: configuration, other, source, build, documentation, assets, tests.

**Business Impact**: minor
**Complexity**: medium

## Changes

### 📚 Documentation

- **Merge pull request #2 from entro314-labs/v2**: This merge brings in a major update from the 'v2' branch, likely introducing new modules, features, or architectural changes. The update consists of 16 lines changed, indicating targeted but important enhancements. (fe01607) - References: #2
- **added demo, updated readme**: Two demo GIFs were added to the documentation and embedded in the README, showcasing interactive setup and quick workflow. The .gitignore was updated to exclude related demo files. (b91bf1b)

## 🔧 Working Directory Changes

- (feature) Enhanced exclusion logic in RuleGenerator.js - Updated the RuleGenerator class to add comprehensive exclusion rules for irrelevant languages based on project type. For web projects (isWebProject), files related to mobile (swift, kotlin, java, dart, flutter, xamarin) and system programming languages (cpp, c++, rust, go, c#, csharp) are now entirely excluded by returning 0. For content/documentation projects (isContentProject), stricter filtering was added: only Astro, TypeScript, and basic web technologies are allowed, with heavy penalties applied to files from unrelated stacks (e.g., nextjs, react, vue, supabase, trpc, python, swift, kotlin, cpp, node, express) by reducing the score by 0.8. Changes affect the main rule generation logic, utilizing detectedFrameworks, isWebProject, and fileName checks.

- (docs) Created AI_CHANGELOG.md file - Added initial changelog documentation with release summary, business impact, complexity assessment, and categorized change entries. Included detailed descriptions for documentation updates and other changes, as well as a reference to the ai-changelog-generator tool.

---

_Generated using [ai-changelog-generator](https://github.com/entro314-labs/AI-changelog-generator) - AI-powered changelog generation for Git repositories_
