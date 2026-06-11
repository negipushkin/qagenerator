import { formatHandoffContent } from '../../utils/prdExportUtils'

export default function HandoffButton({ prd, onHandoff }) {
  if (!prd) return null

  const storyCount = prd.user_stories?.length || 0
  const reqCount = (prd.functional_requirements || []).filter(
    (r) => r.priority === 'Must Have' || r.priority === 'Should Have'
  ).length

  const handleClick = () => {
    const content = formatHandoffContent(prd)
    onHandoff(content)
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 p-5 flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="font-semibold text-indigo-800 text-sm">Ready to generate the test suite?</span>
        </div>
        <p className="text-xs text-indigo-600">
          {storyCount} user {storyCount === 1 ? 'story' : 'stories'} + {reqCount} must/should requirements will be pre-loaded into the QA Generator.
        </p>
      </div>
      <button
        onClick={handleClick}
        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Generate Test Suite from this PRD
      </button>
    </div>
  )
}
