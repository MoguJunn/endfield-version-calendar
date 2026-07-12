import {
  buildEventsForVersion,
  buildSeamlessEvents,
  categories,
  filterEvents,
  serializePublicEvent,
  serializePublicVersion,
} from "../../lib/calendar-core.js";
import { loadCalendar } from "../_lib/calendar-service.js";
import { createMemoryRateLimiter, getRequesterKey } from "../_lib/rate-limit.js";

const ALLOWED_CATEGORIES = new Set(categories.map((category) => category.id));
const ALLOWED_STATUSES = new Set(["upcoming", "live", "ended"]);
const ALLOWED_PARAMETERS = new Set(["version", "category", "status", "from", "to"]);
const RFC3339_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/u;

function setCommonHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");
}

function setNoStoreHeaders(response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("CDN-Cache-Control", "no-store");
  response.setHeader("Vercel-CDN-Cache-Control", "no-store");
}

function sendJson(response, statusCode, body, { cacheable = false } = {}) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (!cacheable) setNoStoreHeaders(response);
  response.end(JSON.stringify(body));
}

function errorBody(code, message, details = null) {
  return { success: false, apiVersion: "1", error: { code, message, details } };
}

function parseQuery(request) {
  const url = new URL(request.url || "/api/v1/events", "http://localhost");
  const filters = {
    version: "all",
    categories: [],
    status: "all",
    from: null,
    to: null,
  };
  const details = [];
  for (const key of url.searchParams.keys()) {
    if (!ALLOWED_PARAMETERS.has(key)) {
      details.push({ parameter: key, code: "UNKNOWN_PARAMETER", message: `不支持参数 ${key}` });
    }
  }
  for (const key of ALLOWED_PARAMETERS) {
    const values = url.searchParams.getAll(key);
    if (values.length > 1) {
      details.push({ parameter: key, code: "DUPLICATE_PARAMETER", message: `${key} 只能提供一次` });
    }
    if (values.length > 0 && values[0].trim() === "") {
      details.push({ parameter: key, code: "EMPTY_PARAMETER", message: `${key} 不能为空` });
    }
    if (values.length > 0 && key !== "category") filters[key] = values[0].trim();
  }
  const categoryValue = url.searchParams.get("category")?.trim() || "all";
  filters.categories = categoryValue === "all"
    ? []
    : [...new Set(categoryValue.split(",").map((value) => value.trim()).filter(Boolean))];
  const invalidCategories = filters.categories.filter((category) => !ALLOWED_CATEGORIES.has(category));
  if (invalidCategories.length > 0 || (categoryValue !== "all" && filters.categories.length === 0)) {
    details.push({
      parameter: "category",
      code: "INVALID_CATEGORY",
      message: `category 必须是 all 或由 ${[...ALLOWED_CATEGORIES].join("、")} 组成的逗号分隔列表`,
      value: categoryValue,
    });
  }
  if (filters.status !== "all" && !ALLOWED_STATUSES.has(filters.status)) {
    details.push({ parameter: "status", code: "INVALID_STATUS", message: "status 必须是 all、upcoming、live、ended 之一", value: filters.status });
  }
  for (const key of ["from", "to"]) {
    if (filters[key] && (!RFC3339_PATTERN.test(filters[key]) || !Number.isFinite(Date.parse(filters[key])))) {
      details.push({ parameter: key, code: "INVALID_DATETIME", message: `${key} 必须是带时区的 RFC 3339 时间`, value: filters[key] });
    }
  }
  if (filters.from && filters.to && Number.isFinite(Date.parse(filters.from)) && Number.isFinite(Date.parse(filters.to))
    && Date.parse(filters.from) >= Date.parse(filters.to)) {
    details.push({ parameter: "from", code: "INVALID_RANGE", message: "from 必须早于 to", value: filters.from });
  }
  return { filters, details };
}

function resolveVersionFilter(value, versions) {
  if (!value || value === "all") return null;
  return versions.find((version) => version.versionKey === value || String(version.versionNumber) === value) || null;
}

