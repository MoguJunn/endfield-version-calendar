export const MAIN_SITE_STATS_API = "https://ef-gacha.mogujun.icu/api/stats";

export const categories = Object.freeze([
  { id: "operator", name: "干员寻访", en: "OPERATOR HEADHUNTING", icon: "⌁" },
  { id: "arsenal", name: "武库申领", en: "ARSENAL ISSUE", icon: "✕" },
  { id: "permanent", name: "常驻活动", en: "PERMANENT CONTENT", icon: "▦" },
  { id: "limited", name: "限时活动", en: "LIMITED EVENTS", icon: "✦" },
  { id: "update", name: "内容更新", en: "CONTENT UPDATE", icon: "⚑", overlay: true },
]);

export const rawEvents = Object.freeze([
  {
    id: "op-wander", poolId: "special_manual_limited_pool_ixd68v_20260716_1aogy7",
    category: "operator", title: "「临渊望北」特许寻访",
    related: "「踏渊北眺」签到 & 作战演练", start: "2026-07-16T12:00:00+08:00",
    end: "2026-08-09T11:59:00+08:00", color: "#43aebc", lane: 0, symbol: "渊",
    visual: "rift", description: "「向渊行」版本首期特许寻访，同期开放「踏渊北眺」签到与「作战演练」干员试用活动。",
  },
  {
    id: "op-dawn", poolId: "special_manual_limited_pool_1d87dz_20260809_nsisrc",
    category: "operator", title: "「晨星于此闪耀」特许寻访",
    related: "「明耀晨星」签到 & 作战演练", start: "2026-08-09T12:00:00+08:00",
    end: "2026-09-02T06:00:00+08:00", color: "#af42d7", lane: 0, symbol: "星",
    visual: "star", description: "版本第二期特许寻访，于 8 月 9 日中午开放，同期开放「明耀晨星」签到与「作战演练」干员试用活动。",
  },
  {
    id: "weapon-years", poolId: "weaponbox_manual_weapon_pool_1g47uo_20260716_7bm8em",
    category: "arsenal", title: "「军列申领」", start: "2026-07-16T12:00:00+08:00", end: null,
    endLabel: "「晨星于此闪耀」后第1个特许寻访结束时", color: "#48c2d5", lane: 0,
    symbol: "轮", visual: "arsenal", description: "版本首期武库申领。结束时间采用海报中的相对规则：于「晨星于此闪耀」后的第 1 个特许寻访结束时关闭。",
  },
  {
    id: "weapon-edge", poolId: "weponbox_1_3_1", category: "arsenal", title: "「绛结申领」",
    start: "2026-06-05T12:00:00+08:00", end: "2026-08-09T11:59:00+08:00",
    color: "#cf1986", lane: 1, symbol: "锋", visual: "arsenal", description: "跨版本持续开放的武库申领，于 8 月 9 日中午结束。",
  },
  {
    id: "weapon-red", poolId: "weponbox_1_3_2", category: "arsenal", title: "「染赤申领」",
    start: "2026-06-26T12:00:00+08:00", end: "2026-09-02T06:00:00+08:00",
    color: "#c7003c", lane: 2, symbol: "赤", visual: "arsenal", description: "跨越完整版本周期的武库申领。",
  },
  {
    id: "weapon-pupil", poolId: "weaponbox_manual_weapon_pool_4e5oi9_20260809_roujh3",
    category: "arsenal", title: "「明曜申领」", start: "2026-08-09T12:00:00+08:00", end: null,
    endLabel: "「晨星于此闪耀」后第2个特许寻访结束时", color: "#b54ad2", lane: 1,
    symbol: "瞳", visual: "arsenal", description: "版本后半程新增武库申领。结束时间采用海报中的相对规则：于「晨星于此闪耀」后的第 2 个特许寻访结束时关闭。",
  },
  {
    id: "war-echo-1", category: "permanent", title: "「战争回响」新赛季「追忆赛季」",
    start: "2026-07-16T12:00:00+08:00", end: "2026-08-09T11:59:00+08:00", color: "#df2118",
    lane: 0, symbol: "战", visual: "echo", image: "./assets/events/Version%205/战争回想（两赛季相同）.png",
    description: "战争回响当前赛季，将在 8 月 9 日中午完成轮换。",
  },
  {
    id: "war-echo-2", category: "permanent", title: "「战争回响」新赛季「谵妄赛季」",
    start: "2026-08-09T12:00:00+08:00", end: "2026-09-02T06:00:00+08:00", color: "#d92222",
    lane: 0, symbol: "战", visual: "echo", image: "./assets/events/Version%205/战争回想（两赛季相同）.png",
    description: "8 月 9 日开放的新一期战争回响赛季。",
  },
  {
    id: "meteor-story", category: "permanent", title: "「如同流星飞越边界」梨诺叙事活动",
    start: "2026-08-09T12:00:00+08:00", end: null, color: "#ae36e0", lane: 1, permanent: true,
    symbol: "契", visual: "story", image: "./assets/events/Version%205/如同流星飞越边界.png",
    description: "梨诺叙事活动于 8 月 9 日起常驻开放，无限时结束时间。",
  },
  {
    id: "monument-birds", category: "permanent", title: "「影拓丰碑」新系列「山中见犼」",
    start: "2026-08-06T12:00:00+08:00", end: null, color: "#8e2725", lane: 2, permanent: true,
    symbol: "碑", visual: "monument", image: "./assets/events/Version%205/影拓丰碑+丰碑留名.png",
    description: "新系列内容于 8 月 6 日中午起常驻开放。",
  },
  {
    id: "monument-beast", category: "permanent", title: "「丰碑留名 · 兽犼」",
    start: "2026-08-06T12:00:00+08:00", end: "2026-08-20T04:00:00+08:00", color: "#76312f",
    lane: 3, symbol: "兽", visual: "monument", image: "./assets/events/Version%205/影拓丰碑+丰碑留名.png",
    description: "限期开放的丰碑挑战内容。",
  },
  {
    id: "secret-realm", category: "permanent", title: "「密境行者」新空间组「六方巧境」",
    start: "2026-08-19T12:00:00+08:00", end: null, color: "#526194", lane: 2, permanent: true,
    symbol: "境", visual: "realm", image: "./assets/events/Version%205/密境行者.png",
    description: "新空间组于 8 月 19 日中午起常驻开放。",
  },
  {
    id: "secret-realm-update", category: "update", eventType: "content-update", overlayFor: "secret-realm",
    title: "「密境行者」内容更新", start: "2026-08-26T04:00:00+08:00", end: null,
    milestone: true, color: "#7181bd", symbol: "更", visual: "realm",
    image: "./assets/events/Version%205/密境行者.png",
    description: "「密境行者」于 8 月 26 日 04:00 更新活动内容。该节点为单次更新时间标记，不代表一段新的持续活动。",
  },
  {
    id: "companion-gift", category: "limited", title: "「相伴赠礼」庆典活动",
    start: "2026-07-16T12:00:00+08:00", end: "2026-08-09T12:00:00+08:00", color: "#b7b600",
    eventInk: "#171a14", lane: 0, symbol: "礼", visual: "gift", image: "./assets/events/Version%205/相伴赠礼.png",
    description: "版本相伴庆典赠礼，活动期间登录参与。",
  },
  {
    id: "fortune", category: "limited", title: "「宏运连连乐」庆典活动",
    start: "2026-07-16T12:00:00+08:00", end: "2026-07-31T04:00:00+08:00", color: "#d96a1f",
    lane: 1, symbol: "运", visual: "festival", image: "./assets/events/Version%205/宏运连连乐.png",
    description: "版本前半程开放的庆典活动。",
  },
  {
    id: "northland", category: "limited", title: "「北观禁土」引入活动",
    start: "2026-07-16T12:00:00+08:00", end: "2026-08-09T12:00:00+08:00", color: "#9d2779",
    lane: 2, symbol: "禁", visual: "northland", image: "./assets/events/Version%205/北观禁土.png",
    description: "随版本首日开放的引入活动。",
  },
  {
    id: "burning-arena", category: "limited", title: "「炽燃！竞技大会！！」挑战活动",
    start: "2026-07-30T12:00:00+08:00", end: "2026-08-13T04:00:00+08:00", color: "#9e2a2d",
    lane: 3, symbol: "竞", visual: "arena", image: "./assets/events/Version%205/炽燃！竞技大会！.png",
    description: "限期竞技挑战活动，开放至 8 月 13 日凌晨。",
  },
  {
    id: "sanity-supply-first", category: "limited", title: "「理智补给」第一期",
    start: "2026-08-02T04:00:00+08:00", end: "2026-08-09T04:00:00+08:00", color: "#7e7c7a",
    lane: 4, symbol: "智", visual: "supply", image: "./assets/events/Version%205/理智补给通用图.png",
    description: "活动期间每日完成指定任务，可获得理智消耗许可及应急理智加强剂等奖励。",
  },
  {
    id: "roots", category: "limited", title: "「根脉奇境」趣味活动",
    start: "2026-08-09T12:00:00+08:00", end: "2026-09-02T06:00:00+08:00", color: "#b8860b",
    lane: 2, symbol: "根", visual: "roots", image: "./assets/events/Version%205/根脉奇境.png",
    description: "版本后半程趣味活动，于版本收束时结束。",
  },
  {
    id: "sanity-supply-final", category: "limited", title: "「理智补给」第二期",
    start: "2026-08-26T04:00:00+08:00", end: "2026-09-02T04:00:00+08:00", color: "#7e7c7a",
    lane: 4, symbol: "智", visual: "supply", image: "./assets/events/Version%205/理智补给通用图.png",
    description: "版本末期开放的第二期理智补给，每日完成指定任务可领取补给奖励。",
  },
  {
    id: "next-version-warmup", category: "limited", title: "新版本预热签到活动",
    start: "2026-08-28T04:00:00+08:00", startUnknown: true, startLabel: "待官方公布（海报标注为 ??）",
    end: "2026-09-02T06:00:00+08:00", color: "#555b57", lane: 5, symbol: "签", visual: "ticket",
    sourceNote: "海报未公布开始时间，仅确认于 2026/09/02 06:00 结束；时间轴位置仅用于表现其处于版本末期。",
    description: "版本收束前开放的新版本预热签到，开始时间待后续官方公告确认。",
  },
]);

