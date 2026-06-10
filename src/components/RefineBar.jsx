import { useState } from 'react'

const TAB_LABELS = {
  functional: 'Functional',
  edge: 'Edge Cases',
  negative: 'Negative',
  bdd: 'BDD / Gherkin',
  rtm: 'RTM',
}

export default function RefineBar({ activeTab, onRefine, isRefining, refineError }) {
  const [instruction, setInstruction] = useState('')

  const handleSubmit = () => {
    if (instruction.trim().length < 5) return
    onRefine(instruction.trim())
    setInstruction('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
  }

  return (
    <div className="border border-indigo-100 rounded-xl bg-indigo-50/50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="text-sm font-semibold text-indigo-700">
          Refine: <span className="font-bold">{TAB_LABELS[activeTab]}</span> tab
        </span>
        <span className="text-xs text-indigo-400 ml-auto hidden sm:block">Ctrl+Enter to submit</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`e.g. "Add more timeout edge cases" or "Make BDD scenarios more specific"`}
          maxLength={500}
          disabled={isRefining}
          className="flex-1 px-3 py-2 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder-gray-400 disabled:opacity-60"
        />
        <button
          onClick={handleSubmit}
          disabled={isRefining || instruction.trim().length < 5}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
        >
          {isRefining ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Refining…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refine
            </>
          )}
        </button>
      </div>

      {refineError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {refineError}
        </p>
      )}
    </div>
  )
}
