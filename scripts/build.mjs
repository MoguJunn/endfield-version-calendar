import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const sourceFiles = ["index.html", "styles.css", "app.js", "calendar-config.js", "openapi.json"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of sourceFiles) {
  await cp(path.join(root, file), path.join(output, file));
}

await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
await cp(path.join(root, "lib"), path.join(output, "lib"), { recursive: true });
await cp(path.join(root, "docs"), path.join(output, "docs"), { recursive: true });

console.log(`已构建 ${sourceFiles.length} 个站点文件、共享核心、API 文档及活动图示到 ${output}`);
