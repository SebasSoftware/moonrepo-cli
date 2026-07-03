import fs from "fs-extra";
import path from "node:path";
import { colors } from "../ui.ts";
import {
  addScriptToPackageJson,
  checkFileExists,
  createFile,
} from "../utils.ts";
import {
  BACKEND_FRAMEWORKS,
  BACKEND_LABELS,
  type BackendFramework,
} from "../enums.ts";
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
import { execa, ExecaError } from "execa";
import ora from "ora";

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
  const backendPath = path.join(projectPath, "apps");

  if (backend === BACKEND_FRAMEWORKS.EXPRESS) {
    await generateExpress(backendPath, BACKEND_LABELS.express);
  } else if (backend === BACKEND_FRAMEWORKS.NEST) {
    await generateNest(backendPath, BACKEND_LABELS.nest);
  } else {
    throw new Error(`Unknown backend framework: ${backend}`);
  }
}

async function generateExpress(
  backendPath: string,
  techLabel: string,
): Promise<void> {
  const backPath = path.join(backendPath, "backend");
  await fs.ensureDir(backPath);
  const maxRetries = 3;

  let loading = true;
  let i = 1;

  while (loading) {
    const spinner = ora({
      text: colors.cyan(`Creando ${techLabel}...`),
      color: "yellow",
    }).start();
    try {
      createFile({
        filePath: path.join(backPath, "tsconfig.json"),
        content: expressTsConfig,
      });

      await fs.ensureDir(path.join(backPath, "src"));
      createFile({
        filePath: path.join(backPath, "src", "index.ts"),
        content: expressIndexTs,
      });

      await execa("pnpm", ["init"], {
        cwd: backPath,
        stdio: "ignore",
      });

      const packageExpressExists = await checkFileExists(
        path.join(backPath, "package.json"),
      );
      if (packageExpressExists) {
        try {
          await execa("pnpm", ["add", "express"], {
            cwd: backPath,
            stdio: "ignore",
          });

          await addScriptToPackageJson(path.join(backPath, "package.json"), {
            key: "dev",
            value: "node --watch src/index.ts",
          });
        } catch (error) {
          throw error;
        }
      }

      loading = false;
      spinner.succeed(colors.success("Backend listo"));
    } catch (error) {
      spinner.stop();
      if (i >= maxRetries) {
        loading = false;
        if (error instanceof ExecaError) {
          console.log(
            `${colors.cross} ${colors.brand("Backend Error")}: ${error.message}`,
          );
          const fallbackSpinner = ora({
            text: colors.cyan(`Creando ${techLabel} Manualmente...`),
            color: "yellow",
          }).start();
          await new Promise((resolve) => setTimeout(resolve, 2500));

          createFile({
            filePath: path.join(backPath, "package.json"),
            content: expressPackageJson(),
          });
          fallbackSpinner.succeed(colors.success("Backend creado manualmente"));
        } else {
          console.log(
            `${colors.cross} ${colors.brand("Backend Error")}: ${error}`,
          );
        }
      } else {
        console.log(
          `${colors.brand(`Intento ${i}/${maxRetries} falló. Reintentando en ${i + 1}s... (${i + 1}/${maxRetries})`)}`,
        );
        i += 1;
        await new Promise((resolve) => setTimeout(resolve, 1000 * i));
      }
    }
  }
}

async function generateNest(
  backendPath: string,
  techLabel: string,
): Promise<void> {
  const maxRetries = 3;
  const command = "git";
  const commandTags = [
    "clone",
    "https://github.com/nestjs/typescript-starter.git",
    "backend",
  ];

  let loading = true;
  let i = 1;

  while (loading) {
    const spinner = ora({
      text: colors.cyan(`Creando ${techLabel}...`),
      color: "yellow",
    }).start();
    try {
      await execa(command, commandTags, {
        cwd: backendPath,
        stdio: "ignore",
      });

      const gitExists = await checkFileExists(
        path.join(backendPath, "backend", ".git"),
      );
      if (gitExists) {
        await fs.remove(path.join(backendPath, "backend", ".git"));
      }

      loading = false;
      spinner.succeed(colors.success("Backend listo"));
    } catch (error) {
      spinner.stop();
      if (i >= maxRetries) {
        loading = false;

        if (error instanceof ExecaError) {
          console.log(
            `${colors.cross} ${colors.brand("Backend Error")}: ${error.message}`,
          );
          const fallbackSpinner = ora({
            text: colors.cyan(`Creando ${techLabel} Manualmente...`),
            color: "yellow",
          }).start();
          await new Promise((resolve) => setTimeout(resolve, 2500));

          await generateNestManual(path.join(backendPath, "backend"));
          fallbackSpinner.succeed(colors.success("Backend creado manualmente"));
        } else {
          console.log(
            `${colors.cross} ${colors.brand("Backend Error")}: ${error}`,
          );
        }
      } else {
        console.log(
          `${colors.brand(`Intento ${i}/${maxRetries} falló. Reintentando en ${i + 1}s... (${i + 1}/${maxRetries})`)}`,
        );
        i += 1;
        await new Promise((resolve) => setTimeout(resolve, 1000 * i));
      }
    }
  }
}

async function generateNestManual(backendPath: string): Promise<void> {
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
