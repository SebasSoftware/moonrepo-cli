import fs from "fs-extra";
import path from "node:path";
import { colors } from "../ui.ts";
import { addViteConfig, checkFileExists, createFile } from "../utils.ts";
import {
  FRONTEND_FRAMEWORKS,
  FRONTEND_LABELS,
  type FrontendFramework,
} from "../enums.ts";
import {
  nextAppLayout,
  nextAppPage,
  nextConfig,
  nextEnvD,
  nextPackageJson,
  nextTsConfig,
  viteAppTsx,
  viteConfigTs,
  viteEnvD,
  viteIndexCss,
  viteIndexHtml,
  viteMainTsx,
  vitePackageJson,
  vitePostcssConfig,
  viteTailwindConfig,
  viteTailwindIndexCss,
  viteTsConfigJson,
} from "../templates.ts";
import { execa, ExecaError } from "execa";
import ora from "ora";

/**
 * Generate the chosen frontend app under <projectPath>/apps/frontend.
 *
 * Strategy: write static, hand-rolled files (no exec of `pnpm create`)
 * so the user can decide WHEN to run `pnpm install` and we don't depend
 * on a network round-trip to npm to scaffold. This keeps the CLI fast,
 * deterministic, and offline-friendly.
 */
export async function generateFrontend(
  projectPath: string,
  frontend: FrontendFramework,
  options: { withTailwind: boolean },
): Promise<void> {
  const frontendPath = path.join(projectPath, "apps");
  await fs.ensureDir(frontendPath);

  if (frontend === FRONTEND_FRAMEWORKS.VITE) {
    await generateVite(
      frontendPath,
      options.withTailwind,
      FRONTEND_LABELS.vite,
    );
  } else if (frontend === FRONTEND_FRAMEWORKS.NEXT) {
    await generateNext(frontendPath, FRONTEND_LABELS.next);
  } else {
    throw new Error(`Unknown frontend framework: ${frontend}`);
  }
}

