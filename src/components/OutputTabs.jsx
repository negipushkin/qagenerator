import { useState } from 'react'
import TestCaseCard from './TestCaseCard'
import BDDCard from './BDDCard'
import RTMTable from './RTMTable'
import PriorityFilter from './PriorityFilter'

const TABS = [
  { key: 'functional', label: 'Functional' },
  { key: 'edge', label: 'Edge Cases' },
  { key: 'negative', label: 'Negative' },
  { key: 'bdd', label: 'BDD / Gherkin' },
  { key: 'rtm', label: 'RTM' },
]

const FILTERABLE_TABS = ['functional', 'edge', 'negative']

function priorityCounts(items) {
  return (items || []).reduce((acc, tc) => {
    acc[tc.priority] = (acc[tc.priority] || 0) + 1
    return acc
  }, {})
}

export default function OutputTabs({ data, activeTab, onTabChange, onUpdate, onRegenerateTab, regeneratingTab }) {
  const [priorityFilter, setPriorityFilter] = useState('All')

  const counts = {
    functional: data.functional?.length || 0,
    edge: data.edge?.length || 0,
    negative: data.negative?.length || 0,
    bdd: data.bdd?.length || 0,
    rtm: data.rtm?.length || 0,
  }

  const handleTabChange = (key) => {
    onTabChange(key)
    setPriorityFilter('All')
  }

  const activeItems = data[activeTab] || []
  const filteredItems = FILTERABLE_TABS.includes(activeTab) && priorityFilter !== 'All'
    ? activeItems.filter((tc) => tc.priority === priorityFilter)
    : activeItems

  const isRegenerating = regeneratingTab === activeTab

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {FILTERABLE_TABS.includes(activeTab) && activeItems.length > 0 && (
          <PriorityFilter
            value={priorityFilter}
            onChange={setPriorityFilter}
            counts={priorityCounts(activeItems)}
          />
        )}
        {priorityFilter !== 'All' && FILTERABLE_TABS.includes(activeTab) && (
          <span className="text-xs text-gray-500 ml-auto">
            Showing {filteredItems.length} of {activeItems.length}
          </span>
        )}
        {onRegenerateTab && (
          <button
            onClick={() => onRegenerateTab(activeTab)}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 rounded-lg transition-colors ml-auto"
            title="Regenerate this tab with fresh content"
          >
            {isRegenerating ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Regenerating…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate tab
              </>
            )}
          </button>
        )}
      </div>

      <div className="animate-fade-in">
        {(activeTab === 'functional' || activeTab === 'edge' || activeTab === 'negative') && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No {priorityFilter !== 'All' ? priorityFilter : ''} test cases found.
              </p>
            ) : (
              filteredItems.map((tc, i) => (
                <TestCaseCard
                  key={tc.id}
                  tc={tc}
                  variant={activeTab}
                  index={i}
                  onUpdate={(id, field, value) => onUpdate?.(activeTab, id, field, value)}
                />
              ))
            )}
          </div>
        )}
        {activeTab === 'bdd' && (
          <div className="space-y-3">
            {(data.bdd || []).map((tc, i) => (
              <BDDCard
                key={tc.id}
                tc={tc}
                index={i}
                onUpdate={(id, field, value) => onUpdate?.('bdd', id, field, value)}
              />
            ))}
          </div>
        )}
        {activeTab === 'rtm' && <RTMTable data={data.rtm} />}
      </div>
    </div>
  )
}
