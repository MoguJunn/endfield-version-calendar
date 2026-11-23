const opening = "01-22 11:00";
const tideOpening = "03-12 12:00";
const springOpening = "04-17 12:00";
const heirloomOpening = "06-05 12:00";
const openingMaintenance = "03-12 06:00";
const tideMaintenance = "04-17 06:00";
const springMaintenance = "06-05 06:00";
const heirloomMaintenance = "07-16 06:00";

const openingDetails = "https://www.bilibili.com/opus/1159177315647750144";
const openingChanges = "https://www.facebook.com/ArknightsEndfieldZHT/posts/906423085477501/";
const tideDetails = "https://endfield.hypergryph.com/news/6003";
const springDetails = "https://endfield.hypergryph.com/news/9343";
const heirloomDetails = "https://endfield.hypergryph.com/news/0439";

const eventStyles = {
  signin: { color: "#507650", symbol: "签", visual: "ticket", trackType: "signin" },
  training: { color: "#806128", symbol: "练", visual: "training" },
  gift: { color: "#8c5336", symbol: "赠", visual: "gift" },
  story: { color: "#875366", symbol: "叙", visual: "story" },
  region: { color: "#3d736e", symbol: "域", visual: "region" },
  intro: { color: "#497377", symbol: "引", visual: "intro" },
  photo: { color: "#8c6250", symbol: "照", visual: "photo" },
  supply: { color: "#73716a", symbol: "智", visual: "supply" },
  realm: { color: "#53628e", symbol: "境", visual: "realm" },
  monument: { color: "#873b48", symbol: "碑", visual: "monument" },
  festival: { color: "#79518e", symbol: "乐", visual: "festival" },
  production: { color: "#397760", symbol: "产", visual: "production" },
  contract: { color: "#554a97", symbol: "约", visual: "contract" },
  arena: { color: "#974734", symbol: "武", visual: "arena" },
};

const beijing = (date) => `2026-${date.replace(" ", "T")}:00+08:00`;

function activity(id, title, type, start, end, description, extra = {}) {
  return {
    ...eventStyles[type], id, title, description,
    category: end ? "limited" : "permanent", start: beijing(start), end: end ? beijing(end) : null,
    ...(end ? {} : { permanent: true }), ...extra,
  };
}

function update(parent, { id, title, at, description, sourceNote }) {
  return {
    id, title, description, sourceNote, start: beijing(at), end: null,
    category: "update", eventType: "content-update", overlayFor: parent.id, milestone: true,
    color: parent.color, symbol: "更", visual: parent.visual,
  };
}

function earlyVersion(number, title, start, end, calendar, details, events) {
  const source = `https://www.bilibili.com/opus/${calendar}`;
  return {
    versionKey: `version-${number}`, versionNumber: String(number), revision: 2, title,
    startsAt: beijing(start), endsAt: beijing(end), pools: [], poolNames: {},
    content: { activitiesComplete: true, events: events.map((event) => ({ sourceNote: details, ...event })) },
    sourceMeta: { source, author: "明日方舟：终末地官方（版本日历）" },
  };
}

const oldWound = activity("launch-monument-old-wound", "「丰碑留名·旧创」限时挑战", "monument", "02-12 12:00", openingMaintenance,
  "完成影拓丰碑对应挑战领取奖励。2 月 22 日 12:00 更新「无机造物」相关挑战。");
const reignitedContract = activity("heirloom-crisis-contract", "「危机合约」重燃测试作战", "contract", "06-19 12:00", heirloomMaintenance,
  "组合指标完成挑战并获得晶化硬币。6 月 26 日 12:00 更新，机密圣所的兑换期另计。");
const sanitySupply = "每日完成指定任务，可领取理智消耗许可和应急理智加强剂。";
const trial = "使用试用干员的固定队伍完成指定关卡，可在活动中心领取奖励。";

