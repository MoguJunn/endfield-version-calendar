# 日历维护说明

业务记录时点：2026-10-07。本文对应 `main` 截至 `50cb595` 的实现，公开站点为 <https://ef-cal.mogujun.icu/>。后续更新以对应提交和新的来源记录为准。

## 最近四个提交

- [`01594fc`](https://github.com/MoguJunn/endfield-version-calendar/commit/01594fc)：卡池开始、结束时间改为优先采用主站数据库值，保留明确的 `null`；浏览器恢复公开 API 结果时不再用本地日期覆盖。没有数据库卡池记录时继续使用活动备份，并修正跨版本武器池时间。
- [`ecc251b`](https://github.com/MoguJunn/endfield-version-calendar/commit/ecc251b)：依据后台重构类型区分“重构寻访”与“重构申领”，将有效的 `extraSeriesPhase` / `extra_series_phase` 显示为“第N期”，公开 API 与浏览器再次合并保留期次。
- [`0bbfc02`](https://github.com/MoguJunn/endfield-version-calendar/commit/0bbfc02)：CI 在 `npm ci` 后显式下载 `cn-font-split` 7.6.8 的 Linux 原生库并写入版本标记，解决安装阶段版本查询失败导致字体库缺失的问题。
- [`50cb595`](https://github.com/MoguJunn/endfield-version-calendar/commit/50cb595)：按官方动态将预热签到占位项修正为天地墨显，确认 10 月 8 日 12:00 开始、10 月 15 日 06:00 维护前结束；补充三张官方海报供四条活动共用，并保留独立的理智补给截止与跨版本丰碑奖励期限。

## 数据入口与合并规则

Version 5 的内置活动位于 [`lib/calendar-core.js`](../lib/calendar-core.js) 的 `rawEvents`，Version 6 位于 [`lib/version-six.js`](../lib/version-six.js) 的 `versionSixEvents`。页面和公开 API 使用共享核心；`app.js` 负责浏览器读取和交互，不另建一份日程。

站内 `/api/v1/events` 先读取主站公开的 `version_calendar`，必要时回退到 `pool_catalog` / `characters`，上游不可用时保留内置快照。无站内 API 的静态托管仍可使用浏览器主站直连与本地回退。该流程不需要日历站持有数据库密钥。

主站 `pools` / `pool_catalog` 中的数据库卡池时间优先于本地与远端活动备份：

- 明确的 `endsAt: null` 表示没有确定截止，不补回本地日期或相对结束说明。
- 明确的 `startsAt: null` 不以本地日期补画时间轴位置，该卡池暂不绘制。
- 字段缺失可使用对应备份值；它与明确的 `null` 不同。
- 没有对应数据库卡池时保留现有活动备份、相对结束说明、图片及分类。远端活动仅含 `poolId` 不会因此成为数据库记录。
- 公开 API 已合并的时间在浏览器恢复时保持一致，已排除的卡池不会从本地备份重新补回。

手动卡池 ID 替换为正式 ID 时，只在类别、名称与北京时间开池日期一致，且正式记录唯一时合并；同名不同期和存在多个候选的记录不猜测合并。主站卡池图片在合并后保留。

重构类型优先使用后台的 `poolKind`、`extraSubtype`，旧目录兼容 `extra_subtype` / `extra_rule_profile`。角色池显示“重构寻访”，武器池显示“重构申领”，仍分别属于 `operator` / `arsenal` 分类。期次只采用有效正整数；未维护时不推算新序号，旧第六版离线备份保留第一期。接口字段详见 [API 文档](./API.md)。

## 时间节点与来源

确定时间使用包含 `+08:00` 的 ISO 8601 字符串。当前确认的关键时间均为北京时间：

- 天地墨显：`2026-10-08T12:00:00+08:00` 至 `2026-10-15T06:00:00+08:00`。保留事件 ID `winter-next-version-warmup`，已移除未知开始时间标记。
- 10 月理智补给：`2026-10-08T04:00:00+08:00` 至 `2026-10-15T04:00:00+08:00`。
- 影拓丰碑「幽影刻形」：`2026-10-05T12:00:00+08:00` 起常驻开放。
- 丰碑留名「刻影」：`2026-10-05T12:00:00+08:00` 至 `2026-10-19T04:00:00+08:00`，保留跨版本限期奖励。

管理员已确认 10 月 15 日 **06:00 开始维护，12:00 开启新版本**。官方天地墨显正文写的是“版本更新维护前”，具体维护截止按管理员确认记录；不要将版本开启时间代入。其他活动如有自己的明确截止，保留该截止。

常驻活动的 `end: null` 与用于限制绘制范围的 `displayEnd` 含义不同：常驻条在下一版本分割线处收束，状态仍为开放；限期奖励用真实 `end`，不能因为跨版本就截断。

官方账号「明日方舟终末地」（UID 1265652806）已通过 B 站 MCP 用户信息工具核验身份。当前 MCP 无动态读取工具，正文与图片由官方公开页补充，历史动态分页未取得九月记录。已核对的条目不代表完成全部历史活动核验；找不到可信对应图片时保留现有图示，不猜测匹配。

三张 `1600 × 900` WebP 分别用于天地墨显、10 月理智补给、幽影刻形／刻影，保留完整构图并使用本站素材路径。活动正文、原图、具体文件与时间依据集中在 [官方来源记录](../assets/events/OFFICIAL_SOURCES.md)；新增素材流程见 [素材指南](../assets/events/README.md)，权利归属见 [第三方声明](../THIRD_PARTY_NOTICES.md)。

## 缓存与刷新

日历 API 使用 `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`：共享缓存可保留 60 秒，后台重新验证期间可额外使用最多 300 秒的旧响应。主站公开接口自身缓存也可能推迟新数据可见时间。

数据库时间优先是合并规则，不是即时更新承诺。已打开的页面根据现有数据更新状态与倒计时，但不定时重拉日程；修改后需刷新页面重新请求。报告时间错误时记录读取时间、刷新后的结果与 `source.mode`，区分上游数据、缓存和内置回退。已有失败回退流程不额外增加请求来绕过缓存或补齐卡池。

## 字体构建与 CI

在日历仓库目录使用 Node.js 20 或更高版本，先运行 `npm ci` 安装开发依赖。`npm run dev`、`npm test`、`npm run build` 分别通过对应前置脚本调用 `npm run fonts:prepare`，生成或复用 HarmonyOS Sans 字体分片。

[`verify.yml`](../.github/workflows/verify.yml) 在 Ubuntu 和 Node.js 20 上依次执行安装依赖、准备原生库、`npm test`、`npm run build`。准备原生库时固定使用：

- 下载地址：<https://github.com/KonghaYao/cn-font-split/releases/download/7.6.8/libffi-x86_64-unknown-linux-gnu.so>，`curl` 失败重试 3 次。
- 目标：`node_modules/cn-font-split/dist/libffi-x86_64-unknown-linux-gnu.so`。
- 版本标记文件：`node_modules/cn-font-split/dist/version`，内容为 `x86_64-unknown-linux-gnu@7.6.8`。

固定的是 CI 下载的 Linux 原生库版本，不表示所有开发平台都应复制同一文件，也不表示 `package.json` 的版本范围被改成 7.6.8。Windows 开发应使用依赖安装提供的对应平台原生库。

若字体准备失败，先检查 `npm ci`、对应平台原生库与字体压缩包是否齐全，再检查网络下载与构建输出。`scripts/build-font-subsets.mjs` 默认使用 120 秒超时，可通过 `FONT_BUILD_TIMEOUT_MS`（字体构建超时毫秒数）调整；`FORCE_FONT_REBUILD=1` 表示强制重建字体分片。生成物是否可复用由脚本元数据判断，不应以跳过字体步骤代替完整构建验证。

## 验证与记录边界

应用、日程或素材变更在仓库目录执行：

```bash
npm test
npm run build
```

`npm test` 运行 Node.js 测试，再执行 `scripts/verify-site.mjs` 的站点结构与 JavaScript 语法检查。卡池时间、明确空值、重构类型与期次、公开 API 返回后浏览器再次合并、维护节点及图片存在性的行为回归集中在 `test/calendar-update.test.js`。涉及视觉变化时还需按 [贡献指南](../CONTRIBUTING.md) 检查桌面端和移动端。

本次文档整理依据此前已提供的 **42 项测试与 113 项结构断言通过**记录；这是既有验证结果，不是本轮重新运行应用测试的结果，也不等同于本轮构建、线上部署或历史动态全量核验通过。仅文档改动检查本地链接、说明一致性与 `git diff --check`，实际执行的命令及结果在交付时单独注明。
