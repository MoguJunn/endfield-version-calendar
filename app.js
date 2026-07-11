const DAY = 24 * 60 * 60 * 1000;
const MAIN_SITE_STATS_API = "https://ef-gacha.mogujun.icu/api/stats";
const CALENDAR_SITE_CONFIG = window.ENDFIELD_CALENDAR_CONFIG || {};
let timelineStart = new Date("2026-07-16T12:00:00+08:00");
let timelineEnd = new Date("2026-09-02T06:00:00+08:00");
let totalDays = Math.ceil((timelineEnd - timelineStart) / DAY);

const categories = [
  { id: "operator", name: "干员寻访", en: "OPERATOR HEADHUNTING", icon: "⌁" },
  { id: "arsenal", name: "武库申领", en: "ARSENAL ISSUE", icon: "✕" },
  { id: "permanent", name: "常驻活动", en: "PERMANENT CONTENT", icon: "▦" },
  { id: "limited", name: "限时活动", en: "LIMITED EVENTS", icon: "✦" },
  { id: "update", name: "内容更新", en: "CONTENT UPDATE", icon: "⚑", overlay: true },
];

const rawEvents = [
  {
    id: "op-wander",
    poolId: "special_manual_limited_pool_ixd68v_20260716_1aogy7",
    category: "operator",
    title: "「临渊望北」特许寻访",
    related: "「踏渊北眺」签到 & 作战演练",
    start: "2026-07-16T12:00:00+08:00",
    end: "2026-08-09T11:59:00+08:00",
    color: "#43aebc",
    lane: 0,
    symbol: "渊",
    visual: "rift",
    description: "「向渊行」版本首期特许寻访，同期开放「踏渊北眺」签到与「作战演练」干员试用活动。",
  },
  {
    id: "op-dawn",
    poolId: "special_manual_limited_pool_1d87dz_20260809_nsisrc",
    category: "operator",
    title: "「晨星于此闪耀」特许寻访",
    related: "「明耀晨星」签到 & 作战演练",
    start: "2026-08-09T12:00:00+08:00",
    end: "2026-09-02T06:00:00+08:00",
    color: "#af42d7",
    lane: 0,
    symbol: "星",
    visual: "star",
    description: "版本第二期特许寻访，于 8 月 9 日中午开放，同期开放「明耀晨星」签到与「作战演练」干员试用活动。",
  },
  {
    id: "weapon-years",
    poolId: "weaponbox_manual_weapon_pool_1g47uo_20260716_7bm8em",
    category: "arsenal",
    title: "「军列申领」",
    start: "2026-07-16T12:00:00+08:00",
    end: null,
    endLabel: "「晨星于此闪耀」后第1个特许寻访结束时",
    color: "#48c2d5",
    lane: 0,
    symbol: "轮",
    visual: "arsenal",
    description: "版本首期武库申领。结束时间采用海报中的相对规则：于「晨星于此闪耀」后的第 1 个特许寻访结束时关闭。",
  },
  {
    id: "weapon-edge",
    poolId: "weponbox_1_3_1",
    category: "arsenal",
    title: "「绛结申领」",
    start: "2026-06-05T12:00:00+08:00",
    end: "2026-08-09T11:59:00+08:00",
    color: "#cf1986",
    lane: 1,
    symbol: "锋",
    visual: "arsenal",
    description: "跨版本持续开放的武库申领，于 8 月 9 日中午结束。",
  },
  {
    id: "weapon-red",
    poolId: "weponbox_1_3_2",
    category: "arsenal",
    title: "「染赤申领」",
    start: "2026-06-26T12:00:00+08:00",
    end: "2026-09-02T06:00:00+08:00",
    color: "#c7003c",
    lane: 2,
    symbol: "赤",
    visual: "arsenal",
    description: "跨越完整版本周期的武库申领。",
  },
  {
    id: "weapon-pupil",
    poolId: "weaponbox_manual_weapon_pool_4e5oi9_20260809_roujh3",
    category: "arsenal",
    title: "「明曜申领」",
    start: "2026-08-09T12:00:00+08:00",
    end: null,
    endLabel: "「晨星于此闪耀」后第2个特许寻访结束时",
    color: "#b54ad2",
    lane: 1,
    symbol: "瞳",
    visual: "arsenal",
    description: "版本后半程新增武库申领。结束时间采用海报中的相对规则：于「晨星于此闪耀」后的第 2 个特许寻访结束时关闭。",
  },
  {
    id: "war-echo-1",
    category: "permanent",
    title: "「战争回响」新赛季「追忆赛季」",
    start: "2026-07-16T12:00:00+08:00",
    end: "2026-08-09T11:59:00+08:00",
    color: "#df2118",
    lane: 0,
    symbol: "战",
    visual: "echo",
    image: "./assets/events/Version%205/战争回想（两赛季相同）.png",
    description: "战争回响当前赛季，将在 8 月 9 日中午完成轮换。",
  },
  {
    id: "war-echo-2",
    category: "permanent",
    title: "「战争回响」新赛季「谵妄赛季」",
    start: "2026-08-09T12:00:00+08:00",
    end: "2026-09-02T06:00:00+08:00",
    color: "#d92222",
    lane: 0,
    symbol: "战",
    visual: "echo",
    image: "./assets/events/Version%205/战争回想（两赛季相同）.png",
    description: "8 月 9 日开放的新一期战争回响赛季。",
  },
  {
    id: "meteor-story",
    category: "permanent",
    title: "「如同流星飞越边界」梨诺叙事活动",
    start: "2026-08-09T12:00:00+08:00",
    end: null,
    color: "#ae36e0",
    lane: 1,
    permanent: true,
    symbol: "契",
    visual: "story",
    image: "./assets/events/Version%205/如同流星飞越边界.png",
    description: "梨诺叙事活动于 8 月 9 日起常驻开放，无限时结束时间。",
  },
  {
    id: "monument-birds",
    category: "permanent",
    title: "「影拓丰碑」新系列「山中见犼」",
    start: "2026-08-06T12:00:00+08:00",
    end: null,
    color: "#8e2725",
    lane: 2,
    permanent: true,
    symbol: "碑",
    visual: "monument",
    image: "./assets/events/Version%205/影拓丰碑+丰碑留名.png",
    description: "新系列内容于 8 月 6 日中午起常驻开放。",
  },
  {
    id: "monument-beast",
    category: "permanent",
    title: "「丰碑留名 · 兽犼」",
    start: "2026-08-06T12:00:00+08:00",
    end: "2026-08-20T04:00:00+08:00",
    color: "#76312f",
    lane: 3,
    symbol: "兽",
    visual: "monument",
    image: "./assets/events/Version%205/影拓丰碑+丰碑留名.png",
    description: "限期开放的丰碑挑战内容。",
  },
  {
    id: "secret-realm",
    category: "permanent",
    title: "「密境行者」新空间组「六方巧境」",
    start: "2026-08-19T12:00:00+08:00",
    end: null,
    color: "#526194",
    lane: 2,
    permanent: true,
    symbol: "境",
    visual: "realm",
    image: "./assets/events/Version%205/密境行者.png",
    description: "新空间组于 8 月 19 日中午起常驻开放。",
  },
  {
    id: "secret-realm-update",
    category: "update",
    eventType: "content-update",
    overlayFor: "secret-realm",
    title: "「密境行者」内容更新",
    start: "2026-08-26T04:00:00+08:00",
    end: null,
    milestone: true,
    color: "#7181bd",
    symbol: "更",
    visual: "realm",
    image: "./assets/events/Version%205/密境行者.png",
    description: "「密境行者」于 8 月 26 日 04:00 更新活动内容。该节点为单次更新时间标记，不代表一段新的持续活动。",
  },
  {
    id: "companion-gift",
    category: "limited",
    title: "「相伴赠礼」庆典活动",
    start: "2026-07-16T12:00:00+08:00",
    end: "2026-08-09T12:00:00+08:00",
    color: "#b7b600",
    eventInk: "#171a14",
    lane: 0,
    symbol: "礼",
    visual: "gift",
    image: "./assets/events/Version%205/相伴赠礼.png",
    description: "版本相伴庆典赠礼，活动期间登录参与。",
  },
  {
    id: "fortune",
    category: "limited",
    title: "「宏运连连乐」庆典活动",
    start: "2026-07-16T12:00:00+08:00",
    end: "2026-07-31T04:00:00+08:00",
    color: "#d96a1f",
    lane: 1,
    symbol: "运",
    visual: "festival",
    image: "./assets/events/Version%205/宏运连连乐.png",
    description: "版本前半程开放的庆典活动。",
  },
  {
    id: "northland",
    category: "limited",
    title: "「北观禁土」引入活动",
    start: "2026-07-16T12:00:00+08:00",
    end: "2026-08-09T12:00:00+08:00",
    color: "#9d2779",
    lane: 2,
    symbol: "禁",
    visual: "northland",
    image: "./assets/events/Version%205/北观禁土.png",
    description: "随版本首日开放的引入活动。",
  },
  {
    id: "burning-arena",
    category: "limited",
    title: "「炽燃！竞技大会！！」挑战活动",
    start: "2026-07-30T12:00:00+08:00",
    end: "2026-08-13T04:00:00+08:00",
    color: "#9e2a2d",
    lane: 3,
    symbol: "竞",
    visual: "arena",
    image: "./assets/events/Version%205/炽燃！竞技大会！.png",
    description: "限期竞技挑战活动，开放至 8 月 13 日凌晨。",
  },
  {
    id: "sanity-supply-first",
    category: "limited",
    title: "「理智补给」第一期",
    start: "2026-08-02T04:00:00+08:00",
    end: "2026-08-09T04:00:00+08:00",
    color: "#7e7c7a",
    lane: 4,
    symbol: "智",
    visual: "supply",
    image: "./assets/events/Version%205/理智补给通用图.png",
    description: "活动期间每日完成指定任务，可获得理智消耗许可及应急理智加强剂等奖励。",
  },
  {
    id: "roots",
    category: "limited",
    title: "「根脉奇境」趣味活动",
    start: "2026-08-09T12:00:00+08:00",
    end: "2026-09-02T06:00:00+08:00",
    color: "#b8860b",
    lane: 2,
    symbol: "根",
    visual: "roots",
    image: "./assets/events/Version%205/根脉奇境.png",
    description: "版本后半程趣味活动，于版本收束时结束。",
  },
  {
    id: "sanity-supply-final",
    category: "limited",
    title: "「理智补给」第二期",
    start: "2026-08-26T04:00:00+08:00",
    end: "2026-09-02T04:00:00+08:00",
    color: "#7e7c7a",
    lane: 4,
    symbol: "智",
    visual: "supply",
    image: "./assets/events/Version%205/理智补给通用图.png",
    description: "版本末期开放的第二期理智补给，每日完成指定任务可领取补给奖励。",
  },
  {
    id: "next-version-warmup",
    category: "limited",
    title: "新版本预热签到活动",
    start: "2026-08-28T04:00:00+08:00",
    startUnknown: true,
    startLabel: "待官方公布（海报标注为 ??）",
    end: "2026-09-02T06:00:00+08:00",
    color: "#555b57",
    lane: 5,
    symbol: "签",
    visual: "ticket",
    sourceNote: "海报未公布开始时间，仅确认于 2026/09/02 06:00 结束；时间轴位置仅用于表现其处于版本末期。",
    description: "版本收束前开放的新版本预热签到，开始时间待后续官方公告确认。",
  },
];

