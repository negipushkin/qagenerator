import { useState } from 'react'

// ─── Inline editable field ─────────────────────────────────────────────

function EditableText({ value, onChange, multiline = false, className = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true) }}
        className={`cursor-text hover:bg-amber-50 hover:ring-1 hover:ring-amber-200 rounded px-0.5 transition-colors inline-block ${className}`}
        title="Click to edit"
      >
        {value || <span className="text-gray-400 italic text-xs">Click to add text</span>}
      </span>
    )
  }

  if (multiline) {
    return (
      <textarea
        className={`w-full border border-indigo-300 rounded-lg p-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${className}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false) }}
        autoFocus
        rows={3}
      />
    )
  }

  return (
    <input
      type="text"
      className={`w-full border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${className}`}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { onChange(draft); setEditing(false) }}
      autoFocus
    />
  )
}

// ─── Section renderers ─────────────────────────────────────────────────

function ExecSummarySection({ data, onUpdate }) {
  const fields = [
    { key: 'vision', label: 'Vision', multiline: true },
    { key: 'problem', label: 'Problem', multiline: true },
    { key: 'solution', label: 'Solution', multiline: true },
    { key: 'target_user', label: 'Target User' },
    { key: 'one_liner', label: 'One-liner', multiline: true },
  ]

  return (
    <div className="space-y-3">
      {fields.map(({ key, label, multiline }) => (
        <div key={key} className="flex gap-3">
          <span className="flex-shrink-0 text-xs font-semibold text-gray-500 uppercase tracking-wide pt-1 w-20">{label}</span>
          <div className="flex-1 text-sm text-gray-800">
            <EditableText
              value={data[key] || ''}
              multiline={multiline}
              onChange={(v) => onUpdate({ ...data, [key]: v })}
              className="w-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function GoalsSection({ data, onUpdate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {['Metric', 'Description', 'Target', 'Measurement Method'].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data || []).map((item, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-800">
                <EditableText value={item.metric || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, metric: v } : d))} />
              </td>
              <td className="px-3 py-2 text-gray-600">
                <EditableText value={item.description || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, description: v } : d))} />
              </td>
              <td className="px-3 py-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  <EditableText value={item.target || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, target: v } : d))} />
                </span>
              </td>
              <td className="px-3 py-2 text-gray-500 text-xs">
                <EditableText value={item.measurement_method || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, measurement_method: v } : d))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PersonasSection({ data, onUpdate }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {(data || []).map((persona, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
          <div className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-2">
            <EditableText value={persona.role || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, role: v } : d))} className="font-semibold" />
          </div>
          {[
            { key: 'context', label: 'Context', multiline: true },
            { key: 'pain', label: 'Pain', multiline: true },
            { key: 'goal', label: 'Goal', multiline: true },
            { key: 'usage_pattern', label: 'Usage', multiline: true },
          ].map(({ key, label, multiline }) => (
            <div key={key} className="flex gap-2 text-xs">
              <span className="font-semibold text-gray-500 w-14 flex-shrink-0 pt-0.5">{label}:</span>
              <EditableText
                value={persona[key] || ''}
                multiline={multiline}
                onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, [key]: v } : d))}
                className="flex-1 text-gray-700"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function UserStoriesSection({ data, onUpdate }) {
  return (
    <div className="space-y-4">
      {(data || []).map((story, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 hover:border-indigo-200 transition-colors">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{story.id}</span>
            <div className="flex-1 text-sm text-gray-800 space-y-1">
              <div className="flex gap-1.5">
                <span className="text-gray-500 text-xs font-medium pt-0.5 flex-shrink-0">As a</span>
                <EditableText value={story.as_a || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, as_a: v } : d))} />
              </div>
              <div className="flex gap-1.5">
                <span className="text-gray-500 text-xs font-medium pt-0.5 flex-shrink-0">I want</span>
                <EditableText value={story.i_want || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, i_want: v } : d))} className="flex-1" />
              </div>
              <div className="flex gap-1.5">
                <span className="text-gray-500 text-xs font-medium pt-0.5 flex-shrink-0">So that</span>
                <EditableText value={story.so_that || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, so_that: v } : d))} className="flex-1" />
              </div>
            </div>
          </div>
          <div className="pl-16">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">Acceptance Criteria</p>
            <ul className="space-y-1">
              {(story.acceptance_criteria || []).map((ac, k) => (
                <li key={k} className="flex gap-2 text-xs text-gray-700">
                  <span className="flex-shrink-0 mt-0.5 text-indigo-400">•</span>
                  <EditableText
                    value={ac}
                    multiline
                    onChange={(v) => {
                      const newAC = story.acceptance_criteria.map((c, l) => l === k ? v : c)
                      onUpdate(data.map((d, j) => j === i ? { ...d, acceptance_criteria: newAC } : d))
                    }}
                    className="flex-1"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

const PRIORITY_COLORS = {
  'Must Have': 'bg-red-100 text-red-700',
  'Should Have': 'bg-amber-100 text-amber-700',
  'Could Have': 'bg-blue-100 text-blue-700',
  "Won't Have": 'bg-gray-100 text-gray-500',
}

function FunctionalReqsSection({ data, onUpdate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {['ID', 'Feature', 'Description', 'Priority', 'Notes'].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data || []).map((req, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-mono text-xs text-indigo-600 font-medium whitespace-nowrap">{req.id}</td>
              <td className="px-3 py-2.5 font-medium text-gray-800">
                <EditableText value={req.feature || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, feature: v } : d))} />
              </td>
              <td className="px-3 py-2.5 text-gray-600 max-w-xs">
                <EditableText value={req.description || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, description: v } : d))} />
              </td>
              <td className="px-3 py-2.5">
                <select
                  value={req.priority || 'Should Have'}
                  onChange={(e) => onUpdate(data.map((d, j) => j === i ? { ...d, priority: e.target.value } : d))}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400 ${PRIORITY_COLORS[req.priority] || 'bg-gray-100 text-gray-500'}`}
                >
                  {Object.keys(PRIORITY_COLORS).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </td>
              <td className="px-3 py-2.5 text-gray-500 text-xs max-w-xs">
                <EditableText value={req.notes || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, notes: v } : d))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TechnicalReqsSection({ data, onUpdate }) {
  const categories = [...new Set((data || []).map((r) => r.category))]

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div key={cat}>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{cat}</div>
          <div className="space-y-2">
            {(data || []).filter((r) => r.category === cat).map((req, i) => {
              const globalIdx = data.indexOf(req)
              return (
                <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 space-y-1">
                    <div className="text-sm text-gray-800">
                      <EditableText value={req.requirement || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === globalIdx ? { ...d, requirement: v } : d))} className="w-full" />
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      <EditableText value={req.rationale || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === globalIdx ? { ...d, rationale: v } : d))} className="w-full" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function ReleasePlanSection({ data, onUpdate }) {
  const phaseColors = ['bg-blue-50 border-blue-200', 'bg-violet-50 border-violet-200', 'bg-emerald-50 border-emerald-200']
  const textColors = ['text-blue-800', 'text-violet-800', 'text-emerald-800']

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {(data || []).map((phase, i) => (
        <div key={i} className={`rounded-xl border-2 p-4 space-y-3 ${phaseColors[i] || 'bg-gray-50 border-gray-200'}`}>
          <div className={`font-bold text-sm ${textColors[i] || 'text-gray-800'}`}>
            <EditableText value={phase.phase || ''} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, phase: v } : d))} className="font-bold" />
          </div>
          {[
            { key: 'scope', label: 'Scope', multiline: true },
            { key: 'timeline', label: 'Timeline' },
            { key: 'success_gate', label: 'Success Gate', multiline: true },
          ].map(({ key, label, multiline }) => (
            <div key={key} className="text-xs space-y-0.5">
              <div className="font-semibold text-gray-500">{label}</div>
              <EditableText value={phase[key] || ''} multiline={multiline} onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, [key]: v } : d))} className="text-gray-700 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const RAID_COLORS = {
  Risk: 'bg-red-100 text-red-700',
  Assumption: 'bg-amber-100 text-amber-700',
  Issue: 'bg-orange-100 text-orange-700',
  Dependency: 'bg-blue-100 text-blue-700',
}

