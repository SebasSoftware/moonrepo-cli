# AGENT.md

## Project Overview

This is a moonc sublime CLI tool for scaffolding pnpm+Turbo monorepos. It provides utilities to quickly set up TypeScript/Node.js projects with modern tooling.

- Project name: `moonrepo-cli` (v1.0.0)
- Core purpose: Rapid project scaffolding with pnpm/Turbo integration
- License: ISC

## Technology Stack

- Primary tools:
  - pnpm (package manager)
  - Turbo (monorepo manager)
  - TypeScript (TS5.6.3)
- Development dependencies:
  - `tsx` (TypeScript execution)
  - `chalk`, `inquirer`, `ora` (CLI UI)
  - `fs-extra`, `execa` (File/system operations)

## Build & Execution

- Development workflow:
  ```bash
  pnpm run dev  # Runs tsx src/index.ts
  ```
- Build process:
  ```bash
  pnpm run build  # Compiles TypeScript via tsc
  ```
- Runtime commands available in `bin/moonrepo`

## Project Structure

- Core directory: `src/` (TypeScript source files)
- Configuration:
  - `package.json` (Project metadata/dependencies)
  - `tsconfig.json` (TypeScript compilation settings)
- Ignore: `node_modules/` (Auto-generator dependencies)

## Key Features for Agent

- Supports pnpm/Turbo monorepo patterns
- TypeScript-first development
- CLI interface for command execution
- Modular architecture (separate dist/bin/moonrepo binary)
