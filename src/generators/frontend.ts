import fs from "fs-extra";
import path from "node:path";
import { colors } from "../ui.ts";
import { createFile } from "../utils.ts";
import {
  FRONTEND_FRAMEWORKS,
  FRONTEND_LABELS,
  type FrontendFramework,
} from "../enums.ts";
import {
  nextAppLayout,
  nextAppPage,
  nextConfig,
  nextPackageJson,
  nextTsConfig,
  viteAppTsx,
  viteConfigTs,
  viteIndexCss,
  viteIndexHtml,
  viteMainTsx,
  vitePackageJson,
  vitePostcssConfig,
  viteTailwindConfig,
  viteTailwindIndexCss,
} from "../templates.ts";
import { execa, ExecaError } from "execa";
import ora, { spinners } from "ora";

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
    await generateVite(frontendPath, options.withTailwind);
  } else if (frontend === FRONTEND_FRAMEWORKS.NEXT) {
    await generateNext(frontendPath, FRONTEND_LABELS.next);
  } else {
    throw new Error(`Unknown frontend framework: ${frontend}`);
  }
}

async function generateVite(
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
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src", "vite.config.ts"]
}
`,
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
    content: `/// <reference types="vite/client" />
`,
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
    try {
      console.log(
        `${colors.info(`Intentando crear proyecto de ${techLabel}...`)}`,
      );
      await execa(command, commandTags, {
        stdio: "ignore",
        cwd: `${frontendPath}`,
      });

      loading = false;
      console.log(colors.success("Frontend listo"));
    } catch (error) {
      if (i >= maxRetries) {
        loading = false;

        if (error instanceof ExecaError) {
          console.log(
            `${colors.cross} ${colors.brand("Frontend Error")}: ${error.message}`,
          );
          const spinner = ora({
            text: colors.cyan(`Creando ${techLabel} Manúalmente...`),
            color: "yellow",
          }).start();
          await new Promise((resolve) => setTimeout(resolve, 2500));

          await generateNextManual(path.join(frontendPath, "frontend"));
          spinner.succeed(colors.success("Frontend listo"));
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

/** Pretty log line — used by index.ts after generation succeeds. */
export function frontendDoneLabel(
  frontend: FrontendFramework,
  withTailwind: boolean,
): string {
  const tail =
    frontend === FRONTEND_FRAMEWORKS.VITE && withTailwind ? " + Tailwind" : "";
  return `${colors.cyan(frontend)}${colors.muted(tail)}`;
}

async function generateNextManual(frontendPath: string): Promise<void> {
  const appName = path.basename(path.dirname(path.dirname(frontendPath)));

  createFile({
    filePath: path.join(frontendPath, "package.json"),
    content: nextPackageJson(appName),
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
    content: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`,
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
