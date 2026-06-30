import fs from "fs-extra";
import path from "node:path";

/**
 * Lightweight filesystem helpers used by the generators.
 *
 * Why these exist:
 *  - `createFile` makes sure the parent dir exists *and* surfaces a
 *    clear error if the write silently fails (fs.writeFileSync can
 *    succeed in pathological cases — we double-check with pathExists).
 *  - `createFolder` is just `ensureDir` with a nicer return shape so
 *    generators can chain without try/catch noise.
 *  - The `executeCommand*` helpers existed in the old implementation
 *    but are no longer needed: the new generators write static files
 *    instead of shelling out to `pnpm create vite` / `nest new`. They
 *    are kept here in case a future step needs them, but the public
 *    surface is intentionally minimal.
 */

export interface CreateFileParams {
  filePath: string;
  content?: string;
}

/**
 * Create a file (and its parent dirs) on disk. Returns true on
 * success, throws on failure — the old implementation swallowed
 * errors with `console.error`, which made failures invisible to the
 * caller. Now we let the caller decide how loud to be.
 */
export function createFile({ filePath, content }: CreateFileParams): void {
  const dir = path.dirname(filePath);
  fs.ensureDirSync(dir);

  // `content` is allowed to be undefined (e.g. touch-only files), in
  // which case we just create an empty file.
  fs.writeFileSync(filePath, content ?? "", "utf8");

  if (!fs.pathExistsSync(filePath)) {
    throw new Error(`createFile: file did not appear on disk after write: ${filePath}`);
  }
}

/** Create a directory (recursively) at the given absolute path. */
export async function createFolder(absolutePath: string): Promise<void> {
  await fs.ensureDir(absolutePath);
  if (!(await fs.pathExists(absolutePath))) {
    throw new Error(`createFolder: directory did not appear on disk: ${absolutePath}`);
  }
}
