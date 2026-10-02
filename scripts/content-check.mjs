/**
 * Fails the build when the content graph is broken.
 *
 * TypeScript already prevents a work item from naming a role or technology that
 * does not exist. This catches the other direction: a technology claimed with no
 * work behind it, and work attached to nothing at all.
 */
import { execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Compiled inside the project rather than the system temp directory, so the
// packages `src/content` imports (lucide-react, for the area marks) resolve
// from node_modules when the compiled copy is loaded.
const cache = resolve("node_modules/.cache");
mkdirSync(cache, { recursive: true });
const out = mkdtempSync(join(cache, "content-"));
try {
  execSync(
    `yarn -s tsc src/content/index.ts --outDir ${out} --rootDir src/content ` +
      `--module commonjs --moduleResolution node --target es2022 --skipLibCheck`,
    { stdio: "pipe" },
  );
  const c = await import(pathToFileURL(join(out, "index.js")).href);

  const problems = [];
  for (const s of c.unusedStack) {
    problems.push(`stack entry "${s.id}" is listed but no work uses it`);
  }
  for (const item of c.unlinkedWork) {
    problems.push(`work item "${item.id}" links to no role and no stack`);
  }
  // `**` marks a stack name in work copy. An unclosed one would set the rest
  // of the paragraph in bold, and a title or a caption is never read for it,
  // so a marker there would show as two literal asterisks.
  for (const item of c.work) {
    for (const text of [item.body, ...(item.bullets ?? []), item.outro ?? ""]) {
      if ((text.match(/\*\*/g) ?? []).length % 2 !== 0) {
        problems.push(`work item "${item.id}" has an unclosed ** in "${text.slice(0, 50)}…"`);
      }
    }
    for (const text of [item.title, ...(item.media ?? []).map((m) => m.caption)]) {
      if (text.includes("**")) {
        problems.push(`work item "${item.id}" has ** in a title or caption, which is not read`);
      }
    }
  }
  // Every area is a route and a landing-page door, so an empty one ships a page
  // with nothing on it and a door that leads nowhere.
  for (const area of c.AREAS) {
    if (c.workIn(area).length === 0) {
      problems.push(`area "${area}" has no work behind it`);
    }
  }

  const used = c.stack.length - c.unusedStack.length;
  console.log(`${c.work.length} work items, ${c.roles.length} roles, ${c.stack.length} stack entries`);
  console.log(`${used}/${c.stack.length} stack entries have evidence`);
  console.log(`${c.profile.languages.length} languages, ${c.profile.education.length} education`);
  for (const area of c.AREAS) {
    console.log(`area ${area}: ${c.workIn(area).length} items`);
  }

  // An exit code rather than process.exit(): exiting here would skip the
  // `finally` below and leave the compiled copy behind in the temp directory.
  if (problems.length) {
    console.error("\ncontent graph problems:");
    for (const p of problems) console.error("  " + p);
    process.exitCode = 1;
  } else {
    console.log("content graph OK");
  }
} finally {
  rmSync(out, { recursive: true, force: true });
}
