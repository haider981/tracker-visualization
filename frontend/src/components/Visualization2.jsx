// import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Filter, X, Search, TrendingUp } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';

// // 30 distinct colours — enough to cover all task types without collisions
// const TASK_COLORS = [
//   '#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316',
//   '#6366f1','#84cc16','#06b6d4','#e11d48','#d97706','#0891b2','#7c3aed','#059669',
//   '#dc2626','#2563eb','#ca8a04','#16a34a','#9333ea','#db2777','#ea580c','#0284c7',
//   '#4f46e5','#65a30d','#0e7490','#be123c','#b45309','#15803d'
// ];

// // Department → team-name matcher  (same logic as Visualization.jsx)
// const DEPARTMENT_TEAM_MAPPING = {
//   DTP:              t => t.startsWith('DTP') || t.startsWith('Animation'),
//   Editorial:        t => t.startsWith('Editorial') || t.startsWith('CSMA'),
//   'Digital Marketing': t => t === 'Digital_Marketing'
// };

// // ─── helper: build a stable colour map from a task-name list ───
// function buildColorMap(taskNames) {
//   const map = {};
//   taskNames.forEach((name, i) => { map[name] = TASK_COLORS[i % TASK_COLORS.length]; });
//   return map;
// }

// // ─── Timeline Tooltip (matches screenshot: Task | Hours table + Total row) ───
// const TimelineTooltip = memo(({ active, payload, label, taskColorMap }) => {
//   if (!active || !payload || !payload.length) return null;

//   // filter out zero-value entries, sort desc
//   const entries = payload
//     .filter(e => e.value && e.value > 0)
//     .sort((a, b) => b.value - a.value);

//   const total = entries.reduce((s, e) => s + (e.value || 0), 0);

//   return (
//     <div style={{ backgroundColor: 'rgb(17 24 39)', border: '2px solid #8b5cf6', borderRadius: 8, padding: '10px 14px', minWidth: 180, boxShadow: '0 4px 24px rgba(0,0,0,.5)', zIndex: 10001 }}>
//       {label && <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{label}</p>}
//       <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//         <thead>
//           <tr style={{ borderBottom: '1px solid #374151' }}>
//             <th style={{ textAlign: 'left', color: '#9ca3af', fontWeight: 500, paddingBottom: 4 }}>Task</th>
//             <th style={{ textAlign: 'right', color: '#9ca3af', fontWeight: 500, paddingBottom: 4 }}>Hours</th>
//           </tr>
//         </thead>
//         <tbody>
//           {entries.map((e, i) => (
//             <tr key={i}>
//               <td style={{ color: e.color || '#fff', fontWeight: 600, padding: '2px 0' }}>{e.name}</td>
//               <td style={{ color: '#fff', textAlign: 'right', fontWeight: 600 }}>{e.value.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//         <tfoot>
//           <tr style={{ borderTop: '1px solid #374151' }}>
//             <td style={{ color: '#a78bfa', fontWeight: 700, padding: '4px 0 0' }}>Total</td>
//             <td style={{ color: '#a78bfa', textAlign: 'right', fontWeight: 700 }}>{total.toFixed(2)}</td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// });
// TimelineTooltip.displayName = 'TimelineTooltip';

// // ─── Main Component ────────────────────────────────────────────
// const Visualization2 = () => {
//   // ── filter state ──
//   const [departments]           = useState(['All', 'DTP', 'Editorial', 'Digital Marketing']);
//   const [allTeams, setAllTeams] = useState([]);
//   const [filteredTeams, setFilteredTeams] = useState([]);
//   const [employeeNames, setEmployeeNames] = useState([]);

//   const [selDept,       setSelDept]       = useState('All');
//   const [selTeam,       setSelTeam]       = useState('All');
//   const [selEmployee,   setSelEmployee]   = useState('All');
//   const [selProject,    setSelProject]    = useState('All');
//   const [selElement,    setSelElement]    = useState('All');
//   const [selTask,       setSelTask]       = useState('All');
//   const [selPeriod,     setSelPeriod]     = useState('All');
//   const [projectSearch, setProjectSearch] = useState('');

//   // ── dropdown visibility ──
//   const [showProjDrop, setShowProjDrop] = useState(false);

//   // ── data ──
//   const [projects,        setProjects]        = useState([]);  // top-10 with task breakdown
//   const [projectNames,    setProjectNames]    = useState([]);  // for Project Name dropdown
//   const [taskNames,       setTaskNames]       = useState([]);  // for Task dropdown
//   const [elementNames,    setElementNames]    = useState([]);  // for Project Element dropdown
//   const [timeline,        setTimeline]        = useState([]);  // area chart rows
//   const [timelineTasks,   setTimelineTasks]   = useState([]);  // task keys present in timeline
//   const [selectedProject, setSelectedProject] = useState(null); // clicked project name (drives timeline)

//   const [loading, setLoading] = useState(true);

//   // ── refs ──
//   const projDropRef = useRef(null);

//   // ─── colour map: stable across renders, built from ALL tasks seen in projects data ──
//   const globalTaskColorMap = useMemo(() => {
//     const set = new Set();
//     projects.forEach(p => p.tasks.forEach(t => set.add(t.task)));
//     return buildColorMap([...set]);
//   }, [projects]);

//   // ─── fetch filter lists ──────────────────────────────────────
//   const fetchFilters = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (selTeam !== 'All') params.append('team', selTeam);
//       if (selEmployee !== 'All') params.append('employee', selEmployee);
//       if (selPeriod !== 'All') params.append('period', selPeriod);
//       const qs = params.toString();
//       const sfx = qs ? `?${qs}` : '';

//       const [teamsRes, empRes, projRes, taskRes, elemRes] = await Promise.all([
//         fetch(`${API_URL}/filters/teams`),
//         fetch(`${API_URL}/filters/employees?${qs}`),
//         fetch(`${API_URL}/project-view/filter/project-names${sfx}`),
//         fetch(`${API_URL}/project-view/filter/tasks${sfx}`),
//         fetch(`${API_URL}/project-view/filter/elements${sfx}`)
//       ]);

//       setAllTeams(await teamsRes.json());
//       setEmployeeNames(await empRes.json());
//       setProjectNames(await projRes.json());
//       setTaskNames(await taskRes.json());
//       setElementNames(await elemRes.json());
//     } catch (e) { console.error('fetchFilters', e); }
//   };

//   // ─── fetch horizontal bar data ───────────────────────────────
//   const fetchProjects = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (selTeam !== 'All')     params.append('team', selTeam);
//       if (selEmployee !== 'All') params.append('employee', selEmployee);
//       if (selPeriod !== 'All')   params.append('period', selPeriod);
//       if (selProject !== 'All')  params.append('project_name', selProject);
//       if (selTask !== 'All')     params.append('task_name', selTask);
//       if (selElement !== 'All')  params.append('book_element', selElement);

//       const res = await fetch(`${API_URL}/project-view/projects?${params}`);
//       const data = await res.json();
//       setProjects(data);
//       setLoading(false);
//     } catch (e) { console.error('fetchProjects', e); setLoading(false); }
//   };

//   // ─── fetch timeline for ONE project ──────────────────────────
//   const fetchTimeline = async (projectName) => {
//     if (!projectName) { setTimeline([]); setTimelineTasks([]); return; }
//     try {
//       const params = new URLSearchParams();
//       params.append('project_name', projectName);
//       if (selTeam !== 'All')     params.append('team', selTeam);
//       if (selEmployee !== 'All') params.append('employee', selEmployee);
//       if (selPeriod !== 'All')   params.append('period', selPeriod);

//       const res = await fetch(`${API_URL}/project-view/timeline?${params}`);
//       const { timeline: rows, tasks } = await res.json();
//       setTimeline(rows);
//       setTimelineTasks(tasks);
//     } catch (e) { console.error('fetchTimeline', e); }
//   };

//   // ─── effects ─────────────────────────────────────────────────
//   useEffect(() => { fetchFilters(); }, []);

//   // Department → filtered teams
//   useEffect(() => {
//     if (selDept === 'All') { setFilteredTeams(allTeams); return; }
//     const fn = DEPARTMENT_TEAM_MAPPING[selDept];
//     setFilteredTeams(fn ? allTeams.filter(fn) : []);
//   }, [selDept, allTeams]);

//   // Any filter change → refetch projects
//   useEffect(() => {
//     fetchProjects();
//     fetchFilters();
//   }, [selTeam, selEmployee, selPeriod, selProject, selTask, selElement]);

//   // When department changes reset downstream
//   useEffect(() => { setSelTeam('All'); setSelEmployee('All'); }, [selDept]);
//   // When team changes reset employee
//   useEffect(() => { setSelEmployee('All'); }, [selTeam]);

//   // Timeline follows selectedProject
//   useEffect(() => { fetchTimeline(selectedProject); }, [selectedProject, selTeam, selEmployee, selPeriod]);

//   // Click-outside closes project search dropdown
//   useEffect(() => {
//     const handler = (e) => {
//       if (projDropRef.current && !projDropRef.current.contains(e.target)) setShowProjDrop(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // ─── clear all ───────────────────────────────────────────────
//   const clearAll = () => {
//     setSelDept('All'); setSelTeam('All'); setSelEmployee('All');
//     setSelProject('All'); setSelElement('All'); setSelTask('All');
//     setSelPeriod('All'); setProjectSearch('');
//     setSelectedProject(null);
//   };

//   // ─── derived: filtered project names for the search dropdown ─
//   const filteredProjNames = useMemo(() => {
//     if (!projectSearch.trim()) return projectNames;
//     return projectNames.filter(n => n.toLowerCase().includes(projectSearch.toLowerCase()));
//   }, [projectSearch, projectNames]);

//   // ─── HORIZONTAL BAR CHART (custom SVG) ──────────────────────
//   // Each project = one row.  Each row is segmented by task, widths proportional to hours.
//   // Largest segment shows its task label if wide enough.
//   const BAR_HEIGHT = 28;
//   const ROW_GAP = 8;
//   const LABEL_COL_WIDTH = 260; // px reserved for project names on the left
//   const BAR_AREA_WIDTH = 900;  // px for the actual bars (will scale with container)

//   const maxTotalHours = useMemo(() => Math.max(...projects.map(p => p.totalHours), 1), [projects]);

//   // Hover state for bar tooltip
//   const [barTooltip, setBarTooltip] = useState(null); // { x, y, task, hours, units }

//   const renderBars = () => {
//     return projects.map((project, pIdx) => {
//       const y = pIdx * (BAR_HEIGHT + ROW_GAP);
//       const barWidth = (project.totalHours / maxTotalHours) * BAR_AREA_WIDTH;
//       let xOffset = 0;

//       const segments = project.tasks.map((t, tIdx) => {
//         const segW = (t.hours / project.totalHours) * barWidth;
//         const seg = (
//           <g key={tIdx}>
//             <rect
//               x={xOffset}
//               y={y}
//               width={segW}
//               height={BAR_HEIGHT}
//               fill={globalTaskColorMap[t.task] || '#666'}
//               onMouseEnter={(e) => {
//                 const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
//                 const mouseX = e.clientX - svgRect.left;
//                 const mouseY = e.clientY - svgRect.top;
//                 setBarTooltip({ x: mouseX, y: mouseY, task: t.task, hours: t.hours, units: t.units, projectName: project.name });
//               }}
//               onMouseMove={(e) => {
//                 const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
//                 setBarTooltip(prev => prev ? { ...prev, x: e.clientX - svgRect.left, y: e.clientY - svgRect.top } : prev);
//               }}
//               onMouseLeave={() => setBarTooltip(null)}
//               style={{ cursor: 'pointer' }}
//             />
//             {/* label if segment is wide enough (>50px) */}
//             {segW > 50 && (
//               <text
//                 x={xOffset + segW / 2}
//                 y={y + BAR_HEIGHT / 2}
//                 textAnchor="middle"
//                 dominantBaseline="central"
//                 fill="#fff"
//                 fontSize={11}
//                 fontWeight={600}
//                 pointerEvents="none"
//                 style={{ textShadow: '0 1px 2px rgba(0,0,0,.6)' }}
//               >
//                 {t.task.length > segW / 6.5 ? t.task.slice(0, Math.floor(segW / 6.5) - 1) + '…' : t.task}
//               </text>
//             )}
//           </g>
//         );
//         xOffset += segW;
//         return seg;
//       });

//       // Determine if this project name should be bold (it's the selected timeline project)
//       const isSelected = project.name === selectedProject;

//       return (
//         <g key={pIdx}>
//           {/* project name label — clickable */}
//           <text
//             x={LABEL_COL_WIDTH - 12}
//             y={y + BAR_HEIGHT / 2}
//             textAnchor="end"
//             dominantBaseline="central"
//             fill={isSelected ? '#fff' : '#d1d5db'}
//             fontSize={12}
//             fontWeight={isSelected ? 700 : 400}
//             style={{ cursor: 'pointer', userSelect: 'none' }}
//             onClick={() => setSelectedProject(isSelected ? null : project.name)}
//           >
//             {project.name.length > 36 ? project.name.slice(0, 34) + '…' : project.name}
//           </text>
//           {/* bar segments group — offset by label column */}
//           <g transform={`translate(${LABEL_COL_WIDTH}, 0)`}>
//             {segments}
//           </g>
//         </g>
//       );
//     });
//   };

//   // total SVG height
//   const svgHeight = projects.length * (BAR_HEIGHT + ROW_GAP) + 4;

//   // ─── legend: all tasks present in current projects data ──────
//   const legendTasks = useMemo(() => {
//     const set = new Set();
//     projects.forEach(p => p.tasks.forEach(t => set.add(t.task)));
//     return [...set];
//   }, [projects]);

