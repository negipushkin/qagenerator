# AI QA Use Case Generator

Generate complete QA test suites from plain-English requirements in under 60 seconds.

**Live:** [Deploy to Vercel — see setup below]

## What it generates

From a single requirement you get:
- **Functional Test Cases** — happy path scenarios
- **Edge Case Scenarios** — boundary conditions, limit values
- **Negative Test Cases** — invalid inputs, error handling
- **BDD / Gherkin Scenarios** — Given-When-Then format
- **Requirements Traceability Matrix** — full coverage mapping

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| AI | OpenAI GPT-4 Turbo via Vercel serverless function |
| Export | SheetJS (xlsx) — client-side Excel/CSV |
| Hosting | Vercel |

## Local Development

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (never committed to git):
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run with Vercel CLI (to get the serverless function working locally):
   ```bash
   npm install -g vercel
   vercel dev
   ```
   Or run Vite only (UI dev without generation):
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. In **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` = your OpenAI API key
4. Deploy — done

The serverless function at `api/generate.js` proxies all OpenAI calls server-side. Your API key is never exposed in the browser or in source code.

## Project Structure

```
├── api/generate.js          # Vercel serverless function (OpenAI proxy)
├── src/
│   ├── App.jsx              # Root screen state machine
│   ├── components/          # UI components
│   ├── hooks/               # useGeneration, useHistory
│   ├── utils/               # exportUtils, systemPrompt
│   └── constants/examples.js
└── vercel.json
```

## Export Options

| Format | Contents |
|---|---|
| Excel (.xlsx) | 5 sheets: Functional, Edge Cases, Negative, BDD Scenarios, RTM |
| CSV | Active tab as CSV download |
| Markdown | Full output formatted for Confluence / Notion |
| RTM Excel | Standalone RTM with coverage summary dashboard |
