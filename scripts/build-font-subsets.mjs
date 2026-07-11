import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync } from "fflate";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archivePath = path.join(root, "node_modules", "harmonyos-sans", "HarmonyOS Sans.zip");
const outputRoot = path.join(root, "assets", "fonts", "harmony");
const family = "Harmony Sans App";
const version = "harmony-os-sans-sc-calendar-v1";
const generatedDebugArtifacts = ["index.html", "index.proto", "reporter.bin"];
const forceRebuild = process.env.FORCE_FONT_REBUILD === "1";
const timeoutMs = Math.max(
  10_000,
  Number.parseInt(process.env.FONT_BUILD_TIMEOUT_MS || "120000", 10) || 120_000,
);

const jobs = [
  { key: "sc-medium", weight: "400 600", sourceFile: "HarmonyOS_Sans_SC_Medium.ttf" },
  { key: "sc-bold", weight: "700 900", sourceFile: "HarmonyOS_Sans_SC_Bold.ttf" },
];

function resultCssPath(key) {
  return path.join(outputRoot, key, "result.css");
}

function metaPath(key) {
  return path.join(outputRoot, key, "build-meta.json");
}

function findSource(archive, sourceFile) {
  const expected = sourceFile.toLocaleLowerCase("en-US");
  const entry = Object.entries(archive).find(([name]) => (
    path.basename(name.replaceAll("\\", "/")).toLocaleLowerCase("en-US") === expected
  ));
  if (!entry) throw new Error(`字体压缩包中缺少 ${sourceFile}`);
  return entry[1];
}

async function isCurrent(job, sourceHash) {
  if (forceRebuild) return false;
  if (!existsSync(resultCssPath(job.key)) || !existsSync(metaPath(job.key))) return false;
  try {
    const meta = JSON.parse(await readFile(metaPath(job.key), "utf8"));
    return meta.version === version
      && meta.family === family
      && meta.key === job.key
      && meta.weight === job.weight
      && meta.sourceFile === job.sourceFile
      && meta.sourceHash === sourceHash;
  } catch {
    return false;
  }
}

async function buildJob(job, sourceBuffer, sourceHash) {
  const outDir = path.join(outputRoot, job.key);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await fontSplit({
    input: sourceBuffer,
    outDir,
    css: {
      fontFamily: family,
      fontWeight: job.weight,
      fontStyle: "normal",
      fontDisplay: "swap",
      localFamily: [family],
      compress: true,
      fileName: "result.css",
      commentBase: false,
      commentNameTable: false,
      commentUnicodes: false,
    },
    languageAreas: true,
    autoSubset: true,
    reduceMins: true,
    renameOutputFont: "[hash:8].[ext]",
    testHtml: false,
    reporter: false,
    silent: true,
  });

  await Promise.all(generatedDebugArtifacts.map((file) => (
    rm(path.join(outDir, file), { force: true })
  )));
  await writeFile(metaPath(job.key), `${JSON.stringify({
    version,
    family,
    key: job.key,
    weight: job.weight,
    sourceFile: job.sourceFile,
    sourceHash,
  }, null, 2)}\n`, "utf8");
  console.log(`[fonts] Built ${job.key} (${job.weight}) from ${job.sourceFile}`);
}

let fontSplit;

async function main() {
  const watchdog = setTimeout(() => {
    console.error(`[fonts] Timed out after ${timeoutMs}ms; terminating stalled font build.`);
    process.exit(1);
  }, timeoutMs);
  watchdog.unref();

  try {
    const archiveBuffer = await readFile(archivePath);
    const archive = unzipSync(new Uint8Array(archiveBuffer));
    await mkdir(outputRoot, { recursive: true });
    const pendingJobs = [];

    for (const job of jobs) {
      const sourceBuffer = findSource(archive, job.sourceFile);
      const sourceHash = createHash("sha256").update(sourceBuffer).digest("hex");
      if (await isCurrent(job, sourceHash)) {
        console.log(`[fonts] Reusing ${job.key} (${job.weight}) from ${job.sourceFile}`);
      } else {
        pendingJobs.push({ job, sourceBuffer, sourceHash });
      }
    }

    if (pendingJobs.length > 0) {
      ({ fontSplit } = await import("cn-font-split"));
      for (const pending of pendingJobs) {
        await buildJob(pending.job, pending.sourceBuffer, pending.sourceHash);
      }
    }
  } finally {
    clearTimeout(watchdog);
  }
}

try {
  await main();
  await new Promise((resolve) => setImmediate(resolve));
  process.exit(0);
} catch (error) {
  console.error("[fonts] Build failed:", error);
  process.exit(1);
}
