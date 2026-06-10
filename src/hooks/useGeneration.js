import { useState, useCallback } from 'react'

const INITIAL_STATE = { status: 'idle', data: null, error: null }

export function useGeneration() {
  const [state, setState] = useState(INITIAL_STATE)
  const [refineState, setRefineState] = useState({ loading: false, error: null })

  const generate = useCallback(async (requirementText, domain = 'General') => {
    setState({ status: 'loading', data: null, error: null })

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: requirementText, domain }),
      })

      const json = await response.json()

      if (!response.ok) {
        setState({ status: 'error', data: null, error: json.error || 'Generation failed. Please try again.' })
        return null
      }

      setState({ status: 'success', data: json.data, error: null })
      return json.data
    } catch (err) {
      const msg = err.message?.includes('fetch')
        ? 'Network error. Please check your connection and try again.'
        : (err.message || 'An unexpected error occurred.')
      setState({ status: 'error', data: null, error: msg })
      return null
    }
  }, [])

  const refineTab = useCallback(async (requirement, existingTabData, targetTab, instruction) => {
    setRefineState({ loading: true, error: null })

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, existingTabData, targetTab, instruction }),
      })

      const json = await response.json()

      if (!response.ok) {
        setRefineState({ loading: false, error: json.error || 'Refinement failed. Please try again.' })
        return null
      }

      setRefineState({ loading: false, error: null })
      return json.data
    } catch (err) {
      const msg = err.message?.includes('fetch')
        ? 'Network error. Please check your connection.'
        : (err.message || 'An unexpected error occurred.')
      setRefineState({ loading: false, error: msg })
      return null
    }
  }, [])

  const reset = useCallback(() => setState(INITIAL_STATE), [])

  return {
    ...state,
    generate,
    reset,
    refineTab,
    isRefining: refineState.loading,
    refineError: refineState.error,
    clearRefineError: () => setRefineState((s) => ({ ...s, error: null })),
  }
}