export function createEventsHandler({
  loadCalendarImpl = loadCalendar,
  now = () => new Date(),
  rateLimiter = createMemoryRateLimiter(),
  requesterKey = getRequesterKey,
} = {}) {
  return async function eventsHandler(request, response) {
    setCommonHeaders(response);
    const method = String(request.method || "GET").toUpperCase();
    if (method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return;
    }
    if (method !== "GET") {
      response.setHeader("Allow", "GET, OPTIONS");
      sendJson(response, 405, errorBody("METHOD_NOT_ALLOWED", "仅支持 GET 和 OPTIONS 请求"));
      return;
    }

    const rateLimit = rateLimiter.check(requesterKey(request));
    if (!rateLimit.allowed) {
      response.setHeader("RateLimit-Limit", String(rateLimit.limit));
      response.setHeader("RateLimit-Remaining", String(rateLimit.remaining));
      response.setHeader("Retry-After", String(rateLimit.retryAfter));
      sendJson(response, 429, errorBody(
        "RATE_LIMITED",
        `请求过于频繁，请在 ${rateLimit.retryAfter} 秒后重试`,
      ));
      return;
    }

    const { filters, details } = parseQuery(request);
    if (details.length > 0) {
      sendJson(response, 400, errorBody("INVALID_QUERY", "查询参数无效", details));
      return;
    }

    try {
      const calendar = await loadCalendarImpl();
      const selectedVersion = resolveVersionFilter(filters.version, calendar.versions);
      if (filters.version !== "all" && !selectedVersion) {
        sendJson(response, 400, errorBody("INVALID_QUERY", "查询参数无效", [{
          parameter: "version", code: "UNKNOWN_VERSION", message: "version 不存在", value: filters.version,
        }]));
        return;
      }

      const generatedAt = now();
      const requestUrl = new URL(
        request.url || "/api/v1/events",
        `${request.headers?.["x-forwarded-proto"] || "https"}://${request.headers?.["x-forwarded-host"] || request.headers?.host || "ef-cal.mogujun.icu"}`,
      );
      const publicBaseUrl = new URL("/", requestUrl);
      const eventFilters = {
        version: selectedVersion?.versionKey || null,
        categories: filters.categories,
        status: filters.status === "all" ? null : filters.status,
        from: filters.from,
        to: filters.to,
      };
      const sourceEvents = selectedVersion
        ? buildEventsForVersion(selectedVersion).map((event) => ({ ...event, versionKey: selectedVersion.versionKey }))
        : buildSeamlessEvents(calendar.versions);
      const events = filterEvents(sourceEvents, eventFilters, { now: generatedAt })
        .map((event) => serializePublicEvent(event, { now: generatedAt, baseUrl: publicBaseUrl }));
      const publicVersions = (selectedVersion ? [selectedVersion] : calendar.versions).map(serializePublicVersion);
      const normalizedFilters = {
        version: selectedVersion?.versionKey || "all",
        categories: filters.categories.length > 0 ? filters.categories : ["all"],
        status: filters.status,
        from: filters.from,
        to: filters.to,
      };
      const cacheControl = "public, max-age=0, s-maxage=60, stale-while-revalidate=300";
      response.setHeader("Cache-Control", cacheControl);
      response.setHeader("CDN-Cache-Control", cacheControl);
      response.setHeader("Vercel-CDN-Cache-Control", cacheControl);
      sendJson(response, 200, {
        success: true,
        apiVersion: "1",
        generatedAt: generatedAt.toISOString(),
        timeZone: "Asia/Shanghai",
        source: calendar.source,
        data: {
          activeVersionKey: calendar.activeVersionKey,
          versions: publicVersions,
          events,
        },
        meta: {
          total: events.length,
          filters: normalizedFilters,
          warnings: calendar.warnings || [],
        },
      }, { cacheable: true });
    } catch {
      sendJson(response, 500, errorBody("INTERNAL_ERROR", "活动日历暂时不可用"));
    }
  };
}

export default createEventsHandler();
