// @ts-check

const PREFIX = 'bartech.landingDraft.';

/**
 * @param {import('./types').LandingEditorMode} mode
 * @param {import('./types').LandingRecord | null | undefined} landing
 */
export function draftStorageKey(mode, landing) {
  if (mode === 'edit' && landing?.id) return `edit:${landing.id}`;
  if (mode === 'duplicate' && landing?.id) return `dup:${landing.id}`;
  return 'new';
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function stableStringify(value) {
  if (value === undefined) return 'null';
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const record = /** @type {Record<string, unknown>} */ (value);
  const keys = Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

/**
 * @param {string} key
 * @returns {{ v: number, savedAt: number, values: import('./types').LandingFormValues } | null}
 */
export function readDraft(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== 1 || !parsed.values || typeof parsed.values !== 'object') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {import('./types').LandingFormValues} values
 */
export function writeDraft(key, values) {
  if (typeof window === 'undefined') return;
  const payload = { v: 1, savedAt: Date.now(), values };
  window.localStorage.setItem(PREFIX + key, JSON.stringify(payload));
}

/**
 * @param {string} key
 */
export function clearDraft(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(PREFIX + key);
}
