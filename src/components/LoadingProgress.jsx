import { useEffect, useState } from 'react'

const STEPS = [
  'Analysing requirement',
  'Generating functional cases',
  'Building BDD scenarios',
  'Compiling RTM',
]

export default function LoadingProgress() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timings = [0, 8000, 18000, 26000]
    const timers = timings.map((delay, i) =>
      setTimeout(() => setActiveStep(i), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">{STEPS[activeStep]}</p>
        <p className="text-sm text-gray-500 mt-1">This usually takes 15–30 seconds</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < activeStep
                ? 'bg-indigo-600'
                : i === activeStep
                ? 'bg-indigo-600 animate-pulse-slow'
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
