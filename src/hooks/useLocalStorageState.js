import { useEffect, useState } from 'react'
import { readLocalStorage, writeLocalStorage } from '../lib/localStorage.js'

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readLocalStorage(key, initialValue))

  useEffect(() => {
    writeLocalStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