export const fallbackVersion = Object.freeze({
  versionKey: "version-5", versionNumber: "5", revision: 1, title: "向渊行",
  startsAt: "2026-07-16T12:00:00+08:00", endsAt: "2026-09-02T06:00:00+08:00",
  content: { activitiesComplete: true, events: rawEvents }, pools: [], poolNames: {},
  sourceMeta: { source: "https://www.bilibili.com/opus/1223774493520953353", author: "罗德岛蜜饼工坊" },
});

export const fallbackVersions = Object.freeze([
  { versionKey: "version-1", versionNumber: "1", revision: 1, title: "零号委托", startsAt: "2026-01-22T03:00:00+00:00", endsAt: "2026-03-12T05:57:36+08:00", content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] }, pools: [], poolNames: {} },
  { versionKey: "version-2", versionNumber: "2", revision: 1, title: "新潮起，故渊离", startsAt: "2026-03-12T04:00:00+00:00", endsAt: "2026-04-17T06:00:00+08:00", content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] }, pools: [], poolNames: {} },
  { versionKey: "version-3", versionNumber: "3", revision: 1, title: "春晓时", startsAt: "2026-04-17T04:00:00+00:00", endsAt: "2026-06-05T12:00:00+08:00", content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] }, pools: [], poolNames: {} },
  { versionKey: "version-4", versionNumber: "4", revision: 1, title: "寻遗散记", startsAt: "2026-06-05T04:00:00+00:00", endsAt: "2026-07-16T06:00:00+08:00", content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] }, pools: [], poolNames: {} },
  fallbackVersion,
]);

