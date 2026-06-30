import fs from "fs-extra";
import path from "node:path";
import { colors } from "../ui.ts";
import { createFile } from "../utils.ts";
import { BACKEND_FRAMEWORKS, type BackendFramework } from "../enums.ts";
import {
  expressIndexTs,
  expressPackageJson,
  expressTsConfig,
  nestAppModule,
  nestHealthController,
  nestHealthService,
  nestMain,
  nestNestCliJson,
  nestPackageJson,
  nestTsConfig,
  nestTsConfigBuild,
} from "../templates.ts";

/**
 * Generate the chosen backend app under <projectPath>/apps/backend.
 *
 * Like the frontend generator, we write static files rather than
 * invoking `nest new` or `express-generator`. That keeps the CLI
 * offline-friendly and gives us tight control over the resulting
 * package.json (so the workspace `pnpm install` Just Works).
 */
export async function generateBackend(
  projectPath: string,
  backend: BackendFramework,
): Promise<void> {
  const backendPath = path.join(projectPath, "apps", "backend");
  await fs.ensureDir(backendPath);

  if (backend === BACKEND_FRAMEWORKS.EXPRESS) {
    await generateExpress(backendPath);
  } else if (backend === BACKEND_FRAMEWORKS.NEST) {
    await generateNest(backendPath);
  } else {
    throw new Error(`Unknown backend framework: ${backend}`);
  }
}

async function generateExpress(backendPath: string): Promise<void> {
  const appName = path.basename(path.dirname(path.dirname(backendPath)));

  createFile({
    filePath: path.join(backendPath, "package.json"),
    content: expressPackageJson(appName),
  });
  createFile({
    filePath: path.join(backendPath, "tsconfig.json"),
    content: expressTsConfig,
  });

  await fs.ensureDir(path.join(backendPath, "src"));
  createFile({
    filePath: path.join(backendPath, "src", "index.ts"),
    content: expressIndexTs,
  });
}

async function generateNest(backendPath: string): Promise<void> {
  const appName = path.basename(path.dirname(path.dirname(backendPath)));

  createFile({
    filePath: path.join(backendPath, "package.json"),
    content: nestPackageJson(appName),
  });
  createFile({
    filePath: path.join(backendPath, "tsconfig.json"),
    content: nestTsConfig,
  });
  createFile({
    filePath: path.join(backendPath, "tsconfig.build.json"),
    content: nestTsConfigBuild,
  });
  createFile({
    filePath: path.join(backendPath, "nest-cli.json"),
    content: nestNestCliJson,
  });

  await fs.ensureDir(path.join(backendPath, "src", "health"));
  createFile({
    filePath: path.join(backendPath, "src", "main.ts"),
    content: nestMain,
  });
  createFile({
    filePath: path.join(backendPath, "src", "app.module.ts"),
    content: nestAppModule,
  });
  createFile({
    filePath: path.join(backendPath, "src", "health", "health.controller.ts"),
    content: nestHealthController,
  });
  createFile({
    filePath: path.join(backendPath, "src", "health", "health.service.ts"),
    content: nestHealthService,
  });
}

export function backendDoneLabel(backend: BackendFramework): string {
  return colors.yellow(backend);
}
