import chalk from "chalk";

/**
 * Centralised colour palette for the CLI.
 *
 * Picking everything from a single source means the look stays
 * consistent as new screens get added and lets us tweak the brand
 * colours in one place. Hex values are deliberately close to the
 * Claude Code / Cursor vibe: a warm red as the accent, with cooler
 * blues and greens for status feedback.
 */
export const colors = {
  // Brand
  brand: chalk.hex("#FF3B30").bold, // MOONREPO red
  brandSoft: chalk.hex("#FF6B61"),

  // Status
  success: chalk.hex("#22C55E").bold, // green
  warn: chalk.hex("#F59E0B").bold, // amber
  error: chalk.hex("#EF4444").bold, // red
  info: chalk.hex("#3B82F6"), // blue

  // UI building blocks
  muted: chalk.hex("#6B7280"),
  dim: chalk.gray,
  accent: chalk.hex("#A78BFA").bold, // purple
  cyan: chalk.cyan,
  magenta: chalk.hex("#EC4899").bold, // pink
  yellow: chalk.hex("#FACC15").bold,

  // Glyphs
  arrow: chalk.hex("#FF3B30").bold("▸"),
  bullet: chalk.hex("#A78BFA")("•"),
  check: chalk.hex("#22C55E").bold("✓"),
  cross: chalk.hex("#EF4444").bold("✗"),
  rocket: chalk.hex("#FF3B30")("▲"),
  sparkle: chalk.hex("#FACC15")("✦"),
} as const;

/**
 * Wrap a value with the brand red. Used for the project name in
 * the final "cd <name>" instructions so it pops.
 */
export const brandName = (name: string) => colors.brand(name);

/** Decorative horizontal rule. */
export function hr(char = "─", width = 56, color: (s: string) => string = colors.dim): string {
  return color(char.repeat(width));
}

/** Box a string block with a coloured frame. */
export function box(title: string, body: string[], color: (s: string) => string = colors.brand): string {
  const width = Math.max(title.length + 4, ...body.map((l) => l.length + 2), 40);
  const top = color("╭" + "─".repeat(width) + "╮");
  const titleLine = color("│ ") + chalk.bold(title) + color(" │").padStart(width - title.length + 1, " ");
  const bottom = color("╰" + "─".repeat(width) + "╯");
  const bodyLines = body.map((line) => color("│ ") + line + color(" │").padStart(width - line.length + 1, " "));
  return [top, titleLine, ...bodyLines, bottom].join("\n");
}

/** Big multi-line coloured block — used for the "next steps" summary. */
export function coloredBlock(lines: string[]): string {
  return lines
    .map((l) => {
      // Naive highlighter: anything in <angle> brackets gets the brand colour.
      const highlighted = l.replace(/<([^>]+)>/g, (_m, p1) => colors.brand(p1));
      return highlighted;
    })
    .join("\n");
}
