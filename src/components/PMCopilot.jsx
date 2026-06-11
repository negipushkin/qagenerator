import { useState, useCallback } from 'react'
import InputPanel from './prd/InputPanel'
import PRDLoadingProgress from './prd/PRDLoadingProgress'
import PRDDisplay from './prd/PRDDisplay'
import PRDExportBar from './prd/PRDExportBar'
import HandoffButton from './prd/HandoffButton'
import { usePRDGeneration } from '../hooks/usePRDGeneration'

export default function PMCopilot({ onHandoff, handoffTriggered }) {
  const [prdScreen, setPrdScreen] = useState('input')
  const [prdData, setPrdData] = useState(null)
  const [lastInput, setLastInput] = useState('')

  const { status, error, generate, regenerateSection, regeneratingSection } = usePRDGeneration()

  const handleGenerate = useCallback(async (input) => {
    setLastInput(input)
    setPrdScreen('loading')
    const data = await generate(input)
    if (data) {
      setPrdData(data)
      setPrdScreen('results')
    } else {
      setPrdScreen('input')
    }
  }, [generate])

  const handleUpdateSection = useCallback((sectionKey, newData) => {
    setPrdData((prev) => ({ ...prev, [sectionKey]: newData }))
  }, [])

  const handleRegenerateSection = useCallback(async (sectionKey) => {
    if (!prdData || !lastInput) return
    const newData = await regenerateSection(lastInput, sectionKey, prdData)
    if (newData) {
      setPrdData((prev) => ({ ...prev, [sectionKey]: newData }))
    }
  }, [prdData, lastInput, regenerateSection])

  const handleNewPrd = () => {
    setPrdData(null)
    setPrdScreen('input')
  }

  return (
    <div className="min-h-0">
      {prdScreen === 'input' && (
        <InputPanel
          onGenerate={handleGenerate}
          loading={status === 'loading'}
          error={error}
        />
      )}

      {prdScreen === 'loading' && (
        <main className="max-w-3xl mx-auto px-4">
          <PRDLoadingProgress />
        </main>
      )}

      {prdScreen === 'results' && prdData && (
        <>
          <main className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <div />
              <button
                onClick={handleNewPrd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New PRD
              </button>
            </div>

            <PRDDisplay
              prd={prdData}
              onUpdateSection={handleUpdateSection}
              onRegenerateSection={handleRegenerateSection}
              regeneratingSection={regeneratingSection}
            />

            <HandoffButton prd={prdData} onHandoff={onHandoff} />
          </main>

          <PRDExportBar prd={prdData} />
        </>
      )}
    </div>
  )
}
