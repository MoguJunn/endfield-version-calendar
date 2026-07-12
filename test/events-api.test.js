import test from "node:test";
import assert from "node:assert/strict";

import { createEventsHandler } from "../api/v1/events.js";
import { createMemoryRateLimiter } from "../api/_lib/rate-limit.js";

const fixtureCalendar = {
  source: { mode: "origin", partial: false, updatedAt: null },
  activeVersionKey: "version-1",
  warnings: [],
  versions: [{
    versionKey: "version-1", versionNumber: "1", title: "测试版本",
    startsAt: "2026-01-01T00:00:00Z", endsAt: "2026-02-01T00:00:00Z",
    content: { activitiesComplete: true, events: [
      { id: "live", category: "limited", title: "进行中", start: "2026-01-10T00:00:00Z", end: "2026-01-20T00:00:00Z", image: "./assets/live.png", user_id: "private-user", description: "" },
      { id: "future", category: "operator", title: "将来", start: "2026-01-25T00:00:00Z", end: "2026-01-30T00:00:00Z", description: "" },
    ] },
    pools: [], poolNames: {},
  }],
};

function createResponse() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: "",
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    end(value = "") { this.body = value; },
  };
}

function makeHandler(overrides = {}) {
  return createEventsHandler({
    loadCalendarImpl: async () => fixtureCalendar,
    now: () => new Date("2026-01-15T00:00:00Z"),
    ...overrides,
  });
}

test("OPTIONS 返回 CORS 预检响应且不读取数据", async () => {
  let called = false;
  const handler = makeHandler({ loadCalendarImpl: async () => { called = true; return fixtureCalendar; } });
  const response = createResponse();
  await handler({ method: "OPTIONS", url: "/api/v1/events" }, response);
  assert.equal(response.statusCode, 204);
  assert.equal(response.getHeader("access-control-allow-origin"), "*");
  assert.equal(called, false);
});

test("非 GET 方法返回结构化 405", async () => {
  const response = createResponse();
  await makeHandler()({ method: "POST", url: "/api/v1/events" }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.getHeader("allow"), "GET, OPTIONS");
  assert.equal(JSON.parse(response.body).error.code, "METHOD_NOT_ALLOWED");
});

test("无效查询返回含字段详情的 400", async () => {
  const response = createResponse();
  await makeHandler()({ method: "GET", url: "/api/v1/events?category=bad&from=2026-01-01" }, response);
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 400);
  assert.equal(body.error.code, "INVALID_QUERY");
  assert.deepEqual(body.error.details.map((detail) => detail.parameter), ["category", "from"]);
});

test("GET 支持版本、分类、状态和时间范围筛选", async () => {
  const response = createResponse();
  await makeHandler()({ method: "GET", url: "/api/v1/events?version=1&category=limited&status=live&from=2026-01-12T00%3A00%3A00Z&to=2026-01-16T00%3A00%3A00Z" }, response);
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(response.getHeader("cache-control"), "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  assert.equal(body.success, true);
  assert.equal(body.apiVersion, "1");
  assert.equal(body.timeZone, "Asia/Shanghai");
  assert.equal(body.meta.filters.version, "version-1");
  assert.equal(body.meta.total, 1);
  assert.equal(body.data.events[0].id, "live");
  assert.equal(body.data.events[0].status, "live");
  assert.equal(body.data.events[0].versionKey, "version-1");
  assert.equal(body.data.events[0].image, "https://ef-cal.mogujun.icu/assets/live.png");
  assert.equal(JSON.stringify(body).includes("private-user"), false);
});

test("默认 all 与逗号分类返回稳定 v1 数据结构", async () => {
  const response = createResponse();
  await makeHandler()({ method: "GET", url: "/api/v1/events?category=limited,operator", headers: {} }, response);
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 200);
  assert.equal(body.data.activeVersionKey, "version-1");
  assert.equal(body.data.events.length, 2);
  assert.deepEqual(body.meta.filters.categories, ["limited", "operator"]);
  assert.equal(body.source.mode, "origin");
});

test("不存在的版本返回结构化 400", async () => {
  const response = createResponse();
  await makeHandler()({ method: "GET", url: "/api/v1/events?version=99" }, response);
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 400);
  assert.equal(body.error.details[0].code, "UNKNOWN_VERSION");
});

test("不可恢复的服务错误返回稳定 500 且不泄露堆栈", async () => {
  const response = createResponse();
  await makeHandler({ loadCalendarImpl: async () => { throw new Error("upstream secret"); } })(
    { method: "GET", url: "/api/v1/events", headers: {} },
    response,
  );
  const body = JSON.parse(response.body);
  assert.equal(response.statusCode, 500);
  assert.equal(body.success, false);
  assert.equal(body.error.code, "INTERNAL_ERROR");
  assert.equal(JSON.stringify(body).includes("stack"), false);
});

test("同一 IP 超出限额后返回 429 和重试提示", async () => {
  const handler = makeHandler({
    rateLimiter: createMemoryRateLimiter({ windowMs: 60_000, max: 2 }),
  });
  const request = {
    method: "GET",
    url: "/api/v1/events",
    headers: { "x-forwarded-for": "203.0.113.8" },
  };

  const first = createResponse();
  const second = createResponse();
  const third = createResponse();
  await handler(request, first);
  await handler(request, second);
  await handler(request, third);

  assert.equal(first.statusCode, 200);
  assert.equal(first.getHeader("ratelimit-limit"), undefined);
  assert.equal(second.statusCode, 200);
  assert.equal(third.statusCode, 429);
  assert.equal(third.getHeader("ratelimit-limit"), "2");
  assert.equal(third.getHeader("ratelimit-remaining"), "0");
  assert.equal(third.getHeader("retry-after"), "60");
  assert.equal(third.getHeader("cache-control"), "no-store");
  assert.equal(third.getHeader("cdn-cache-control"), "no-store");
  assert.equal(JSON.parse(third.body).error.code, "RATE_LIMITED");
});

test("OPTIONS 不占额度且不同 IP 分别计数", async () => {
  const limiter = createMemoryRateLimiter({ windowMs: 60_000, max: 1 });
  const handler = makeHandler({ rateLimiter: limiter });

  const preflight = createResponse();
  await handler({
    method: "OPTIONS",
    url: "/api/v1/events",
    headers: { "x-forwarded-for": "203.0.113.9" },
  }, preflight);

  const firstIp = createResponse();
  await handler({
    method: "GET",
    url: "/api/v1/events",
    headers: { "x-forwarded-for": "203.0.113.9" },
  }, firstIp);

  const secondIp = createResponse();
  await handler({
    method: "GET",
    url: "/api/v1/events",
    headers: { "x-forwarded-for": "203.0.113.10" },
  }, secondIp);

  assert.equal(preflight.statusCode, 204);
  assert.equal(firstIp.statusCode, 200);
  assert.equal(secondIp.statusCode, 200);
});

test("限速窗口结束后恢复额度", () => {
  let currentTime = 1_000;
  const limiter = createMemoryRateLimiter({
    windowMs: 1_000,
    max: 1,
    now: () => currentTime,
  });

  assert.equal(limiter.check("client").allowed, true);
  assert.equal(limiter.check("client").allowed, false);
  currentTime = 2_000;
  const resetResult = limiter.check("client");
  assert.equal(resetResult.allowed, true);
  assert.equal(resetResult.remaining, 0);
});
