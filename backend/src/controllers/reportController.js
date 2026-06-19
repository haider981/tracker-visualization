const { fetchReportData } = require('../services/report/reportDataService');
const { buildReportPdf, buildFilename, SECTION_LABELS } = require('../services/report/pdfBuilder');

const VALID_TYPES = new Set(['project', 'team', 'employee', 'summary']);

const DEFAULT_SECTIONS = {
  project: ['cover', 'kpis', 'task_breakdown', 'employee_contribution'],
  team: ['cover', 'kpis', 'top_projects', 'work_mode', 'teams_table', 'tasks_breakdown', 'employees_table', 'hours_timeline'],
  employee: ['cover', 'kpis', 'top_projects', 'work_mode', 'tasks_breakdown', 'employees_table'],
  summary: ['cover', 'kpis', 'top_projects', 'work_mode', 'teams_table'],
};

function normalizeBody(body = {}) {
  const reportType = String(body.reportType || '').toLowerCase();
  if (!VALID_TYPES.has(reportType)) {
    throw new Error(`Invalid reportType. Use one of: ${Array.from(VALID_TYPES).join(', ')}`);
  }

  const filters = {
    department: body.filters?.department || body.department || 'All',
    team: body.filters?.team || body.team || 'All',
    employee: body.filters?.employee || body.employee || 'All',
    period: body.filters?.period || body.period || 'Last 7 Days',
    projectName: body.filters?.projectName || body.projectName || null,
  };

  const sections = Array.isArray(body.sections) && body.sections.length
    ? body.sections
    : DEFAULT_SECTIONS[reportType];

  const options = {
    rowMode: body.options?.rowMode === 'employee' ? 'employee' : 'overall',
  };

  if (reportType === 'employee' && filters.employee === 'All' && body.filters?.employeeName) {
    filters.employee = body.filters.employeeName;
  }

  return { reportType, filters, sections, options };
}

exports.getSectionCatalog = (_req, res) => {
  res.json({
    sections: SECTION_LABELS,
    defaults: DEFAULT_SECTIONS,
    reportTypes: ['project', 'team', 'employee', 'summary'],
  });
};

exports.getProjectOptions = async (req, res) => {
  try {
    const port = Number(process.env.PORT) || 3001;
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const url = `http://127.0.0.1:${port}/api/dashboard/project-view/filter/project-names${qs}`;
    const response = await fetch(url, { headers: { 'X-Internal-Bundle': '1' } });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to load projects' });
    }
    const names = await response.json();
    res.json(Array.isArray(names) ? names : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const config = normalizeBody(req.body);
    const data = await fetchReportData(config);
    const pdfBuffer = await buildReportPdf(data);
    const filename = buildFilename(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    const status = error.message.includes('required') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
};
