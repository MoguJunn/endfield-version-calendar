(function setupSharedTheme() {
  const STORAGE_KEY = "theme";
  const LEGACY_STORAGE_KEY = "endfield-calendar-theme";
  const MODES = new Set(["system", "light", "dark"]);
  const MODE_META = {
    system: { label: "跟随系统", icon: "▣" },
    light: { label: "亮色", icon: "☀" },
    dark: { label: "暗色", icon: "☾" },
  };
  // 脚本在样式表加载前执行，浏览器栏颜色与 styles.css 的 --bg 对齐。
  const DEFAULT_COLORS = { light: "#eef0ec", dark: "#101310" };
  const VERSION_COLORS = new Map([
    ["launch", { light: "#eef0ed", dark: "#191a13" }],
    ["tide", { light: "#f6eeea", dark: "#211311" }],
    ["spring", { light: "#eef4e7", dark: "#132018" }],
    ["heirloom", { light: "#f4edef", dark: "#1e131b" }],
    ["homecoming", { light: "#edeff1", dark: "#14171c" }],
    ["snow", { light: "#edf3fc", dark: "#0d1426" }],
    ["danqing", { light: "#f4efdf", dark: "#171610" }],
    ["mushroom", { light: "#fff8e9", dark: "#1b1524" }],
  ]);
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function readMode() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (MODES.has(saved)) return saved;

      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy === "light" || legacy === "dark") {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return legacy;
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    return "system";
  }

  let mode = readMode();

  function resolvedTheme() {
    if (mode === "system") return media.matches ? "dark" : "light";
    return mode;
  }

  function updateControls() {
    const meta = MODE_META[mode];
    document.querySelectorAll("[data-theme-picker]").forEach((picker) => {
      const trigger = picker.querySelector("[data-theme-trigger]");
      const icon = picker.querySelector("[data-theme-icon]");
      const label = picker.querySelector("[data-theme-label]");
      if (trigger) trigger.setAttribute("aria-label", `主题：${meta.label}`);
      if (icon) icon.textContent = meta.icon;
      if (label) label.textContent = `主题：${meta.label}`;
      picker.querySelectorAll("[data-theme-option]").forEach((option) => {
        const active = option.dataset.themeOption === mode;
        option.classList.toggle("active", active);
        option.setAttribute("aria-checked", String(active));
      });
    });
  }

  function applyTheme() {
    const resolved = resolvedTheme();
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      const colors = VERSION_COLORS.get(document.documentElement.dataset.versionTheme) ?? DEFAULT_COLORS;
      themeColor.content = colors[resolved];
    }
    updateControls();
  }

  function setMode(nextMode) {
    if (!MODES.has(nextMode)) return;
    mode = nextMode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Applying the selected mode still works for the current page.
    }
    applyTheme();
  }

  function closePicker(picker) {
    picker.classList.remove("open");
    picker.querySelector("[data-theme-trigger]")?.setAttribute("aria-expanded", "false");
  }

  function bindControls() {
    document.querySelectorAll("[data-theme-picker]").forEach((picker) => {
      const trigger = picker.querySelector("[data-theme-trigger]");
      trigger?.addEventListener("click", () => {
        const opening = !picker.classList.contains("open");
        document.querySelectorAll("[data-theme-picker].open").forEach(closePicker);
        picker.classList.toggle("open", opening);
        trigger.setAttribute("aria-expanded", String(opening));
      });
      picker.querySelectorAll("[data-theme-option]").forEach((option) => {
        option.addEventListener("click", () => {
          setMode(option.dataset.themeOption);
          closePicker(picker);
          trigger?.focus();
        });
      });
    });

    document.addEventListener("click", (event) => {
      document.querySelectorAll("[data-theme-picker].open").forEach((picker) => {
        if (!picker.contains(event.target)) closePicker(picker);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll("[data-theme-picker].open").forEach((picker) => {
        closePicker(picker);
        picker.querySelector("[data-theme-trigger]")?.focus();
      });
    });
    updateControls();
  }

  media.addEventListener("change", () => {
    if (mode === "system") applyTheme();
  });
  document.addEventListener("versionthemechange", applyTheme);
  applyTheme();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindControls, { once: true });
  } else {
    bindControls();
  }
})();
