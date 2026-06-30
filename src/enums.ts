// Framework identifiers used throughout the CLI. Kept as plain string
// unions so the inquirer prompts (which can't serialise const objects)
// can still receive them safely.

export const FRONTEND_FRAMEWORKS = {
  VITE: "vite",
  NEXT: "next",
} as const;

export const BACKEND_FRAMEWORKS = {
  EXPRESS: "express",
  NEST: "nest",
} as const;

export type FrontendFramework = (typeof FRONTEND_FRAMEWORKS)[keyof typeof FRONTEND_FRAMEWORKS];
export type BackendFramework = (typeof BACKEND_FRAMEWORKS)[keyof typeof BACKEND_FRAMEWORKS];

// Human-friendly labels (displayed in prompts).
export const FRONTEND_LABELS: Record<FrontendFramework, string> = {
  [FRONTEND_FRAMEWORKS.VITE]: "Vite + React",
  [FRONTEND_FRAMEWORKS.NEXT]: "Next.js",
};

export const BACKEND_LABELS: Record<BackendFramework, string> = {
  [BACKEND_FRAMEWORKS.EXPRESS]: "Express",
  [BACKEND_FRAMEWORKS.NEST]: "NestJS",
};

export function isFrontendFramework(value: string): value is FrontendFramework {
  return Object.values(FRONTEND_FRAMEWORKS).includes(value as FrontendFramework);
}

export function isBackendFramework(value: string): value is BackendFramework {
  return Object.values(BACKEND_FRAMEWORKS).includes(value as BackendFramework);
}
