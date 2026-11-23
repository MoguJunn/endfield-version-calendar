import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { buildEventsForVersion, buildSeamlessEvents, fallbackVersions, mergeCalendarVersions, serializePublicEvent, serializePublicVersion, statusOf } from "../lib/calendar-core.js";
import { versionSeven, versionSevenEvents } from "../lib/version-seven.js";

test("丹青渡空远端快照补齐日程与来源，更新标记均有对应活动", async () => {
  const merged = mergeCalendarVersions([{ ...versionSeven, content: { activitiesComplete: false, events: [] } }]);
  const version = merged.find((item) => item.versionKey === versionSeven.versionKey);
  assert.equal(version.content.activitiesComplete, true);
  const events = buildEventsForVersion(version);
  assert.equal(events.length, 32);
  assert.equal(new Set(events.map((event) => event.id)).size, events.length);
  for (const event of events) {
    assert.ok(Number.isFinite(event.startDate.getTime()));
    if (event.endDate) assert.ok(event.endDate > event.startDate);
    if (event.image) await access(new URL(`../${event.image}`, import.meta.url));
    if (event.milestone) {
      const parent = events.find((item) => item.id === event.overlayFor);
      assert.ok(parent);
      assert.ok(event.startDate >= parent.startDate);
      if (parent.endDate) assert.ok(event.startDate < parent.endDate);
    }
  }
  assert.equal(events.filter((event) => event.milestone).length, 4);
});

test("蕈属集群替换旧签到占位，公开 API 再合并后保留确认的日程与奖励", () => {
  const id = "danqing-next-version-warmup";
  const oldEvent = {
    id, title: "新版本预热签到活动", start: "2026-11-23T04:00:00+08:00",
    startUnknown: true, startLabel: "待官方公布", image: null,
  };
  const version = { ...versionSeven, content: { events: [oldEvent] } };
  const events = buildEventsForVersion(version);
  const restored = buildEventsForVersion({
    ...serializePublicVersion(version), pools: [],
    content: { resolvedPoolTimings: true, events: events.map((event) => serializePublicEvent(event)) },
  });
  for (const result of [events, restored]) {
    const matching = result.filter((event) => event.id === id);
    assert.equal(matching.length, 1);
    const [warmup] = matching;
    assert.equal(warmup.title, "「蕈属集群」限时签到");
    assert.equal(warmup.startUnknown, false);
    assert.equal(warmup.startLabel, null);
    assert.equal(warmup.start, "2026-11-21T19:40:00+08:00");
    assert.equal(warmup.end, "2026-11-25T06:00:00+08:00");
    assert.match(warmup.image, /\/assets\/events\/danqing-next-version-warmup\.webp$/u);
    assert.match(warmup.description, /基础寻访凭证 ×2、嵌晶玉 ×500/u);
    assert.equal(statusOf(warmup, new Date(Date.parse(warmup.start) - 1)), "upcoming");
    assert.equal(statusOf(warmup, new Date(warmup.start)), "live");
    assert.equal(statusOf(warmup, new Date(warmup.end)), "ended");
  }
});

test("第七版数据库卡池时间仍为权威，公开 API 再合并不重复或恢复图片时间", () => {
  const pools = versionSevenEvents.filter((event) => event.poolId).map((event) => ({
    poolId: event.poolId, name: event.title.match(/^「([^」]+)」/u)[1], type: event.category,
    poolKind: event.poolKind || "standard", extraSeriesPhase: event.extraSeriesPhase || null,
    startsAt: event.start, endsAt: "2027-01-07T12:00:00+08:00", backgroundUrl: "/avatars/test.png",
  }));
  const version = { ...versionSeven, pools };
  const events = buildEventsForVersion(version);
  assert.equal(events.filter((event) => event.poolId).length, 6);
  for (const pool of pools) {
    const event = events.find((item) => item.poolId === pool.poolId);
    assert.equal(event.end, pool.endsAt);
    assert.match(event.image, /\/assets\/events\/pool-[^/]+\.webp$/u);
  }
  const restored = buildEventsForVersion({
    ...serializePublicVersion(version), pools: [],
    content: { resolvedPoolTimings: true, events: events.map((event) => serializePublicEvent(event)) },
  });
  assert.equal(restored.length, events.length);
  assert.equal(restored.find((event) => event.poolId === pools[0].poolId).end, pools[0].endsAt);
  assert.equal(restored.find((event) => event.poolId === pools[0].poolId).image, events.find((event) => event.poolId === pools[0].poolId).image);
});

test("第六版奖励跨入丹青渡，常驻内容在第七版边界收束且仍开放", () => {
  const events = buildSeamlessEvents(fallbackVersions);
  const reward = events.find((event) => event.id === "monument-engraving");
  assert.equal(reward.end, "2026-10-19T04:00:00+08:00");
  assert.equal(reward.displayEnd, null);
  const winterStory = events.find((event) => event.id === "winter-forest-story");
  assert.equal(winterStory.displayEnd, versionSeven.startsAt);
  assert.equal(statusOf(winterStory, new Date("2026-11-10T00:00:00Z")), "live");
  const contract = events.find((event) => event.id === "danqing-crisis-contract");
  assert.equal(contract.end, versionSeven.endsAt);
});
