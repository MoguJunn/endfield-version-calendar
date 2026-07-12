import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "calendar-config.js",
  "package.json",
  "scripts/build-font-subsets.mjs",
  "assets/events/README.md",
  "assets/fonts/harmony/sc-medium/result.css",
  "assets/fonts/harmony/sc-bold/result.css",
  "assets/fonts/novecento/Novecento-Wide-Bold-Tabular.otf",
  "assets/events/Version 5/北观禁土.png",
  "assets/events/Version 5/如同流星飞越边界.png",
  "assets/events/Version 5/宏运连连乐.png",
  "assets/events/Version 5/密境行者.png",
  "assets/events/Version 5/影拓丰碑+丰碑留名.png",
  "assets/events/Version 5/战争回想（两赛季相同）.png",
  "assets/events/Version 5/根脉奇境.png",
  "assets/events/Version 5/炽燃！竞技大会！.png",
  "assets/events/Version 5/理智补给通用图.png",
  "assets/events/Version 5/相伴赠礼.png",
];
const failures = [];

for (const file of requiredFiles) {
  try {
    await access(path.join(root, file));
  } catch {
    failures.push(`缺少文件：${file}`);
  }
}

const [html, css, js, siteConfig, fontBuildScript, vercelConfig, verifyWorkflow] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
  readFile(path.join(root, "calendar-config.js"), "utf8"),
  readFile(path.join(root, "scripts/build-font-subsets.mjs"), "utf8"),
  readFile(path.join(root, "vercel.json"), "utf8"),
  readFile(path.join(root, ".github/workflows/verify.yml"), "utf8"),
]);

