export const VERSION_EIGHT_ANNOUNCEMENT = "https://www.bilibili.com/opus/1273471549311025159";
export const VERSION_EIGHT_START = "2026-11-25T12:00:00+08:00";
export const VERSION_EIGHT_END = "2027-01-07T06:00:00+08:00";

const firstReconstructionEnd = "2026-12-16T11:59:00+08:00";
const secondReconstructionStart = "2026-12-16T12:00:00+08:00";
export const VERSION_EIGHT_HEADHUNTING_END = "2026-12-23T11:59:00+08:00";
const standardOperators = ["余烬", "黎风", "艾尔黛拉", "别礼", "骏卫"];

const pools = [
  {
    id: "ceobe", poolId: "special_manual_limited_pool_1ullxy_20261125_8v04q", name: "锻砧、行囊与蜜糖",
    category: "operator", start: VERSION_EIGHT_START, end: VERSION_EIGHT_HEADHUNTING_END, color: "#936022",
    up: "小刻", otherSixStars: ["明河", "祀", ...standardOperators],
    related: "「漫野探奇」签到与小刻作战演练",
    details: "同期开放「漫野探奇」签到和小刻作战演练。签到累计可获得漫野探奇寻访凭证 ×5，集成配额交易另可特惠兑换至多 ×5。完成试用可获得嵌晶玉 ×100、武库防具箱及存续的痕迹等奖励。",
    previousName: "铁砧、行囊与蜜糖",
  },
  {
    id: "gilberta", poolId: "joint_manual_extra_pool_jjsz51_20261125_1alhij", name: "致每一个飘游之愿",
    category: "operator", start: VERSION_EIGHT_START, end: firstReconstructionEnd, color: "#75604d",
    reconstruction: true, up: "洁尔佩塔", otherSixStars: standardOperators,
  },
  {
    id: "rossi", poolId: "joint_manual_extra_pool_104dzt_20261216_re1zei", name: "绯红瑰宝",
    category: "operator", start: secondReconstructionStart, end: VERSION_EIGHT_END, color: "#a13643",
    reconstruction: true, up: "洛茜", otherSixStars: standardOperators,
  },
  {
    id: "sweet-deal", poolId: "weaponbox_manual_weapon_pool_pgz05i_20261125_2a2lg4", name: "恣游申领",
    category: "arsenal", start: VERSION_EIGHT_START, end: null, color: "#996224",
    up: "甜美交易（长柄武器）", otherSixStars: ["扶摇", "骁勇", "J.E.T.", "爆破单元", "楔子", "昔日精品"],
    endLabel: "「锻砧、行囊与蜜糖」之后第 2 个特许寻访结束时",
    previousName: "甜美交易",
  },
  {
    id: "delivery", poolId: "joint_manual_extra_pool_i71msu_20261125_1i003o", name: "飘行申领",
    category: "arsenal", start: VERSION_EIGHT_START, end: firstReconstructionEnd, color: "#75604d",
    reconstruction: true, up: "使命必达（施术单元）", otherSixStars: ["骑士精神", "遗忘", "楔子", "热熔切割器", "白夜新星", "典范"],
  },
  {
    id: "scarlet", poolId: "joint_manual_extra_pool_1g3vrj_20261216_1gs6xr", name: "赤獠申领",
    category: "arsenal", start: secondReconstructionStart, end: VERSION_EIGHT_END, color: "#a13643",
    reconstruction: true, up: "狼之绯（单手剑）", otherSixStars: ["扶摇", "显赫声名", "楔子", "昔日精品", "爆破单元", "骁勇"],
  },
];

export const versionEightPoolEvents = pools.map((pool) => {
  const { id, poolId, name, category, start, end, endLabel, color, reconstruction, up, otherSixStars, related, details } = pool;
  const operator = category === "operator";
  const suffix = reconstruction ? `重构${operator ? "寻访" : "申领"} · 第1期` : operator ? "特许寻访" : "";
  return {
    id: `mushroom-pool-${id}`, poolId, category, title: `「${name}」${suffix}`, start, end, endLabel, color,
    poolKind: reconstruction ? "reconstruction" : "standard", extraSeriesPhase: reconstruction ? 1 : null,
    symbol: operator ? "访" : "武", visual: reconstruction ? "reconstruction" : category, related,
    image: `./assets/events/mushroom-pool-${id}.webp`,
    description: [`六星概率提升为${up}。其余可出现的六星为${otherSixStars.join("、")}。`, details].filter(Boolean).join(""),
    sourceNote: `官方版本内容说明第 1 张。${endLabel ? `结束时间为${endLabel}。` : ""} ${VERSION_EIGHT_ANNOUNCEMENT}`,
  };
});

const byName = new Map(pools.map((pool, index) => [pool.name, versionEightPoolEvents[index]]));
const aliases = new Map(pools.filter((pool) => pool.previousName).map((pool) => [pool.poolId, pool]));
const crossVersionArsenals = {
  "篆玉申领": {
    start: "2026-10-15T12:00:00+08:00",
    source: "https://endfield.hypergryph.com/news/7212",
    description: "六星概率提升为玉中身（双手剑）。其余可出现的六星为昔日精品、楔子、J.E.T.、骑士精神、破碎君王、显赫声名。",
    endRule: "从「万物更新」起计三次特许寻访，至「锻砧、行囊与蜜糖」结束。",
  },
  "月映申领": {
    start: "2026-11-05T12:00:00+08:00",
    source: "https://endfield.hypergryph.com/news/5971",
    description: "六星概率提升为唤月（单手剑）。其余可出现的六星为热熔切割器、白夜新星、骁勇、遗忘、同类相食、典范。",
    endRule: "从「烟火邀星河」起计三次特许寻访，至「锻砧、行囊与蜜糖」之后第 1 个特许寻访结束。日历的暂定结束时间来自主站目录。",
  },
};

export function announcedPoolName(poolId, name) {
  const pool = aliases.get(poolId);
  return pool && pool.previousName === name ? pool.name : name;
}

export function applyVersionEightPoolAnnouncement(event, start, end) {
  const name = event.title?.match(/^「([^」]+)」/u)?.[1];
  const announcement = byName.get(name);
  if (announcement && announcement.category === event.category && Date.parse(start) === Date.parse(announcement.start)
      && (event.poolKind || "standard") === announcement.poolKind) {
    // 公告将前后半程的两组重构池均标为 #1。
    const { title, extraSeriesPhase, image, description, related, endLabel, sourceNote } = announcement;
    return { title, extraSeriesPhase, image, description, related, sourceNote, endLabel: end ? null : endLabel ?? event.endLabel };
  }

  const crossVersion = event.category === "arsenal" ? crossVersionArsenals[name] : null;
  if (!crossVersion || Date.parse(start) !== Date.parse(crossVersion.start)) return null;
  // 旧目录的 12 月 17 日截止早于公告指定的第 3 次特许寻访结束时间。
  const obsoleteJadeEnd = name === "篆玉申领" && Date.parse(end) === Date.parse("2026-12-17T12:00:00+08:00");
  return {
    ...(obsoleteJadeEnd ? { end: VERSION_EIGHT_HEADHUNTING_END } : {}),
    description: crossVersion.description,
    sourceNote: `${crossVersion.endRule} ${crossVersion.source}`,
  };
}
