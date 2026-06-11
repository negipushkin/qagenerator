import { useState } from 'react'

const EXAMPLES = [
  {
    label: 'SaaS — Password Reset',
    mode: 'guided',
    fields: {
      product: 'A password reset feature for a B2B SaaS platform',
      problem: 'Users who forget their password are locked out and must contact support, causing delays and high support ticket volume',
      target_user: 'Business professionals aged 25–55 using the platform daily on desktop',
      success: '70% reduction in password-related support tickets; 95% of resets completed without agent help; reset flow under 2 minutes',
      constraints: 'Must support SSO fallback; comply with SOC 2; no SMS (cost constraint); session timeout 30 minutes',
    },
  },
  {
    label: 'Healthcare — Patient Portal',
    mode: 'free',
    text: 'Build a mobile-first patient portal for a mid-sized hospital. Patients need to book appointments, view test results, and message their care team. The portal must comply with HIPAA, support patients aged 30–75 with mixed digital literacy, and integrate with the existing Epic EHR system. Success means 40% reduction in phone call appointment bookings and 80% patient satisfaction rating within 6 months of launch.',
  },
  {
    label: 'E-commerce — Loyalty Program',
    mode: 'free',
    text: 'Design a customer loyalty rewards program for an online retail platform with 500K active users. Customers should earn points on purchases and redeem them for discounts. The program needs tiered status (Bronze, Silver, Gold) with increasing benefits. Key goals: increase repeat purchase rate by 25%, raise average order value by 15%, and achieve 30% of eligible customers enrolled within 3 months. Constraints: must integrate with existing Shopify setup and cannot require a mobile app.',
  },
]

const GUIDED_FIELDS = [
  { key: 'product', label: 'What is the product / feature?', placeholder: 'e.g. A two-factor authentication feature for a mobile banking app', required: true },
  { key: 'problem', label: 'What problem does it solve?', placeholder: 'e.g. Users are at risk of account takeover due to password-only authentication', required: true },
  { key: 'target_user', label: 'Who is the target user?', placeholder: 'e.g. Retail banking customers aged 18–65, moderate digital literacy, accessing via iOS and Android', required: true },
  { key: 'success', label: 'What does success look like?', placeholder: 'e.g. 80% of active users enrolled in 2FA within 90 days; fraud incidents reduced by 60%', required: true },
  { key: 'constraints', label: 'Any constraints or context?', placeholder: 'e.g. Must comply with PSD2; integrate with existing SMS gateway; no biometrics in this phase', required: false },
]

function buildInputFromForm(fields) {
  return [
    `Product / Feature: ${fields.product || ''}`,
    `Problem: ${fields.problem || ''}`,
    `Target User: ${fields.target_user || ''}`,
    `Success Metrics: ${fields.success || ''}`,
    fields.constraints ? `Constraints: ${fields.constraints}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

export default function InputPanel({ onGenerate, loading, error }) {
  const [mode, setMode] = useState('guided')
  const [freeText, setFreeText] = useState('')
  const [guidedFields, setGuidedFields] = useState({ product: '', problem: '', target_user: '', success: '', constraints: '' })
  const [enhancing, setEnhancing] = useState(false)

  const currentInput = mode === 'free' ? freeText : buildInputFromForm(guidedFields)
  const charCount = currentInput.length
  const charLimit = 3000

  const guidedComplete = GUIDED_FIELDS.filter((f) => f.required).every((f) => guidedFields[f.key]?.trim().length > 5)
  const freeComplete = freeText.trim().length >= 30

  const canGenerate = mode === 'guided' ? guidedComplete : freeComplete

  const handleGenerate = () => {
    if (!canGenerate || loading) return
    onGenerate(currentInput)
  }

  const handleExample = (ex) => {
    if (ex.mode === 'free') {
      setMode('free')
      setFreeText(ex.text)
    } else {
      setMode('guided')
      setGuidedFields(ex.fields)
    }
  }

  const handleEnhance = async () => {
    const raw = mode === 'free' ? freeText : buildInputFromForm(guidedFields)
    if (raw.trim().length < 10 || enhancing) return

    setEnhancing(true)
    try {
      const response = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: `Expand and improve this product idea into a clearer, more detailed brief of 2–3 paragraphs. Keep all the original intent. Return only the improved text, no JSON, no formatting:\n\n${raw}`,
        }),
      })
      if (!response.ok) return
      const json = await response.json()
      if (json.data?.executive_summary?.problem) {
        const enhanced = `Product: ${json.data.executive_summary.solution}\n\nProblem: ${json.data.executive_summary.problem}\n\nTarget User: ${json.data.executive_summary.target_user}\n\nVision: ${json.data.executive_summary.vision}`
        setMode('free')
        setFreeText(enhanced)
      }
    } catch {
      // silent
    } finally {
      setEnhancing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate PRD</h1>
        <p className="text-gray-500 text-sm mt-1">
          Describe your product idea or problem statement. A complete 8-section PRD is generated in under 90 seconds.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
          <button
            onClick={() => setMode('guided')}
            className={`px-4 py-2 font-medium transition-colors ${mode === 'guided' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Guided Form
          </button>
          <button
            onClick={() => setMode('free')}
            className={`px-4 py-2 font-medium transition-colors ${mode === 'free' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Free Text
          </button>
        </div>
        <span className="text-xs text-gray-400">
          {mode === 'guided' ? 'Fill in the fields — recommended for non-PMs' : 'Paste any product brief or idea'}
        </span>
      </div>

      {/* Input area */}
      {mode === 'guided' ? (
        <div className="space-y-4">
          {GUIDED_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                rows={field.key === 'constraints' ? 2 : 3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                placeholder={field.placeholder}
                value={guidedFields[field.key]}
                onChange={(e) => setGuidedFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
              />
            </div>
          ))}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {GUIDED_FIELDS.filter((f) => f.required && guidedFields[f.key]?.trim().length > 5).length} / {GUIDED_FIELDS.filter((f) => f.required).length} required fields filled
            </span>
            <span className={charCount > charLimit * 0.9 ? 'text-amber-500' : ''}>
              {charCount} / {charLimit}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <textarea
            rows={10}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            placeholder="Paste your product idea, problem statement, or brief here. Include the problem being solved, target users, and what success looks like. The more detail you provide, the better your PRD will be."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={charLimit}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
            <span>Minimum 30 characters</span>
            <span className={charCount > charLimit * 0.9 ? 'text-amber-500' : ''}>
              {charCount} / {charLimit}
            </span>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex)}
              className="px-3 py-1.5 bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-300 text-gray-600 hover:text-violet-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleEnhance}
          disabled={!canGenerate || enhancing || loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {enhancing ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {enhancing ? 'Enhancing...' : 'Enhance my input'}
        </button>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate PRD
            </>
          )}
        </button>
      </div>
    </div>
  )
}
