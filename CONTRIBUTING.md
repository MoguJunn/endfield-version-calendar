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
npm run dev
```

提交前运行：

```bash
npm test
npm run build
```

## 日程数据规则

- 所有确定时间使用包含 `+08:00` 的 ISO 8601 字符串。
- 不猜测官方尚未公布的时间；使用 `startUnknown`、`startLabel` 或文字说明。
- 单次更新使用 `milestone`，不要伪造一段持续时间。
- 新增或修改卡池名称时，应优先使用主站公开目录中的规范名称。
- 修改关键日程时，请同步更新 `scripts/verify-site.mjs` 中的回归断言。

## 图片与素材

只提交有权公开再分发的素材，并在说明中记录来源、发布日期和授权依据。不要提交第三方网站直链、来源不明的图片、私钥、环境变量或服务器配置。

## Pull Request

- 保持单个 PR 聚焦一个主题。
- 清楚说明改动原因、验证方式和数据来源。
- 确认 `npm test` 与 `npm run build` 均通过。
- 涉及视觉改动时附上桌面端和移动端截图。
- 尊重现有中文界面文案和无障碍属性。
