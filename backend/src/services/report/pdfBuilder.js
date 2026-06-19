const PDFDocument = require('pdfkit');

const PURPLE = '#6d28d9';
const PURPLE_LIGHT = '#ede9fe';
const GRAY = '#64748b';
const DARK = '#1e1b4b';
const ACCENT = '#7c3aed';
const PAGE_BOTTOM = 780;
const PAGE_HEIGHT = 842;
const CONTENT_TOP = 56;
const COVER_BOTTOM = PAGE_HEIGHT - 40;
const OVERVIEW_FOOTNOTE_H = 28;

const WEEKLY_TIMELINE_FOOTNOTE =
  'Period total = working hours with a project and work date in this period. '
  + 'Week columns show the 6 most recent weeks only. '
  + 'Rows without a project or date are excluded from weekly columns.';

function resetContentCursor(doc) {
  doc.x = 40;
  doc.y = CONTENT_TOP;
}

const SECTION_LABELS = {
  cover: 'Cover',
  kpis: 'Key metrics',
  top_projects: 'Top projects',
  work_mode: 'Work mode split',
  employees_table: 'Employee breakdown',
  teams_table: 'Team breakdown',
  task_breakdown: 'Task breakdown',
  employee_contribution: 'Employee contribution',
  tasks_breakdown: 'Tasks overview',
  hours_timeline: 'Weekly hours breakdown',
};

let contentPageNum = 0;
let pageBreakLocked = false;

function collectPdfBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

function fmtNum(n, digits = 1) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '0';
  return v.toFixed(digits);
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function addContentPage(doc) {
  doc.addPage();
  contentPageNum += 1;
  drawPageChrome(doc);
}

function ensureSpace(doc, needed = 80) {
  if (pageBreakLocked) return;
  if (doc.y + needed > PAGE_BOTTOM) {
    addContentPage(doc);
  }
}

function withLockedPageBreaks(fn) {
  pageBreakLocked = true;
  try {
    fn();
  } finally {
    pageBreakLocked = false;
  }
}

function drawPageChrome(doc) {
  resetContentCursor(doc);

  doc.save();
  doc.rect(0, 0, doc.page.width, 36).fill(PURPLE);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
  doc.text('Work Tracker Analytics', 40, 12, { width: doc.page.width - 80, align: 'left', lineBreak: false });
  doc.restore();

  resetContentCursor(doc);
}

/** Resolve working vs leave hours from overview or row aggregates. */
function resolveHourSplit(data) {
  const ov = data.overview || {};
  let working = Number(ov.totalWorkingHours);
  let leave = Number(ov.totalLeaveHours);

  if (!Number.isFinite(working) || !Number.isFinite(leave)) {
    const employees = data.employees || [];
    const teams = data.teams || [];
    const rows = employees.length ? employees : teams;
    if (rows.length) {
      working = rows.reduce((s, r) => s + (Number(r.workingHours ?? r.hours) || 0), 0);
      leave = rows.reduce((s, r) => s + (Number(r.leaveHours) || 0), 0);
    } else {
      const total = Number(ov.totalHours) || 0;
      working = Number.isFinite(working) ? working : total;
      leave = Number.isFinite(leave) ? leave : 0;
    }
  }

  return { working, leave, total: working + leave };
}

