import { useState, useCallback } from 'react'

const STORAGE_KEY = 'qaGeneratorHistory'
const MAX_ENTRIES = 10

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage unavailable or full
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory)

  const addEntry = useCallback((input, data) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      inputPreview: input.trim().slice(0, 80) + (input.trim().length > 80 ? '…' : ''),
      input,
      data,
    }
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES)
      saveHistory(updated)
      return updated
    })
    return entry
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  const getEntry = useCallback((id) => {
    return loadHistory().find((e) => e.id === id) || null
  }, [])

  return { history, addEntry, clearHistory, getEntry }
}
