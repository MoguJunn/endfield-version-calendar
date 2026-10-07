import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { buildEventsForVersion, buildLegacyPoolCatalog, buildSeamlessEvents, fallbackVersion, fallbackVersions, poolToEvent, serializePublicEvent, serializePublicVersion, statusOf } from "../lib/calendar-core.js";
import { versionSix, versionSixEvents } from "../lib/version-six.js";

const military = { poolId: "weponbox_1_4_1", name: "军列申领", type: "arsenal", startsAt: "2026-07-16T04:00:00Z", endsAt: "2026-09-30T04:00:00Z", backgroundUrl: "/avatars/weapons/test.png" };

test("数据库重构子类型和期次经过公开 API 与浏览器合并后仍正确展示", () => {
  const pools = buildLegacyPoolCatalog([
    { id: "joint_manual_extra_pool_character", name: "祖泉的新流", type: "extra", extra_subtype: "reconstruction", extra_series_phase: 2, start_time: "2026-10-29T04:00:00Z", end_time: "2026-11-19T04:00:00Z" },
    { id: "joint_manual_extra_pool_weapon", name: "细枝申领", type: "extra", extra_subtype: "reconstruction_claim", extra_series_phase: 2, start_time: "2026-10-29T04:00:00Z", end_time: "2026-11-19T04:00:00Z" },
  ], []);
  const version = { versionKey: "version-7", startsAt: "2026-10-15T04:00:00Z", endsAt: "2026-11-26T04:00:00Z", pools, content: { events: [] } };
  const events = buildEventsForVersion(version);
  assert.equal(events.find((event) => event.category === "operator").title, "「祖泉的新流」重构寻访 · 第2期");
  assert.equal(events.find((event) => event.category === "arsenal").title, "「细枝申领」重构申领 · 第2期");
  const restored = buildEventsForVersion({ ...version, pools: [], content: { resolvedPoolTimings: true, events: events.map(serializePublicEvent) } });
  assert.deepEqual(restored.map((event) => [event.title, event.poolKind, event.extraSeriesPhase]), events.map((event) => [event.title, event.poolKind, event.extraSeriesPhase]));
});

test("旧重构池展示本地第一期，数据库维护新期次时覆盖旧标注", () => {
  const local = versionSixEvents.find((event) => event.category === "arsenal" && event.poolKind === "reconstruction");
  const event = buildEventsForVersion({ ...versionSix, pools: [{ poolId: local.poolId, name: "点绘申领", type: "arsenal", poolKind: "reconstruction", extraSeriesPhase: 3, startsAt: local.start, endsAt: local.end }] }).find((item) => item.poolId === local.poolId);
  assert.equal(event.title, "「点绘申领」重构申领 · 第3期");
  assert.equal(buildEventsForVersion(versionSix).find((item) => item.id === local.id).title, "「点绘申领」重构申领 · 第1期");
});

