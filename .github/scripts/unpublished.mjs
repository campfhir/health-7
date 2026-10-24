// Prints the workspace packages whose package.json version is not on npm yet, as a GitHub
// Actions matrix ("matrix=[{folder,name,version},...]" on stdout for $GITHUB_OUTPUT).
import { execFileSync } from "node:child_process";
import { listPackages } from "./packages.mjs";

function isPublished(name, version) {
  try {
    execFileSync("npm", ["view", `${name}@${version}`, "version"], { stdio: ["ignore", "pipe", "ignore"] });
    return true;
  } catch {
    return false; // E404: no such version (or no such package yet)
  }
}

const pending = [];
for (const { folder, name, version } of listPackages()) {
  if (isPublished(name, version)) {
    console.error(`${name}@${version} is already on npm; nothing to publish.`);
  } else {
    console.error(`${name}@${version} is not on npm; will publish.`);
    pending.push({ folder, name, version });
  }
}
console.log(`matrix=${JSON.stringify(pending)}`);
