import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function sh(...args) {
  return execFileSync(args[0], args.slice(1), { stdio: "pipe" }).toString().trim();
}

// 1) Apply Changesets version bump (updates package.json, generates changelogs if configured)
sh("npx", "changeset", "version");

// 2) Commit version bump back to branch
try {
  sh("git", "add", "-A");
  sh("git", "commit", "-m", "chore(release): version packages");
} catch (e) {
  const msg = e?.message || String(e);
  if (msg.includes("nothing to commit")) {
    // Allowed: labeling release without pending changesets
    process.stdout.write("No version changes to commit.\n");
  } else {
    throw e;
  }
}

// 3) Create stable tag vX.Y.Z based on package.json version
const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url)));
if (!pkg?.version) throw new Error("package.json version not found.");

const tag = `v${pkg.version}`;
try {
  sh("git", "tag", "-a", tag, "-m", `Release ${tag}`);
} catch (e) {
  const msg = e?.message || String(e);
  if (msg.includes("already exists")) {
    process.stdout.write(`Tag ${tag} already exists; skipping tag creation.\n`);
  } else {
    throw e;
  }
}

// 4) Push branch + tags
sh("git", "push", "origin", "HEAD");
sh("git", "push", "origin", "--tags");

process.stdout.write(`Stable release prepared: ${tag}\n`);

