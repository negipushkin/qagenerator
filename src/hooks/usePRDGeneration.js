import { useState, useCallback } from 'react'

export function usePRDGeneration() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [regeneratingSection, setRegeneratingSection] = useState(null)
  const [regenerateError, setRegenerateError] = useState(null)

  const generate = useCallback(async (input) => {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const json = await response.json()

      if (!response.ok) {
        setStatus('error')
        setError(json.error || 'PRD generation failed. Please try again.')
        return null
      }

      setStatus('success')
      return json.data
    } catch (err) {
      const msg = err.message?.includes('fetch')
        ? 'Network error. Please check your connection and try again.'
        : (err.message || 'An unexpected error occurred.')
      setStatus('error')
      setError(msg)
      return null
    }
  }, [])

  const regenerateSection = useCallback(async (input, section, currentPrd) => {
    setRegeneratingSection(section)
    setRegenerateError(null)

    try {
      const response = await fetch('/api/regenerate-prd-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, section, currentPrd }),
      })

      const json = await response.json()

      if (!response.ok) {
        setRegenerateError(json.error || 'Section regeneration failed.')
        setRegeneratingSection(null)
        return null
      }

      setRegeneratingSection(null)
      return json.data
    } catch (err) {
      setRegenerateError(err.message || 'An error occurred.')
      setRegeneratingSection(null)
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setRegenerateError(null)
  }, [])

  return {
    status,
    error,
    generate,
    regenerateSection,
    regeneratingSection,
    regenerateError,
    reset,
  }
}
