import { event } from "./analytics";

const CLICK_SELECTOR = `[data-analytics]`;

let initialized = false;

export function initClickTracking() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const el = target.closest(CLICK_SELECTOR) as HTMLElement | null;
    if (!el) return;

    const tag = el.tagName.toLowerCase();
    const label = el.getAttribute("data-analytics") || tag;

    const href = el instanceof HTMLAnchorElement ? el.href : undefined;

    event("ui_click", {
      element_type: tag,
      label,
      href,
    });
  });
};