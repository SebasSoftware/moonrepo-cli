// ---------------------------------------------------------------------------
// Root workspace templates
// ---------------------------------------------------------------------------

import type { CliAnswers } from "./types.d.ts";

export const turboJsonTemplate = `{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
`;

export const pnpmWorkspaceTemplate = `packages:
  - "apps/*"
`;

// Minimal root package.json — only scripts, no deps (we deliberately
// don't run pnpm install so turbo isn't strictly required to bootstrap).
export const rootPackageJson = (projectName: string) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "private": true,
  "description": "Monorepo scaffolded with Moonrepo CLI",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  },
  "packageManager": "pnpm@11.9.0"
}
`;

export const rootReadme = (
  projectName: string,
  frontend: string,
  backend: string,
) => `# ${projectName}

Monorepo scaffolded with [Moonrepo CLI](https://github.com/SebasSoftware/moonrepo-cli).

## Stack

- **Frontend:** ${frontend}
- **Backend:** ${backend}
- **Package manager:** pnpm
- **Task runner:** Turbo

## Layout

\`\`\`
.
├── apps/
│   ├── frontend/   # ${frontend}
│   └── backend/    # ${backend}
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
\`\`\`

## Getting started

\`\`\`bash
pnpm install
pnpm dev
\`\`\`
`;

// ---------------------------------------------------------------------------
// Vite + React (with or without Tailwind)
// ---------------------------------------------------------------------------

export const vitePackageJson = (withTailwind: boolean) => `{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"${withTailwind ? ',\n    "clsx": "^2.1.1"' : ""}
  },
  "devDependencies": {
    "@types/node": "^24.13.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.17",
    "@vitejs/plugin-react": "^6.0.2",
    "typescript": "~6.0.2",
    "vite": "^8.1.0"${
      withTailwind
        ? ',\n    "tailwindcss": "^3.4.14",\n    "postcss": "^8.4.49",\n    "autoprefixer": "^10.4.20"'
        : ""
    }
  }
}
`;

export const viteIndexHtml = (name: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

export const viteEnvD = `/// <reference types="vite/client" />
`;

export const viteMainTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

export const viteIndexCss = `body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
}
`;

export const viteConfigTs = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  clearScreen: false,
});
`;

export const viteTsConfigJson = `{
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
`;

export const viteTailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

export const vitePostcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

// Tailwind-aware CSS replaces the plain one.
export const viteTailwindIndexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

// ---------------------------------------------------------------------------
// Next.js
// ---------------------------------------------------------------------------

export const nextPackageJson = () => `{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.3"
  }
}
`;

export const nextTsConfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;

export const nextEnvD = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;

export const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;

export const nextAppLayout = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js app",
  description: "Scaffolded by Moonrepo CLI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

// ---------------------------------------------------------------------------
// Express
// ---------------------------------------------------------------------------

export const expressPackageJson = () => `{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "dev": "node --watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^4.21.1",
    "cors": "^2.8.5",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/morgan": "^1.9.9",
    "@types/node": "^22.10.0",
    "typescript": "^5.6.3",
    "tsx": "^4.19.0"
  }
}
`;

export const expressTsConfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
`;

export const expressIndexTs = `import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "express-backend" });
});

app.listen(PORT, () => {
  console.log(\`Express API listening on http://localhost:\${PORT}\`);
});
`;

// ---------------------------------------------------------------------------
// NestJS
// ---------------------------------------------------------------------------

export const nestPackageJson = (name: string) => `{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nest start --watch --preserveWatchOutput",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint ."
  },
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/platform-express": "^11.0.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/node": "^24.0.0",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3"
  }
}
`;

export const nestTsConfig = `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
`;

export const nestTsConfigBuild = `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
`;

export const nestMain = `import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(\`NestJS API listening on http://localhost:\${port}\`);
}

bootstrap();
`;

export const nestAppModule = `import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { HealthService } from "./health/health.service";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
`;

export const nestHealthController = `import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("api/health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.getSystemState();
  }
}
`;

export const nestHealthService = `import { Injectable } from "@nestjs/common";
@Injectable()
export class HealthService {
  getSystemState() {
    return { status: "ok", service: "nest-backend" };
  }
}
`;

export const nestNestCliJson = `{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`;

// ---------------------------------------------------------------------------
// Common .gitignore fragments
// ---------------------------------------------------------------------------

export const gitignore = `# Dependencies
node_modules/
.pnpm-store/

# Builds
dist/
build/
.next/
.turbo/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Env
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
.DS_Store
`;

