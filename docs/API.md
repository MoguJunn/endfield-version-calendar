# 公开活动 API

日历站提供只读、免密且允许跨域调用的公开活动接口。接口返回日历页面使用的最终合并数据，包括人工整理活动、主站版本快照、角色寻访和武库申领。

生产端点：

```text
GET https://ef-cal.mogujun.icu/api/v1/events
```

机器可读契约：[OpenAPI 3.1](../openapi.json)

## 快速调用

```bash
curl "https://ef-cal.mogujun.icu/api/v1/events?version=5&status=live"
```

```js
const response = await fetch(
  "https://ef-cal.mogujun.icu/api/v1/events?category=operator,limited&status=upcoming",
);
const payload = await response.json();

if (!payload.success) throw new Error(payload.error.message);
console.log(payload.data.events);
```

接口不使用 Cookie 或 API Key，并返回 `Access-Control-Allow-Origin: *`，因此浏览器、服务端程序和命令行工具均可直接调用。

## 查询参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `version` | `all` | `all`、版本键（如 `version-5`）或版本号（如 `5`） |
| `category` | `all` | 逗号分隔的 `operator`、`arsenal`、`permanent`、`limited`、`update` |
| `status` | `all` | `all`、`upcoming`、`live`、`ended` |
| `from` | 无 | ISO 8601 时间；返回与 `[from, to)` 相交的事件 |
| `to` | 无 | ISO 8601 时间；返回与 `[from, to)` 相交的事件 |

`category` 可以组合，例如 `?category=operator,arsenal`。时间筛选采用区间相交语义，而不是只比较开始时间。没有确定结束时间的常驻活动会被视为持续开放；单次更新节点只在其发生时刻与查询区间相交。

参数非法、版本不存在或 `from` 晚于 `to` 时返回 HTTP `400`，不会静默忽略。

## 成功响应

```json
{
  "success": true,
  "apiVersion": "1",
  "generatedAt": "2026-07-12T00:00:00.000Z",
  "timeZone": "Asia/Shanghai",
  "source": {
    "mode": "origin",
    "partial": false,
    "updatedAt": "2026-07-11T18:16:32.446Z"
  },
  "data": {
    "activeVersionKey": "version-5",
    "versions": [],
    "events": []
  },
  "meta": {
    "total": 0,
    "filters": {
      "version": "all",
      "categories": ["all"],
      "status": "all",
      "from": null,
      "to": null
    }
  }
}
```

### 数据来源状态

| `source.mode` | 含义 |
| --- | --- |
| `origin` | 主站版本快照读取成功，并与日历仓库人工活动合并 |
| `partial` | 只取得部分上游数据，缺失部分已由本地数据补齐 |
| `fallback` | 上游不可用，完整使用仓库内置版本与活动数据 |

调用方不应只根据 HTTP `200` 判断数据是否来自上游；请同时检查 `source.mode` 和 `source.partial`。

### 事件字段

| 字段 | 说明 |
| --- | --- |
| `id` | 稳定事件 ID |
| `versionKey` | 事件所属版本键 |
| `poolId` | 对应主站卡池 ID；非卡池活动为 `null` |
| `category` | 活动分类 |
| `title` | 活动标题 |
| `related` | 配套签到、作战演练等关联内容 |
| `start` / `end` | ISO 8601 时间；未知或开放式结束为 `null` |
| `status` | `upcoming`、`live` 或 `ended` |
| `startUnknown` | `start` 是否仅为时间轴定位锚点 |
| `startLabel` / `endLabel` | 未确定或相对时间的展示说明 |
| `permanent` | 是否为常驻内容 |
| `milestone` | 是否为单次更新节点 |
| `overlayFor` | 更新节点所依附的活动 ID |
| `image` | 可直接访问的绝对图片 URL，或 `null` |
| `color` / `eventInk` | 时间轴背景色与建议文字色 |
| `description` | 活动说明 |
| `sourceNote` | 数据来源或不确定性说明 |

排轨位置、浏览器 `Date` 对象和数据库管理字段不会公开。

## 错误响应

```json
{
  "success": false,
  "apiVersion": "1",
  "error": {
    "code": "INVALID_QUERY",
    "message": "from 不能晚于 to",
    "details": null
  }
}
```

| HTTP 状态 | 场景 |
| --- | --- |
| `400` | 查询参数非法 |
| `405` | 使用了 GET、OPTIONS 之外的方法 |
| `429` | 同一客户端在限速窗口内请求过多 |
| `500` | 服务端发生无法通过本地数据恢复的错误 |

上游主站超时或暂时不可用通常不会返回 `502`；接口会使用仓库内置数据并通过 `source.mode: "fallback"` 明确告知调用方。

## 请求频率限制

接口默认按客户端 IP 提供每 60 秒 60 次函数请求的基础保护。超过限额时返回 HTTP `429`、错误代码 `RATE_LIMITED`，并通过 `Retry-After` 告知建议等待秒数：

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
RateLimit-Limit: 60
RateLimit-Remaining: 0
Cache-Control: no-store
```

跨域预检 `OPTIONS` 不占用额度。由 ESA 或 Vercel CDN 直接命中的缓存响应通常不会进入函数，因此也不会消耗函数内额度。当前限制在每个 Vercel 函数实例内独立计数，主要用于抑制单实例突发请求，并不是跨全部实例的严格全局配额。

部署方可通过 `CALENDAR_API_RATE_LIMIT_WINDOW_MS`（限速窗口毫秒数）和 `CALENDAR_API_RATE_LIMIT_MAX`（窗口内最多请求数）调整默认值。

## 缓存与实时状态

接口允许共享 CDN 缓存 60 秒，并允许在后台重新验证期间短暂使用旧响应：

```http
Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300
```

因此 `status` 最多可能相对请求时刻延迟约一分钟。需要在临界秒级精确判断的调用方，应使用事件的时间字段自行重新计算。

所有错误响应（包括 `400`、`405`、`429` 和 `500`）均使用 `no-store`，避免 CDN 缓存临时错误或限速结果。

## 数据来源与免责声明

规范版本与卡池信息来自抽卡主站公开接口；人工活动主要依据罗德岛蜜饼工坊发布的「向渊行」非官方活动时间轴整理。接口是社区维护的非官方服务，与鹰角网络、峘形山工作室及相关权利方不存在隶属、授权或背书关系。

若接口内容与官方公告或游戏内显示不一致，请以官方信息为准。调用方展示数据时应保留适当的非官方说明和来源信息。