const assertions = [
  [html.includes('id="timeline"'), "页面缺少时间轴容器"],
  [html.includes('id="countdown"'), "页面缺少实时倒计时"],
  [html.includes('id="eventDialog"'), "页面缺少活动详情弹窗"],
  [html.includes('name="viewport"'), "页面缺少移动端 viewport"],
  [!html.includes("fonts.googleapis.com"), "页面仍依赖 Google 字体"],
  [html.includes('https://www.bilibili.com/opus/1223774493520953353'), "页面缺少日历来源链接"],
  [html.includes("罗德岛蜜饼工坊"), "页面缺少日历来源致谢"],
  [html.includes('href="https://ef-gacha.mogujun.icu"'), "页面缺少抽卡主站链接"],
  [html.includes('href="https://github.com/MoguJunn/endfield-version-calendar"'), "页面缺少 GitHub 仓库链接"],
  [html.includes('id="versionNumber"'), "页面版本号未接入动态节点"],
  [html.includes('id="versionTitle"'), "页面版本标题未接入动态节点"],
  [html.includes('id="versionSwitcher"'), "页面缺少多版本切换器"],
  [html.includes('id="versionMarkers"'), "页面缺少版本旗帜分割线容器"],
  [html.includes('id="versionAxis"'), "页面缺少独立版本标题轨道"],
  [html.includes('id="zoomShortcut"') && html.includes("Ctrl") && html.includes("滚轮"), "时间轴密度条缺少快捷操作提示"],
  [html.includes('id="activityNotice"'), "页面缺少活动待补充提示"],
  [html.includes('id="versionEndDate"') && html.includes('id="versionEndTime"'), "版本收束时间未接入动态节点"],
  [fontBuildScript.includes("FONT_BUILD_TIMEOUT_MS") && fontBuildScript.includes("process.exit(0)"), "字体构建缺少超时或 FFI 退出保护"],
  [html.includes('id="footerRecords"') && html.includes("calendar-config.js"), "页尾缺少可选备案配置入口"],
  [siteConfig.includes("icpNumber") && siteConfig.includes("policeNumber"), "备案配置缺少 ICP 或公安备案选项"],
  [js.includes("applyFooterRecords") && js.includes("CALENDAR_SITE_CONFIG"), "备案信息未接入可选显示逻辑"],
  [css.includes("grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)") && css.includes(".footer-records"), "页尾主信息与备案区域布局不完整"],
  [html.includes("project-link-main") && html.includes("project-link-github"), "主站或 GitHub 入口缺少醒目样式标识"],
  [css.includes("@media (max-width: 640px)"), "缺少移动端响应式样式"],
  [css.includes("touch-action: pan-x") && css.includes("overscroll-behavior-x: contain"), "移动端时间轴缺少横向触控滚动约束"],
  [css.includes("max-height: calc(100dvh - 24px)"), "移动端活动弹窗缺少视口高度约束"],
  [css.includes("grid-template-columns: auto minmax(0, 1fr)") && css.includes("min-width: 0"), "移动端顶部导航缺少窄屏收缩布局"],
  [js.includes('window.addEventListener("resize", refreshTimelineViewport'), "时间轴未在屏幕尺寸变化后重算可见内容"],
  [verifyWorkflow.includes("run: npm ci"), "GitHub Verify 工作流缺少依赖安装步骤"],
  [vercelConfig.includes('"CDN-Cache-Control"') && vercelConfig.includes('"no-store"'), "Vercel 缺少页面防陈旧缓存策略"],
  [css.includes("prefers-reduced-motion"), "缺少动画降级支持"],
  [js.includes('timeZone: "Asia/Shanghai"'), "实时计算未固定为北京时间"],
  [js.includes('window.setInterval(updateLiveState, 1000)'), "实时状态没有按秒更新"],
  [js.includes('category: "operator"'), "缺少干员寻访数据"],
  [js.includes('category: "arsenal"'), "缺少武库申领数据"],
  [js.includes('category: "permanent"'), "缺少常驻活动数据"],
  [js.includes('category: "limited"'), "缺少限时活动数据"],
  [js.includes("2026-09-02T06:00:00+08:00"), "缺少版本收束时间"],
  [js.includes('title: "「理智补给」第一期"'), "缺少第一期理智补给"],
  [js.includes('title: "「理智补给」第二期"'), "缺少第二期理智补给"],
  [js.includes('title: "「临渊望北」特许寻访"'), "首期特许寻访名称不正确"],
  [js.includes('title: "「军列申领」"'), "军列申领名称不正确"],
  [js.includes('title: "「绛结申领」"'), "绛结申领名称不正确"],
  [js.includes('title: "「明曜申领」"'), "明曜申领名称不正确"],
  [js.includes('title: "「如同流星飞越边界」梨诺叙事活动"'), "梨诺叙事活动名称不正确"],
  [js.includes('title: "「影拓丰碑」新系列「山中见犼」"'), "影拓丰碑系列名称不正确"],
  [js.includes('title: "「密境行者」新空间组「六方巧境」"'), "密境行者空间组名称不正确"],
  [js.includes('title: "「北观禁土」引入活动"'), "北观禁土名称不正确"],
  [js.includes('id: "war-echo-1"') && js.includes('start: "2026-07-16T12:00:00+08:00"'), "追忆赛季开始时间不正确"],
  [js.includes('title: "「战争回响」新赛季「谵妄赛季」"'), "战争回响第二赛季名称不正确"],
  [js.includes('id: "secret-realm-update"') && js.includes('start: "2026-08-26T04:00:00+08:00"') && js.includes("milestone: true"), "密境行者内容更新节点不正确"],
  [js.includes('id: "northland"') && js.includes('symbol: "禁"'), "北观禁土图示字不正确"],
  [js.includes('related: "「踏渊北眺」签到 & 作战演练"'), "缺少首期配套签到与作战演练"],
  [js.includes('related: "「明耀晨星」签到 & 作战演练"'), "缺少后期配套签到与作战演练"],
  [js.includes("startUnknown: true"), "未正确表达预热签到开始时间待公布"],
  [js.includes("event.image"), "缺少真实活动图示接入能力"],
  [js.includes('fetchMainSiteStats("version_calendar")'), "缺少主站版本数据库读取"],
  [js.includes('fetchMainSiteStats("pool_catalog")'), "缺少主站卡池目录降级读取"],
  [js.includes('fetchMainSiteStats("characters")'), "缺少主站角色图片降级读取"],
  [js.includes("formatDatabasePoolTitle"), "缺少数据库卡池名称应用逻辑"],
  [js.includes("snapshot?.versions"), "缺少主站多版本快照读取"],
  [js.includes("pool.bannerUrl"), "缺少数据库卡池背景图映射"],
  [js.includes("pool.backgroundUrl"), "缺少 UP 角色图片背景映射"],
  [js.includes("poolToEvent"), "缺少历史卡池时间轴事件生成"],
  [js.includes("poolColorPalettes") && js.includes("poolColorTheme") && js.includes("stableStringHash"), "历史卡池缺少稳定的差异化配色"],
  [js.includes("fallbackVersions"), "缺少旧接口下的多版本备份"],
  [js.includes("activitiesComplete"), "缺少旧版本活动完整度处理"],
  [js.includes("selectVersion"), "缺少版本切换与时间轴分段逻辑"],
  [js.includes("buildSeamlessEvents"), "缺少跨版本无缝时间轴事件合并"],
  [js.includes("renderVersionMarkers"), "缺少主站式版本旗帜分割线"],
  [js.includes("jumpToVersion"), "版本标签未接入旗帜定位"],
  [js.includes("floorBeijingDay") && js.includes("ceilBeijingDay"), "时间轴日期未按北京时间零点对齐"],
  [js.includes("updateVisibleEventContent"), "日程文字和背景图未保持在可见范围"],
  [js.includes("eventDurationText") && js.includes('class="event-duration"'), "明确截止日程缺少持续时间标注"],
  [js.includes("eventRemainingText") && js.includes('class="event-remaining"'), "进行中日程缺少剩余时间标注"],
  [js.includes('class="date-number"'), "日期未使用月日组合样式"],
  [js.includes('"pool-art"'), "角色与武器透明图未使用独立前景样式"],
  [js.includes("updatePinnedVersionFlags"), "版本旗帜未固定在当前版本可见区左侧"],
  [js.includes("setTimelineDensity") && js.includes('addEventListener("wheel"'), "时间轴缺少中心锚定缩放或 Ctrl 滚轮密度调节"],
  [js.includes('classList.add("density-adjusting")'), "时间轴密度调节缺少状态动效反馈"],
  [js.includes("./assets/events/Version%205/相伴赠礼.png"), "Version 5 活动图片未接入"],
  [js.includes("let timelineStart") && js.includes("let timelineEnd"), "时间轴边界仍未按版本动态切换"],
  [js.includes("updateCountdownDisplay"), "缺少倒计时变化动效控制"],
  [css.includes("@keyframes eventReveal"), "缺少时间轴入场动效"],
  [css.includes("@keyframes activeBarFlow"), "缺少进行中活动动效"],
  [css.includes("@keyframes countdownTick"), "缺少倒计时数字动效"],
  [css.includes(".version-flag") && css.includes("repeating-linear-gradient(135deg"), "缺少主站式斜纹旗帜样式"],
  [css.includes(".version-axis") && css.includes("height: 44px"), "版本名称未使用独立标题行"],
  [css.includes('Harmony Sans App') && css.includes('assets/fonts/harmony/sc-medium/result.css'), "全站未接入主站同款 HarmonyOS 字体"],
  [css.includes("Novecento Sans Wide Tabular App") && css.includes("Novecento-Wide-Bold-Tabular.otf"), "倒计时未接入主站特殊数字字体"],
  [css.includes(".event-duration") && css.includes(".event-remaining"), "日程持续时间或剩余时间样式缺失"],
  [css.includes(".zoom-shortcut") && css.includes(".zoom-shortcut kbd"), "密度快捷键提示缺少可视样式"],
  [css.includes("@keyframes versionFlagReveal") && css.includes("@keyframes eventBadgeReveal"), "版本旗帜或时间标签缺少动效"],
  [css.includes("@keyframes dateCellReveal") && css.includes("@keyframes densityFrameFeedback"), "日期轴或密度调节缺少动效"],
  [js.includes("timelineIntroPlayed") && js.includes("play-timeline-intro"), "时间轴入场动效缺少单次播放保护"],
  [js.includes("eventTrackType") && js.includes("laneOffset"), "活动内部分类未参与轨道排布"],
  [js.includes("updateArsenalViewportLayout") && js.includes("visibleLaneCount + 1"), "武库申领高度未按当前可见轨道动态计算"],
  [js.includes('overlayFor: "secret-realm"') && css.includes(".event-update-pin"), "密境行者内容更新未使用依附式更新标记"],
  [js.includes("visibleCategories.forEach") && !js.includes("timelineTrackMeta"), "时间轴未恢复原有大类展示"],
  [html.includes('aria-label="按活动大类筛选"'), "时间轴筛选说明未恢复为活动大类"],
];

for (const [passed, message] of assertions) {
  if (!passed) failures.push(message);
}

const syntaxCheck = spawnSync(process.execPath, ["--check", path.join(root, "app.js")], {
  encoding: "utf8",
});
if (syntaxCheck.status !== 0) {
  failures.push(`app.js 语法检查失败：${syntaxCheck.stderr.trim()}`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`站点结构检查通过：${assertions.length} 项断言，${requiredFiles.length} 个必要文件。`);