const fallbackVersion = {
  versionKey: "version-5",
  versionNumber: "5",
  revision: 1,
  title: "向渊行",
  startsAt: "2026-07-16T12:00:00+08:00",
  endsAt: "2026-09-02T06:00:00+08:00",
  content: { activitiesComplete: true, events: rawEvents },
  pools: [],
  poolNames: {},
  sourceMeta: {
    source: "https://www.bilibili.com/opus/1223774493520953353",
    author: "罗德岛蜜饼工坊",
  },
};

const fallbackVersions = [
  {
    versionKey: "version-1",
    versionNumber: "1",
    revision: 1,
    title: "零号委托",
    startsAt: "2026-01-22T03:00:00+00:00",
    endsAt: "2026-03-12T05:57:36+08:00",
    content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] },
    pools: [],
    poolNames: {},
  },
  {
    versionKey: "version-2",
    versionNumber: "2",
    revision: 1,
    title: "新潮起，故渊离",
    startsAt: "2026-03-12T04:00:00+00:00",
    endsAt: "2026-04-17T06:00:00+08:00",
    content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] },
    pools: [],
    poolNames: {},
  },
  {
    versionKey: "version-3",
    versionNumber: "3",
    revision: 1,
    title: "春晓时",
    startsAt: "2026-04-17T04:00:00+00:00",
    endsAt: "2026-06-05T12:00:00+08:00",
    content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] },
    pools: [],
    poolNames: {},
  },
  {
    versionKey: "version-4",
    versionNumber: "4",
    revision: 1,
    title: "寻遗散记",
    startsAt: "2026-06-05T04:00:00+00:00",
    endsAt: "2026-07-16T06:00:00+08:00",
    content: { activitiesComplete: false, emptyMessage: "活动待补充", events: [] },
    pools: [],
    poolNames: {},
  },
  fallbackVersion,
];

let versions = fallbackVersions;
let currentVersion = fallbackVersion;
let timelineIntroPlayed = false;

function eventTrackType(event) {
  if (event.trackType) return event.trackType;
  if (event.category === "operator" || event.category === "arsenal") return event.category;
  if (event.id?.startsWith("war-echo")) return "war-echo";
  if (event.id?.startsWith("monument-")) return "monument";
  if (event.id?.startsWith("secret-realm")) return "secret-realm";
  if (event.id === "companion-gift" || event.id === "next-version-warmup") return "signin";
  if (event.id?.startsWith("sanity-supply")) return "sanity-supply";
  return event.visual || event.id || event.category;
}

function normalizeEvents(sourceEvents) {
  const normalized = (Array.isArray(sourceEvents) ? sourceEvents : []).map((event) => {
    const followedEvent = event.follows
      ? sourceEvents.find((candidate) => candidate.id === event.follows)
      : null;
    const start = event.start ?? followedEvent?.start;
    const end = event.end === undefined ? followedEvent?.end : event.end;
    return {
      ...event,
      start,
      end,
      trackType: eventTrackType(event),
      startDate: new Date(start),
      endDate: end ? new Date(end) : null,
    };
  }).filter((event) => Number.isFinite(event.startDate.getTime()));

  categories.filter((category) => !category.overlay).forEach((category) => {
    const categoryEvents = normalized.filter((event) => event.category === category.id);
    const typeOrder = [...new Set(categoryEvents.map((event) => event.trackType))];
    let laneOffset = 0;

    typeOrder.forEach((trackType) => {
      const laneEnds = [];
      categoryEvents
        .filter((event) => event.trackType === trackType)
        .sort((left, right) => left.startDate - right.startDate)
        .forEach((event) => {
          const eventEnd = event.endDate?.getTime() ?? timelineEnd.getTime();
          const freeLane = laneEnds.findIndex((end) => !end || end <= event.startDate.getTime());
          const localLane = freeLane === -1 ? laneEnds.length : freeLane;
          event.lane = laneOffset + localLane;
          laneEnds[localLane] = eventEnd;
        });
      laneOffset += Math.max(laneEnds.length, 1);
    });
  });

  return normalized;
}

let events = normalizeEvents(rawEvents);

const elements = {
  versionSwitcher: document.querySelector("#versionSwitcher"),
  versionAxis: document.querySelector("#versionAxis"),
  versionMarkers: document.querySelector("#versionMarkers"),
  activityNotice: document.querySelector("#activityNotice"),
  versionNumber: document.querySelector("#versionNumber"),
  versionTitle: document.querySelector("#versionTitle"),
  versionStatusLabel: document.querySelector("#versionStatusLabel"),
  versionLiveLabel: document.querySelector("#versionLiveLabel"),
  versionEndDate: document.querySelector("#versionEndDate"),
  versionEndTime: document.querySelector("#versionEndTime"),
  heroWatermark: document.querySelector("#heroWatermark"),
  sourceCredit: document.querySelector("#sourceCredit"),
  calendarNote: document.querySelector("#calendarNote"),
  timeline: document.querySelector("#timeline"),
  timelineBody: document.querySelector("#timelineBody"),
  timelineScroll: document.querySelector("#timelineScroll"),
  dateAxis: document.querySelector("#dateAxis"),
  filters: document.querySelector("#filters"),
  zoomRange: document.querySelector("#zoomRange"),
  jumpNow: document.querySelector("#jumpNow"),
  nowLine: document.querySelector("#nowLine"),
  nowLineLabel: document.querySelector("#nowLineLabel"),
  scrollHint: document.querySelector("#scrollHint"),
  eventDialog: document.querySelector("#eventDialog"),
  dialogClose: document.querySelector("#dialogClose"),
  footerRecords: document.querySelector("#footerRecords"),
  icpRecord: document.querySelector("#icpRecord"),
  policeRecord: document.querySelector("#policeRecord"),
};

