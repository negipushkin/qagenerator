const DOMAINS = [
  { value: 'General', icon: '⚙️' },
  { value: 'Healthcare', icon: '🏥' },
  { value: 'Fintech', icon: '💳' },
  { value: 'E-commerce', icon: '🛒' },
  { value: 'SaaS', icon: '☁️' },
]

export default function DomainSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Domain context</label>
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              value === d.value
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <span>{d.icon}</span>
            {d.value}
          </button>
        ))}
      </div>
      {value !== 'General' && (
        <p className="text-xs text-indigo-600">
          {value}-specific scenarios will be included in the generated test suite.
        </p>
      )}
    </div>
  )
}