export function eventTrackType(event) {
  if (event.trackType) return event.trackType;
  if (event.category === "operator" || event.category === "arsenal") return event.category;
  if (event.id?.startsWith("war-echo")) return "war-echo";
  if (event.id?.startsWith("monument-")) return "monument";
  if (event.id?.startsWith("secret-realm")) return "secret-realm";
  if (event.id === "companion-gift" || event.id === "next-version-warmup") return "signin";
  if (event.id?.startsWith("sanity-supply")) return "sanity-supply";
  return event.visual || event.id || event.category;
}

export function normalizeEvents(sourceEvents, { timelineEnd = Number.POSITIVE_INFINITY } = {}) {
  const input = Array.isArray(sourceEvents) ? sourceEvents : [];
  const normalized = input.map((event) => {
    const followedEvent = event.follows ? input.find((candidate) => candidate.id === event.follows) : null;
    const start = event.start ?? followedEvent?.start;
    const end = event.end === undefined ? followedEvent?.end : event.end;
    return { ...event, start, end, trackType: eventTrackType(event), startDate: new Date(start), endDate: end ? new Date(end) : null };
  }).filter((event) => Number.isFinite(event.startDate.getTime()));

  categories.filter((category) => !category.overlay).forEach((category) => {
    const categoryEvents = normalized.filter((event) => event.category === category.id);
    const typeOrder = [...new Set(categoryEvents.map((event) => event.trackType))];
    let laneOffset = 0;
    typeOrder.forEach((trackType) => {
      const laneEnds = [];
      categoryEvents.filter((event) => event.trackType === trackType)
        .sort((left, right) => left.startDate - right.startDate)
        .forEach((event) => {
          const eventEnd = event.endDate?.getTime() ?? Number(timelineEnd);
          const freeLane = laneEnds.findIndex((laneEnd) => !laneEnd || laneEnd <= event.startDate.getTime());
          const localLane = freeLane === -1 ? laneEnds.length : freeLane;
          event.lane = laneOffset + localLane;
          laneEnds[localLane] = eventEnd;
        });
      laneOffset += Math.max(laneEnds.length, 1);
    });
  });
  return normalized;
}

