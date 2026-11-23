import {
  VERSION_EIGHT_ANNOUNCEMENT, VERSION_EIGHT_START as VERSION_START,
  VERSION_EIGHT_END as VERSION_END, VERSION_EIGHT_HEADHUNTING_END, versionEightPoolEvents,
} from "./version-eight-pools.js";
import { versionSevenEvents } from "./version-seven.js";

export const VERSION_EIGHT_COMMUNITY_CALENDAR = "https://i0.hdslb.com/bfs/new_dyn/27a652c4247b4bc6e62f53d8322358238412516.png";
const VERSION_EIGHT_CALENDAR = "https://www.bilibili.com/opus/1273842634518953988";
const announcement = `官方版本内容说明。 ${VERSION_EIGHT_ANNOUNCEMENT}`;
const beforeMaintenance = `官方公告为版本更新维护前结束，截止按本版维护边界绘制。 ${VERSION_EIGHT_ANNOUNCEMENT}`;
const monumentOpen = "2026-12-02T12:00:00+08:00";
const monumentUpdate = "2026-12-09T04:00:00+08:00";
const secondHalf = "2026-12-16T12:00:00+08:00";
const sanityDescription = "每日完成指定任务即可领取理智消耗许可和应急理智加强剂。";

const events = [
  {
    id: "mushroom-story", category: "permanent", title: "「蜜饼是我的祈愿」小刻叙事活动",
    start: VERSION_START, end: null, permanent: true, color: "#936022", symbol: "叙", visual: "story",
    description: "完成同名支线任务可获得嵌晶玉 ×600、初级认知载体等奖励。活动页面在本版本期间开放，页面下线后，符合任务条件仍可在任务列表体验并领取对应奖励。",
  },
  {
    id: "mushroom-old-dam", category: "permanent", title: "「武陵－旧水坝」新区域开放",
    start: VERSION_START, end: null, permanent: true, color: "#386f74", symbol: "坝", visual: "region",
    description: "随版本更新开放武陵的新区域旧水坝。",
  },
  {
    id: "mushroom-ceobe-signin", category: "limited", title: "「漫野探奇」限时签到",
    start: VERSION_START, end: VERSION_EIGHT_HEADHUNTING_END, color: "#507650", symbol: "签", visual: "ticket", trackType: "signin",
    description: "小刻特许寻访同期开放。累计签到可获得漫野探奇寻访凭证 ×5 等奖励。",
    sourceNote: `官方版本日历单列签到，开放期限见版本内容说明。 ${VERSION_EIGHT_CALENDAR} ${VERSION_EIGHT_ANNOUNCEMENT}`,
  },
  {
    id: "mushroom-ceobe-trial", category: "limited", title: "小刻作战演练",
    start: VERSION_START, end: VERSION_EIGHT_HEADHUNTING_END, color: "#806128", symbol: "练", visual: "training",
    description: "使用包含小刻的固定队伍完成试用，可领取嵌晶玉 ×100、武库防具箱及存续的痕迹。",
    sourceNote: `官方版本日历单列作战演练，开放期限见版本内容说明。 ${VERSION_EIGHT_CALENDAR} ${VERSION_EIGHT_ANNOUNCEMENT}`,
  },
  {
    id: "mushroom-rebuild", category: "permanent", title: "「重建禁区」常驻玩法",
    start: VERSION_START, end: null, permanent: true, color: "#386963", symbol: "建", visual: "construction",
    art: "array-construction",
    description: "在本版本推进任务可解锁重建禁区玩法及工业技术。限时建设活动结束后，仍可继续游玩并获得建设进度奖励。",
  },
  {
    id: "mushroom-array-construction", category: "limited", title: "「阵列建设：旧伤弥合」建设活动",
    start: VERSION_START, end: VERSION_END, color: "#85512c", symbol: "建", visual: "construction",
    description: "通过集成工业生产重建物资，推进建设并完成限时任务，可领取嵌晶玉 ×1000、高阶培养自选箱Ⅱ等奖励。建设任务及对应奖励随活动结束，重建禁区玩法继续开放。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-marcher-gift", category: "limited", title: "行军者的报到",
    start: secondHalf, end: VERSION_END, color: "#875035", symbol: "赠", visual: "gift",
    description: "活动期间登录游戏并参与各类玩法，可领取满潜能五星干员米米诺和满潜能五星武器明日之星（手铳）。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-lucky-turnip", category: "limited", title: "“幸运萝卜”的妙趣游乐",
    start: secondHalf, end: VERSION_END, color: "#795099", symbol: "趣", visual: "festival",
    description: "完成巫术乐园游乐挑战可获得萝卜大钞，可在纪念品兑换处兑换嵌晶玉 ×1000、高阶培养自选箱Ⅰ等奖励。12 月 23 日 04:00 更新活动内容。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-monument-atrocity", category: "limited", title: "「丰碑揭示·暴虐」限时挑战",
    start: monumentOpen, end: "2026-12-23T04:00:00+08:00", color: "#8c3b54", symbol: "碑", visual: "monument",
    description: "完成影拓丰碑中的对应挑战可领取嵌晶玉 ×1200、高阶培养自选箱Ⅲ等奖励。12 月 9 日 04:00 更新活动内容。",
  },
  {
    id: "mushroom-monument-series", category: "permanent", title: "「影拓丰碑」新系列「暴君武装」",
    start: monumentOpen, end: null, permanent: true, color: "#8c3b54", symbol: "碑", visual: "monument",
    art: "monument-atrocity",
    description: "新特殊系列首日率先开放一个关卡，12 月 9 日 04:00 开放第二个关卡。常驻系列的开放时间与丰碑揭示限时奖励分别计算。",
  },
  {
    id: "mushroom-fungi-intro", category: "limited", title: "蘑菇！蕈类！真菌！",
    start: VERSION_START, end: "2026-12-23T12:00:00+08:00", color: "#386f74", symbol: "菇", visual: "intro",
    description: "在武陵旧水坝完成指定任务，可领取嵌晶玉 ×1200、存续的痕迹。",
  },
  {
    id: "mushroom-competition", category: "limited", title: "方兴！竞技大会！",
    start: secondHalf, end: VERSION_END, color: "#9b4a36", symbol: "竞", visual: "arena",
    description: "完成挑战可领取嵌晶玉 ×1200、头像框·摘冠者的耀星、高阶培养自选箱等奖励。12 月 18 日 04:00 更新活动内容。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-gift-sorting", category: "limited", title: "「分拣吧！管礼员」网页活动",
    start: "2026-12-23T12:00:00+08:00", end: VERSION_END, color: "#93602e", symbol: "礼", visual: "sorting",
    description: "前往网页分拣传送带上的礼盒，体验不同关卡可领取嵌晶玉 ×300、折金票。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-puzzle-special", category: "permanent", title: "「密境行者」特别篇「菌类秘事」",
    start: "2026-12-27T12:00:00+08:00", end: null, permanent: true, color: "#495e91", symbol: "谜", visual: "realm",
    description: "新空间组开放三个协议空间。完成空间组挑战可累计领取嵌晶玉 ×600、存续的痕迹等奖励。",
  },
  {
    id: "mushroom-war-echo", category: "permanent", title: "「战争回响」游离赛季",
    start: VERSION_START, end: "2026-12-16T11:59:00+08:00", color: "#813e54", symbol: "战", visual: "echo",
    description: "游离赛季分为三个轮换周期，每期三个关卡。完成所有新增关卡的普通难度可领取嵌晶玉 ×300 等奖励。",
  },
  {
    id: "mushroom-war-echo-alert", category: "permanent", title: "「战争回响」警觉赛季",
    start: secondHalf, end: VERSION_END, color: "#a13643", symbol: "战", visual: "echo",
    art: "war-echo",
    description: "警觉赛季分为三个轮换周期，每期三个关卡。完成所有新增关卡的普通难度可领取嵌晶玉 ×300 等奖励。",
    sourceNote: beforeMaintenance,
  },
  {
    id: "mushroom-sanity-first", category: "limited", title: "「理智补给」第一期",
    start: "2026-12-09T04:00:00+08:00", end: "2026-12-16T04:00:00+08:00", color: "#777571", symbol: "智", visual: "supply",
    art: "sanity", description: sanityDescription,
  },
  {
    id: "mushroom-sanity-second", category: "limited", title: "「理智补给」第二期",
    start: "2026-12-31T04:00:00+08:00", end: "2027-01-07T04:00:00+08:00", color: "#777571", symbol: "智", visual: "supply",
    art: "sanity", description: sanityDescription,
  },
  {
    id: "mushroom-next-version-warmup", category: "limited", title: "下一版本预热签到活动",
    start: "2027-01-04T04:00:00+08:00", startUnknown: true, startLabel: "待官方公布", end: VERSION_END,
    color: "#555b57", symbol: "签", visual: "ticket", trackType: "signin", art: null,
    description: "社区日历列出下版预热签到，名称、开始时间和奖励待官方公布。",
    sourceNote: `社区图将开始时间标为 ??，条目位置只用于标示版末。 ${VERSION_EIGHT_COMMUNITY_CALENDAR}`,
  },
];

