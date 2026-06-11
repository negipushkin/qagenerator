import { PRD_SECTION_REGENERATE_PROMPT } from '../src/utils/prdSystemPrompt.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { input, section, currentPrd } = req.body || {}

  if (!input || !section || !currentPrd) {
    return res.status(400).json({ error: 'input, section, and currentPrd are required.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key is not configured.' })

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: PRD_SECTION_REGENERATE_PROMPT(section, input, currentPrd) }],
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      return res.status(response.status).json({ error: errBody?.error?.message || 'Regeneration failed.' })
    }

    const completion = await response.json()
    const content = completion.choices?.[0]?.message?.content
    if (!content) return res.status(500).json({ error: 'Empty response from OpenAI.' })

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      return res.status(500).json({ error: 'Invalid JSON from OpenAI. Please try again.' })
    }

    if (!parsed[section]) return res.status(500).json({ error: 'Section data missing from response.' })

    return res.status(200).json({ data: parsed[section] })
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out.' })
    }
    return res.status(500).json({ error: err.message || 'An error occurred.' })
  }
}
