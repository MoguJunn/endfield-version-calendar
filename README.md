# Endfield Version Calendar

<div align="center">

## 「向渊行」版本实时日历

一个面向《明日方舟：终末地》玩家的非官方版本活动时间轴，按北京时间实时展示活动状态、下一节点倒计时和完整日程。

[![站点状态](https://img.shields.io/website?url=https%3A%2F%2Fef-cal.mogujun.icu%2F&label=live&up_message=online&down_message=offline)](https://ef-cal.mogujun.icu/)
[![项目校验](https://github.com/MoguJunn/endfield-version-calendar/actions/workflows/verify.yml/badge.svg)](https://github.com/MoguJunn/endfield-version-calendar/actions/workflows/verify.yml)
[![许可证](https://img.shields.io/github/license/MoguJunn/endfield-version-calendar)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![最后提交](https://img.shields.io/github/last-commit/MoguJunn/endfield-version-calendar)](https://github.com/MoguJunn/endfield-version-calendar/commits/main)

[在线访问](https://ef-cal.mogujun.icu/) · [抽卡主站](https://ef-gacha.mogujun.icu) · [问题反馈](https://github.com/MoguJunn/endfield-version-calendar/issues) · [参与贡献](./CONTRIBUTING.md)

</div>

## 项目简介

Endfield Version Calendar 将静态活动日程转换为可以实时浏览的网页时间轴。页面不依赖前端框架，也不要求浏览器持有数据库密钥；网络异常时会自动使用仓库内置快照，保证日历仍然可用。

主要能力：

- 按北京时间（UTC+8）实时计算“即将开始、进行中、已结束”状态。
- 展示下一日程节点、精确到秒的倒计时和当前时间线位置。
- 支持活动分类筛选、时间轴缩放、拖动浏览和快速定位现在。
- 提供活动详情弹窗、近期日程列表、默认跟随系统的亮暗主题和移动端布局。
- 优先同步主站公开版本快照和规范卡池名称，失败时分级回退。
- 提供版本化、免密且允许跨域调用的公开活动 API。
- 支持为每项活动配置真实海报，也提供无图片时的风格化占位图。
- 尊重 `prefers-reduced-motion`，为减少动态效果的系统设置提供降级体验。

## 日历来源与致谢

版本日历内容主要依据 [罗德岛蜜饼工坊发布的「向渊行」非官方活动时间轴](https://www.bilibili.com/opus/1223774493520953353) 整理。

特别感谢罗德岛蜜饼工坊第一时间整理并公开分享原始时间轴。本项目在其基础上实现实时状态、倒计时、筛选和详情交互。若网页内容与游戏内显示不一致，请以官方公告和游戏内实际时间为准。

## 快速开始

环境要求：Node.js 20 或更高版本。项目没有第三方运行时依赖，无需配置数据库即可启动。

```bash
git clone https://github.com/MoguJunn/endfield-version-calendar.git
cd endfield-version-calendar
npm run dev
```

浏览器打开 <http://127.0.0.1:4178>。

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动页面与本地 `/api/v1/events` 服务 |
| `npm test` | 检查数据核心、API 契约、页面结构和 JavaScript 语法 |
| `npm run build` | 将可部署文件生成到 `dist/` |

## 数据同步与离线回退

```text
页面请求站内 /api/v1/events
          ↓ 服务端合并
主站 version_calendar → pool_catalog / characters → 共享核心内置快照
          ↓ 站内 API 不可用
浏览器原有主站直连链路 → 共享核心内置快照
```

页面优先读取同源的 `/api/v1/events`，由服务端请求主站公开接口 `https://ef-gacha.mogujun.icu/api/stats`：

1. 优先请求 `type=version_calendar`，同步当前启用的版本快照与规范卡池名称。
2. 快照不可用时请求 `type=pool_catalog` 和 `type=characters`，补齐历史卡池和图片。
3. 主站不可用时，接口使用 `lib/calendar-core.js` 的内置版本与活动并标记为 `fallback`。
4. 非 Vercel 静态托管没有站内 API 时，浏览器仍保留原有主站直连和本地回退，不阻塞页面加载。

日历接口只读取主站公开 API，不直接连接 Supabase，也不包含主站数据库密钥或内部部署配置。

## 公开活动 API

生产环境提供与日历页面使用相同合并规则的公开接口：

```text
GET https://ef-cal.mogujun.icu/api/v1/events
```

接口只支持读取，无需 API Key，并允许第三方网站跨域调用。可按版本、活动分类、实时状态和 ISO 8601 时间区间筛选：

```bash
curl "https://ef-cal.mogujun.icu/api/v1/events?version=5&category=operator,arsenal&status=live"
```

响应中的 `source.mode` 会明确区分主站数据、部分回退和完整本地回退。完整字段、缓存规则、错误格式与调用示例可在部署后的独立页面 `/api-docs` 阅读；仓库内同时保留 [Markdown 文档](./docs/API.md) 和 [OpenAPI 3.1](./openapi.json) 下载源文件。

## 维护日程

活动数据集中在 `lib/calendar-core.js` 的 `rawEvents` 数组，页面与公开 API 共用这份定义。基础数据结构示例：

```js
{
  id: "example-event",
  category: "limited",
  title: "示例活动",
  start: "2026-08-09T12:00:00+08:00",
  end: "2026-09-02T06:00:00+08:00",
  color: "#7181bd",
  lane: 0,
  symbol: "例",
  description: "活动说明。",
}
```

特殊字段：

| 字段 | 含义 |
| --- | --- |
| `end: null` | 常驻开放或结束时间未知 |
| `endLabel` | 使用文字表达相对结束规则 |
| `startUnknown` / `startLabel` | 开始时间尚未公布 |
| `milestone` | 单次更新时间节点，不绘制成长活动条 |
| `related` | 与主活动同期开放的签到、作战演练等内容 |
| `image` | 本地活动图片路径 |

所有确定时间必须使用包含 `+08:00` 的 ISO 8601 字符串，避免部署环境时区造成偏移。

## 添加活动图片

将有权公开再分发的图片放入 `assets/events/`，并在活动对象中配置：

```js
image: "./assets/events/op-wander.webp",
```

图片会用于时间轴、近期日程卡片和详情弹窗。格式、尺寸、构图和来源记录要求见 [活动素材说明](./assets/events/README.md)。

## 项目结构

```text
.
├─ .github/              # 自动校验与协作模板
├─ api/                  # Vercel 公开活动 API
├─ api-docs.html         # 可直接浏览和下载契约的独立 API 文档页
├─ api-docs.css          # API 文档页布局与响应式样式
├─ assets/events/        # 可选活动图片
├─ docs/API.md           # API 使用文档
├─ lib/calendar-core.js  # 页面与 API 共用的日历数据核心
├─ scripts/              # 本地服务器、构建和结构检查
├─ app.js                # 日程数据、实时状态和交互
├─ calendar-config.js    # 可选的 ICP 与公安备案展示配置
├─ index.html            # 页面结构
├─ styles.css            # 主题、布局与动效
├─ theme.js / theme.css  # 主页面与文档页共用的三态主题控件
├─ openapi.json          # OpenAPI 3.1 机器可读契约
├─ vercel.json           # Vercel 静态部署配置
└─ package.json          # 项目信息与 npm 命令
```

`dist/` 是构建产物，不纳入版本控制。

### 可选备案信息

在 `calendar-config.js` 中填写与部署主体一致的备案信息；未填写的项目不会显示，两个号码都为空时整个备案区域隐藏：

```js
window.ENDFIELD_CALENDAR_CONFIG = Object.freeze({
  icpNumber: "示例 ICP 备案号",
  icpUrl: "https://beian.miit.gov.cn/",
  policeNumber: "示例公安备案号",
  policeUrl: "https://www.beian.gov.cn/",
});
```

## 部署

仓库已连接 Vercel。推送到 `main` 后，GitHub 会触发生产部署：

- 构建命令：`npm run build`
- 输出目录：`dist`
- 生产地址：<https://ef-cal.mogujun.icu/>

其他静态托管平台也可以直接发布 `npm run build` 生成的 `dist/`。

## 参与贡献

欢迎提交日程纠错、无障碍改进、移动端优化和有明确授权来源的活动图片。开始前请阅读 [贡献指南](./CONTRIBUTING.md)。安全问题请按 [安全策略](./SECURITY.md) 私下报告。

## 许可证与免责声明

仓库中的原创源代码以 [MIT License](./LICENSE) 授权。该许可证不授予《明日方舟：终末地》名称、角色、美术、商标，也不覆盖第三方时间轴或其他第三方素材；详情见 [第三方声明](./THIRD_PARTY_NOTICES.md)。

本项目是由玩家维护的非官方工具，与鹰角网络、峘形山工作室及相关权利方不存在隶属、授权或背书关系。游戏名称、商标与相关素材的权利归各自权利人所有。
