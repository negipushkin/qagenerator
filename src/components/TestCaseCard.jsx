import { useState, useRef, useEffect } from 'react'
import PriorityBadge from './PriorityBadge'

function CopyButton({ text, label = 'Copy', icon = 'clipboard' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
      title={label}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : icon === 'jira' ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.762a1.005 1.005 0 0 0-1.001-1.005zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.019 12.49V1.005A1.001 1.001 0 0 0 23.013 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function buildCopyText(tc, variant) {
  const steps = Array.isArray(tc.steps) ? tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : tc.steps
  let text = `ID: ${tc.id}\nTitle: ${tc.title}\nPriority: ${tc.priority}\nPrecondition: ${tc.precondition}\n\nSteps:\n${steps}\n\nExpected Result: ${tc.expected}`
  if (variant === 'edge') text += `\nEdge Category: ${tc.edge_category}`
  if (variant === 'negative') text += `\nExpected Error: ${tc.expected_error}`
  text += `\nRequirement Ref: ${tc.req_ref}`
  return text
}

function buildJiraText(tc, variant) {
  const steps = Array.isArray(tc.steps) ? tc.steps.map((s) => `# ${s}`).join('\n') : `# ${tc.steps}`
  let text = `*[${tc.id}] ${tc.title}*\nPriority: ${tc.priority}\nReq Ref: ${tc.req_ref}\n\n*Precondition:* ${tc.precondition}\n\n*Steps:*\n${steps}\n\n*Expected Result:* ${tc.expected}`
  if (variant === 'edge') text += `\n\n*Edge Category:* ${tc.edge_category}`
  if (variant === 'negative') text += `\n\n*Expected Error:* ${tc.expected_error}`
  return text
}

function EditableField({ value, onSave, multiline = false, className = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)

  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft.trim() !== value) onSave(draft.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setDraft(value); setEditing(false) }
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit() }
    if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) commit()
  }

  if (editing) {
    const sharedProps = {
      ref,
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: handleKeyDown,
      className: `w-full px-2 py-1 text-sm border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white ${className}`,
    }
    return multiline
      ? <textarea {...sharedProps} rows={3} />
      : <input {...sharedProps} type="text" />
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true) }}
      className={`cursor-text hover:bg-indigo-50 rounded px-1 -ml-1 transition-colors group relative ${className}`}
      title="Click to edit"
    >
      {value}
      <svg className="w-3 h-3 text-indigo-300 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </span>
  )
}

function EditableStep({ value, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)

  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft.trim() !== value) onSave(draft.trim())
  }

  return editing ? (
    <div className="flex gap-1">
      <input
        ref={ref}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        }}
        className="flex-1 px-2 py-0.5 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
      />
    </div>
  ) : (
    <span
      onClick={() => { setDraft(value); setEditing(true) }}
      className="cursor-text hover:bg-indigo-50 rounded px-1 -ml-1 transition-colors group"
      title="Click to edit"
    >
      {value}
      <svg className="w-3 h-3 text-indigo-300 inline ml-1 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </span>
  )
}

export default function TestCaseCard({ tc, variant = 'functional', index, onUpdate }) {
  const [open, setOpen] = useState(index < 3)
  const [isEdited, setIsEdited] = useState(false)
  const steps = Array.isArray(tc.steps) ? tc.steps : [tc.steps]

  const update = (field, value) => {
    onUpdate?.(tc.id, field, value)
    setIsEdited(true)
  }

  const updateStep = (stepIndex, value) => {
    const newSteps = [...steps]
    newSteps[stepIndex] = value
    update('steps', newSteps)
  }

  const addStep = () => update('steps', [...steps, 'New step'])
  const removeStep = (i) => update('steps', steps.filter((_, idx) => idx !== i))

  return (
    <div className={`border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isEdited ? 'border-indigo-200' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
            {tc.id}
          </span>
          <span className="text-sm font-medium text-gray-800 truncate">{tc.title}</span>
          {isEdited && (
            <span className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded flex-shrink-0">Edited</span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <PriorityBadge priority={tc.priority} />
          <CopyButton text={buildJiraText(tc, variant)} label="Copy as Jira" icon="jira" />
          <CopyButton text={buildCopyText(tc, variant)} label="Copy" />
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-gray-100 animate-fade-in">
          {tc.precondition && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precondition</span>
              <p className="text-sm text-gray-700 mt-0.5">
                <EditableField value={tc.precondition} onSave={(v) => update('precondition', v)} multiline />
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</span>
              <button onClick={addStep} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">+ Add step</button>
            </div>
            <ol className="mt-1 space-y-1">
              {steps.map((step, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2 group/step items-start">
                  <span className="text-indigo-500 font-semibold flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <EditableStep value={step} onSave={(v) => updateStep(i, v)} onDelete={() => removeStep(i)} />
                  <button
                    onClick={() => removeStep(i)}
                    className="opacity-0 group-hover/step:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                    title="Remove step"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected Result</span>
            <p className="text-sm text-gray-700 mt-0.5">
              <EditableField value={tc.expected} onSave={(v) => update('expected', v)} multiline />
            </p>
          </div>

          {variant === 'edge' && tc.edge_category && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Edge Category</span>
              <p className="text-sm text-indigo-700 font-medium mt-0.5">
                <EditableField value={tc.edge_category} onSave={(v) => update('edge_category', v)} />
              </p>
            </div>
          )}

          {variant === 'negative' && tc.expected_error && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Expected Error</span>
              <p className="text-sm text-red-700 mt-0.5 bg-red-50 px-3 py-1.5 rounded-lg">
                <EditableField value={tc.expected_error} onSave={(v) => update('expected_error', v)} multiline className="text-red-700" />
              </p>
            </div>
          )}

          {tc.req_ref && (
            <div className="pt-1 border-t border-gray-100">
              <span className="text-xs text-gray-400">Req Ref: <span className="font-mono text-gray-500">{tc.req_ref}</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
