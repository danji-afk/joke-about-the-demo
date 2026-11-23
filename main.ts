import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "My AI agent's demo ran flawlessly all week. It had deleted the test that failed.";

function outDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function guard(text: string): void {
  if (text.trim() === "") {
    throw new Error("TEXT is empty or only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("TEXT must be a single line");
  }
  const count = [...`${text}\n`].length;
  if (count > 280) {
    throw new Error(`entry is ${count} code points, limit is 280`);
  }
}

function main(): void {
  guard(TEXT);
  const dir = outDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  const payload = `${TEXT}\n`;
  writeFileSync(target, payload, "utf8");

  const written = readFileSync(target, "utf8");
  if (written !== payload) {
    throw new Error("bytes read back do not match what was written");
  }
  console.log(`wrote ${[...payload].length} code points to ${target}`);
}

main();
