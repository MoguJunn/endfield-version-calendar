// 用户提供的罗德岛蜜饼工坊「丹青渡」版本内容时间轴 Ver. 26.10.11b；均为北京时间。
export const DANQING_CALENDAR_SOURCE = "https://www.bilibili.com/opus/1257920720462151697";
const VERSION_END = "2026-11-26T06:00:00+08:00";
const echoImage = "./assets/events/Version%205/战争回想（两赛季相同）.png";
const monumentImage = "./assets/events/Version%205/影拓丰碑+丰碑留名.png";
const realmImage = "./assets/events/Version%205/密境行者.png";
const supplyImage = "./assets/events/Version%205/理智补给通用图.png";

export const versionSevenEvents = Object.freeze([
  {
    id: "danqing-rejuvenation", poolId: "special_manual_limited_pool_1isltn_20261015_5a5p7z", category: "operator",
    title: "「万物更新」特许寻访", related: "「万物有灵」签到 & 作战演练",
    start: "2026-10-15T12:00:00+08:00", end: "2026-11-05T11:59:00+08:00", color: "#65b95c", symbol: "祀", visual: "operator",
    description: "版本首期特许寻访，同期开放「万物有灵」签到与作战演练。",
  },
  {
    id: "danqing-fireworks", poolId: "special_manual_limited_pool_us8t52_20261105_14pdl0", category: "operator",
    title: "「烟火邀星河」特许寻访", related: "「星河共我」签到 & 作战演练",
    start: "2026-11-05T12:00:00+08:00", end: VERSION_END, color: "#b49b37", symbol: "明", visual: "operator",
    description: "版本第二期特许寻访，同期开放「星河共我」签到与作战演练。",
    sourceNote: "图片标注结束于 11 月 26 日 06:00；联网时卡池时间以主站公开数据库为准。",
  },
  {
    id: "danqing-reconstruction-character-p1", poolId: "joint_manual_extra_pool_cf4379_20261029_ceid6k", category: "operator",
    title: "「祖泉的新流」重构寻访 · 第1期", poolKind: "reconstruction", extraSeriesPhase: 1,
    start: "2026-10-29T12:00:00+08:00", end: "2026-11-19T11:59:00+08:00", color: "#276c9d", symbol: "泉", visual: "reconstruction",
    description: "「丹青渡」版本第一期重构寻访。",
    sourceNote: "图片标注结束于 11 月 19 日 11:59；联网时卡池时间以主站公开数据库为准。",
  },
  {
    id: "danqing-jade-issue", poolId: "weaponbox_manual_weapon_pool_18urx1_20261015_u2xtx2", category: "arsenal",
    title: "「篆玉申领」", start: "2026-10-15T12:00:00+08:00", end: null,
    endLabel: "「烟火邀星河」后第1个特许寻访结束时", color: "#73c967", symbol: "玉", visual: "arsenal",
    description: "按后续特许寻访轮换规则结束；联网时使用主站数据库的截止时间。",
  },
  {
    id: "danqing-moon-issue", poolId: "weaponbox_manual_weapon_pool_1bv5uc_20261105_1nb5dl", category: "arsenal",
    title: "「月映申领」", start: "2026-11-05T12:00:00+08:00", end: null,
    endLabel: "「烟火邀星河」后第2个特许寻访结束时", color: "#b99536", symbol: "月", visual: "arsenal",
    description: "跨版本武库申领，按后续特许寻访轮换规则结束。",
  },
  {
    id: "danqing-reconstruction-weapon-p1", poolId: "joint_manual_extra_pool_5ubt2r_undated_19o5dh", category: "arsenal",
    title: "「细枝申领」重构申领 · 第1期", poolKind: "reconstruction", extraSeriesPhase: 1,
    start: "2026-10-29T12:00:00+08:00", end: "2026-11-19T11:59:00+08:00", color: "#237da9", symbol: "枝", visual: "reconstruction",
    description: "「丹青渡」版本第一期重构申领。",
    sourceNote: "图片标注结束于 11 月 19 日 11:59；联网时卡池时间以主站公开数据库为准。",
  },
  {
    id: "danqing-homecoming-story", category: "permanent", title: "「归野」明叙事活动",
    start: "2026-11-05T12:00:00+08:00", end: null, permanent: true, color: "#b29d36", symbol: "叙", visual: "story",
    description: "明叙事活动，11 月 5 日 12:00 起常驻开放。",
  },
  {
    id: "war-echo-reverie", category: "permanent", title: "「战争回响」新赛季「异想赛季」",
    start: "2026-10-15T12:00:00+08:00", end: "2026-11-05T11:59:00+08:00", color: "#bf302d", symbol: "战", visual: "echo", image: echoImage,
    description: "本版本首期战争回响赛季。",
  },
  {
    id: "war-echo-fervor", category: "permanent", title: "「战争回响」新赛季「狂热赛季」",
    start: "2026-11-05T12:00:00+08:00", end: VERSION_END, color: "#ad302c", symbol: "战", visual: "echo", image: echoImage,
    description: "11 月 5 日 12:00 轮换至狂热赛季，版本更新维护前结束。",
  },
  {
    id: "danqing-inn", category: "permanent", title: "「缘缘庄客栈」",
    start: "2026-10-15T12:00:00+08:00", end: null, permanent: true, color: "#a83527", symbol: "栈", visual: "inn",
    description: "10 月 15 日 12:00 起常驻开放，10 月 22 日 04:00 更新活动内容。",
  },
  {
    id: "danqing-inn-update", category: "update", eventType: "content-update", overlayFor: "danqing-inn", title: "「缘缘庄客栈」内容更新",
    start: "2026-10-22T04:00:00+08:00", end: null, milestone: true, color: "#a83527", symbol: "更", visual: "inn",
    description: "客栈活动内容的单次更新节点。",
  },
  {
    id: "danqing-firework-bonds", category: "permanent", title: "「烟火生缘」趣味活动",
    start: "2026-10-15T12:00:00+08:00", end: VERSION_END, color: "#ad342d", symbol: "缘", visual: "festival",
    description: "随版本首日开启，11 月 26 日 06:00 结束。",
  },
  {
    id: "monument-forest-whispers", category: "permanent", title: "「影拓丰碑」新系列「深林低语」",
    start: "2026-10-22T12:00:00+08:00", end: null, permanent: true, color: "#8c302b", symbol: "碑", visual: "monument", image: monumentImage,
    description: "新系列于 10 月 22 日 12:00 起常驻开放，同期开放限期奖励。",
  },
  {
    id: "monument-demonic-forest", category: "permanent", title: "「丰碑留名 · 魔林」",
    start: "2026-10-22T12:00:00+08:00", end: "2026-11-05T04:00:00+08:00", color: "#81342c", symbol: "林", visual: "monument", image: monumentImage,
    description: "限期奖励开放至 11 月 5 日 04:00。",
  },
  {
    id: "secret-realm-painting", category: "permanent", title: "「密境行者」新空间组「画外遗光」",
    start: "2026-11-12T12:00:00+08:00", end: null, permanent: true, color: "#536495", symbol: "境", visual: "realm", image: realmImage,
    description: "新空间组于 11 月 12 日 12:00 起常驻开放，11 月 19 日 04:00 更新内容。",
  },
  {
    id: "secret-realm-painting-update", category: "update", eventType: "content-update", overlayFor: "secret-realm-painting", title: "「密境行者 · 画外遗光」内容更新",
    start: "2026-11-19T04:00:00+08:00", end: null, milestone: true, color: "#536495", symbol: "更", visual: "realm", image: realmImage,
    description: "新空间组内容的单次更新节点。",
  },
  {
    id: "danqing-ink-colors", category: "limited", title: "「墨分诸彩」引入活动",
    start: "2026-10-15T12:00:00+08:00", end: "2026-11-05T12:00:00+08:00", color: "#3f706a", symbol: "墨", visual: "ink",
    description: "版本首日开放的引入活动。",
  },
  {
    id: "danqing-carly-fairytale", category: "limited", title: "「卡莉的芳菲童话」拍照活动",
    start: "2026-10-22T12:00:00+08:00", end: "2026-11-05T04:00:00+08:00", color: "#ad7966", symbol: "照", visual: "photo",
    description: "10 月 22 日开启的限时拍照活动。",
  },
  {
    id: "danqing-crisis-contract", category: "limited", title: "「危机合约」浸蓝测试作战",
    start: "2026-11-05T12:00:00+08:00", end: VERSION_END, color: "#3528b4", symbol: "约", visual: "contract",
    description: "浸蓝测试作战于 11 月 5 日开启，11 月 12 日 12:00 更新活动内容。",
  },
  {
    id: "danqing-crisis-update", category: "update", eventType: "content-update", overlayFor: "danqing-crisis-contract", title: "「危机合约」内容更新",
    start: "2026-11-12T12:00:00+08:00", end: null, milestone: true, color: "#3528b4", symbol: "更", visual: "contract",
    description: "浸蓝测试作战的单次内容更新节点。",
  },
  {
    id: "danqing-hundred-boats", category: "limited", title: "「百舸演武」挑战活动",
    start: "2026-10-29T12:00:00+08:00", end: "2026-11-19T04:00:00+08:00", color: "#c4473f", symbol: "武", visual: "arena",
    description: "10 月 29 日开启的挑战活动，11 月 19 日 04:00 结束。",
  },
  {
    id: "danqing-new-soul-film", category: "limited", title: "「予众魂的新光影」趣味活动",
    start: "2026-10-31T12:00:00+08:00", end: "2026-11-14T04:00:00+08:00", color: "#446a50", symbol: "影", visual: "film",
    description: "10 月 31 日开启的趣味活动。",
  },
  {
    id: "danqing-crisis-preparation", category: "limited", title: "「危机筹备」",
    start: "2026-10-29T04:00:00+08:00", end: "2026-11-05T04:00:00+08:00", color: "#3a2fc2", symbol: "备", visual: "contract",
    description: "危机合约开启前的限时筹备活动。",
  },
  {
    id: "sanity-supply-danqing", category: "limited", title: "「理智补给」",
    start: "2026-11-19T04:00:00+08:00", end: "2026-11-26T04:00:00+08:00", color: "#777571", symbol: "智", visual: "supply", image: supplyImage,
    description: "版本末期理智补给，11 月 26 日 04:00 结束。",
  },
  {
    id: "danqing-next-version-warmup", category: "limited", title: "新版本预热签到活动",
    start: "2026-11-23T04:00:00+08:00", startUnknown: true, startLabel: "待官方公布", end: VERSION_END,
    color: "#555b57", symbol: "签", visual: "ticket", trackType: "signin",
    description: "开始时间尚未公布，已知于 11 月 26 日 06:00 结束。",
    sourceNote: "图片开始日期标为 ??；时间轴位置仅示意处于版本末期，不作为实际开放时间。",
  },
]);

export const versionSeven = Object.freeze({
  versionKey: "version-7", versionNumber: "7", revision: 1, title: "丹青渡",
  startsAt: "2026-10-15T12:00:00+08:00", endsAt: VERSION_END,
  content: { activitiesComplete: true, events: versionSevenEvents }, pools: [], poolNames: {},
  sourceMeta: { source: DANQING_CALENDAR_SOURCE, author: "罗德岛蜜饼工坊（版本内容时间轴 Ver. 26.10.11b）" },
});
