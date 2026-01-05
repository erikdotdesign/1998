/* eslint-disable @typescript-eslint/no-explicit-any */
// src/analytics.ts

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const event = (
  name: string,
  params: Record<string, any> = {}
) => {
  if (!window.gtag) {
    // Optional: log in dev
    if (import.meta?.env?.DEV) {
      console.log("[analytics]", name, params);
    }
    return;
  }

  window.gtag("event", name, params);
};