function applyFooterRecords() {
  const records = [
    {
      element: elements.icpRecord,
      number: CALENDAR_SITE_CONFIG.icpNumber,
      url: CALENDAR_SITE_CONFIG.icpUrl || "https://beian.miit.gov.cn/",
    },
    {
      element: elements.policeRecord,
      number: CALENDAR_SITE_CONFIG.policeNumber,
      url: CALENDAR_SITE_CONFIG.policeUrl || "https://www.beian.gov.cn/",
    },
  ];
  const visibleRecords = records.filter(({ number }) => String(number || "").trim());

  records.forEach(({ element, number, url }) => {
    if (!element) return;
    const text = String(number || "").trim();
    element.hidden = !text;
    element.textContent = text;
    element.href = url;
  });

  if (elements.footerRecords) {
    elements.footerRecords.hidden = visibleRecords.length === 0;
    const divider = elements.footerRecords.querySelector(".footer-record-divider");
    if (divider) divider.hidden = visibleRecords.length < 2;
  }
}

applyFooterRecords();

let activeFilter = "all";
const initialCssDayWidth = Number.parseFloat(
  window.getComputedStyle(document.documentElement).getPropertyValue("--day-width"),
);
let currentDayWidth = Number.isFinite(initialCssDayWidth)
  ? initialCssDayWidth
  : Number(elements.zoomRange.value);
elements.zoomRange.value = String(currentDayWidth);
let lastAgendaSignature = "";

const beijingDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const fullDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const clockFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function getBeijingParts(date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date).map((part) => [part.type, part.value]),
  );
}

function statusOf(event, now) {
  if (event.startUnknown) {
    return event.endDate && now >= event.endDate ? "ended" : "upcoming";
  }
  if (event.milestone) return now < event.startDate ? "upcoming" : "ended";
  if (now < event.startDate) return "upcoming";
  if (event.endDate && now >= event.endDate) return "ended";
  return "live";
}

function statusText(event, now) {
  const status = statusOf(event, now);
  if (event.startUnknown && status !== "ended") return "开始时间待官方公布";
  if (event.milestone) {
    return status === "upcoming"
      ? `内容更新 · ${formatRelative(event.startDate - now)}后`
      : `已于 ${fullDateFormatter.format(event.startDate)} 更新`;
  }
  if (status === "upcoming") return `即将开始 · ${formatRelative(event.startDate - now)}`;
  if (status === "ended") return "已结束";
  if (event.endLabel) return "开放中 · 结束时间按后续寻访轮换规则确定";
  if (!event.endDate) return "已常驻开放";
  return `进行中 · ${formatRelative(event.endDate - now)}后结束`;
}

function eventStartText(event) {
  if (event.startUnknown) return event.startLabel;
  return fullDateFormatter.format(event.startDate);
}

function eventStartShortText(event) {
  if (event.startUnknown) return "待公布";
  return beijingDateFormatter.format(event.startDate);
}

function eventEndText(event) {
  if (event.milestone) return "单次更新节点";
  if (event.endDate) return fullDateFormatter.format(event.endDate);
  if (event.endLabel) return event.endLabel;
  return "常驻开放";
}

function eventEndShortText(event) {
  if (event.milestone) return "内容更新节点";
  if (event.endDate) return beijingDateFormatter.format(event.endDate);
  if (event.endLabel) return "依后续寻访轮换";
  return "常驻开放";
}

function eventDurationText(event) {
  if (event.startUnknown || event.milestone || !event.endDate) return "";
  const totalMinutes = Math.max(1, Math.round((event.endDate - event.startDate) / 60_000));
  const totalHours = Math.round(totalMinutes / 60);
  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `持续 ${days}天${hours ? `${hours}小时` : ""}`;
  }
  if (totalHours >= 1) return `持续 ${totalHours}小时`;
  return `持续 ${totalMinutes}分钟`;
}

function eventRemainingText(event, now = new Date()) {
  if (event.startUnknown || event.milestone || !event.endDate) return "";
  if (now < event.startDate || now >= event.endDate) return "";
  return `剩余 ${formatRelative(event.endDate - now)}`;
}

function applyEventVisual(element, event) {
  element.dataset.visual = event.visual ?? event.category;
  element.classList.toggle("has-image", Boolean(event.image));
  element.classList.toggle(
    "pool-art",
    Boolean(event.image) && (event.category === "operator" || event.category === "arsenal"),
  );
  if (event.backgroundType) element.dataset.backgroundType = event.backgroundType;
  element.style.setProperty("--event-color", event.color);
  element.style.setProperty("--event-image", event.image ? `url("${event.image}")` : "none");
}

function formatRelative(milliseconds) {
  const value = Math.max(0, milliseconds);
  const days = Math.floor(value / DAY);
  const hours = Math.floor((value % DAY) / 3_600_000);
  const minutes = Math.floor((value % 3_600_000) / 60_000);
  if (days > 0) return `${days}天${hours}小时`;
  if (hours > 0) return `${hours}小时${minutes}分`;
  return `${minutes}分钟`;
}

