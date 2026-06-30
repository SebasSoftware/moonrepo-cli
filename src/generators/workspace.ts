import fs from "fs-extra";
import path from "node:path";
import { createFile } from "../utils.ts";
import { gitignore, pnpmWorkspaceTemplate, rootPackageJson, rootReadme, turboJsonTemplate } from "../templates.ts";

/**
 * Generate the root-level workspace files:
 *   - package.json
 *   - pnpm-workspace.yaml
 *   - turbo.json
 *   - .gitignore
 *   - README.md
 *
 * These are what make the project a *monorepo*; without them the
 * frontend and backend generators would just produce two disconnected
 * apps. They live in the project root, not in apps/.
 */
export async function generateWorkspace(
  projectPath: string,
  projectName: string,
  frontendLabel: string,
  backendLabel: string,
): Promise<void> {
  await fs.ensureDir(projectPath);

  createFile({
    filePath: path.join(projectPath, "package.json"),
    content: rootPackageJson(projectName),
  });
  createFile({
    filePath: path.join(projectPath, "pnpm-workspace.yaml"),
    content: pnpmWorkspaceTemplate,
  });
  createFile({
    filePath: path.join(projectPath, "turbo.json"),
    content: turboJsonTemplate,
  });
  createFile({
    filePath: path.join(projectPath, ".gitignore"),
    content: gitignore,
  });
  createFile({
    filePath: path.join(projectPath, "README.md"),
    content: rootReadme(projectName, frontendLabel, backendLabel),
  });
}
