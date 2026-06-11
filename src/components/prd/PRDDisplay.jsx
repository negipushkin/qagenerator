import { useState } from 'react'
import SectionAccordion from './SectionAccordion'
import { SECTION_LABELS } from '../../utils/prdSystemPrompt'

const SECTIONS = [
  'executive_summary',
  'goals_and_metrics',
  'user_personas',
  'user_stories',
  'functional_requirements',
  'technical_requirements',
  'release_plan',
  'raid_log',
]

export default function PRDDisplay({ prd, onUpdateSection, onRegenerateSection, regeneratingSection }) {
  const [allExpanded, setAllExpanded] = useState(false)
  const [expandKey, setExpandKey] = useState(0)

  const totalWords = SECTIONS.reduce((sum, key) => {
    const data = prd[key]
    if (!data) return sum
    return sum + JSON.stringify(data).replace(/["{}\[\],]/g, ' ').split(/\s+/).filter((w) => w.length > 2).length
  }, 0)

  const storyCount = prd.user_stories?.length || 0
  const reqCount = prd.functional_requirements?.length || 0

  return (
    <div className="space-y-4 animate-fade-in">
      {/* PRD header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">PRD Generated</h2>
          <p className="text-sm text-gray-500 mt-1">
            {storyCount} user {storyCount === 1 ? 'story' : 'stories'} · {reqCount} requirements · ~{totalWords} words · 8 sections
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            key={expandKey}
            onClick={() => { setAllExpanded((v) => !v); setExpandKey((k) => k + 1) }}
            className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* One-liner callout */}
      {prd.executive_summary?.one_liner && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-violet-800 italic">"{prd.executive_summary.one_liner}"</p>
        </div>
      )}

      {/* Section accordions */}
      <div className="space-y-2" key={expandKey}>
        {SECTIONS.map((key, i) => (
          <SectionAccordionWrapper
            key={key}
            sectionKey={key}
            title={SECTION_LABELS[key]}
            number={i + 1}
            data={prd[key]}
            onUpdate={(newData) => onUpdateSection(key, newData)}
            onRegenerate={() => onRegenerateSection(key)}
            isRegenerating={regeneratingSection === key}
            forceExpanded={allExpanded}
          />
        ))}
      </div>
    </div>
  )
}

function SectionAccordionWrapper({ forceExpanded, ...props }) {
  return <SectionAccordion {...props} initialExpanded={forceExpanded} />
}
