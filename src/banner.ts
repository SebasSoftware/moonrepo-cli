import chalk from "chalk";
import { colors } from "./ui.ts";

/**
 * Big "MOONREPO" wordmark in the spirit of Claude Code's launcher.
 *
 * Each glyph is 6 rows tall. To keep things simple we render the word
 * in a single flat red, then drop a coloured sub-tagline underneath
 * that mixes cyan / yellow / magenta so the launch screen has more
 * visual punch than a single-colour logo.
 *
 * Note: GLYPHS is an array indexed by character, not a Record, because
 * TS won't let two "O" keys live in the same object literal — and
 * MOONREPO needs three O's.
 */

// prettier-ignore
const GLYPHS: Record<string, string[]> = {
  M: [
    "███      ███",
    "████    ████",
    "██  ██  ██  ██",
    "██   ████   ██",
    "██          ██",
    "██          ██",
  ],
  O: [
    " ██████ ",
    "██    ██",
    "██    ██",
    "██    ██",
    "██    ██",
    " ██████ ",
  ],
  N: [
    "██    ██",
    "███   ██",
    "████  ██",
    "██ ██ ██",
    "██  ████",
    "██    ██",
  ],
  R: [
    "██████  ",
    "██   ██ ",
    "██   ██ ",
    "██████  ",
    "██  ██  ",
    "██   ██ ",
  ],
  E: [
    "███████",
    "██     ",
    "██     ",
    "█████  ",
    "██     ",
    "███████",
  ],
  P: [
    "██████ ",
    "██   ██",
    "██   ██",
    "██████ ",
    "██     ",
    "██     ",
  ],
  " ": [
    "   ",
    "   ",
    "   ",
    "   ",
    "   ",
    "   ",
  ],
};

function glyphRows(letter: string): string[] {
  const upper = letter.toUpperCase();
  return GLYPHS[upper] ?? GLYPHS[" "] ?? [];
}

function coloriseGlyphRows(letter: string): string[] {
  // Each glyph row gets the brand red base, but we tint the final
  // row of every letter with a slightly different accent so the
  // wordmark doesn't look completely flat. This is subtle but adds
  // a touch of Claude-Code-style depth.
  const rows = glyphRows(letter);
  return rows.map((row, i) => {
    if (i === rows.length - 1) {
      return chalk.hex("#FF6B61").bold(row);
    }
    return colors.brand(row);
  });
}

/**
 * Render the big "MOONREPO" banner. Returns the rendered string so
 * callers can both print it and reuse it (e.g. for tests).
 */
export function printBanner(): string {
  const lines: string[] = ["", "", "", "", "", ""];
  const word = "MOONREPO";
  for (const letter of word) {
    const rows = coloriseGlyphRows(letter);
    rows.forEach((row, idx) => {
      lines[idx] = (lines[idx] ?? "") + row + " ";
    });
  }
  const out = lines.join("\n");
  process.stdout.write(`${out}\n`);
  return out;
}

/**
 * Print the colourful sub-tagline that sits under the wordmark.
 * Mixes cyan / yellow / magenta / brand red so the launch screen
 * has a Claude-Code-style accent strip.
 */
export function printTagline(): void {
  const parts = [
    colors.cyan("pnpm"),
    colors.dim("+"),
    colors.yellow("turbo"),
    colors.dim("+"),
    colors.magenta("monorepo"),
    colors.dim("·"),
    colors.brandSoft("scaffolded in seconds"),
  ];
  process.stdout.write(`\n${colors.arrow} ${parts.join(" ")}\n\n`);
}

/**
 * Print a small "moon" mark that fits in the corner of sections —
 * used as a visual divider inside the prompts flow.
 */
export function printDivider(): void {
  process.stdout.write(`${colors.dim("─".repeat(56))}\n`);
}