/** Build executive-summary bullets from fetched report data. */
function analyzeReport(data) {
  const bullets = [];
  const ov = data.overview || {};
  const { working: workingH, leave: leaveH, total: totalH } = resolveHourSplit(data);
  const f = data.filters || {};
  const empCount = ov.totalEmployees || (data.employees || []).length || 0;
  const projCount = ov.totalProjects || (data.projects || []).length || 0;
  const logRows = ov.totalTasks || 0;

  const scope = [
    f.department && f.department !== 'All' ? f.department : null,
    f.team && f.team !== 'All' ? f.team : null,
    f.period && f.period !== 'All' ? f.period : null,
  ].filter(Boolean).join(' · ');

  bullets.push(
    `${empCount} employee${empCount === 1 ? '' : 's'} logged ${fmtNum(workingH, 0)} working hours`
      + `${leaveH > 0 ? ` and ${fmtNum(leaveH, 0)} leave hours` : ''}`
      + ` across ${projCount} project${projCount === 1 ? '' : 's'}${scope ? ` (${scope})` : ''}.`
  );

  if (leaveH > 0 && totalH > 0) {
    const leavePct = (leaveH / totalH) * 100;
    bullets.push(
      `Leave accounts for ${fmtNum(leaveH, 0)} hrs (${fmtNum(leavePct)}% of all logged time); `
        + 'working-hour metrics below exclude blank project entries.'
    );
  } else {
    bullets.push('No leave hours (blank project) were logged in this period.');
  }

  if (empCount > 0 && workingH > 0) {
    bullets.push(
      `Average working hours per employee: ${fmtNum(workingH / empCount)} hrs `
        + `(${logRows > 0 ? `${fmtNum(logRows / empCount, 0)} log rows per person` : 'log rows vary by person'}).`
    );
  }

  const topProj = (data.projects || [])[0];
  if (topProj && workingH > 0) {
    const share = ((Number(topProj.hours) || 0) / workingH) * 100;
    bullets.push(
      `Top project: ${topProj.name} — ${fmtNum(topProj.hours)} working hrs (${fmtNum(share)}% of working time).`
    );
  }

  const topProjects = (data.projects || []).slice(0, 3);
  if (topProjects.length >= 2 && workingH > 0) {
    const top3H = topProjects.reduce((s, p) => s + (Number(p.hours) || 0), 0);
    bullets.push(
      `Top ${topProjects.length} projects consumed ${fmtNum(top3H, 0)} working hrs `
        + `(${fmtNum((top3H / workingH) * 100)}% of team working time).`
    );
  }

  const employees = [...(data.employees || [])].sort(
    (a, b) => (Number(b.workingHours ?? b.hours) || 0) - (Number(a.workingHours ?? a.hours) || 0)
  );
  const topEmp = employees[0];
  if (topEmp) {
    const wh = Number(topEmp.workingHours ?? topEmp.hours) || 0;
    const share = workingH > 0 ? (wh / workingH) * 100 : 0;
    bullets.push(
      `Top contributor: ${topEmp.name} — ${fmtNum(wh)} working hrs`
        + `${share > 0 ? ` (${fmtNum(share)}% of team working time)` : ''}.`
    );
  }

  if (employees.length >= 2) {
    const bottomEmp = employees[employees.length - 1];
    const bwh = Number(bottomEmp.workingHours ?? bottomEmp.hours) || 0;
    bullets.push(`Lowest working hours among listed staff: ${bottomEmp.name} — ${fmtNum(bwh)} hrs.`);
  }

  const topTask = (data.tasks || [])[0];
  if (topTask) {
    bullets.push(`Most time on task: ${topTask.task || topTask.name} — ${fmtNum(topTask.hours)} hrs.`);
  }

  const modes = [...(data.workMode || [])].sort((a, b) => (b.hours || 0) - (a.hours || 0));
  if (modes[0]) {
    bullets.push(`Primary work mode: ${modes[0].mode} — ${fmtNum(modes[0].hours)} hrs.`);
  }
  if (modes[1]) {
    bullets.push(`Second work mode: ${modes[1].mode} — ${fmtNum(modes[1].hours)} hrs.`);
  }

  const teams = data.teams || [];
  if (teams.length > 1) {
    const lead = teams[0];
    bullets.push(
      `Largest team by working hours: ${lead.name} — ${fmtNum(lead.workingHours ?? lead.hours, 0)} hrs.`
    );
  }

  if (data.weeklyTimeline?.rows?.length) {
    const timelineTotal = data.weeklyTimeline.rows.reduce((s, r) => s + r.total, 0);
    if (workingH > 0 && Math.abs(workingH - timelineTotal) > 1) {
      bullets.push(
        `${fmtNum(workingH - timelineTotal)} working hrs lack a dated project entry on the weekly timeline `
          + '(included in working totals, not in week columns).'
      );
    }
  }

  if (data.projectInsights?.insights?.riskFlags?.length) {
    bullets.push(`Attention: ${data.projectInsights.insights.riskFlags[0]}`);
  }

  return bullets.slice(0, 14);
}

function measureTextHeight(doc, text, font, size, width, extra = {}) {
  if (!text) return 0;
  doc.font(font).fontSize(size);
  return doc.heightOfString(text, { width, ...extra });
}

/** Even gaps between fixed-height blocks on a page region. */
function computeEvenGaps(startY, endY, blockHeights, minGap = 16) {
  const heights = blockHeights.filter((h) => h > 0);
  if (!heights.length) return { gap: minGap, startY };
  const totalH = heights.reduce((s, h) => s + h, 0);
  const gapCount = Math.max(0, heights.length - 1);
  const gap = gapCount > 0
    ? Math.max(minGap, (endY - startY - totalH) / gapCount)
    : 0;
  return { gap, startY, totalH };
}

function measureBulletBlockHeight(doc, bullets, width, fontSize = 9.5) {
  doc.font('Helvetica').fontSize(fontSize);
  let h = 20;
  for (const line of bullets) {
    h += doc.heightOfString(`•  ${line}`, { width: width - 16, lineGap: 2 }) + 5;
  }
  return h;
}

function measureBarBlockHeight(itemCount, rowH, titleH = 26) {
  if (!itemCount) return 0;
  return titleH + itemCount * rowH + 8;
}

function measureTableBlockHeight(rowCount, rowH, titleH = 26) {
  if (!rowCount) return 0;
  return titleH + rowH + rowCount * rowH + 8;
}

/** Split "Type Report: detail" into a short heading + optional detail line for the cover. */
function resolveCoverHeading(data) {
  const f = data.filters || {};
  const title = data.title || 'Work Tracker Report';

  if (f.projectName) {
    return { heading: 'Project Report', detail: f.projectName };
  }
  if (f.employee && f.employee !== 'All' && title.startsWith('Employee Report:')) {
    return { heading: 'Employee Report', detail: f.employee };
  }
  if (f.team && f.team !== 'All' && (title === 'Team Report' || title === 'Team Employee Report')) {
    return { heading: title, detail: f.team };
  }

  const colonIdx = title.indexOf(': ');
  if (colonIdx > 0 && colonIdx < 40) {
    return { heading: title.slice(0, colonIdx), detail: title.slice(colonIdx + 2) };
  }
  return { heading: title, detail: null };
}

