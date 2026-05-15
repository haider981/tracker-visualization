/**
 * Extract the "series" token from a project_name using the same rules as the project-view UI
 * (token before a parenthesised language tag, else before YY-YY session, else 4th/3rd token).
 * This avoids treating "SureS" as matching "SureSWB" or matching a split "SureS_WB" via substring SQL.
 */
function extractSeriesFromProjectName(projectName) {
  if (!projectName || typeof projectName !== 'string') return '';
  const parts = projectName.split('_').map((p) => p.trim()).filter(Boolean);
  const parenIdx = parts.findIndex((p) => p && /^\(.+\)$/.test(p));
  if (parenIdx > 2) return parts[parenIdx - 1] || '';
  const yearIdx = parts.findIndex((p) => p && /^\d{2}-\d{2}$/.test(p));
  if (yearIdx > 2) return parts[yearIdx - 1] || '';
  return parts[4] || parts[3] || '';
}

/** True when no series filter, or project series token equals one of the selected values (exact). */
function projectMatchesSeriesSelection(projectName, seriesVals) {
  if (!seriesVals || seriesVals.length === 0) return true;
  const token = extractSeriesFromProjectName(projectName);
  return seriesVals.includes(token);
}

module.exports = {
  extractSeriesFromProjectName,
  projectMatchesSeriesSelection
};
