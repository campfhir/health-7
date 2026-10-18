// Creates a `v<version>` git tag for every version published on npm that has none.
//
// The commit comes from the registry's `gitHead` (recorded at publish time) or, for
// versions published without one, from .github/release-tags.json (version -> commit SHA).
// Staged npm releases only become visible once approved, so this runs on a schedule.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();
const tryRun = (cmd, args) => {
  try {
    return run(cmd, args);
  } catch {
    return "";
  }
};

const { name } = JSON.parse(readFileSync("package.json", "utf8"));
const overrides = JSON.parse(readFileSync(".github/release-tags.json", "utf8"));
const versions = [].concat(JSON.parse(run("npm", ["view", name, "versions", "--json"])));

const created = [];
for (const version of versions) {
  const tag = `v${version}`;
  if (tryRun("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`])) continue;

  const sha = overrides[version] ?? tryRun("npm", ["view", `${name}@${version}`, "gitHead"]);
  if (!sha) {
    console.warn(`::warning::${tag}: npm has no gitHead; add it to .github/release-tags.json`);
    continue;
  }
  if (!commitExists(sha)) {
    console.warn(`::warning::${tag}: commit ${sha} not found in this repository`);
    continue;
  }
  run("git", ["tag", "-a", tag, sha, "-m", `${name}@${version}`]);
  created.push(tag);
  console.log(`tagged ${tag} -> ${sha}`);
}

function commitExists(sha) {
  try {
    execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (created.length) {
  run("git", ["push", "origin", ...created.map((t) => `refs/tags/${t}`)]);
  console.log(`pushed ${created.join(", ")}`);
} else {
  console.log("all published versions are tagged");
}