const launch = earlyVersion(1, "零号委托", opening, openingMaintenance, "1159919485979721728", openingDetails, [
  activity("launch-awakening-signin", "「唤醒签到」新手活动", "signin", opening, null, "累计签到 14 日可获得艾尔黛拉、沧溟星梦及特许寻访凭证等奖励。"),
  activity("launch-authority-rewards", "「权限等阶奖励」新手活动", "gift", opening, null, "提升权限等阶可领取臻选武器补给、寻访凭证及嵌晶玉。"),
  activity("launch-set-out", "「于此启程」新手活动", "gift", opening, null, "随主线推进领取新手奖励。"),
  activity("launch-headhunt-beginner", "「启程寻访」", "gift", opening, null, "使用主线奖励的启程寻访凭证，最多 40 次可获得六星干员。", { category: "operator", symbol: "访", visual: "operator" }),
  activity("launch-headhunt-standard", "「基础寻访」", "gift", opening, null, "开服起常驻的基础寻访。", { category: "operator", symbol: "访", visual: "operator" }),
  activity("launch-etching", "「蚀像寻遗」常驻玩法", "realm", opening, null, "探索谷地像差，达成行动刻度可领取嵌晶玉和基础寻访凭证。"),
  activity("launch-lone-wolf", "「离群之狼」狼卫叙事活动", "story", opening, openingMaintenance, "完成同名支线可领取嵌晶玉和培养素材。"),
  activity("launch-burning-memory", "「燃尽记忆之灰」莱万汀叙事活动", "story", opening, openingMaintenance, "完成同名支线可领取嵌晶玉和培养素材。"),
  activity("launch-yvonne-story", "「爱，呐喊和原型机」伊冯叙事活动", "story", "01-30 12:00", openingMaintenance, "完成同名支线可领取嵌晶玉和培养素材。"),
  activity("launch-gilberta-story", "「信使的信」洁尔佩塔叙事活动", "story", "02-06 12:00", openingMaintenance, "完成同名支线可领取嵌晶玉和培养素材。"),
  activity("launch-laevatain-signin", "「行火留烬」限时签到", "signin", opening, "02-07 11:59", "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("launch-laevatain-trial", "莱万汀作战演练", "training", opening, "02-07 11:59", trial),
  activity("launch-gilberta-signin", "「灵动信使」限时签到", "signin", "02-07 12:00", "02-24 11:59", "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("launch-gilberta-trial", "洁尔佩塔作战演练", "training", "02-07 12:00", "02-24 11:59", trial),
  activity("launch-yvonne-signin", "「异彩斑斓」限时签到", "signin", "02-24 12:00", openingMaintenance, "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("launch-yvonne-trial", "伊冯作战演练", "training", "02-24 12:00", openingMaintenance, trial),
  activity("launch-carly-valley", "「卡莉的谷地童话」拍照活动", "photo", "02-07 12:00", "02-24 04:00", "按拍摄目标完成七个拍照任务，领取头像框、嵌晶玉等奖励。", { sourceNote: "https://www.bilibili.com/opus/1166158355468648502" }),
  activity("launch-smoke-wuling", "「烟光武陵」引入活动", "intro", "02-07 12:00", "02-24 04:00", "完成活动任务可获得嵌晶玉和存续的痕迹。", { sourceNote: "https://www.bilibili.com/opus/1166166086420267042" }),
  activity("launch-lunar-greetings", "「宏福贺新春」新春活动", "festival", "02-07 12:00", "03-04 04:00", "参加新春活动并领取阶段奖励。", { sourceNote: "https://wiki.biligame.com/zmd/宏福贺新春" }),
  activity("launch-monument-outcasts", "「影拓丰碑」大地的弃子", "monument", "02-12 12:00", null, "开启影拓丰碑首个常驻挑战系列。"),
  oldWound,
  activity("launch-monument-inorganic", "「影拓丰碑」无机造物", "monument", "02-22 12:00", null, "常驻挑战系列按后续公告提前至 2 月 22 日。", { sourceNote: openingChanges }),
  update(oldWound, { id: "launch-monument-old-wound-update", title: "「丰碑留名·旧创」内容更新", at: "02-22 12:00", description: "同步开放无机造物对应的限时挑战。", sourceNote: openingChanges }),
  activity("launch-secret-realm", "「密境行者」常驻解谜活动", "realm", "02-24 12:00", null, "完成空间组解谜可获得嵌晶玉、存续的痕迹和培养材料。"),
  activity("launch-sanity-discount", "「理智减耗」限时活动", "supply", "03-02 12:00", "03-12 04:00", "每日限次降低指定关卡的奖励领取理智消耗。"),
  activity("launch-next-version-warmup", "「清波将起」限时签到", "signin", "03-05 12:00", openingMaintenance, "累计 3 日可领取基础寻访凭证 ×2、嵌晶玉 ×500。", { sourceNote: "https://www.233leyuan.com/post-detail/2029369451426512896" }),
]);

const tide = earlyVersion(2, "新潮起，故渊离", tideOpening, tideMaintenance, "1177252255999459329", tideDetails, [
  activity("tide-qingbo-region", "「武陵－清波寨」新区域开放", "region", tideOpening, null, "随版本开放清波寨。"),
  activity("tide-beginner-headhunt-gift", "「新手特许赠礼」常驻活动", "gift", tideOpening, null, "完成指定任务累计可领取特许寻访凭证 ×10。"),
  activity("tide-tangtang-signin", "「清波静流」限时签到", "signin", tideOpening, "03-29 11:59", "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("tide-tangtang-trial", "汤汤作战演练", "training", tideOpening, "03-29 11:59", trial),
  activity("tide-silent-spring", "「泉流无声」引入活动", "intro", tideOpening, "04-02 04:00", "完成清波寨相关任务领取嵌晶玉和存续的痕迹。"),
  activity("tide-etching-zone-4", "「蚀像寻遗」像差区域 4", "realm", tideOpening, null, "开放新的像差区域和行动刻度奖励。"),
  activity("tide-workers-festival", "「物资供给·开拓节」供给活动", "production", "03-19 12:00", "04-02 04:00", "完成物资供给领取开拓节贴纸、嵌晶玉及培养素材。"),
  activity("tide-sanity-discount-first", "「理智减耗」第一期", "supply", "03-22 12:00", "03-29 04:00", "每日限次降低指定关卡的奖励领取理智消耗。"),
  activity("tide-monument-scars", "「影拓丰碑」灼痛疤痕", "monument", "03-26 12:00", null, "开放新的常驻挑战系列。"),
  activity("tide-monument-scorch", "「丰碑留名·炽痕」限时挑战", "monument", "03-26 12:00", "04-09 04:00", "完成灼痛疤痕对应挑战领取奖励。"),
  activity("tide-rossi-signin", "「狼群瑰宝」限时签到", "signin", "03-29 12:00", tideMaintenance, "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("tide-rossi-trial", "洛茜作战演练", "training", "03-29 12:00", tideMaintenance, trial),
  activity("tide-red-knight", "「红骑士」洛茜叙事活动", "story", "03-29 12:00", tideMaintenance, "活动页于维护前下线，符合条件时仍可体验同名支线并领取任务奖励。"),
  activity("tide-secret-caverns", "「密境行者」行探险窟", "realm", "03-29 12:00", null, "开放新的常驻解谜空间组。"),
  activity("tide-cleaning", "「净流涤尘」趣味活动", "festival", "03-29 12:00", "04-19 04:00", "完成清洁任务获得头像、嵌晶玉及培养奖励。活动跨入「春晓时」。"),
  activity("tide-hare-adventure", "「长耳兽之旅」网页活动", "festival", "04-01 12:00", "04-08 04:00", "参加网页活动领取对应奖励。", { sourceNote: "https://www.bilibili.com/opus/1186173762088730640" }),
  activity("tide-survival-training", "「生存特训」挑战活动", "arena", "04-09 12:00", "04-30 04:00", "完成挑战领取头像、嵌晶玉及培养奖励。活动跨入「春晓时」。"),
  activity("tide-sanity-discount-second", "「理智减耗」第二期", "supply", "04-10 12:00", "04-17 04:00", "每日限次降低指定关卡的奖励领取理智消耗。"),
  activity("tide-next-version-warmup", "「潮起武陵」限时签到", "signin", "04-12 12:00", tideMaintenance, "累计 3 日可领取基础寻访凭证 ×2、嵌晶玉 ×500。", { sourceNote: "https://www.taptap.cn/moment/792144993518094568" }),
]);

const spring = earlyVersion(3, "春晓时", springOpening, springMaintenance, "1191461725813080067", springDetails, [
  activity("spring-first-dam", "「武陵－首墩」新区域开放", "region", springOpening, null, "全新区域随版本开放。"),
  activity("spring-test-area", "「武陵－试验园区」新区域开放", "region", springOpening, null, "全新区域随版本开放。"),
  activity("spring-daily-login-gift", "「焕新月卡赠礼」免费登录活动", "gift", springOpening, "05-18 04:00", "活动期间每日登录即可领取嵌晶玉、应急理智加强剂和理智消耗许可，累计至多领取 30 日。"),
  activity("spring-operator-development", "「干员培养助力」新手活动", "gift", springOpening, null, "达成指定培养目标，返还培养素材。"),
  activity("spring-thunder-signin", "「春雷醒物」限时签到", "signin", springOpening, "05-22 11:59", "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("spring-zhuang-trial", "庄方宜作战演练", "training", springOpening, "05-22 11:59", trial),
  activity("spring-sea-intro", "「镇绥蚀海」引入活动", "intro", springOpening, "05-14 04:00", "在首墩完成指定任务可领取嵌晶玉和存续的痕迹。"),
  activity("spring-etching-zones-5-6", "「蚀像寻遗」像差区域 5 与 6", "realm", springOpening, null, "开放两处像差区域及新的行动刻度奖励。"),
  activity("spring-star-photo", "「镌宇铭星·留影」联动活动", "photo", "04-24 12:00", springMaintenance, "完成拍照任务可获得启明驻留平台模型、嵌晶玉等。"),
  activity("spring-star-signin", "「镌宇铭星签到」联动活动", "signin", "04-24 12:00", springMaintenance, "签到可领取贴纸、佩丽卡的信物、头像框和嵌晶玉。"),
  activity("spring-rescue-production", "「集成援助·掌中救星」生产活动", "production", "04-28 12:00", "05-13 16:00", "生产并提交援助物品可获得援助成果券。物资兑换另有截止时间。"),
  activity("spring-rescue-exchange", "「集成援助·掌中救星」物资兑换处", "production", "04-28 12:00", "05-19 04:00", "使用援助成果券兑换活动奖励。"),
  activity("spring-party-pastry", "「共贺庆典·此时欢宴」网页活动", "festival", "05-01 12:00", springMaintenance, "堆叠蛋糕获得积分并领取活动头像。", { sourceNote: "https://www.bilibili.com/opus/1196997079667310598" }),
  activity("spring-sanity-first", "「理智补给」第一期", "supply", "05-07 04:00", "05-14 04:00", sanitySupply),
  activity("spring-monument-turbid", "「影拓丰碑」浊流具现", "monument", "05-08 12:00", null, "开放包含六个关卡的常驻挑战系列。"),
  activity("spring-monument-rewards", "「丰碑留名·秽流」限时挑战", "monument", "05-08 12:00", "05-22 04:00", "完成浊流具现对应挑战领取限时奖励。"),
  activity("spring-party-gifts", "「共贺庆典·此时庆会」网页活动", "festival", "05-14 12:00", springMaintenance, "堆叠礼盒获得积分并领取帝江号陈列品。", { sourceNote: "https://www.bilibili.com/opus/1202130424537546761" }),
  activity("spring-radiant-signin", "「流光庆时」限时签到", "signin", "05-14 12:00", springMaintenance, "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("spring-wuling-chef", "「物资供给·武陵特厨」供给活动", "production", "05-14 12:00", springMaintenance, "完成供给任务可领取武陵特厨贴纸、嵌晶玉及培养素材。"),
  activity("spring-soil-intro", "「息壤妙用」引入活动", "intro", "05-14 12:00", springMaintenance, "在试验园区完成任务可领取嵌晶玉和存续的痕迹。"),
  activity("spring-sanity-second", "「理智补给」第二期", "supply", "05-29 04:00", "06-05 04:00", sanitySupply),
  activity("spring-next-version-warmup", "「寻奇探幽」限时签到", "signin", "05-29 12:00", springMaintenance, "累计 3 日可领取基础寻访凭证 ×2、嵌晶玉 ×500。", { sourceNote: "https://www.taptap.cn/moment/808792384757305293" }),
]);

const heirlooms = earlyVersion(4, "寻遗散记", heirloomOpening, heirloomMaintenance, "1209644899316531240", heirloomDetails, [
  activity("heirloom-sword-valley", "「武陵－藏剑谷」新区域开放", "region", heirloomOpening, null, "随版本开放藏剑谷。"),
  activity("heirloom-sword-intro", "「寻剑幽谷」引入活动", "intro", heirloomOpening, "06-26 12:00", "在藏剑谷完成指定任务可领取嵌晶玉和存续的痕迹。"),
  activity("heirloom-mifu-story", "「以拳问心」弭弗叙事活动", "story", heirloomOpening, heirloomMaintenance, "完成同名支线领取嵌晶玉和培养奖励。"),
  activity("heirloom-mifu-signin", "「拳与心合」限时签到", "signin", heirloomOpening, "06-26 11:59", "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("heirloom-mifu-trial", "弭弗作战演练", "training", heirloomOpening, "06-26 11:59", trial),
  activity("heirloom-crisis-preparation", "「危机筹备」限时活动", "contract", "06-12 04:00", "06-19 04:00", "完成每日任务可领取理智补给和精锻材料。"),
  activity("heirloom-sword-trials", "「选剑演武」常驻玩法", "arena", "06-12 12:00", null, "开放奖励演算和自由演算模式。"),
  activity("heirloom-sword-scoring", "「演武集算」挑战活动", "arena", "06-12 12:00", heirloomMaintenance, "在选剑演武完成挑战可领取嵌晶玉和培养奖励。"),
  reignitedContract,
  activity("heirloom-crisis-shop", "「机密圣所」重燃兑换商店", "contract", "06-19 12:00", "07-23 04:00", "使用晶化硬币兑换奖励，兑换期跨入「向渊行」。"),
  update(reignitedContract, { id: "heirloom-crisis-update", title: "「危机合约」重燃测试作战内容更新", at: "06-26 12:00", description: "重燃测试作战开放后续内容。", sourceNote: heirloomDetails }),
  activity("heirloom-camille-story", "「亡者之舞」卡缪叙事活动", "story", "06-26 12:00", heirloomMaintenance, "完成同名支线领取嵌晶玉和培养奖励。"),
  activity("heirloom-camille-signin", "「夜趋逐罪」限时签到", "signin", "06-26 12:00", heirloomMaintenance, "累计签到 7 日可领取当期寻访凭证 ×5。"),
  activity("heirloom-camille-trial", "卡缪作战演练", "training", "06-26 12:00", heirloomMaintenance, trial),
  activity("heirloom-carly-wuling", "「卡莉的武陵童话」拍照活动", "photo", "07-02 12:00", heirloomMaintenance, "完成拍照可领取卡莉的墨绘集头像框、嵌晶玉和存续的痕迹。"),
  activity("heirloom-monument-silence", "「影拓丰碑」死寂争鸣", "monument", "07-02 12:00", null, "开放包含六个关卡的常驻挑战系列。"),
  activity("heirloom-monument-rewards", "「丰碑留名·忿声」限时挑战", "monument", "07-02 12:00", heirloomMaintenance, "完成死寂争鸣对应挑战领取限时奖励。"),
  activity("heirloom-sanity", "「理智补给」限时活动", "supply", "07-09 04:00", "07-16 04:00", sanitySupply),
  activity("heirloom-next-version-warmup", "「北行险境」限时签到", "signin", "07-10 00:00", heirloomMaintenance,
    "累计 3 日可领取基础寻访凭证 ×2、嵌晶玉 ×500。时间轴按闪断更新当天定位。", {
      startUnknown: true, startLabel: "2026/07/10 闪断更新维护后", sourceNote: "https://www.sina.cn/news/detail/5319229492171331.html",
    }),
]);

export const earlyVersions = [launch, tide, spring, heirlooms];
