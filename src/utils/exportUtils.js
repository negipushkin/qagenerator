import * as XLSX from 'xlsx'

function flattenFunctional(items) {
  return items.map((tc) => ({
    ID: tc.id,
    Title: tc.title,
    Precondition: tc.precondition,
    Steps: Array.isArray(tc.steps) ? tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : tc.steps,
    'Expected Result': tc.expected,
    Priority: tc.priority,
    'Requirement Ref': tc.req_ref,
  }))
}

function flattenEdge(items) {
  return items.map((tc) => ({
    ID: tc.id,
    Title: tc.title,
    'Edge Category': tc.edge_category,
    Precondition: tc.precondition,
    Steps: Array.isArray(tc.steps) ? tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : tc.steps,
    'Expected Result': tc.expected,
    Priority: tc.priority,
    'Requirement Ref': tc.req_ref,
  }))
}

function flattenNegative(items) {
  return items.map((tc) => ({
    ID: tc.id,
    Title: tc.title,
    Precondition: tc.precondition,
    Steps: Array.isArray(tc.steps) ? tc.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : tc.steps,
    'Expected Result': tc.expected,
    'Expected Error Message': tc.expected_error,
    Priority: tc.priority,
    'Requirement Ref': tc.req_ref,
  }))
}

function flattenBDD(items) {
  return items.map((tc) => ({
    ID: tc.id,
    Feature: tc.feature,
    Scenario: tc.scenario,
    Given: Array.isArray(tc.given) ? tc.given.map((s) => `Given ${s}`).join('\n') : tc.given,
    When: Array.isArray(tc.when) ? tc.when.map((s) => `When ${s}`).join('\n') : tc.when,
    Then: Array.isArray(tc.then) ? tc.then.map((s) => `Then ${s}`).join('\n') : tc.then,
    And: Array.isArray(tc.and) && tc.and.length ? tc.and.map((s) => `And ${s}`).join('\n') : '',
  }))
}

function flattenRTM(items) {
  return items.map((r) => ({
    'Requirement ID': r.req_id,
    'Requirement Text': r.req_text,
    'Linked Test Case IDs': Array.isArray(r.linked_test_ids) ? r.linked_test_ids.join(', ') : r.linked_test_ids,
    'Coverage Status': r.coverage_status,
  }))
}

function autoWidth(ws, data) {
  if (!data.length) return
  const cols = Object.keys(data[0])
  ws['!cols'] = cols.map((key) => {
    const max = Math.max(key.length, ...data.map((row) => String(row[key] ?? '').split('\n')[0].length))
    return { wch: Math.min(max + 2, 60) }
  })
}

export function exportToExcel(data, filename = 'qa-test-suite.xlsx') {
  const wb = XLSX.utils.book_new()

  const sheets = [
    { name: 'Functional', rows: flattenFunctional(data.functional || []) },
    { name: 'Edge Cases', rows: flattenEdge(data.edge || []) },
    { name: 'Negative', rows: flattenNegative(data.negative || []) },
    { name: 'BDD Scenarios', rows: flattenBDD(data.bdd || []) },
    { name: 'RTM', rows: flattenRTM(data.rtm || []) },
  ]

  sheets.forEach(({ name, rows }) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    autoWidth(ws, rows)
    XLSX.utils.book_append_sheet(wb, ws, name)
  })

  XLSX.writeFile(wb, filename)
}

