import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "node:path";

import { printBanner, printDivider, printTagline } from "./banner.ts";
import {
  BACKEND_FRAMEWORKS,
  BACKEND_LABELS,
  FRONTEND_FRAMEWORKS,
  FRONTEND_LABELS,
  type BackendFramework,
  type FrontendFramework,
} from "./enums.ts";
import { generateBackend, backendDoneLabel } from "./generators/backend.ts";
import { frontendDoneLabel, generateFrontend } from "./generators/frontend.ts";
import { generateWorkspace } from "./generators/workspace.ts";
import { colors } from "./ui.ts";

// ---------------------------------------------------------------------------
// 1. Launch screen
// ---------------------------------------------------------------------------

printBanner();
printTagline();
printDivider();

// ---------------------------------------------------------------------------
// 2. Prompts
// ---------------------------------------------------------------------------

interface CliAnswers {
  projectName: string;
  frontend: FrontendFramework;
  backend: BackendFramework;
  withTailwind: boolean;
}

const { projectName } = await inquirer.prompt<{ projectName: string }>([
  {
    type: "input",
    name: "projectName",
    message: colors.cyan("¿Cuál es el nombre del proyecto?"),
    default: "moonrepo-app",
    validate: (input: string) => {
      const trimmed = input.trim();
      if (trimmed.length < 4)
        return "El nombre debe tener al menos 4 caracteres";
      if (!/^[a-z0-9-_]+$/i.test(trimmed)) {
        return "Usa solo letras, números, guiones o guiones bajos";
      }
      return true;
    },
    filter: (input: string) => input.trim(),
  },
]);

const { frontend } = await inquirer.prompt<{ frontend: FrontendFramework }>([
  {
    type: "select",
    name: "frontend",
    message: colors.cyan("Elige un framework de FRONTEND:"),
    choices: Object.values(FRONTEND_FRAMEWORKS).map((value) => ({
      name: FRONTEND_LABELS[value],
      value,
    })),
  },
]);

let withTailwind = false;
if (frontend === FRONTEND_FRAMEWORKS.VITE) {
  const { tailwind } = await inquirer.prompt<{ tailwind: boolean }>([
    {
      type: "confirm",
      name: "tailwind",
      message: colors.cyan("¿Quieres usar Tailwind CSS en el frontend?"),
      default: true,
    },
  ]);
  withTailwind = tailwind;
}

const { backend } = await inquirer.prompt<{ backend: BackendFramework }>([
  {
    type: "select",
    name: "backend",
    message: colors.cyan("Elige un framework de BACKEND:"),
    choices: Object.values(BACKEND_FRAMEWORKS).map((value) => ({
      name: BACKEND_LABELS[value],
      value,
    })),
  },
]);

const answers: CliAnswers = { projectName, frontend, backend, withTailwind };

// ---------------------------------------------------------------------------
// 3. Summary of what we're about to build
// ---------------------------------------------------------------------------

printDivider();
process.stdout.write(`${colors.arrow} ${colors.dim("Resumen")}\n`);
process.stdout.write(
  `  ${colors.bullet} ${colors.muted("Proyecto:")}    ${colors.brand(projectName)}\n`,
);
process.stdout.write(
  `  ${colors.bullet} ${colors.muted("Frontend:")}    ${frontendDoneLabel(answers.frontend, answers.withTailwind)}\n`,
);
process.stdout.write(
  `  ${colors.bullet} ${colors.muted("Backend:")}     ${backendDoneLabel(answers.backend)}\n`,
);
process.stdout.write(
  `  ${colors.bullet} ${colors.muted("Ubicación:")}   ${colors.dim(path.resolve(process.cwd(), projectName))}\n`,
);
printDivider();

// ---------------------------------------------------------------------------
// 4. Generate
// ---------------------------------------------------------------------------

const projectPath = path.join(process.cwd(), projectName);

// Refuse to overwrite an existing directory — saves the user from
// accidentally clobbering work.
if (await fs.pathExists(projectPath)) {
  process.stderr.write(
    `\n${colors.cross} La carpeta ${colors.brand(projectName)} ya existe en ${colors.dim(path.dirname(projectPath))}\n`,
  );
  process.exit(1);
}

try {
  await generateWorkspace(
    projectPath,
    projectName,
    FRONTEND_LABELS[answers.frontend] +
      (answers.withTailwind ? " + Tailwind" : ""),
    BACKEND_LABELS[answers.backend],
  );

  try {
    await generateFrontend(projectPath, answers.frontend, {
      withTailwind: answers.withTailwind,
    });
  } catch (err) {
    throw err;
  }

  const beSpinner = ora({
    text: colors.muted(
      `Generando backend (${BACKEND_LABELS[answers.backend]})...`,
    ),
    color: "yellow",
  }).start();
  try {
    await generateBackend(projectPath, answers.backend);
    beSpinner.succeed(colors.success("Backend listo"));
  } catch (err) {
    beSpinner.fail(
      colors.error(`Error generando backend: ${(err as Error).message}`),
    );
    throw err;
  }
} catch (err) {
  // Best-effort cleanup so the user doesn't end up with a half-baked folder.
  if (await fs.pathExists(projectPath)) {
    await fs.remove(projectPath);
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Next steps
// ---------------------------------------------------------------------------

printDivider();
process.stdout.write(
  `${colors.sparkle} ${colors.brand("¡Listo!")} Tu monorepo está en ${colors.brand(projectName)}\n\n`,
);

const nextSteps = [
  `${colors.arrow} ${colors.muted("Entra al proyecto:")}`,
  `    ${colors.cyan("cd")} ${colors.brand(projectName)}`,
  ``,
  `${colors.arrow} ${colors.muted("Instala las dependencias:")}`,
  `    ${colors.cyan("pnpm")} ${colors.yellow("install")}`,
  ``,
  `${colors.arrow} ${colors.muted("Arranca el dev server:")}`,
  `    ${colors.cyan("pnpm")} ${colors.yellow("dev")}`,
];
process.stdout.write(nextSteps.join("\n") + "\n");

printDivider();
process.stdout.write(
  `${colors.muted("Hecho con ")}${colors.brand("♥")}${colors.muted(" por Moonrepo CLI")}\n`,
);
