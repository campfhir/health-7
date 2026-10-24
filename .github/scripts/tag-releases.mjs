// Creates a `<name>@<version>` git tag (e.g. `@campfhir/hl7@0.11.0`) for every package version
// that is live on npm and has no tag yet.
//
// The commit comes from the registry's `gitHead` (recorded at publish time) or, for versions
// published without one, from .github/release-tags.json. That file also lists a package's legacy
// tag prefix: versions already tagged with it (e.g. `v0.10.0` for @campfhir/hl7) are left alone.
// Staged npm releases only become visible once approved, so this runs on a schedule.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { listPackages, REPO_ROOT } from "./packages.mjs";

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();
const tryRun = (cmd, args) => {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
const tagExists = (tag) => Boolean(tryRun("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`]));
const commitExists = (sha) => {
  try {
    execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const config = JSON.parse(readFileSync(join(REPO_ROOT, ".github/release-tags.json"), "utf8"));
const created = [];

for (const { name } of listPackages()) {
  const { legacyTagPrefix, commits = {} } = config[name] ?? {};
  const raw = tryRun("npm", ["view", name, "versions", "--json"]);
  if (!raw) {
    console.log(`${name}: not on npm yet, nothing to tag`);
    continue;
  }
  const versions = [].concat(JSON.parse(raw));

  for (const version of versions) {
    const tag = `${name}@${version}`;
    if (tagExists(tag)) continue;
    if (legacyTagPrefix && tagExists(`${legacyTagPrefix}${version}`)) continue;

    const sha = commits[version] ?? tryRun("npm", ["view", `${name}@${version}`, "gitHead"]);
    if (!sha) {
      console.warn(`::warning::${tag}: npm has no gitHead; add it to .github/release-tags.json`);
      continue;
    }
    if (!commitExists(sha)) {
      console.warn(`::warning::${tag}: commit ${sha} not found in this repository`);
      continue;
    }
    run("git", ["tag", "-a", tag, sha, "-m", tag]);
    created.push(tag);
    console.log(`tagged ${tag} -> ${sha}`);
  }
}

if (created.length) {
  run("git", ["push", "origin", ...created.map((t) => `refs/tags/${t}`)]);
  console.log(`pushed ${created.join(", ")}`);
} else {
  console.log("all published versions are tagged");
}