function drawCoverWithSummary(doc, data) {
  const insights = analyzeReport(data);
  const f = data.filters || {};
  const marginX = 40;
  const contentW = doc.page.width - 80;
  const topPad = 28;
  const bottomPad = 16;

  const { heading, detail } = resolveCoverHeading(data);
  const subtitle = data.subtitle || '';
  const generatedText = `Generated ${fmtDate(data.generatedAt)}`;

  let headerContentH = measureTextHeight(doc, heading, 'Helvetica-Bold', 24, contentW) + 6;
  if (detail) {
    headerContentH += measureTextHeight(doc, detail, 'Helvetica-Bold', 14, contentW, { lineGap: 2 }) + 8;
  } else {
    headerContentH += 2;
  }
  if (subtitle) {
    headerContentH += measureTextHeight(doc, subtitle, 'Helvetica', 11, contentW) + 6;
  }
  headerContentH += measureTextHeight(doc, generatedText, 'Helvetica', 9, contentW);

  const headerHeight = topPad + headerContentH + bottomPad;
  doc.rect(0, 0, doc.page.width, headerHeight).fill(PURPLE);

  let y = topPad;
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(24);
  doc.text(heading, marginX, y, { width: contentW, lineGap: 2 });
  y = doc.y + 6;

  if (detail) {
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#f5f3ff');
    doc.text(detail, marginX, y, { width: contentW, lineGap: 2 });
    y = doc.y + 8;
  }

  if (subtitle) {
    doc.font('Helvetica').fontSize(11).fillColor('#e9d5ff');
    doc.text(subtitle, marginX, y, { width: contentW, lineGap: 2 });
    y = doc.y + 6;
  }

  doc.font('Helvetica').fontSize(9).fillColor('#e9d5ff');
  doc.text(generatedText, marginX, y, { width: contentW });

  const ov = data.overview || {};
  const { working: workingH, leave: leaveH } = resolveHourSplit(data);
  const empCount = ov.totalEmployees ?? (data.employees || []).length ?? 0;
  const projCount = ov.totalProjects ?? (data.projects || []).length ?? 0;
  const logRows = ov.totalTasks ?? 0;
  const avgWorking = empCount > 0 ? workingH / empCount : 0;

  const topProjects = (data.projects || []).slice(0, 3);
  const topEmployees = [...(data.employees || [])]
    .sort((a, b) => (Number(b.workingHours ?? b.hours) || 0) - (Number(a.workingHours ?? a.hours) || 0))
    .slice(0, 3);

  const filterLines = [
    f.department && f.department !== 'All' ? `Department: ${f.department}` : null,
    f.team && f.team !== 'All' ? `Team: ${f.team}` : null,
    f.employee && f.employee !== 'All' ? `Employee: ${f.employee}` : null,
    f.period && f.period !== 'All' ? `Period: ${f.period}` : null,
    f.projectName ? `Project: ${f.projectName}` : null,
  ].filter(Boolean);
  const filterText = filterLines.length ? filterLines.join('   |   ') : 'All data (no filters)';

  const contentStartY = headerHeight + 16;
  const contentEndY = COVER_BOTTOM;

  const bulletsToShow = insights.slice(0, 10);
  const bulletsH = measureBulletBlockHeight(doc, bulletsToShow, contentW);

  const cardRowH = 54;
  const statRowH = 44;
  const highlightsHeaderH = 18;
  const highlightRows = Math.max(topProjects.length, topEmployees.length, 0);
  const highlightRowH = 14;
  const highlightsH = highlightRows > 0
    ? highlightsHeaderH + 14 + highlightRows * highlightRowH + 6
    : 0;

  doc.font('Helvetica').fontSize(9);
  const filtersH = 22 + measureTextHeight(doc, filterText, 'Helvetica', 9, contentW);

  const blockHeights = [bulletsH, cardRowH, statRowH, highlightsH, filtersH].filter((h) => h > 0);
  const { gap } = computeEvenGaps(contentStartY, contentEndY, blockHeights, 20);

  let curY = contentStartY;

  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(15);
  doc.text('Executive summary', marginX, curY);
  curY += 20;

  doc.font('Helvetica').fontSize(9.5).fillColor('#334155');
  for (const line of bulletsToShow) {
    const text = `•  ${line}`;
    const lineH = doc.heightOfString(text, { width: contentW - 16, lineGap: 2 });
    doc.text(text, marginX + 8, curY, { width: contentW - 16, lineGap: 2 });
    curY += lineH + 5;
  }
  curY = contentStartY + bulletsH + gap;

  const cardW = (contentW - 30) / 4;
  const miniCards = [
    { label: 'Working hours', value: fmtNum(workingH, 0) },
    { label: 'Leave hours', value: fmtNum(leaveH, 0) },
    { label: 'Employees', value: empCount },
    { label: 'Projects', value: projCount },
  ];
  miniCards.forEach((c, i) => {
    const x = marginX + i * (cardW + 10);
    doc.roundedRect(x, curY, cardW, cardRowH, 5).fillAndStroke(PURPLE_LIGHT, '#c4b5fd');
    doc.fillColor(PURPLE).font('Helvetica-Bold').fontSize(16);
    doc.text(String(c.value), x + 8, curY + 10, { width: cardW - 16 });
    doc.fillColor(GRAY).font('Helvetica').fontSize(7.5);
    doc.text(c.label, x + 8, curY + 32, { width: cardW - 16 });
  });
  curY += cardRowH + gap;

  const statW = (contentW - 20) / 3;
  const statCards = [
    { label: 'Avg working hrs / employee', value: fmtNum(avgWorking) },
    { label: 'Log rows', value: logRows },
    { label: 'Leave share', value: workingH + leaveH > 0 ? `${fmtNum((leaveH / (workingH + leaveH)) * 100)}%` : '0%' },
  ];
  statCards.forEach((c, i) => {
    const x = marginX + i * (statW + 10);
    doc.roundedRect(x, curY, statW, statRowH, 4).fillAndStroke('#f5f3ff', '#ddd6fe');
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(13);
    doc.text(String(c.value), x + 8, curY + 9, { width: statW - 16 });
    doc.fillColor(GRAY).font('Helvetica').fontSize(7);
    doc.text(c.label, x + 8, curY + 26, { width: statW - 16 });
  });
  curY += statRowH + gap;

  if (highlightsH > 0) {
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10).text('Quick highlights', marginX, curY);
    curY += highlightsHeaderH;
    const colW = (contentW - 16) / 2;
    const leftX = marginX;
    const rightX = leftX + colW + 16;

    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(8);
    doc.text('Top projects (working hrs)', leftX, curY);
    doc.text('Top contributors (working hrs)', rightX, curY);
    curY += 14;

    for (let i = 0; i < highlightRows; i += 1) {
      const proj = topProjects[i];
      const emp = topEmployees[i];
      doc.fillColor(DARK).font('Helvetica').fontSize(8);
      if (proj) {
        const label = proj.name.length > 34 ? `${proj.name.slice(0, 32)}…` : proj.name;
        doc.text(`${i + 1}. ${label} — ${fmtNum(proj.hours)}`, leftX, curY, { width: colW, lineBreak: false });
      }
      if (emp) {
        doc.text(
          `${i + 1}. ${emp.name} — ${fmtNum(emp.workingHours ?? emp.hours)}`,
          rightX,
          curY,
          { width: colW, lineBreak: false }
        );
      }
      curY += highlightRowH;
    }
    curY += gap;
  }

  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text('Filters applied', marginX, curY);
  curY += 14;
  doc.font('Helvetica').fontSize(9).fillColor(GRAY);
  doc.text(filterText, marginX, curY, { width: contentW });

  doc.y = contentEndY;
}

