import {
  MAIN_SITE_STATS_API,
  buildLegacyPoolCatalog,
  fallbackVersions,
  poolOverlapsVersion,
} from "../../lib/calendar-core.js";

export const CALENDAR_FETCH_TIMEOUT_MS = 8000;

function cloneFallbackVersions() {
  return fallbackVersions.map((version) => ({
    ...version,
    content: { ...version.content, events: [...(version.content?.events || [])] },
    pools: [...(version.pools || [])],
    poolNames: { ...(version.poolNames || {}) },
  }));
}

function payloadData(payload) {
  return payload?.data && typeof payload.data === "object" ? payload.data : payload;
}

function extractVersionCalendar(payload) {
  const data = payloadData(payload);
  const snapshot = data?.versionCalendar || data?.version_calendar || data;
  return snapshot && Array.isArray(snapshot.versions) && snapshot.versions.length > 0 ? snapshot : null;
}

function latestUpdatedAt(versions = []) {
  const values = versions
    .flatMap((version) => [version?.updatedAt, version?.publishedAt, version?.sourceMeta?.timelineUpdatedAt])
    .map((value) => Date.parse(value || ""))
    .filter(Number.isFinite);
  return values.length > 0 ? new Date(Math.max(...values)).toISOString() : null;
}

function sourceDescriptor(mode, versions, partial = mode !== "origin") {
  return {
    mode,
    partial,
    updatedAt: latestUpdatedAt(versions),
  };
}

function extractRows(payload, camelKey, snakeKey = camelKey) {
  const data = payloadData(payload);
  const rows = data?.[camelKey] ?? data?.[snakeKey];
  return Array.isArray(rows) ? rows : [];
}

export async function fetchMainSiteStats(type, {
  fetchImpl = globalThis.fetch,
  timeoutMs = CALENDAR_FETCH_TIMEOUT_MS,
} = {}) {
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl 必须是函数");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = new URL(MAIN_SITE_STATS_API);
    url.searchParams.set("type", type);
    const response = await fetchImpl(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response?.ok) throw new Error(`主站数据接口返回 ${response?.status ?? "未知状态"}`);
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadLegacyCalendar(options) {
  const warnings = [];
  const [poolsResult, charactersResult] = await Promise.allSettled([
    fetchMainSiteStats("pool_catalog", options),
    fetchMainSiteStats("characters", options),
  ]);
  if (poolsResult.status === "rejected") warnings.push(`pool_catalog: ${poolsResult.reason?.message || "读取失败"}`);
  if (charactersResult.status === "rejected") warnings.push(`characters: ${charactersResult.reason?.message || "读取失败"}`);
  const poolRows = poolsResult.status === "fulfilled" ? extractRows(poolsResult.value, "pools") : [];
  const characterRows = charactersResult.status === "fulfilled"
    ? extractRows(charactersResult.value, "characters")
    : [];
  if (poolRows.length === 0) return null;

  const catalog = buildLegacyPoolCatalog(poolRows, characterRows);
  const versions = cloneFallbackVersions().map((version) => {
    const pools = catalog.filter((pool) => poolOverlapsVersion(pool, version));
    return { ...version, pools, poolNames: Object.fromEntries(pools.map((pool) => [pool.poolId, pool.name])) };
  });
  return {
    source: sourceDescriptor("partial", versions, true),
    versions,
    activeVersionKey: "version-5",
    warnings,
  };
}

export async function loadCalendar({
  fetchImpl = globalThis.fetch,
  timeoutMs = CALENDAR_FETCH_TIMEOUT_MS,
} = {}) {
  const options = { fetchImpl, timeoutMs };
  const warnings = [];
  try {
    const payload = await fetchMainSiteStats("version_calendar", options);
    const snapshot = extractVersionCalendar(payload);
    if (snapshot) {
      const isPartial = Boolean(
        payload?.success === false
        || payload?.partial
        || payload?.error
        || payload?.meta?.partial
        || payload?.meta?.stale,
      );
      return {
        source: sourceDescriptor(isPartial ? "partial" : "origin", snapshot.versions, isPartial),
        versions: snapshot.versions,
        activeVersionKey: snapshot.activeVersionKey || snapshot.active_version_key || snapshot.versions.at(-1)?.versionKey || null,
        warnings,
      };
    }
    warnings.push("version_calendar: 响应中没有有效版本数据");
  } catch (error) {
    warnings.push(`version_calendar: ${error?.message || "读取失败"}`);
  }

  try {
    const legacy = await loadLegacyCalendar(options);
    if (legacy) return { ...legacy, warnings: [...warnings, ...legacy.warnings] };
  } catch (error) {
    warnings.push(`旧版卡池数据: ${error?.message || "读取失败"}`);
  }

  return {
    source: sourceDescriptor("fallback", fallbackVersions, true),
    versions: cloneFallbackVersions(),
    activeVersionKey: "version-5",
    warnings,
  };
}
