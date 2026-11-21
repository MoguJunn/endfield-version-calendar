export const VERSION_EIGHT_BRIEFING = "https://endfield.hypergryph.com/version_briefing/latest";
export const VERSION_EIGHT_DRAFT_NOTICE = "活动内容与持续时间正在施工中";

const VERSION_START = "2026-11-25T12:00:00+08:00";
const VERSION_END = "2027-01-07T06:00:00+08:00";
const versionPeriod = "导览标为「穿越甚大蘑境与你相逢」版本期间";
const beforeMaintenance = "导览标为版本更新维护前结束";

const events = [
  {
    id: "mushroom-array-construction", category: "permanent", title: "阵列建设：旧伤弥合",
    start: VERSION_START, end: VERSION_END, color: "#85512c", symbol: "建", visual: "construction",
    description: "修复北部禁区的分支裂隙带。常驻建设玩法包含限时建设任务，任务过期后仍可体验玩法。",
    timeNote: `${versionPeriod}，此处展示本版本的活动范围，具体限时任务日期待补充。`,
  },
  {
    id: "mushroom-marcher-gift", category: "limited", title: "行军者的报到",
    start: "2026-12-16T12:00:00+08:00", end: VERSION_END, color: "#875035", symbol: "赠", visual: "gift",
    description: "新版导览列出的馈赠活动，参与条件和领取规则待后续公告补充。",
    timeNote: `${beforeMaintenance}，截止按当前版本维护边界绘制。`,
  },
  {
    id: "mushroom-lucky-turnip", category: "limited", title: "“幸运萝卜”的妙趣游乐",
    start: "2026-12-16T12:00:00+08:00", end: VERSION_END, color: "#795099", symbol: "趣", visual: "festival",
    description: "「幸运萝卜」把塞什卡的巫术玩具、菈梵朵玛的奇妙竞技等内容带到妙趣游乐活动。",
    timeNote: `${beforeMaintenance}，截止按当前版本维护边界绘制。`,
  },
  {
    id: "mushroom-monument-atrocity", category: "limited", title: "丰碑揭示·暴虐",
    start: "2026-12-02T12:00:00+08:00", end: "2026-12-23T04:00:00+08:00", color: "#8c3b54", symbol: "碑", visual: "monument",
    description: "新版导览列出的挑战活动，挑战规则待后续公告补充。",
    timeNote: "起止时间均来自导览活动卡片。",
  },
  {
    id: "mushroom-fungi-intro", category: "limited", title: "蘑菇！蕈类！真菌！",
    start: VERSION_START, end: "2026-12-23T12:00:00+08:00", color: "#386f74", symbol: "菇", visual: "intro",
    description: "走进尘封已久的水坝，探索菌类主题的新区域引入活动。",
    timeNote: "导览标为版本更新后开启，起点按主站版本开服时间绘制。",
  },
  {
    id: "mushroom-competition", category: "limited", title: "方兴！竞技大会！",
    start: "2026-12-16T12:00:00+08:00", end: VERSION_END, color: "#9b4a36", symbol: "竞", visual: "arena",
    description: "武陵边缘的竞技挑战，活动含试用干员。",
    timeNote: `${beforeMaintenance}，截止按当前版本维护边界绘制。`,
  },
  {
    id: "mushroom-gift-sorting", category: "limited", title: "分拣吧！管礼员",
    start: "2026-12-23T12:00:00+08:00", end: VERSION_END, color: "#93602e", symbol: "礼", visual: "sorting",
    description: "将传送带上的礼盒分类，并送到对应的干员手中。",
    timeNote: `${beforeMaintenance}，截止按当前版本维护边界绘制。`,
  },
  {
    id: "mushroom-puzzle-special", category: "permanent", title: "密境行者特别篇",
    start: "2026-12-27T12:00:00+08:00", end: null, permanent: true, color: "#495e91", symbol: "谜", visual: "realm",
    description: "终末地工业重启对小型、多变协议空间的探索。",
    timeNote: "导览标为长期开放，时间轴的版本分割线仅限制绘制范围。",
  },
  {
    id: "mushroom-war-echo", category: "permanent", title: "战争回响常驻挑战玩法更新",
    start: VERSION_START, end: VERSION_END, color: "#813e54", symbol: "战", visual: "echo",
    description: "战争回响常驻挑战玩法在本版本更新。",
    timeNote: `${versionPeriod}，此处展示本版本的更新活动范围。`,
  },
].map(({ timeNote, ...event }) => ({
  ...event,
  image: `./assets/events/${event.id}.webp`,
  sourceNote: `${VERSION_EIGHT_DRAFT_NOTICE}。${timeNote} 来源：${VERSION_EIGHT_BRIEFING}`,
}));

export const versionEight = Object.freeze({
  versionKey: "version-8", versionNumber: "8", revision: 1, title: "穿越甚大蘑境与你相逢",
  startsAt: VERSION_START, endsAt: VERSION_END,
  content: { activitiesComplete: false, events }, pools: [], poolNames: {},
  sourceMeta: { source: VERSION_EIGHT_BRIEFING, author: "明日方舟：终末地官方（新版本导览）" },
});
