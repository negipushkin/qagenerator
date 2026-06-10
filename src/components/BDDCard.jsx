import { useState, useRef, useEffect } from 'react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0" title="Copy Gherkin">
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function buildGherkin(tc) {
  const lines = [`Feature: ${tc.feature}`, `  Scenario: ${tc.scenario}`]
  tc.given?.forEach((s) => lines.push(`    Given ${s}`))
  tc.when?.forEach((s) => lines.push(`    When ${s}`))
  tc.then?.forEach((s) => lines.push(`    Then ${s}`))
  tc.and?.forEach((s) => lines.push(`    And ${s}`))
  return lines.join('\n')
}

function EditableInline({ value, onSave, placeholder = 'Click to edit' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const commit = () => { setEditing(false); if (draft.trim() !== value) onSave(draft.trim()) }

  if (editing) {
    return (
      <input
        ref={ref}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false) } }}
        className="px-1 py-0.5 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-200 bg-white w-full"
      />
    )
  }
  return (
    <span onClick={() => { setDraft(value); setEditing(true) }} className="cursor-text hover:bg-indigo-50 rounded px-0.5 transition-colors group" title="Click to edit">
      {value || placeholder}
      <svg className="w-3 h-3 text-indigo-300 inline ml-1 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </span>
  )
}

export default function BDDCard({ tc, index, onUpdate }) {
  const [open, setOpen] = useState(index < 2)
  const [isEdited, setIsEdited] = useState(false)

  const update = (field, value) => {
    onUpdate?.(tc.id, field, value)
    setIsEdited(true)
  }

  const updateArrayItem = (field, i, value) => {
    const arr = [...(tc[field] || [])]
    arr[i] = value
    update(field, arr)
  }

  const gherkin = buildGherkin(tc)

  return (
    <div className={`border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isEdited ? 'border-indigo-200' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded flex-shrink-0">{tc.id}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{tc.scenario}</p>
            <p className="text-xs text-gray-500 truncate">Feature: {tc.feature}</p>
          </div>
          {isEdited && <span className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded flex-shrink-0">Edited</span>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <CopyButton text={gherkin} />
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-fade-in">
          <pre className="mt-3 bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
            <span className="text-purple-400">Feature: </span>
            <EditableInline value={tc.feature} onSave={(v) => update('feature', v)} />{'\n'}
            {'  '}<span className="text-blue-400">Scenario: </span>
            <EditableInline value={tc.scenario} onSave={(v) => update('scenario', v)} />{'\n'}
            {tc.given?.map((s, i) => (
              <span key={`g${i}`}>{'    '}<span className="text-green-400">Given </span><EditableInline value={s} onSave={(v) => updateArrayItem('given', i, v)} />{'\n'}</span>
            ))}
            {tc.when?.map((s, i) => (
              <span key={`w${i}`}>{'    '}<span className="text-yellow-400">When </span><EditableInline value={s} onSave={(v) => updateArrayItem('when', i, v)} />{'\n'}</span>
            ))}
            {tc.then?.map((s, i) => (
              <span key={`t${i}`}>{'    '}<span className="text-cyan-400">Then </span><EditableInline value={s} onSave={(v) => updateArrayItem('then', i, v)} />{'\n'}</span>
            ))}
            {tc.and?.map((s, i) => (
              <span key={`a${i}`}>{'    '}<span className="text-orange-400">And </span><EditableInline value={s} onSave={(v) => updateArrayItem('and', i, v)} />{'\n'}</span>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
