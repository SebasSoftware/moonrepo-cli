import fs from "fs-extra";
import Handlebars from "handlebars";
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
    throw new Error(
      `createFile: file did not appear on disk after write: ${filePath}`,
    );
  }
}

/** Create a directory (recursively) at the given absolute path. */
export async function createFolder(absolutePath: string): Promise<void> {
  await fs.ensureDir(absolutePath);
  if (!(await fs.pathExists(absolutePath))) {
    throw new Error(
      `createFolder: directory did not appear on disk: ${absolutePath}`,
    );
  }
}

export const checkFileExists = async (
  filePath: string,
  maxRetries = 5,
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const exists = await fs.pathExists(filePath);
    if (exists) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
};

export async function addScriptToPackageJson(
  filePath: string,
  newScript: { key: string; value: string },
): Promise<void> {
  if (
    !newScript ||
    typeof newScript.key !== "string" ||
    typeof newScript.value !== "string"
  ) {
    throw new Error(
      'newScript debe ser un objeto con { key: "nombre", value: "comando" }',
    );
  }

  let content = await fs.readFile(filePath, "utf8");
  const scriptsRegex = /"scripts"\s*:\s*\{([\s\S]*?)\}/;
  const match = content.match(scriptsRegex);

  if (!match) {
    throw new Error('No se encontró la sección "scripts" en el archivo.');
  }

  const scriptsInner = match[1].trim();
  const template = Handlebars.compile('"{{key}}": "{{value}}"');
  const newScriptLine = template(newScript); // ej: "start": "node index.js"

  let newScriptsBlock;
  if (scriptsInner.length > 0) {
    newScriptsBlock = `"scripts": {\n${scriptsInner},\n  ${newScriptLine}\n}`;
  } else {
    newScriptsBlock = `"scripts": {\n  ${newScriptLine}\n}`;
  }

  const newContent = content.replace(scriptsRegex, newScriptsBlock);
  await fs.writeFile(filePath, newContent, "utf8");
}

export async function addViteConfig<T>(
  filePath: string,
  configObj: { key: string; value: T },
) {
  // 1. Leer el archivo
  const content = await fs.readFile(filePath, "utf8");

  // 2. Localizar el inicio de defineConfig mediante regex
  const defineConfigRegex = /export\s+default\s+defineConfig\s*\(/;
  const match = defineConfigRegex.exec(content);
  if (!match) {
    throw new Error(
      'No se encontró "export default defineConfig" en el archivo.',
    );
  }
  const startAfterDefine = match.index + match[0].length;

  // 3. Encontrar la primera llave de apertura del objeto
  const openBraceIndex = content.indexOf("{", startAfterDefine);
  if (openBraceIndex === -1) {
    throw new Error('No se encontró el objeto de configuración (falta "{").');
  }

  // 4. Encontrar la llave de cierre correspondiente (balanceo de llaves)
  let braceCount = 0;
  let closeBraceIndex = -1;
  for (let i = openBraceIndex; i < content.length; i++) {
    const ch = content[i];
    if (ch === "{") braceCount++;
    else if (ch === "}") {
      braceCount--;
      if (braceCount === 0) {
        closeBraceIndex = i;
        break;
      }
    }
  }
  if (closeBraceIndex === -1) {
    throw new Error(
      "No se pudo encontrar el cierre del objeto de configuración.",
    );
  }

  // 5. Extraer el contenido interno del objeto
  const objectContent = content.substring(openBraceIndex + 1, closeBraceIndex);
  const trimmedContent = objectContent.trim();
  const hasProps = trimmedContent.length > 0;

  // 6. Determinar si el objeto está en una sola línea o en múltiples líneas
  const isMultiLine = objectContent.includes("\n");

  // 7. Detectar la indentación usada en las propiedades existentes
  let indent = "";
  if (hasProps) {
    const lines = objectContent.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0) {
        const indentMatch = line.match(/^(\s*)/);
        if (indentMatch) {
          indent = indentMatch[1];
          break;
        }
      }
    }
  }
  if (!indent) {
    indent = "  "; // indentación por defecto (2 espacios)
  }

  // 8. Serializar el valor y construir la nueva línea con Handlebars
  const key = configObj.key;
  const valueStr = JSON.stringify(configObj.value);
  const template = Handlebars.compile("{{key}}: {{{value}}}"); // triple {{{ }}} para no escapar
  const newPropLine = template({ key, value: valueStr });

  // 9. Decidir el texto a insertar (coma, saltos, etc.)
  let insertText = "";
  if (hasProps) {
    // Verificar si el contenido ya termina con coma (ignorando espacios)
    const endsWithComma = /,\s*$/.test(trimmedContent);
    if (isMultiLine) {
      // Multilínea: agregar nueva línea con indentación
      insertText = endsWithComma
        ? `\n${indent}${newPropLine}`
        : `,\n${indent}${newPropLine}`;
    } else {
      // Una sola línea
      insertText = endsWithComma ? ` ${newPropLine}` : `, ${newPropLine}`;
    }
  } else {
    // Objeto vacío: mantener el mismo estilo (una línea o multilínea)
    if (isMultiLine) {
      insertText = `\n${indent}${newPropLine}`;
    } else {
      insertText = ` ${newPropLine}`;
    }
  }

  // 10. Insertar la nueva propiedad antes de la llave de cierre
  const newContent =
    content.substring(0, closeBraceIndex) +
    insertText +
    content.substring(closeBraceIndex);

  // 11. Escribir el archivo modificado
  await fs.writeFile(filePath, newContent, "utf8");
}
