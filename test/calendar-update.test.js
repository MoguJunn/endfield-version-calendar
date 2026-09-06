import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { buildEventsForVersion, buildSeamlessEvents, fallbackVersion, fallbackVersions, poolToEvent, serializePublicEvent, serializePublicVersion, statusOf } from "../lib/calendar-core.js";
import { versionSix, versionSixEvents } from "../lib/version-six.js";

const military = { poolId: "weponbox_1_4_1", name: "军列申领", type: "arsenal", startsAt: "2026-07-16T04:00:00Z", endsAt: "2026-09-30T04:00:00Z", backgroundUrl: "/avatars/weapons/test.png" };

test("旧手动绑定被正式 ID 替换后只保留一个跨版本卡池", () => {
  const result = buildSeamlessEvents([
    { ...fallbackVersion, pools: [military], poolBindings: { "weapon-years": "weaponbox_manual_weapon_pool_1g47uo_20260716_7bm8em" } },
    { ...versionSix, pools: [military] },
  ]);
  const matched = result.filter((event) => event.title === "「军列申领」");
  assert.equal(matched.length, 1);
  assert.equal(matched[0].poolId, military.poolId);
  assert.equal(matched[0].end, "2026-09-24T11:59:00+08:00");
  assert.equal(matched[0].endLabel, null);
  assert.match(matched[0].image, /test.png$/u);
});

test("同名不同期开池不合并，同日多个正式池不会猜测匹配", () => {
  const version = { versionKey: "test", startsAt: "2026-07-01T00:00:00Z", endsAt: "2026-10-01T00:00:00Z", content: { events: [] }, pools: [military, { ...military, poolId: "weponbox_next", startsAt: "2026-08-16T04:00:00Z" }] };
  assert.equal(buildEventsForVersion(version).length, 2);
  const ambiguous = { ...version, pools: [military, { ...military, poolId: "weponbox_other" }], content: { events: [{ id: "manual-event", poolId: "weapon_manual_test", title: "「军列申领」", category: "arsenal", start: military.startsAt, end: military.endsAt }] } };
  assert.equal(buildEventsForVersion(ambiguous).length, 3);
});

test("新旧 ID 同时存在于目录时优先唯一正式 ID", () => {
  const version = { ...fallbackVersion, pools: [{ ...military, poolId: "weaponbox_manual_test" }, military] };
  assert.equal(buildEventsForVersion(version).filter((event) => event.title === "「军列申领」").length, 1);
});

test("单版本接口和总轴均保留明曜申领的最新相对结束规则", () => {
  const pool = { ...military, poolId: "weponbox_1_4_2", name: "明曜申领", startsAt: "2026-08-09T04:00:00Z", endsAt: "2026-09-29T04:00:00Z" };
  const single = buildEventsForVersion({ ...versionSix, pools: [pool] }).find((event) => event.poolId === pool.poolId);
  const all = buildSeamlessEvents([{ ...fallbackVersion, pools: [pool] }, { ...versionSix, pools: [pool] }]).filter((event) => event.poolId === pool.poolId);
  assert.equal(all.length, 1);
  assert.equal(single.end, null);
  assert.equal(all[0].end, null);
  assert.equal(single.endLabel, "「冬猎」后第1个特许寻访结束时");
  assert.equal(all[0].endLabel, single.endLabel);
});

test("重构池即使远端没有颜色也能展示且保留新类型与最新时间", () => {
  for (const category of ["operator", "arsenal"]) {
    const local = versionSixEvents.find((event) => event.poolKind === "reconstruction" && event.category === category);
    const pool = { poolId: local.poolId, name: category === "operator" ? "绚丽异彩" : "点绘申领", type: category, startsAt: local.start, endsAt: "2026-10-15T12:00:00+08:00", backgroundUrl: "/avatars/reconstruction.png" };
    const result = buildEventsForVersion({ ...versionSix, content: { events: [{ ...local, color: null, end: null, endLabel: "版本更新维护前" }] }, pools: [pool] });
    const event = result.find((item) => item.id === local.id);
    assert.equal(event.title, local.title);
    assert.equal(event.end, "2026-10-15T06:00:00+08:00");
    assert.equal(event.endLabel, null);
    assert.match(event.color, /^#[0-9a-f]{6}$/iu);
    assert.match(event.image, /reconstruction.png$/u);
    assert.equal(poolToEvent(pool).poolKind, "reconstruction");
    assert.equal(result.filter((item) => item.poolId === local.poolId).length, 1);
  }
});

test("常驻图形收束于下一版本，真实状态仍为开放且释放后续轨道", () => {
  const v5 = { ...fallbackVersion, endsAt: "2026-09-02T06:00:00+08:00" };
  const events = buildSeamlessEvents([v5, versionSix]);
  const story = events.find((event) => event.id === "meteor-story");
  const nextStory = events.find((event) => event.id === "winter-forest-story");
  assert.equal(story.displayEnd, versionSix.startsAt);
  assert.equal(story.end, null);
  assert.equal(statusOf(story, new Date("2026-09-10T00:00:00Z")), "live");
  assert.equal(story.lane, nextStory.lane);
  const reward = events.find((event) => event.id === "monument-engraving");
  assert.equal(reward.displayEnd, null);
  assert.equal(reward.end, "2026-10-19T04:00:00+08:00");
});

test("公开 API 数据返回浏览器再次合并不恢复手动 ID 副本", () => {
  const versions = [{ ...fallbackVersion, pools: [military] }, versionSix];
  const original = buildSeamlessEvents(versions);
  const publicEvents = original.map((event) => serializePublicEvent(event));
  const restored = versions.map((version) => ({ ...serializePublicVersion(version), content: { events: publicEvents.filter((event) => event.versionKey === version.versionKey) }, pools: [] }));
  const result = buildSeamlessEvents(restored);
  assert.equal(result.length, original.length);
  assert.equal(result.filter((event) => event.title === "「军列申领」").length, 1);
  assert.equal(result.find((event) => event.id === "meteor-story").displayEnd, versionSix.startsAt);
});

test("第六版主要节点、两期补给与未知签到日期正确且复用图片存在", async () => {
  assert.equal(fallbackVersions.at(-1).title, "雪凇幽梦");
  for (const event of versionSixEvents) {
    assert.ok(Number.isFinite(Date.parse(event.start)));
    if (event.end) assert.ok(Date.parse(event.end) > Date.parse(event.start));
    if (event.image) await access(new URL(`../${event.image}`, import.meta.url));
  }
  const supply = versionSixEvents.filter((event) => event.id.startsWith("sanity-supply"));
  assert.deepEqual(supply.map((event) => event.start), ["2026-09-17T04:00:00+08:00", "2026-10-08T04:00:00+08:00"]);
  assert.equal(versionSixEvents.find((event) => event.id === "winter-next-version-warmup").startUnknown, true);
});