function addSectionGap(doc, gap = 22) {
  doc.y += gap;
}

/** Spread leftover vertical space evenly before the page-bottom footnote. */
function addFlexibleSectionGap(doc, sectionsRemaining, footnoteReserve = OVERVIEW_FOOTNOTE_H + 16) {
  if (sectionsRemaining <= 0) return;
  const targetY = PAGE_BOTTOM - footnoteReserve;
  const remaining = targetY - doc.y;
  if (remaining <= 0) return;
  const gap = Math.max(14, Math.min(36, Math.floor(remaining / sectionsRemaining)));
  doc.y += gap;
}

function measureWeeklyFootnoteHeight(doc) {
  doc.font('Helvetica').fontSize(7);
  return doc.heightOfString(WEEKLY_TIMELINE_FOOTNOTE, {
    width: doc.page.width - 80,
    lineGap: 0,
  });
}

function drawWeeklyTimelineFootnote(doc) {
  const footW = doc.page.width - 80;
  doc.font('Helvetica').fontSize(7);
  const textH = measureWeeklyFootnoteHeight(doc);
  const y = PAGE_BOTTOM - textH - 6;

  doc.fillColor(GRAY);
  doc.text(WEEKLY_TIMELINE_FOOTNOTE, 40, y, {
    width: footW,
    lineGap: 0,
    height: textH,
  });
  doc.y = y + textH + 4;
}

function drawKpis(doc, overview, { compact = false, balanced = false } = {}) {
  const cardH = compact ? 54 : balanced ? 58 : 68;
  const titleGap = compact ? 0.35 : balanced ? 0.4 : 0.5;
  const bottomGap = compact ? 10 : balanced ? 14 : 18;

  ensureSpace(doc, compact ? 88 : balanced ? 96 : 110);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(compact ? 13 : balanced ? 13 : 14).text('Key metrics', 40);
  doc.moveDown(titleGap);

  const kpis = [
    { label: 'Projects', value: overview?.totalProjects ?? 0, color: '#8b5cf6' },
    { label: 'Employees', value: overview?.totalEmployees ?? 0, color: '#ec4899' },
    { label: 'Working hours', value: fmtNum(overview?.totalWorkingHours ?? overview?.totalHours ?? 0, 0), color: '#3b82f6' },
    { label: 'Leave hours', value: fmtNum(overview?.totalLeaveHours ?? 0, 0), color: '#f59e0b' },
    { label: 'Log rows', value: overview?.totalTasks ?? 0, color: '#10b981' },
  ];

  const startX = 40;
  const cardW = (doc.page.width - 80 - 40) / 5;
  const baseY = doc.y;

  kpis.forEach((kpi, i) => {
    const x = startX + i * (cardW + 10);
    doc.roundedRect(x, baseY, cardW, cardH, 6).fillAndStroke(PURPLE_LIGHT, '#c4b5fd');
    doc.fillColor(kpi.color).font('Helvetica-Bold').fontSize(compact ? 15 : balanced ? 16 : 17);
    doc.text(String(kpi.value), x + 8, baseY + 10, { width: cardW - 16, lineBreak: false });
    doc.fillColor(GRAY).font('Helvetica').fontSize(8);
    doc.text(kpi.label, x + 8, baseY + (compact ? 30 : 40), { width: cardW - 16 });
  });

  doc.y = baseY + cardH + bottomGap;
}

