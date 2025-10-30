export const storage = {
  get<T>(k: string, d: T): T {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : d; }
    catch { return d; }
  },
  set<T>(k: string, v: T) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }
};
