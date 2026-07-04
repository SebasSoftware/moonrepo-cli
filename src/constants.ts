import type { BackendFramework, FrontendFramework } from "./types.d.ts";

export const FRONTEND_FRAMEWORKS = {
  VITE: "vite",
  NEXT: "next",
} as const;

export const BACKEND_FRAMEWORKS = {
  EXPRESS: "express",
  NEST: "nest",
} as const;

export const FRONTEND_LABELS: Record<FrontendFramework, string> = {
  [FRONTEND_FRAMEWORKS.VITE]: "Vite + React",
  [FRONTEND_FRAMEWORKS.NEXT]: "Next.js",
};

export const BACKEND_LABELS: Record<BackendFramework, string> = {
  [BACKEND_FRAMEWORKS.EXPRESS]: "Express",
  [BACKEND_FRAMEWORKS.NEST]: "NestJS",
};
