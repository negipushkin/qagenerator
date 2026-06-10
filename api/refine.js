const VALID_TABS = ['functional', 'edge', 'negative', 'bdd', 'rtm']

const TAB_LABELS = {
  functional: 'functional test cases',
  edge: 'edge case scenarios',
  negative: 'negative test cases',
  bdd: 'BDD/Gherkin scenarios',
  rtm: 'requirements traceability matrix entries',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { requirement, existingTabData, targetTab, instruction } = req.body || {}

  if (!requirement || typeof requirement !== 'string') {
    return res.status(400).json({ error: 'Original requirement is required.' })
  }
  if (!targetTab || !VALID_TABS.includes(targetTab)) {
    return res.status(400).json({ error: 'Invalid target tab.' })
  }
  if (!instruction || typeof instruction !== 'string' || instruction.trim().length < 5) {
    return res.status(400).json({ error: 'Refinement instruction must be at least 5 characters.' })
  }
  if (instruction.trim().length > 500) {
    return res.status(400).json({ error: 'Refinement instruction must be under 500 characters.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is not configured.' })
  }

  const systemPrompt = `You are a senior QA engineer with 10+ years of experience. You will be given an original software requirement, the existing ${TAB_LABELS[targetTab]}, and a refinement instruction.

Apply the refinement instruction to improve, expand, or modify the ${TAB_LABELS[targetTab]}.

IMPORTANT:
- Return ONLY a valid JSON object with a single key: "${targetTab}"
- The value must be an array following the same schema as the input
- All test case IDs must remain unique (do not reuse IDs from the existing data — use new sequential IDs for any new items)
- If adding new items, continue the numbering from where the existing data left off
- No other text, no markdown — only the JSON object`

  const userMessage = `ORIGINAL REQUIREMENT:
${requirement.trim()}

EXISTING ${targetTab.toUpperCase()} DATA:
${JSON.stringify(existingTabData || [], null, 2)}

REFINEMENT INSTRUCTION:
${instruction.trim()}`

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
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    })

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment and try again.' })
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `OpenAI API error: ${response.status}`)
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

    if (!Array.isArray(parsed[targetTab])) {
      throw new Error(`Response missing "${targetTab}" array. Please try again.`)
    }

    return res.status(200).json({ data: parsed[targetTab] })
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timed out. Please try again.' })
    }
    return res.status(500).json({ error: err.message || 'An unexpected error occurred.' })
  }
}