const IMPACT_COLORS = {
  High: 'text-red-600 font-semibold',
  Medium: 'text-amber-600 font-medium',
  Low: 'text-green-600',
}

function RaidLogSection({ data, onUpdate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {['Type', 'Item', 'Impact', 'Mitigation'].map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data || []).map((item, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${RAID_COLORS[item.type] || 'bg-gray-100 text-gray-600'}`}>
                  {item.type}
                </span>
              </td>
              <td className="px-3 py-2.5 text-gray-800 max-w-xs">
                <EditableText value={item.item || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, item: v } : d))} />
              </td>
              <td className={`px-3 py-2.5 text-xs ${IMPACT_COLORS[item.impact] || 'text-gray-600'}`}>
                {item.impact}
              </td>
              <td className="px-3 py-2.5 text-gray-500 text-xs max-w-xs">
                <EditableText value={item.mitigation || ''} multiline onChange={(v) => onUpdate(data.map((d, j) => j === i ? { ...d, mitigation: v } : d))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Section renderer map ──────────────────────────────────────────────

function SectionContent({ sectionKey, data, onUpdate }) {
  switch (sectionKey) {
    case 'executive_summary':   return <ExecSummarySection data={data} onUpdate={onUpdate} />
    case 'goals_and_metrics':   return <GoalsSection data={data} onUpdate={onUpdate} />
    case 'user_personas':       return <PersonasSection data={data} onUpdate={onUpdate} />
    case 'user_stories':        return <UserStoriesSection data={data} onUpdate={onUpdate} />
    case 'functional_requirements': return <FunctionalReqsSection data={data} onUpdate={onUpdate} />
    case 'technical_requirements':  return <TechnicalReqsSection data={data} onUpdate={onUpdate} />
    case 'release_plan':        return <ReleasePlanSection data={data} onUpdate={onUpdate} />
    case 'raid_log':            return <RaidLogSection data={data} onUpdate={onUpdate} />
    default: return <pre className="text-xs text-gray-500 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
  }
}

function countWords(data) {
  if (!data) return 0
  return JSON.stringify(data)
    .replace(/["{}\[\],]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2).length
}

// ─── Main accordion component ──────────────────────────────────────────

export default function SectionAccordion({ sectionKey, title, number, data, onUpdate, onRegenerate, isRegenerating, initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const wordCount = countWords(data)
  const isPopulated = wordCount > 5

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
          {number}
        </span>
        <span className="flex-1 font-semibold text-gray-800 text-sm">{title}</span>
        <div className="flex items-center gap-2 ml-auto">
          {isPopulated && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          <span className="text-xs text-gray-400 hidden sm:block">{wordCount} words</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRegenerate() }}
            disabled={isRegenerating}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors disabled:opacity-40"
            title="Regenerate this section"
          >
            {isRegenerating ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
          <div className="text-xs text-gray-400 mb-3 italic">Click on any text to edit it inline.</div>
          <SectionContent sectionKey={sectionKey} data={data} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  )
}
