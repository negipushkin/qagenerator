import { SYSTEM_PROMPT, DOMAIN_ADDENDUMS } from '../src/utils/systemPrompt.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { requirement, domain } = req.body || {}

  if (!requirement || typeof requirement !== 'string') {
    return res.status(400).json({ error: 'Requirement text is required.' })
  }

  const trimmed = requirement.trim()

  if (trimmed.length < 50) {
    return res.status(400).json({ error: 'Requirement is too short. Please provide at least 50 characters for meaningful test case generation.' })
  }

  if (trimmed.length > 5000) {
    return res.status(400).json({ error: 'Requirement exceeds the 5,000 character limit. Please shorten your input.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your Vercel environment variables.' })
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
          temperature: 0.3,
          max_tokens: 4000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + (DOMAIN_ADDENDUMS[domain] || '') },
            { role: 'user', content: trimmed },
          ],
        }),
        signal: AbortSignal.timeout(55000),
      })

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '5', 10)
        const delay = Math.min(retryAfter * 1000, (attempt + 1) * 5000)
        if (attempt < maxRetries - 1) {
          await new Promise((r) => setTimeout(r, delay))
          continue
        }
        return res.status(429).json({ error: 'OpenAI rate limit reached. Please wait a moment and try again.' })
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody?.error?.message || `OpenAI API error: ${response.status}`)
      }

      const completion = await response.json()
      const content = completion.choices?.[0]?.message?.content

      if (!content) {
        throw new Error('Empty response from OpenAI.')
      }

      let parsed
      try {
        parsed = JSON.parse(content)
      } catch {
        throw new Error('OpenAI returned invalid JSON. Please try again.')
      }

      const requiredKeys = ['functional', 'edge', 'negative', 'bdd', 'rtm']
      const missing = requiredKeys.filter((k) => !Array.isArray(parsed[k]))
      if (missing.length > 0) {
        throw new Error(`Incomplete response from AI (missing: ${missing.join(', ')}). Please try again.`)
      }

      return res.status(200).json({ data: parsed })
    } catch (err) {
      lastError = err
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        return res.status(504).json({ error: 'The request timed out. OpenAI took too long to respond. Please try again.' })
      }
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 1000))
      }
    }
  }

  return res.status(500).json({ error: lastError?.message || 'An unexpected error occurred. Please try again.' })
}
