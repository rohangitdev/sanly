import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateWishCatalogue, type WishCandidate } from './sanly-wish-rotation';

const STORAGE_KEY = '@sanly/wish-catalogue-v1';
const MAX_BYTES = 350_000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type StoredCatalogue = { version: 1; savedAt: number; items: WishCandidate[] };

function isStoredCatalogue(value: unknown): value is StoredCatalogue {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<StoredCatalogue>;
  return item.version === 1 && typeof item.savedAt === 'number' &&
    Number.isFinite(item.savedAt) && Array.isArray(item.items);
}

/** Returns a safe cached catalogue, or [] when unavailable. Never blocks offline wishes. */
export async function readCachedWishCatalogue(): Promise<WishCandidate[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_BYTES) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredCatalogue(parsed)) return [];
    return validateWishCatalogue(parsed.items);
  } catch {
    return [];
  }
}

/**
 * Call with a configured HTTPS JSON endpoint (e.g. a public, read-only Storage object).
 * Keeps existing cached content when offline, on timeout, or on invalid responses.
 * Does not send user names, contacts, or other personal data to the server.
 */
export async function refreshWishCatalogue(endpoint: string): Promise<WishCandidate[]> {
  const cached = await readCachedWishCatalogue();
  if (!/^https:\/\/[^\s/?#]+(?:[/?#]|$)/i.test(endpoint)) return cached;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(endpoint, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) return cached;
    const body = await response.text();
    if (body.length > MAX_BYTES) return cached;
    const parsed: unknown = JSON.parse(body);
    const items = validateWishCatalogue(parsed);
    if (!items.length || items.length > 3000) return cached;
    // Duplicate IDs would make rotation history ambiguous across remote updates.
    if (new Set(items.map(item => item.id)).size !== items.length) return cached;
    const record: StoredCatalogue = { version: 1, savedAt: Date.now(), items };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return items;
  } catch {
    return cached;
  } finally {
    clearTimeout(timeout);
  }
}

/** Refresh only when cache is old; return cached data immediately for fast screens. */
export async function getWishCatalogue(endpoint?: string): Promise<WishCandidate[]> {
  if (!endpoint) return readCachedWishCatalogue();
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw && raw.length <= MAX_BYTES ? JSON.parse(raw) : null;
    if (isStoredCatalogue(parsed) && Date.now() - parsed.savedAt < MAX_AGE_MS && parsed.savedAt <= Date.now()) {
      return validateWishCatalogue(parsed.items);
    }
  } catch { /* fall through to refresh */ }
  return refreshWishCatalogue(endpoint);
}

/** Remote catalogue entries are plain text with an optional {name} placeholder. */
export function remoteWishCandidates(
  items: readonly WishCandidate[],
  input: { name: string; language: string; occasionType: string; style: string },
): WishCandidate[] {
  const name = input.name.trim() || 'Friend';
  return items.filter(item =>
    item.language === input.language &&
    item.occasion === input.occasionType &&
    item.style === input.style
  ).map(item => ({ ...item, text: item.text.replace(/\{name\}/g, name) }));
}