function drawHorizontalBars(doc, title, items, {
  labelKey = 'name',
  valueKey = 'hours',
  maxItems = 8,
  labelFontSize = 8,
  compact = false,
  balanced = false,
  rowH: rowHOverride,
} = {}) {
  if (!items?.length) return 0;

  const top = items.slice(0, maxItems);
  const rowH = rowHOverride ?? (compact
    ? Math.max(13, labelFontSize + 7)
    : balanced
      ? Math.max(14, labelFontSize + 8)
      : Math.max(16, labelFontSize + 10));
  const labelColW = 172;
  const valueColW = 52;
  const barGap = 8;
  const labelX = 40;
  const barX = labelX + labelColW + barGap;
  const valueX = doc.page.width - 40 - valueColW;
  const barMaxW = Math.max(60, valueX - barX - barGap);
  const barH = compact ? 11 : balanced ? 12 : 13;
  const titleH = compact ? 22 : balanced ? 26 : 30;
  const startY = doc.y;

  const blockH = titleH + top.length * rowH;
  ensureSpace(doc, blockH);

  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(compact ? 12 : balanced ? 12 : 14).text(title, 40);
  doc.moveDown(compact ? 0.25 : balanced ? 0.3 : 0.4);

  const maxVal = Math.max(...top.map((x) => Number(x[valueKey]) || 0), 1);

  top.forEach((item) => {
    const y = doc.y;
    const val = Number(item[valueKey]) || 0;
    const label = String(item[labelKey] || '');
    const barW = Math.max(2, (val / maxVal) * barMaxW);
    const labelY = y + Math.max(1, Math.floor((rowH - labelFontSize) / 2) - 1);

    doc.fillColor(GRAY).font('Helvetica').fontSize(labelFontSize);
    doc.text(label, labelX, labelY, {
      width: labelColW,
      height: labelFontSize + 2,
      lineBreak: false,
      ellipsis: true,
    });
    doc.roundedRect(barX, y + Math.floor((rowH - barH) / 2), barW, barH, 3).fill(ACCENT);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8);
    doc.text(fmtNum(val), valueX, y + Math.floor((rowH - 8) / 2), {
      width: valueColW,
      align: 'right',
      lineBreak: false,
    });
    doc.y = y + rowH;
  });

  const endY = doc.y + 4;
  doc.y = endY;
  return endY - startY;
}

function drawTable(doc, title, columns, rows, { compact = false, balanced = false } = {}) {
  if (!rows?.length) return;

  const tableX = 40;
  const tableW = doc.page.width - 80;
  const rawWidths = columns.map((c) => c.width || tableW / columns.length);
  const rawTotal = rawWidths.reduce((s, w) => s + w, 0);
  const scale = rawTotal > 0 ? tableW / rawTotal : 1;
  const colWidths = rawWidths.map((w) => Math.max(22, Math.floor(w * scale)));
  const adjustedTotal = colWidths.reduce((s, w) => s + w, 0);
  // Keep the full header strip/table exactly within tableW.
  colWidths[colWidths.length - 1] += tableW - adjustedTotal;
  const rowH = compact ? 15 : balanced ? 16 : 18;

  const drawHeader = (y) => {
    doc.rect(tableX, y, tableW, rowH).fill(PURPLE);
    let cx = tableX;
    columns.forEach((col, i) => {
      doc.fillColor('#fff').font('Helvetica-Bold').fontSize(8);
      doc.text(col.header, cx + 4, y + (compact ? 4 : 5), { width: colWidths[i] - 8, lineBreak: false, ellipsis: true });
      cx += colWidths[i];
    });
    return y + rowH;
  };

  const slice = rows.slice(0, 25);
  const blockH = (compact ? 22 : balanced ? 26 : 30) + rowH + slice.length * rowH;
  ensureSpace(doc, Math.min(blockH, compact ? 100 : balanced ? 110 : 120));

  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(compact ? 12 : balanced ? 12 : 14).text(title, 40);
  doc.moveDown(compact ? 0.25 : balanced ? 0.3 : 0.4);

  let y = drawHeader(doc.y);

  slice.forEach((row, ri) => {
    if (!pageBreakLocked && y + rowH > PAGE_BOTTOM) {
      addContentPage(doc);
      y = drawHeader(doc.y);
    }
    const bg = ri % 2 === 0 ? '#f8fafc' : '#ffffff';
    doc.rect(tableX, y, tableW, rowH).fill(bg);
    let cx = tableX;
    columns.forEach((col, i) => {
      doc.fillColor(DARK).font('Helvetica').fontSize(8);
      const val = col.format ? col.format(row[col.key], row) : String(row[col.key] ?? '');
      doc.text(val, cx + 4, y + (compact ? 4 : 5), { width: colWidths[i] - 8, lineBreak: false, ellipsis: true });
      cx += colWidths[i];
    });
    y += rowH;
  });

  doc.y = y + (compact ? 6 : balanced ? 8 : 10);
}

function drawHoursGuideNote(doc) {
  ensureSpace(doc, 88);
  doc.fillColor(DARK).font('Helvetica-Bold').fontSize(11).text('How hours are counted in this report', 40);
  doc.moveDown(0.3);
  doc.font('Helvetica').fontSize(8).fillColor(GRAY);
  const lines = [
    'Employees table — Working hours count only rows with a project name; Leave hours are rows where project_name is blank.',
    'Weekly breakdown — Only working hours that have both a project and a work date. Total includes all such hours in the period; week columns show up to the 6 most recent weeks.',
    'Task heatmap — Total hrs sums all tasks for each employee (working hours only). Individual columns show only the top 10 tasks by team volume.',
    'If weekly or task totals are lower than working hours in the Employees table, the difference is usually hours logged without a date or task name.',
  ];
  for (const line of lines) {
    doc.text(`•  ${line}`, 48, doc.y, { width: doc.page.width - 96, lineGap: 1 });
    doc.moveDown(0.15);
  }
  doc.moveDown(0.35);
}

