// Standalone smoke test that exercises the generators end-to-end
// without going through inquirer. Run with:
//
//   node --import tsx scripts/smoke.ts <projectName> <frontend> <backend> [withTailwind]
//
// frontend ∈ vite|next, backend ∈ express|nest
//
// This file lives outside src/ on purpose so it's not part of the
// published CLI; it's a developer convenience for verifying the
// generated output before shipping.

import path from "node:path";
import fs from "fs-extra";
import { generateBackend } from "../src/generators/backend.ts";
import { generateFrontend } from "../src/generators/frontend.ts";
import { generateWorkspace } from "../src/generators/workspace.ts";
import {
  BACKEND_FRAMEWORKS,
  BACKEND_LABELS,
  FRONTEND_FRAMEWORKS,
  FRONTEND_LABELS,
} from "../src/enums.ts";

const [, , name, frontendArg, backendArg, tailwindArg] = process.argv;
if (!name || !frontendArg || !backendArg) {
  console.error(
    "usage: smoke.ts <name> <vite|next> <express|nest> [withTailwind:true|false]",
  );
  process.exit(1);
}

const frontend = frontendArg === "next" ? FRONTEND_FRAMEWORKS.NEXT : FRONTEND_FRAMEWORKS.VITE;
const backend = backendArg === "nest" ? BACKEND_FRAMEWORKS.NEST : BACKEND_FRAMEWORKS.EXPRESS;
const withTailwind = tailwindArg !== "false";

const projectPath = path.join(process.cwd(), name);

if (await fs.pathExists(projectPath)) {
  console.error(`refusing to overwrite existing path: ${projectPath}`);
  process.exit(1);
}

await generateWorkspace(
  projectPath,
  name,
  FRONTEND_LABELS[frontend] + (withTailwind ? " + Tailwind" : ""),
  BACKEND_LABELS[backend],
);
await generateFrontend(projectPath, frontend, { withTailwind });
await generateBackend(projectPath, backend);

// Walk the generated tree and print it as a flat list, then read back
// a few key files to verify the templates actually rendered.
async function walk(dir: string, prefix = ""): Promise<string[]> {
  const entries = (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const out: string[] = [];
  for (const e of entries) {
    const rel = `${prefix}${e.name}`;
    if (e.isDirectory()) {
      out.push(`${rel}/`);
      out.push(...(await walk(path.join(dir, e.name), `${rel}/`)));
    } else {
      out.push(rel);
    }
  }
  return out;
}

const files = await walk(projectPath);
console.log("--- generated tree ---");
for (const f of files) console.log(f);

// Sanity-check a few important files are non-empty and contain the
// expected markers.
const expectations: Array<{ path: string; mustContain: string[] }> = [
  { path: "package.json", mustContain: [`"name": "${name}"`] },
  { path: "pnpm-workspace.yaml", mustContain: ["apps/*"] },
  { path: "turbo.json", mustContain: ["tasks"] },
  { path: ".gitignore", mustContain: ["node_modules/"] },
  { path: "README.md", mustContain: [name] },
  { path: "apps/frontend/package.json", mustContain: ["\"name\":"] },
  { path: "apps/backend/package.json", mustContain: ["\"name\":"] },
];

if (frontend === FRONTEND_FRAMEWORKS.VITE) {
  expectations.push({ path: "apps/frontend/vite.config.ts", mustContain: ["defineConfig"] });
  if (withTailwind) {
    expectations.push({ path: "apps/frontend/tailwind.config.js", mustContain: ["tailwindcss"] });
  }
} else {
  expectations.push({ path: "apps/frontend/next.config.mjs", mustContain: ["nextConfig"] });
}

if (backend === BACKEND_FRAMEWORKS.NEST) {
  expectations.push({ path: "apps/backend/src/main.ts", mustContain: ["NestFactory"] });
  expectations.push({ path: "apps/backend/nest-cli.json", mustContain: ["@nestjs/schematics"] });
} else {
  expectations.push({ path: "apps/backend/src/index.ts", mustContain: ["express"] });
}

let failed = 0;
for (const { path: rel, mustContain } of expectations) {
  const full = path.join(projectPath, rel);
  const content = await fs.readFile(full, "utf8");
  for (const needle of mustContain) {
    if (!content.includes(needle)) {
      console.error(`FAIL: ${rel} missing "${needle}"`);
      failed += 1;
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} expectation(s) failed`);
  process.exit(1);
}

console.log("\n--- ok (all expectations met) ---");
