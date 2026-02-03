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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, X, Search, TrendingUp } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/dashboard';

// 30 distinct colours — enough to cover all task types without collisions
const TASK_COLORS = [
  '#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316',
  '#6366f1','#84cc16','#06b6d4','#e11d48','#d97706','#0891b2','#7c3aed','#059669',
  '#dc2626','#2563eb','#ca8a04','#16a34a','#9333ea','#db2777','#ea580c','#0284c7',
  '#4f46e5','#65a30d','#0e7490','#be123c','#b45309','#15803d'
];

// Department → team-name matcher  (same logic as Visualization.jsx)
const DEPARTMENT_TEAM_MAPPING = {
  DTP:              t => t.startsWith('DTP') || t.startsWith('Animation'),
  Editorial:        t => t.startsWith('Editorial') || t.startsWith('CSMA'),
  'Digital Marketing': t => t === 'Digital_Marketing'
};

// ─── helper: build a stable colour map from a task-name list ───
function buildColorMap(taskNames) {
  const map = {};
  taskNames.forEach((name, i) => { map[name] = TASK_COLORS[i % TASK_COLORS.length]; });
  return map;
}

// ─── Timeline Tooltip (matches screenshot: Task | Hours table + Total row) ───
const TimelineTooltip = memo(({ active, payload, label, taskColorMap }) => {
  if (!active || !payload || !payload.length) return null;

  // filter out zero-value entries, sort desc
  const entries = payload
    .filter(e => e.value && e.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((s, e) => s + (e.value || 0), 0);

  return (
    <div style={{ backgroundColor: 'rgb(17 24 39)', border: '2px solid #8b5cf6', borderRadius: 8, padding: '10px 14px', minWidth: 180, boxShadow: '0 4px 24px rgba(0,0,0,.5)', zIndex: 10001 }}>
      {label && <p style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{label}</p>}
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
  // ── filter state ──
  const [departments]           = useState(['All', 'DTP', 'Editorial', 'Digital Marketing']);
  const [allTeams, setAllTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);

  const [selDept,       setSelDept]       = useState('All');
  const [selTeam,       setSelTeam]       = useState('All');
  const [selEmployee,   setSelEmployee]   = useState('All');
  const [selProject,    setSelProject]    = useState('All');
  const [selElement,    setSelElement]    = useState('All');
  const [selTask,       setSelTask]       = useState('All');
  const [selPeriod,     setSelPeriod]     = useState('All');
  const [projectSearch, setProjectSearch] = useState('');

  // ── dropdown visibility ──
  const [showProjDrop, setShowProjDrop] = useState(false);

  // ── data ──
  const [projects,        setProjects]        = useState([]);  // top-10 with task breakdown
  const [projectNames,    setProjectNames]    = useState([]);  // for Project Name dropdown
  const [taskNames,       setTaskNames]       = useState([]);  // for Task dropdown
  const [elementNames,    setElementNames]    = useState([]);  // for Project Element dropdown
  const [timeline,        setTimeline]        = useState([]);  // area chart rows
  const [timelineTasks,   setTimelineTasks]   = useState([]);  // task keys present in timeline
  const [selectedProject, setSelectedProject] = useState(null); // clicked project name (drives timeline)

  const [loading, setLoading] = useState(true);

  // ── refs ──
  const projDropRef = useRef(null);

  // ─── colour map: stable across renders, built from ALL tasks seen in projects data ──
  const globalTaskColorMap = useMemo(() => {
    const set = new Set();
    projects.forEach(p => p.tasks.forEach(t => set.add(t.task)));
    return buildColorMap([...set]);
  }, [projects]);

  // ─── fetch filter lists ──────────────────────────────────────
  const fetchFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (selTeam !== 'All') params.append('team', selTeam);
      if (selEmployee !== 'All') params.append('employee', selEmployee);
      if (selPeriod !== 'All') params.append('period', selPeriod);
      const qs = params.toString();
      const sfx = qs ? `?${qs}` : '';

      const [teamsRes, empRes, projRes, taskRes, elemRes] = await Promise.all([
        fetch(`${API_URL}/filters/teams`),
        fetch(`${API_URL}/filters/employees?${qs}`),
        fetch(`${API_URL}/project-view/filter/project-names${sfx}`),
        fetch(`${API_URL}/project-view/filter/tasks${sfx}`),
        fetch(`${API_URL}/project-view/filter/elements${sfx}`)
      ]);

      setAllTeams(await teamsRes.json());
      setEmployeeNames(await empRes.json());
      setProjectNames(await projRes.json());
      setTaskNames(await taskRes.json());
      setElementNames(await elemRes.json());
    } catch (e) { console.error('fetchFilters', e); }
  };

  // ─── fetch horizontal bar data ───────────────────────────────
  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (selTeam !== 'All')     params.append('team', selTeam);
      if (selEmployee !== 'All') params.append('employee', selEmployee);
      if (selPeriod !== 'All')   params.append('period', selPeriod);
      if (selProject !== 'All')  params.append('project_name', selProject);
      if (selTask !== 'All')     params.append('task_name', selTask);
      if (selElement !== 'All')  params.append('book_element', selElement);

      const res = await fetch(`${API_URL}/project-view/projects?${params}`);
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    } catch (e) { console.error('fetchProjects', e); setLoading(false); }
  };

  // ─── fetch timeline for ONE project ──────────────────────────
  const fetchTimeline = async (projectName) => {
    if (!projectName) { setTimeline([]); setTimelineTasks([]); return; }
    try {
      const params = new URLSearchParams();
      params.append('project_name', projectName);
      if (selTeam !== 'All')     params.append('team', selTeam);
      if (selEmployee !== 'All') params.append('employee', selEmployee);
      if (selPeriod !== 'All')   params.append('period', selPeriod);

      const res = await fetch(`${API_URL}/project-view/timeline?${params}`);
      const { timeline: rows, tasks } = await res.json();
      setTimeline(rows);
      setTimelineTasks(tasks);
    } catch (e) { console.error('fetchTimeline', e); }
  };

  // ─── effects ─────────────────────────────────────────────────
  useEffect(() => { fetchFilters(); }, []);

  // Department → filtered teams
  useEffect(() => {
    if (selDept === 'All') { setFilteredTeams(allTeams); return; }
    const fn = DEPARTMENT_TEAM_MAPPING[selDept];
    setFilteredTeams(fn ? allTeams.filter(fn) : []);
  }, [selDept, allTeams]);

  // Any filter change → refetch projects
  useEffect(() => {
    fetchProjects();
    fetchFilters();
  }, [selTeam, selEmployee, selPeriod, selProject, selTask, selElement]);

  // When department changes reset downstream
  useEffect(() => { setSelTeam('All'); setSelEmployee('All'); }, [selDept]);
  // When team changes reset employee
  useEffect(() => { setSelEmployee('All'); }, [selTeam]);

  // Timeline follows selectedProject
  useEffect(() => { fetchTimeline(selectedProject); }, [selectedProject, selTeam, selEmployee, selPeriod]);

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
    setSelDept('All'); setSelTeam('All'); setSelEmployee('All');
    setSelProject('All'); setSelElement('All'); setSelTask('All');
    setSelPeriod('All'); setProjectSearch('');
    setSelectedProject(null);
  };

  // ─── derived: filtered project names for the search dropdown ─
  const filteredProjNames = useMemo(() => {
    if (!projectSearch.trim()) return projectNames;
    return projectNames.filter(n => n.toLowerCase().includes(projectSearch.toLowerCase()));
  }, [projectSearch, projectNames]);

  // ─── HORIZONTAL BAR CHART (custom SVG) ──────────────────────
  // Each project = one row.  Each row is segmented by task, widths proportional to hours.
  // Largest segment shows its task label if wide enough.
  const BAR_HEIGHT = 28;
  const ROW_GAP = 8;
  const LABEL_COL_WIDTH = 260; // px reserved for project names on the left
  const BAR_AREA_WIDTH = 900;  // px for the actual bars (will scale with container)

  const maxTotalHours = useMemo(() => Math.max(...projects.map(p => p.totalHours), 1), [projects]);

  // Hover state for bar tooltip
  const [barTooltip, setBarTooltip] = useState(null); // { x, y, task, hours, units }

  const renderBars = () => {
    return projects.map((project, pIdx) => {
      const y = pIdx * (BAR_HEIGHT + ROW_GAP);
      const barWidth = (project.totalHours / maxTotalHours) * BAR_AREA_WIDTH;
      let xOffset = 0;

      const segments = project.tasks.map((t, tIdx) => {
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
                setBarTooltip({ x: mouseX, y: mouseY, task: t.task, hours: t.hours, units: t.units, projectName: project.name });
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

      // Determine if this project name should be bold (it's the selected timeline project)
      const isSelected = project.name === selectedProject;

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
            onClick={() => setSelectedProject(isSelected ? null : project.name)}
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
  const svgHeight = projects.length * (BAR_HEIGHT + ROW_GAP) + 4;

  // ─── legend: all tasks present in current projects data ──────
  const legendTasks = useMemo(() => {
    const set = new Set();
    projects.forEach(p => p.tasks.forEach(t => set.add(t.task)));
    return [...set];
  }, [projects]);

  // ─── timeline colour map (uses same global map) ─────────────
  const timelineColorMap = useMemo(() => {
    const map = {};
    timelineTasks.forEach(t => { map[t] = globalTaskColorMap[t] || TASK_COLORS[legendTasks.indexOf(t) % TASK_COLORS.length]; });
    return map;
  }, [timelineTasks, globalTaskColorMap, legendTasks]);

  // ─── render ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-white text-xl">Loading Project View…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* ─── STICKY HEADER + FILTERS ─── */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="px-8 pt-6 pb-4">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Work Tracker Analytics - Project View
          </h1>
          <p className="text-gray-300">Project-wise task breakdown & timeline</p>
        </div>

        {/* filters grid: row1 = Dept | ProjectCategory(search) | Employee | Element
                          row2 = Team | ProjectName            | Period   | Task   + CLEAR ALL */}
        <div className="px-8 pb-6">
          <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Filter className="mr-2 text-purple-400" /> Filters
              </h2>
              <button onClick={clearAll} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold">
                <X className="w-4 h-4 mr-2" /> CLEAR ALL
              </button>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {/* Department */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Department</label>
                <select value={selDept} onChange={e => setSelDept(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Project Category (search) */}
              <div className="relative" ref={projDropRef}>
                <label className="text-white text-sm font-semibold mb-2 block">Project Category</label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectSearch}
                    placeholder="Search…"
                    onChange={e => { setProjectSearch(e.target.value); setShowProjDrop(true); }}
                    onFocus={() => setShowProjDrop(true)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                {showProjDrop && (
                  <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    <div onClick={() => { setSelProject('All'); setProjectSearch(''); setShowProjDrop(false); }}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white">All</div>
                    {filteredProjNames.map(n => (
                      <div key={n} onClick={() => { setSelProject(n); setProjectSearch(n); setShowProjDrop(false); }}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white truncate">{n}</div>
                    ))}
                    {filteredProjNames.length === 0 && <div className="px-4 py-2 text-gray-400">No match</div>}
                  </div>
                )}
              </div>

              {/* Employee Name */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
                <select value={selEmployee} onChange={e => setSelEmployee(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selTeam === 'All'}>
                  <option value="All">All</option>
                  {employeeNames.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              {/* Project Element */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Project Element</label>
                <select value={selElement} onChange={e => setSelElement(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All</option>
                  {elementNames.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Team Name */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
                <select value={selTeam} onChange={e => setSelTeam(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selDept === 'All'}>
                  <option value="All">All</option>
                  {filteredTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Project Name dropdown */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Project Name</label>
                <select value={selProject} onChange={e => setSelProject(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All</option>
                  {projectNames.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Period</label>
                <select value={selPeriod} onChange={e => setSelPeriod(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Last Year">Last Year</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>

              {/* Task */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Task</label>
                <select value={selTask} onChange={e => setSelTask(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="All">All</option>
                  {taskNames.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE BODY ─── */}
      <div className="px-8 py-6">

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
          <div className="overflow-x-auto" style={{ position: 'relative' }}>
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
                minWidth: 180
              }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{barTooltip.task}</p>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div>
                    <p style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{barTooltip.units?.toLocaleString() || 0}</p>
                    <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Units</p>
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{barTooltip.hours?.toFixed(2)}</p>
                    <p style={{ color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>Hours</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* horizontal scroll handle hint */}
          <div className="flex justify-between px-2 py-1">
            <span className="text-gray-500 text-xs">← scroll →</span>
          </div>
        </div>

        {/* ── PROJECT TIMELINE (area chart — shown when a project name is clicked) ── */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-xl p-6">
          <h2 className="text-3xl font-bold text-white text-center mb-1">Project Timeline</h2>

          {selectedProject ? (
            <>
              {/* legend: single dot + project name */}
              <p className="text-center text-gray-300 text-sm mb-3">
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981', marginRight: 6 }} />
                {selectedProject}
              </p>

              {timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                    <defs>
                      {timelineTasks.map((t, i) => (
                        <linearGradient key={t} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={timelineColorMap[t]} stopOpacity={0.7} />
                          <stop offset="95%" stopColor={timelineColorMap[t]} stopOpacity={0.15} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} angle={-35} textAnchor="end" height={55} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<TimelineTooltip taskColorMap={timelineColorMap} />}
                      contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: 8 }}
                      wrapperStyle={{ zIndex: 10001, outline: 'none' }} />
                    {timelineTasks.map((t, i) => (
                      <Area key={t} type="monotone" dataKey={t} stackId="1"
                        stroke={timelineColorMap[t]} fill={`url(#grad_${i})`}
                        name={t} isAnimationActive={false} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-20">No timeline data available for this project.</p>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-20 text-sm">
              👆 Click a project name in the chart above to load its timeline.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualization2;