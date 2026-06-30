// ---------------------------------------------------------------------------
// Root workspace templates
// ---------------------------------------------------------------------------

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

Monorepo scaffolded with [Moonrepo CLI](https://github.com/your-org/moonrepo).

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

export const viteAppTsx = `export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Vite + React</h1>
        <p className="text-slate-300">Scaffolded by Moonrepo CLI</p>
      </div>
    </main>
  );
}
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

export const nextPackageJson = (name: string) => `{
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

export const nextAppPage = `export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 700 }}>Next.js</h1>
        <p style={{ color: "#64748b" }}>Scaffolded by Moonrepo CLI</p>
      </div>
    </main>
  );
}
`;

// ---------------------------------------------------------------------------
// Express
// ---------------------------------------------------------------------------

export const expressPackageJson = (name: string) => `{
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
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(morgan("dev"));
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
