import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, FileDown, ChevronLeft, ChevronRight, Loader2, FileText } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'project', label: 'Project Report', desc: 'Deep dive on one project' },
  { id: 'team', label: 'Team Report', desc: 'Department / team performance' },
  { id: 'employee', label: 'Employee Report', desc: 'Individual work summary' },
  { id: 'summary', label: 'Executive Summary', desc: 'Short management overview' },
];

const SECTION_CATALOG = {
  cover: 'Cover page',
  kpis: 'Key metrics (KPIs)',
  top_projects: 'Top projects chart',
  work_mode: 'Work mode distribution',
  teams_table: 'Teams table',
  employees_table: 'Employees table',
  tasks_breakdown: 'Tasks overview',
  hours_timeline: 'Weekly hours breakdown',
  task_breakdown: 'Task breakdown (project)',
  employee_contribution: 'Employee contribution (project)',
};

const DEFAULT_SECTIONS = {
  project: ['cover', 'kpis', 'task_breakdown', 'employee_contribution'],
  team: ['cover', 'kpis', 'top_projects', 'work_mode', 'teams_table', 'tasks_breakdown', 'employees_table', 'hours_timeline'],
  employee: ['cover', 'kpis', 'top_projects', 'work_mode', 'tasks_breakdown', 'employees_table'],
  summary: ['cover', 'kpis', 'top_projects', 'work_mode', 'teams_table'],
};

const PERIODS = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'This Year',
  'All',
];

function sectionsForType(reportType) {
  const all = DEFAULT_SECTIONS[reportType] || DEFAULT_SECTIONS.summary;
  return Object.fromEntries(
    Object.entries(SECTION_CATALOG).filter(([key]) => {
      if (key === 'cover' || key === 'kpis') return true;
      if (reportType === 'project') return ['task_breakdown', 'employee_contribution', 'top_projects'].includes(key);
      if (reportType === 'team') return !['task_breakdown', 'employee_contribution'].includes(key);
      if (reportType === 'employee') return !['teams_table', 'task_breakdown', 'employee_contribution', 'hours_timeline'].includes(key);
      return !['task_breakdown', 'employee_contribution', 'employees_table', 'hours_timeline', 'tasks_breakdown'].includes(key);
    }).map(([key, label]) => [key, label])
  );
}

