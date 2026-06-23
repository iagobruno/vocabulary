export const VIEWED_KEY = 'vocabulary_viewed'
export const SAVED_KEY = 'vocabulary_saved'

export function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw))
  } catch {
    return new Set()
  }
}

export function persistSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]))
}
