export function readLocalStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  const item = window.localStorage.getItem(key)

  if (!item) {
    return fallbackValue
  }

  try {
    return JSON.parse(item)
  } catch {
    return fallbackValue
  }
}

export function writeLocalStorage(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}