export function exportTabAsCSV(tabKey, data, tabLabel) {
  let rows = []
  if (tabKey === 'functional') rows = flattenFunctional(data.functional || [])
  else if (tabKey === 'edge') rows = flattenEdge(data.edge || [])
  else if (tabKey === 'negative') rows = flattenNegative(data.negative || [])
  else if (tabKey === 'bdd') rows = flattenBDD(data.bdd || [])
  else if (tabKey === 'rtm') rows = flattenRTM(data.rtm || [])

  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `qa-${tabLabel.toLowerCase().replace(/\s+/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportRTMExcel(rtmData, filename = 'qa-rtm.xlsx') {
  const wb = XLSX.utils.book_new()
  const rows = flattenRTM(rtmData || [])

  const covered = rows.filter((r) => r['Coverage Status'] === 'Covered').length
  const partial = rows.filter((r) => r['Coverage Status'] === 'Partial').length
  const notCovered = rows.filter((r) => r['Coverage Status'] === 'Not Covered').length

  const summaryRows = [
    { Metric: 'Total Requirements', Value: rows.length },
    { Metric: 'Covered', Value: covered },
    { Metric: 'Partial', Value: partial },
    { Metric: 'Not Covered', Value: notCovered },
    { Metric: 'Coverage %', Value: rows.length ? `${Math.round((covered / rows.length) * 100)}%` : '0%' },
  ]

  const ws1 = XLSX.utils.json_to_sheet(rows)
  autoWidth(ws1, rows)
  XLSX.utils.book_append_sheet(wb, ws1, 'RTM')

  const ws2 = XLSX.utils.json_to_sheet(summaryRows)
  autoWidth(ws2, summaryRows)
  XLSX.utils.book_append_sheet(wb, ws2, 'Coverage Summary')

  XLSX.writeFile(wb, filename)
}

export async function copyAsMarkdown(data) {
  const lines = []

  if (data.functional?.length) {
    lines.push('## Functional Test Cases\n')
    lines.push('| ID | Title | Priority | Expected Result |')
    lines.push('|---|---|---|---|')
    data.functional.forEach((tc) => {
      lines.push(`| ${tc.id} | ${tc.title} | ${tc.priority} | ${tc.expected} |`)
    })
    lines.push('')
  }

  if (data.edge?.length) {
    lines.push('## Edge Case Scenarios\n')
    lines.push('| ID | Title | Edge Category | Priority |')
    lines.push('|---|---|---|---|')
    data.edge.forEach((tc) => {
      lines.push(`| ${tc.id} | ${tc.title} | ${tc.edge_category} | ${tc.priority} |`)
    })
    lines.push('')
  }

  if (data.negative?.length) {
    lines.push('## Negative Test Cases\n')
    lines.push('| ID | Title | Expected Error | Priority |')
    lines.push('|---|---|---|---|')
    data.negative.forEach((tc) => {
      lines.push(`| ${tc.id} | ${tc.title} | ${tc.expected_error} | ${tc.priority} |`)
    })
    lines.push('')
  }

  if (data.bdd?.length) {
    lines.push('## BDD / Gherkin Scenarios\n')
    data.bdd.forEach((tc) => {
      lines.push(`### ${tc.id}: ${tc.scenario}\n`)
      lines.push(`**Feature:** ${tc.feature}\n`)
      lines.push('```gherkin')
      lines.push(`Feature: ${tc.feature}`)
      lines.push(`  Scenario: ${tc.scenario}`)
      tc.given?.forEach((s) => lines.push(`    Given ${s}`))
      tc.when?.forEach((s) => lines.push(`    When ${s}`))
      tc.then?.forEach((s) => lines.push(`    Then ${s}`))
      tc.and?.forEach((s) => lines.push(`    And ${s}`))
      lines.push('```\n')
    })
  }

  if (data.rtm?.length) {
    lines.push('## Requirements Traceability Matrix\n')
    lines.push('| Req ID | Requirement | Linked Test Cases | Coverage |')
    lines.push('|---|---|---|---|')
    data.rtm.forEach((r) => {
      const ids = Array.isArray(r.linked_test_ids) ? r.linked_test_ids.join(', ') : r.linked_test_ids
      lines.push(`| ${r.req_id} | ${r.req_text} | ${ids} | ${r.coverage_status} |`)
    })
  }

  const markdown = lines.join('\n')
  await navigator.clipboard.writeText(markdown)
  return markdown
}
