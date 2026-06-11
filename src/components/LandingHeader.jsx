import { EXAMPLES } from '../constants/examples'

export default function LandingHeader({ onStart, onExampleSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        <p className="text-sm text-gray-500">
          Built by <span className="font-semibold text-indigo-600">Pushkin</span>
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Powered · Idea to QA in Under 2 Minutes
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          From Product Idea to{' '}
          <span className="text-indigo-600">Full Test Suite</span>
          {' '}— In One Tool
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Write your PRD in under 90 seconds with AI, then generate functional tests, edge cases, BDD scenarios, and a traceability matrix — all without switching tools.
        </p>

        {/* Module flow diagram */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-violet-800">Module 1</div>
              <div className="text-sm font-semibold text-violet-900">PM Co-Pilot</div>
              <div className="text-xs text-violet-600">Idea → PRD</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-indigo-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs font-medium hidden sm:block">1-click handoff</span>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-indigo-800">Module 2</div>
              <div className="text-sm font-semibold text-indigo-900">QA Generator</div>
              <div className="text-xs text-indigo-600">PRD → Test Suite</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500 font-medium">Jump straight to test generation:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onExampleSelect(ex)}
                className="px-4 py-2 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-100">
          {[
            { label: '8-Section PRD', desc: 'Goals, personas, stories, RAID log' },
            { label: '< 90 Seconds', desc: 'From idea to full PRD' },
            { label: '1-Click Handoff', desc: 'PRD to test suite, no copy-paste' },
            { label: 'Export Ready', desc: 'Word, PDF, Markdown, CSV' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="font-bold text-gray-900 text-sm">{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
