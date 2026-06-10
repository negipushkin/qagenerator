import { useState } from 'react'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function HistoryDrawer({ open, onClose, history, onReload, onRegenerate, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      onClear()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Generation History</h2>
            <p className="text-xs text-gray-500">Last {history.length} sessions</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-3">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">No history yet. Generate your first test suite to see it here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {history.map((entry) => (
                <li key={entry.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 mb-1">{formatDate(entry.timestamp)}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{entry.inputPreview}</p>
                      <div className="flex gap-2 mt-2">
                        {entry.data && (
                          <span className="text-xs text-gray-400">
                            {(entry.data.functional?.length || 0) + (entry.data.edge?.length || 0) + (entry.data.negative?.length || 0)} cases
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { onReload(entry); onClose() }}
                      className="flex-1 px-2 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { onRegenerate(entry.input); onClose() }}
                      className="flex-1 px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Re-generate
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <button
              onClick={handleClear}
              className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                confirmClear
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {confirmClear ? 'Tap again to confirm clear' : 'Clear history'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
