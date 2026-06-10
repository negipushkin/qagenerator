import { EXAMPLES } from '../constants/examples'

export default function LandingHeader({ onStart, onExampleSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Powered · Under 60 Seconds
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Turn Requirements into{' '}
          <span className="text-indigo-600">Complete Test Suites</span>
          {' '}— Instantly
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Paste any user story, PRD excerpt, or acceptance criteria. Get functional tests, edge cases, negative scenarios, BDD/Gherkin scripts, and a full traceability matrix in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Test Cases
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500 font-medium">Try an example:</p>
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
            { label: '5 Output Types', desc: 'Functional, Edge, Negative, BDD, RTM' },
            { label: '< 60 Seconds', desc: 'From requirement to full test suite' },
            { label: 'Export Ready', desc: 'Excel, CSV & Markdown in one click' },
            { label: 'No QA Expertise', desc: 'Designed for PMs, BAs, Delivery Leads' },
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
