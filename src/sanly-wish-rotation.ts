/**
 * Offline wish rotation utilities. No network calls or API keys.
 * Keeps the recently shown variants out of the next selection.
 */
export type WishCandidate = { id: string; text: string; language: string; occasion: string; style: string };
export type WishHistory = { ids: string[] };
export const MAX_RECENT_WISHES = 12;

export function normalizeWishText(text: string): string {
  return text.normalize('NFKC').toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
}

export function uniqueWishes(candidates: readonly WishCandidate[]): WishCandidate[] {
  const seen = new Set<string>();
  return candidates.filter(candidate => {
    if (!candidate.id || !candidate.text.trim()) return false;
    const key = candidate.language + '|' + candidate.occasion + '|' + normalizeWishText(candidate.text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function chooseNextWish(
  candidates: readonly WishCandidate[],
  history: WishHistory = { ids: [] },
  random: () => number = Math.random,
): { wish: WishCandidate | null; history: WishHistory } {
  const unique = uniqueWishes(candidates);
  if (!unique.length) return { wish: null, history };
  const recent = new Set(history.ids);
  let pool = unique.filter(item => !recent.has(item.id));
  if (!pool.length) {
    const last = history.ids[history.ids.length - 1];
    pool = unique.length > 1 ? unique.filter(item => item.id !== last) : unique;
  }
  const n = random();
  const safeRandom = Number.isFinite(n) ? Math.max(0, Math.min(0.999999999, n)) : 0;
  const wish = pool[Math.floor(safeRandom * pool.length)];
  return { wish, history: { ids: [...history.ids, wish.id].slice(-MAX_RECENT_WISHES) } };
}

/** Keep catalogue updates separate from the UI and verify their content before caching. */
export function validateWishCatalogue(value: unknown): WishCandidate[] {
  if (!Array.isArray(value)) return [];
  return uniqueWishes(value.filter((item): item is WishCandidate =>
    !!item && typeof item === 'object' &&
    typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 120 &&
    typeof item.text === 'string' && item.text.length > 0 && item.text.length <= 1000 &&
    typeof item.language === 'string' && typeof item.occasion === 'string' &&
    typeof item.style === 'string'
  ));
}
