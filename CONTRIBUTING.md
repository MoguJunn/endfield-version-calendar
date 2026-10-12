# 贡献指南

感谢你帮助改进 Endfield Version Calendar。日程纠错、界面优化、无障碍改进和文档补充都很欢迎。

## 提交 Issue 前

- 日程错误请附上活动名称、正确时间、时区和可信来源链接。
- 页面问题请附上浏览器、设备尺寸、复现步骤和截图。
- 功能建议请说明使用场景，以及它对现有时间轴的影响。
- 安全问题不要公开提交 Issue，请参照 [安全策略](./SECURITY.md)。

## 本地开发

环境要求：Node.js 20 或更高版本。

```bash
git clone https://github.com/MoguJunn/endfield-version-calendar.git
cd endfield-version-calendar
npm ci
npm run dev
```

在日历仓库目录内执行命令。页面没有第三方运行时依赖，但开发、测试与构建需要安装字体处理等开发依赖。`dev`、`test`、`build` 都会先准备 HarmonyOS Sans 字体分片；CI 还会显式下载 `cn-font-split` 7.6.8 的 Linux 原生库。平台与故障排查边界见 [维护说明](./docs/MAINTENANCE.md#字体构建与-ci)。

修改应用、日程数据或素材后，提交前运行：

```bash
npm test
npm run build
```

`npm test` 包含 Node.js 测试和站点结构、脚本语法检查；`npm run build` 检查静态产物生成。仅修改文档时，检查链接、说明与当前实现的一致性，并运行 `git diff --check`；未执行的应用测试或构建请明确注明，不要引用此前结果作为本轮结果。

## 日程数据规则

- Version 5 的离线活动维护在 `lib/calendar-core.js`，Version 6 维护在 `lib/version-six.js`；不要在 `app.js` 另建一份日程。
- 所有确定时间使用包含 `+08:00` 的 ISO 8601 字符串。
- 不猜测官方尚未公布的时间；使用 `startUnknown`、`startLabel` 或文字说明。
- 单次更新使用 `milestone`，不要伪造一段持续时间。
- 新增或修改卡池名称时，应优先使用主站公开目录中的规范名称。
- 卡池时间以主站数据库记录的 `startsAt` / `endsAt` 为准，包括明确的 `null`；字段缺失才使用备份值。`endsAt: null` 不补回本地截止日期或相对结束规则，`startsAt: null` 不以本地日期绘制卡池。无对应数据库卡池时保留离线活动备份。
- 重构寻访和重构申领依照后台类型区分，期次取 `extraSeriesPhase` / `extra_series_phase` 的有效正整数，不按名称、日期或手动 ID 推算新期次。旧第六版备份保留第一期。
- “版本更新维护前”与“新版本开启”分别记录；当前确认 2026 年 10 月 15 日 06:00 开始维护、12:00 开启版本。活动自己的截止时间优先保留，例如理智补给在 04:00 结束。
- `displayEnd` 只限制常驻活动条的绘制范围，不作为实际关闭时间；跨版本限期奖励保留真实 `end`。
- 修改合并、期次或关键日程时，同步维护 `test/calendar-update.test.js` 的行为回归测试；涉及页面结构时检查 `scripts/verify-site.mjs`。应覆盖数据库空值、公开 API 返回后浏览器再次合并，以及常驻内容与限期奖励的区别等实际受影响行为。

来源、维护节点及缓存延迟的完整规则见 [维护说明](./docs/MAINTENANCE.md)，接口字段见 [API 文档](./docs/API.md)。数据库值优先不表示页面即时更新；纠错反馈应附刷新后的结果和读取时间。

## 图片与素材

只提交有权公开再分发的素材，并在说明中记录来源、发布日期和授权依据。按 [素材指南](./assets/events/README.md) 保存本地文件；官方活动正文、时间与原图链接记录在 [官方来源记录](./assets/events/OFFICIAL_SOURCES.md)。公开可访问的原图链接本身不等于授权证明，权利归属见 [第三方声明](./THIRD_PARTY_NOTICES.md)。不要提交第三方网站直链、来源不明的图片、私钥、环境变量或服务器配置。

核对来源时区分账号身份、活动正文和历史覆盖范围。当前记录已核验官方 UID 1265652806，但 MCP 没有动态读取工具，公开页补充也未取得九月历史分页；不要将现有记录描述为官方历史动态全量核验。

## Pull Request

- 保持单个 PR 聚焦一个主题。
- 清楚说明改动原因、验证方式和数据来源。
- 记录实际执行的验证命令与结果；应用、日程或素材改动确认 `npm test` 与 `npm run build` 均通过，仅文档改动说明文档检查结果即可。
- 涉及视觉改动时附上桌面端和移动端截图。
- 尊重现有中文界面文案和无障碍属性。