function drawWeeklyTimeline(doc, timeline, rowMode, { includeFootnote = false, balanced = false } = {}) {
  if (!timeline?.weeks?.length || !timeline?.rows?.length) {
    ensureSpace(doc, 24);
    doc.fillColor(GRAY).font('Helvetica').fontSize(9);
    doc.text('No weekly timeline data for the selected filters (requires project + date on log rows).', 40);
    doc.moveDown(0.6);
    return;
  }

  const nameCol = 130;
  const totalCol = 52;
  const availableW = doc.page.width - 80 - nameCol - totalCol;
  const weekColW = Math.max(58, Math.floor(availableW / timeline.weeks.length));

  const columns = [
    { header: rowMode === 'overall' ? 'Team' : 'Employee', key: 'label', width: nameCol },
    ...timeline.weeks.map((w) => ({
      header: w.label,
      key: w.key,
      width: weekColW,
      format: (v) => (v > 0 ? fmtNum(v) : '–'),
    })),
    { header: 'Period total', key: 'total', width: totalCol, format: (v) => fmtNum(v) },
  ];

  const rows = timeline.rows.map((r) => {
    const row = { label: r.label, total: r.total };
    for (const w of timeline.weeks) row[w.key] = r.byWeek[w.key] || 0;
    return row;
  });

  drawTable(doc, 'Weekly hours breakdown (project + date)', columns, rows, {
    compact: !balanced,
    balanced,
  });

  if (includeFootnote) {
    drawWeeklyTimelineFootnote(doc);
  }
}

function heatColor(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return 0.12 + clamped * 0.75;
}

function taskHeaderLabel(task) {
  const raw = String(task || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!raw) return 'TASK';
  return raw.slice(0, 4);
}