async function generateVite(
  frontendPath: string,
  withTailwind: boolean,
  techLabel: string,
): Promise<void> {
  const maxRetries = 3;
  // pnpm create vite frontend --no-immediate --eslint
  const command = "pnpm";
  const commandTags = [
    "create",
    "vite",
    "frontend",
    "--no-immediate",
    "--eslint",
    "-t",
    "react-ts",
  ];

  let loading = true;
  let i = 1;

  while (loading) {
    const spinner = ora({
      text: colors.cyan(`Creando ${techLabel}...`),
      color: "yellow",
    }).start();
    try {
      const process = execa(command, commandTags, {
        stdio: "ignore",
        cwd: `${frontendPath}`,
      });
      await process;

      const viteConfigExists = await checkFileExists(
        path.join(frontendPath, "frontend", "vite.config.ts"),
      );

      if (viteConfigExists) {
        await addViteConfig<boolean>(
          path.join(frontendPath, "frontend", "vite.config.ts"),
          { key: "clearScreen", value: false },
        );
      }

      if (withTailwind) {
        spinner.text = colors.cyan(`Iniciando Tailwindcss...`);

        if (viteConfigExists) {
          const frontendDir = path.join(frontendPath, "frontend");
          await execa(
            "pnpm",
            ["add", "-D", "tailwindcss", "@tailwindcss/vite"],
            { cwd: frontendDir },
          );
          await setupTailwindVite(
            frontendDir,
            path.join(frontendPath, "frontend", "vite.config.ts"),
          );
        }
      }

      loading = false;
      spinner.succeed(colors.success("Frontend listo"));
    } catch (error) {
      spinner.stop();
      if (i >= maxRetries) {
        loading = false;

        if (error instanceof ExecaError) {
          console.log(
            `${colors.cross} ${colors.brand("Frontend Error")}: ${error.message}`,
          );
          const fallbackSpinner = ora({
            text: colors.cyan(`Creando ${techLabel} Manualmente...`),
            color: "yellow",
          }).start();
          await new Promise((resolve) => setTimeout(resolve, 2500));

          await generateViteManual(
            path.join(frontendPath, "frontend"),
            withTailwind,
          );

          fallbackSpinner.succeed(
            colors.success("Frontend creado manualmente"),
          );
        } else {
          console.log(
            `${colors.cross} ${colors.brand("Frontend Error")}: ${error}`,
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

async function generateViteManual(
  frontendPath: string,
  withTailwind: boolean,
): Promise<void> {
  const appName = path.basename(path.dirname(path.dirname(frontendPath)));

  createFile({
    filePath: path.join(frontendPath, "package.json"),
    content: vitePackageJson(withTailwind),
  });
  createFile({
    filePath: path.join(frontendPath, "index.html"),
    content: viteIndexHtml(appName),
  });
  createFile({
    filePath: path.join(frontendPath, "vite.config.ts"),
    content: viteConfigTs,
  });
  createFile({
    filePath: path.join(frontendPath, "tsconfig.json"),
    content: viteTsConfigJson,
  });

  await fs.ensureDir(path.join(frontendPath, "src"));
  createFile({
    filePath: path.join(frontendPath, "src", "main.tsx"),
    content: viteMainTsx,
  });
  createFile({
    filePath: path.join(frontendPath, "src", "App.tsx"),
    content: viteAppTsx,
  });
  createFile({
    filePath: path.join(frontendPath, "src", "index.css"),
    content: withTailwind ? viteTailwindIndexCss : viteIndexCss,
  });
  createFile({
    filePath: path.join(frontendPath, "src", "vite-env.d.ts"),
    content: viteEnvD,
  });

  if (withTailwind) {
    createFile({
      filePath: path.join(frontendPath, "tailwind.config.js"),
      content: viteTailwindConfig,
    });
    createFile({
      filePath: path.join(frontendPath, "postcss.config.js"),
      content: vitePostcssConfig,
    });
  }
}

async function generateNext(
  frontendPath: string,
  techLabel: string,
): Promise<void> {
  const maxRetries = 3;
  const command = "pnpm";
  const commandTags = ["dlx", "create-next-app", "frontend", "--skip-install"];

  let loading = true;
  let i = 1;

  while (loading) {
    const spinner = ora({
      text: colors.cyan(`Creando ${techLabel}...`),
      color: "yellow",
    }).start();
    try {
      await execa(command, commandTags, {
        stdio: "ignore",
        cwd: `${frontendPath}`,
      });

      loading = false;
      spinner.succeed(colors.success("Frontend listo"));
    } catch (error) {
      spinner.stop();
      if (i >= maxRetries) {
        loading = false;

        if (error instanceof ExecaError) {
          console.log(
            `${colors.cross} ${colors.brand("Frontend Error")}: ${error.message}`,
          );
          const fallbackSpinner = ora({
            text: colors.cyan(`Creando ${techLabel} Manualmente...`),
            color: "yellow",
          }).start();
          await new Promise((resolve) => setTimeout(resolve, 2500));

          await generateNextManual(path.join(frontendPath, "frontend"));
          fallbackSpinner.succeed(
            colors.success("Frontend creado manualmente"),
          );
        } else {
          console.log(
            `${colors.cross} ${colors.brand("Frontend Error")}: ${error}`,
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

async function generateNextManual(frontendPath: string): Promise<void> {
  createFile({
    filePath: path.join(frontendPath, "package.json"),
    content: nextPackageJson(),
  });
  createFile({
    filePath: path.join(frontendPath, "tsconfig.json"),
    content: nextTsConfig,
  });
  createFile({
    filePath: path.join(frontendPath, "next.config.mjs"),
    content: nextConfig,
  });
  createFile({
    filePath: path.join(frontendPath, "next-env.d.ts"),
    content: nextEnvD,
  });

  await fs.ensureDir(path.join(frontendPath, "src", "app"));
  createFile({
    filePath: path.join(frontendPath, "src", "app", "layout.tsx"),
    content: nextAppLayout,
  });
  createFile({
    filePath: path.join(frontendPath, "src", "app", "page.tsx"),
    content: nextAppPage,
  });
}

async function setupTailwindVite(
  frontendDir: string,
  viteConfigPath: string,
): Promise<void> {
  const cssPath = path.join(frontendDir, "src", "index.css");

  let viteConfig = await fs.readFile(viteConfigPath, "utf-8");

  const importStatement = `import tailwindcss from '@tailwindcss/vite';`;
  if (!viteConfig.includes(importStatement)) {
    const lastImportRegex = /^(import .+;)$/m;
    const match = viteConfig.match(lastImportRegex);
    if (match) {
      const lastImportEnd = match.index! + match[0].length;
      viteConfig =
        viteConfig.slice(0, lastImportEnd) +
        `\n${importStatement}` +
        viteConfig.slice(lastImportEnd);
    } else {
      viteConfig = `${importStatement}\n${viteConfig}`;
    }
  }
  const pluginRegex = /plugins\s*:\s*\[/;
  if (pluginRegex.test(viteConfig)) {
    viteConfig = viteConfig.replace(
      pluginRegex,
      (match) => `${match} tailwindcss(),`,
    );
  } else {
    viteConfig = viteConfig.replace(
      /(export\s+default\s+defineConfig\s*\(\s*\{)/,
      `$1\n  plugins: [tailwindcss()],`,
    );
  }

  await fs.writeFile(viteConfigPath, viteConfig, "utf-8");

  let cssContent = await fs.readFile(cssPath, "utf-8");
  const tailwindImport = '@import "tailwindcss";';
  if (!cssContent.startsWith(tailwindImport)) {
    cssContent = `${tailwindImport}\n${cssContent}`;
  }
  await fs.writeFile(cssPath, cssContent, "utf-8");
}
