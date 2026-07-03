import fs from "fs-extra";
import path from "node:path";
import { checkFileExists, createFile } from "../utils.ts";
import {
  gitignore,
  pnpmWorkspaceTemplate,
  rootPackageJson,
  rootReadme,
  turboJsonTemplate,
} from "../templates.ts";
import { $ } from "execa";
import { colors } from "../ui.ts";
import ora from "ora";

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

  createFile({
    filePath: path.join(projectPath, "package.json"),
    content: rootPackageJson(projectName),
  });

  const spinner = ora({
    text: colors.git(`Iniciando Git...`),
    color: "white",
  }).start();
  try {
    await $({ stdio: "ignore", cwd: projectPath })`git init`;

    const gitProject = await checkFileExists(path.join(projectPath, ".git"));
    if (!gitProject) {
      throw new Error(colors.error("Error "));
    } else {
      spinner.succeed(colors.success("Git Listo"));
    }
  } catch (error) {
    spinner.stop();
    console.log(
      colors.error(
        `Error iniciando git, por favor ejecute el 'git init' en ./${
          projectName
        }`,
      ),
    );
  }
}
