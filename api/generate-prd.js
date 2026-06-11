import { PRD_SYSTEM_PROMPT } from '../src/utils/prdSystemPrompt.js'

const REQUIRED_KEYS = [
  'executive_summary',
  'goals_and_metrics',
  'user_personas',
  'user_stories',
  'functional_requirements',
  'technical_requirements',
  'release_plan',
  'raid_log',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { input } = req.body || {}

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input is required.' })
  }

  const trimmed = input.trim()

  if (trimmed.length < 30) {
    return res.status(400).json({ error: 'Input is too short. Please describe your product idea in more detail.' })
  }

  if (trimmed.length > 3000) {
    return res.status(400).json({ error: 'Input exceeds the 3,000 character limit. Please shorten your input.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured.' })
  }

  const maxRetries = 3
  let lastError = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.4,
          max_tokens: 4500,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: PRD_SYSTEM_PROMPT },
            { role: 'user', content: trimmed },
          ],
        }),
        signal: AbortSignal.timeout(60000),
      })

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10)
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, Math.min(retryAfter * 1000, (attempt + 1) * 5000)))
          continue
        }
        return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' })
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody?.error?.message || `OpenAI API error: ${response.status}`)
      }

      const completion = await response.json()
      const content = completion.choices?.[0]?.message?.content
      if (!content) throw new Error('Empty response from OpenAI.')

      let parsed
      try {
        parsed = JSON.parse(content)
      } catch {
        throw new Error('OpenAI returned invalid JSON. Please try again.')
      }

      const missing = REQUIRED_KEYS.filter((k) => !parsed[k])
      if (missing.length > 0) {
        throw new Error(`Incomplete PRD (missing: ${missing.join(', ')}). Please try again.`)
      }

      return res.status(200).json({ data: parsed })
    } catch (err) {
      lastError = err
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        return res.status(504).json({ error: 'Request timed out. Please try again.' })
      }
      if (attempt < maxRetries - 1) await new Promise((r) => setTimeout(r, (attempt + 1) * 1000))
    }
  }

  return res.status(500).json({ error: lastError?.message || 'An unexpected error occurred. Please try again.' })
}
