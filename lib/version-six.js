// 时间按用户提供的官方版本日历与 2026-08-29 社区时间轴整理，均为北京时间。
const VERSION_END = "2026-10-15T06:00:00+08:00";
const supplyImage = "./assets/events/Version%205/理智补给通用图.png";
const echoImage = "./assets/events/Version%205/战争回想（两赛季相同）.png";
const monumentImage = "./assets/events/Version%205/影拓丰碑+丰碑留名.png";

export const versionSixEvents = Object.freeze([
  {
    id: "winter-hunt", poolId: "special_1_5_1", category: "operator",
    title: "「冬猎」特许寻访", start: "2026-09-02T12:00:00+08:00", end: "2026-09-30T11:59:00+08:00",
    color: "#6851b8", symbol: "猎", visual: "operator", related: "「砥砺振羽」签到 & 作战演练",
    description: "提弗洛斯特许寻访。同期开放「砥砺振羽」签到与干员试用。",
  },
  {
    id: "reconstruction-xuesong-youmeng-character-p1", poolId: "joint_manual_extra_reconstruction_yvonne_p1",
    category: "operator", title: "「绚丽异彩」重构寻访", poolKind: "reconstruction",
    start: "2026-09-24T12:00:00+08:00", end: VERSION_END, color: "#cc527f", symbol: "绚", visual: "reconstruction",
    description: "重构寻访第一期，UP 干员为伊冯。与本期特许寻访独立展示。",
  },
  {
    id: "deep-cold-issue", poolId: "weponbox_1_5_1", category: "arsenal", title: "「幽寒申领」",
    start: "2026-09-02T12:00:00+08:00", end: null, endLabel: "「冬猎」后第2个特许寻访结束时",
    color: "#5550a1", symbol: "寒", visual: "arsenal",
    description: "UP 武器为寒夜幽影，按后续特许寻访轮换规则结束。",
  },
  {
    id: "reconstruction-xuesong-youmeng-weapon-p1", poolId: "joint_manual_extra_reconstruction_arttyrant_p1",
    category: "arsenal", title: "「点绘申领」重构申领", poolKind: "reconstruction",
    start: "2026-09-24T12:00:00+08:00", end: VERSION_END, color: "#bd5c88", symbol: "绘", visual: "reconstruction",
    description: "重构申领第一期，UP 武器为艺术暴君。",
  },
  {
    id: "winter-forest-story", category: "permanent", title: "「雾隐冬梦深林中」提弗洛斯叙事活动",
    start: "2026-09-02T12:00:00+08:00", end: null, permanent: true,
    color: "#6351a9", symbol: "叙", visual: "story", description: "提弗洛斯叙事活动，开启后常驻开放。",
  },
  {
    id: "tephros-shooting-range", category: "permanent", title: "「提弗洛斯的靶场」",
    start: "2026-09-09T12:00:00+08:00", end: null, permanent: true,
    color: "#858b22", symbol: "靶", visual: "training", description: "「提弗洛斯的靶场」于 9 月 9 日 12:00 起常驻开放。",
  },
  {
    id: "bow-trial", category: "permanent", title: "「挽弓试炼」挑战活动",
    start: "2026-09-09T12:00:00+08:00", end: VERSION_END,
    color: "#7e8826", symbol: "弓", visual: "training", description: "挑战活动于 9 月 9 日 12:00 开启，10 月 15 日 06:00 结束。",
  },
  {
    id: "war-echo-virtual", category: "permanent", title: "「战争回响」新赛季「虚像赛季」",
    start: "2026-09-02T12:00:00+08:00", end: "2026-09-24T11:59:00+08:00",
    color: "#bd3e33", symbol: "战", visual: "echo", image: echoImage, description: "本版本首期战争回响赛季。",
  },
  {
    id: "war-echo-illusion", category: "permanent", title: "「战争回响」新赛季「错视赛季」",
    start: "2026-09-24T12:00:00+08:00", end: VERSION_END,
    color: "#a94338", symbol: "战", visual: "echo", image: echoImage, description: "9 月 24 日轮换至错视赛季。",
  },
  {
    id: "monument-winter", category: "permanent", title: "「影拓丰碑」新系列「幽影刻形」",
    start: "2026-10-05T12:00:00+08:00", end: null, permanent: true,
    color: "#793d47", symbol: "碑", visual: "monument", image: monumentImage,
    description: "「幽影刻形」系列于 10 月 5 日 12:00 起常驻开放；同期开放「丰碑留名 · 刻影」限期奖励。",
  },
  {
    id: "monument-engraving", category: "permanent", title: "「丰碑留名 · 刻影」",
    start: "2026-10-05T12:00:00+08:00", end: "2026-10-19T04:00:00+08:00",
    color: "#8f3d48", symbol: "刻", visual: "monument", image: monumentImage,
    description: "限期奖励开放至 10 月 19 日 04:00，跨版本部分继续展示。",
  },
  {
    id: "snowfall-forest", category: "limited", title: "「雪降深林」引入活动",
    start: "2026-09-02T12:00:00+08:00", end: "2026-09-30T12:00:00+08:00",
    color: "#405785", symbol: "雪", visual: "snow",
    description: "随版本首日开放的引入活动。",
  },
  {
    id: "old-city-bells", category: "limited", title: "「于钟鸣的旧城」引入活动",
    start: "2026-09-24T12:00:00+08:00", end: VERSION_END,
    color: "#397f85", symbol: "钟", visual: "city",
    description: "9 月 24 日开启的引入活动。",
  },
  {
    id: "bubble-support", category: "limited", title: "「集成援助 · 泡泡出击」集成生产活动",
    start: "2026-09-16T12:00:00+08:00", end: "2026-09-30T16:00:00+08:00",
    color: "#327767", symbol: "泡", visual: "production", related: "物资兑换处",
    description: "集成生产活动，具体物资兑换时间请以游戏内说明为准。",
  },
  {
    id: "great-feline", category: "limited", title: "「我们的大菲林！来袭！」馈赠活动",
    start: "2026-09-24T12:00:00+08:00", end: VERSION_END,
    color: "#b9474e", symbol: "菲", visual: "gift", description: "版本后半程开放的馈赠活动。",
  },
  {
    id: "autumn-signin", category: "limited", title: "「陵水渡秋」限时签到",
    start: "2026-10-01T12:00:00+08:00", end: VERSION_END,
    color: "#54845d", symbol: "签", visual: "ticket", trackType: "signin", description: "10 月 1 日开启的限时签到活动。",
  },
  {
    id: "runners-meet", category: "limited", title: "「跑者运动会」趣味活动",
    start: "2026-10-01T12:00:00+08:00", end: VERSION_END,
    color: "#978522", symbol: "跑", visual: "sports", description: "10 月 1 日开启的趣味活动。",
  },
  {
    id: "mountain-fusion", category: "limited", title: "「融合！山团团！」趣味活动",
    start: "2026-10-01T12:00:00+08:00", end: VERSION_END,
    color: "#92732c", symbol: "团", visual: "fusion", description: "10 月 1 日开启的趣味活动。",
  },
  {
    id: "sanity-supply-winter-first", category: "limited", title: "「理智补给」第一期",
    start: "2026-09-17T04:00:00+08:00", end: "2026-09-24T04:00:00+08:00",
    color: "#777571", symbol: "智", visual: "supply", image: supplyImage, description: "每日完成指定任务领取理智补给奖励。",
  },
  {
    id: "sanity-supply-winter-final", category: "limited", title: "「理智补给」第二期",
    start: "2026-10-08T04:00:00+08:00", end: "2026-10-15T04:00:00+08:00",
    color: "#777571", symbol: "智", visual: "supply", image: supplyImage, description: "版本末期开放的第二期理智补给。",
  },
  {
    id: "winter-next-version-warmup", category: "limited", title: "新版本预热签到活动",
    start: "2026-10-12T04:00:00+08:00", startUnknown: true, startLabel: "待官方公布",
    end: VERSION_END, color: "#555b57", symbol: "签", visual: "ticket", trackType: "signin",
    sourceNote: "开始时间尚未公布，时间轴位置仅示意处于版本末期，不作为实际开放时间。",
    description: "开始时间待公布，已知于 10 月 15 日 06:00 结束。",
  },
]);

export const versionSix = Object.freeze({
  versionKey: "version-6", versionNumber: "6", revision: 1, title: "雪凇幽梦",
  startsAt: "2026-09-02T12:00:00+08:00", endsAt: VERSION_END,
  content: { activitiesComplete: true, events: versionSixEvents }, pools: [], poolNames: {},
  sourceMeta: { source: "用户提供的官方版本日历及社区时间轴（2026-08-29）", author: "明日方舟：终末地官方 / 罗德岛蜜饼工坊" },
});
