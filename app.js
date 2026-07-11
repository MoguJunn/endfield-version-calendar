const DAY = 24 * 60 * 60 * 1000;
const MAIN_SITE_STATS_API = "https://ef-gacha.mogujun.icu/api/stats";
const timelineStart = new Date("2026-07-11T00:00:00+08:00");
const timelineEnd = new Date("2026-09-03T00:00:00+08:00");
const totalDays = Math.ceil((timelineEnd - timelineStart) / DAY);

const categories = [
  { id: "operator", name: "干员寻访", en: "OPERATOR HEADHUNTING", icon: "⌁" },
  { id: "arsenal", name: "武库申领", en: "ARSENAL ISSUE", icon: "✕" },
  { id: "permanent", name: "常驻活动", en: "PERMANENT CONTENT", icon: "▦" },
  { id: "limited", name: "限时活动", en: "LIMITED EVENTS", icon: "✦" },
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
    description: "新空间组于 8 月 19 日中午起常驻开放。",
  },
  {
    id: "secret-realm-update",
    category: "permanent",
    title: "「密境行者」活动内容更新",
    start: "2026-08-26T04:00:00+08:00",
    end: null,
    milestone: true,
    color: "#7181bd",
    lane: 3,
    symbol: "更",
    visual: "realm",
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

function normalizeEvents(sourceEvents) {
  return sourceEvents.map((event) => {
  const followedEvent = event.follows
    ? sourceEvents.find((candidate) => candidate.id === event.follows)
    : null;
  const start = event.start ?? followedEvent?.start;
  const end = event.end === undefined ? followedEvent?.end : event.end;
  return {
    ...event,
    start,
    end,
    startDate: new Date(start),
    endDate: end ? new Date(end) : null,
  };
  });
}

let events = normalizeEvents(rawEvents);

const elements = {
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
};

let activeFilter = "all";
let currentDayWidth = Number(elements.zoomRange.value);
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

function applyEventVisual(element, event) {
  element.dataset.visual = event.visual ?? event.category;
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
    cell.dataset.month = day === 1 ? `${month}月` : "";
    cell.innerHTML = `<span>${["日", "一", "二", "三", "四", "五", "六"][weekday]}</span>${day}`;
    cell.title = `2026年${month}月${day}日`;
    elements.dateAxis.appendChild(cell);
  }
}

function renderFilters() {
  const options = [{ id: "all", name: "全部日程" }, ...categories];
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

function renderTimeline() {
  elements.timelineBody.innerHTML = "";
  const visibleCategories = activeFilter === "all"
    ? categories
    : categories.filter((category) => category.id === activeFilter);

  visibleCategories.forEach((category, categoryIndex) => {
    const categoryEvents = events.filter((event) => event.category === category.id);
    const maxLane = Math.max(...categoryEvents.map((event) => event.lane), 0);
    const groupHeight = Math.max(128, 20 + (maxLane + 1) * 52);
    const group = document.createElement("section");
    group.className = "category-group";
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
        event.milestone
          ? visualStart + 0.58 * DAY
          : event.endDate?.getTime() ?? timelineEnd.getTime(),
        timelineEnd.getTime(),
      );
      const startOffset = (visualStart - timelineStart) / DAY;
      const duration = Math.max((visualEnd - visualStart) / DAY, 0.58);
      const button = document.createElement("button");
      button.className = `event-bar ${statusOf(event, new Date())}${event.permanent ? " permanent" : ""}${event.endLabel ? " open-ended" : ""}${event.milestone ? " milestone" : ""}`;
      button.type = "button";
      button.dataset.eventId = event.id;
      button.style.setProperty("--start", startOffset);
      button.style.setProperty("--duration", duration);
      button.style.setProperty("--lane", event.lane);
      button.style.setProperty("--event-index", eventIndex + categoryIndex * 4);
      button.style.setProperty("--event-ink", event.eventInk ?? "#fff");
      applyEventVisual(button, event);
      const relatedText = event.related ? `<em>&amp; ${event.related}</em>` : "";
      button.innerHTML = `
        <span class="event-art" aria-hidden="true"><b>${event.symbol ?? "◇"}</b></span>
        <span class="event-copy">
          <strong>${event.title} ${relatedText}</strong>
          <small>${eventStartShortText(event)}${event.milestone ? ` · ${eventEndShortText(event)}` : ` – ${eventEndShortText(event)}`}</small>
        </span>
      `;
      button.title = `${event.title}｜${statusText(event, new Date())}`;
      button.addEventListener("click", () => openEventDialog(event));
      tracks.appendChild(button);
    });

    group.append(label, tracks);
    elements.timelineBody.appendChild(group);
  });
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
    document.querySelector("#nextEventName").textContent = "本版本日程已全部结束";
    updateCountdownDisplay(0);
    document.querySelector("#nextEventAt").textContent = "期待下个版本";
  }

  updatePhase(now);
  updateNowLine(now);
  updateEventBars(now);
  renderAgenda(now, milestones);
}

