import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { buildEventsForVersion, buildSeamlessEvents, mergeCalendarVersions, serializePublicEvent, serializePublicVersion, statusOf } from "../lib/calendar-core.js";
import { versionEight } from "../lib/version-eight.js";
import { VERSION_EIGHT_ANNOUNCEMENT } from "../lib/version-eight-pools.js";
import { versionSeven } from "../lib/version-seven.js";

test("第八版正式活动覆盖导览旧条目并保留数据库卡池和公开 API 数据", async () => {
  const pool = {
    poolId: "version-eight-test-pool", name: "测试寻访", type: "operator",
    startsAt: versionEight.startsAt, endsAt: "2026-12-23T11:59:00+08:00",
  };
  const oldSeason = {
    id: "mushroom-war-echo", title: "战争回响常驻挑战玩法更新", start: versionEight.startsAt,
    end: versionEight.endsAt, image: "https://example.com/old-briefing.webp", sourceNote: "活动内容与持续时间正在施工中",
  };
  const oldStoreEvents = [
    ["mushroom-protocol-pass", "「协议通行证·蘑境」"],
    ["mushroom-protocol-bundle", "「协议源流组合包」上架"],
    ["mushroom-wild-bundle", "「漫野寻访组合包」上架"],
    ["mushroom-arsenal-bundle", "「特惠武库配额包」上架"],
  ].map(([id, title]) => ({ id, title, category: "limited", start: versionEight.startsAt, end: versionEight.endsAt }));
  const versions = mergeCalendarVersions([{
    ...versionEight, pools: [pool], content: { activitiesComplete: false, events: [oldSeason, ...oldStoreEvents] },
  }]);
  const version = versions.find((item) => item.versionKey === versionEight.versionKey);
  const publicVersion = serializePublicVersion(version);
  assert.equal(publicVersion.activitiesComplete, true);
  assert.equal(publicVersion.sourceMeta.source, VERSION_EIGHT_ANNOUNCEMENT);
  const events = buildEventsForVersion(version);
  assert.equal(events.length, 29);
  const eventIds = new Set(events.map((event) => event.id));
  assert.equal(eventIds.size, events.length);
  assert.ok(oldStoreEvents.every(({ id }) => !eventIds.has(id)));
  assert.ok(eventIds.has("mushroom-marcher-gift"));
  assert.equal(events.find((event) => event.poolId === pool.poolId).end, pool.endsAt);
  for (const event of events.filter((item) => item.image)) {
    await access(new URL(`../${event.image}`, import.meta.url));
    if (event.id.startsWith("mushroom-")) assert.ok(event.sourceNote.includes(VERSION_EIGHT_ANNOUNCEMENT));
  }

  const restored = buildEventsForVersion({
    ...publicVersion, pools: [], content: { resolvedPoolTimings: true, events: [...events, ...oldStoreEvents].map((event) => serializePublicEvent(event)) },
  });
  const eventDetails = (items) => items.map((event) => [event.id, event.start, event.end, event.sourceNote])
    .sort(([left], [right]) => left.localeCompare(right));
  assert.deepEqual(eventDetails(restored), eventDetails(events));
});

test("公告的赛季轮换、补给、更新节点和长期开放分别绘制", () => {
  const nextVersion = { versionKey: "version-9", startsAt: "2027-01-07T12:00:00+08:00" };
  const events = new Map(buildSeamlessEvents([versionEight, nextVersion]).map((event) => [event.id, event]));
  const monument = events.get("mushroom-monument-atrocity");
  assert.equal(monument.start, "2026-12-02T12:00:00+08:00");
  assert.equal(monument.end, "2026-12-23T04:00:00+08:00");
  assert.equal(events.get("mushroom-monument-series").end, null);
  assert.equal(events.get("mushroom-fungi-intro").start, versionEight.startsAt);
  assert.equal(events.get("mushroom-competition").end, versionEight.endsAt);
  assert.equal(events.get("mushroom-war-echo").end, "2026-12-16T11:59:00+08:00");
  assert.equal(events.get("mushroom-war-echo-alert").start, "2026-12-16T12:00:00+08:00");
  assert.equal(events.get("mushroom-sanity-first").end, "2026-12-16T04:00:00+08:00");
  assert.equal(events.get("mushroom-sanity-second").end, "2027-01-07T04:00:00+08:00");
  assert.deepEqual([...events.values()].filter((event) => event.milestone).map((event) => event.start).sort(), [
    "2026-12-09T04:00:00+08:00", "2026-12-18T04:00:00+08:00", "2026-12-23T04:00:00+08:00",
  ]);
  const warmup = events.get("mushroom-next-version-warmup");
  assert.equal(warmup.startUnknown, true);
  assert.equal(statusOf(warmup, new Date("2027-01-06T04:00:00+08:00")), "upcoming");
  const puzzle = events.get("mushroom-puzzle-special");
  assert.equal(puzzle.start, "2026-12-27T12:00:00+08:00");
  assert.equal(puzzle.end, null);
  assert.equal(puzzle.displayEnd, nextVersion.startsAt);
  assert.equal(statusOf(puzzle, new Date(nextVersion.startsAt)), "live");
});

test("新版官方卡池替换目录占位名称和配图，跨版武库保持稳定身份", () => {
  const pools = [
    { poolId: "special_manual_limited_pool_1ullxy_20261125_8v04q", name: "铁砧、行囊与蜜糖", type: "operator", startsAt: versionEight.startsAt, endsAt: "2026-12-23T03:59:00Z" },
    { poolId: "weaponbox_manual_weapon_pool_pgz05i_20261125_2a2lg4", name: "甜美交易", type: "arsenal", startsAt: versionEight.startsAt, endsAt: null, backgroundUrl: "/avatars/test.png" },
    { poolId: "weaponbox_1_6_1", name: "篆玉申领", type: "arsenal", startsAt: "2026-10-15T04:00:00Z", endsAt: "2026-12-17T04:00:00Z" },
    { poolId: "joint_manual_extra_pool_104dzt_20261216_re1zei", name: "绯红瑰宝", type: "operator", poolKind: "reconstruction", extraSeriesPhase: 2, startsAt: "2026-12-16T04:00:00Z", endsAt: "2027-01-06T22:00:00Z", backgroundUrl: "/avatars/test.png" },
  ];
  const events = buildSeamlessEvents([versionSeven, { ...versionEight, pools }]);
  const [ceobe, sweetDeal, jade, rossi] = pools.map((pool) => {
    const matched = events.filter((event) => event.poolId === pool.poolId);
    assert.equal(matched.length, 1);
    return matched[0];
  });
  assert.equal(ceobe.title, "「锻砧、行囊与蜜糖」特许寻访");
  assert.match(ceobe.description, /明河、祀、余烬、黎风、艾尔黛拉、别礼、骏卫/u);
  assert.equal(sweetDeal.title, "「恣游申领」");
  assert.equal(sweetDeal.image, "./assets/events/mushroom-pool-sweet-deal.webp");
  assert.equal(sweetDeal.end, null);
  assert.match(sweetDeal.endLabel, /第 2 个特许寻访结束时/u);
  assert.equal(jade.end, "2026-12-23T11:59:00+08:00");
  assert.equal(rossi.extraSeriesPhase, 1);
  assert.equal(rossi.image, "./assets/events/mushroom-pool-rossi.webp");
  assert.equal(rossi.end, pools[3].endsAt);
});
