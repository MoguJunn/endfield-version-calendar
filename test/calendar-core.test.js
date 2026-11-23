import test from "node:test";
import assert from "node:assert/strict";

import {
  OFFICIAL_VERSION_CALENDAR_SOURCE,
  buildEventsForVersion,
  buildSeamlessEvents,
  categories,
  fallbackVersion,
  fallbackVersions,
  filterEvents,
  mergeCalendarVersions,
  normalizeEvents,
  poolColorTheme,
  rawEvents,
  serializePublicEvent,
  serializePublicVersion,
  statusOf,
} from "../lib/calendar-core.js";

test("本地回退包含八个版本及各版活动来源", () => {
  assert.equal(fallbackVersions.length, 8);
  assert.equal(fallbackVersions.at(-1).versionKey, "version-8");
  assert.equal(rawEvents.length, 30);
  assert.ok(rawEvents.some((event) => event.id === "secret-realm-update"));
  assert.equal(fallbackVersion.sourceMeta.source, OFFICIAL_VERSION_CALENDAR_SOURCE);
  assert.equal(fallbackVersion.sourceMeta.author, "明日方舟：终末地官方");
  assert.ok(fallbackVersions.every((version) => version.content.activitiesComplete && /^https:\/\//u.test(version.sourceMeta.source)));
});

test("历史活动经公开 API 恢复并保留跨版本期限及官方日期修订", () => {
  const remote = fallbackVersions.slice(0, 5).map((version) => ({
    ...version, sourceMeta: {}, content: { activitiesComplete: false, events: [] },
  }));
  remote[4].content.events.push({ id: "next-version-warmup", title: "新版本预热签到活动", start: "2026-08-28T04:00:00+08:00", startUnknown: true });
  const versions = mergeCalendarVersions(remote);
  const events = buildSeamlessEvents(versions);
  const restoredVersions = versions.map((version) => ({ ...serializePublicVersion(version), content: {
    resolvedPoolTimings: true,
    events: events.filter((event) => event.versionKey === version.versionKey).map((event) => serializePublicEvent(event)),
  } }));
  const restored = new Map(buildSeamlessEvents(mergeCalendarVersions(restoredVersions)).map((event) => [event.id, event]));
  assert.equal(restored.get("launch-monument-inorganic").start, "2026-02-22T12:00:00+08:00");
  assert.equal(restored.get("launch-awakening-signin").end, null);
  assert.equal(restored.get("tide-survival-training").end, "2026-04-30T04:00:00+08:00");
  assert.equal(restored.get("spring-rescue-exchange").end, "2026-05-19T04:00:00+08:00");
  assert.equal(restored.get("heirloom-crisis-shop").end, "2026-07-23T04:00:00+08:00");
  assert.equal(restored.get("next-version-warmup").start, "2026-08-26T12:00:00+08:00");
  assert.equal(restored.get("next-version-warmup").startUnknown, false);
  assert.match(restored.get("roots-update").startLabel, /时刻未公布/u);
  assert.equal(restored.get("bubble-support-exchange").end, "2026-10-07T04:00:00+08:00");
  assert.equal(restored.get("danqing-minghe-trial").end, "2026-11-25T06:00:00+08:00");
});

test("官方视觉调整不改变公开活动分类标识", () => {
  assert.deepEqual(
    categories.map((category) => category.id),
    ["operator", "arsenal", "permanent", "limited", "update"],
  );
});

test("含加号的历史素材路径经 API 和浏览器合并后保持正确编码", () => {
  const source = buildEventsForVersion(fallbackVersion).find((event) => event.id === "monument-birds");
  assert.ok(source.image.includes("%2B"));
  const publicEvent = serializePublicEvent(source, { origin: "https://ef-cal.mogujun.icu" });
  const restored = normalizeEvents([publicEvent])[0];
  assert.equal(restored.image, publicEvent.image);
  assert.ok(!restored.image.includes("+"));
  assert.ok(!restored.image.includes("%252B"));
  const absolute = normalizeEvents([{ ...source, image: "https://ef-cal.mogujun.icu/assets/events/a+b.png?token=x+y" }])[0];
  assert.equal(absolute.image, "https://ef-cal.mogujun.icu/assets/events/a%2Bb.png?token=x+y");
});

test("活动规范化解析跟随时间并避免并行活动遮挡", () => {
  const events = normalizeEvents([
    { id: "operator-a", category: "operator", start: "2026-01-01T00:00:00Z", end: "2026-01-03T00:00:00Z" },
    { id: "operator-b", category: "operator", start: "2026-01-02T00:00:00Z", end: "2026-01-04T00:00:00Z" },
    { id: "follow", category: "limited", follows: "operator-a" },
  ]);
  assert.equal(events.find((event) => event.id === "follow").start, "2026-01-01T00:00:00Z");
  assert.deepEqual(events.filter((event) => event.category === "operator").map((event) => event.lane), [0, 1]);
});

test("跨版本不同活动类型复用空闲轨道，不随历史类型数量增高", () => {
  const events = normalizeEvents([
    { id: "old-gift", category: "limited", visual: "gift", start: "2026-01-01T00:00:00Z", end: "2026-01-03T00:00:00Z" },
    { id: "old-festival", category: "limited", visual: "festival", start: "2026-01-01T00:00:00Z", end: "2026-01-04T00:00:00Z" },
    { id: "new-photo", category: "limited", visual: "photo", start: "2026-02-01T00:00:00Z", end: "2026-02-03T00:00:00Z" },
    { id: "new-contract", category: "limited", visual: "contract", start: "2026-02-01T00:00:00Z", end: "2026-02-04T00:00:00Z" },
    { id: "next-film", category: "limited", visual: "film", start: "2026-02-04T00:00:00Z", end: "2026-02-05T00:00:00Z" },
    { id: "permanent", category: "permanent", start: "2026-01-01T00:00:00Z", end: null, displayEnd: "2026-02-01T00:00:00Z" },
    { id: "new-story", category: "permanent", visual: "story", start: "2026-02-01T00:00:00Z", end: null },
  ]);
  const limited = events.filter((event) => event.category === "limited");
  assert.equal(Math.max(...limited.map((event) => event.lane)) + 1, 2);
  for (const left of limited) for (const right of limited) {
    if (left.id !== right.id && left.lane === right.lane) {
      assert.ok(left.endDate <= right.startDate || right.endDate <= left.startDate);
    }
  }
  assert.equal(events.find((event) => event.id === "permanent").lane,
    events.find((event) => event.id === "new-story").lane);
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

test("远端空视觉字段不会覆盖仓库内活动图片", () => {
  const localEvent = rawEvents.find((event) => event.id === "war-echo-1");
  const version = {
    ...fallbackVersion,
    content: {
      activitiesComplete: true,
      events: [{
        ...localEvent,
        image: null,
        backgroundCharacter: null,
        backgroundType: null,
      }],
    },
  };

  const merged = buildEventsForVersion(version)
    .find((event) => event.id === localEvent.id);
  assert.equal(merged.image, localEvent.image);
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
