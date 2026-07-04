// Framework identifiers used throughout the CLI. Kept as plain string
// unions so the inquirer prompts (which can't serialise const objects)
// can still receive them safely.

import { BACKEND_FRAMEWORKS, FRONTEND_FRAMEWORKS } from "./constants";

export type FrontendFramework =
  (typeof FRONTEND_FRAMEWORKS)[keyof typeof FRONTEND_FRAMEWORKS];
export type BackendFramework =
  (typeof BACKEND_FRAMEWORKS)[keyof typeof BACKEND_FRAMEWORKS];

export interface CliAnswers {
  projectName: string;
  frontend: FrontendFramework;
  backend: BackendFramework;
  withTailwind: boolean;
}
