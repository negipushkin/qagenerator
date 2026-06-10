const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

const ACTIVE_STYLES = {
  All: 'bg-indigo-600 text-white border-indigo-600',
  Critical: 'bg-red-600 text-white border-red-600',
  High: 'bg-orange-500 text-white border-orange-500',
  Medium: 'bg-yellow-500 text-white border-yellow-500',
  Low: 'bg-green-600 text-white border-green-600',
}

export default function PriorityFilter({ value, onChange, counts }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-gray-500 font-medium mr-1">Filter:</span>
      {PRIORITIES.map((p) => {
        const count = p === 'All' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[p] || 0)
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              value === p
                ? ACTIVE_STYLES[p]
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {p}
            <span className={`text-xs ${value === p ? 'opacity-80' : 'text-gray-400'}`}>
              ({count})
            </span>
          </button>
        )
      })}
    </div>
  )
}