export function cleanDatabasePoolName(value) {
  return String(value || "").replace(/\s*（前瞻(?:，[^）]*)?）\s*$/u, "").replace(/^「|」$/gu, "").trim();
}

export function formatDatabasePoolTitle(event, poolName) {
  const name = cleanDatabasePoolName(poolName);
  if (!name) return event.title;
  return event.category === "operator" ? `「${name}」特许寻访` : `「${name}」`;
}

export function resolveMainSiteAssetUrl(value, baseUrl = MAIN_SITE_STATS_API) {
  const source = String(value || "").trim();
  if (!source) return null;
  try { return new URL(source, baseUrl).href; } catch { return null; }
}

export function normalizePoolLookupKey(value) {
  return String(value || "").trim().toLocaleLowerCase("zh-CN");
}

export function legacyPoolSequenceKey(poolId) {
  return String(poolId || "").replace(/^(?:special|joint|weaponbox|weponbox)_/iu, "").replace(/^manual_(?:limited|weapon)_pool_/iu, "manual_").trim();
}

export function isLegacyWeaponPool(pool) {
  return /(?:weapon|wepon|武器|申领)/iu.test(`${pool?.type || ""} ${pool?.id || pool?.poolId || ""} ${pool?.name || ""}`);
}

export function buildLegacyPoolCatalog(poolRows, characterRows) {
  const characterLookup = new Map();
  (Array.isArray(characterRows) ? characterRows : []).forEach((character) => {
    [character.id, character.name, ...(Array.isArray(character.aliases) ? character.aliases : [])].forEach((key) => {
      const normalized = normalizePoolLookupKey(key);
      if (normalized && !characterLookup.has(normalized)) characterLookup.set(normalized, character);
    });
  });
  const pools = (Array.isArray(poolRows) ? poolRows : []).map((pool) => ({
    poolId: pool.id || pool.poolId, name: pool.name, type: isLegacyWeaponPool(pool) ? "arsenal" : "operator",
    startsAt: pool.start_time || pool.startsAt, endsAt: pool.end_time || pool.endsAt,
    bannerUrl: pool.banner_url || pool.bannerUrl || null, upCharacter: pool.up_character || pool.upCharacter || null,
    description: pool.description || null,
    featuredCharacters: Array.isArray(pool.featured_characters) ? pool.featured_characters : Array.isArray(pool.featuredCharacters) ? pool.featuredCharacters : [],
  })).filter((pool) => pool.poolId && pool.name && pool.startsAt);
  const operators = pools.filter((pool) => pool.type === "operator");
  const directArtwork = new Map();
  pools.forEach((pool) => {
    const artwork = characterLookup.get(normalizePoolLookupKey(pool.upCharacter))
      || pool.featuredCharacters.map((value) => characterLookup.get(normalizePoolLookupKey(value))).find(Boolean);
    if (artwork) directArtwork.set(pool.poolId, artwork);
  });
  const operatorBySequence = new Map();
  operators.forEach((pool) => {
    const character = directArtwork.get(pool.poolId);
    const sequence = legacyPoolSequenceKey(pool.poolId);
    if (character && sequence && !operatorBySequence.has(sequence)) operatorBySequence.set(sequence, character);
  });
  const weaponOwnerByName = new Map();
  pools.filter((pool) => pool.type === "arsenal").forEach((pool) => {
    const character = operatorBySequence.get(legacyPoolSequenceKey(pool.poolId));
    const weaponName = normalizePoolLookupKey(pool.upCharacter);
    if (character && weaponName && !weaponOwnerByName.has(weaponName)) {
      weaponOwnerByName.set(weaponName, character);
    }
  });
  return pools.map((pool) => {
    let artwork = directArtwork.get(pool.poolId) || null;
    if (!artwork && pool.type === "arsenal") {
      artwork = weaponOwnerByName.get(normalizePoolLookupKey(pool.upCharacter))
        || operatorBySequence.get(legacyPoolSequenceKey(pool.poolId))
        || operators.map((candidate) => ({ candidate, distance: Math.abs(Date.parse(candidate.startsAt) - Date.parse(pool.startsAt)) }))
          .filter(({ distance }) => Number.isFinite(distance) && distance <= 36 * 60 * 60 * 1000)
          .sort((left, right) => left.distance - right.distance)
          .map(({ candidate }) => directArtwork.get(candidate.poolId)).find(Boolean) || null;
    }
    return { ...pool, backgroundCharacter: artwork?.name || null, backgroundType: artwork?.type || null, backgroundUrl: artwork?.avatar_url || artwork?.avatarUrl || null };
  });
}

