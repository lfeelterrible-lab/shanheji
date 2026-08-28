const memoryStore = new Map<string, string>();

function getStorage(): Storage | null {
  if (typeof localStorage !== 'undefined') return localStorage;
  return null;
}

export function readStorage<T>(key: string, fallback: T): T {
  const storage = getStorage();
  const raw = storage?.getItem(key) ?? memoryStore.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  const raw = JSON.stringify(value);
  const storage = getStorage();
  if (storage) storage.setItem(key, raw);
  else memoryStore.set(key, raw);
}
