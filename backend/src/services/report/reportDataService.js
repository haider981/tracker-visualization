/**
 * Fetches dashboard data for PDF reports via internal HTTP (same pattern as bundle).
 */

const { buildWeeklyTimelineMatrix, aggregateGanttHours } = require('./reportWeekUtils');

const BUNDLE_TIMEOUT_MS = 120_000;

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();
  const {
    department,
    team,
    employee,
    period,
    projectName,
    projectNames,
  } = filters;

  if (department && department !== 'All') params.set('department', department);
  if (team && team !== 'All') params.set('team', team);
  if (employee && employee !== 'All') params.set('employee', employee);
  if (period && period !== 'All') params.set('period', period);

  if (projectName) params.set('project_name', projectName);
  if (Array.isArray(projectNames)) {
    for (const p of projectNames) {
      if (p) params.append('project_name', p);
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

async function fetchJson(port, path, queryString = '') {
  const url = `http://127.0.0.1:${port}${path}${queryString}`;
  const response = await fetch(url, {
    headers: { 'X-Internal-Bundle': '1' },
    signal: AbortSignal.timeout(BUNDLE_TIMEOUT_MS),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Report data fetch failed (${response.status}): ${text.slice(0, 200)}`);
  }
  return response.json();
}

async function fetchSection(port, section, queryString) {
  return fetchJson(port, `/api/dashboard/${section}`, queryString);
}


/**
 * @param {{ reportType: string, filters: object, sections: string[], options?: object }} config
 */
async function fetchReportData(config) {
  const port = Number(process.env.PORT) || 3001;
  const { reportType, filters = {}, sections = [], options = {} } = config;
  const qs = buildQueryString(filters);

  const data = {
    reportType,
    filters,
    sections,
    options,
    generatedAt: new Date().toISOString(),
  };

  const needs = new Set(sections);
  needs.add('cover');
  needs.add('kpis');

  if (reportType === 'project') {
    if (!filters.projectName) {
      throw new Error('projectName is required for project reports');
    }
    const projectQs = buildQueryString({ ...filters, projectName: filters.projectName });
    const [insights, projects] = await Promise.all([
      fetchJson(port, '/api/dashboard/project-view/project-insights', projectQs),
      needs.has('top_projects')
        ? fetchSection(port, 'projects', qs)
        : Promise.resolve([]),
    ]);
    data.projectInsights = insights;
    data.overview = insights?.summary
      ? {
          totalProjects: insights.summary.totalProjects,
          totalEmployees: insights.summary.totalEmployees,
          totalHours: insights.summary.totalHours,
          totalTasks: insights.summary.totalTasks,
        }
      : null;
    data.projects = projects;
    data.title = `Project Report: ${filters.projectName}`;
    data.subtitle = 'Detailed project performance analysis';
  } else {
    const fetches = [
      fetchSection(port, 'overview', qs),
      needs.has('top_projects') ? fetchSection(port, 'projects', qs) : Promise.resolve([]),
      needs.has('work_mode') ? fetchSection(port, 'workmode', qs) : Promise.resolve([]),
      needs.has('employees_table') || reportType === 'employee'
        ? fetchSection(port, 'employees', qs)
        : Promise.resolve([]),
      needs.has('teams_table') || (reportType === 'team' && options.rowMode === 'overall')
        ? fetchSection(port, 'teams', qs)
        : Promise.resolve([]),
      needs.has('hours_timeline')
        ? fetchSection(port, 'project-gantt', qs)
        : Promise.resolve([]),
      needs.has('hours_timeline')
        ? fetchSection(port, 'employee-task-breakdown', qs)
        : Promise.resolve([]),
      needs.has('tasks_breakdown') ? fetchSection(port, 'tasks', qs) : Promise.resolve([]),
    ];

    const [
      overview,
      projects,
      workMode,
      employees,
      teams,
      ganttRows,
      employeeTaskBreakdown,
      tasks,
    ] = await Promise.all(fetches);

    data.overview = overview;
    data.projects = projects;
    data.workMode = workMode;
    data.employees = employees;
    data.teams = teams;
    data.ganttRows = ganttRows;
    data.employeeTaskBreakdown = employeeTaskBreakdown;
    data.tasks = tasks;
    data.options = options;

    if (reportType === 'team') {
      const rowMode = options.rowMode === 'employee' ? 'employee' : 'overall';
      data.ganttAggregate = aggregateGanttHours(ganttRows, rowMode);
      if (needs.has('hours_timeline')) {
        data.weeklyTimeline = buildWeeklyTimelineMatrix(ganttRows, rowMode);
      }
      data.title = rowMode === 'overall' ? 'Team Report' : 'Team Employee Report';
      data.subtitle = buildScopeSubtitle(filters, rowMode === 'overall' ? 'teams' : 'employees');
    } else if (reportType === 'employee') {
      const rowMode = 'employee';
      if (needs.has('hours_timeline') && ganttRows.length) {
        data.weeklyTimeline = buildWeeklyTimelineMatrix(ganttRows, rowMode);
        data.ganttAggregate = aggregateGanttHours(ganttRows, rowMode);
      }
      data.title = filters.employee && filters.employee !== 'All'
        ? `Employee Report: ${filters.employee}`
        : 'Employee Report';
      data.subtitle = buildScopeSubtitle(filters, 'employee');
    } else {
      data.title = 'Executive Summary Report';
      data.subtitle = buildScopeSubtitle(filters, 'organization');
    }
  }

  return data;
}

function buildScopeSubtitle(filters, focus) {
  const parts = [];
  if (filters.department && filters.department !== 'All') parts.push(`Department: ${filters.department}`);
  if (filters.team && filters.team !== 'All') parts.push(`Team: ${filters.team}`);
  if (filters.employee && filters.employee !== 'All') parts.push(`Employee: ${filters.employee}`);
  if (filters.period && filters.period !== 'All') parts.push(`Period: ${filters.period}`);
  if (!parts.length) parts.push(`Scope: All ${focus}`);
  return parts.join('  |  ');
}

module.exports = {
  buildQueryString,
  fetchReportData,
};
