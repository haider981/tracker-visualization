/**
 * Week buckets + weekly matrix for report timeline tables.
 */

function weekStartMonday(dt) {
  const d = new Date(dt);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoFromDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function weekLabelFromStart(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const monStart = start.toLocaleDateString('en-US', { month: 'short' });
  const monEnd = end.toLocaleDateString('en-US', { month: 'short' });
  const dayStart = start.getDate();
  const dayEnd = end.getDate();
  return monStart === monEnd
    ? `${monStart} ${dayStart}-${dayEnd}`
    : `${monStart} ${dayStart}-${monEnd} ${dayEnd}`;
}

function buildWeeklyTimelineMatrix(ganttRows, rowMode = 'employee') {
  const weekMeta = new Map();
  const cells = new Map();

  for (const r of ganttRows || []) {
    const employee = String(r?.employee || r?.name || '').trim();
    const team = String(r?.team || '').trim();
    const rowLabel = rowMode === 'overall' ? team : employee;
    const date = String(r?.date || '').slice(0, 10);
    const h = Number(r?.hours) || 0;
    if (!rowLabel || !date || h <= 0) continue;

    const [y, m, d] = date.split('-').map(Number);
    const start = weekStartMonday(new Date(y, m - 1, d));
    const wk = isoFromDate(start);
    if (!weekMeta.has(wk)) {
      weekMeta.set(wk, { key: wk, label: weekLabelFromStart(start) });
    }
    const cellKey = `${rowLabel}\t${wk}`;
    cells.set(cellKey, (cells.get(cellKey) || 0) + h);
  }

  const weeks = Array.from(weekMeta.values()).sort((a, b) => a.key.localeCompare(b.key)).slice(-6);
  const rowSet = new Set();
  for (const key of cells.keys()) rowSet.add(key.split('\t')[0]);

  const rows = Array.from(rowSet)
    .map((label) => {
      let fullTotal = 0;
      const byWeek = {};
      for (const w of weeks) {
        const h = cells.get(`${label}\t${w.key}`) || 0;
        byWeek[w.key] = h;
      }
      // Total across every week in the filtered period (not only the columns shown).
      for (const [cellKey, h] of cells.entries()) {
        if (cellKey.startsWith(`${label}\t`)) fullTotal += h;
      }
      return { label, byWeek, total: fullTotal };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  return { weeks, rows };
}

function aggregateGanttHours(rows, rowMode = 'employee') {
  const byRow = new Map();
  for (const r of rows || []) {
    const employee = String(r?.employee || r?.name || '').trim();
    const team = String(r?.team || '').trim();
    const rowLabel = rowMode === 'overall' ? team : employee;
    const date = String(r?.date || '').slice(0, 10);
    const h = Number(r?.hours) || 0;
    if (!rowLabel || !date || h <= 0) continue;
    const [y, m, d] = date.split('-').map(Number);
    const start = weekStartMonday(new Date(y, m - 1, d));
    const wk = isoFromDate(start);
    const key = `${rowLabel}\t${wk}`;
    byRow.set(key, (byRow.get(key) || 0) + h);
  }
  return byRow;
}

module.exports = {
  buildWeeklyTimelineMatrix,
  aggregateGanttHours,
};
