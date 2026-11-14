// 官方公告正文中的卡池横幅；只决定展示素材，不参与卡池时间和身份合并。
export const officialPoolBanners = Object.freeze([
  { category: "operator", name: "万物更新", file: "pool-rejuvenation.webp", source: "https://endfield.hypergryph.com/news/8548", original: "https://web.hycdn.cn/upload/image/20261014/4aecb8b0646268c07144fc5a0acc42bf.jpg" },
  { category: "operator", name: "烟火邀星河", file: "pool-fireworks.webp", source: "https://endfield.hypergryph.com/news/7204", original: "https://web.hycdn.cn/upload/image/20261027/131177beccbe5a8d9e1b6f552e604ee5.png" },
  { category: "operator", poolKind: "reconstruction", extraSeriesPhase: 1, name: "祖泉的新流", file: "pool-reconstruction-character.webp", source: "https://endfield.hypergryph.com/news/3893", original: "https://web.hycdn.cn/upload/image/20261029/7036dca42762c5caf725c1d8cf118890.png" },
  { category: "arsenal", name: "篆玉申领", file: "pool-jade.webp", source: "https://endfield.hypergryph.com/news/7212", original: "https://web.hycdn.cn/upload/image/20261014/78a43a250eb442d9bbe9bd43c1fb8d1d.png" },
  { category: "arsenal", name: "月映申领", file: "pool-moon.webp", source: "https://endfield.hypergryph.com/news/5971", original: "https://web.hycdn.cn/upload/image/20261102/0fb68e180c12e1e38e64e1237dde5133.png" },
  { category: "arsenal", poolKind: "reconstruction", extraSeriesPhase: 1, name: "细枝申领", file: "pool-reconstruction-weapon.webp", source: "https://endfield.hypergryph.com/news/3893", original: "https://web.hycdn.cn/upload/image/20261029/f1d7f7bfbb4035bdff8409c8e11074c2.png" },
  { category: "operator", name: "冬猎", file: "pool-winter-hunt.webp", source: "https://endfield.hypergryph.com/news/6097", original: "https://web.hycdn.cn/upload/image/20260824/daa199c31f50c311e52da65204f9c373.jpg" },
  { category: "arsenal", name: "幽寒申领", file: "pool-deep-cold.webp", source: "https://endfield.hypergryph.com/news/5989", original: "https://web.hycdn.cn/upload/image/20260824/a420490e18878d3631df33ff958e2ca1.jpg" },
  { category: "operator", poolKind: "reconstruction", extraSeriesPhase: 1, name: "绚丽异彩", file: "pool-ivonne.webp", source: "https://endfield.hypergryph.com/news/2651", original: "https://web.hycdn.cn/upload/image/20260921/394fc7fba6fed31434e0c65f69ecdecd.png" },
  { category: "arsenal", poolKind: "reconstruction", extraSeriesPhase: 1, name: "点绘申领", file: "pool-art.webp", source: "https://endfield.hypergryph.com/news/2651", original: "https://web.hycdn.cn/upload/image/20260921/081b05087b656b0e495b25cf43de7d8c.png" },
  { category: "operator", name: "晨星于此闪耀", file: "pool-dawn.webp", source: "https://endfield.hypergryph.com/news/1165", original: "https://web.hycdn.cn/upload/image/20260730/11bb13df378201f8b0b5580ec3c02d37.jpg" },
  { category: "arsenal", name: "明曜申领", file: "pool-pupil.webp", source: "https://endfield.hypergryph.com/news/7216", original: "https://web.hycdn.cn/upload/image/20260730/1c5c7ae960e5d5bb9099315d96fd553c.jpg" },
]);

const byName = new Map(officialPoolBanners.map((banner) => [`${banner.category}:${banner.poolKind || "standard"}:${banner.name}`, banner]));

export function officialPoolBanner(event) {
  const name = String(event.title || "").match(/^「([^」]+)」/u)?.[1];
  const banner = byName.get(`${event.category}:${event.poolKind || "standard"}:${name}`);
  if (banner?.extraSeriesPhase && event.extraSeriesPhase && Number(event.extraSeriesPhase) !== banner.extraSeriesPhase) return null;
  return banner || null;
}