const updates = [
  { overlayFor: "mushroom-monument-series", title: "「暴君武装」关卡更新", start: monumentUpdate, description: "开放第二个暴君武装关卡。" },
  { overlayFor: "mushroom-monument-atrocity", title: "「丰碑揭示·暴虐」内容更新", start: monumentUpdate, description: "常驻关卡开放时同步更新限时挑战内容。" },
  { overlayFor: "mushroom-competition", title: "「方兴！竞技大会！」内容更新", start: "2026-12-18T04:00:00+08:00", description: "竞技大会更新活动内容。" },
  { overlayFor: "mushroom-lucky-turnip", title: "“幸运萝卜”的妙趣游乐内容更新", start: "2026-12-23T04:00:00+08:00", description: "妙趣游乐更新活动内容。" },
].map(({ overlayFor, ...update }) => {
  const parent = events.find((event) => event.id === overlayFor);
  return {
    ...update, overlayFor, id: `${overlayFor}-update`, category: "update", eventType: "content-update",
    milestone: true, end: null, color: parent.color, symbol: "更", visual: parent.visual, art: parent.art ?? parent.id.slice("mushroom-".length),
  };
});

const versionEightEvents = [...events, ...updates].map(({ art, ...event }) => ({
  sourceNote: announcement,
  ...event,
  ...(art === null ? {} : { image: `./assets/events/${art ? `mushroom-${art}` : event.id}.webp` }),
}));
const crossVersionPools = versionSevenEvents.filter((event) => ["danqing-jade-issue", "danqing-moon-issue"].includes(event.id));

export const versionEight = Object.freeze({
  versionKey: "version-8", versionNumber: "8", revision: 3, title: "穿越甚大蘑境与你相逢",
  startsAt: VERSION_START, endsAt: VERSION_END,
  content: { activitiesComplete: true, events: [...versionEightPoolEvents, ...crossVersionPools, ...versionEightEvents] }, pools: [], poolNames: {},
  sourceMeta: { source: VERSION_EIGHT_CALENDAR, author: "明日方舟：终末地官方（11 月 23 日版本日历）" },
});