export function poolOverlapsVersion(pool, version) {
  const poolStart = Date.parse(pool.startsAt || "");
  const poolEnd = Date.parse(pool.endsAt || "");
  const versionStart = Date.parse(version.startsAt || "");
  const versionEnd = Date.parse(version.endsAt || "");
  return Number.isFinite(poolStart) && Number.isFinite(versionStart)
    && (!Number.isFinite(versionEnd) || poolStart < versionEnd)
    && (!Number.isFinite(poolEnd) || poolEnd > versionStart);
}

export const poolColorPalettes = Object.freeze({
  operator: Object.freeze(["#287f91", "#4f65ad", "#8d4f91", "#ad5061", "#347866", "#8a6234", "#6d59a1", "#3c7098", "#a34f3f", "#607a3e"]),
  arsenal: Object.freeze(["#7e5a2e", "#6e4e88", "#356d72", "#914b56", "#555f8d", "#87682f", "#76546b", "#416b88", "#70653b", "#754f43"]),
});

export function stableStringHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

export function poolColorTheme(pool, category) {
  const palette = poolColorPalettes[category] || poolColorPalettes.operator;
  const seed = [pool.poolId, pool.name, pool.startsAt].filter(Boolean).join(":");
  const color = palette[stableStringHash(seed) % palette.length];
  const [red, green, blue] = color.slice(1).match(/.{2}/gu).map((part) => Number.parseInt(part, 16));
  return { color, eventInk: (red * 0.299 + green * 0.587 + blue * 0.114) / 255 > 0.62 ? "#151915" : "#ffffff" };
}

