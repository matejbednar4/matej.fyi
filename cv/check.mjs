/**
 * Fails unless public/cv.pdf is one A4 page whose text says exactly what
 * cv/cv.html says, in the same order, with every link in the HTML clickable.
 *
 * The text a PDF carries is what a recruiter's tracking system reads, and it
 * can be wrong while the page looks right: the Canva original wrote its
 * sections out of order, and Inter's contextual alternates once dropped every
 * bracket and dash next to a digit, so "2025–2026" read as "20252026".
 *
 * Needs poppler for `pdftotext` and `pdfinfo` (`brew install poppler`).
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Another path can be passed, to check a PDF before it replaces this one.
const pdf = process.argv[2] ?? "public/cv.pdf";
const html = readFileSync("cv/cv.html", "utf8");
const run = (command, args) => execFileSync(command, args, { encoding: "utf8" });
const normalise = (text) => text.replace(/\s+/g, " ").trim();

const body = html.split("<body>")[1];
const expected = normalise(
  body
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    // CSS sets the section headings in capitals, and the PDF carries what is drawn.
    .replace(/<h2>([^<]*)<\/h2>/g, (_, heading) => ` ${heading.toUpperCase()} `)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&"),
);
// Pdftotext keeps a word broken at its hyphen on two lines; join it back.
const actual = normalise(run("pdftotext", ["-raw", pdf, "-"]).replace(/-\n/g, "-"));

const problems = [];
if (/&#?\w+;/.test(expected)) {
  problems.push("cv.html has an entity this check does not decode; add it here");
}
// An empty fetch on both sides would compare equal, so the text must be real.
if (expected.length < 2000) {
  problems.push(`cv.html yields only ${expected.length} characters of text`);
}
if (actual !== expected) {
  let at = 0;
  while (at < Math.min(actual.length, expected.length) && actual[at] === expected[at]) at += 1;
  problems.push(
    `the PDF's text differs from cv.html at character ${at}:\n` +
      `    pdf:  …${actual.slice(Math.max(0, at - 40), at + 40)}…\n` +
      `    html: …${expected.slice(Math.max(0, at - 40), at + 40)}…`,
  );
}

const info = run("pdfinfo", [pdf]);
const pages = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
if (pages !== 1) problems.push(`the PDF has ${pages} pages, not 1`);
if (!/^Page size:.*\(A4\)/m.test(info)) problems.push("the PDF is not A4");

// WebKit writes a bare origin with a trailing slash; compare without it.
const bare = (url) => url.replace(/\/$/, "");
const links = [...run("pdfinfo", ["-url", pdf]).matchAll(/Annotation\s+(\S+)/g)].map((m) => bare(m[1]));
for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((m) => bare(m[1]))) {
  if (!links.includes(href)) problems.push(`the PDF has no clickable link to ${href}`);
}

if (problems.length) {
  console.error(`${pdf} problems:`);
  for (const problem of problems) console.error("  " + problem);
  process.exitCode = 1;
} else {
  console.log(`${pdf} OK: 1 A4 page, ${actual.length} characters matching cv.html, ${links.length} links`);
}
