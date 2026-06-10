import { useState, useCallback } from 'react'
import LandingHeader from './components/LandingHeader'
import RequirementInput from './components/RequirementInput'
import GenerateButton from './components/GenerateButton'
import LoadingProgress from './components/LoadingProgress'
import OutputTabs from './components/OutputTabs'
import ExportBar from './components/ExportBar'
import HistoryDrawer from './components/HistoryDrawer'
import DomainSelector from './components/DomainSelector'
import RefineBar from './components/RefineBar'
import { useGeneration } from './hooks/useGeneration'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [requirement, setRequirement] = useState('')
  const [domain, setDomain] = useState('General')
  const [activeTab, setActiveTab] = useState('functional')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [results, setResults] = useState(null)
  const [regeneratingTab, setRegeneratingTab] = useState(null)

  const { status, error, generate, refineTab, isRefining, refineError } = useGeneration()
  const { history, addEntry, clearHistory } = useHistory()

  const handleStart = () => setScreen('input')

  const handleExampleSelect = (example) => {
    setRequirement(example.text)
    setScreen('input')
  }

  const handleGenerate = useCallback(async () => {
    if (requirement.trim().length < 50) return
    setScreen('loading')
    setActiveTab('functional')
    const data = await generate(requirement, domain)
    if (data) {
      setResults(data)
      addEntry(requirement, data)
      setScreen('results')
    } else {
      setScreen('input')
    }
  }, [requirement, domain, generate, addEntry])

  const updateTestCase = useCallback((tabKey, id, field, value) => {
    setResults((prev) => ({
      ...prev,
      [tabKey]: prev[tabKey].map((tc) =>
        tc.id === id ? { ...tc, [field]: value } : tc
      ),
    }))
  }, [])

  const handleRefine = useCallback(async (instruction) => {
    if (!results) return
    const updated = await refineTab(requirement, results[activeTab], activeTab, instruction)
    if (updated) {
      setResults((prev) => ({ ...prev, [activeTab]: updated }))
    }
  }, [results, activeTab, requirement, refineTab])

  const handleRegenerateTab = useCallback(async (tabKey) => {
    if (!results) return
    setRegeneratingTab(tabKey)
    const instruction = `Completely regenerate this section with fresh, diverse, and comprehensive test cases. Do not reuse any existing test case IDs or titles.`
    const updated = await refineTab(requirement, results[tabKey], tabKey, instruction)
    if (updated) {
      setResults((prev) => ({ ...prev, [tabKey]: updated }))
    }
    setRegeneratingTab(null)
  }, [results, requirement, refineTab])

  const handleNewGeneration = () => {
    setRequirement('')
    setResults(null)
    setScreen('input')
  }

  const handleReload = (entry) => {
    setResults(entry.data)
    setActiveTab('functional')
    setScreen('results')
  }

  const handleRegenerate = (input) => {
    setRequirement(input)
    setScreen('input')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {screen !== 'landing' && (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-bold text-gray-900 text-sm">Created by Pushkin</span>
            </div>
            <div className="flex items-center gap-2">
              {screen === 'results' && (
                <button
                  onClick={handleNewGeneration}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Generation
                </button>
              )}
              <button
                onClick={() => setHistoryOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
                {history.length > 0 && (
                  <span className="ml-0.5 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {screen === 'landing' && (
        <LandingHeader onStart={handleStart} onExampleSelect={handleExampleSelect} />
      )}

      {screen === 'input' && (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Test Suite</h1>
            <p className="text-gray-500 text-sm mt-1">Paste your requirement below — user story, PRD excerpt, or acceptance criteria.</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <RequirementInput
            value={requirement}
            onChange={setRequirement}
            error={null}
            onClear={() => setRequirement('')}
          />

          <DomainSelector value={domain} onChange={setDomain} />

          <div className="flex items-center justify-end pt-2">
            <GenerateButton
              onClick={handleGenerate}
              loading={status === 'loading'}
              disabled={requirement.trim().length < 50}
            />
          </div>
        </main>
      )}

      {screen === 'loading' && (
        <main className="max-w-3xl mx-auto px-4">
          <LoadingProgress />
        </main>
      )}

      {screen === 'results' && results && (
        <main className="max-w-5xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Suite Generated</h1>
              <p className="text-sm text-gray-500 mt-1">
                {(results.functional?.length || 0) + (results.edge?.length || 0) + (results.negative?.length || 0) + (results.bdd?.length || 0)} test cases across 5 output types
                {domain !== 'General' && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {domain}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3 text-sm text-center flex-shrink-0">
              {[
                { label: 'Functional', count: results.functional?.length || 0, color: 'text-indigo-600' },
                { label: 'Edge', count: results.edge?.length || 0, color: 'text-blue-600' },
                { label: 'Negative', count: results.negative?.length || 0, color: 'text-red-600' },
                { label: 'BDD', count: results.bdd?.length || 0, color: 'text-purple-600' },
              ].map(({ label, count, color }) => (
                <div key={label} className="hidden sm:block">
                  <div className={`text-xl font-bold ${color}`}>{count}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <OutputTabs
            data={results}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onUpdate={updateTestCase}
            onRegenerateTab={handleRegenerateTab}
            regeneratingTab={regeneratingTab}
          />

          <RefineBar
            activeTab={activeTab}
            onRefine={handleRefine}
            isRefining={isRefining}
            refineError={refineError}
          />
        </main>
      )}

      {screen === 'results' && results && (
        <ExportBar data={results} activeTab={activeTab} />
      )}

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onReload={handleReload}
        onRegenerate={handleRegenerate}
        onClear={clearHistory}
      />
    </div>
  )
}