function drawEmployeeTaskHeatmap(doc, breakdownRows, rowMode = 'employee', { balanced = false } = {}) {
  const fetchedCount = Array.isArray(breakdownRows) ? breakdownRows.length : 0;
  if (!Array.isArray(breakdownRows) || breakdownRows.length === 0) {
    ensureSpace(doc, 42);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(13).text(
      rowMode === 'overall' ? 'Team task heatmap (top tasks)' : 'Employee task heatmap (top tasks)',
      40
    );
    doc.moveDown(0.35);
    doc.fillColor(GRAY).font('Helvetica').fontSize(8);
    doc.text(`No task-level rows available for this filter set (rows: ${fetchedCount}).`, 40);
    doc.moveDown(0.6);
    return;
  }

  const byEmp = new Map();
  const taskTotals = new Map();
  for (const r of breakdownRows) {
    const emp = rowMode === 'overall'
      ? String(r?.team || '').trim()
      : String(r?.employee || '').trim();
    const task = String(r?.task || '').trim();
    const h = Number(r?.hours) || 0;
    if (!emp || !task || h <= 0) continue;
    if (!byEmp.has(emp)) byEmp.set(emp, new Map());
    const m = byEmp.get(emp);
    m.set(task, (m.get(task) || 0) + h);
    taskTotals.set(task, (taskTotals.get(task) || 0) + h);
  }

  const topTasks = Array.from(taskTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([task]) => task);
  if (!topTasks.length) {
    ensureSpace(doc, 42);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(13).text(
      rowMode === 'overall' ? 'Team task heatmap (top tasks)' : 'Employee task heatmap (top tasks)',
      40
    );
    doc.moveDown(0.35);
    doc.fillColor(GRAY).font('Helvetica').fontSize(8);
    doc.text('No non-zero task values found for heatmap.', 40);
    doc.moveDown(0.6);
    return;
  }

  const rows = Array.from(byEmp.entries())
    .map(([employee, taskMap]) => {
      let total = 0;
      const vals = {};
      for (const [task, h] of taskMap.entries()) total += h;
      for (const task of topTasks) vals[task] = taskMap.get(task) || 0;
      return { employee, vals, total };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  if (!rows.length) {
    ensureSpace(doc, 42);
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(13).text(
      rowMode === 'overall' ? 'Team task heatmap (top tasks)' : 'Employee task heatmap (top tasks)',
      40
    );
    doc.moveDown(0.35);
    doc.fillColor(GRAY).font('Helvetica').fontSize(8);
    doc.text('No rows matched selected tasks for heatmap.', 40);
    doc.moveDown(0.6);
    return;
  }

  const columns = [
    { header: rowMode === 'overall' ? 'Team' : 'Employee', key: 'employee', width: 108 },
    ...(() => {
      const tableW = doc.page.width - 80;
      const nameW = 108;
      const totalW = 42;
      const taskW = Math.max(30, Math.floor((tableW - nameW - totalW) / topTasks.length));
      return topTasks.map((task) => ({
        header: taskHeaderLabel(task),
        key: task,
        width: taskW,
        format: (v) => (v > 0 ? fmtNum(v) : '–'),
      }));
    })(),
    { header: 'Total hrs', key: 'total', width: 42, format: (v) => fmtNum(v) },
  ];
  const matrixRows = rows.map((r) => {
    const out = { employee: r.employee, total: r.total };
    for (const task of topTasks) out[task] = r.vals[task] || 0;
    return out;
  });
  drawTable(
    doc,
    rowMode === 'overall' ? 'Team task heatmap (top tasks)' : 'Employee task heatmap (top tasks)',
    columns,
    matrixRows,
    { compact: !balanced, balanced }
  );
  doc.fillColor(GRAY).font('Helvetica').fontSize(7);
  doc.text(
    'Total hrs = all tasks per employee; columns show top 10 tasks by team volume.',
    40,
    doc.y,
    { width: doc.page.width - 80, lineBreak: false }
  );
  doc.moveDown(balanced ? 0.25 : 0.35);
}

function drawProjectInsights(doc, insights) {
  if (!insights) return;

  if (insights.taskBreakdown?.length) {
    const totalH = insights.summary?.totalHours || insights.taskBreakdown.reduce((s, t) => s + (t.totalHours || 0), 0);
    drawTable(doc, 'Task breakdown', [
      { header: 'Task', key: 'task', width: 200 },
      { header: 'Hours', key: 'totalHours', width: 80, format: (v) => fmtNum(v) },
      { header: 'Share %', key: 'sharePct', width: 80, format: (v) => `${fmtNum(v)}%` },
      { header: 'Primary owner', key: 'primaryOwner', width: 150 },
    ], insights.taskBreakdown.map((t) => ({
      task: t.task || t.taskName,
      totalHours: t.totalHours,
      sharePct: totalH > 0 ? ((t.totalHours || 0) / totalH) * 100 : 0,
      primaryOwner: t.primaryOwner,
    })));
  }

  if (insights.employeeContribution?.length) {
    drawTable(doc, 'Employee contribution', [
      { header: 'Employee', key: 'employee', width: 180 },
      { header: 'Hours', key: 'hours', width: 80, format: (v) => fmtNum(v) },
      { header: 'Share %', key: 'contributionPct', width: 80, format: (v) => `${fmtNum(v)}%` },
      { header: 'Tasks', key: 'taskCount', width: 60 },
    ], insights.employeeContribution);
  }

  const flags = insights.insights?.riskFlags;
  if (flags?.length) {
    ensureSpace(doc, 30 + flags.length * 14);
    doc.fillColor('#b45309').font('Helvetica-Bold').fontSize(12).text('Insights & flags', 40);
    doc.moveDown(0.25);
    doc.font('Helvetica').fontSize(9).fillColor('#92400e');
    flags.forEach((f) => doc.text(`- ${f}`, 48));
    doc.moveDown(0.6);
  }
}

function hasEmployeeDetailsSections(sections) {
  return sections.has('employees_table')
    || sections.has('hours_timeline');
}

/** Page 2: projects, work mode, teams, top tasks — evenly distributed. */
function drawOverviewPage(doc, data, sections) {
  const skipKpis = data.reportType !== 'project';
  const hasOverview = (!skipKpis && sections.has('kpis'))
    || sections.has('top_projects')
    || sections.has('work_mode')
    || sections.has('teams_table')
    || sections.has('tasks_breakdown');
  if (!hasOverview) return;

  addContentPage(doc);

  withLockedPageBreaks(() => {
    const pageStartY = CONTENT_TOP;
    const pageEndY = PAGE_BOTTOM;
    const blocks = [];

    if (!skipKpis && sections.has('kpis') && data.overview) {
      blocks.push({ type: 'kpis', height: 96 });
    }
    if (sections.has('top_projects') && data.projects?.length) {
      blocks.push({
        type: 'projects',
        height: measureBarBlockHeight(Math.min(8, data.projects.length), 18),
        items: data.projects,
      });
    }
    if (sections.has('work_mode') && data.workMode?.length) {
      blocks.push({
        type: 'workmode',
        height: measureBarBlockHeight(Math.min(8, data.workMode.length), 18),
        items: data.workMode,
      });
    }
    if (sections.has('teams_table') && data.teams?.length) {
      blocks.push({
        type: 'teams',
        height: measureTableBlockHeight(data.teams.length, 18),
        items: data.teams,
      });
    }
    if (sections.has('tasks_breakdown') && data.tasks?.length) {
      blocks.push({
        type: 'tasks',
        height: measureBarBlockHeight(Math.min(8, data.tasks.length), 18),
        items: data.tasks,
      });
    }

    const baseHeights = blocks.map((b) => b.height);
    const totalBase = baseHeights.reduce((s, h) => s + h, 0);
    const barBlocks = blocks.filter((b) => b.type === 'projects' || b.type === 'workmode' || b.type === 'tasks');
    const totalBarRows = barBlocks.reduce((s, b) => s + Math.min(8, b.items?.length || 0), 0);
    const available = pageEndY - pageStartY;
    const minGaps = 20 * Math.max(0, blocks.length - 1);
    const extra = Math.max(0, available - totalBase - minGaps);
    const rowBonus = totalBarRows > 0 ? Math.min(8, Math.floor(extra * 0.55 / totalBarRows)) : 0;
    const barRowH = 18 + rowBonus;
    const tableRowH = 18 + Math.min(4, rowBonus);

    const adjustedHeights = blocks.map((b) => {
      if (b.type === 'projects' || b.type === 'tasks') {
        return measureBarBlockHeight(Math.min(8, b.items.length), barRowH);
      }
      if (b.type === 'workmode') {
        return measureBarBlockHeight(Math.min(8, b.items.length), barRowH);
      }
      if (b.type === 'teams') {
        return measureTableBlockHeight(b.items.length, tableRowH);
      }
      return b.height;
    });

    const { gap } = computeEvenGaps(pageStartY, pageEndY, adjustedHeights, 20);
    let curY = pageStartY;
    const barOpts = { balanced: true, labelFontSize: 7, rowH: barRowH };

    for (let i = 0; i < blocks.length; i += 1) {
      const block = blocks[i];
      doc.y = curY;

      if (block.type === 'kpis') {
        drawKpis(doc, data.overview, { balanced: true });
      } else if (block.type === 'projects') {
        drawHorizontalBars(doc, 'Top projects by hours', block.items, {
          labelKey: 'name',
          valueKey: 'hours',
          maxItems: 8,
          ...barOpts,
        });
      } else if (block.type === 'workmode') {
        drawHorizontalBars(doc, 'Work mode distribution', block.items, {
          labelKey: 'mode',
          valueKey: 'hours',
          maxItems: 8,
          labelFontSize: 8,
          ...barOpts,
        });
      } else if (block.type === 'teams') {
        drawTable(doc, 'Teams', [
          { header: 'Team', key: 'name', width: 160 },
          { header: 'Working hrs', key: 'workingHours', width: 72, format: (v, row) => fmtNum(v ?? row.hours) },
          { header: 'Leave', key: 'leaveHours', width: 60, format: (v) => fmtNum(v || 0) },
          { header: 'Log rows', key: 'tasks', width: 60 },
        ], block.items, { balanced: true });
      } else if (block.type === 'tasks') {
        drawHorizontalBars(doc, 'Top tasks', block.items, {
          labelKey: 'task',
          valueKey: 'hours',
          maxItems: 8,
          labelFontSize: 8,
          ...barOpts,
        });
      }

      curY = doc.y + (i < blocks.length - 1 ? gap : 0);
    }

    doc.y = pageEndY;
  });
}

/** Page 3+: employee guide, heatmap, employees, weekly — footnote pinned to page bottom. */
function drawEmployeeDetailsBlock(doc, data, sections) {
  const rowMode = data.options?.rowMode === 'employee' ? 'employee' : 'overall';
  const hasGuide = sections.has('hours_timeline');
  const hasHeatmap = sections.has('hours_timeline');
  const hasEmployees = sections.has('employees_table') && data.employees?.length;
  const hasWeekly = sections.has('hours_timeline');
  const footnoteH = measureWeeklyFootnoteHeight(doc) + 12;

  addContentPage(doc);

  withLockedPageBreaks(() => {
    const balanced = { balanced: true };
    const compact = { compact: true };
    let sectionsLeft = [hasGuide, hasHeatmap, hasEmployees, hasWeekly].filter(Boolean).length;

    if (hasGuide) {
      drawHoursGuideNote(doc);
      sectionsLeft -= 1;
      if (sectionsLeft > 0) addFlexibleSectionGap(doc, sectionsLeft, footnoteH);
    }

    if (hasHeatmap) {
      drawEmployeeTaskHeatmap(doc, data.employeeTaskBreakdown, rowMode, compact);
      sectionsLeft -= 1;
      if (sectionsLeft > 0) addFlexibleSectionGap(doc, sectionsLeft, footnoteH);
    }

    if (hasEmployees) {
      drawTable(doc, 'Employees (working & leave hours)', [
        { header: 'Employee', key: 'name', width: 150 },
        { header: 'Team', key: 'team', width: 100 },
        { header: 'Working hrs', key: 'workingHours', width: 68, format: (v, row) => fmtNum(v ?? row.hours) },
        { header: 'Leave', key: 'leaveHours', width: 52, format: (v) => fmtNum(v || 0) },
        { header: 'Log rows', key: 'tasks', width: 52 },
      ], data.employees, compact);
      sectionsLeft -= 1;
    }

    if (hasWeekly) {
      const weeklyEndY = PAGE_BOTTOM - footnoteH;
      if (doc.y < weeklyEndY - 40) {
        doc.y = Math.min(doc.y + 8, weeklyEndY - 40);
      }
      drawWeeklyTimeline(doc, data.weeklyTimeline, rowMode, compact);
      drawWeeklyTimelineFootnote(doc);
    }
  });
}

async function buildReportPdf(data) {
  const doc = new PDFDocument({ size: 'A4', margin: 40, autoFirstPage: true });
  const bufferPromise = collectPdfBuffer(doc);
  contentPageNum = 0;

  const sections = new Set(data.sections || []);
  sections.add('cover');
  sections.add('kpis');

  drawCoverWithSummary(doc, data);

  if (data.reportType === 'project') {
    addContentPage(doc);
    resetContentCursor(doc);

    if (sections.has('kpis') && data.overview) {
      drawKpis(doc, data.overview);
    }

    if (sections.has('task_breakdown') || sections.has('employee_contribution')) {
      drawProjectInsights(doc, data.projectInsights);
    }
    if (sections.has('top_projects') && data.projects?.length) {
      drawHorizontalBars(doc, 'Related projects (context)', data.projects, {
        labelKey: 'name',
        valueKey: 'hours',
        labelFontSize: 6,
      });
    }
  } else {
    drawOverviewPage(doc, data, sections);

    if (hasEmployeeDetailsSections(sections)) {
      drawEmployeeDetailsBlock(doc, data, sections);
    }
  }

  doc.end();
  return bufferPromise;
}

function buildFilename(data) {
  const type = data.reportType || 'report';
  const date = new Date().toISOString().slice(0, 10);
  if (data.filters?.projectName) {
    const safe = String(data.filters.projectName).replace(/[^\w\-]+/g, '_').slice(0, 40);
    return `${type}_${safe}_${date}.pdf`;
  }
  if (data.filters?.employee && data.filters.employee !== 'All') {
    const safe = String(data.filters.employee).replace(/[^\w\-]+/g, '_').slice(0, 30);
    return `employee_${safe}_${date}.pdf`;
  }
  if (data.filters?.team && data.filters.team !== 'All') {
    const safe = String(data.filters.team).replace(/[^\w\-]+/g, '_').slice(0, 30);
    return `team_${safe}_${date}.pdf`;
  }
  return `${type}_report_${date}.pdf`;
}

module.exports = {
  buildReportPdf,
  buildFilename,
  SECTION_LABELS,
};
