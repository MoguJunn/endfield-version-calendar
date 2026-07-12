import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSeamlessEvents,
  fallbackVersions,
  filterEvents,
  normalizeEvents,
  poolColorTheme,
  rawEvents,
  serializePublicEvent,
  statusOf,
} from "../lib/calendar-core.js";

test("本地回退包含五个版本及第五版活动", () => {
  assert.equal(fallbackVersions.length, 5);
  assert.equal(fallbackVersions.at(-1).versionKey, "version-5");
  assert.equal(rawEvents.length, 21);
  assert.ok(rawEvents.some((event) => event.id === "secret-realm-update"));
});

test("活动规范化解析跟随时间并按内部类型排轨", () => {
  const events = normalizeEvents([
    { id: "operator-a", category: "operator", start: "2026-01-01T00:00:00Z", end: "2026-01-03T00:00:00Z" },
    { id: "operator-b", category: "operator", start: "2026-01-02T00:00:00Z", end: "2026-01-04T00:00:00Z" },
    { id: "follow", category: "limited", follows: "operator-a" },
  ]);
  assert.equal(events.find((event) => event.id === "follow").start, "2026-01-01T00:00:00Z");
  assert.deepEqual(events.filter((event) => event.category === "operator").map((event) => event.lane), [0, 1]);
});

test("卡池配色稳定且由卡池身份决定", () => {
  const pool = { poolId: "pool-a", name: "测试寻访", startsAt: "2026-01-01T00:00:00Z" };
  assert.deepEqual(poolColorTheme(pool, "operator"), poolColorTheme(pool, "operator"));
  assert.notEqual(poolColorTheme(pool, "operator").color, poolColorTheme({ ...pool, poolId: "pool-b" }, "operator").color);
});

test("跨版本事件按卡池合并并保留策划活动", () => {
  const versions = [
    { versionKey: "v1", startsAt: "2026-01-01T00:00:00Z", endsAt: "2026-02-01T00:00:00Z", content: { events: [] }, pools: [{ poolId: "shared", name: "共享卡池", type: "operator", startsAt: "2026-01-15T00:00:00Z", endsAt: "2026-02-15T00:00:00Z" }] },
    { versionKey: "v2", startsAt: "2026-02-01T00:00:00Z", endsAt: "2026-03-01T00:00:00Z", content: { events: [{ id: "curated", poolId: "shared", category: "operator", title: "策划标题", start: "2026-01-15T00:00:00Z", end: "2026-02-15T00:00:00Z" }] }, pools: [{ poolId: "shared", name: "数据库标题", type: "operator", startsAt: "2026-01-15T00:00:00Z", endsAt: "2026-02-15T00:00:00Z" }] },
  ];
  const events = buildSeamlessEvents(versions);
  assert.equal(events.length, 1);
  assert.equal(events[0].id, "curated");
  assert.equal(events[0].title, "「数据库标题」特许寻访");
});

test("状态边界、公开序列化和筛选保持一致", () => {
  const event = normalizeEvents([{ id: "event", category: "limited", title: "测试", start: "2026-01-02T00:00:00Z", end: "2026-01-04T00:00:00Z" }])[0];
  assert.equal(statusOf(event, new Date("2026-01-01T00:00:00Z")), "upcoming");
  assert.equal(statusOf(event, new Date("2026-01-02T00:00:00Z")), "live");
  assert.equal(statusOf(event, new Date("2026-01-04T00:00:00Z")), "ended");
  assert.equal(filterEvents([event], { status: "live", from: "2026-01-03T00:00:00Z", to: "2026-01-05T00:00:00Z" }, { now: new Date("2026-01-03T00:00:00Z") }).length, 1);
  const output = serializePublicEvent(event, { now: new Date("2026-01-03T00:00:00Z") });
  assert.equal(output.status, "live");
  assert.equal(output.start, "2026-01-02T00:00:00Z");
  assert.equal(output.end, "2026-01-04T00:00:00Z");
  assert.equal("startDate" in output, false);
  assert.equal("lane" in output, false);
});