export function poolToEvent(pool, { baseUrl = MAIN_SITE_STATS_API } = {}) {
  const category = pool.type === "arsenal" ? "arsenal" : "operator";
  const name = cleanDatabasePoolName(pool.name);
  return {
    id: `pool-${pool.poolId}`, poolId: pool.poolId, category,
    title: category === "operator" ? `「${name}」特许寻访` : `「${name}」`,
    start: pool.startsAt, end: pool.endsAt, ...poolColorTheme(pool, category), symbol: category === "operator" ? "访" : "武",
    visual: category, image: resolveMainSiteAssetUrl(pool.backgroundUrl || pool.bannerUrl, baseUrl),
    backgroundCharacter: pool.backgroundCharacter || null,
    backgroundType: pool.backgroundType || null,
    description: pool.description || `${name}卡池日程，由主站卡池数据库自动载入。`,
    sourceNote: "开始与结束时间来自主站卡池数据库；跨版本部分会按当前版本边界裁切。",
  };
}

export function buildEventsForVersion(version, options = {}) {
  const localFallback = options.fallbackVersion || fallbackVersion;
  const localEvents = version?.versionKey === localFallback.versionKey ? (options.rawEvents || rawEvents) : [];
  const remoteEvents = Array.isArray(version?.content?.events) ? version.content.events : [];
  const localById = new Map(localEvents.map((event) => [event.id, event]));
  const remoteIds = new Set(remoteEvents.map((event) => event.id));
  const merged = remoteEvents.map((event) => ({ ...(localById.get(event.id) || {}), ...event }));
  localEvents.forEach((event) => { if (!remoteIds.has(event.id)) merged.push(event); });
  const bindings = version?.poolBindings && typeof version.poolBindings === "object" ? version.poolBindings : {};
  const pools = Array.isArray(version?.pools) ? version.pools : [];
  const poolsById = new Map(pools.map((pool) => [pool.poolId, pool]));
  const represented = new Set();
  const enriched = merged.map((event) => {
    const poolId = bindings[event.id] || event.poolId || null;
    const pool = poolId ? poolsById.get(poolId) : null;
    if (poolId) represented.add(poolId);
    if (!pool) return { ...event, poolId };
    return {
      ...event, poolId, title: formatDatabasePoolTitle(event, pool.name),
      image: resolveMainSiteAssetUrl(pool.backgroundUrl || pool.bannerUrl, options.baseUrl) || event.image || null,
      backgroundCharacter: pool.backgroundCharacter || event.backgroundCharacter || null,
      backgroundType: pool.backgroundType || event.backgroundType || null,
      start: event.start || pool.startsAt, end: event.end === undefined ? pool.endsAt : event.end,
      databasePoolName: pool.name,
    };
  });
  pools.forEach((pool) => { if (!represented.has(pool.poolId)) enriched.push(poolToEvent(pool, options)); });
  const versionStart = Date.parse(version?.startsAt || "");
  const versionEnd = Date.parse(version?.endsAt || "");
  return normalizeEvents(enriched, { timelineEnd: versionEnd }).filter((event) => {
    const end = event.endDate?.getTime();
    return (!Number.isFinite(versionEnd) || event.startDate.getTime() < versionEnd)
      && (!Number.isFinite(end) || !Number.isFinite(versionStart) || end > versionStart);
  });
}

export function buildSeamlessEvents(versions, options = {}) {
  const mergedByKey = new Map();
  (Array.isArray(versions) ? versions : []).forEach((version) => {
    buildEventsForVersion(version, options).forEach((event) => {
      const key = event.poolId ? `pool:${event.poolId}` : `event:${version.versionKey}:${event.id}`;
      const candidate = { ...event, versionKey: version.versionKey, lane: undefined };
      const existing = mergedByKey.get(key);
      if (!existing) return void mergedByKey.set(key, candidate);
      const primary = !String(candidate.id || "").startsWith("pool-") && String(existing.id || "").startsWith("pool-") ? candidate : existing;
      const secondary = primary === candidate ? existing : candidate;
      mergedByKey.set(key, { ...secondary, ...primary, image: primary.image || secondary.image || null, backgroundCharacter: primary.backgroundCharacter || secondary.backgroundCharacter || null, backgroundType: primary.backgroundType || secondary.backgroundType || null, lane: undefined });
    });
  });
  return normalizeEvents([...mergedByKey.values()], options);
}

