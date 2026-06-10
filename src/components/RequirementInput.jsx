import { useState, useEffect } from 'react'
import { EXAMPLES } from '../constants/examples'
import { detectRequirementCount } from '../utils/requirementParser'

const MAX_CHARS = 5000
const MIN_CHARS = 50

export default function RequirementInput({ value, onChange, error, onClear }) {
  const remaining = MAX_CHARS - value.length
  const tooShort = value.trim().length > 0 && value.trim().length < MIN_CHARS
  const [parserDismissed, setParserDismissed] = useState(false)

  const reqCount = value.trim().length > 300 ? detectRequirementCount(value) : 1
  const showParserWarning = !parserDismissed && reqCount >= 2

  useEffect(() => { setParserDismissed(false) }, [value])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">Paste your requirement</label>
        <div className="flex items-center gap-3">
          {value && (
            <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Clear
            </button>
          )}
          <span className={`text-xs font-medium ${remaining < 200 ? 'text-orange-500' : 'text-gray-400'}`}>
            {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Paste your user story, PRD excerpt, or acceptance criteria here…\n\nExample: As a registered user, I want to reset my password using my registered email address so that I can regain access to my account if I forget my password. The system should send a reset link valid for 24 hours…"}
        maxLength={MAX_CHARS}
        rows={10}
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white resize-none focus:outline-none focus:ring-2 transition-all ${
          error || tooShort
            ? 'border-red-300 focus:ring-red-200'
            : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'
        }`}
      />

      {showParserWarning && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-800 font-medium">Multiple requirements detected ({reqCount})</p>
            <p className="text-xs text-amber-700 mt-0.5">
              For best coverage, generate one requirement at a time. Or generate all and review coverage gaps in the RTM tab.
            </p>
          </div>
          <button onClick={() => setParserDismissed(true)} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {tooShort && (
        <p className="text-xs text-orange-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Requirement too short — please add more detail ({MIN_CHARS} chars minimum)
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      <div className="space-y-1.5">
        <p className="text-xs text-gray-500 font-medium">Load an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => onChange(ex.text)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-700 rounded-lg text-xs font-medium transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