function updatePhase(now) {
  const phaseLabel = document.querySelector("#phaseLabel");
  const phaseDescription = document.querySelector("#phaseDescription");
  const firstOpen = new Date("2026-07-16T12:00:00+08:00");
  const secondOpen = new Date("2026-08-09T12:00:00+08:00");
  const versionEnd = new Date("2026-09-02T06:00:00+08:00");

  if (now < firstOpen) {
    phaseLabel.textContent = "庆典预热";
    phaseDescription.textContent = `${formatRelative(firstOpen - now)}后首批内容开放`;
  } else if (now < secondOpen) {
    phaseLabel.textContent = "版本上半程";
    phaseDescription.textContent = "首期寻访与相伴庆典正在进行";
  } else if (now < versionEnd) {
    phaseLabel.textContent = "版本下半程";
    phaseDescription.textContent = "第二期寻访与根脉奇境正在进行";
  } else {
    phaseLabel.textContent = "版本已收束";
    phaseDescription.textContent = "本期限定日程已经结束";
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
    agendaGrid.innerHTML = '<article class="agenda-card empty">本版本暂无后续新增日程</article>';
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

function jumpToNow(behavior = "smooth") {
  const nowOffset = Math.min(Math.max((Date.now() - timelineStart) / DAY, 0), totalDays);
  const target = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--label-width"))
    + nowOffset * currentDayWidth
    - elements.timelineScroll.clientWidth / 2;
  elements.timelineScroll.scrollTo({ left: Math.max(0, target), behavior });
  elements.scrollHint.classList.add("hidden");
}

function setupDragScroll() {
  let pointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  elements.timelineScroll.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
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

function applyVersionSnapshot(snapshot) {
  const remoteEvents = snapshot?.content?.events;
  const poolBindings = snapshot?.poolBindings || {};
  if (!Array.isArray(remoteEvents) || remoteEvents.length === 0) return false;

  const localById = new Map(rawEvents.map((event) => [event.id, event]));
  const remoteIds = new Set(remoteEvents.map((event) => event.id));
  const mergedEvents = remoteEvents.map((remoteEvent) => {
    const localEvent = localById.get(remoteEvent.id) || {};
    return {
      ...localEvent,
      ...remoteEvent,
      poolId: poolBindings[remoteEvent.id] || remoteEvent.poolId || localEvent.poolId,
      image: localEvent.image || remoteEvent.image,
    };
  });
  rawEvents.forEach((localEvent) => {
    if (!remoteIds.has(localEvent.id)) mergedEvents.push(localEvent);
  });

  events = normalizeEvents(mergedEvents);
  applyPoolNames(snapshot.poolNames);
  return true;
}

function redrawAfterDatabaseSync() {
  lastAgendaSignature = "";
  renderTimeline();
  updateLiveState();
}

async function loadMainSiteData() {
  try {
    const snapshotResult = await fetchMainSiteStats("version_calendar");
    const snapshot = snapshotResult?.data?.versionCalendar;
    if (applyVersionSnapshot(snapshot)) {
      redrawAfterDatabaseSync();
      setSyncState("主站版本数据库已同步", "synced");
      document.querySelector("#updatedAt").textContent = snapshot.updatedAt
        ? `${fullDateFormatter.format(new Date(snapshot.updatedAt))} · 数据库修订 ${snapshot.revision}`
        : `数据库修订 ${snapshot.revision}`;
      return;
    }
  } catch {
    // 新接口尚未部署或快照表尚未迁移时，继续使用现有公开卡池目录。
  }

  try {
    const catalogResult = await fetchMainSiteStats("pool_catalog");
    const poolRows = Array.isArray(catalogResult?.data?.pools) ? catalogResult.data.pools : [];
    const poolNames = Object.fromEntries(
      poolRows
        .filter((pool) => pool?.id && pool?.name)
        .map((pool) => [pool.id, pool.name]),
    );
    applyPoolNames(poolNames);
    redrawAfterDatabaseSync();
    setSyncState("主站卡池数据库已同步", "synced");
  } catch {
    setSyncState("本地备份数据", "fallback");
  }
}

function init() {
  elements.timeline.style.setProperty("--days", totalDays);
  elements.timeline.style.setProperty("--day-width", `${currentDayWidth}px`);
  document.querySelector("#updatedAt").textContent = "2026-07-11 · 日程二次核对";
  renderDateAxis();
  renderFilters();
  renderTimeline();
  setupDragScroll();
  setupTheme();
  setupMotion();

  elements.zoomRange.addEventListener("input", (event) => {
    currentDayWidth = Number(event.target.value);
    elements.timeline.style.setProperty("--day-width", `${currentDayWidth}px`);
  });
  elements.jumpNow.addEventListener("click", () => jumpToNow());
  elements.dialogClose.addEventListener("click", () => elements.eventDialog.close());
  elements.eventDialog.addEventListener("click", (event) => {
    if (event.target === elements.eventDialog) elements.eventDialog.close();
  });
  elements.timelineScroll.addEventListener("scroll", () => {
    if (elements.timelineScroll.scrollLeft > 30) elements.scrollHint.classList.add("hidden");
  }, { passive: true });

  window.setTimeout(() => jumpToNow("auto"), 100);
  window.setInterval(updateLiveState, 1000);
  void loadMainSiteData();
}

init();