export const presentPageTailwind = (
  props: CliAnswers,
) => `import React from "react";

const Present = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col justify-center items-center">
        {/* Título con brand red */}
        <h1 className="text-5xl font-bold text-[#FF3B30] text-center tracking-tight drop-shadow-lg">
          🚀 Moonrepo CLI
        </h1>

        <div className="mt-3 text-center text-lg text-gray-400 flex justify-center items-center">
          <span className="flex items-center gap-1">
            <span className="rounded bg-purple-200 px-1.5 py-0.5 text-xs font-mono text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
              pnpm
            </span>
            <span className="text-gray-400">+</span>
            <span className="rounded bg-blue-200 px-1.5 py-0.5 text-xs font-mono text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              turbo
            </span>
            <span className="text-gray-400">+</span>
            <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-xs font-mono text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              monorepo
            </span>
          </span>{" "}
          – scaffolded in seconds
        </div>

        {/* Resumen de configuración - Fondo gris oscuro con borde sutil */}
        <div className="mt-10 bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <span className="font-medium text-gray-400">
                📦 Nombre del proyecto:
              </span>{" "}
              <span className="font-mono bg-gray-900 px-2 py-0.5 rounded text-[#A78BFA] border border-gray-700">
                ${props.projectName}
              </span>
            </li>
            <li>
              <span className="font-medium text-gray-400">
                ⚛️ Framework FRONTEND:
              </span>{" "}
              <span className="text-white">${props.frontend}</span>
            </li>
            <li>
              <span className="font-medium text-gray-400">
                🎨 Tailwind CSS:
              </span>{" "}
              <span className="text-white">${props.withTailwind ? "Sí" : "No"}</span>
            </li>
            <li>
              <span className="font-medium text-gray-400">
                🖥️ Framework BACKEND:
              </span>{" "}
              <span className="text-white">${props.backend}</span>
            </li>
          </ul>

          <hr className="my-4 border-gray-700" />

          <ul className="space-y-2 text-base">
            <li className="flex items-center gap-2">
              <span className="text-[#22C55E] text-xl">✔</span> Frontend{" "}
              <span className="text-white">
                ${"listo"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#22C55E] text-xl">✔</span> Backend{" "}
              <span className="text-white">
                ${"listo"}
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Hecho con ❤ por Moonrepo CLI
        </div>
      </div>
    </div>
  );
};

export default Present;
`;

export const presentPage = (props: CliAnswers) => `import React from "react";

const Present = () => {
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: '#f3f4f6',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    wrapper: {
      maxWidth: '42rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: '3rem',
      paddingBottom: '3rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: '3rem',
      lineHeight: '1',
      fontWeight: '700',
      color: '#FF3B30',
      textAlign: 'center' as const,
      letterSpacing: '-0.025em',
      filter:
        'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    },
    subtitle: {
      marginTop: '0.75rem',
      textAlign: 'center' as const,
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
      color: '#9ca3af',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    badgePurple: {
      borderRadius: '0.25rem',
      background: 'rgba(76, 29, 149, 0.4)',
      paddingLeft: '0.375rem',
      paddingRight: '0.375rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      color: '#d8b4fe',
    },
    badgeBlue: {
      borderRadius: '0.25rem',
      background: 'rgba(30, 58, 138, 0.4)',
      paddingLeft: '0.375rem',
      paddingRight: '0.375rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      color: '#93c5fd',
    },
    badgeEmerald: {
      borderRadius: '0.25rem',
      background: 'rgba(6, 78, 59, 0.4)',
      paddingLeft: '0.375rem',
      paddingRight: '0.375rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      color: '#6ee7b7',
    },
    grayText: {
      color: '#9ca3af',
    },
    card: {
      marginTop: '2.5rem',
      backgroundColor: '#1f2937',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #374151',
    },
    cardList: {
      marginTop: '1rem',
      listStyle: 'none',
      padding: 0,
    },
    li: {
      marginBottom: '0.5rem',
    },
    label: {
      fontWeight: '500',
      color: '#9ca3af',
    },
    valueMono: {
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      backgroundColor: '#111827',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      borderRadius: '0.25rem',
      color: '#A78BFA',
      border: '1px solid #374151',
    },
    valueWhite: {
      color: '#ffffff',
    },
    hr: {
      marginTop: '1rem',
      marginBottom: '1rem',
      border: 'none',
      borderTop: '1px solid #374151',
    },
    checklistItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    checkIcon: {
      color: '#22C55E',
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    footer: {
      marginTop: '2.5rem',
      textAlign: 'center' as const,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>🚀 Moonrepo CLI</h1>

        <div style={styles.subtitle}>
          <span style={styles.badgeContainer}>
            <span style={styles.badgePurple}>pnpm</span>
            <span style={styles.grayText}> + </span>
            <span style={styles.badgeBlue}>turbo</span>
            <span style={styles.grayText}> + </span>
            <span style={styles.badgeEmerald}>monorepo</span>
          </span>{" "}
          – scaffolded in seconds
        </div>

        <div style={styles.card}>
          <ul style={styles.cardList}>
            <li style={styles.li}>
              <span style={styles.label}>📦 Nombre del proyecto:</span>{" "}
              <span style={styles.valueMono}>${props.projectName}</span>
            </li>
            <li style={styles.li}>
              <span style={styles.label}>⚛️ Framework FRONTEND:</span>{" "}
              <span style={styles.valueWhite}>${props.frontend}</span>
            </li>
            <li style={styles.li}>
              <span style={styles.label}>🎨 Tailwind CSS:</span>{" "}
              <span style={styles.valueWhite}>${props.withTailwind ? "Sí" : "No"}</span>
            </li>
            <li style={styles.li}>
              <span style={styles.label}>🖥️ Framework BACKEND:</span>{" "}
              <span style={styles.valueWhite}>${props.backend}</span>
            </li>
          </ul>

          <hr style={styles.hr} />

          <ul style={styles.cardList}>
            <li style={styles.checklistItem}>
              <span style={styles.checkIcon}>✔</span> Frontend{" "}
              <span style={styles.valueWhite}>listo</span>
            </li>
            <li style={styles.checklistItem}>
              <span style={styles.checkIcon}>✔</span> Backend{" "}
              <span style={styles.valueWhite}>listo</span>
            </li>
          </ul>
        </div>

        <div style={styles.footer}>
          Hecho con ❤ por Moonrepo CLI
        </div>
      </div>
    </div>
  );
};

export default Present;
`;
