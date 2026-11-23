// 以稳定活动 ID 关联历史公告素材。来源记录见 assets/events/OFFICIAL_SOURCES.md。
const activityBannerIds = new Set([
  "launch-lone-wolf", "launch-burning-memory", "launch-yvonne-story", "launch-gilberta-story",
  "launch-awakening-signin", "launch-authority-rewards", "launch-set-out", "launch-etching",
  "launch-laevatain-signin", "launch-laevatain-trial", "launch-gilberta-signin", "launch-gilberta-trial",
  "launch-yvonne-signin", "launch-yvonne-trial", "launch-headhunt-beginner", "launch-headhunt-standard",
  "launch-carly-valley", "launch-smoke-wuling", "launch-lunar-greetings", "launch-monument-old-wound",
  "launch-secret-realm", "launch-sanity-discount", "launch-next-version-warmup",

  "tide-qingbo-region", "tide-red-knight", "tide-silent-spring", "tide-workers-festival",
  "tide-cleaning", "tide-survival-training", "tide-sanity-discount-first", "tide-monument-scars",
  "tide-secret-caverns", "tide-etching-zone-4", "tide-tangtang-signin", "tide-tangtang-trial",
  "tide-rossi-signin", "tide-rossi-trial", "tide-hare-adventure", "tide-next-version-warmup",

  "spring-first-dam", "spring-test-area", "spring-daily-login-gift", "spring-operator-development",
  "spring-sea-intro", "spring-star-photo", "spring-rescue-production", "spring-sanity-first",
  "spring-wuling-chef", "spring-soil-intro", "spring-monument-turbid", "spring-etching-zones-5-6",
  "spring-thunder-signin", "spring-radiant-signin", "spring-zhuang-trial", "spring-party-pastry",
  "spring-party-gifts", "spring-next-version-warmup",

  "heirloom-sword-valley", "heirloom-mifu-story", "heirloom-camille-story", "heirloom-sword-intro",
  "heirloom-crisis-preparation", "heirloom-crisis-contract", "heirloom-sword-trials", "heirloom-carly-wuling",
  "heirloom-sanity", "heirloom-monument-silence", "heirloom-mifu-signin", "heirloom-mifu-trial",
  "heirloom-camille-signin", "heirloom-camille-trial", "heirloom-next-version-warmup",

  "homecoming-yinglong-pass", "homecoming-north-restricted-zone", "homecoming-industry-gas",
  "homecoming-jie-signin", "homecoming-jie-trial", "homecoming-lino-signin", "homecoming-lino-trial",
  "next-version-warmup",

  "winter-pine-region", "winter-suiming-region", "winter-tephros-signin", "winter-tephros-trial", "winter-forest-story",

  "danqing-painted-region", "danqing-si-signin", "danqing-si-trial", "danqing-minghe-signin", "danqing-minghe-trial", "danqing-homecoming-story",
]);

const sharedActivityBanners = new Map([
  ["launch-monument-outcasts", "launch-monument-old-wound"],
  ["launch-monument-inorganic", "launch-monument-old-wound"],
  ["launch-monument-old-wound-update", "launch-monument-old-wound"],
  ["tide-monument-scorch", "tide-monument-scars"],
  ["tide-sanity-discount-second", "tide-sanity-discount-first"],
  ["spring-star-signin", "spring-star-photo"],
  ["spring-rescue-exchange", "spring-rescue-production"],
  ["spring-sanity-second", "spring-sanity-first"],
  ["spring-monument-rewards", "spring-monument-turbid"],
  ["heirloom-crisis-shop", "heirloom-crisis-contract"],
  ["heirloom-crisis-update", "heirloom-crisis-contract"],
  ["heirloom-sword-scoring", "heirloom-sword-trials"],
  ["heirloom-monument-rewards", "heirloom-monument-silence"],
]);

export function activityBannerImage(eventId) {
  const bannerId = sharedActivityBanners.get(eventId) ?? eventId;
  return activityBannerIds.has(bannerId) ? `./assets/events/history-${bannerId}.webp` : null;
}
