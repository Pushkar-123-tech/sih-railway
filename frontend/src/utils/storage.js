const canUse = () => typeof window !== "undefined" && !!window.localStorage;
export function readJSON(key, fallback) {
  if (!canUse()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}
export function writeJSON(key, value) {
  if (!canUse()) return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
export function removeStorage(key) {
  if (!canUse()) return;
  try { window.localStorage.removeItem(key); } catch {}
}
export function readText(key, fallback = "") {
  if (!canUse()) return fallback;
  try { return window.localStorage.getItem(key) || fallback; } catch { return fallback; }
}
export function writeText(key, value) {
  if (!canUse()) return;
  try { window.localStorage.setItem(key, value); } catch {}
}