export default function ReportGenerator({
  isOpen,
  onClose,
  reportsApiUrl,
  dashboardFilters = {},
  departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'],
  filteredTeams = [],
  employeeNames = [],
  ganttRowMode = 'overall',
  defaultReportType = 'team',
  defaultProjectName = '',
}) {
  const [step, setStep] = useState(0);
  const [reportType, setReportType] = useState(defaultReportType);
  const [useDashboardFilters, setUseDashboardFilters] = useState(true);
  const [department, setDepartment] = useState('All');
  const [team, setTeam] = useState('All');
  const [employee, setEmployee] = useState('All');
  const [period, setPeriod] = useState('Last 7 Days');
  const [projectName, setProjectName] = useState('');
  const [projectOptions, setProjectOptions] = useState([]);
  const [rowMode, setRowMode] = useState(ganttRowMode);
  const [sections, setSections] = useState(() => new Set(DEFAULT_SECTIONS.team));
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState('');

  const availableSections = useMemo(() => sectionsForType(reportType), [reportType]);

  const resetFromDashboard = useCallback(() => {
    setDepartment(dashboardFilters.department || 'All');
    setTeam(dashboardFilters.team || 'All');
    setEmployee(dashboardFilters.employee || 'All');
    setPeriod(dashboardFilters.period || 'Last 7 Days');
    setRowMode(dashboardFilters.ganttRowMode || ganttRowMode);
  }, [dashboardFilters, ganttRowMode]);

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setError('');
    resetFromDashboard();
    setReportType(defaultReportType);
    setSections(new Set(DEFAULT_SECTIONS[defaultReportType] || DEFAULT_SECTIONS.team));
    setUseDashboardFilters(true);
    if (defaultProjectName) setProjectName(defaultProjectName);
  }, [isOpen, resetFromDashboard, defaultReportType, defaultProjectName]);

  useEffect(() => {
    if (!isOpen) return;
    setSections(new Set(DEFAULT_SECTIONS[reportType] || DEFAULT_SECTIONS.summary));
  }, [reportType, isOpen]);

  useEffect(() => {
    if (!isOpen || reportType !== 'project') return;
    let cancelled = false;
    setLoadingProjects(true);
    fetch(`${reportsApiUrl}/options/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setProjectOptions(Array.isArray(data) ? data : []);
          if (data?.length && !projectName) setProjectName(data[0]);
        }
      })
      .catch(() => {
        if (!cancelled) setProjectOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false);
      });
    return () => { cancelled = true; };
  }, [isOpen, reportType, reportsApiUrl, projectName]);

  useEffect(() => {
    if (useDashboardFilters) resetFromDashboard();
  }, [useDashboardFilters, resetFromDashboard]);

  const toggleSection = (key) => {
    if (key === 'cover' || key === 'kpis') return;
    setSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      next.add('cover');
      next.add('kpis');
      return next;
    });
  };

  const effectiveFilters = useMemo(() => ({
    department: useDashboardFilters ? (dashboardFilters.department || department) : department,
    team: useDashboardFilters ? (dashboardFilters.team || team) : team,
    employee: useDashboardFilters ? (dashboardFilters.employee || employee) : employee,
    period: useDashboardFilters ? (dashboardFilters.period || period) : period,
    projectName: reportType === 'project' ? projectName : null,
  }), [useDashboardFilters, dashboardFilters, department, team, employee, period, projectName, reportType]);

  const canNext = () => {
    if (step === 0) return !!reportType;
    if (step === 1) {
      if (reportType === 'project') return !!projectName;
      if (reportType === 'employee') return effectiveFilters.employee && effectiveFilters.employee !== 'All';
      return true;
    }
    return true;
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    setDownloadProgress(0);
    try {
      const body = {
        reportType,
        filters: effectiveFilters,
        sections: Array.from(sections),
        options: {
          rowMode: reportType === 'team' ? rowMode : 'employee',
        },
      };

      const { blob, disposition } = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${reportsApiUrl}/generate`);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            setDownloadProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
          } else {
            // Fallback when content-length is unavailable
            setDownloadProgress((p) => Math.min(95, p + 5));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const donePayload = {
              blob: xhr.response,
              disposition: xhr.getResponseHeader('Content-Disposition') || '',
            };
            setDownloadProgress(100);
            // Ensure user actually sees 100% before file save starts.
            setTimeout(() => resolve(donePayload), 450);
            return;
          }
          const fr = new FileReader();
          fr.onload = () => {
            try {
              const parsed = JSON.parse(String(fr.result || '{}'));
              reject(new Error(parsed.error || `Report failed (${xhr.status})`));
            } catch {
              reject(new Error(`Report failed (${xhr.status})`));
            }
          };
          fr.onerror = () => reject(new Error(`Report failed (${xhr.status})`));
          fr.readAsText(xhr.response);
        };

        xhr.onerror = () => reject(new Error('Network error while downloading report'));
        xhr.send(JSON.stringify(body));
      });
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] || `report_${Date.now()}.pdf`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setTimeout(() => onClose(), 250);
    } catch (e) {
      setError(e.message || 'Failed to generate report');
    } finally {
      setLoading(false);
      setTimeout(() => setDownloadProgress(0), 600);
    }
  };

  if (!isOpen) return null;

  const steps = ['Report type', 'Scope', 'Sections', 'Generate'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border border-purple-500/40 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/80 to-gray-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Generate Report</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {steps.map((label, i) => (
            <div
              key={label}
              className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-gray-700'}`}
              title={label}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setReportType(t.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    reportType === t.id
                      ? 'border-purple-500 bg-purple-950/50 ring-1 ring-purple-500/50'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-white">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDashboardFilters}
                  onChange={(e) => setUseDashboardFilters(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800 text-purple-500"
                />
                Use current dashboard filters
              </label>

              {!useDashboardFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Team</label>
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="All">All</option>
                      {filteredTeams.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {reportType === 'employee' && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Employee</label>
                      <select
                        value={employee}
                        onChange={(e) => setEmployee(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="All">Select employee...</option>
                        {employeeNames.filter((n) => n !== 'All').map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className={reportType === 'employee' ? '' : 'sm:col-span-2'}>
                    <label className="text-xs font-semibold text-gray-400 block mb-1">Period</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {PERIODS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {reportType === 'project' && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Project</label>
                  {loadingProjects ? (
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading projects...
                    </div>
                  ) : (
                    <select
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {projectOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {reportType === 'team' && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Row mode (like Team View)</label>
                  <div className="inline-flex rounded-lg border border-purple-500/50 overflow-hidden text-xs font-semibold">
                    <button
                      type="button"
                      className={`px-4 py-2 ${rowMode === 'overall' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                      onClick={() => setRowMode('overall')}
                    >
                      Overall (teams)
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 border-l border-purple-500/40 ${rowMode === 'employee' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                      onClick={() => setRowMode('employee')}
                    >
                      Employee
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-gray-700 bg-gray-800/40 px-4 py-3 text-xs text-gray-400">
                <span className="text-gray-300 font-semibold">Preview scope: </span>
                {effectiveFilters.department !== 'All' && `Dept ${effectiveFilters.department} · `}
                {effectiveFilters.team !== 'All' && `Team ${effectiveFilters.team} · `}
                {effectiveFilters.employee !== 'All' && `Employee ${effectiveFilters.employee} · `}
                Period {effectiveFilters.period}
                {reportType === 'project' && projectName && ` · Project: ${projectName}`}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-3">Choose what to include in the PDF:</p>
              {Object.entries(availableSections).map(([key, label]) => {
                const locked = key === 'cover' || key === 'kpis';
                const checked = sections.has(key) || locked;
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      checked ? 'border-purple-500/40 bg-purple-950/20' : 'border-gray-700 bg-gray-800/30'
                    } ${locked ? 'opacity-70' : 'cursor-pointer hover:border-gray-600'}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={locked}
                      onChange={() => toggleSection(key)}
                      className="rounded border-gray-600 bg-gray-800 text-purple-500"
                    />
                    <span className="text-sm text-gray-200">{label}</span>
                    {locked && <span className="text-[10px] text-gray-500 ml-auto">Required</span>}
                  </label>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40">
                <FileDown className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Ready to generate</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {REPORT_TYPES.find((t) => t.id === reportType)?.label} · {Array.from(sections).length} sections
                </p>
              </div>
              {loading && (
                <div className="w-full max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Downloading report...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-800 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-700 bg-gray-900/80">
          <button
            type="button"
            disabled={step === 0 || loading}
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" /> Download PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