//   // ─── timeline colour map (uses same global map) ─────────────
//   const timelineColorMap = useMemo(() => {
//     const map = {};
//     timelineTasks.forEach(t => { map[t] = globalTaskColorMap[t] || TASK_COLORS[legendTasks.indexOf(t) % TASK_COLORS.length]; });
//     return map;
//   }, [timelineTasks, globalTaskColorMap, legendTasks]);

//   // ─── render ──────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
//           <p className="text-white text-xl">Loading Project View…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* ─── STICKY HEADER + FILTERS ─── */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         <div className="px-6 pt-5 pb-2">
//           <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Project View
//           </h1>
//         </div>

//         {/* filters grid: row1 = Dept | ProjectCategory(search) | Employee | Element
//                           row2 = Team | ProjectName            | Period   | Task   + CLEAR ALL */}
//         <div className="px-6 pb-5">
//           <div className="bg-gray-800 bg-opacity-70 rounded-xl p-5 border border-gray-700 shadow-xl">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-lg font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" size={18} /> Filters
//               </h2>
//               <button onClick={clearAll} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors text-sm font-semibold">
//                 <X size={14} className="mr-1.5" /> CLEAR ALL
//               </button>
//             </div>

//             {/* Row 1 */}
//             <div className="grid grid-cols-4 gap-3 mb-3">
//               {/* Department */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Department</label>
//                 <select value={selDept} onChange={e => setSelDept(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                   {departments.map(d => <option key={d} value={d}>{d}</option>)}
//                 </select>
//               </div>

//               {/* Project Category (search) — this is the "Project Name" searchable filter */}
//               <div className="relative" ref={projDropRef}>
//                 <label className="text-white text-xs font-semibold mb-1 block">Project Category</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={projectSearch}
//                     placeholder="Search…"
//                     onChange={e => { setProjectSearch(e.target.value); setShowProjDrop(true); }}
//                     onFocus={() => setShowProjDrop(true)}
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                   <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 </div>
//                 {showProjDrop && (
//                   <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
//                     <div onClick={() => { setSelProject('All'); setProjectSearch(''); setShowProjDrop(false); }}
//                       className="px-3 py-1.5 hover:bg-gray-600 cursor-pointer text-white text-sm">All</div>
//                     {filteredProjNames.map(n => (
//                       <div key={n} onClick={() => { setSelProject(n); setProjectSearch(n); setShowProjDrop(false); }}
//                         className="px-3 py-1.5 hover:bg-gray-600 cursor-pointer text-white text-sm truncate">{n}</div>
//                     ))}
//                     {filteredProjNames.length === 0 && <div className="px-3 py-1.5 text-gray-400 text-sm">No match</div>}
//                   </div>
//                 )}
//               </div>

//               {/* Employee Name */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Employee Name</label>
//                 <select value={selEmployee} onChange={e => setSelEmployee(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500
//                              disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selTeam === 'All'}>
//                   <option value="All">All</option>
//                   {employeeNames.map(e => <option key={e} value={e}>{e}</option>)}
//                 </select>
//               </div>

//               {/* Project Element */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Project Element</label>
//                 <select value={selElement} onChange={e => setSelElement(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                   <option value="All">All</option>
//                   {elementNames.map(e => <option key={e} value={e}>{e}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* Row 2 */}
//             <div className="grid grid-cols-4 gap-3">
//               {/* Team Name */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Team Name</label>
//                 <select value={selTeam} onChange={e => setSelTeam(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500
//                              disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selDept === 'All'}>
//                   <option value="All">All</option>
//                   {filteredTeams.map(t => <option key={t} value={t}>{t}</option>)}
//                 </select>
//               </div>

//               {/* Project Name dropdown */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Project Name</label>
//                 <select value={selProject} onChange={e => setSelProject(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                   <option value="All">All</option>
//                   {projectNames.map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//               </div>

//               {/* Period */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Period</label>
//                 <select value={selPeriod} onChange={e => setSelPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="Last Year">Last Year</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>

//               {/* Task */}
//               <div>
//                 <label className="text-white text-xs font-semibold mb-1 block">Task</label>
//                 <select value={selTask} onChange={e => setSelTask(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
//                   <option value="All">All</option>
//                   {taskNames.map(t => <option key={t} value={t}>{t}</option>)}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ─── SCROLLABLE BODY ─── */}
//       <div className="px-6 py-5">

//         {/* ── PROJECT-WISE TASKS title ── */}
//         <h2 className="text-2xl font-bold text-white text-center mb-2">Project-wise Tasks</h2>

//         {/* ── scrollable legend (task colours) ── */}
//         <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
//           {legendTasks.map(t => (
//             <span key={t} className="flex items-center gap-1 text-gray-300 text-xs whitespace-nowrap">
//               <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: globalTaskColorMap[t] || '#666' }} />
//               {t}
//             </span>
//           ))}
//         </div>

//         {/* ── HORIZONTAL BAR CHART (custom SVG inside scrollable container) ── */}
//         <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl overflow-hidden mb-6">
//           <div className="overflow-x-auto" style={{ position: 'relative' }}>
//             <svg width={LABEL_COL_WIDTH + BAR_AREA_WIDTH + 20} height={svgHeight} style={{ display: 'block' }}>
//               {renderBars()}
//             </svg>

//             {/* floating tooltip on bar hover */}
//             {barTooltip && (
//               <div style={{
//                 position: 'absolute',
//                 left: barTooltip.x + LABEL_COL_WIDTH + 12,
//                 top: barTooltip.y - 20,
//                 pointerEvents: 'none',
//                 zIndex: 100,
//                 backgroundColor: 'rgb(17 24 39)',
//                 border: '2px solid #8b5cf6',
//                 borderRadius: 8,
//                 padding: '10px 16px',
//                 boxShadow: '0 4px 24px rgba(0,0,0,.6)',
//                 minWidth: 180
//               }}>
//                 <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{barTooltip.task}</p>
//                 <div style={{ display: 'flex', gap: 32 }}>
//                   <div>
//                     <p style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{barTooltip.units?.toLocaleString() || 0}</p>
//                     <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Units</p>
//                   </div>
//                   <div>
//                     <p style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{barTooltip.hours?.toFixed(2)}</p>
//                     <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Hours</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* horizontal scroll handle hint */}
//           <div className="flex justify-between px-2 py-1">
//             <span className="text-gray-500 text-xs">← scroll →</span>
//           </div>
//         </div>

//         {/* ── PROJECT TIMELINE (area chart — shown when a project name is clicked) ── */}
//         <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-5">
//           <h2 className="text-2xl font-bold text-white text-center mb-1">Project Timeline</h2>

//           {selectedProject ? (
//             <>
//               {/* legend: single dot + project name */}
//               <p className="text-center text-gray-300 text-sm mb-3">
//                 <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', marginRight: 6 }} />
//                 {selectedProject}
//               </p>

//               {timeline.length > 0 ? (
//                 <ResponsiveContainer width="100%" height={320}>
//                   <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
//                     <defs>
//                       {timelineTasks.map((t, i) => (
//                         <linearGradient key={t} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%"  stopColor={timelineColorMap[t]} stopOpacity={0.7} />
//                           <stop offset="95%" stopColor={timelineColorMap[t]} stopOpacity={0.15} />
//                         </linearGradient>
//                       ))}
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                     <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} angle={-35} textAnchor="end" height={55} />
//                     <YAxis stroke="#9ca3af" fontSize={12} />
//                     <Tooltip content={<TimelineTooltip taskColorMap={timelineColorMap} />}
//                       contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: 8 }}
//                       wrapperStyle={{ zIndex: 10001, outline: 'none' }} />
//                     {timelineTasks.map((t, i) => (
//                       <Area key={t} type="monotone" dataKey={t} stackId="1"
//                         stroke={timelineColorMap[t]} fill={`url(#grad_${i})`}
//                         name={t} isAnimationActive={false} />
//                     ))}
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-gray-500 text-center py-20">No timeline data available for this project.</p>
//               )}
//             </>
//           ) : (
//             <p className="text-gray-500 text-center py-20 text-sm">
//               👆 Click a project name in the chart above to load its timeline.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Visualization2;

import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Filter,
  X,
  Search,
  Moon,
  BookMarked,
  AlertTriangle,
  LayoutDashboard,
  Briefcase,
  Clock,
  Users,
  Zap,
  TrendingUp,
  Target,
  Activity
} from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const API_URL = `${BACKEND_URL}/api/dashboard`;

// 30 distinct colours — enough to cover all task types without collisions
const TASK_COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#06b6d4', '#e11d48', '#d97706', '#0891b2', '#7c3aed', '#059669',
  '#dc2626', '#2563eb', '#ca8a04', '#16a34a', '#9333ea', '#db2777', '#ea580c', '#0284c7',
  '#4f46e5', '#65a30d', '#0e7490', '#be123c', '#b45309', '#15803d'
];

function projectDashTabFromPath(pathname) {
  if (pathname === '/project/night') return 'night';
  if (pathname === '/project/books') return 'books';
  return 'projects';
}

// Department → team-name matcher  (same logic as Visualization.jsx)
const DEPARTMENT_TEAM_MAPPING = {
  'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
  'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA') || teamName.startsWith('University'),
  'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
};

// ─── helper: build a stable colour map from a task-name list ───
function buildColorMap(taskNames) {
  const map = {};
  taskNames.forEach((name, i) => { map[name] = TASK_COLORS[i % TASK_COLORS.length]; });
  return map;
}

function buildEmployeeColorMap(employeeNames) {
  const map = {};
  [...employeeNames].sort((a, b) => a.localeCompare(b)).forEach((name, i) => {
    map[name] = TASK_COLORS[i % TASK_COLORS.length];
  });
  return map;
}

/** Canonical task order for single-project Gantt rows (unknown tasks sort after, tie-break by hours). */
const PROJECT_TASK_STAGE_ORDER = [
  'DRF',
  'CMPL-MS',
  'VRF-MS',
  'COM',
  'R1',
  'CR1',
  'R2',
  'CR2',
  'R3',
  'CR3',
  'R4',
  'CR4',
  'R5',
  'CR5',
  'FINAL',
  'FER',
  'GLANCE',
  'JCR',
  'Coord',
  'MEET',
  'TAL',
  'SET',
  'Development',
  'Research',
  'Analysis',
  'Rα',
  'CRα',
  'Rβ',
  'CRβ',
  'PLAN',
  'MKT Content',
  'Miscellaneous',
  'UPL',
  'SCAN',
  'Interview',
  'Training',
  'KT',
  'Book keeping',
  'ISBN',
  'Design',
  'Testing',
  'REV',
  'QRY',
  'Code',
  'EDIT',
  'Order generation',
  'Stakeholder management',
  'Webinar',
  'Listing',
  'Creative update',
  'Campaign',
  'Shipment',
  'Website design/check',
  'Briefing',
  'Stock updation',
  'REC',
  'Report generation',
  'Customer support',
  'Compiling',
  'Generation',
  'Update',
  'QR Gen',
  'Sketch',
  'Flat colour',
  'Final Colour',
  'Final Output',
  'Visit',
  'Practice',
  'Internet/System Issue'
];

function taskStageOrderIndex(taskName) {
  const raw = String(taskName || '').trim();
  if (!raw) return 99999;
  const lower = raw.toLowerCase();
  const idx = PROJECT_TASK_STAGE_ORDER.findIndex((label) => label.toLowerCase() === lower);
  if (idx >= 0) return idx;
  return 99999;
}

/** Map a DB task name to the canonical label from PROJECT_TASK_STAGE_ORDER (case-insensitive), or null. */
function canonicalStageFromRaw(raw) {
  const r = String(raw || '').trim();
  if (!r) return null;
  return PROJECT_TASK_STAGE_ORDER.find((label) => label.toLowerCase() === r.toLowerCase()) || null;
}

/** Strict heatmap pipeline order (only these stages are shown in heatmap). */
const HEATMAP_TASK_STAGE_ORDER = [
  'DRF',
  'CMPL-MS',
  'VRF-MS',
  'COM',
  'R1',
  'CR1',
  'R2',
  'CR2',
  'R3',
  'CR3',
  'R4',
  'CR4',
  'R5',
  'CR5',
  'FINAL',
  'FER',
  'GLANCE'
];

function heatmapStageOrderIndex(taskName) {
  const raw = String(taskName || '').trim();
  if (!raw) return 99999;
  const lower = raw.toLowerCase();
  const idx = HEATMAP_TASK_STAGE_ORDER.findIndex((label) => label.toLowerCase() === lower);
  if (idx >= 0) return idx;
  return 99999;
}

function canonicalHeatmapStageFromRaw(raw) {
  const r = String(raw || '').trim();
  if (!r) return null;
  return HEATMAP_TASK_STAGE_ORDER.find((label) => label.toLowerCase() === r.toLowerCase()) || null;
}

