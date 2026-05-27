import { execFileSync } from "node:child_process";

function sh(...args) {
  return execFileSync(args[0], args.slice(1), { stdio: "pipe" }).toString().trim();
}

const runNumber = process.env.GITHUB_RUN_NUMBER;
if (!runNumber) {
  throw new Error("GITHUB_RUN_NUMBER is required to create alpha tags.");
}

const tag = `alpha-${runNumber}`;
const sha = sh("git", "rev-parse", "HEAD");

try {
  sh("git", "tag", "-a", tag, "-m", `Prerelease ${tag} (${sha})`);
} catch (e) {
  const msg = e?.message || String(e);
  if (msg.includes("already exists")) {
    process.stdout.write(`Tag ${tag} already exists; skipping.\n`);
    process.exit(0);
  }
  throw e;
}

sh("git", "push", "origin", tag);
process.stdout.write(`Created and pushed ${tag} -> ${sha}\n`);