export function statusOf(event, now = new Date()) {
  const current = now instanceof Date ? now : new Date(now);
  const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.start || event.startsAt);
  const endValue = event.endDate instanceof Date ? event.endDate : (event.end || event.endsAt ? new Date(event.end || event.endsAt) : null);
  if (event.startUnknown) return endValue && current >= endValue ? "ended" : "upcoming";
  if (event.milestone) return current < startDate ? "upcoming" : "ended";
  if (current < startDate) return "upcoming";
  if (endValue && current >= endValue) return "ended";
  return "live";
}

function absolutePublicUrl(value, baseUrl) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl || "https://ef-cal.mogujun.icu/").href;
  } catch {
    return null;
  }
}

export function serializePublicEvent(event, { now = new Date(), baseUrl } = {}) {
  const optional = (value) => value === undefined ? null : value;
  return {
    id: event.id,
    versionKey: event.versionKey || null,
    poolId: event.poolId || null,
    category: event.category,
    title: event.title,
    related: optional(event.related),
    start: event.start || event.startsAt || null,
    end: event.end || event.endsAt || null,
    status: statusOf(event, now),
    startUnknown: Boolean(event.startUnknown),
    startLabel: optional(event.startLabel),
    endLabel: optional(event.endLabel),
    permanent: Boolean(event.permanent),
    milestone: Boolean(event.milestone),
    eventType: optional(event.eventType),
    overlayFor: optional(event.overlayFor),
    visual: optional(event.visual),
    symbol: optional(event.symbol),
    image: absolutePublicUrl(event.image, baseUrl),
    backgroundCharacter: optional(event.backgroundCharacter),
    backgroundType: optional(event.backgroundType),
    color: event.color || null,
    eventInk: optional(event.eventInk),
    description: optional(event.description),
    sourceNote: optional(event.sourceNote),
  };
}

export function serializePublicVersion(version) {
  return {
    versionKey: version.versionKey,
    versionNumber: String(version.versionNumber || ""),
    title: version.title || "",
    startsAt: version.startsAt || null,
    endsAt: version.endsAt || null,
    revision: Number(version.revision) || 1,
    activitiesComplete: version.content?.activitiesComplete !== false,
    sourceMeta: version.sourceMeta && typeof version.sourceMeta === "object"
      ? {
        source: version.sourceMeta.source || null,
        author: version.sourceMeta.author || null,
        nameEn: version.sourceMeta.nameEn || null,
        timelineOrder: version.sourceMeta.timelineOrder ?? null,
        timelineUpdatedAt: version.sourceMeta.timelineUpdatedAt || null,
      }
      : {},
  };
}

export function filterEvents(events, filters = {}, { now = new Date() } = {}) {
  const from = filters.from ? Date.parse(filters.from) : null;
  const to = filters.to ? Date.parse(filters.to) : null;
  const categories = Array.isArray(filters.categories)
    ? new Set(filters.categories)
    : filters.category
      ? new Set([filters.category])
      : null;
  return (Array.isArray(events) ? events : []).filter((event) => {
    if (filters.version && event.versionKey !== filters.version) return false;
    if (categories?.size && !categories.has(event.category)) return false;
    if (filters.status && statusOf(event, now) !== filters.status) return false;
    const start = Date.parse(event.start || event.startsAt || "");
    const end = Date.parse(event.end || event.endsAt || "");
    if (Number.isFinite(from) && Number.isFinite(end) && end <= from) return false;
    if (Number.isFinite(from) && !Number.isFinite(end) && Number.isFinite(start) && start < from && event.milestone) return false;
    if (Number.isFinite(to) && Number.isFinite(start) && start >= to) return false;
    return true;
  });
}
