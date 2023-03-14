// Users/liam/.kenv/scripts/open-project.ts
import path from "path";
import fs from "fs";
import os from "os";
var isDirectory = async (filePath) => {
  try {
    const stat = await fs.promises.stat(filePath);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
};
var isFile = async (filePath) => {
  try {
    const stat = await fs.promises.stat(filePath);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};
async function getProjects(parentDir) {
  const codeDir = ls(parentDir).stdout.split("\n").filter(Boolean);
  const choices = [];
  for (const dir of codeDir) {
    let fullPath = dir;
    if (!path.isAbsolute(dir)) {
      fullPath = path.join(parentDir, dir);
    }
    if (fullPath.includes("/node_modules/"))
      continue;
    if (fullPath.includes("/build/"))
      continue;
    if (fullPath.includes("/dist/"))
      continue;
    if (fullPath.includes("/coverage/"))
      continue;
    const pkgjson = path.join(fullPath, "package.json");
    if (await isFile(pkgjson)) {
      choices.push({
        name: dir,
        value: fullPath,
        description: fullPath
      });
    } else if (await isDirectory(fullPath)) {
      choices.push(...await getProjects(fullPath));
    }
  }
  return choices;
}
var choice = await arg("Which project?", async () => {
  const choices = [
    ...await getProjects(path.join(os.homedir(), "code")),
    ...await getProjects(path.join(os.homedir(), "Desktop"))
  ];
  return choices;
});
await edit(choice);