function tryParseJson(text) {
  const t = String(text ?? '').trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

/** Ensures dashboard list endpoints never assign a non-array to React state. */
function asJsonArray(payload) {
  return Array.isArray(payload) ? payload : [];
}

function getIsoDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekStartMonday(dateObj) {
  const d = new Date(dateObj);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 Sunday ... 6 Saturday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatRangeLabel(start, end) {
  const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${s} - ${e}`;
}

/**
 * Build descending X-axis buckets for gantt time scale.
 * datesDesc contains ISO date keys sorted newest -> oldest.
 */
function buildGanttBuckets(datesDesc, timeScale) {
  const uniqueDates = [...new Set(datesDesc)];
  const asc = [...uniqueDates].sort((a, b) => a.localeCompare(b));
  const minIso = asc[0] || null;
  const maxIso = asc[asc.length - 1] || null;

  if (timeScale === 'Day') {
    const buckets = uniqueDates.map((iso) => {
      const [y, m, d] = iso.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      return {
        key: iso,
        label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      };
    });
    const lookup = new Map(uniqueDates.map((d) => [d, d]));
    return { buckets, dateToBucketKey: lookup };
  }

  if (timeScale === 'Month') {
    const monthMap = new Map();
    asc.forEach((iso) => {
      const [y, m, d] = iso.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(key)) {
        const first = new Date(dt.getFullYear(), dt.getMonth(), 1);
        monthMap.set(key, {
          key,
          start: first,
          label: first.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
        });
      }
    });
    const buckets = [...monthMap.values()].sort((a, b) => b.key.localeCompare(a.key));
    const lookup = new Map();
    asc.forEach((iso) => {
      const [y, m, d] = iso.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      lookup.set(iso, key);
    });
    return { buckets, dateToBucketKey: lookup };
  }

  // Week
  const weekMap = new Map();
  asc.forEach((iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const start = getWeekStartMonday(dt);
    const key = getIsoDateKey(start);
    if (!weekMap.has(key)) {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const visibleStart = minIso && getIsoDateKey(start) < minIso
        ? (() => {
          const [y, m, d] = minIso.split('-').map(Number);
          return new Date(y, (m || 1) - 1, d || 1);
        })()
        : new Date(start);
      const visibleEnd = maxIso && getIsoDateKey(end) > maxIso
        ? (() => {
          const [y, m, d] = maxIso.split('-').map(Number);
          return new Date(y, (m || 1) - 1, d || 1);
        })()
        : new Date(end);
      weekMap.set(key, {
        key,
        start,
        end,
        label: formatRangeLabel(visibleStart, visibleEnd)
      });
    }
  });
  const buckets = [...weekMap.values()].sort((a, b) => b.key.localeCompare(a.key));
  const lookup = new Map();
  asc.forEach((iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const key = getIsoDateKey(getWeekStartMonday(dt));
    lookup.set(iso, key);
  });
  return { buckets, dateToBucketKey: lookup };
}

/** Calendar day keys from period filter (ascending), aligned with project-view timeline API */
function getPeriodDateKeysAscending(period) {
  if (!period || period === 'All') return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let start = new Date(now);
  switch (period) {
    case 'Last 7 Days':
      start.setDate(start.getDate() - 7);
      break;
    case 'Last 30 Days':
      start.setDate(start.getDate() - 30);
      break;
    case 'Last 3 Months':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'Last 6 Months':
      start.setMonth(start.getMonth() - 6);
      break;
    case 'Last Year':
      start.setMonth(start.getMonth() - 12);
      break;
    case 'This Year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return null;
  }
  start.setHours(0, 0, 0, 0);
  const keys = [];
  const cursor = new Date(start);
  while (cursor <= now) {
    keys.push(getIsoDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
}

const CHART_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

const PtTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-indigo-500/60 bg-gray-900 p-3 text-sm shadow-xl z-[10002]">
      {label != null && label !== '' && <p className="text-white font-semibold mb-2">{label}</p>}
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color || '#e5e7eb' }}>
          {e.name}: <span className="font-bold text-white">{typeof e.value === 'number' ? e.value.toFixed(2) : e.value}</span>
        </p>
      ))}
    </div>
  );
});
PtTooltip.displayName = 'PtTooltip';

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon className="w-10 h-10 text-white opacity-80" />}
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-white text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
    </div>
  );
}

// ─── Timeline Tooltip (matches screenshot: Task | Hours table + Total row) ───
const TimelineTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const totalHoursEntry = payload.find(e => e.name === 'Total Hours');
  const entries = payload
    .filter(e => e.name !== 'Total Hours' && e.value && e.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = totalHoursEntry?.value || entries.reduce((s, e) => s + (e.value || 0), 0);
  const topTask = entries[0]?.name || 'No task';

  return (
    <div style={{ backgroundColor: 'rgb(17 24 39)', border: '2px solid #8b5cf6', borderRadius: 8, padding: '10px 14px', minWidth: 220, boxShadow: '0 4px 24px rgba(0,0,0,.5)', zIndex: 10001 }}>
      {label && <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{label}</p>}
      <p style={{ color: '#d1d5db', fontSize: 12, marginBottom: 6 }}>
        Top task: <span style={{ color: '#fff', fontWeight: 600 }}>{topTask}</span>
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #374151' }}>
            <th style={{ textAlign: 'left', color: '#9ca3af', fontWeight: 500, paddingBottom: 4 }}>Task</th>
            <th style={{ textAlign: 'right', color: '#9ca3af', fontWeight: 500, paddingBottom: 4 }}>Hours</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td style={{ color: e.color || '#fff', fontWeight: 600, padding: '2px 0' }}>{e.name}</td>
              <td style={{ color: '#fff', textAlign: 'right', fontWeight: 600 }}>{e.value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '1px solid #374151' }}>
            <td style={{ color: '#a78bfa', fontWeight: 700, padding: '4px 0 0' }}>Total</td>
            <td style={{ color: '#a78bfa', textAlign: 'right', fontWeight: 700 }}>{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});
TimelineTooltip.displayName = 'TimelineTooltip';

// ─── Main Component ────────────────────────────────────────────
const Visualization2 = () => {
  const location = useLocation();
  const dashTab = projectDashTabFromPath(location.pathname);

  // ── filter state (Segment / Series / Class / Project multi-select) ──
  const [segments, setSegments] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [classesList, setClassesList] = useState([]);

  const [selSegment, setSelSegment] = useState('All');
  const [selSeries, setSelSeries] = useState('All');
  const [selClass, setSelClass] = useState('All');
  const [selPeriod, setSelPeriod] = useState('Last 7 Days');
  const [ganttTimeScale, setGanttTimeScale] = useState('Week');
  const [ganttDepartment, setGanttDepartment] = useState('All');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]); // multi-select
  const [activeProject, setActiveProject] = useState(null); // drives timeline + deep dive

  // ── dropdown visibility ──
  const [showProjDrop, setShowProjDrop] = useState(false);

  // ── data ──
  const [projects, setProjects] = useState([]);  // top-10 with task breakdown
  const [projectNames, setProjectNames] = useState([]);  // for Project Name dropdown
  const [taskNames, setTaskNames] = useState([]);  // for Task dropdown
  const [elementNames, setElementNames] = useState([]);  // for Project Element dropdown
  const [timeline, setTimeline] = useState([]);  // area chart rows
  const [timelineTasks, setTimelineTasks] = useState([]);  // task keys present in timeline
  const [ganttRows, setGanttRows] = useState([]);
  const [ganttLoading, setGanttLoading] = useState(false);
  const [ganttTooltip, setGanttTooltip] = useState(null);
  const ganttViewportRef = useRef(null);
  const [ganttViewportWidth, setGanttViewportWidth] = useState(0);
  const [projectInsights, setProjectInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);

  const [projectsLoading, setProjectsLoading] = useState(true);
  const [nightData, setNightData] = useState(null);
  const [nightLoading, setNightLoading] = useState(false);
  const [crossBooks, setCrossBooks] = useState(null);
  const [booksLoading, setBooksLoading] = useState(false);
  const [selectedBookGroup, setSelectedBookGroup] = useState(null);
  const [bookSessionMin, setBookSessionMin] = useState(2);
  const crossBooksFetchSeq = useRef(0);
  const crossBookDetailRef = useRef(null);

  // ── refs ──
  const projDropRef = useRef(null);

  // ─── colour map: stable across renders, built from ALL tasks seen in projects data ──
  const globalTaskColorMap = useMemo(() => {
    const set = new Set();
    if (Array.isArray(projects)) {
      projects.forEach((p) => {
        if (!p || !Array.isArray(p.tasks)) return;
        p.tasks.forEach((t) => {
          if (t && t.task) set.add(t.task);
        });
      });
    }
    return buildColorMap([...set]);
  }, [projects]);

  // ─── fetch all project names (NO filters) once to derive all segment/series/class options
  const fetchFilters = async () => {
    try {
      // Fetch project names WITHOUT any segment/series/class filters (only team/employee/period)
      const params = new URLSearchParams();
      if (selPeriod !== 'All') params.append('period', selPeriod);
      const sfx = params.toString() ? `?${params.toString()}` : '';
      const projRes = await fetch(`${API_URL}/project-view/filter/project-names${sfx}`);
      const namesRaw = tryParseJson(await projRes.text());
      const names = asJsonArray(namesRaw);
      setProjectNames(names);

      // derive Segment / Class / Series from FULL list using heuristics
      const segSet = new Set();
      const classSet = new Set();
      const seriesSet = new Set();

      const detectSeries = (parts) => {
        // prefer token immediately before a parenthesised token like '(Eng)'
        const parenIdx = parts.findIndex(p => p && /^\(.+\)$/.test(p));
        if (parenIdx > 2) return parts[parenIdx - 1];
        // otherwise prefer token immediately before a year token like '26-27'
        const yearIdx = parts.findIndex(p => p && /^\d{2}-\d{2}$/.test(p));
        if (yearIdx > 2) return parts[yearIdx - 1];
        // fallback to 4th token if present, else 3rd
        return parts[4] || parts[3] || '';
      };

      names.forEach(n => {
        const parts = n.split('_').map(p => p.trim()).filter(Boolean);
        if (parts[0]) segSet.add(parts[0]);
        if (parts[1]) classSet.add(parts[1]);
        const s = detectSeries(parts);
        if (s) seriesSet.add(s);
      });

      setSegments(['All', ...[...segSet]]);
      setClassesList(['All', ...[...classSet]]);
      setSeriesList(['All', ...[...seriesSet]]);
    } catch (e) { console.error('fetchFilters', e); }
  };

  // ─── fetch horizontal bar data and apply client-side filtering by segment/series/class/projects ───────────────────────────────
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      // Send filters to backend: segment/series/class/period + selected projects
      const params = new URLSearchParams();
      if (selSegment !== 'All') params.append('segment', selSegment);
      if (selSeries !== 'All') params.append('series', selSeries);
      if (selClass !== 'All') params.append('class', selClass);
      if (selPeriod !== 'All') params.append('period', selPeriod);
      if (selectedProjects.length > 0) selectedProjects.forEach(p => params.append('project_name', p));

      const res = await fetch(`${API_URL}/project-view/projects?${params.toString()}`);
      const data = tryParseJson(await res.text());
      setProjects(asJsonArray(data));
      setProjectsLoading(false);
    } catch (e) {
      console.error('fetchProjects', e);
      setProjects([]);
      setProjectsLoading(false);
    }
  };

  const buildAnalyticsQueryParams = () => {
    const params = new URLSearchParams();
    if (selSegment !== 'All') params.append('segment', selSegment);
    if (selSeries !== 'All') params.append('series', selSeries);
    if (selClass !== 'All') params.append('class', selClass);
    if (selPeriod !== 'All') params.append('period', selPeriod);
    selectedProjects.forEach((p) => params.append('project_name', p));
    return params.toString();
  };

  const fetchNightAnalytics = async () => {
    setNightLoading(true);
    try {
      const qs = buildAnalyticsQueryParams();
      const res = await fetch(`${API_URL}/night-analytics${qs ? `?${qs}` : ''}`);
      const json = await res.json();
      setNightData(json.error ? null : json);
    } catch (e) {
      console.error('fetchNightAnalytics', e);
      setNightData(null);
    } finally {
      setNightLoading(false);
    }
  };

  const fetchCrossSessionBooks = async () => {
    const seq = ++crossBooksFetchSeq.current;
    setBooksLoading(true);
    setCrossBooks(null);
    setSelectedBookGroup(null);
    try {
      const params = new URLSearchParams();
      if (selSegment !== 'All') params.append('segment', selSegment);
      if (selSeries !== 'All') params.append('series', selSeries);
      if (selClass !== 'All') params.append('class', selClass);
      if (selPeriod !== 'All') params.append('period', selPeriod);
      selectedProjects.forEach((p) => params.append('project_name', p));
      params.append('minSessions', String(bookSessionMin));
      const qs = params.toString();
      const res = await fetch(`${API_URL}/cross-session-books${qs ? `?${qs}` : ''}`);
      const json = await res.json();
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(json.error ? null : json);
    } catch (e) {
      console.error('fetchCrossSessionBooks', e);
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(null);
    } finally {
      if (crossBooksFetchSeq.current === seq) {
        setBooksLoading(false);
      }
    }
  };

  const displayedProjects = useMemo(() => {
    if (activeProject) return [activeProject];
    return selectedProjects;
  }, [activeProject, selectedProjects]);

  /** Timeline + deep dive only for a single explicit scope (one filter pick or focused row). */
  const timelineInsightProjects = useMemo(() => {
    if (activeProject) return [activeProject];
    if (selectedProjects.length === 1) return selectedProjects;
    return [];
  }, [activeProject, selectedProjects]);

  /** null = fetch Gantt for all projects matching period + segment filters (no project_name). */
  const ganttFetchTarget = useMemo(() => {
    if (selectedProjects.length === 0) return null;
    return displayedProjects;
  }, [selectedProjects.length, displayedProjects]);

  const isAllSelectedMode = !activeProject && selectedProjects.length > 1;
  const currentScopeLabel =
    selectedProjects.length === 0
      ? 'All projects in scope'
      : isAllSelectedMode
        ? 'All Selected Projects'
        : activeProject || selectedProjects[0] || '';

  // ─── fetch timeline for selected projects (single or multiple) ──────────────────────────
  const fetchTimeline = async (projectNamesArray) => {
    if (!projectNamesArray || projectNamesArray.length === 0) { setTimeline([]); setTimelineTasks([]); return; }
    try {
      const params = new URLSearchParams();
      projectNamesArray.forEach(n => params.append('project_name', n));
      if (selPeriod !== 'All') params.append('period', selPeriod);
      if (selSegment !== 'All') params.append('segment', selSegment);
      if (selSeries !== 'All') params.append('series', selSeries);
      if (selClass !== 'All') params.append('class', selClass);

      const res = await fetch(`${API_URL}/project-view/timeline?${params}`);
      const body = tryParseJson(await res.text());
      const rows = body && Array.isArray(body.timeline) ? body.timeline : [];
      const tasks = body && Array.isArray(body.tasks) ? body.tasks : [];
      setTimeline(rows);
      setTimelineTasks(tasks);
    } catch (e) {
      console.error('fetchTimeline', e);
      setTimeline([]);
      setTimelineTasks([]);
    }
  };

  const fetchProjectInsights = async (projectNamesArray) => {
    if (!projectNamesArray || projectNamesArray.length === 0) {
      setProjectInsights(null);
      return;
    }
    try {
      setInsightsLoading(true);
      const params = new URLSearchParams();
      projectNamesArray.forEach(n => params.append('project_name', n));
      if (selPeriod !== 'All') params.append('period', selPeriod);
      if (selSegment !== 'All') params.append('segment', selSegment);
      if (selSeries !== 'All') params.append('series', selSeries);
      if (selClass !== 'All') params.append('class', selClass);

      const res = await fetch(`${API_URL}/project-view/project-insights?${params.toString()}`);
      const data = tryParseJson(await res.text());
      const ok =
        data &&
        typeof data === 'object' &&
        !Array.isArray(data) &&
        data.error == null;
      setProjectInsights(ok ? data : null);
    } catch (e) {
      console.error('fetchProjectInsights', e);
      setProjectInsights(null);
    } finally {
      setInsightsLoading(false);
    }
  };

  const fetchProjectGantt = async (projectNamesArray) => {
    setGanttLoading(true);
    try {
      const params = new URLSearchParams();
      if (Array.isArray(projectNamesArray) && projectNamesArray.length > 0) {
        projectNamesArray.forEach((n) => params.append('project_name', n));
      }
      if (selPeriod !== 'All') params.append('period', selPeriod);
      if (selSegment !== 'All') params.append('segment', selSegment);
      if (selSeries !== 'All') params.append('series', selSeries);
      if (selClass !== 'All') params.append('class', selClass);
      if (ganttDepartment !== 'All') {
        const deptApiValue = ganttDepartment === 'Digital_Marketing' ? 'Digital Marketing' : ganttDepartment;
        params.append('department', deptApiValue);
      }

      const res = await fetch(`${API_URL}/project-view/gantt?${params.toString()}`);
      const data = tryParseJson(await res.text());
      setGanttRows(asJsonArray(data));
    } catch (e) {
      console.error('fetchProjectGantt', e);
      setGanttRows([]);
    } finally {
      setGanttLoading(false);
    }
  };

  // ─── effects ─────────────────────────────────────────────────
  // initial + whenever period changes: project-name list for filters (respects period)
  useEffect(() => { fetchFilters(); }, [selPeriod]);

  // refetch projects automatically when filter selections change
  useEffect(() => { fetchProjects(); }, [selSegment, selSeries, selClass, selPeriod, selectedProjects]);

  // timeline + deep dive follow active project OR all selected projects
  useEffect(() => { fetchTimeline(timelineInsightProjects); }, [timelineInsightProjects, selPeriod, selSegment, selSeries, selClass]);
  useEffect(() => { fetchProjectGantt(ganttFetchTarget); }, [ganttFetchTarget, selPeriod, selSegment, selSeries, selClass, ganttDepartment]);
  useEffect(() => { fetchProjectInsights(timelineInsightProjects); }, [timelineInsightProjects, selPeriod, selSegment, selSeries, selClass]);
  useEffect(() => {
    if (activeProject && !selectedProjects.includes(activeProject)) {
      setActiveProject(null);
    }
  }, [selectedProjects, activeProject]);
  useEffect(() => { setExpandedTask(null); }, [projectInsights]);

  useEffect(() => {
    if (dashTab === 'night') fetchNightAnalytics();
  }, [dashTab, selSegment, selSeries, selClass, selPeriod, selectedProjects]);

  useEffect(() => {
    if (dashTab !== 'books') return undefined;
    fetchCrossSessionBooks();
    return () => {
      crossBooksFetchSeq.current += 1;
      setBooksLoading(false);
    };
  }, [dashTab, selSegment, selSeries, selClass, selPeriod, selectedProjects, bookSessionMin]);

  useEffect(() => {
    if (!selectedBookGroup) return;
    const id = requestAnimationFrame(() => {
      crossBookDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [selectedBookGroup?.baseKey]);

  // Click-outside closes project search dropdown
  useEffect(() => {
    const handler = (e) => {
      if (projDropRef.current && !projDropRef.current.contains(e.target)) setShowProjDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── clear all ───────────────────────────────────────────────
  const clearAll = () => {
    setSelSegment('All'); setSelSeries('All'); setSelClass('All');
    setSelPeriod('Last 7 Days');
    setProjectSearch(''); setSelectedProjects([]);
    setTimeline([]); setTimelineTasks([]);
    setGanttRows([]);
    setActiveProject(null);
    setProjectInsights(null);
    setExpandedTask(null);
  };

  // toggle selection for a project name
  const toggleProject = (name) => {
    setSelectedProjects(prev => {
      const next = prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name];
      if (next.includes(name)) {
        // keep "all selected" mode when selecting from filter
        if (activeProject && activeProject !== name) return next;
      } else if (activeProject === name) {
        setActiveProject(null);
      }
      if (next.length === 0) setActiveProject(null);
      return next;
    });
  };

  // ─── derived: filtered project names for the search dropdown (respects segment/series/class + search) ─
  const filteredProjNames = useMemo(() => {
    let results = projectNames;

    // filter by segment
    if (selSegment !== 'All') {
      results = results.filter(n => {
        const parts = n.split('_').map(x => x.trim()).filter(Boolean);
        return parts[0] === selSegment;
      });
    }

    // filter by class
    if (selClass !== 'All') {
      results = results.filter(n => {
        const parts = n.split('_').map(x => x.trim()).filter(Boolean);
        return parts[1] === selClass;
      });
    }

    // filter by series
    if (selSeries !== 'All') {
      results = results.filter(n => {
        const parts = n.split('_').map(x => x.trim()).filter(Boolean);
        const parenIdx = parts.findIndex(p => p && /^\(.+\)$/.test(p));
        const yearIdx = parts.findIndex(p => p && /^\d{2}-\d{2}$/.test(p));
        const series = parenIdx > 2 ? parts[parenIdx - 1] : (yearIdx > 2 ? parts[yearIdx - 1] : (parts[4] || parts[3]));
        return series === selSeries;
      });
    }

    // filter by search text
    if (projectSearch.trim()) {
      results = results.filter(n => n.toLowerCase().includes(projectSearch.toLowerCase()));
    }

    return results;
  }, [projectNames, selSegment, selClass, selSeries, projectSearch]);

  // derived lists for Series and Class based on selected Segment/Series
  const derivedSeries = useMemo(() => {
    // compute series options based on selected segment
    if (selSegment === 'All') return seriesList;
    const set = new Set();
    projectNames.forEach(n => {
      const parts = n.split('_').map(x => x.trim()).filter(Boolean);
      if (parts[0] !== selSegment) return;
      // use same detection logic as fetchFilters
      const parenIdx = parts.findIndex(p => p && /^\(.+\)$/.test(p));
      if (parenIdx > 2) { set.add(parts[parenIdx - 1]); return; }
      const yearIdx = parts.findIndex(p => p && /^\d{2}-\d{2}$/.test(p));
      if (yearIdx > 2) { set.add(parts[yearIdx - 1]); return; }
      if (parts[4]) set.add(parts[4]);
      else if (parts[3]) set.add(parts[3]);
    });
    return ['All', ...[...set]];
  }, [selSegment, projectNames, seriesList]);

  const derivedClasses = useMemo(() => {
    const set = new Set();
    projectNames.forEach(n => {
      const parts = n.split('_').map(x => x.trim()).filter(Boolean);
      if (selSegment !== 'All' && parts[0] !== selSegment) return;
      if (selSeries !== 'All') {
        // ensure series matches using same detection
        const parenIdx = parts.findIndex(p => p && /^\(.+\)$/.test(p));
        const yearIdx = parts.findIndex(p => p && /^\d{2}-\d{2}$/.test(p));
        const seriesCandidate = parenIdx > 2 ? parts[parenIdx - 1] : (yearIdx > 2 ? parts[yearIdx - 1] : (parts[4] || parts[3]));
        if (seriesCandidate !== selSeries) return;
      }
      if (parts[1]) set.add(parts[1]);
    });
    return ['All', ...[...set]];
  }, [selSegment, selSeries, projectNames]);

  // ─── HORIZONTAL BAR CHART (custom SVG) ──────────────────────
  // Each project = one row.  Each row is segmented by task, widths proportional to hours.
  // Largest segment shows its task label if wide enough.
  const BAR_HEIGHT = 28;
  const ROW_GAP = 8;
  const LABEL_COL_WIDTH = 260; // px reserved for project names on the left
  const BAR_AREA_WIDTH = 900;  // px for the actual bars (will scale with container)

  const maxTotalHours = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) return 1;
    return Math.max(
      ...projects.map((p) => (p && typeof p.totalHours === 'number' ? p.totalHours : 0)),
      1
    );
  }, [projects]);

  // Hover state for bar tooltip
  const [barTooltip, setBarTooltip] = useState(null); // { x, y, task, hours, units, projectName, projectTotalHours, projectTotalUnits, taskSharePct }

  const renderBars = () => {
    if (!Array.isArray(projects)) return null;
    return projects.map((project, pIdx) => {
      const y = pIdx * (BAR_HEIGHT + ROW_GAP);
      const barWidth = (project.totalHours / maxTotalHours) * BAR_AREA_WIDTH;
      let xOffset = 0;

      const segments = (Array.isArray(project.tasks) ? project.tasks : []).map((t, tIdx) => {
        const segW = (t.hours / project.totalHours) * barWidth;
        const seg = (
          <g key={tIdx}>
            <rect
              x={xOffset}
              y={y}
              width={segW}
              height={BAR_HEIGHT}
              fill={globalTaskColorMap[t.task] || '#666'}
              onMouseEnter={(e) => {
                const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                const mouseX = e.clientX - svgRect.left;
                const mouseY = e.clientY - svgRect.top;
                setBarTooltip({
                  x: mouseX,
                  y: mouseY,
                  task: t.task,
                  hours: t.hours,
                  units: t.units,
                  projectName: project.name,
                  projectTotalHours: project.totalHours,
                  projectTotalUnits: project.totalUnits,
                  taskSharePct: project.totalHours > 0 ? (t.hours / project.totalHours) * 100 : 0
                });
              }}
              onMouseMove={(e) => {
                const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                setBarTooltip(prev => prev ? { ...prev, x: e.clientX - svgRect.left, y: e.clientY - svgRect.top } : prev);
              }}
              onMouseLeave={() => setBarTooltip(null)}
              style={{ cursor: 'pointer' }}
            />
            {/* label if segment is wide enough (>50px) */}
            {segW > 50 && (
              <text
                x={xOffset + segW / 2}
                y={y + BAR_HEIGHT / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={11}
                fontWeight={600}
                pointerEvents="none"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,.6)' }}
              >
                {t.task.length > segW / 6.5 ? t.task.slice(0, Math.floor(segW / 6.5) - 1) + '…' : t.task}
              </text>
            )}
          </g>
        );
        xOffset += segW;
        return seg;
      });

      // Highlight the active project that drives timeline/deep dive
      const isSelected = project.name === activeProject;

      return (
        <g key={pIdx}>
          {/* project name label — clickable */}
          <text
            x={LABEL_COL_WIDTH - 12}
            y={y + BAR_HEIGHT / 2}
            textAnchor="end"
            dominantBaseline="central"
            fill={isSelected ? '#fff' : '#d1d5db'}
            fontSize={12}
            fontWeight={isSelected ? 700 : 400}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => {
              setActiveProject(project.name);
              setSelectedProjects(prev => prev.includes(project.name) ? prev : [...prev, project.name]);
            }}
          >
            {project.name.length > 36 ? project.name.slice(0, 34) + '…' : project.name}
          </text>
          {/* bar segments group — offset by label column */}
          <g transform={`translate(${LABEL_COL_WIDTH}, 0)`}>
            {segments}
          </g>
        </g>
      );
    });
  };

  // total SVG height
  const svgHeight = (Array.isArray(projects) ? projects.length : 0) * (BAR_HEIGHT + ROW_GAP) + 4;

  // ─── legend: all tasks present in current projects data ──────
  const legendTasks = useMemo(() => {
    const set = new Set();
    if (Array.isArray(projects)) {
      projects.forEach((p) => {
        if (!p || !Array.isArray(p.tasks)) return;
        p.tasks.forEach((t) => {
          if (t && t.task) set.add(t.task);
        });
      });
    }
    return [...set];
  }, [projects]);

  // ─── timeline colour map (uses same global map) ─────────────
  const timelineColorMap = useMemo(() => {
    const map = {};
    timelineTasks.forEach(t => { map[t] = globalTaskColorMap[t] || TASK_COLORS[legendTasks.indexOf(t) % TASK_COLORS.length]; });
    return map;
  }, [timelineTasks, globalTaskColorMap, legendTasks]);

  const timelineWithTotals = useMemo(() => {
    return timeline.map(row => {
      const totalHours = timelineTasks.reduce((sum, task) => sum + (row[task] || 0), 0);
      return { ...row, totalHours };
    });
  }, [timeline, timelineTasks]);

  const timelineSummary = useMemo(() => {
    if (!timelineWithTotals.length) {
      return { totalHours: 0, avgHours: 0, peakDate: '-', peakHours: 0, topTask: '-' };
    }

    const totalHours = timelineWithTotals.reduce((sum, row) => sum + row.totalHours, 0);
    const avgHours = totalHours / timelineWithTotals.length;
    const peak = timelineWithTotals.reduce((max, row) => row.totalHours > max.totalHours ? row : max, timelineWithTotals[0]);

    const taskTotals = {};
    timelineTasks.forEach(task => { taskTotals[task] = 0; });
    timelineWithTotals.forEach(row => {
      timelineTasks.forEach(task => {
        taskTotals[task] += row[task] || 0;
      });
    });

    const topTask = Object.entries(taskTotals)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return {
      totalHours,
      avgHours,
      peakDate: peak.date,
      peakHours: peak.totalHours,
      topTask
    };
  }, [timelineWithTotals, timelineTasks]);

  const GANTT_LABEL_COL = 268;
  const GANTT_DAY_COL_MIN = 36;
  const GANTT_ROW_H = 40;

  /** Same date window as timeline + API; single project → rows = tasks (segments = employees); multi → rows = projects (segments = tasks). */
  const projectGanttModel = useMemo(() => {
    const rowsAll = Array.isArray(ganttRows) ? ganttRows : [];
    const useAllProjects = selectedProjects.length === 0;
    const rows = useAllProjects
      ? rowsAll
      : rowsAll.filter((r) => displayedProjects.includes(r.project_name));

    if (!rows.length) return null;

    const scopeProjects = useAllProjects
      ? [...new Set(rows.map((r) => r.project_name).filter(Boolean))]
      : [...displayedProjects];
    const periodDates = getPeriodDateKeysAscending(selPeriod);
    let dates = periodDates;
    if (!dates) {
      const dset = new Set(rows.map((r) => r.date));
      dates = [...dset].sort((a, b) => b.localeCompare(a));
    } else {
      dates = [...dates].sort((a, b) => b.localeCompare(a));
    }

    const { buckets, dateToBucketKey } = buildGanttBuckets(dates, ganttTimeScale);
    const mode = scopeProjects.length === 1 ? 'task' : 'project';

    if (mode === 'task') {
      const proj = scopeProjects[0];
      const projRows = rows.filter((r) => r.project_name === proj);
      const taskTotals = {};
      projRows.forEach((r) => {
        const t = r.task_name || 'Unspecified';
        taskTotals[t] = (taskTotals[t] || 0) + r.hours;
      });
      const yKeys = Object.keys(taskTotals).sort((a, b) => {
        const ai = taskStageOrderIndex(a);
        const bi = taskStageOrderIndex(b);
        if (ai !== bi) return ai - bi;
        return (taskTotals[b] || 0) - (taskTotals[a] || 0);
      });

      const cellMap = new Map();
      const chapterBreakdownMap = new Map();
      for (const r of projRows) {
        const task = r.task_name || 'Unspecified';
        const bucketKey = dateToBucketKey.get(r.date);
        if (!bucketKey) continue;
        const key = `${task}\t${bucketKey}`;
        if (!cellMap.has(key)) cellMap.set(key, new Map());
        const m = cellMap.get(key);
        const emp = r.employee || 'Unassigned';
        m.set(emp, (m.get(emp) || 0) + r.hours);

        const chRaw = r.chapter_number != null && String(r.chapter_number).trim() ? String(r.chapter_number).trim() : '—';
        const ck = `${task}\t${bucketKey}\t${emp}`;
        if (!chapterBreakdownMap.has(ck)) chapterBreakdownMap.set(ck, new Map());
        const chm = chapterBreakdownMap.get(ck);
        chm.set(chRaw, (chm.get(chRaw) || 0) + r.hours);
      }

      const empSet = new Set();
      projRows.forEach((r) => empSet.add(r.employee || 'Unassigned'));
      const employeeColorMap = buildEmployeeColorMap(empSet);

      const getCell = (yKey, bucketKey) => {
        const m = cellMap.get(`${yKey}\t${bucketKey}`);
        if (!m) return [];
        return [...m.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([employee, hours]) => ({
            key: employee,
            label: employee,
            hours,
            color: employeeColorMap[employee] || '#6b7280'
          }));
      };

      const getTaskChapterBreakdown = (task, bucketKey, employee) => {
        const m = chapterBreakdownMap.get(`${task}\t${bucketKey}\t${employee}`);
        if (!m) return [];
        return [...m.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([chapter, hours]) => ({ key: chapter, label: chapter === '—' ? 'No chapter' : `Ch. ${chapter}`, hours }));
      };

      return {
        mode,
        buckets,
        yKeys,
        rowLabel: (k) => k,
        getCell,
        getTaskChapterBreakdown,
        getProjectEmployeeBreakdown: null,
        legendTitle: 'Employees (bar colors)',
        legendItems: [...empSet].sort((a, b) => a.localeCompare(b)).map((name) => ({
          key: name,
          label: name,
          color: employeeColorMap[name]
        })),
        yAxisTitle: 'Task / stage',
        scopeLabel: proj
      };
    }

    const projTotals = {};
    rows.forEach((r) => {
      const p = r.project_name;
      projTotals[p] = (projTotals[p] || 0) + r.hours;
    });
    const yKeys = [...scopeProjects].sort(
      (a, b) => (projTotals[b] || 0) - (projTotals[a] || 0)
    );

    const cellMap = new Map();
    const projectTaskEmployeeMap = new Map();
    for (const r of rows) {
      const bucketKey = dateToBucketKey.get(r.date);
      if (!bucketKey) continue;
      const key = `${r.project_name}\t${bucketKey}`;
      if (!cellMap.has(key)) cellMap.set(key, new Map());
      const m = cellMap.get(key);
      const task = r.task_name || 'Unspecified';
      m.set(task, (m.get(task) || 0) + r.hours);

      const emp = r.employee || 'Unassigned';
      const ptk = `${r.project_name}\t${bucketKey}\t${task}`;
      if (!projectTaskEmployeeMap.has(ptk)) projectTaskEmployeeMap.set(ptk, new Map());
      const em = projectTaskEmployeeMap.get(ptk);
      em.set(emp, (em.get(emp) || 0) + r.hours);
    }

    const taskSet = new Set();
    rows.forEach((r) => taskSet.add(r.task_name || 'Unspecified'));
    const fallbackTaskColors = buildColorMap([...taskSet]);

    const getCell = (yKey, bucketKey) => {
      const m = cellMap.get(`${yKey}\t${bucketKey}`);
      if (!m) return [];
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([task, hours]) => ({
          key: task,
          label: task,
          hours,
          color: globalTaskColorMap[task] || fallbackTaskColors[task] || '#6b7280'
        }));
    };

    const getProjectEmployeeBreakdown = (project, bucketKey, task) => {
      const m = projectTaskEmployeeMap.get(`${project}\t${bucketKey}\t${task}`);
      if (!m) return [];
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([employee, hours]) => ({ key: employee, label: employee, hours }));
    };

    const legendItems = [...taskSet].sort((a, b) => a.localeCompare(b)).map((task) => ({
      key: task,
      label: task,
      color: globalTaskColorMap[task] || fallbackTaskColors[task] || '#6b7280'
    }));

    return {
      mode,
      buckets,
      yKeys,
      rowLabel: (k) => k,
      getCell,
      getTaskChapterBreakdown: null,
      getProjectEmployeeBreakdown,
      legendTitle: 'Tasks (bar colors)',
      legendItems,
      yAxisTitle: 'Project',
      scopeLabel: scopeProjects.length > 1 ? `${scopeProjects.length} projects` : scopeProjects[0]
    };
  }, [ganttRows, displayedProjects, selPeriod, ganttTimeScale, globalTaskColorMap, selectedProjects.length]);

  /** Y = projects in scope with hours; X = canonical task sequence; green = task has DB entry, blue = current active stage. */
  const taskStageHeatmapModel = useMemo(() => {
    const rowsAll = Array.isArray(ganttRows) ? ganttRows : [];
    const filtered =
      selectedProjects.length === 0
        ? rowsAll
        : rowsAll.filter((r) => displayedProjects.includes(r.project_name));
    const projTotals = {};
    filtered.forEach((r) => {
      const p = r.project_name;
      projTotals[p] = (projTotals[p] || 0) + (Number(r.hours) || 0);
    });
    const projectNames = [...new Set(filtered.map((r) => r.project_name))].sort(
      (a, b) => (projTotals[b] || 0) - (projTotals[a] || 0)
    );

    const xTasks = HEATMAP_TASK_STAGE_ORDER;
    const currentStageByProject = {};
    const lastDateByProject = {};
    const currentCanonicalByProject = {};
    const currentStageIndexByProject = {};
    const seenCanonicalSetByProject = {};
    const hasCurrentCanonicalByProject = {};

    for (const p of projectNames) {
      const rp = filtered.filter((r) => r.project_name === p && (Number(r.hours) || 0) > 0);
      if (!rp.length) {
        currentStageByProject[p] = null;
        lastDateByProject[p] = null;
        currentCanonicalByProject[p] = null;
        currentStageIndexByProject[p] = -1;
        seenCanonicalSetByProject[p] = new Set();
        hasCurrentCanonicalByProject[p] = false;
        continue;
      }
      const maxDate = rp.reduce((m, r) => (String(r.date) > String(m) ? r.date : m), rp[0].date);
      lastDateByProject[p] = maxDate;
      const seenSet = new Set();
      rp.forEach((row) => {
        if ((Number(row.hours) || 0) <= 0) return;
        const c = canonicalHeatmapStageFromRaw(row.task_name || '');
        if (c) seenSet.add(c);
      });
      seenCanonicalSetByProject[p] = seenSet;

      // Current active stage = latest date's highest pipeline stage (hours tie-breaker).
      const dayRows = rp.filter((r) => r.date === maxDate);
      let currentCanonical = null;
      let currentIdx = -1;
      let bestHours = -1;
      for (const row of dayRows) {
        if ((Number(row.hours) || 0) <= 0) continue;
        const c = canonicalHeatmapStageFromRaw(row.task_name || '');
        if (!c) continue;
        const idx = heatmapStageOrderIndex(c);
        const h = Number(row.hours) || 0;
        if (idx > currentIdx || (idx === currentIdx && h > bestHours)) {
          currentCanonical = c;
          currentIdx = idx;
          bestHours = h;
        }
      }

      // If latest day has no listed stage, pick most advanced seen listed stage.
      if (currentCanonical == null && seenSet.size > 0) {
        let bestSeen = null;
        let bestSeenIdx = -1;
        seenSet.forEach((c) => {
          const idx = heatmapStageOrderIndex(c);
          if (idx > bestSeenIdx) {
            bestSeen = c;
            bestSeenIdx = idx;
          }
        });
        currentCanonical = bestSeen;
        currentIdx = bestSeenIdx;
      }

      const rawCurrentLabel = dayRows
        .filter((row) => (Number(row.hours) || 0) > 0)
        .sort((a, b) => (String(b.date || '').localeCompare(String(a.date || '')) || ((Number(b.hours) || 0) - (Number(a.hours) || 0))))[0]?.task_name || null;

      currentStageByProject[p] = rawCurrentLabel;
      currentCanonicalByProject[p] = currentCanonical;
      currentStageIndexByProject[p] = currentIdx;
      hasCurrentCanonicalByProject[p] = currentCanonical != null;
    }

    return {
      projects: projectNames,
      xTasks,
      currentStageByProject,
      currentCanonicalByProject,
      currentStageIndexByProject,
      seenCanonicalSetByProject,
      hasCurrentCanonicalByProject,
      lastDateByProject,
      projTotals
    };
  }, [ganttRows, displayedProjects, selectedProjects.length]);

  useEffect(() => {
    if (dashTab !== 'projects' || projectsLoading) return undefined;
    const el = ganttViewportRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      setGanttViewportWidth(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    setGanttViewportWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [dashTab, projectsLoading, selectedProjects.length]);

  // ─── render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* ─── STICKY HEADER + FILTERS ─── */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="px-8 pt-6 pb-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Work Tracker Analytics - Project View
            </h1>
            <p className="text-gray-300">Project-wise task breakdown & timeline</p>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" /> Team view
            </NavLink>
            <NavLink
              to="/night"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <Moon className="w-4 h-4" /> Night view
            </NavLink>
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isActive ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <BookMarked className="w-4 h-4" /> Cross-session books
            </NavLink>
            <NavLink
              to="/project"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${isActive ? 'bg-fuchsia-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <Briefcase className="w-4 h-4" /> Project view
            </NavLink>
          </div>
        </div>

        {/* filters grid: row1 = Dept | ProjectCategory(search) | Employee | Element
                          row2 = Team | ProjectName            | Period   | Task   + CLEAR ALL */}
        <div className="px-8 pb-6">
          <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 border border-gray-700 shadow-xl overflow-visible">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Filter className="mr-2 text-purple-400" /> Filters
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={clearAll} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold">
                  <X className="w-4 h-4 mr-2" /> CLEAR ALL
                </button>
              </div>
            </div>
            {/* One row: Segment/Series/Class scroll horizontally inside their own box so Project dropdown is not clipped by overflow-x */}
            <div className="flex flex-nowrap items-end gap-3 w-full min-w-0">
              <div className="flex gap-3 min-w-0 flex-1 overflow-x-auto pb-1 shrink">
                <div className="w-[7.5rem] shrink-0">
                  <label className="text-white text-sm font-semibold mb-2 block">Segment</label>
                  <select value={selSegment} onChange={e => { setSelSegment(e.target.value); setSelSeries('All'); setSelClass('All'); }}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="All">All</option>
                    {segments.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="w-[9rem] shrink-0">
                  <label className="text-white text-sm font-semibold mb-2 block">Series</label>
                  <select value={selSeries} onChange={e => { setSelSeries(e.target.value); setSelClass('All'); }}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {derivedSeries.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="w-[7.5rem] shrink-0">
                  <label className="text-white text-sm font-semibold mb-2 block">Class</label>
                  <select value={selClass} onChange={e => setSelClass(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {derivedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative w-[min(100%,22rem)] min-w-[12rem] max-w-md shrink-0" ref={projDropRef}>
                <label className="text-white text-sm font-semibold mb-2 block">Project</label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectSearch}
                    placeholder="Search projects…"
                    onChange={e => { setProjectSearch(e.target.value); setShowProjDrop(true); }}
                    onFocus={() => setShowProjDrop(true)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const exact = filteredProjNames.find(
                          n => n.toLowerCase() === projectSearch.trim().toLowerCase()
                        );
                        const chosen = exact || filteredProjNames[0];
                        if (chosen) {
                          setSelectedProjects(prev => prev.includes(chosen) ? prev : [...prev, chosen]);
                          setProjectSearch(chosen);
                          setShowProjDrop(false);
                        }
                      }
                    }}
                    className="w-full min-w-0 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                {showProjDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 min-w-[16rem] bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[100]">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
                      <button type="button" onClick={() => { setSelectedProjects(filteredProjNames.slice()); }} className="text-sm text-white hover:underline">Select All</button>
                      <button type="button" onClick={() => { setSelectedProjects([]); }} className="text-sm text-gray-300 hover:underline">Clear</button>
                    </div>
                    {filteredProjNames.map(n => (
                      <div key={n} onClick={() => toggleProject(n)}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white truncate flex items-center gap-2">
                        <input type="checkbox" readOnly checked={selectedProjects.includes(n)} className="w-4 h-4" />
                        <span className="flex-1 text-sm">{n}</span>
                      </div>
                    ))}
                    {filteredProjNames.length === 0 && <div className="px-4 py-2 text-gray-400">No match</div>}
                    <div className="px-3 py-2 text-right">
                      <button type="button" onClick={() => setShowProjDrop(false)} className="text-sm text-gray-300 hover:underline">Done</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-36 shrink-0">
                <label className="text-white text-sm font-semibold mb-2 block">Period</label>
                <select value={selPeriod} onChange={e => setSelPeriod(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Last Year">Last Year</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE BODY ─── */}
      <div className="px-8 py-6">
        {dashTab === 'projects' && projectsLoading && (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
              <p className="text-white text-xl">Loading Project View…</p>
            </div>
          </div>
        )}

        {dashTab === 'projects' && !projectsLoading && (
          <>
            {/* ── PROJECT-WISE TASKS title ── */}
            <h2 className="text-3xl font-bold text-white text-center mb-3">Project-wise Tasks</h2>

            {/* ── scrollable legend (task colours) ── */}
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
              {legendTasks.map(t => (
                <span key={t} className="flex items-center gap-1 text-gray-300 text-xs whitespace-nowrap">
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: globalTaskColorMap[t] || '#666' }} />
                  {t}
                </span>
              ))}
            </div>

            {/* ── HORIZONTAL BAR CHART (custom SVG inside scrollable container) ── */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl overflow-hidden mb-6">
              <div className="overflow-auto max-h-[560px]" style={{ position: 'relative' }}>
                <svg width={LABEL_COL_WIDTH + BAR_AREA_WIDTH + 20} height={svgHeight} style={{ display: 'block' }}>
                  {renderBars()}
                </svg>

                {/* floating tooltip on bar hover */}
                {barTooltip && (
                  <div style={{
                    position: 'absolute',
                    left: barTooltip.x + LABEL_COL_WIDTH + 12,
                    top: barTooltip.y - 20,
                    pointerEvents: 'none',
                    zIndex: 100,
                    backgroundColor: 'rgb(17 24 39)',
                    border: '2px solid #8b5cf6',
                    borderRadius: 8,
                    padding: '10px 16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,.6)',
                    minWidth: 250
                  }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{barTooltip.task}</p>
                    <p style={{ color: '#a5b4fc', fontSize: 12, marginBottom: 8 }}>
                      {barTooltip.projectName}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <p style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{barTooltip.hours?.toFixed(2)}</p>
                        <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Task Hours</p>
                      </div>
                      <div>
                        <p style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{barTooltip.units?.toLocaleString() || 0}</p>
                        <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Task Units</p>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, borderTop: '1px solid #374151', paddingTop: 8 }}>
                      <p style={{ color: '#d1d5db', fontSize: 12 }}>
                        Task share: <span style={{ color: '#fff', fontWeight: 700 }}>{barTooltip.taskSharePct?.toFixed(1)}%</span>
                      </p>
                      <p style={{ color: '#d1d5db', fontSize: 12 }}>
                        Project total: <span style={{ color: '#fff', fontWeight: 700 }}>{barTooltip.projectTotalHours?.toFixed(2)} hrs</span> |{' '}
                        <span style={{ color: '#fff', fontWeight: 700 }}>{barTooltip.projectTotalUnits?.toLocaleString() || 0} units</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* horizontal scroll handle hint */}
              <div className="flex justify-between px-2 py-1">
                <span className="text-gray-500 text-xs">←/→ horizontal scroll | ↑/↓ vertical scroll</span>
                <span className="text-gray-500 text-xs">{projects.length} projects</span>
              </div>
            </div>

            {/* ── PROJECT GANTT (day columns — period + filters; project scope from filter or all projects when none selected) ── */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Project timeline (Gantt)</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {projectGanttModel?.mode === 'task'
                        ? `One project: each row is a task; ${ganttTimeScale.toLowerCase()} cells show hours split by employee (same period as the timeline below).`
                        : `Multiple projects: each row is a project; ${ganttTimeScale.toLowerCase()} cells show hours split by task.`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs font-semibold">Department:</span>
                      <select
                        value={ganttDepartment}
                        onChange={(e) => setGanttDepartment(e.target.value)}
                        className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="All">All</option>
                        <option value="DTP">DTP</option>
                        <option value="Editorial">Editorial</option>
                        <option value="Digital_Marketing">Digital_Marketing</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs font-semibold">Time Scale:</span>
                      <select
                        value={ganttTimeScale}
                        onChange={(e) => setGanttTimeScale(e.target.value)}
                        className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Day">Day</option>
                        <option value="Week">Week</option>
                        <option value="Month">Month</option>
                      </select>
                    </div>
                    {ganttLoading && (
                      <span className="text-purple-300 text-sm animate-pulse">Loading Gantt…</span>
                    )}
                  </div>
                </div>
                {projectGanttModel && (
                  <>
                    <p className="text-center text-gray-300 text-xs mb-2">
                      Scope: <span className="text-white font-semibold">{currentScopeLabel}</span>
                      {' · '}
                      Period: <span className="text-white font-semibold">{selPeriod}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 max-h-24 flex-wrap" style={{ scrollbarWidth: 'thin' }}>
                      <span className="text-gray-500 text-xs shrink-0">{projectGanttModel.legendTitle}:</span>
                      {projectGanttModel.legendItems.map((item) => (
                        <span key={item.key} className="flex items-center gap-1 text-gray-300 text-xs whitespace-nowrap">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-none shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.label}
                        </span>
                      ))}
                    </div>
                    <div
                      ref={ganttViewportRef}
                      className="max-h-[560px] overflow-x-auto overflow-y-auto border border-gray-700 rounded-lg bg-gray-900/40 relative overscroll-contain"
                      style={{ scrollbarWidth: 'thin' }}
                      onMouseLeave={() => setGanttTooltip(null)}
                    >
                      {(() => {
                        const {
                          buckets,
                          yKeys,
                          rowLabel,
                          getCell,
                          yAxisTitle,
                          mode,
                          getTaskChapterBreakdown,
                          getProjectEmployeeBreakdown
                        } = projectGanttModel;
                        const innerW = Math.max(360, ganttViewportWidth || 720);
                        const minColWidth = ganttTimeScale === 'Month' ? 86 : (ganttTimeScale === 'Week' ? 112 : GANTT_DAY_COL_MIN);
                        const chartArea = Math.max(innerW - 32 - GANTT_LABEL_COL, buckets.length * minColWidth);
                        const dayColW = Math.max(minColWidth, chartArea / Math.max(buckets.length, 1));
                        const gridMinW = GANTT_LABEL_COL + buckets.length * dayColW;

                        return (
                          <div style={{ minWidth: gridMinW }} className="pb-1">
                            <div className="flex border-b border-gray-600 bg-gray-900/95 sticky top-0 z-20 shadow-[0_1px_0_rgba(0,0,0,0.4)]">
                              <div
                                style={{ width: GANTT_LABEL_COL, minWidth: GANTT_LABEL_COL }}
                                className="shrink-0 sticky left-0 z-30 px-2 py-2 text-gray-400 text-xs font-semibold border-r border-gray-700 bg-gray-900/95"
                              >
                                {yAxisTitle}
                              </div>
                              {buckets.map((bucket) => (
                                <div
                                  key={bucket.key}
                                  style={{ width: dayColW, minWidth: dayColW }}
                                  className="shrink-0 border-l border-gray-700 text-center text-[10px] text-gray-300 py-2 leading-tight font-medium"
                                >
                                  {bucket.label}
                                </div>
                              ))}
                            </div>

                            {yKeys.length === 0 && !ganttLoading ? (
                              <p className="text-gray-500 text-sm text-center py-10 px-4">
                                No day-level hours in this scope for the Gantt. Try another period or project selection.
                              </p>
                            ) : (
                              yKeys.map((yKey) => (
                                <div
                                  key={yKey}
                                  className="flex border-b-2 border-gray-600 hover:bg-gray-800/30"
                                  style={{ minHeight: GANTT_ROW_H }}
                                >
                                  <div
                                    style={{ width: GANTT_LABEL_COL, minWidth: GANTT_LABEL_COL }}
                                    className="shrink-0 sticky left-0 z-10 px-2 py-2 text-gray-200 text-xs font-medium border-r border-gray-700 flex items-center truncate bg-gray-900/95"
                                    title={rowLabel(yKey)}
                                  >
                                    {rowLabel(yKey)}
                                  </div>
                                  {buckets.map((bucket) => {
                                    const segs = getCell(yKey, bucket.key);
                                    const total = segs.reduce((s, x) => s + x.hours, 0);
                                    return (
                                      <div
                                        key={`${yKey}-${bucket.key}`}
                                        style={{ width: dayColW, minWidth: dayColW }}
                                        className="shrink-0 border-l border-gray-800 p-px flex items-stretch bg-gray-950/50"
                                      >
                                        <div className="flex w-full h-8 my-auto overflow-hidden bg-gray-900/60">
                                          {total <= 0 ? (
                                            <div className="w-full h-full bg-gray-900/40" />
                                          ) : (
                                            segs.map((seg) => {
                                              return (
                                                <div
                                                  key={seg.key}
                                                  className="h-full flex items-center justify-center min-w-0 rounded-none border-0 outline-none cursor-default"
                                                  style={{
                                                    flex: Math.max(seg.hours, 0.001),
                                                    backgroundColor: seg.color
                                                  }}
                                                  onMouseMove={(e) => {
                                                    const breakdown =
                                                      mode === 'task' && typeof getTaskChapterBreakdown === 'function'
                                                        ? getTaskChapterBreakdown(yKey, bucket.key, seg.key)
                                                        : mode === 'project' && typeof getProjectEmployeeBreakdown === 'function'
                                                          ? getProjectEmployeeBreakdown(yKey, bucket.key, seg.key)
                                                          : [];
                                                    setGanttTooltip({
                                                      x: e.clientX,
                                                      y: e.clientY,
                                                      mode,
                                                      row: rowLabel(yKey),
                                                      date: bucket.label,
                                                      name: seg.label,
                                                      hours: seg.hours,
                                                      total,
                                                      breakdownTitle:
                                                        mode === 'task' ? 'Chapter breakdown' : 'Employee breakdown',
                                                      breakdown
                                                    });
                                                  }}
                                                >
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    {ganttTooltip && (
                      <div
                        className="pointer-events-none fixed z-[10003] rounded-lg border border-purple-500/70 bg-gray-900 px-3 py-2 text-xs shadow-xl"
                        style={{
                          left: Math.min(Math.max(ganttTooltip.x + 12, 8), (typeof window !== 'undefined' ? window.innerWidth : 800) - 200),
                          top: Math.min(Math.max(ganttTooltip.y + 12, 8), (typeof window !== 'undefined' ? window.innerHeight : 600) - 120)
                        }}
                      >
                        <p className="text-white font-semibold">{ganttTooltip.row}</p>
                        <p className="text-indigo-300 mt-0.5">
                          {ganttTooltip.mode === 'task' ? (
                            <>Employee: <span className="text-white">{ganttTooltip.name}</span></>
                          ) : (
                            <>Task: <span className="text-white">{ganttTooltip.name}</span></>
                          )}
                        </p>
                        <p className="text-gray-400">{ganttTooltip.date}</p>
                        <p className="text-purple-200 mt-1">
                          {ganttTooltip.hours.toFixed(2)} hrs
                          {ganttTooltip.total > 0 && (
                            <span className="text-gray-500">
                              {' '}
                              ({((ganttTooltip.hours / ganttTooltip.total) * 100).toFixed(0)}% of cell)
                            </span>
                          )}
                        </p>
                        {Array.isArray(ganttTooltip.breakdown) && ganttTooltip.breakdown.length > 0 && (
                          <div className="mt-2 border-t border-gray-700 pt-2">
                            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mb-1">
                              {ganttTooltip.breakdownTitle || 'Breakdown'}
                            </p>
                            <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1">
                              {ganttTooltip.breakdown.map((line) => (
                                <div key={String(line.key)} className="flex justify-between gap-3 text-gray-300">
                                  <span className="truncate">{line.label}</span>
                                  <span className="text-white font-semibold shrink-0">{Number(line.hours || 0).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-gray-600 text-[10px] text-right mt-2">Uses the same filters and date range as the area chart timeline (when a single project is in scope).</p>
                  </>
                )}
                {!ganttLoading && !projectGanttModel && (
                  <p className="text-gray-500 text-sm py-10 text-center border border-gray-700 rounded-lg">
                    No Gantt rows for this period and filter set — widen the period or relax segment / series / class filters.
                  </p>
                )}
              </div>

            {/* ── TASK STAGE HEATMAP (latest stage per project vs full task sequence; same period as Gantt) ── */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Task stage heatmap</h2>
                <p className="text-gray-400 text-sm mb-3 max-w-4xl">
                  Rows are projects in the current scope with logged hours. Columns follow your task sequence.{' '}
                  <span className="text-emerald-400 font-semibold">Green</span> shows completed stages in sequence and{' '}
                  <span className="text-sky-400 font-semibold">Blue</span> marks the current stage from the{' '}
                  <strong className="text-gray-200">most recent calendar day</strong> in the period.
                </p>
                {taskStageHeatmapModel.projects.length === 0 ? (
                  <p className="text-gray-500 text-sm py-8 text-center border border-gray-700 rounded-lg">
                    No Gantt data for this period — select projects and ensure the period includes worklogs.
                  </p>
                ) : (
                  <div className="max-h-[480px] overflow-y-auto overflow-x-auto rounded-lg border border-gray-700 bg-gray-950/80 w-full">
                    <table className="border-collapse text-[10px] w-full table-fixed">
                      <thead>
                        <tr className="bg-gray-900/95 sticky top-0 z-20">
                          <th
                            className="sticky left-0 z-30 bg-gray-900/95 border border-gray-700 px-2 py-2 text-left text-gray-300 font-semibold min-w-[12rem] w-[18rem]"
                            scope="col"
                          >
                            Project
                          </th>
                          {taskStageHeatmapModel.xTasks.map((t) => (
                            <th
                              key={t}
                              className="border border-gray-700 px-0.5 py-1 text-gray-400 font-medium text-center align-bottom whitespace-nowrap"
                              style={{ minWidth: '22px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                              title={t}
                            >
                              <span className="inline-block max-h-[140px] truncate">{t}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {taskStageHeatmapModel.projects.map((proj) => {
                          const canon = taskStageHeatmapModel.currentCanonicalByProject[proj];
                          const currentIdx = taskStageHeatmapModel.currentStageIndexByProject[proj] ?? -1;
                          const seenSet = taskStageHeatmapModel.seenCanonicalSetByProject[proj] || new Set();
                          const hasCurrentCanonical = taskStageHeatmapModel.hasCurrentCanonicalByProject[proj] === true;
                          const raw = taskStageHeatmapModel.currentStageByProject[proj];
                          const lastD = taskStageHeatmapModel.lastDateByProject[proj];
                          return (
                            <tr key={proj} className="border-b border-gray-800 hover:bg-gray-900/40">
                              <td
                                className="sticky left-0 z-10 bg-gray-950/95 border border-gray-700 px-2 py-1.5 text-gray-200 font-medium truncate w-[18rem] max-w-[18rem]"
                                title={proj}
                              >
                                <div className="truncate">{proj}</div>
                                {lastD && (
                                  <div className="text-[9px] text-gray-500 font-normal mt-0.5">
                                    Last day: {lastD}
                                    {raw && canon === null && (
                                      <span className="text-amber-500/90"> · {raw}</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              {taskStageHeatmapModel.xTasks.map((colTask) => {
                                const colIdx = heatmapStageOrderIndex(colTask);
                                const isCurrent = hasCurrentCanonical && canon != null && colTask === canon && currentIdx >= 0;
                                const isSeen = !isCurrent && seenSet.has(colTask) && colIdx >= 0;
                                return (
                                  <td
                                    key={`${proj}-${colTask}`}
                                    className={`border border-gray-800 p-0 text-center ${
                                      isCurrent
                                        ? 'bg-sky-500 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.65)]'
                                        : isSeen
                                          ? 'bg-emerald-500 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.6)]'
                                          : 'bg-black'
                                    }`}
                                    title={
                                      isCurrent
                                        ? `Current stage: ${colTask} (from ${lastD})`
                                        : isSeen
                                          ? `Has DB entry: ${colTask}`
                                        : `${proj} · ${colTask}`
                                    }
                                  >
                                    <div className="h-7 w-full min-w-[20px]" />
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            {/* ── PROJECT TIMELINE (area chart — single-project scope only) ── */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-6">
              <h2 className="text-3xl font-bold text-white text-center mb-1">Project Timeline</h2>

              {timelineInsightProjects.length > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    {selectedProjects.length > 1 && (
                      <button
                        onClick={() => setActiveProject(null)}
                        className="text-xs px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Clear focus
                      </button>
                    )}
                    {selectedProjects.length > 1 && (
                      <select
                        value={activeProject || ''}
                        onChange={(e) => setActiveProject(e.target.value || null)}
                        className="bg-gray-700 text-white border border-gray-600 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a project…</option>
                        {selectedProjects.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    )}
                  </div>
                  <p className="text-center text-gray-300 text-sm mb-3">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', marginRight: 6 }} />
                    {currentScopeLabel}
                  </p>

                  {timeline.length > 0 ? (
                    <>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-xs">Timeline Days</p>
                          <p className="text-white text-lg font-bold">{timelineWithTotals.length}</p>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-xs">Total Hours</p>
                          <p className="text-white text-lg font-bold">{timelineSummary.totalHours.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-xs">Avg Hours / Day</p>
                          <p className="text-white text-lg font-bold">{timelineSummary.avgHours.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-center">
                          <p className="text-gray-400 text-xs">Peak Day</p>
                          <p className="text-white text-sm font-bold">{timelineSummary.peakDate}</p>
                          <p className="text-purple-300 text-xs">{timelineSummary.peakHours.toFixed(2)} hrs</p>
                        </div>
                      </div>

                      <p className="text-center text-gray-300 text-xs mb-2">
                        Top timeline task: <span className="text-white font-semibold">{timelineSummary.topTask}</span>
                      </p>

                      <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={timelineWithTotals} margin={{ top: 10, right: 40, left: 10, bottom: 40 }}>
                          <defs>
                            {timelineTasks.map((t, i) => (
                              <linearGradient key={t} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={timelineColorMap[t]} stopOpacity={0.7} />
                                <stop offset="95%" stopColor={timelineColorMap[t]} stopOpacity={0.15} />
                              </linearGradient>
                            ))}
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} angle={-35} textAnchor="end" height={55} />
                          <YAxis stroke="#9ca3af" fontSize={12} />
                          <Tooltip content={<TimelineTooltip />}
                            contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: 8 }}
                            wrapperStyle={{ zIndex: 10001, outline: 'none' }} />
                          {timelineTasks.map((t, i) => (
                            <Area key={t} type="monotone" dataKey={t} stackId="1"
                              stroke={timelineColorMap[t]} fill={`url(#grad_${i})`}
                              name={t} isAnimationActive={false} />
                          ))}
                          <Line
                            type="monotone"
                            dataKey="totalHours"
                            name="Total Hours"
                            stroke="#ffffff"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-20">No timeline data for this project in the current period.</p>
                  )}
                </>
              ) : selectedProjects.length > 1 ? (
                <div className="text-center py-16 space-y-4">
                  <p className="text-gray-400 text-sm max-w-lg mx-auto">
                    Multiple projects are selected. Focus one project to load the timeline and deep dive.
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <select
                      value={activeProject || ''}
                      onChange={(e) => setActiveProject(e.target.value || null)}
                      className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-full"
                    >
                      <option value="">Select a project…</option>
                      {selectedProjects.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-20 text-sm">
                  👆 Click a project name in the chart above (or pick a single project in the filter) to load this timeline.
                </p>
              )}
            </div>

            {/* ── PROJECT DEEP DIVE DASHBOARD ── */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-6 mt-6">
              <h2 className="text-3xl font-bold text-white text-center mb-4">Project Deep Dive</h2>

              {timelineInsightProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-10 text-sm">
                  {selectedProjects.length > 1
                    ? 'Focus one project in the timeline section above to view team contribution, task ownership, and hours.'
                    : 'Select or focus a project to view team contribution, task ownership, and hours.'}
                </p>
              ) : insightsLoading ? (
                <p className="text-gray-300 text-center py-10">Loading detailed project insights...</p>
              ) : projectInsights?.summary ? (
                <>
                  {selectedProjects.length > 1 && (
                    <p className="text-yellow-300 text-xs mb-4 text-center">
                      Showing details for: <span className="font-semibold">{currentScopeLabel}</span>
                    </p>
                  )}

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs">Total Projects</p>
                      <p className="text-white text-2xl font-bold">{projectInsights.summary.totalProjects || 1}</p>
                    </div>
                    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs">Total Employees</p>
                      <p className="text-white text-2xl font-bold">{projectInsights.summary.totalEmployees}</p>
                    </div>
                    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs">Total Tasks</p>
                      <p className="text-white text-2xl font-bold">{projectInsights.summary.totalTasks}</p>
                    </div>
                    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-xs">Total Hours</p>
                      <p className="text-white text-2xl font-bold">{projectInsights.summary.totalHours.toFixed(2)}</p>
                    </div>
                  </div>

                  {projectInsights.insights?.health && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs">Active Days</p>
                        <p className="text-white text-2xl font-bold">{projectInsights.insights.health.activeDays}</p>
                        <p className="text-gray-400 text-xs mt-1">of {projectInsights.insights.health.spanDays} days</p>
                      </div>
                      <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs">Activity Rate</p>
                        <p className="text-white text-2xl font-bold">{projectInsights.insights.health.activityRatePct.toFixed(1)}%</p>
                      </div>
                      <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs">Avg Hours / Active Day</p>
                        <p className="text-white text-2xl font-bold">{projectInsights.insights.health.avgHoursPerActiveDay.toFixed(2)}</p>
                      </div>
                      <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs">Velocity (Recent 7D)</p>
                        <p className={`text-2xl font-bold ${projectInsights.insights.health.velocityTrendPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {projectInsights.insights.health.velocityTrendPct >= 0 ? '+' : ''}{projectInsights.insights.health.velocityTrendPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  {projectInsights.insights?.concentration && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Top 3 Task Concentration</p>
                        <p className="text-white text-xl font-bold">{projectInsights.insights.concentration.topThreeTaskSharePct.toFixed(1)}%</p>
                        <p className="text-gray-500 text-xs">Higher value means work is concentrated in fewer tasks.</p>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Top Contributor Share</p>
                        <p className="text-white text-xl font-bold">{projectInsights.insights.concentration.topContributorSharePct.toFixed(1)}%</p>
                        <p className="text-gray-500 text-xs">Indicates dependency risk on one employee.</p>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-xs mb-1">Single-owner Tasks</p>
                        <p className="text-white text-xl font-bold">{projectInsights.insights.concentration.highlyOwnedTasksPct.toFixed(1)}%</p>
                        <p className="text-gray-500 text-xs">Tasks where one owner handles ~80%+ of hours.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {projectInsights.projectBreakdown && projectInsights.projectBreakdown.length > 1 && (
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-white text-lg font-semibold mb-3">Project Contribution</h3>
                        <div className="max-h-72 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-gray-400 border-b border-gray-700">
                                <th className="text-left py-2">Project</th>
                                <th className="text-right py-2">Hours</th>
                                <th className="text-right py-2">Avg Hrs/Day</th>
                                <th className="text-right py-2">Share</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectInsights.projectBreakdown.map((row) => (
                                <tr key={row.project} className="border-b border-gray-800 text-gray-200">
                                  <td className="py-2 pr-2">{row.project}</td>
                                  <td className="py-2 text-right">{row.hours.toFixed(2)}</td>
                                  <td className="py-2 text-right">{row.avgHoursPerActiveDay.toFixed(2)}</td>
                                  <td className="py-2 text-right">{row.contributionPct.toFixed(1)}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <h3 className="text-white text-lg font-semibold mb-3">Employee Contribution</h3>
                      <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                              <th className="text-left py-2">Employee</th>
                              <th className="text-right py-2">Hours</th>
                              <th className="text-right py-2">Active Days</th>
                              <th className="text-right py-2">Avg Hrs/Day</th>
                              <th className="text-right py-2">Contribution</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectInsights.employeeContribution.map((row) => (
                              <tr key={row.employee} className="border-b border-gray-800 text-gray-200">
                                <td className="py-2 pr-2">{row.employee}</td>
                                <td className="py-2 text-right">{row.hours.toFixed(2)}</td>
                                <td className="py-2 text-right">{row.activeDays || 0}</td>
                                <td className="py-2 text-right">{(row.avgHoursPerActiveDay || 0).toFixed(2)}</td>
                                <td className="py-2 text-right">{row.contributionPct.toFixed(1)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 col-span-2">
                      <h3 className="text-white text-lg font-semibold mb-3">Task Ownership & Hours</h3>
                      <p className="text-gray-400 text-xs mb-2">Click a task row to expand employee-wise chapter and element split.</p>
                      <div className="max-h-72 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                              <th className="text-left py-2">Task</th>
                              <th className="text-left py-2">Context (Element / Chapter)</th>
                              <th className="text-left py-2">Owner</th>
                              <th className="text-right py-2">Hours</th>
                              <th className="text-right py-2">Owner Share</th>
                              <th className="text-right py-2">Collaborators</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectInsights.taskBreakdown.map((row) => (
                              <React.Fragment key={row.task}>
                                <tr
                                  className="border-b border-gray-800 text-gray-200 cursor-pointer hover:bg-gray-800/40"
                                  onClick={() => setExpandedTask(prev => prev === row.task ? null : row.task)}
                                >
                                  <td className="py-2 pr-2">
                                    <span className="text-purple-300 mr-1">{expandedTask === row.task ? '▼' : '▶'}</span>
                                    {row.task}
                                  </td>
                                  <td className="py-2 pr-2">
                                    <p className="text-gray-200 text-xs">
                                      {row.topElement && row.topElement !== '-' ? row.topElement : '-'}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      Ch: {row.topChapter && row.topChapter !== '-' ? row.topChapter : '-'}
                                    </p>
                                  </td>
                                  <td className="py-2 pr-2">{row.primaryOwner}</td>
                                  <td className="py-2 text-right">{row.totalHours.toFixed(2)}</td>
                                  <td className="py-2 text-right">{(row.primaryOwnerSharePct || 0).toFixed(1)}%</td>
                                  <td className="py-2 text-right">{row.collaborationCount || 0}</td>
                                </tr>
                                {expandedTask === row.task && (
                                  <tr className="border-b border-gray-800 bg-gray-900/70">
                                    <td colSpan={6} className="py-2 px-2">
                                      <div className="grid grid-cols-2 gap-3">
                                        {(row.ownerContext || []).map((owner) => (
                                          <div key={`${row.task}_${owner.employee}`} className="bg-gray-800/70 border border-gray-700 rounded-md p-2">
                                            <div className="flex justify-between items-center mb-1">
                                              <span className="text-sm text-white font-semibold">{owner.employee}</span>
                                              <span className="text-xs text-purple-300">{owner.hours.toFixed(2)} hrs</span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                              Elements: {(owner.topElements || []).length > 0
                                                ? owner.topElements.map(e => `${e.name} (${e.hours.toFixed(1)}h)`).join(', ')
                                                : '-'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                              Chapters: {(owner.topChapters || []).length > 0
                                                ? owner.topChapters.map(c => `${c.name} (${c.hours.toFixed(1)}h)`).join(', ')
                                                : '-'}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </>
              ) : (
                <p className="text-gray-500 text-center py-10 text-sm">
                  No detailed data available for the selected project.
                </p>
              )}
            </div>
          </>
        )}

        {dashTab === 'night' && (
          <div className="space-y-8 pb-8">
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-4 text-indigo-100 text-sm max-w-4xl">
              <strong className="text-indigo-200">Night view</strong> uses the same Segment, Series, Class, Project, and Period filters as this page. Only rows with Night work mode are included.
            </div>
            {nightLoading && (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500" />
              </div>
            )}
            {!nightLoading && nightData?.summary && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={Moon} title="Night hours" value={Math.round(nightData.summary.totalNightHours || 0)} subtitle="Current filters" color="from-indigo-600 to-indigo-900" />
                  <StatCard icon={Clock} title="Night entries" value={nightData.summary.totalNightEntries || 0} subtitle="Row count" color="from-slate-600 to-slate-900" />
                  <StatCard icon={Users} title="Night contributors" value={nightData.summary.uniqueNightContributors || 0} subtitle="Distinct names" color="from-violet-600 to-violet-900" />
                  <StatCard icon={Zap} title="Night share" value={`${(nightData.summary.nightPercentOfFilteredHours || 0).toFixed(1)}%`} subtitle="Of filtered hours" color="from-fuchsia-600 to-purple-900" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Moon className="w-5 h-5 mr-2 text-indigo-400" /> Night hours — top projects</h2>
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                      <div className="h-[260px] w-full max-w-[280px] mx-auto lg:mx-0 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                            <Pie
                              data={nightData.nightProjectShare || []}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={56}
                              outerRadius={92}
                              paddingAngle={1}
                              stroke="#1f2937"
                              strokeWidth={1}
                              label={false}
                              isAnimationActive={false}
                            >
                              {(nightData.nightProjectShare || []).map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              wrapperStyle={{ zIndex: 10010 }}
                              content={({ active, payload }) =>
                                active && payload?.[0] ? (
                                  <div className="rounded-lg border border-indigo-500 bg-gray-900 p-3 text-sm max-w-xs shadow-xl">
                                    <p className="text-white font-semibold break-words">{payload[0].payload.fullName || payload[0].payload.name}</p>
                                    <p className="text-indigo-200 mt-1">
                                      {(Number(payload[0].value) || 0).toFixed(1)} hrs · {payload[0].payload.nightPercentOfNightTotal ?? 0}% of night total
                                    </p>
                                  </div>
                                ) : null
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <ul className="flex-1 min-w-0 max-h-[280px] overflow-y-auto space-y-2.5 text-sm rounded-lg border border-gray-700/60 bg-gray-900/50 p-3">
                        {(nightData.nightProjectShare || []).map((row, i) => (
                          <li key={`${row.fullName || row.name}-${i}`} className="flex gap-3 items-start">
                            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm ring-1 ring-white/20" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <div className="min-w-0 flex-1">
                              <p className="text-gray-100 break-words leading-snug" title={row.fullName}>{row.fullName || row.name}</p>
                              <p className="text-gray-400 text-xs mt-0.5 tabular-nums">
                                {(row.value ?? 0).toFixed(1)} hrs · {row.nightPercentOfNightTotal ?? 0}% of night
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-cyan-400" /> Night hours by team</h2>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={(nightData.teamNight || []).slice(0, 12)} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="team" stroke="#9ca3af" angle={-35} textAnchor="end" height={70} interval={0} fontSize={11} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<PtTooltip />} />
                        <Bar dataKey="hours" fill="#6366f1" name="Night hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-pink-400" /> Night % of own hours</h2>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={(nightData.contributorNight || []).slice(0, 14)} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip content={<PtTooltip />} />
                        <Bar dataKey="nightPercentOfOwnHours" fill="#ec4899" name="Night % own" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Activity className="w-5 h-5 mr-2 text-emerald-400" /> Night vs day-mode hours by task</h2>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={(nightData.nightVsDayByTask || []).filter((t) => t.nightHours > 0).slice(0, 12)} margin={{ bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="task" stroke="#9ca3af" angle={-30} textAnchor="end" height={80} interval={0} fontSize={10} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<PtTooltip />} />
                        <Legend />
                        <Bar dataKey="nightHours" fill="#6366f1" name="Night hrs" isAnimationActive={false} />
                        <Bar dataKey="dayHours" fill="#94a3b8" name="Day-mode hrs" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Clock className="w-5 h-5 mr-2 text-amber-400" /> Log hour distribution</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={nightData.hourlyBuckets || []} isAnimationActive={false}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<PtTooltip />} />
                        <Area type="monotone" dataKey="hours" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Hours" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Target className="w-5 h-5 mr-2 text-orange-400" /> Night by weekday</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={nightData.dowBuckets || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<PtTooltip />} />
                        <Bar dataKey="hours" fill="#14b8a6" name="Hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-sky-400" /> Night hours over time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={nightData.nightTimeline || []} isAnimationActive={false}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<PtTooltip />} />
                      <Line type="monotone" dataKey="hours" stroke="#818cf8" strokeWidth={2} dot={false} name="Night hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-purple-400" /> Units per night hour</h2>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={(nightData.projectsNight || []).filter((p) => p.hours >= 1).slice(0, 12)} margin={{ bottom: 72 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="project_name" stroke="#9ca3af" angle={-30} textAnchor="end" height={90} interval={0} fontSize={9} tickFormatter={(v) => (v.length > 28 ? `${v.slice(0, 26)}…` : v)} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<PtTooltip />} />
                        <Bar dataKey="unitsPerHour" fill="#a78bfa" name="Units / hr" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-amber-400" /> Flags</h2>
                    <ul className="space-y-3 text-sm text-gray-200 max-h-80 overflow-y-auto">
                      {(nightData.anomalies || []).length === 0 && <li className="text-gray-500">No flags for this filter.</li>}
                      {(nightData.anomalies || []).map((a, i) => (
                        <li key={i} className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
                          <span className="text-amber-300 font-semibold text-xs uppercase">{String(a.type || '').replace(/_/g, ' ')}</span>
                          <p className="text-white font-medium mt-1">{a.entity}</p>
                          <p className="text-gray-400 mt-1">{a.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
            {!nightLoading && !nightData?.summary && (
              <p className="text-gray-400">Could not load night analytics.</p>
            )}
          </div>
        )}

        {dashTab === 'books' && (
          <div className="space-y-8 pb-8">
            <div className="rounded-xl border border-teal-500/40 bg-teal-950/20 p-4 text-teal-100 text-sm max-w-4xl">
              Cross-session grouping respects Segment, Series, Class, Period, and selected Projects (same as Project view filters).
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-white text-sm font-semibold">Minimum distinct sessions</label>
              <select
                value={bookSessionMin}
                onChange={(e) => setBookSessionMin(Number(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
              >
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
              {!booksLoading && crossBooks?.summary && (
                <span className="text-gray-400 text-sm">{crossBooks.summary.groupsReturned} book group(s) with at least {bookSessionMin} session suffixes.</span>
              )}
              {booksLoading && (
                <span className="text-gray-500 text-sm italic">Loading…</span>
              )}
            </div>
            {booksLoading && (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500" />
              </div>
            )}
            {!booksLoading && crossBooks?.groups && (
              <>
                <div className="overflow-x-auto rounded-xl border border-gray-700">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Base book</th>
                        <th className="px-4 py-3">Sessions</th>
                        <th className="px-4 py-3">Total hours</th>
                        <th className="px-4 py-3">Flags</th>
                        <th className="px-4 py-3"> </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-900/40">
                      {crossBooks.groups.map((g) => {
                        const totalH = g.sessions.reduce((s, x) => s + (x.totalHours || 0), 0);
                        const flagN = (g.flags || []).length;
                        return (
                          <tr key={g.baseKey} className="hover:bg-gray-800/80">
                            <td className="px-4 py-3 text-white font-medium max-w-md truncate" title={g.displayBase}>{g.displayBase}</td>
                            <td className="px-4 py-3 text-gray-300">{g.sessionCount}</td>
                            <td className="px-4 py-3 text-gray-200">{totalH.toFixed(1)}</td>
                            <td className="px-4 py-3">{flagN > 0 ? <span className="text-amber-400">{flagN}</span> : '—'}</td>
                            <td className="px-4 py-3">
                              <button type="button" className="text-teal-400 hover:underline" onClick={() => setSelectedBookGroup(g)}>Details</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {crossBooks.groups.length === 0 && (
                  <p className="text-gray-400">No multi-session books for these filters. Try widening segment/period or lowering the session threshold.</p>
                )}
                {selectedBookGroup && (
                  <div
                    ref={crossBookDetailRef}
                    className="rounded-xl border border-teal-500/40 bg-gray-800/50 p-6 space-y-6 scroll-mt-28"
                  >
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedBookGroup.displayBase}</h3>
                        <p className="text-gray-400 text-sm mt-1">Base key: {selectedBookGroup.baseKey}</p>
                      </div>
                      <button type="button" onClick={() => setSelectedBookGroup(null)} className="text-gray-400 hover:text-white text-sm">Close</button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Hours &amp; contributors by session</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={selectedBookGroup.chartBySession || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="session" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<PtTooltip />} />
                            <Legend />
                            <Bar dataKey="hours" fill="#2dd4bf" name="Hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                            <Bar dataKey="contributors" fill="#f472b6" name="Contributors" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Hours per contributor</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={selectedBookGroup.chartBySession || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="session" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<PtTooltip />} />
                            <Bar dataKey="hoursPerContributor" fill="#a78bfa" name="Hrs / contributor" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    {(selectedBookGroup.flags?.length > 0 || selectedBookGroup.insights?.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-amber-500/30 bg-gray-900/50 p-4">
                          <h5 className="text-amber-200 font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Flags</h5>
                          <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                            {(selectedBookGroup.flags || []).map((f, i) => (
                              <li key={i}>{f.message}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-lg border border-teal-500/30 bg-gray-900/50 p-4">
                          <h5 className="text-teal-200 font-semibold mb-2">Insights</h5>
                          <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                            {(selectedBookGroup.insights || []).length === 0 && <li className="list-none text-gray-500">No insights.</li>}
                            {(selectedBookGroup.insights || []).map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Per session</h4>
                      <div className="space-y-6">
                        {(selectedBookGroup.sessions || []).filter((s) => s.sessionLabel !== 'unspecified').map((s) => (
                          <div key={s.sessionLabel} className="border border-gray-700 rounded-lg p-4 bg-gray-900/40">
                            <div className="flex flex-wrap justify-between gap-2 mb-2">
                              <span className="text-teal-300 font-bold">Session {s.sessionLabel}</span>
                              <span className="text-gray-400 text-sm">{s.totalHours}h · {s.contributorCount} contributors · {s.entryCount} entries</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Projects: {(s.projectNames || []).join(', ')}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={(s.taskHours || []).slice(0, 8)} layout="vertical" margin={{ left: 4 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                  <XAxis type="number" stroke="#9ca3af" />
                                  <YAxis type="category" dataKey="task" stroke="#9ca3af" width={120} tick={{ fontSize: 10 }} />
                                  <Tooltip content={<PtTooltip />} />
                                  <Bar dataKey="hours" fill="#34d399" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                                </BarChart>
                              </ResponsiveContainer>
                              <div className="text-xs text-gray-400 max-h-52 overflow-y-auto">
                                <p className="text-gray-300 font-semibold mb-1">Contributors</p>
                                <p>{(s.contributors || []).join(', ') || '—'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {!booksLoading && !crossBooks?.groups && (
              <p className="text-gray-400">Could not load cross-session data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualization2;