function formatCountdown(milliseconds) {
  const value = Math.max(0, milliseconds);
  const days = Math.floor(value / DAY);
  const hours = Math.floor((value % DAY) / 3_600_000);
  const minutes = Math.floor((value % 3_600_000) / 60_000);
  const seconds = Math.floor((value % 60_000) / 1000);
  return `${String(days).padStart(2, "0")}天 ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateCountdownDisplay(milliseconds) {
  const countdown = document.querySelector("#countdown");
  const nextText = formatCountdown(milliseconds);
  if (countdown.textContent === nextText) return;
  countdown.textContent = nextText;
  countdown.classList.remove("countdown-tick");
  void countdown.offsetWidth;
  countdown.classList.add("countdown-tick");
  countdown.dataset.urgency = milliseconds <= 6 * 3_600_000
    ? "critical"
    : milliseconds <= DAY
      ? "soon"
      : "normal";
}

function renderDateAxis() {
  elements.dateAxis.innerHTML = "";
  for (let index = 0; index < totalDays; index += 1) {
    const date = new Date(timelineStart.getTime() + index * DAY);
    const beijingDate = new Date(date.getTime() + 8 * 3_600_000);
    const day = beijingDate.getUTCDate();
    const month = beijingDate.getUTCMonth() + 1;
    const weekday = beijingDate.getUTCDay();
    const cell = document.createElement("div");
    cell.className = `date-cell${weekday === 0 || weekday === 6 ? " weekend" : ""}${day === 1 ? " month-start" : ""}`;
    cell.style.setProperty("--date-index", index);
    cell.style.setProperty("--date-delay", `${Math.min(index, 24) * 12}ms`);
    cell.innerHTML = `
      <span class="date-weekday">${["日", "一", "二", "三", "四", "五", "六"][weekday]}</span>
      <strong class="date-number"><em>${month}/</em>${day}</strong>
    `;
    cell.title = `${beijingDate.getUTCFullYear()}年${month}月${day}日`;
    elements.dateAxis.appendChild(cell);
  }
}

function renderFilters() {
  const availableCategories = categories.filter((category) => (
    !category.overlay && events.some((event) => event.category === category.id)
  ));
  const options = [{ id: "all", name: "全部日程" }, ...availableCategories];
  elements.filters.innerHTML = "";
  options.forEach((item) => {
    const button = document.createElement("button");
    button.className = `filter-button${item.id === activeFilter ? " active" : ""}`;
    button.type = "button";
    button.textContent = item.name;
    button.addEventListener("click", () => {
      activeFilter = item.id;
      renderFilters();
      renderTimeline();
    });
    elements.filters.appendChild(button);
  });
}

function renderTimeline({ animate = !timelineIntroPlayed } = {}) {
  const shouldAnimate = animate && !timelineIntroPlayed;
  elements.timeline.classList.toggle("play-timeline-intro", shouldAnimate);
  elements.timelineBody.innerHTML = "";
  const availableCategories = categories.filter((category) => (
    !category.overlay && events.some((event) => event.category === category.id)
  ));
  const visibleCategories = activeFilter === "all"
    ? availableCategories
    : availableCategories.filter((category) => category.id === activeFilter);

  if (visibleCategories.length === 0) {
    elements.timelineBody.innerHTML = '<div class="timeline-empty"><strong>日程待补充</strong><span>当前筛选范围内暂时没有可展示的日程。</span></div>';
    timelineIntroPlayed = true;
    updateLiveState();
    return;
  }

  visibleCategories.forEach((category, categoryIndex) => {
    const categoryEvents = events.filter((event) => (
      event.category === category.id && !event.overlayFor
    ));
    const laneCount = Math.max(...categoryEvents.map((event) => event.lane), 0) + 1;
    const groupHeight = category.id === "arsenal"
      ? 128
      : Math.max(128, 20 + laneCount * 52);
    const group = document.createElement("section");
    group.className = `category-group category-${category.id}`;
    group.dataset.category = category.id;
    group.style.minHeight = `${groupHeight}px`;

    const label = document.createElement("div");
    label.className = "category-label";
    label.dataset.index = String(categoryIndex + 1).padStart(2, "0");
    label.innerHTML = `
      <span class="category-icon" aria-hidden="true">${category.icon}</span>
      <strong>${category.name}</strong>
      <small>${category.en}</small>
    `;

    const tracks = document.createElement("div");
    tracks.className = "category-tracks";
    tracks.style.minHeight = `${groupHeight}px`;

    categoryEvents.forEach((event, eventIndex) => {
      const visualStart = Math.max(event.startDate.getTime(), timelineStart.getTime());
      const visualEnd = Math.min(
        event.endDate?.getTime() ?? timelineEnd.getTime(),
        timelineEnd.getTime(),
      );
      if (visualEnd <= visualStart) return;
      const startOffset = (visualStart - timelineStart) / DAY;
      const duration = Math.max((visualEnd - visualStart) / DAY, 0.58);
      const button = document.createElement("button");
      button.className = `event-bar ${statusOf(event, new Date())}${event.permanent ? " permanent" : ""}${event.endLabel ? " open-ended" : ""}${event.milestone ? " milestone" : ""}`;
      button.type = "button";
      button.dataset.eventId = event.id;
      button.dataset.lane = String(event.lane);
      button.style.setProperty("--start", startOffset);
      button.style.setProperty("--duration", duration);
      button.style.setProperty("--lane", event.lane);
      button.style.setProperty("--event-index", eventIndex + categoryIndex * 4);
      button.style.setProperty("--event-ink", event.eventInk ?? "#fff");
      applyEventVisual(button, event);
      const relatedText = event.related ? `<em>&amp; ${event.related}</em>` : "";
      const durationText = eventDurationText(event);
      const remainingText = eventRemainingText(event);
      button.classList.toggle("has-duration", Boolean(durationText));
      button.classList.toggle("has-remaining", Boolean(remainingText));
      button.innerHTML = `
        <span class="event-art" aria-hidden="true"><b>${event.symbol ?? "◇"}</b></span>
        <span class="event-copy">
          <strong>${event.title} ${relatedText}</strong>
          <small>${eventStartShortText(event)}${event.milestone ? ` · ${eventEndShortText(event)}` : ` – ${eventEndShortText(event)}`}</small>
        </span>
        <span class="event-remaining"${remainingText ? "" : " hidden"}>${remainingText}</span>
        ${durationText ? `<span class="event-duration">${durationText}</span>` : ""}
      `;
      button.title = `${event.title}｜${statusText(event, new Date())}`;
      button.addEventListener("click", () => openEventDialog(event));
      tracks.appendChild(button);

      events
        .filter((overlay) => overlay.overlayFor === event.id)
        .forEach((overlay) => {
          const overlayOffset = (overlay.startDate - timelineStart) / DAY;
          if (overlayOffset < 0 || overlayOffset > totalDays) return;
          const updatePin = document.createElement("button");
          updatePin.className = `event-update-pin ${statusOf(overlay, new Date())}`;
          updatePin.type = "button";
          updatePin.dataset.eventId = overlay.id;
          updatePin.style.setProperty("--start", overlayOffset);
          updatePin.style.setProperty("--lane", event.lane);
          updatePin.style.setProperty("--event-color", overlay.color || event.color);
          updatePin.innerHTML = `
            <span class="event-update-pin__flag">${overlay.symbol || "更"}</span>
            <span class="event-update-pin__copy">
              <strong>内容更新</strong>
              <small>${eventStartShortText(overlay)}</small>
            </span>
          `;
          updatePin.title = `${overlay.title}｜${statusText(overlay, new Date())}`;
          updatePin.addEventListener("click", () => openEventDialog(overlay));
          tracks.appendChild(updatePin);
        });
    });

    group.append(label, tracks);
    elements.timelineBody.appendChild(group);
  });
  timelineIntroPlayed = true;
  scheduleVisibleEventContent();
  updateLiveState();
}

function getMilestones(now) {
  const milestones = [];
  events.forEach((event) => {
    if (!event.startUnknown && event.startDate > now) {
      milestones.push({ event, type: "start", date: event.startDate });
    }
    if (!event.startUnknown && event.endDate && event.endDate > now) {
      milestones.push({ event, type: "end", date: event.endDate });
    }
  });
  return milestones.sort((a, b) => a.date - b.date);
}

function updateLiveState() {
  const now = new Date();
  const statuses = events.map((event) => statusOf(event, now));
  document.querySelector("#activeCount").textContent = statuses.filter((status) => status === "live").length;
  document.querySelector("#upcomingCount").textContent = statuses.filter((status) => status === "upcoming").length;
  document.querySelector("#beijingClock").textContent = `北京时间 ${clockFormatter.format(now)}`;

  const milestones = getMilestones(now);
  const next = milestones[0];
  if (next) {
    const nextAction = next.event.milestone ? "更新" : next.type === "start" ? "开放" : "结束";
    document.querySelector("#nextEventName").textContent = `${nextAction} · ${next.event.title}`;
    updateCountdownDisplay(next.date - now);
    document.querySelector("#nextEventAt").textContent = beijingDateFormatter.format(next.date);
  } else {
    document.querySelector("#nextEventName").textContent = "时间轴内暂无后续节点";
    updateCountdownDisplay(0);
    document.querySelector("#nextEventAt").textContent = "等待后续日程更新";
  }

  updatePhase(now);
  updateNowLine(now);
  updateEventBars(now);
  renderAgenda(now, milestones);
}

function updatePhase(now) {
  const phaseLabel = document.querySelector("#phaseLabel");
  const phaseDescription = document.querySelector("#phaseDescription");
  const versionStart = new Date(currentVersion.startsAt || timelineStart);
  const versionEnd = new Date(currentVersion.endsAt || timelineEnd);
  const midpoint = new Date(versionStart.getTime() + (versionEnd - versionStart) / 2);

  if (now < versionStart) {
    phaseLabel.textContent = "版本待开放";
    phaseDescription.textContent = `${formatRelative(versionStart - now)}后版本开启`;
  } else if (now < midpoint) {
    phaseLabel.textContent = "版本上半程";
    phaseDescription.textContent = `${currentVersion.title}正在进行`;
  } else if (now < versionEnd) {
    phaseLabel.textContent = "版本下半程";
    phaseDescription.textContent = `距离版本收束还有${formatRelative(versionEnd - now)}`;
  } else {
    phaseLabel.textContent = "版本已收束";
    phaseDescription.textContent = `${currentVersion.title}历史日程`;
  }
}

function updateNowLine(now) {
  const rawOffset = (now - timelineStart) / DAY;
  const offset = Math.min(Math.max(rawOffset, 0), totalDays);
  elements.timeline.style.setProperty("--now", offset);
  const beijingNow = new Date(now.getTime() + 8 * 3_600_000);
  const dateLabel = `${beijingNow.getUTCMonth() + 1}/${beijingNow.getUTCDate()}`;
  if (rawOffset < 0) {
    elements.nowLineLabel.textContent = `现在 ${dateLabel} · 日程前`;
  } else if (rawOffset > totalDays) {
    elements.nowLineLabel.textContent = `现在 ${dateLabel} · 日程后`;
  } else {
    elements.nowLineLabel.textContent = `现在 · ${dateLabel}`;
  }
}

function updateEventBars(now) {
  document.querySelectorAll(".event-bar").forEach((bar) => {
    const event = events.find((item) => item.id === bar.dataset.eventId);
    if (!event) return;
    bar.classList.remove("live", "upcoming", "ended");
    bar.classList.add(statusOf(event, now));
    bar.title = `${event.title}｜${statusText(event, now)}`;
    const remaining = bar.querySelector(".event-remaining");
    if (remaining) {
      const text = eventRemainingText(event, now);
      remaining.textContent = text;
      remaining.hidden = !text;
      bar.classList.toggle("has-remaining", Boolean(text));
    }
  });
  document.querySelectorAll(".event-update-pin").forEach((pin) => {
    const event = events.find((item) => item.id === pin.dataset.eventId);
    if (!event) return;
    pin.classList.remove("live", "upcoming", "ended");
    pin.classList.add(statusOf(event, now));
    pin.title = `${event.title}｜${statusText(event, now)}`;
  });
}

function renderAgenda(now, milestones = getMilestones(now)) {
  const agendaGrid = document.querySelector("#agendaGrid");
  const uniqueStarts = milestones
    .filter((milestone) => milestone.type === "start" && !milestone.event.startUnknown)
    .slice(0, 3);
  const signature = `${Math.floor(now.getTime() / 60_000)}:${uniqueStarts.map(({ event }) => event.id).join(",")}`;
  if (signature === lastAgendaSignature) return;
  lastAgendaSignature = signature;
  document.querySelector("#agendaDate").textContent = fullDateFormatter.format(now);
  agendaGrid.innerHTML = "";

  if (uniqueStarts.length === 0) {
    agendaGrid.innerHTML = '<article class="agenda-card empty">当前时间轴内暂无后续新增日程</article>';
    return;
  }

  uniqueStarts.forEach((milestone, index) => {
    const category = categories.find((item) => item.id === milestone.event.category);
    const card = document.createElement("article");
    card.className = "agenda-card";
    card.dataset.index = String(index + 1).padStart(2, "0");
    applyEventVisual(card, milestone.event);
    card.innerHTML = `
      <div class="agenda-visual" aria-hidden="true"><b>${milestone.event.symbol ?? "◇"}</b></div>
      <span class="agenda-category">${category.name} / ${category.en}</span>
      <h3>${milestone.event.title}</h3>
      <time>${fullDateFormatter.format(milestone.date)}</time>
      <p>${formatRelative(milestone.date - now)}后${milestone.event.milestone ? "更新" : "开放"}</p>
    `;
    agendaGrid.appendChild(card);
  });
}

function openEventDialog(event) {
  const category = categories.find((item) => item.id === event.category);
  const now = new Date();
  elements.eventDialog.style.setProperty("--dialog-color", event.color);
  applyEventVisual(elements.eventDialog, event);
  document.querySelector("#dialogVisual").innerHTML = `<b>${event.symbol ?? "◇"}</b>`;
  document.querySelector("#dialogCategory").textContent = `${category.name} / ${category.en}`;
  document.querySelector("#dialogTitle").textContent = event.title;
  const related = document.querySelector("#dialogRelated");
  related.textContent = event.related ?? "";
  related.hidden = !event.related;
  document.querySelector("#dialogStatus").textContent = statusText(event, now);
  document.querySelector("#dialogStart").textContent = eventStartText(event);
  document.querySelector("#dialogEnd").textContent = eventEndText(event);
  document.querySelector("#dialogDescription").textContent = event.description;
  const sourceNote = document.querySelector("#dialogSourceNote");
  sourceNote.textContent = event.sourceNote ?? (event.follows ? "该日程跟随对应特许寻访同步开放。" : "");
  sourceNote.hidden = !sourceNote.textContent;
  elements.eventDialog.showModal();
}

function getTimelineLabelWidth() {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--label-width"),
  ) || 0;
}

function updateArsenalViewportLayout() {
  const group = elements.timelineBody.querySelector('[data-category="arsenal"]');
  if (!group) return;

  const bars = [...group.querySelectorAll(".event-bar")];
  const labelWidth = getTimelineLabelWidth();
  const visibleStart = timelineStart.getTime()
    + Math.max(elements.timelineScroll.scrollLeft / currentDayWidth, 0) * DAY;
  const visibleTrackWidth = Math.max(elements.timelineScroll.clientWidth - labelWidth, 0);
  const visibleEnd = visibleStart + visibleTrackWidth / currentDayWidth * DAY;
  const visibleBars = bars.filter((bar) => {
    const event = events.find((item) => item.id === bar.dataset.eventId);
    if (!event) return false;
    const eventEnd = event.endDate?.getTime() ?? timelineEnd.getTime();
    return event.startDate.getTime() < visibleEnd && eventEnd > visibleStart;
  });
  const visibleLanes = [...new Set(
    visibleBars.map((bar) => Number.parseInt(bar.dataset.lane, 10)),
  )]
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  const laneMap = new Map(visibleLanes.map((lane, index) => [lane, index]));

  bars.forEach((bar) => {
    const originalLane = Number.parseInt(bar.dataset.lane, 10);
    bar.style.setProperty("--lane", laneMap.get(originalLane) ?? 0);
  });

  const visibleLaneCount = Math.max(visibleLanes.length, 1);
  const groupHeight = Math.max(128, 20 + (visibleLaneCount + 1) * 52);
  group.style.minHeight = `${groupHeight}px`;
  const tracks = group.querySelector(".category-tracks");
  if (tracks) tracks.style.minHeight = `${groupHeight}px`;
}

let eventViewportFrame = 0;
let densityFeedbackTimer = 0;

function updateVisibleEventContent() {
  eventViewportFrame = 0;
  updateArsenalViewportLayout();
  updatePinnedVersionFlags();
  const labelWidth = getTimelineLabelWidth();
  const viewStart = elements.timelineScroll.scrollLeft + labelWidth;
  const viewEnd = elements.timelineScroll.scrollLeft + elements.timelineScroll.clientWidth;

  document.querySelectorAll(".event-bar").forEach((bar) => {
    const start = Number.parseFloat(bar.style.getPropertyValue("--start")) || 0;
    const duration = Number.parseFloat(bar.style.getPropertyValue("--duration")) || 0;
    const barStart = labelWidth + start * currentDayWidth;
    const barWidth = Math.max(duration * currentDayWidth, 20);
    const barEnd = barStart + barWidth;
    const visibleStart = Math.max(barStart, viewStart);
    const visibleEnd = Math.min(barEnd, viewEnd);

    if (visibleEnd <= visibleStart) return;

    const hiddenLeft = Math.max(visibleStart - barStart, 0);
    const visibleWidth = visibleEnd - visibleStart;
    const visualWidth = Math.min(barWidth * 0.42, 190);
    const visualInset = Math.min(
      Math.max(visibleEnd - barStart - visualWidth, hiddenLeft),
      Math.max(barWidth - visualWidth, 0),
    );
    const copyWidth = Math.max(visibleWidth, 20);

    bar.style.setProperty("--visible-inset", `${hiddenLeft}px`);
    bar.style.setProperty("--visible-right-inset", `${Math.max(barEnd - visibleEnd, 0)}px`);
    bar.style.setProperty("--visible-copy-width", `${copyWidth}px`);
    bar.style.setProperty("--visual-inset", `${visualInset}px`);
  });
}

function updatePinnedVersionFlags() {
  const scrollLeft = elements.timelineScroll.scrollLeft;
  document.querySelectorAll(".version-flag").forEach((flag) => {
    const startOffset = Number.parseFloat(flag.dataset.startOffset);
    const endOffset = Number.parseFloat(flag.dataset.endOffset);
    if (!Number.isFinite(startOffset) || !Number.isFinite(endOffset)) return;
    const start = startOffset * currentDayWidth;
    const end = endOffset * currentDayWidth;
    const lastLeft = Math.max(start, end - flag.offsetWidth - 14);
    flag.style.left = `${Math.min(Math.max(scrollLeft, start), lastLeft)}px`;
  });
}

function scheduleVisibleEventContent() {
  if (eventViewportFrame) return;
  eventViewportFrame = window.requestAnimationFrame(updateVisibleEventContent);
}

function setTimelineDensity(nextWidth, anchorViewportX = null) {
  const min = Number(elements.zoomRange.min);
  const max = Number(elements.zoomRange.max);
  const step = Number(elements.zoomRange.step) || 1;
  const normalized = Math.min(max, Math.max(min, Math.round(nextWidth / step) * step));
  if (normalized === currentDayWidth) return;

  const labelWidth = getTimelineLabelWidth();
  const defaultAnchor = labelWidth
    + Math.max(elements.timelineScroll.clientWidth - labelWidth, 0) / 2;
  const anchor = Math.min(
    elements.timelineScroll.clientWidth,
    Math.max(labelWidth, anchorViewportX ?? defaultAnchor),
  );
  const anchoredDay = (
    elements.timelineScroll.scrollLeft + anchor - labelWidth
  ) / currentDayWidth;

  currentDayWidth = normalized;
  elements.zoomRange.value = String(normalized);
  elements.timeline.style.setProperty("--day-width", `${normalized}px`);
  elements.timelineScroll.scrollLeft = Math.max(
    0,
    labelWidth + anchoredDay * normalized - anchor,
  );
  const frame = elements.timelineScroll.closest(".timeline-frame");
  if (frame) {
    frame.classList.remove("density-adjusting");
    void frame.offsetWidth;
    frame.classList.add("density-adjusting");
    window.clearTimeout(densityFeedbackTimer);
    densityFeedbackTimer = window.setTimeout(() => {
      frame.classList.remove("density-adjusting");
    }, 420);
  }
  scheduleVisibleEventContent();
}

function jumpToNow(behavior = "smooth") {
  const nowOffset = Math.min(Math.max((Date.now() - timelineStart) / DAY, 0), totalDays);
  const labelWidth = getTimelineLabelWidth();
  const visibleTimelineWidth = Math.max(elements.timelineScroll.clientWidth - labelWidth, 0);
  const target = nowOffset * currentDayWidth - visibleTimelineWidth / 2;
  elements.timelineScroll.scrollTo({ left: Math.max(0, target), behavior });
  elements.scrollHint.classList.add("hidden");
}

function jumpToVersion(version, behavior = "smooth") {
  const startsAt = Date.parse(version?.startsAt || "");
  if (!Number.isFinite(startsAt)) return;
  const offset = Math.min(Math.max((startsAt - timelineStart.getTime()) / DAY, 0), totalDays);
  const target = offset * currentDayWidth;
  elements.timelineScroll.scrollTo({ left: Math.max(0, target), behavior });
  elements.scrollHint.classList.add("hidden");
}

function setupDragScroll() {
  let pointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  elements.timelineScroll.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("button")) return;
    pointerDown = true;
    startX = event.clientX;
    startScrollLeft = elements.timelineScroll.scrollLeft;
    elements.timelineScroll.classList.add("dragging");
    elements.timelineScroll.setPointerCapture(event.pointerId);
  });
  elements.timelineScroll.addEventListener("pointermove", (event) => {
    if (!pointerDown) return;
    elements.timelineScroll.scrollLeft = startScrollLeft - (event.clientX - startX);
  });
  const stopDragging = () => {
    pointerDown = false;
    elements.timelineScroll.classList.remove("dragging");
  };
  elements.timelineScroll.addEventListener("pointerup", stopDragging);
  elements.timelineScroll.addEventListener("pointercancel", stopDragging);

  let resizeFrame = 0;
  const refreshTimelineViewport = () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      scheduleVisibleEventContent();
      updatePinnedVersionFlags();
      updateArsenalViewportLayout();
    });
  };
  window.addEventListener("resize", refreshTimelineViewport, { passive: true });
}

function setupTheme() {
  const saved = localStorage.getItem("endfield-calendar-theme");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && preferredDark)) {
    document.documentElement.dataset.theme = "dark";
  }
  document.querySelector("#themeToggle").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("endfield-calendar-theme", nextTheme);
  });
}

function setupMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const revealTargets = document.querySelectorAll(".overview, .calendar-section, .agenda-section, .notes");
  revealTargets.forEach((target) => target.classList.add("reveal-ready"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => observer.observe(target));

  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    document.documentElement.style.setProperty("--pointer-x", `${x}px`);
    document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    document.documentElement.style.setProperty("--pointer-back-x", `${x * -0.45}px`);
    document.documentElement.style.setProperty("--pointer-back-y", `${y * -0.45}px`);
  }, { passive: true });
}

function cleanDatabasePoolName(value) {
  return String(value || "")
    .replace(/\s*（前瞻(?:，[^）]*)?）\s*$/u, "")
    .replace(/^「|」$/gu, "")
    .trim();
}

function formatDatabasePoolTitle(event, poolName) {
  const name = cleanDatabasePoolName(poolName);
  if (!name) return event.title;
  return event.category === "operator" ? `「${name}」特许寻访` : `「${name}」`;
}

function resolveMainSiteAssetUrl(value) {
  const source = String(value || "").trim();
  if (!source) return null;
  try {
    return new URL(source, MAIN_SITE_STATS_API).href;
  } catch {
    return null;
  }
}

function normalizePoolLookupKey(value) {
  return String(value || "").trim().toLocaleLowerCase("zh-CN");
}

function legacyPoolSequenceKey(poolId) {
  return String(poolId || "")
    .replace(/^(?:special|joint|weaponbox|weponbox)_/iu, "")
    .replace(/^manual_(?:limited|weapon)_pool_/iu, "manual_")
    .trim();
}

function isLegacyWeaponPool(pool) {
  return /(?:weapon|wepon|武器|申领)/iu.test(
    `${pool?.type || ""} ${pool?.id || pool?.poolId || ""} ${pool?.name || ""}`,
  );
}

function buildLegacyPoolCatalog(poolRows, characterRows) {
  const characterLookup = new Map();
  (Array.isArray(characterRows) ? characterRows : [])
    .forEach((character) => {
      [character.id, character.name, ...(Array.isArray(character.aliases) ? character.aliases : [])]
        .forEach((key) => {
          const normalized = normalizePoolLookupKey(key);
          if (normalized && !characterLookup.has(normalized)) characterLookup.set(normalized, character);
        });
    });

  const normalizedPools = (Array.isArray(poolRows) ? poolRows : [])
    .map((pool) => ({
      poolId: pool.id || pool.poolId,
      name: pool.name,
      type: isLegacyWeaponPool(pool) ? "arsenal" : "operator",
      startsAt: pool.start_time || pool.startsAt,
      endsAt: pool.end_time || pool.endsAt,
      bannerUrl: pool.banner_url || pool.bannerUrl || null,
      upCharacter: pool.up_character || pool.upCharacter || null,
      description: pool.description || null,
      featuredCharacters: Array.isArray(pool.featured_characters)
        ? pool.featured_characters
        : Array.isArray(pool.featuredCharacters)
          ? pool.featuredCharacters
          : [],
    }))
    .filter((pool) => pool.poolId && pool.name && pool.startsAt);

  const operatorPools = normalizedPools.filter((pool) => pool.type === "operator");
  const operatorCharacter = new Map();
  const directArtwork = new Map();
  normalizedPools.forEach((pool) => {
    const item = characterLookup.get(normalizePoolLookupKey(pool.upCharacter))
      || pool.featuredCharacters
        .map((value) => characterLookup.get(normalizePoolLookupKey(value)))
        .find(Boolean)
      || null;
    if (item) directArtwork.set(pool.poolId, item);
  });
  operatorPools.forEach((pool) => {
    const character = directArtwork.get(pool.poolId) || null;
    if (character) operatorCharacter.set(pool.poolId, character);
  });

  const operatorBySequence = new Map();
  operatorPools.forEach((pool) => {
    const character = operatorCharacter.get(pool.poolId);
    const sequence = legacyPoolSequenceKey(pool.poolId);
    if (character && sequence && !operatorBySequence.has(sequence)) {
      operatorBySequence.set(sequence, character);
    }
  });

  const weaponOwnerByName = new Map();
  normalizedPools.filter((pool) => pool.type === "arsenal").forEach((pool) => {
    const character = operatorBySequence.get(legacyPoolSequenceKey(pool.poolId));
    const weaponName = normalizePoolLookupKey(pool.upCharacter);
    if (character && weaponName && !weaponOwnerByName.has(weaponName)) {
      weaponOwnerByName.set(weaponName, character);
    }
  });

  return normalizedPools.map((pool) => {
    let character = directArtwork.get(pool.poolId) || operatorCharacter.get(pool.poolId) || null;
    if (!character && pool.type === "arsenal") {
      character = weaponOwnerByName.get(normalizePoolLookupKey(pool.upCharacter))
        || operatorBySequence.get(legacyPoolSequenceKey(pool.poolId))
        || operatorPools
          .map((candidate) => ({
            candidate,
            distance: Math.abs(Date.parse(candidate.startsAt) - Date.parse(pool.startsAt)),
          }))
          .filter(({ distance }) => Number.isFinite(distance) && distance <= 36 * 60 * 60 * 1000)
          .sort((left, right) => left.distance - right.distance)
          .map(({ candidate }) => operatorCharacter.get(candidate.poolId))
          .find(Boolean)
        || null;
    }
    return {
      ...pool,
      backgroundCharacter: character?.name || null,
      backgroundType: character?.type || null,
      backgroundUrl: character?.avatar_url || character?.avatarUrl || null,
    };
  });
}

function poolOverlapsVersion(pool, version) {
  const poolStart = Date.parse(pool.startsAt || "");
  const poolEnd = Date.parse(pool.endsAt || "");
  const versionStart = Date.parse(version.startsAt || "");
  const versionEnd = Date.parse(version.endsAt || "");
  return Number.isFinite(poolStart) && Number.isFinite(versionStart)
    && (!Number.isFinite(versionEnd) || poolStart < versionEnd)
    && (!Number.isFinite(poolEnd) || poolEnd > versionStart);
}

function applyLegacyCatalogToVersions(poolRows, characterRows) {
  const catalog = buildLegacyPoolCatalog(poolRows, characterRows);
  const selectedVersionKey = currentVersion.versionKey;
  versions = versions.map((version) => {
    const pools = catalog.filter((pool) => poolOverlapsVersion(pool, version));
    return {
      ...version,
      pools,
      poolNames: Object.fromEntries(pools.map((pool) => [pool.poolId, pool.name])),
    };
  });
  return renderSeamlessCalendar(selectedVersionKey, { scroll: false });
}

function poolToEvent(pool) {
  const category = pool.type === "arsenal" ? "arsenal" : "operator";
  const name = cleanDatabasePoolName(pool.name);
  return {
    id: `pool-${pool.poolId}`,
    poolId: pool.poolId,
    category,
    title: category === "operator" ? `「${name}」特许寻访` : `「${name}」`,
    start: pool.startsAt,
    end: pool.endsAt,
    color: category === "operator" ? "#43aebc" : "#8f4bd6",
    symbol: category === "operator" ? "访" : "武",
    visual: category,
    image: resolveMainSiteAssetUrl(pool.backgroundUrl || pool.bannerUrl),
    backgroundCharacter: pool.backgroundCharacter || null,
    description: pool.description || `${name}卡池日程，由主站卡池数据库自动载入。`,
    sourceNote: "开始与结束时间来自主站卡池数据库；跨版本部分会按当前版本边界裁切。",
  };
}

function buildEventsForVersion(version) {
  const remoteEvents = Array.isArray(version?.content?.events) ? version.content.events : [];
  const localEvents = version.versionKey === fallbackVersion.versionKey ? rawEvents : [];
  const localById = new Map(localEvents.map((event) => [event.id, event]));
  const remoteIds = new Set(remoteEvents.map((event) => event.id));
  const mergedEvents = remoteEvents.map((remoteEvent) => ({
    ...(localById.get(remoteEvent.id) || {}),
    ...remoteEvent,
  }));
  localEvents.forEach((localEvent) => {
    if (!remoteIds.has(localEvent.id)) mergedEvents.push(localEvent);
  });

  const bindings = version.poolBindings && typeof version.poolBindings === "object"
    ? version.poolBindings
    : {};
  const pools = Array.isArray(version.pools) ? version.pools : [];
  const poolsById = new Map(pools.map((pool) => [pool.poolId, pool]));
  const representedPoolIds = new Set();
  const enrichedEvents = mergedEvents.map((event) => {
    const poolId = bindings[event.id] || event.poolId || null;
    const pool = poolId ? poolsById.get(poolId) : null;
    if (poolId) representedPoolIds.add(poolId);
    if (!pool) return { ...event, poolId };
    return {
      ...event,
      poolId,
      title: formatDatabasePoolTitle(event, pool.name),
      image: resolveMainSiteAssetUrl(pool.backgroundUrl || pool.bannerUrl) || event.image || null,
      backgroundCharacter: pool.backgroundCharacter || event.backgroundCharacter || null,
      backgroundType: pool.backgroundType || event.backgroundType || null,
      start: event.start || pool.startsAt,
      end: event.end === undefined ? pool.endsAt : event.end,
      databasePoolName: pool.name,
    };
  });

  pools.forEach((pool) => {
    if (!representedPoolIds.has(pool.poolId)) enrichedEvents.push(poolToEvent(pool));
  });

  const versionStart = Date.parse(version.startsAt || "");
  const versionEnd = Date.parse(version.endsAt || "");
  return normalizeEvents(enrichedEvents).filter((event) => {
    const eventStart = event.startDate.getTime();
    const eventEnd = event.endDate?.getTime();
    return (!Number.isFinite(versionEnd) || eventStart < versionEnd)
      && (!Number.isFinite(eventEnd) || !Number.isFinite(versionStart) || eventEnd > versionStart);
  });
}

function buildSeamlessEvents() {
  const mergedByKey = new Map();
  versions.forEach((version) => {
    buildEventsForVersion(version).forEach((event) => {
      const key = event.poolId ? `pool:${event.poolId}` : `event:${version.versionKey}:${event.id}`;
      const candidate = { ...event, versionKey: version.versionKey, lane: undefined };
      const existing = mergedByKey.get(key);
      if (!existing) {
        mergedByKey.set(key, candidate);
        return;
      }

      const candidateIsCurated = !String(candidate.id || "").startsWith("pool-");
      const existingIsCurated = !String(existing.id || "").startsWith("pool-");
      const primary = candidateIsCurated && !existingIsCurated ? candidate : existing;
      const secondary = primary === candidate ? existing : candidate;
      mergedByKey.set(key, {
        ...secondary,
        ...primary,
        image: primary.image || secondary.image || null,
        backgroundCharacter: primary.backgroundCharacter || secondary.backgroundCharacter || null,
        backgroundType: primary.backgroundType || secondary.backgroundType || null,
        lane: undefined,
      });
    });
  });

  return normalizeEvents([...mergedByKey.values()]);
}

function floorBeijingDay(timestamp) {
  const shifted = new Date(timestamp + 8 * 3_600_000);
  return Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  ) - 8 * 3_600_000;
}

function ceilBeijingDay(timestamp) {
  const floor = floorBeijingDay(timestamp);
  return timestamp === floor ? floor : floor + DAY;
}

function setSeamlessTimelineBounds() {
  const starts = versions.map((version) => Date.parse(version.startsAt || "")).filter(Number.isFinite);
  const ends = versions.map((version) => Date.parse(version.endsAt || "")).filter(Number.isFinite);
  timelineStart = starts.length > 0
    ? new Date(floorBeijingDay(Math.min(...starts)))
    : new Date(fallbackVersion.startsAt);
  timelineEnd = ends.length > 0
    ? new Date(ceilBeijingDay(Math.max(...ends)))
    : new Date(fallbackVersion.endsAt);
  if (timelineEnd <= timelineStart) timelineEnd = new Date(timelineStart.getTime() + 42 * DAY);
  totalDays = Math.max(1, Math.ceil((timelineEnd - timelineStart) / DAY));
}

function renderVersionMarkers() {
  elements.versionAxis.innerHTML = "";
  elements.versionMarkers.innerHTML = "";
  versions.forEach((version, index) => {
    const start = Date.parse(version.startsAt || "");
    if (!Number.isFinite(start)) return;
    const nextStart = Date.parse(versions[index + 1]?.startsAt || "");
    const configuredEnd = Date.parse(version.endsAt || "");
    const end = Number.isFinite(nextStart)
      ? nextStart
      : Number.isFinite(configuredEnd)
        ? configuredEnd
        : timelineEnd.getTime();
    const startOffset = (start - timelineStart.getTime()) / DAY;
    const endOffset = Math.max((end - timelineStart.getTime()) / DAY, startOffset);
    const marker = document.createElement("div");
    marker.className = `version-marker${version.versionKey === currentVersion.versionKey ? " active" : ""}`;
    marker.dataset.versionKey = version.versionKey;
    marker.style.setProperty("--version-offset", startOffset);
    marker.style.setProperty("--version-index", index);
    marker.style.setProperty("--version-delay", `${index * 65}ms`);

    const flag = document.createElement("div");
    flag.className = `version-flag${version.versionKey === currentVersion.versionKey ? " active" : ""}`;
    flag.dataset.versionKey = version.versionKey;
    flag.dataset.startOffset = String(startOffset);
    flag.dataset.endOffset = String(endOffset);
    flag.style.setProperty("--version-offset", startOffset);
    flag.style.setProperty("--version-index", index);
    flag.style.setProperty("--version-delay", `${index * 65}ms`);
    const number = document.createElement("span");
    number.className = "version-flag-number";
    number.textContent = `VER.${String(version.versionNumber || index + 1).padStart(2, "0")}`;
    const title = document.createElement("strong");
    title.textContent = version.title || "未命名版本";
    const count = document.createElement("span");
    count.className = "version-flag-count";
    count.textContent = `${Array.isArray(version.pools) ? version.pools.length : 0} 卡池`;
    const tail = document.createElement("i");
    tail.setAttribute("aria-hidden", "true");
    flag.append(number, title, count, tail);
    elements.versionAxis.appendChild(flag);
    elements.versionMarkers.appendChild(marker);
  });
  window.requestAnimationFrame(updatePinnedVersionFlags);
}

function renderVersionSwitcher() {
  elements.versionSwitcher.innerHTML = "";
  versions.forEach((version) => {
    const button = document.createElement("button");
    const selected = version.versionKey === currentVersion.versionKey;
    button.type = "button";
    button.role = "tab";
    button.className = `version-tab${selected ? " active" : ""}`;
    button.setAttribute("aria-selected", String(selected));
    const number = document.createElement("span");
    number.textContent = `VERSION ${version.versionNumber || "?"}`;
    const title = document.createElement("strong");
    title.textContent = version.title || "未命名版本";
    button.append(number, title);
    button.addEventListener("click", () => selectVersion(version.versionKey));
    elements.versionSwitcher.appendChild(button);
  });
}

function updateVersionMetadata() {
  const title = currentVersion.title || "未命名版本";
  const versionNumber = currentVersion.versionNumber || "?";
  const selectedStart = new Date(currentVersion.startsAt || timelineStart);
  const selectedEnd = new Date(currentVersion.endsAt || timelineEnd);
  const startParts = getBeijingParts(selectedStart);
  const endParts = getBeijingParts(selectedEnd);
  const activitiesComplete = currentVersion.content?.activitiesComplete !== false;

  elements.versionNumber.textContent = `VERSION ${versionNumber}`;
  elements.versionTitle.textContent = `「${title}」`;
  elements.versionStatusLabel.textContent = activitiesComplete ? "版本内容 · 实时日历" : "历史版本 · 活动待补充";
  elements.versionLiveLabel.textContent = `${startParts.year}.${startParts.month}.${startParts.day} — ${endParts.year}.${endParts.month}.${endParts.day}`;
  elements.versionEndDate.textContent = `${endParts.month}.${endParts.day}`;
  elements.versionEndTime.textContent = `${endParts.year} · ${endParts.hour}:${endParts.minute}`;
  elements.heroWatermark.textContent = String(currentVersion.versionKey || title).replace(/[^a-z0-9]+/giu, " ").trim().toUpperCase();
  elements.activityNotice.hidden = activitiesComplete;
  elements.activityNotice.querySelector("strong").textContent = "历史活动整理中";
  elements.sourceCredit.hidden = currentVersion.versionKey !== fallbackVersion.versionKey;
  elements.calendarNote.textContent = activitiesComplete
    ? `页面依据「${title}」版本数据库与已核对活动资料整理；若游戏内时间与页面不一致，请以官方公告和游戏内实际时间为准。`
    : `「${title}」历史版本的角色与武器卡池已从主站数据库载入，其他活动仍待补充；跨版本卡池会在无缝总轴中连续展示。`;
  document.title = `「${title}」Version ${versionNumber} 实时日历`;
  document.querySelector('meta[name="description"]').content = `《明日方舟：终末地》Version ${versionNumber}「${title}」活动实时日历与时间轴`;
}

function selectVersion(versionKey, { scroll = true } = {}) {
  const nextVersion = versions.find((version) => version.versionKey === versionKey);
  if (!nextVersion) return false;
  currentVersion = nextVersion;
  lastAgendaSignature = "";
  updateVersionMetadata();
  renderVersionSwitcher();
  renderVersionMarkers();
  updateLiveState();
  if (scroll) window.setTimeout(() => jumpToVersion(currentVersion, "smooth"), 0);
  return true;
}

function renderSeamlessCalendar(selectedVersionKey, { scroll = false } = {}) {
  setSeamlessTimelineBounds();
  events = buildSeamlessEvents();
  activeFilter = "all";
  lastAgendaSignature = "";
  elements.timeline.style.setProperty("--days", totalDays);
  elements.timeline.style.setProperty("--day-width", `${currentDayWidth}px`);
  renderDateAxis();
  renderFilters();
  renderTimeline();
  return selectVersion(selectedVersionKey, { scroll });
}

function setSyncState(text, state) {
  const syncState = document.querySelector("#syncState");
  if (!syncState) return;
  syncState.dataset.state = state;
  const label = syncState.querySelector("span");
  if (label) label.textContent = text;
}

async function fetchMainSiteStats(type) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);
  try {
    const url = new URL(MAIN_SITE_STATS_API);
    url.searchParams.set("type", type);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`主站数据接口返回 ${response.status}`);
    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function applyPoolNames(poolNames) {
  if (!poolNames || typeof poolNames !== "object") return false;
  let changed = false;
  events = events.map((event) => {
    const databaseName = event.poolId ? poolNames[event.poolId] : null;
    if (!databaseName) return event;
    const title = formatDatabasePoolTitle(event, databaseName);
    changed ||= title !== event.title;
    return { ...event, title, databasePoolName: databaseName };
  });
  return changed;
}

function applyPoolCatalog(poolRows) {
  if (!Array.isArray(poolRows)) return false;
  const poolsById = new Map(poolRows.map((pool) => [pool.id || pool.poolId, pool]));
  let changed = false;
  events = events.map((event) => {
    const pool = event.poolId ? poolsById.get(event.poolId) : null;
    if (!pool) return event;
    const title = formatDatabasePoolTitle(event, pool.name);
    const image = resolveMainSiteAssetUrl(
      pool.backgroundUrl || pool.background_url || pool.bannerUrl || pool.banner_url,
    ) || event.image || null;
    changed ||= title !== event.title || image !== event.image;
    return { ...event, title, image, databasePoolName: pool.name };
  });
  return changed;
}

function applyVersionSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  const hasMultiVersionPayload = Array.isArray(snapshot?.versions) && snapshot.versions.length > 1;
  const remoteVersions = hasMultiVersionPayload
    ? snapshot.versions
    : fallbackVersions.map((version) => {
      const matchesSnapshot = snapshot?.versionKey === version.versionKey
        || (snapshot?.versionKey === "xiangyuan-2026" && version.versionKey === "version-5");
      return matchesSnapshot
        ? {
          ...version,
          ...snapshot,
          versionKey: version.versionKey,
          versionNumber: snapshot.versionNumber || version.versionNumber,
          title: snapshot.title || version.title,
          startsAt: snapshot.startsAt || version.startsAt,
          endsAt: snapshot.endsAt || version.endsAt,
        }
        : version;
    });
  versions = remoteVersions
    .filter((version) => version?.versionKey && version?.startsAt)
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
  if (versions.length === 0) return false;

  const requestedVersion = new URLSearchParams(window.location.search).get("version");
  const now = Date.now();
  const timeMatchedVersion = versions.find((version) => {
    const startsAt = Date.parse(version.startsAt || "");
    const endsAt = Date.parse(version.endsAt || "");
    return Number.isFinite(startsAt) && startsAt <= now
      && (!Number.isFinite(endsAt) || now < endsAt);
  });
  const selectedVersion = versions.find((version) => (
    version.versionKey === requestedVersion || version.versionNumber === requestedVersion
  )) || versions.find((version) => version.versionKey === snapshot.activeVersionKey)
    || versions.find((version) => version.versionKey === snapshot.versionKey)
    || timeMatchedVersion
    || versions[versions.length - 1];
  return renderSeamlessCalendar(selectedVersion.versionKey, { scroll: false });
}

function redrawAfterDatabaseSync() {
  lastAgendaSignature = "";
  renderTimeline();
  updateLiveState();
}

async function loadMainSiteData() {
  let snapshot = null;
  let hasMultiVersionPayload = false;
  try {
    const snapshotResult = await fetchMainSiteStats("version_calendar");
    snapshot = snapshotResult?.data?.versionCalendar;
    hasMultiVersionPayload = Array.isArray(snapshot?.versions) && snapshot.versions.length > 1;
    if (applyVersionSnapshot(snapshot)) {
      redrawAfterDatabaseSync();
      setSyncState(hasMultiVersionPayload ? "主站版本数据库已同步" : "正在补充历史版本", "synced");
      document.querySelector("#updatedAt").textContent = snapshot.updatedAt
        ? `${fullDateFormatter.format(new Date(snapshot.updatedAt))} · 数据库修订 ${snapshot.revision}`
        : `数据库修订 ${snapshot.revision}`;
      if (hasMultiVersionPayload) return;
    }
  } catch {
    // 新接口尚未部署或快照表尚未迁移时，继续使用现有公开卡池目录。
  }

  try {
    const catalogResult = await fetchMainSiteStats("pool_catalog");
    const poolRows = Array.isArray(catalogResult?.data?.pools) ? catalogResult.data.pools : [];
    let characterRows = [];
    try {
      const characterResult = await fetchMainSiteStats("characters");
      characterRows = Array.isArray(characterResult?.data?.characters)
        ? characterResult.data.characters
        : [];
    } catch {
      // 角色图读取失败时仍保留历史卡池时间轴和现有色块。
    }
    const poolNames = Object.fromEntries(
      poolRows
        .filter((pool) => pool?.id && pool?.name)
        .map((pool) => [pool.id, pool.name]),
    );
    applyPoolNames(poolNames);
    applyPoolCatalog(poolRows);
    applyLegacyCatalogToVersions(poolRows, characterRows);
    redrawAfterDatabaseSync();
    setSyncState("历史版本与卡池已同步", "synced");
  } catch {
    setSyncState("本地备份数据", "fallback");
  }
}

function init() {
  document.querySelector("#updatedAt").textContent = "2026-07-11 · 日程二次核对";
  renderSeamlessCalendar(fallbackVersion.versionKey, { scroll: false });
  setupDragScroll();
  setupTheme();
  setupMotion();

  elements.zoomRange.addEventListener("input", (event) => {
    setTimelineDensity(Number(event.target.value));
  });
  elements.jumpNow.addEventListener("click", () => jumpToNow());
  elements.dialogClose.addEventListener("click", () => elements.eventDialog.close());
  elements.eventDialog.addEventListener("click", (event) => {
    if (event.target === elements.eventDialog) elements.eventDialog.close();
  });
  elements.timelineScroll.addEventListener("scroll", () => {
    if (elements.timelineScroll.scrollLeft > 30) elements.scrollHint.classList.add("hidden");
    scheduleVisibleEventContent();
  }, { passive: true });
  elements.timelineScroll.addEventListener("wheel", (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const rect = elements.timelineScroll.getBoundingClientRect();
    const anchor = event.clientX - rect.left;
    const direction = event.deltaY > 0 ? -1 : 1;
    const step = Number(elements.zoomRange.step) || 2;
    setTimelineDensity(currentDayWidth + direction * step, anchor);
  }, { passive: false });
  window.addEventListener("resize", scheduleVisibleEventContent, { passive: true });

  window.setTimeout(() => jumpToVersion(currentVersion, "auto"), 100);
  window.setInterval(updateLiveState, 1000);
  void loadMainSiteData();
}

init();
