import { useState, useEffect, useRef } from 'react'
import { EXAMPLES } from '../constants/examples'
import { detectRequirementCount } from '../utils/requirementParser'
import { extractTextFromFile } from '../utils/fileExtractor'

const MAX_CHARS = 5000
const MIN_CHARS = 50
const ACCEPTED = '.pdf,.docx,.txt,.md'

export default function RequirementInput({ value, onChange, error, onClear }) {
  const remaining = MAX_CHARS - value.length
  const tooShort = value.trim().length > 0 && value.trim().length < MIN_CHARS
  const [parserDismissed, setParserDismissed] = useState(false)
  const [fileState, setFileState] = useState({ name: null, loading: false, error: null })
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const reqCount = value.trim().length > 300 ? detectRequirementCount(value) : 1
  const showParserWarning = !parserDismissed && reqCount >= 2

  useEffect(() => { setParserDismissed(false) }, [value])

  const handleFile = async (file) => {
    if (!file) return
    setFileState({ name: file.name, loading: true, error: null })
    try {
      const text = await extractTextFromFile(file)
      onChange(text.slice(0, MAX_CHARS))
      setFileState({ name: file.name, loading: false, error: null })
    } catch (err) {
      setFileState({ name: null, loading: false, error: err.message })
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">Paste your requirement</label>
        <div className="flex items-center gap-3">
          {value && (
            <button
              onClick={() => { onClear(); setFileState({ name: null, loading: false, error: null }) }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
          <span className={`text-xs font-medium ${remaining < 200 ? 'text-orange-500' : 'text-gray-400'}`}>
            {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      {/* File upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center justify-between gap-3 px-4 py-3 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          dragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="flex items-center gap-3 min-w-0">
          {fileState.loading ? (
            <svg className="animate-spin w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )}
          <div className="min-w-0">
            {fileState.name ? (
              <p className="text-sm font-medium text-indigo-700 truncate">{fileState.name}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {dragging ? 'Drop file here' : 'Upload a PRD or document'}
              </p>
            )}
            <p className="text-xs text-gray-400">PDF, DOCX, TXT, MD · drag & drop or click</p>
          </div>
        </div>

        {fileState.name && !fileState.loading && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1 flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Loaded
          </span>
        )}
      </div>

      {fileState.error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {fileState.error}
        </p>
      )}

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
