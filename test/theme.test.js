import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeSource = await readFile(path.join(root, "theme.js"), "utf8");

function runTheme({ matches = false, stored = {} } = {}) {
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
    dataset: {},
    style: {},
    classList: { toggle() {} },
  };
  const document = {
    readyState: "complete",
    documentElement,
    querySelector(selector) {
      return selector === 'meta[name="theme-color"]' ? themeColor : null;
    },
    querySelectorAll() { return []; },
    addEventListener() {},
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

  return { documentElement, media, storage, themeColor };
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
