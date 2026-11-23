import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Competition entry: one short line. guard() rejects blank or multi-line text,
// and main() appends the single trailing newline itself.
const TEXT = "The demo ran without a single crash. Then an investor asked me to explain the code.";

const LIMIT = 280;

function outDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function payloadOf(text: string): string {
  return `${text}\n`;
}

function guard(text: string): void {
  if (text.trim() === "") {
    throw new Error("TEXT is empty or only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("TEXT must be a single line");
  }
  const count = [...payloadOf(text)].length;
  if (count > LIMIT) {
    throw new Error(`entry is ${count} code points, limit is ${LIMIT}`);
  }
}

function main(): void {
  guard(TEXT);
  const dir = outDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  const payload = payloadOf(TEXT);
  writeFileSync(target, payload, "utf8");

  const written = readFileSync(target, "utf8");
  if (written !== payload) {
    throw new Error("bytes read back do not match what was written");
  }
  console.log(`wrote ${[...payload].length} code points to ${target}`);
}

main();
