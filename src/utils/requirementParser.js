export function detectRequirementCount(text) {
  if (!text || text.trim().length < 100) return 1

  const asACount = (text.match(/\bas a\b/gi) || []).length
  const shallMustCount = (text.match(/\bthe system (shall|must|should)\b/gi) || []).length
  const numberedItems = (text.match(/^\s*\d+\.\s+\S/gm) || []).length
  const featureHeaders = (text.match(/^(feature|scenario|requirement|user story)\s*:/gim) || []).length

  const score = Math.max(asACount, shallMustCount, numberedItems, featureHeaders)
  return score
}
