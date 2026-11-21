import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { buildEventsForVersion, buildSeamlessEvents, mergeCalendarVersions, serializePublicEvent, serializePublicVersion, statusOf } from "../lib/calendar-core.js";
import { VERSION_EIGHT_BRIEFING, VERSION_EIGHT_DRAFT_NOTICE, versionEight } from "../lib/version-eight.js";

test("第八版导览活动与数据库卡池合并，公开 API 回传后仍显示施工中", async () => {
  const pool = {
    poolId: "version-eight-test-pool", name: "测试寻访", type: "operator",
    startsAt: versionEight.startsAt, endsAt: "2026-12-23T11:59:00+08:00",
  };
  const versions = mergeCalendarVersions([{
    ...versionEight, pools: [pool], content: { activitiesComplete: true, events: [] },
  }]);
  const version = versions.find((item) => item.versionKey === versionEight.versionKey);
  const publicVersion = serializePublicVersion(version);
  assert.equal(publicVersion.activitiesComplete, false);
  assert.equal(publicVersion.sourceMeta.source, VERSION_EIGHT_BRIEFING);
  const events = buildEventsForVersion(version);
  assert.equal(events.length, 10);
  assert.equal(events.find((event) => event.poolId === pool.poolId).end, pool.endsAt);
  for (const event of events.filter((item) => !item.poolId)) {
    await access(new URL(`../${event.image}`, import.meta.url));
    assert.ok(event.sourceNote.startsWith(VERSION_EIGHT_DRAFT_NOTICE));
  }

  const restored = buildEventsForVersion({
    ...publicVersion, pools: [], content: { resolvedPoolTimings: true, events: events.map((event) => serializePublicEvent(event)) },
  });
  assert.deepEqual(restored.map((event) => [event.id, event.start, event.end, event.sourceNote]),
    events.map((event) => [event.id, event.start, event.end, event.sourceNote]));
});

test("导览明确日期、版本边界和长期开放按各自口径展示", () => {
  const nextVersion = { versionKey: "version-9", startsAt: "2027-01-07T12:00:00+08:00" };
  const events = new Map(buildSeamlessEvents([versionEight, nextVersion]).map((event) => [event.id, event]));
  const monument = events.get("mushroom-monument-atrocity");
  assert.equal(monument.start, "2026-12-02T12:00:00+08:00");
  assert.equal(monument.end, "2026-12-23T04:00:00+08:00");
  assert.equal(events.get("mushroom-fungi-intro").start, versionEight.startsAt);
  assert.equal(events.get("mushroom-competition").end, versionEight.endsAt);
  const puzzle = events.get("mushroom-puzzle-special");
  assert.equal(puzzle.start, "2026-12-27T12:00:00+08:00");
  assert.equal(puzzle.end, null);
  assert.equal(puzzle.displayEnd, nextVersion.startsAt);
  assert.equal(statusOf(puzzle, new Date(nextVersion.startsAt)), "live");
});
