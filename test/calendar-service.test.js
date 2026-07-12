import test from "node:test";
import assert from "node:assert/strict";

import { fetchMainSiteStats, loadCalendar } from "../api/_lib/calendar-service.js";

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, async json() { return body; } };
}

test("优先读取 version_calendar 且不请求旧接口", async () => {
  const calls = [];
  const calendar = await loadCalendar({
    fetchImpl: async (url) => {
      calls.push(String(url));
      return jsonResponse({ data: { versionCalendar: { activeVersionKey: "version-test", versions: [{ versionKey: "version-test", versionNumber: "T", title: "测试", content: { events: [] } }] } } });
    },
  });
  assert.equal(calendar.source.mode, "origin");
  assert.equal(calendar.source.partial, false);
  assert.equal(calendar.activeVersionKey, "version-test");
  assert.equal(calls.length, 1);
  assert.match(calls[0], /type=version_calendar/u);
});

test("主站降级元数据会映射为 partial 来源", async () => {
  const calendar = await loadCalendar({
    fetchImpl: async () => jsonResponse({
      success: true,
      partial: true,
      data: {
        versionCalendar: {
          activeVersionKey: "version-test",
          versions: [{ versionKey: "version-test", versionNumber: "T", title: "测试", content: { events: [] } }],
        },
      },
    }),
  });
  assert.equal(calendar.source.mode, "partial");
  assert.equal(calendar.source.partial, true);
});

test("主快照不可用时用 pool_catalog 和 characters 补全", async () => {
  const calls = [];
  const calendar = await loadCalendar({
    fetchImpl: async (url) => {
      const type = new URL(url).searchParams.get("type");
      calls.push(type);
      if (type === "version_calendar") return jsonResponse({ data: {} });
      if (type === "pool_catalog") return jsonResponse({ data: { pools: [{ id: "special-test", name: "测试寻访", type: "limited", start_time: "2026-07-20T00:00:00Z", end_time: "2026-07-25T00:00:00Z", up_character: "测试干员" }] } });
      return jsonResponse({ data: { characters: [{ id: "char-test", name: "测试干员", type: "character", avatar_url: "/avatars/test.png" }] } });
    },
  });
  assert.equal(calendar.source.mode, "partial");
  assert.equal(calendar.source.partial, true);
  assert.deepEqual(new Set(calls), new Set(["version_calendar", "pool_catalog", "characters"]));
  assert.ok(calendar.versions.at(-1).pools.some((pool) => pool.poolId === "special-test"));
});

test("所有远端读取失败时返回本地版本", async () => {
  const calendar = await loadCalendar({ fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal(calendar.source.mode, "fallback");
  assert.equal(calendar.source.partial, true);
  assert.equal(calendar.versions.length, 5);
  assert.ok(calendar.warnings.some((warning) => warning.includes("version_calendar")));
});

test("请求支持注入并按超时信号中止", async () => {
  await assert.rejects(
    fetchMainSiteStats("version_calendar", {
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
    }),
    (error) => error?.name === "AbortError" || error?.name === "TimeoutError",
  );
});