test("旧手动绑定被正式 ID 替换后只保留一个跨版本卡池", () => {
  const result = buildSeamlessEvents([
    { ...fallbackVersion, pools: [military], poolBindings: { "weapon-years": "weaponbox_manual_weapon_pool_1g47uo_20260716_7bm8em" } },
    { ...versionSix, pools: [military] },
  ]);
  const matched = result.filter((event) => event.title === "「军列申领」");
  assert.equal(matched.length, 1);
  assert.equal(matched[0].poolId, military.poolId);
  assert.equal(matched[0].end, military.endsAt);
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

test("单版本接口和总轴均使用明曜申领数据库结束时间", () => {
  const pool = { ...military, poolId: "weponbox_1_4_2", name: "明曜申领", startsAt: "2026-08-09T04:00:00Z", endsAt: "2026-09-29T04:00:00Z" };
  const single = buildEventsForVersion({ ...versionSix, pools: [pool] }).find((event) => event.poolId === pool.poolId);
  const all = buildSeamlessEvents([{ ...fallbackVersion, pools: [pool] }, { ...versionSix, pools: [pool] }]).filter((event) => event.poolId === pool.poolId);
  assert.equal(all.length, 1);
  assert.equal(single.end, pool.endsAt);
  assert.equal(all[0].end, pool.endsAt);
  assert.equal(single.endLabel, null);
  assert.equal(all[0].endLabel, single.endLabel);
});

test("重构池即使远端没有颜色也能展示且保留新类型与最新时间", () => {
  for (const category of ["operator", "arsenal"]) {
    const local = versionSixEvents.find((event) => event.poolKind === "reconstruction" && event.category === category);
    const pool = { poolId: local.poolId, name: category === "operator" ? "绚丽异彩" : "点绘申领", type: category, startsAt: local.start, endsAt: "2026-10-15T12:00:00+08:00", backgroundUrl: "/avatars/reconstruction.png" };
    const result = buildEventsForVersion({ ...versionSix, content: { events: [{ ...local, color: null, end: null, endLabel: "版本更新维护前" }] }, pools: [pool] });
    const event = result.find((item) => item.id === local.id);
    assert.equal(event.title, local.title);
    assert.equal(event.end, pool.endsAt);
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
  const restored = versions.map((version) => ({ ...serializePublicVersion(version), content: { resolvedPoolTimings: true, events: publicEvents.filter((event) => event.versionKey === version.versionKey) }, pools: [] }));
  const result = buildSeamlessEvents(restored);
  assert.equal(result.length, original.length);
  assert.equal(result.filter((event) => event.title === "「军列申领」").length, 1);
  assert.equal(result.find((event) => event.poolId === military.poolId).end, military.endsAt);
  assert.equal(result.find((event) => event.id === "meteor-story").displayEnd, versionSix.startsAt);
});

test("幽寒申领数据库起止时间覆盖第六版本地空结束时间及远端旧活动", () => {
  const local = versionSixEvents.find((event) => event.id === "deep-cold-issue");
  const pool = { poolId: local.poolId, name: "幽寒申领", type: "arsenal", startsAt: "2026-09-03T12:00:00+08:00", endsAt: "2026-10-12T11:59:00+08:00" };
  const events = buildEventsForVersion({ ...versionSix, content: { events: [{ ...local, start: "2026-09-02T12:00:00+08:00", end: null }] }, pools: [pool] });
  const event = events.find((item) => item.poolId === local.poolId);
  assert.equal(event.start, pool.startsAt);
  assert.equal(event.end, pool.endsAt);
  assert.equal(event.endLabel, null);
  assert.equal(statusOf(event, new Date("2026-10-13T00:00:00Z")), "ended");
  const story = events.find((item) => item.id === "winter-forest-story");
  assert.equal(story.start, versionSixEvents.find((item) => item.id === story.id).start);
  assert.equal(events.find((item) => item.id.startsWith("sanity-supply")).image,
    versionSixEvents.find((item) => item.id.startsWith("sanity-supply")).image);
  assert.equal(poolToEvent(pool).end, pool.endsAt);
});

test("数据库明确空结束时间不能被本地或远端结束日期和规则填回", () => {
  const local = versionSixEvents.find((event) => event.poolKind === "reconstruction" && event.category === "arsenal");
  const pool = { poolId: local.poolId, name: "点绘申领", type: "arsenal", startsAt: local.start, endsAt: null };
  const event = buildEventsForVersion({ ...versionSix, pools: [pool] }).find((item) => item.poolId === local.poolId);
  assert.equal(event.end, null);
  assert.equal(event.endLabel, null);
  assert.equal(event.endDate, null);
  assert.equal(poolToEvent(pool).end, null);
  const legacy = buildLegacyPoolCatalog([{ id: pool.poolId, name: pool.name, start_time: pool.startsAt, end_time: null, endsAt: local.end }], []);
  assert.equal(legacy[0].endsAt, null);
});

test("数据库明确空开始时间不使用本地日期虚构时间轴位置", () => {
  const local = versionSixEvents.find((event) => event.id === "winter-hunt");
  const pool = { poolId: local.poolId, name: "冬猎", type: "operator", startsAt: null, endsAt: local.end };
  assert.equal(buildEventsForVersion({ ...versionSix, pools: [pool] }).some((item) => item.poolId === pool.poolId), false);
  assert.equal(poolToEvent(pool).start, null);
});

test("没有数据库卡池时保留本地备份的相对规则和最新第六版时间", () => {
  const militaryEvent = buildEventsForVersion(fallbackVersion).find((event) => event.id === "weapon-years");
  const pupil = buildEventsForVersion(fallbackVersion).find((event) => event.id === "weapon-pupil");
  assert.equal(militaryEvent.end, "2026-09-24T11:59:00+08:00");
  assert.equal(pupil.end, null);
  assert.equal(pupil.endLabel, "「冬猎」后第1个特许寻访结束时");
  const local = versionSixEvents.find((event) => event.id === "winter-hunt");
  const event = buildEventsForVersion({ ...versionSix, content: { events: [{ ...local, end: null }] } }).find((item) => item.id === local.id);
  assert.equal(event.end, local.end);
  assert.equal("databasePoolName" in event, false);
});

test("只有远端活动时使用备份时间但不标记为数据库记录", () => {
  const remote = { id: "remote", poolId: "special_remote", category: "operator", title: "「远端寻访」", start: "2026-09-03T12:00:00+08:00", end: null };
  const event = buildEventsForVersion({ ...versionSix, content: { events: [remote] }, pools: [] }).find((item) => item.id === remote.id);
  assert.equal(event.start, remote.start);
  assert.equal(event.end, null);
  assert.equal("databasePoolName" in event, false);
});

test("客户端恢复公开 API 后仍保留数据库时间和明确空结束时间", async () => {
  const local = versionSixEvents.find((event) => event.id === "deep-cold-issue");
  const pool = { poolId: local.poolId, name: "幽寒申领", type: "arsenal", startsAt: "2026-09-04T12:00:00+08:00", endsAt: "2026-10-12T11:59:00+08:00" };
  const reconstruction = versionSixEvents.find((event) => event.poolKind === "reconstruction" && event.category === "operator");
  const nullPool = { poolId: reconstruction.poolId, name: "绚丽异彩", type: "operator", startsAt: reconstruction.start, endsAt: null };
  const hunt = versionSixEvents.find((event) => event.id === "winter-hunt");
  const unknownStartPool = { poolId: hunt.poolId, name: "冬猎", type: "operator", startsAt: null, endsAt: hunt.end };
  const versions = [fallbackVersion, { ...versionSix, pools: [pool, nullPool, unknownStartPool] }];
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const applyPublicCalendarSource = source.slice(source.indexOf("function applyPublicCalendar("), source.indexOf("function applyPoolNames("));
  let restored;
  const applyPublicCalendar = runInNewContext(`(${applyPublicCalendarSource})`, {
    applyVersionSnapshot(snapshot) { restored = buildSeamlessEvents(snapshot.versions); return true; },
  });
  assert.equal(applyPublicCalendar({ data: { versions: versions.map(serializePublicVersion), events: buildSeamlessEvents(versions).map((event) => serializePublicEvent(event)) } }), true);
  const event = restored.find((item) => item.poolId === pool.poolId);
  assert.equal(event.start, pool.startsAt);
  assert.equal(event.end, pool.endsAt);
  assert.equal(restored.find((item) => item.poolId === nullPool.poolId).end, null);
  assert.equal(restored.find((item) => item.poolId === nullPool.poolId).endLabel, null);
  assert.equal(restored.some((item) => item.poolId === unknownStartPool.poolId), false);
});

test("第六版主要节点、两期补给与官方签到日期正确且图片存在", async () => {
  assert.equal(fallbackVersions.at(-1).title, "雪凇幽梦");
  for (const event of versionSixEvents) {
    assert.ok(Number.isFinite(Date.parse(event.start)));
    if (event.end) assert.ok(Date.parse(event.end) > Date.parse(event.start));
    if (event.image) await access(new URL(`../${event.image}`, import.meta.url));
  }
  const supply = versionSixEvents.filter((event) => event.id.startsWith("sanity-supply"));
  assert.deepEqual(supply.map((event) => event.start), ["2026-09-17T04:00:00+08:00", "2026-10-08T04:00:00+08:00"]);
  const signin = versionSixEvents.find((event) => event.id === "winter-next-version-warmup");
  assert.equal(signin.title, "「天地墨显」限时签到");
  assert.equal(signin.start, "2026-10-08T12:00:00+08:00");
  assert.equal(signin.end, "2026-10-15T06:00:00+08:00");
  assert.equal(signin.startUnknown, false);
  assert.equal(signin.startLabel, null);
  const old = { ...signin, title: "新版本预热签到活动", start: "2026-10-12T04:00:00+08:00", startUnknown: true, startLabel: "待官方公布", image: null };
  const merged = buildEventsForVersion({ ...versionSix, content: { events: [old] } }).find((event) => event.id === signin.id);
  const restored = buildEventsForVersion({ ...serializePublicVersion(versionSix), pools: [], content: { resolvedPoolTimings: true, events: [serializePublicEvent(merged)] } }).find((event) => event.id === signin.id);
  assert.equal(restored.title, signin.title);
  assert.equal(restored.start, signin.start);
  assert.equal(restored.end, signin.end);
  assert.equal(restored.startUnknown, false);
  assert.equal(restored.startLabel, null);
  assert.match(restored.image, /heaven-earth-ink-signin\.webp$/u);
});
