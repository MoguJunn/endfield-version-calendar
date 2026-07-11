import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = ["index.html", "styles.css", "app.js", "package.json", "assets/events/README.md"];
const failures = [];

for (const file of requiredFiles) {
  try {
    await access(path.join(root, file));
  } catch {
    failures.push(`缺少文件：${file}`);
  }
}

const [html, css, js] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "app.js"), "utf8"),
]);

const assertions = [
  [html.includes('id="timeline"'), "页面缺少时间轴容器"],
  [html.includes('id="countdown"'), "页面缺少实时倒计时"],
  [html.includes('id="eventDialog"'), "页面缺少活动详情弹窗"],
  [html.includes('name="viewport"'), "页面缺少移动端 viewport"],
  [html.includes('https://www.bilibili.com/opus/1223774493520953353'), "页面缺少日历来源链接"],
  [html.includes("罗德岛蜜饼工坊"), "页面缺少日历来源致谢"],
  [css.includes("@media (max-width: 640px)"), "缺少移动端响应式样式"],
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
  [js.includes("formatDatabasePoolTitle"), "缺少数据库卡池名称应用逻辑"],
  [js.includes("updateCountdownDisplay"), "缺少倒计时变化动效控制"],
  [css.includes("@keyframes eventReveal"), "缺少时间轴入场动效"],
  [css.includes("@keyframes activeBarFlow"), "缺少进行中活动动效"],
  [css.includes("@keyframes countdownTick"), "缺少倒计时数字动效"],
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
