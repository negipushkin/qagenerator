import { useEffect, useState } from 'react'

const STEPS = [
  'Framing the problem',
  'Writing user stories',
  'Building requirements',
  'Compiling RAID log',
]

export default function PRDLoadingProgress() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timings = [0, 10000, 22000, 34000]
    const timers = timings.map((delay, i) =>
      setTimeout(() => setActiveStep(i), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">{STEPS[activeStep]}</p>
        <p className="text-sm text-gray-500 mt-1">Generating your full 8-section PRD — usually 30–60 seconds</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < activeStep
                ? 'bg-violet-600'
                : i === activeStep
                ? 'bg-violet-600 animate-pulse-slow'
                : 'bg-gray-200'
            }`}>
              {i < activeStep ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : i === activeStep ? (
                <div className="w-2 h-2 rounded-full bg-white" />
              ) : null}
            </div>
            <span className={`text-sm transition-colors duration-300 ${i <= activeStep ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
