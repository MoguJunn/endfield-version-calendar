import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeSource = await readFile(path.join(root, "theme.js"), "utf8");

function runTheme({ matches = false, stored = {}, versionTheme = "default" } = {}) {
  const storage = new Map(Object.entries(stored));
  const media = {
    matches,
    listener: null,
    addEventListener(type, listener) {
      if (type === "change") this.listener = listener;
    },
  };
  const themeColor = { content: "" };
  const documentElement = {
    dataset: { versionTheme },
    style: {},
    classList: { toggle() {} },
  };
  const listeners = new Map();
  const document = {
    readyState: "complete",
    documentElement,
    querySelector(selector) {
      return selector === 'meta[name="theme-color"]' ? themeColor : null;
    },
    querySelectorAll() { return []; },
    addEventListener(type, listener) { listeners.set(type, listener); },
  };
  const localStorage = {
    getItem(key) { return storage.get(key) ?? null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
  };
  const window = {
    matchMedia() { return media; },
  };

  vm.runInNewContext(themeSource, {
    window,
    document,
    localStorage,
    Set,
  });

  return { documentElement, media, storage, themeColor, listeners };
}

test("主题首次访问默认跟随系统并响应系统变化", () => {
  const result = runTheme({ matches: true });
  assert.equal(result.documentElement.dataset.themeMode, "system");
  assert.equal(result.documentElement.dataset.theme, "dark");
  assert.equal(result.themeColor.content, "#101310");

  result.media.matches = false;
  result.media.listener();
  assert.equal(result.documentElement.dataset.theme, "light");
  assert.equal(result.themeColor.content, "#eef0ec");
});

test("旧版手动主题偏好迁移后继续覆盖系统", () => {
  const result = runTheme({
    matches: false,
    stored: { "endfield-calendar-theme": "dark" },
  });
  assert.equal(result.documentElement.dataset.themeMode, "dark");
  assert.equal(result.documentElement.dataset.theme, "dark");
  assert.equal(result.storage.get("theme"), "dark");
  assert.equal(result.storage.has("endfield-calendar-theme"), false);

  result.media.matches = true;
  result.media.listener();
  assert.equal(result.documentElement.dataset.theme, "dark");
});

test("版本配色切换不改变手动亮暗偏好，浏览器主题色同步更新", () => {
  const result = runTheme({ stored: { theme: "light" }, versionTheme: "snow" });
  assert.equal(result.themeColor.content, "#edf3fc");
  result.documentElement.dataset.versionTheme = "default";
  result.listeners.get("versionthemechange")();
  assert.equal(result.themeColor.content, "#eef0ec");
  assert.equal(result.storage.get("theme"), "light");
  result.media.matches = true;
  result.media.listener();
  assert.equal(result.documentElement.dataset.theme, "light");

  const system = runTheme({ matches: true, versionTheme: "snow" });
  assert.equal(system.themeColor.content, "#0d1426");
  system.media.matches = false;
  system.media.listener();
  assert.equal(system.themeColor.content, "#edf3fc");
});
