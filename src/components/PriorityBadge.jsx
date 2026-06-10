const PRIORITY_STYLES = {
  Critical: 'bg-red-50 text-red-700 border-red-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low: 'bg-green-50 text-green-700 border-green-200',
}

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || 'bg-gray-50 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {priority}
    </span>
  )
}
