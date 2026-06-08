const VALID_SEGMENT_RE = /^[A-Z]{2}$/i;

function splitProjectTokens(projectName) {
  if (!projectName || typeof projectName !== 'string') return [];
  return projectName.split('_').map((p) => p.trim()).filter(Boolean);
}

/** First token when it looks like a segment code (VK, FK, …). */
function extractSegmentFromProjectName(projectName) {
  const parts = splitProjectTokens(projectName);
  const seg = parts[0] || '';
  return VALID_SEGMENT_RE.test(seg) ? seg.toUpperCase() : '';
}

/** Second token — class / year band. */
function extractClassFromProjectName(projectName) {
  const parts = splitProjectTokens(projectName);
  return parts[1] || '';
}

/** Fourth token — subject (e.g. VK_9th_CBSE_Math_SM_(Eng)_26-27 → Math). Token 3 is board. */
function extractSubjectFromProjectName(projectName) {
  const parts = splitProjectTokens(projectName);
  return parts[3] || '';
}

/**
 * Fifth token / token before medium — e.g. VK_9th_CBSE_Math_SM_(Eng)_26-27 → SM.
 * Falls back to token before (Lang) or YY-YY session when present.
 */
function extractSeriesFromProjectName(projectName) {
  const parts = splitProjectTokens(projectName);
  const parenIdx = parts.findIndex((p) => p && /^\(.+\)$/.test(p));
  if (parenIdx > 2) return parts[parenIdx - 1] || '';
  const yearIdx = parts.findIndex((p) => p && /^\d{2}-\d{2}$/.test(p));
  if (yearIdx > 2) return parts[yearIdx - 1] || '';
  return parts[4] || '';
}

/** True when no series filter, or project series token equals one of the selected values (exact). */
function projectMatchesSeriesSelection(projectName, seriesVals) {
  if (!seriesVals || seriesVals.length === 0) return true;
  const token = extractSeriesFromProjectName(projectName);
  return seriesVals.includes(token);
}

module.exports = {
  VALID_SEGMENT_RE,
  splitProjectTokens,
  extractSegmentFromProjectName,
  extractClassFromProjectName,
  extractSubjectFromProjectName,
  extractSeriesFromProjectName,
  projectMatchesSeriesSelection
};
