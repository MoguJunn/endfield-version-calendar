import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { officialPoolBanners } from "../lib/pool-banners.js";
import { normalizeEvents, serializePublicEvent } from "../lib/calendar-core.js";

test("官方横幅在旧头像数据与公开API再次恢复后生效，保持数据库时间与稳定身份", async () => {
  for (const banner of officialPoolBanners) {
    await access(new URL(`../assets/events/${banner.file}`, import.meta.url));
    const source = {
      id: "official-pool", poolId: "official-id", category: banner.category,
      poolKind: banner.poolKind || "standard", extraSeriesPhase: banner.extraSeriesPhase, title: `「${banner.name}」`,
      start: "2026-10-01T12:00:00+08:00", end: null, image: "https://example.com/old-avatar.png",
      sourceNote: "时间来自主站数据库",
    };
    const event = normalizeEvents([source])[0];
    assert.equal(event.image, `./assets/events/${banner.file}`);
    assert.equal(event.start, source.start);
    assert.equal(event.end, null);
    assert.equal(event.id, source.id);
    assert.equal(event.poolId, source.poolId);
    assert.ok(event.sourceNote.includes(banner.source));
    const restored = normalizeEvents([serializePublicEvent(event)])[0];
    assert.equal(restored.image, event.image);
    assert.equal(restored.sourceNote, event.sourceNote);
  }
});

test("同名初次寻访及不同重构期次不使用本期公告横幅，未核验卡池保留既有图片", () => {
  const source = {
    id: "original", category: "operator", poolKind: "standard", title: "「绚丽异彩」特许寻访",
    start: "2026-02-01T12:00:00+08:00", image: "https://example.com/original.png",
  };
  assert.equal(normalizeEvents([source])[0].image, source.image);
  assert.equal(normalizeEvents([{ ...source, poolKind: "reconstruction", extraSeriesPhase: 2 }])[0].image, source.image);
  assert.equal(normalizeEvents([{ ...source, category: "arsenal", title: "「冬猎」" }])[0].image, source.image);
  assert.equal(normalizeEvents([{ ...source, title: "「尚未核验的卡池」" }])[0].image, source.image);
});
