const COVERAGE_STYLES = {
  Covered: 'bg-green-50 text-green-700 border-green-200',
  Partial: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Not Covered': 'bg-red-50 text-red-700 border-red-200',
}

export default function RTMTable({ data }) {
  if (!data?.length) return <p className="text-sm text-gray-500 py-8 text-center">No RTM data available.</p>

  const covered = data.filter((r) => r.coverage_status === 'Covered').length
  const pct = Math.round((covered / data.length) * 100)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{data.length}</div>
          <div className="text-xs text-gray-500">Requirements</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{covered}</div>
          <div className="text-xs text-gray-500">Covered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{pct}%</div>
          <div className="text-xs text-gray-500">Coverage</div>
        </div>
        <div className="flex-1 min-w-32 flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Req ID', 'Requirement', 'Linked Test Cases', 'Coverage'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, i) => {
              const ids = Array.isArray(row.linked_test_ids) ? row.linked_test_ids : [row.linked_test_ids]
              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-indigo-600 whitespace-nowrap">
                    {row.req_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                    {row.req_text}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ids.map((id) => (
                        <span key={id} className="text-xs font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">
                          {id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${COVERAGE_STYLES[row.coverage_status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {row.coverage_status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
