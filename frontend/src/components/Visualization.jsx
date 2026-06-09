// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';
// const REFRESH_INTERVAL = 60000;

// const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         {label && <p className="text-white font-semibold mb-2">{label}</p>}
//         {payload.map((entry, index) => {
//           const entryName = entry.name || entry.dataKey || '';
//           const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
          
//           return (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {entryName}: <span className="font-bold">{displayValue}</span>
//               {entryName.toLowerCase().includes('hours') && ' hrs'}
//               {entryName.toLowerCase().includes('units') && ' units'}
//             </p>
//           );
//         })}
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
//     <div className="flex items-center justify-between mb-2">
//       <Icon className="w-10 h-10 text-white opacity-80" />
//       <span className="text-3xl font-bold text-white">{value}</span>
//     </div>
//     <h3 className="text-white text-lg font-semibold">{title}</h3>
//     {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [overview, setOverview] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [workMode, setWorkMode] = useState([]);
//   const [elements, setElements] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [auditStatus, setAuditStatus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Filter states
//   const [departments, setDepartments] = useState(['All']);
//   const [teamNames, setTeamNames] = useState(['All']);
//   const [employeeNames, setEmployeeNames] = useState(['All']);
//   const [projectNames, setProjectNames] = useState(['All']);
//   const [taskNames, setTaskNames] = useState(['All']);
  
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedEmployee, setSelectedEmployee] = useState('All');
//   const [selectedProject, setSelectedProject] = useState('All');
//   const [selectedTask, setSelectedTask] = useState('All');
//   const [selectedPeriod, setSelectedPeriod] = useState('All');

//   const fetchFilterOptions = async () => {
//     try {
//       const [deptRes, teamRes, empRes, projRes, taskRes] = await Promise.all([
//         fetch(`${API_URL}/filters/departments`).catch(() => ({ json: async () => [] })),
//         fetch(`${API_URL}/filters/teams`).catch(() => ({ json: async () => [] })),
//         fetch(`${API_URL}/filters/employees`).catch(() => ({ json: async () => [] })),
//         fetch(`${API_URL}/filters/projects`).catch(() => ({ json: async () => [] })),
//         fetch(`${API_URL}/filters/tasks`).catch(() => ({ json: async () => [] })),
//       ]);

//       const [depts, teams, emps, projs, tasks] = await Promise.all([
//         deptRes.json(),
//         teamRes.json(),
//         empRes.json(),
//         projRes.json(),
//         taskRes.json(),
//       ]);

//       setDepartments(['All', ...depts]);
//       setTeamNames(['All', ...teams]);
//       setEmployeeNames(['All', ...emps]);
//       setProjectNames(['All', ...projs]);
//       setTaskNames(['All', ...tasks]);
//     } catch (error) {
//       console.error('Error fetching filter options:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedDepartment !== 'All') params.append('department', selectedDepartment);
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
//     if (selectedProject !== 'All') params.append('project', selectedProject);
//     if (selectedTask !== 'All') params.append('task', selectedTask);
//     if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         overviewRes, projectsRes, employeesRes, teamsRes, 
//         timelineRes, workModeRes, elementsRes, tasksRes, 
//         statusRes, auditRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/overview${urlSuffix}`),
//         fetch(`${API_URL}/projects${urlSuffix}`),
//         fetch(`${API_URL}/employees${urlSuffix}`),
//         fetch(`${API_URL}/teams${urlSuffix}`),
//         fetch(`${API_URL}/timeline${urlSuffix}`),
//         fetch(`${API_URL}/workmode${urlSuffix}`),
//         fetch(`${API_URL}/elements${urlSuffix}`),
//         fetch(`${API_URL}/tasks${urlSuffix}`),
//         fetch(`${API_URL}/status${urlSuffix}`),
//         fetch(`${API_URL}/audit-status${urlSuffix}`),
//       ]);

//       setOverview(await overviewRes.json());
//       setProjects(await projectsRes.json());
//       setEmployees(await employeesRes.json());
//       setTeams(await teamsRes.json());
//       setTimeline(await timelineRes.json());
//       setWorkMode(await workModeRes.json());
//       setElements(await elementsRes.json());
//       setTasks(await tasksRes.json());
//       setStatuses(await statusRes.json());
//       setAuditStatus(await auditRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFilterOptions();
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedDepartment, selectedTeam, selectedEmployee, selectedProject, selectedTask, selectedPeriod]);

//   const clearAllFilters = () => {
//     setSelectedDepartment('All');
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setSelectedProject('All');
//     setSelectedTask('All');
//     setSelectedPeriod('All');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         {/* Header */}
//         <div className="px-8 pt-6 pb-4">
//           <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Work Tracker Analytics
//           </h1>
//           <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" /> Filters
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//               {/* Department Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={(e) => setSelectedDepartment(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Team Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={(e) => setSelectedTeam(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {teamNames.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Employee Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
//                 <select
//                   value={selectedEmployee}
//                   onChange={(e) => setSelectedEmployee(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {employeeNames.map(emp => (
//                     <option key={emp} value={emp}>{emp}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Project Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Project Name</label>
//                 <select
//                   value={selectedProject}
//                   onChange={(e) => setSelectedProject(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {projectNames.map(proj => (
//                     <option key={proj} value={proj}>{proj}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Task Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Task</label>
//                 <select
//                   value={selectedTask}
//                   onChange={(e) => setSelectedTask(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {taskNames.map(task => (
//                     <option key={task} value={task}>{task}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Period Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div className="px-8 py-6 overflow-y-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Briefcase}
//             title="Total Projects"
//             value={overview?.totalProjects || 0}
//             color="from-purple-500 to-purple-700"
//           />
//           <StatCard
//             icon={Users}
//             title="Active Employees"
//             value={overview?.totalEmployees || 0}
//             color="from-pink-500 to-pink-700"
//           />
//           <StatCard
//             icon={Clock}
//             title="Total Hours"
//             value={Math.round(overview?.totalHours || 0)}
//             subtitle="Work logged"
//             color="from-blue-500 to-blue-700"
//           />
//           <StatCard
//             icon={Target}
//             title="Total Tasks"
//             value={overview?.totalTasks || 0}
//             color="from-green-500 to-green-700"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Projects by Hours */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={projects.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={120} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {projects.slice(0, 10).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Performers */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-pink-400" /> Top Performers
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={employees.slice(0, 10)} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis type="number" stroke="#9ca3af" />
//                 <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} fontSize={12} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#ec4899" radius={[0, 8, 8, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Activity Timeline */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <TrendingUp className="mr-2 text-blue-400" /> Work Activity Timeline (Last 30 Days)
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeline}>
//                 <defs>
//                   <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHours)" />
//                 <Line type="monotone" dataKey="tasks" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Mode Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Zap className="mr-2 text-yellow-400" /> Work Mode Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={workMode}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="mode"
//                 >
//                   {workMode.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Book Elements */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Activity className="mr-2 text-green-400" /> Book Elements
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={elements.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="element" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Types Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Target className="mr-2 text-orange-400" /> Task Types
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tasks.slice(0, 8)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="task"
//                 >
//                   {tasks.slice(0, 8).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-cyan-400" /> Task Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={statuses}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
//                   {statuses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Contributions */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-cyan-400" /> Team Contributions
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={teams}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
//                 <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Audit Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-purple-400" /> Audit Status Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={auditStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {auditStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-sm">Auto-refreshing every minute</span>
//       </div>
//     </div>
//   );
// };

// export default Visualization;








// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';
// const REFRESH_INTERVAL = 60000;

// const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

// // Department to Team mapping (handled on frontend)
// const DEPARTMENT_TEAM_MAPPING = {
//   'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
//   'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA'),
//   'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         {label && <p className="text-white font-semibold mb-2">{label}</p>}
//         {payload.map((entry, index) => {
//           const entryName = entry.name || entry.dataKey || '';
//           const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
          
//           return (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {entryName}: <span className="font-bold">{displayValue}</span>
//               {entryName.toLowerCase().includes('hours') && ' hrs'}
//               {entryName.toLowerCase().includes('units') && ' units'}
//             </p>
//           );
//         })}
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
//     <div className="flex items-center justify-between mb-2">
//       <Icon className="w-10 h-10 text-white opacity-80" />
//       <span className="text-3xl font-bold text-white">{value}</span>
//     </div>
//     <h3 className="text-white text-lg font-semibold">{title}</h3>
//     {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [overview, setOverview] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [workMode, setWorkMode] = useState([]);
//   const [elements, setElements] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [auditStatus, setAuditStatus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Filter states
//   const [allTeamsFromDB, setAllTeamsFromDB] = useState([]); // All teams from database
//   const [filteredTeams, setFilteredTeams] = useState([]); // Teams filtered by department
//   const [employeeNames, setEmployeeNames] = useState(['All']);
//   const [projectNames, setProjectNames] = useState(['All']);
//   const [taskNames, setTaskNames] = useState(['All']);
  
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedEmployee, setSelectedEmployee] = useState('All');
//   const [selectedProject, setSelectedProject] = useState('All');
//   const [selectedTask, setSelectedTask] = useState('All');
//   const [selectedPeriod, setSelectedPeriod] = useState('All');
  
//   // Employee search state
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);

//   // Hardcoded departments (frontend only)
//   const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

//   // Fetch all teams from database
//   const fetchAllTeams = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/teams`);
//       const teams = await res.json();
//       setAllTeamsFromDB(teams);
//     } catch (error) {
//       console.error('Error fetching teams:', error);
//     }
//   };

//   // Filter teams based on selected department (frontend logic)
//   const filterTeamsByDepartment = (department) => {
//     if (department === 'All') {
//       setFilteredTeams(allTeamsFromDB);
//     } else {
//       const filterFn = DEPARTMENT_TEAM_MAPPING[department];
//       if (filterFn) {
//         const filtered = allTeamsFromDB.filter(filterFn);
//         setFilteredTeams(filtered);
//       } else {
//         setFilteredTeams([]);
//       }
//     }
//   };

//   const fetchEmployees = async (team, search = '') => {
//     try {
//       const params = new URLSearchParams();
//       if (team && team !== 'All') {
//         params.append('team', team);
//       }
//       if (search && search.trim() !== '') {
//         params.append('search', search);
//       }
      
//       const res = await fetch(`${API_URL}/filters/employees?${params.toString()}`);
//       const emps = await res.json();
//       setEmployeeNames(['All', ...emps]);
//       setFilteredEmployees(emps);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchProjects = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/projects`);
//       const projs = await res.json();
//       setProjectNames(['All', ...projs]);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   const fetchTaskNames = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/tasks`);
//       const tasks = await res.json();
//       setTaskNames(['All', ...tasks]);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
//     if (selectedProject !== 'All') params.append('project', selectedProject);
//     if (selectedTask !== 'All') params.append('task', selectedTask);
//     if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         overviewRes, projectsRes, employeesRes, teamsRes, 
//         timelineRes, workModeRes, elementsRes, tasksRes, 
//         statusRes, auditRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/overview${urlSuffix}`),
//         fetch(`${API_URL}/projects${urlSuffix}`),
//         fetch(`${API_URL}/employees${urlSuffix}`),
//         fetch(`${API_URL}/teams${urlSuffix}`),
//         fetch(`${API_URL}/timeline${urlSuffix}`),
//         fetch(`${API_URL}/workmode${urlSuffix}`),
//         fetch(`${API_URL}/elements${urlSuffix}`),
//         fetch(`${API_URL}/tasks${urlSuffix}`),
//         fetch(`${API_URL}/status${urlSuffix}`),
//         fetch(`${API_URL}/audit-status${urlSuffix}`),
//       ]);

//       setOverview(await overviewRes.json());
//       setProjects(await projectsRes.json());
//       setEmployees(await employeesRes.json());
//       setTeams(await teamsRes.json());
//       setTimeline(await timelineRes.json());
//       setWorkMode(await workModeRes.json());
//       setElements(await elementsRes.json());
//       setTasks(await tasksRes.json());
//       setStatuses(await statusRes.json());
//       setAuditStatus(await auditRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchAllTeams();
//     fetchProjects();
//     fetchTaskNames();
//   }, []);

//   // Filter teams when department changes
//   useEffect(() => {
//     if (allTeamsFromDB.length > 0) {
//       filterTeamsByDepartment(selectedDepartment);
//     }
//   }, [selectedDepartment, allTeamsFromDB]);

//   // Load employees when team changes
//   useEffect(() => {
//     if (selectedTeam !== 'All') {
//       fetchEmployees(selectedTeam);
//     } else {
//       setEmployeeNames(['All']);
//       setFilteredEmployees([]);
//     }
//   }, [selectedTeam]);

//   // Handle employee search
//   useEffect(() => {
//     if (employeeSearch.trim() === '') {
//       setFilteredEmployees(employeeNames.filter(e => e !== 'All'));
//     } else {
//       const filtered = employeeNames.filter(emp => 
//         emp !== 'All' && emp.toLowerCase().includes(employeeSearch.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [employeeSearch, employeeNames]);

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedTeam, selectedEmployee, selectedProject, selectedTask, selectedPeriod]);

//   const clearAllFilters = () => {
//     setSelectedDepartment('All');
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setSelectedProject('All');
//     setSelectedTask('All');
//     setSelectedPeriod('All');
//     setEmployeeSearch('');
//   };

//   const handleDepartmentChange = (e) => {
//     const newDepartment = e.target.value;
//     setSelectedDepartment(newDepartment);
//     // Reset team and employee when department changes
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleTeamChange = (e) => {
//     const newTeam = e.target.value;
//     setSelectedTeam(newTeam);
//     // Reset employee when team changes
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleEmployeeSelect = (empName) => {
//     setSelectedEmployee(empName);
//     setEmployeeSearch(empName === 'All' ? '' : empName);
//     setShowEmployeeDropdown(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         {/* Header */}
//         <div className="px-8 pt-6 pb-4">
//           <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Work Tracker Analytics
//           </h1>
//           <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" /> Filters
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//               {/* Department Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={handleDepartmentChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Team Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={handleTeamChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selectedDepartment === 'All'}
//                 >
//                   <option value="All">All</option>
//                   {filteredTeams.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Employee Name Filter with Search */}
//               <div className="relative">
//                 <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={employeeSearch}
//                     onChange={(e) => {
//                       setEmployeeSearch(e.target.value);
//                       setShowEmployeeDropdown(true);
//                     }}
//                     onFocus={() => setShowEmployeeDropdown(true)}
//                     placeholder="Search employee..."
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={selectedTeam === 'All'}
//                   />
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 </div>
                
//                 {/* Dropdown */}
//                 {showEmployeeDropdown && selectedTeam !== 'All' && (
//                   <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//                     <div
//                       onClick={() => handleEmployeeSelect('All')}
//                       className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                     >
//                       All
//                     </div>
//                     {filteredEmployees.map(emp => (
//                       <div
//                         key={emp}
//                         onClick={() => handleEmployeeSelect(emp)}
//                         className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                       >
//                         {emp}
//                       </div>
//                     ))}
//                     {filteredEmployees.length === 0 && (
//                       <div className="px-4 py-2 text-gray-400">No employees found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Project Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Project Name</label>
//                 <select
//                   value={selectedProject}
//                   onChange={(e) => setSelectedProject(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {projectNames.map(proj => (
//                     <option key={proj} value={proj}>{proj}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Task Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Task</label>
//                 <select
//                   value={selectedTask}
//                   onChange={(e) => setSelectedTask(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {taskNames.map(task => (
//                     <option key={task} value={task}>{task}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Period Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close dropdown */}
//       {showEmployeeDropdown && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setShowEmployeeDropdown(false)}
//         />
//       )}

//       {/* Scrollable Content */}
//       <div className="px-8 py-6 overflow-y-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Briefcase}
//             title="Total Projects"
//             value={overview?.totalProjects || 0}
//             color="from-purple-500 to-purple-700"
//           />
//           <StatCard
//             icon={Users}
//             title="Active Employees"
//             value={overview?.totalEmployees || 0}
//             color="from-pink-500 to-pink-700"
//           />
//           <StatCard
//             icon={Clock}
//             title="Total Hours"
//             value={Math.round(overview?.totalHours || 0)}
//             subtitle="Work logged"
//             color="from-blue-500 to-blue-700"
//           />
//           <StatCard
//             icon={Target}
//             title="Total Tasks"
//             value={overview?.totalTasks || 0}
//             color="from-green-500 to-green-700"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Projects by Hours */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={projects.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={120} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {projects.slice(0, 10).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Performers */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-pink-400" /> Top Performers
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={employees.slice(0, 10)} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis type="number" stroke="#9ca3af" />
//                 <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} fontSize={12} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#ec4899" radius={[0, 8, 8, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Activity Timeline */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <TrendingUp className="mr-2 text-blue-400" /> Work Activity Timeline (Last 30 Days)
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeline}>
//                 <defs>
//                   <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorHours)" />
//                 <Line type="monotone" dataKey="tasks" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Mode Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Zap className="mr-2 text-yellow-400" /> Work Mode Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={workMode}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="mode"
//                 >
//                   {workMode.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Book Elements */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Activity className="mr-2 text-green-400" /> Book Elements
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={elements.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="element" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Types Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Target className="mr-2 text-orange-400" /> Task Types
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tasks.slice(0, 8)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="task"
//                 >
//                   {tasks.slice(0, 8).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-cyan-400" /> Task Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={statuses}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
//                   {statuses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Contributions */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-cyan-400" /> Team Contributions
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={teams}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
//                 <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Audit Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-purple-400" /> Audit Status Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={auditStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {auditStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-sm">Auto-refreshing every minute</span>
//       </div>
//     </div>
//   );
// };

// export default Visualization;


// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';
// const REFRESH_INTERVAL = 60000;

// const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

// // Department to Team mapping (handled on frontend)
// const DEPARTMENT_TEAM_MAPPING = {
//   'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
//   'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA'),
//   'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         {label && <p className="text-white font-semibold mb-2">{label}</p>}
//         {payload.map((entry, index) => {
//           const entryName = entry.name || entry.dataKey || '';
//           const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
          
//           return (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {entryName}: <span className="font-bold">{displayValue}</span>
//               {entryName.toLowerCase().includes('hours') && ' hrs'}
//               {entryName.toLowerCase().includes('units') && ' units'}
//             </p>
//           );
//         })}
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Project Pie Chart showing book elements
// const ProjectPieTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl max-w-xs">
//         <p className="text-white font-semibold mb-2">{data.name}</p>
//         <p className="text-purple-400 text-sm mb-2">
//           Total: <span className="font-bold">{data.hours?.toFixed(2)} hrs</span>
//         </p>
//         {data.elements && data.elements.length > 0 && (
//           <div className="mt-2 border-t border-gray-700 pt-2">
//             <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
//             {data.elements.map((elem, idx) => (
//               <p key={idx} className="text-gray-400 text-xs">
//                 • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Work Mode by Days
// const WorkModeTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         <p className="text-white font-semibold mb-2">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }} className="text-sm">
//             {entry.name}: <span className="font-bold">{entry.value?.toFixed(2)} hrs</span>
//           </p>
//         ))}
//         <p className="text-gray-400 text-xs mt-2">
//           Total: <span className="font-bold text-white">
//             {payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(2)} hrs
//           </span>
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
//     <div className="flex items-center justify-between mb-2">
//       <Icon className="w-10 h-10 text-white opacity-80" />
//       <span className="text-3xl font-bold text-white">{value}</span>
//     </div>
//     <h3 className="text-white text-lg font-semibold">{title}</h3>
//     {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [overview, setOverview] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [workMode, setWorkMode] = useState([]);
//   const [workModeByDays, setWorkModeByDays] = useState([]);
//   const [elements, setElements] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [auditStatus, setAuditStatus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Filter states
//   const [allTeamsFromDB, setAllTeamsFromDB] = useState([]); // All teams from database
//   const [filteredTeams, setFilteredTeams] = useState([]); // Teams filtered by department
//   const [employeeNames, setEmployeeNames] = useState(['All']);
  
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedEmployee, setSelectedEmployee] = useState('All');
//   const [selectedPeriod, setSelectedPeriod] = useState('All');
  
//   // Employee search state
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);

//   // Hardcoded departments (frontend only)
//   const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

//   // Fetch all teams from database
//   const fetchAllTeams = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/teams`);
//       const teams = await res.json();
//       setAllTeamsFromDB(teams);
//     } catch (error) {
//       console.error('Error fetching teams:', error);
//     }
//   };

//   // Filter teams based on selected department (frontend logic)
//   const filterTeamsByDepartment = (department) => {
//     if (department === 'All') {
//       setFilteredTeams(allTeamsFromDB);
//     } else {
//       const filterFn = DEPARTMENT_TEAM_MAPPING[department];
//       if (filterFn) {
//         const filtered = allTeamsFromDB.filter(filterFn);
//         setFilteredTeams(filtered);
//       } else {
//         setFilteredTeams([]);
//       }
//     }
//   };

//   const fetchEmployees = async (team, search = '') => {
//     try {
//       const params = new URLSearchParams();
//       if (team && team !== 'All') {
//         params.append('team', team);
//       }
//       if (search && search.trim() !== '') {
//         params.append('search', search);
//       }
      
//       const res = await fetch(`${API_URL}/filters/employees?${params.toString()}`);
//       const emps = await res.json();
//       setEmployeeNames(['All', ...emps]);
//       setFilteredEmployees(emps);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
//     if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         overviewRes, projectsRes, employeesRes, teamsRes, 
//         timelineRes, workModeRes, workModeByDaysRes, elementsRes, tasksRes, 
//         statusRes, auditRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/overview${urlSuffix}`),
//         fetch(`${API_URL}/projects${urlSuffix}`),
//         fetch(`${API_URL}/employees${urlSuffix}`),
//         fetch(`${API_URL}/teams${urlSuffix}`),
//         fetch(`${API_URL}/timeline${urlSuffix}`),
//         fetch(`${API_URL}/workmode${urlSuffix}`),
//         fetch(`${API_URL}/workmode-by-days${urlSuffix}`),
//         fetch(`${API_URL}/elements${urlSuffix}`),
//         fetch(`${API_URL}/tasks${urlSuffix}`),
//         fetch(`${API_URL}/status${urlSuffix}`),
//         fetch(`${API_URL}/audit-status${urlSuffix}`),
//       ]);

//       setOverview(await overviewRes.json());
//       setProjects(await projectsRes.json());
//       setEmployees(await employeesRes.json());
//       setTeams(await teamsRes.json());
//       setTimeline(await timelineRes.json());
//       setWorkMode(await workModeRes.json());
//       setWorkModeByDays(await workModeByDaysRes.json());
//       setElements(await elementsRes.json());
//       setTasks(await tasksRes.json());
//       setStatuses(await statusRes.json());
//       setAuditStatus(await auditRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchAllTeams();
//   }, []);

//   // Filter teams when department changes
//   useEffect(() => {
//     if (allTeamsFromDB.length > 0) {
//       filterTeamsByDepartment(selectedDepartment);
//     }
//   }, [selectedDepartment, allTeamsFromDB]);

//   // Load employees when team changes
//   useEffect(() => {
//     if (selectedTeam !== 'All') {
//       fetchEmployees(selectedTeam);
//     } else {
//       setEmployeeNames(['All']);
//       setFilteredEmployees([]);
//     }
//   }, [selectedTeam]);

//   // Handle employee search
//   useEffect(() => {
//     if (employeeSearch.trim() === '') {
//       setFilteredEmployees(employeeNames.filter(e => e !== 'All'));
//     } else {
//       const filtered = employeeNames.filter(emp => 
//         emp !== 'All' && emp.toLowerCase().includes(employeeSearch.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [employeeSearch, employeeNames]);

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedTeam, selectedEmployee, selectedPeriod]);

//   const clearAllFilters = () => {
//     setSelectedDepartment('All');
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setSelectedPeriod('All');
//     setEmployeeSearch('');
//   };

//   const handleDepartmentChange = (e) => {
//     const newDepartment = e.target.value;
//     setSelectedDepartment(newDepartment);
//     // Reset team and employee when department changes
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleTeamChange = (e) => {
//     const newTeam = e.target.value;
//     setSelectedTeam(newTeam);
//     // Reset employee when team changes
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleEmployeeSelect = (empName) => {
//     setSelectedEmployee(empName);
//     setEmployeeSearch(empName === 'All' ? '' : empName);
//     setShowEmployeeDropdown(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         {/* Header */}
//         <div className="px-8 pt-6 pb-4">
//           <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Work Tracker Analytics
//           </h1>
//           <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" /> Filters
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Department Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={handleDepartmentChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Team Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={handleTeamChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selectedDepartment === 'All'}
//                 >
//                   <option value="All">All</option>
//                   {filteredTeams.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Employee Name Filter with Search */}
//               <div className="relative">
//                 <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={employeeSearch}
//                     onChange={(e) => {
//                       setEmployeeSearch(e.target.value);
//                       setShowEmployeeDropdown(true);
//                     }}
//                     onFocus={() => setShowEmployeeDropdown(true)}
//                     placeholder="Search employee..."
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={selectedTeam === 'All'}
//                   />
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 </div>
                
//                 {/* Dropdown */}
//                 {showEmployeeDropdown && selectedTeam !== 'All' && (
//                   <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//                     <div
//                       onClick={() => handleEmployeeSelect('All')}
//                       className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                     >
//                       All
//                     </div>
//                     {filteredEmployees.map(emp => (
//                       <div
//                         key={emp}
//                         onClick={() => handleEmployeeSelect(emp)}
//                         className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                       >
//                         {emp}
//                       </div>
//                     ))}
//                     {filteredEmployees.length === 0 && (
//                       <div className="px-4 py-2 text-gray-400">No employees found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Period Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close dropdown */}
//       {showEmployeeDropdown && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setShowEmployeeDropdown(false)}
//         />
//       )}

//       {/* Scrollable Content */}
//       <div className="px-8 py-6 overflow-y-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Briefcase}
//             title="Total Projects"
//             value={overview?.totalProjects || 0}
//             color="from-purple-500 to-purple-700"
//           />
//           <StatCard
//             icon={Users}
//             title="Active Employees"
//             value={overview?.totalEmployees || 0}
//             color="from-pink-500 to-pink-700"
//           />
//           <StatCard
//             icon={Clock}
//             title="Total Hours"
//             value={Math.round(overview?.totalHours || 0)}
//             subtitle="Work logged"
//             color="from-blue-500 to-blue-700"
//           />
//           <StatCard
//             icon={Target}
//             title="Total Tasks"
//             value={overview?.totalTasks || 0}
//             color="from-green-500 to-green-700"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Projects by Hours with Book Elements in Tooltip */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={projects.slice(0, 10)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="name"
//                   label={(entry) => entry.name}
//                 >
//                   {projects.slice(0, 10).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<ProjectPieTooltip />} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Mode by Days - Replaces Top Performers */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Clock className="mr-2 text-pink-400" /> Work Mode by Days
//             </h2>
//             <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
//               <ResponsiveContainer width="100%" height={Math.max(300, workModeByDays.length * 40)}>
//                 <BarChart data={workModeByDays} layout="horizontal">
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis type="number" stroke="#9ca3af" />
//                   <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} fontSize={12} />
//                   <Tooltip content={<WorkModeTooltip />} />
//                   <Legend />
//                   <Bar dataKey="WFH" stackId="a" fill="#8b5cf6" name="WFH" />
//                   <Bar dataKey="OT Office" stackId="a" fill="#ec4899" name="OT Office" />
//                   <Bar dataKey="OT Home" stackId="a" fill="#f59e0b" name="OT Home" />
//                   <Bar dataKey="On Duty" stackId="a" fill="#10b981" name="On Duty" />
//                   <Bar dataKey="Night" stackId="a" fill="#ef4444" name="Night" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Work Activity Timeline - Project-based timeline */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <TrendingUp className="mr-2 text-blue-400" /> Project Activity Timeline
//             </h2>
//             <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
//               <ResponsiveContainer width="100%" height={Math.max(400, timeline.length * 50)}>
//                 <BarChart data={timeline} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis type="number" stroke="#9ca3af" />
//                   <YAxis dataKey="project" type="category" stroke="#9ca3af" width={200} fontSize={12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="hours" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Work Mode Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Zap className="mr-2 text-yellow-400" /> Work Mode Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={workMode}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="mode"
//                 >
//                   {workMode.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Book Elements */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Activity className="mr-2 text-green-400" /> Book Elements
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={elements.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="element" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Types Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Target className="mr-2 text-orange-400" /> Task Types
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tasks.slice(0, 8)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="task"
//                 >
//                   {tasks.slice(0, 8).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-cyan-400" /> Task Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={statuses}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
//                   {statuses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Contributions */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-cyan-400" /> Team Contributions
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={teams}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
//                 <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Audit Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-purple-400" /> Audit Status Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={auditStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {auditStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-sm">Auto-refreshing every minute</span>
//       </div>
//     </div>
//   );
// };

// export default Visualization;



// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';
// const REFRESH_INTERVAL = 60000;

// const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

// // Department to Team mapping (handled on frontend)
// const DEPARTMENT_TEAM_MAPPING = {
//   'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
//   'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA'),
//   'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
    
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl max-w-sm">
//         {label && <p className="text-white font-semibold mb-2">{label}</p>}
//         {payload.map((entry, index) => {
//           const entryName = entry.name || entry.dataKey || '';
//           const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
          
//           return (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {entryName}: <span className="font-bold">{displayValue}</span>
//               {entryName.toLowerCase().includes('hours') && ' hrs'}
//               {entryName.toLowerCase().includes('units') && ' units'}
//             </p>
//           );
//         })}
        
//         {/* Show book elements if available in the data */}
//         {data && data.elements && data.elements.length > 0 && (
//           <div className="mt-3 pt-3 border-t border-gray-700">
//             <p className="text-gray-300 text-xs font-semibold mb-2">Book Elements:</p>
//             <div className="space-y-1 max-h-32 overflow-y-auto">
//               {data.elements.slice(0, 5).map((elem, idx) => (
//                 <p key={idx} className="text-gray-400 text-xs">
//                   • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//                 </p>
//               ))}
//               {data.elements.length > 5 && (
//                 <p className="text-gray-500 text-xs italic">+ {data.elements.length - 5} more...</p>
//               )}
//             </div>
//           </div>
//         )}
        
//         {data && data.tasks && (
//           <p className="text-gray-400 text-xs mt-2">
//             Total Tasks: <span className="text-white font-semibold">{data.tasks}</span>
//           </p>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Project Pie Chart showing book elements
// const ProjectPieTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl max-w-xs">
//         <p className="text-white font-semibold mb-2">{data.name}</p>
//         <p className="text-purple-400 text-sm mb-2">
//           Total: <span className="font-bold">{data.hours?.toFixed(2)} hrs</span>
//         </p>
//         {data.elements && data.elements.length > 0 && (
//           <div className="mt-2 border-t border-gray-700 pt-2">
//             <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
//             {data.elements.map((elem, idx) => (
//               <p key={idx} className="text-gray-400 text-xs">
//                 • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Work Mode by Days
// const WorkModeTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         <p className="text-white font-semibold mb-2">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }} className="text-sm">
//             {entry.name}: <span className="font-bold">{entry.value?.toFixed(2)} hrs</span>
//           </p>
//         ))}
//         <p className="text-gray-400 text-xs mt-2">
//           Total: <span className="font-bold text-white">
//             {payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(2)} hrs
//           </span>
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
//     <div className="flex items-center justify-between mb-2">
//       <Icon className="w-10 h-10 text-white opacity-80" />
//       <span className="text-3xl font-bold text-white">{value}</span>
//     </div>
//     <h3 className="text-white text-lg font-semibold">{title}</h3>
//     {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [overview, setOverview] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [workMode, setWorkMode] = useState([]);
//   const [workModeByDays, setWorkModeByDays] = useState([]);
//   const [elements, setElements] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [auditStatus, setAuditStatus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
  
//   // Modal states for project details
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   // Filter states
//   const [allTeamsFromDB, setAllTeamsFromDB] = useState([]); // All teams from database
//   const [filteredTeams, setFilteredTeams] = useState([]); // Teams filtered by department
//   const [employeeNames, setEmployeeNames] = useState(['All']);
  
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedEmployee, setSelectedEmployee] = useState('All');
//   const [selectedPeriod, setSelectedPeriod] = useState('All');
  
//   // Employee search state
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);

//   // Hardcoded departments (frontend only)
//   const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

//   // Fetch all teams from database
//   const fetchAllTeams = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/teams`);
//       const teams = await res.json();
//       setAllTeamsFromDB(teams);
//     } catch (error) {
//       console.error('Error fetching teams:', error);
//     }
//   };

//   // Filter teams based on selected department (frontend logic)
//   const filterTeamsByDepartment = (department) => {
//     if (department === 'All') {
//       setFilteredTeams(allTeamsFromDB);
//     } else {
//       const filterFn = DEPARTMENT_TEAM_MAPPING[department];
//       if (filterFn) {
//         const filtered = allTeamsFromDB.filter(filterFn);
//         setFilteredTeams(filtered);
//       } else {
//         setFilteredTeams([]);
//       }
//     }
//   };

//   const fetchEmployees = async (team, search = '') => {
//     try {
//       const params = new URLSearchParams();
//       if (team && team !== 'All') {
//         params.append('team', team);
//       }
//       if (search && search.trim() !== '') {
//         params.append('search', search);
//       }
      
//       const res = await fetch(`${API_URL}/filters/employees?${params.toString()}`);
//       const emps = await res.json();
//       setEmployeeNames(['All', ...emps]);
//       setFilteredEmployees(emps);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
//     if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         overviewRes, projectsRes, employeesRes, teamsRes, 
//         timelineRes, workModeRes, workModeByDaysRes, elementsRes, tasksRes, 
//         statusRes, auditRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/overview${urlSuffix}`),
//         fetch(`${API_URL}/projects${urlSuffix}`),
//         fetch(`${API_URL}/employees${urlSuffix}`),
//         fetch(`${API_URL}/teams${urlSuffix}`),
//         fetch(`${API_URL}/timeline${urlSuffix}`),
//         fetch(`${API_URL}/workmode${urlSuffix}`),
//         fetch(`${API_URL}/workmode-by-days${urlSuffix}`),
//         fetch(`${API_URL}/elements${urlSuffix}`),
//         fetch(`${API_URL}/tasks${urlSuffix}`),
//         fetch(`${API_URL}/status${urlSuffix}`),
//         fetch(`${API_URL}/audit-status${urlSuffix}`),
//       ]);

//       setOverview(await overviewRes.json());
//       setProjects(await projectsRes.json());
//       setEmployees(await employeesRes.json());
//       setTeams(await teamsRes.json());
//       setTimeline(await timelineRes.json());
//       setWorkMode(await workModeRes.json());
//       setWorkModeByDays(await workModeByDaysRes.json());
//       setElements(await elementsRes.json());
//       setTasks(await tasksRes.json());
//       setStatuses(await statusRes.json());
//       setAuditStatus(await auditRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchAllTeams();
//   }, []);

//   // Filter teams when department changes
//   useEffect(() => {
//     if (allTeamsFromDB.length > 0) {
//       filterTeamsByDepartment(selectedDepartment);
//     }
//   }, [selectedDepartment, allTeamsFromDB]);

//   // Load employees when team changes
//   useEffect(() => {
//     if (selectedTeam !== 'All') {
//       fetchEmployees(selectedTeam);
//     } else {
//       setEmployeeNames(['All']);
//       setFilteredEmployees([]);
//     }
//   }, [selectedTeam]);

//   // Handle employee search
//   useEffect(() => {
//     if (employeeSearch.trim() === '') {
//       setFilteredEmployees(employeeNames.filter(e => e !== 'All'));
//     } else {
//       const filtered = employeeNames.filter(emp => 
//         emp !== 'All' && emp.toLowerCase().includes(employeeSearch.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [employeeSearch, employeeNames]);

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedTeam, selectedEmployee, selectedPeriod]);

//   const clearAllFilters = () => {
//     setSelectedDepartment('All');
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setSelectedPeriod('All');
//     setEmployeeSearch('');
//   };

//   const handleDepartmentChange = (e) => {
//     const newDepartment = e.target.value;
//     setSelectedDepartment(newDepartment);
//     // Reset team and employee when department changes
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleTeamChange = (e) => {
//     const newTeam = e.target.value;
//     setSelectedTeam(newTeam);
//     // Reset employee when team changes
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleEmployeeSelect = (empName) => {
//     setSelectedEmployee(empName);
//     setEmployeeSearch(empName === 'All' ? '' : empName);
//     setShowEmployeeDropdown(false);
//   };

//   const handleProjectClick = (data) => {
//     if (data && data.activePayload && data.activePayload[0]) {
//       const project = data.activePayload[0].payload;
//       setSelectedProject(project);
//       setShowProjectModal(true);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         {/* Header */}
//         <div className="px-8 pt-6 pb-4">
//           <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Work Tracker Analytics
//           </h1>
//           <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" /> Filters
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Department Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={handleDepartmentChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Team Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={handleTeamChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selectedDepartment === 'All'}
//                 >
//                   <option value="All">All</option>
//                   {filteredTeams.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Employee Name Filter with Search */}
//               <div className="relative">
//                 <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={employeeSearch}
//                     onChange={(e) => {
//                       setEmployeeSearch(e.target.value);
//                       setShowEmployeeDropdown(true);
//                     }}
//                     onFocus={() => setShowEmployeeDropdown(true)}
//                     placeholder="Search employee..."
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={selectedTeam === 'All'}
//                   />
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 </div>
                
//                 {/* Dropdown */}
//                 {showEmployeeDropdown && selectedTeam !== 'All' && (
//                   <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//                     <div
//                       onClick={() => handleEmployeeSelect('All')}
//                       className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                     >
//                       All
//                     </div>
//                     {filteredEmployees.map(emp => (
//                       <div
//                         key={emp}
//                         onClick={() => handleEmployeeSelect(emp)}
//                         className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                       >
//                         {emp}
//                       </div>
//                     ))}
//                     {filteredEmployees.length === 0 && (
//                       <div className="px-4 py-2 text-gray-400">No employees found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Period Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close dropdown */}
//       {showEmployeeDropdown && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setShowEmployeeDropdown(false)}
//         />
//       )}

//       {/* Scrollable Content */}
//       <div className="px-8 py-6 overflow-y-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Briefcase}
//             title="Total Projects"
//             value={overview?.totalProjects || 0}
//             color="from-purple-500 to-purple-700"
//           />
//           <StatCard
//             icon={Users}
//             title="Active Employees"
//             value={overview?.totalEmployees || 0}
//             color="from-pink-500 to-pink-700"
//           />
//           <StatCard
//             icon={Clock}
//             title="Total Hours"
//             value={Math.round(overview?.totalHours || 0)}
//             subtitle="Work logged"
//             color="from-blue-500 to-blue-700"
//           />
//           <StatCard
//             icon={Target}
//             title="Total Tasks"
//             value={overview?.totalTasks || 0}
//             color="from-green-500 to-green-700"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Projects by Hours with Clickable Bars */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={projects.slice(0, 10)} onClick={handleProjectClick}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={120} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
//                 <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} cursor="pointer">
//                   {projects.slice(0, 10).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//             <p className="text-gray-400 text-xs mt-2 text-center">Click on a bar to view book elements breakdown</p>
//           </div>

//           {/* Work Mode by Days - Replaces Top Performers */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Clock className="mr-2 text-pink-400" /> Work Mode by Days
//             </h2>
//             <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
//               <ResponsiveContainer width="100%" height={Math.max(300, workModeByDays.length * 40)}>
//                 <BarChart data={workModeByDays} layout="horizontal">
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis type="number" stroke="#9ca3af" />
//                   <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} fontSize={12} />
//                   <Tooltip content={<WorkModeTooltip />} />
//                   <Legend />
//                   <Bar dataKey="WFH" stackId="a" fill="#8b5cf6" name="WFH" />
//                   <Bar dataKey="OT Office" stackId="a" fill="#ec4899" name="OT Office" />
//                   <Bar dataKey="OT Home" stackId="a" fill="#f59e0b" name="OT Home" />
//                   <Bar dataKey="On Duty" stackId="a" fill="#10b981" name="On Duty" />
//                   <Bar dataKey="Night" stackId="a" fill="#ef4444" name="Night" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Work Activity Timeline - Smooth Stacked Area Chart by Projects */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <TrendingUp className="mr-2 text-blue-400" /> Project Activity Timeline
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeline}>
//                 <defs>
//                   {timeline.length > 0 && timeline[0].projects && 
//                     Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
//                       <linearGradient key={projectName} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
//                       </linearGradient>
//                     ))
//                   }
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 {timeline.length > 0 && timeline[0].projects && 
//                   Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
//                     <Area
//                       key={projectName}
//                       type="monotone"
//                       dataKey={`projects.${projectName}`}
//                       stackId="1"
//                       stroke={COLORS[idx % COLORS.length]}
//                       fill={`url(#color${idx})`}
//                       name={projectName}
//                     />
//                   ))
//                 }
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Mode Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Zap className="mr-2 text-yellow-400" /> Work Mode Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={workMode}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="mode"
//                 >
//                   {workMode.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Book Elements */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Activity className="mr-2 text-green-400" /> Book Elements
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={elements.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="element" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Types Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Target className="mr-2 text-orange-400" /> Task Types
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tasks.slice(0, 8)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="task"
//                 >
//                   {tasks.slice(0, 8).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-cyan-400" /> Task Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={statuses}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
//                   {statuses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Contributions */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-cyan-400" /> Team Contributions
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={teams}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
//                 <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Audit Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-purple-400" /> Audit Status Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={auditStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {auditStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-sm">Auto-refreshing every minute</span>
//       </div>

//       {/* Project Details Modal */}
//       {showProjectModal && selectedProject && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
//           <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
//               <button
//                 onClick={() => setShowProjectModal(false)}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <X className="w-8 h-8" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4 border border-purple-500">
//                 <p className="text-gray-300 text-sm">Total Hours</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.hours?.toFixed(2)}</p>
//               </div>
//               <div className="bg-pink-600 bg-opacity-30 rounded-lg p-4 border border-pink-500">
//                 <p className="text-gray-300 text-sm">Total Units</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.units || 0}</p>
//               </div>
//               <div className="bg-blue-600 bg-opacity-30 rounded-lg p-4 border border-blue-500">
//                 <p className="text-gray-300 text-sm">Total Tasks</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.tasks || 0}</p>
//               </div>
//             </div>

//             {selectedProject.elements && selectedProject.elements.length > 0 && (
//               <div>
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
//                   <Activity className="mr-2 text-green-400" /> Book Elements Breakdown
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={selectedProject.elements}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={(entry) => `${entry.element}: ${entry.hours?.toFixed(1)}h`}
//                       outerRadius={100}
//                       dataKey="hours"
//                       nameKey="element"
//                     >
//                       {selectedProject.elements.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>

//                 <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
//                   <h4 className="text-lg font-semibold text-white mb-3">Detailed Breakdown</h4>
//                   <div className="space-y-2">
//                     {selectedProject.elements.map((elem, idx) => (
//                       <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full mr-3" 
//                             style={{ backgroundColor: COLORS[idx % COLORS.length] }}
//                           ></div>
//                           <span className="text-gray-300">{elem.element}</span>
//                         </div>
//                         <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Visualization;




// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search } from 'lucide-react';

// const API_URL = 'http://localhost:3001/api/dashboard';
// const REFRESH_INTERVAL = 60000;

// const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

// // Department to Team mapping (handled on frontend)
// const DEPARTMENT_TEAM_MAPPING = {
//   'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
//   'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA'),
//   'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
    
//     // Sort payload by value (hours) in descending order for timeline charts
//     const sortedPayload = [...payload].sort((a, b) => {
//       const valueA = typeof a.value === 'number' ? a.value : 0;
//       const valueB = typeof b.value === 'number' ? b.value : 0;
//       return valueB - valueA; // Descending order (highest first)
//     });
    
//     // Calculate total hours
//     const totalHours = sortedPayload.reduce((sum, entry) => {
//       return sum + (typeof entry.value === 'number' ? entry.value : 0);
//     }, 0);
    
//     return (
//       <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-3 shadow-2xl max-w-xs min-w-[280px] backdrop-blur-sm bg-opacity-95">
//         {label && <p className="text-white font-semibold text-sm mb-2 truncate">{label}</p>}
        
//         {/* Show total hours at the top */}
//         {sortedPayload.length > 1 && (
//           <p className="text-purple-400 text-xs font-bold mb-2 pb-2 border-b border-gray-700">
//             Total: {totalHours.toFixed(2)} hrs
//           </p>
//         )}
        
//         {/* Display projects sorted by effort (highest to lowest) */}
//         <div className="max-h-48 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
//           {sortedPayload.map((entry, index) => {
//             const entryName = entry.name || entry.dataKey || '';
//             const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
            
//             // Skip entries with 0 or null values
//             if (!entry.value || entry.value === 0) return null;
            
//             return (
//               <div key={index} className="text-xs mb-1.5 break-words">
//                 <span style={{ color: entry.color }} className="font-medium">
//                   {entryName}:
//                 </span>
//                 <span className="font-bold text-white ml-1">
//                   {displayValue}
//                   {entryName.toLowerCase().includes('hours') && ' hrs'}
//                   {entryName.toLowerCase().includes('units') && ' units'}
//                   {!entryName.toLowerCase().includes('hours') && !entryName.toLowerCase().includes('units') && ' hrs'}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
        
//         {/* Show book elements if available in the data */}
//         {data && data.elements && data.elements.length > 0 && (
//           <div className="mt-2 pt-2 border-t border-gray-700">
//             <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
//             <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
//               {data.elements.slice(0, 5).map((elem, idx) => (
//                 <p key={idx} className="text-gray-400 text-xs break-words">
//                   • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//                 </p>
//               ))}
//               {data.elements.length > 5 && (
//                 <p className="text-gray-500 text-xs italic">+ {data.elements.length - 5} more...</p>
//               )}
//             </div>
//           </div>
//         )}
        
//         {data && data.tasks && (
//           <p className="text-gray-400 text-xs mt-2">
//             Total Tasks: <span className="text-white font-semibold">{data.tasks}</span>
//           </p>
//         )}
        
//         <style jsx>{`
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 4px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: #374151;
//             border-radius: 2px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #8b5cf6;
//             border-radius: 2px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #a78bfa;
//           }
//         `}</style>
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Project Pie Chart showing book elements
// const ProjectPieTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl max-w-xs">
//         <p className="text-white font-semibold mb-2">{data.name}</p>
//         <p className="text-purple-400 text-sm mb-2">
//           Total: <span className="font-bold">{data.hours?.toFixed(2)} hrs</span>
//         </p>
//         {data.elements && data.elements.length > 0 && (
//           <div className="mt-2 border-t border-gray-700 pt-2">
//             <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
//             {data.elements.map((elem, idx) => (
//               <p key={idx} className="text-gray-400 text-xs">
//                 • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Tooltip for Work Mode by Days
// const WorkModeTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-900 border border-purple-500 rounded-lg p-4 shadow-2xl">
//         <p className="text-white font-semibold mb-2">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }} className="text-sm">
//             {entry.name}: <span className="font-bold">{entry.value?.toFixed(2)} hrs</span>
//           </p>
//         ))}
//         <p className="text-gray-400 text-xs mt-2">
//           Total: <span className="font-bold text-white">
//             {payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(2)} hrs
//           </span>
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
//     <div className="flex items-center justify-between mb-2">
//       <Icon className="w-10 h-10 text-white opacity-80" />
//       <span className="text-3xl font-bold text-white">{value}</span>
//     </div>
//     <h3 className="text-white text-lg font-semibold">{title}</h3>
//     {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [overview, setOverview] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [workMode, setWorkMode] = useState([]);
//   const [workModeByDays, setWorkModeByDays] = useState([]);
//   const [elements, setElements] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [statuses, setStatuses] = useState([]);
//   const [auditStatus, setAuditStatus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());
  
//   // Modal states for project details
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   // Filter states
//   const [allTeamsFromDB, setAllTeamsFromDB] = useState([]); // All teams from database
//   const [filteredTeams, setFilteredTeams] = useState([]); // Teams filtered by department
//   const [employeeNames, setEmployeeNames] = useState(['All']);
  
//   const [selectedDepartment, setSelectedDepartment] = useState('All');
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedEmployee, setSelectedEmployee] = useState('All');
//   const [selectedPeriod, setSelectedPeriod] = useState('All');
  
//   // Employee search state
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);

//   // Hardcoded departments (frontend only)
//   const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

//   // Fetch all teams from database
//   const fetchAllTeams = async () => {
//     try {
//       const res = await fetch(`${API_URL}/filters/teams`);
//       const teams = await res.json();
//       setAllTeamsFromDB(teams);
//     } catch (error) {
//       console.error('Error fetching teams:', error);
//     }
//   };

//   // Filter teams based on selected department (frontend logic)
//   const filterTeamsByDepartment = (department) => {
//     if (department === 'All') {
//       setFilteredTeams(allTeamsFromDB);
//     } else {
//       const filterFn = DEPARTMENT_TEAM_MAPPING[department];
//       if (filterFn) {
//         const filtered = allTeamsFromDB.filter(filterFn);
//         setFilteredTeams(filtered);
//       } else {
//         setFilteredTeams([]);
//       }
//     }
//   };

//   const fetchEmployees = async (team, search = '') => {
//     try {
//       const params = new URLSearchParams();
//       if (team && team !== 'All') {
//         params.append('team', team);
//       }
//       if (search && search.trim() !== '') {
//         params.append('search', search);
//       }
      
//       const res = await fetch(`${API_URL}/filters/employees?${params.toString()}`);
//       const emps = await res.json();
//       setEmployeeNames(['All', ...emps]);
//       setFilteredEmployees(emps);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
//     if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         overviewRes, projectsRes, employeesRes, teamsRes, 
//         timelineRes, workModeRes, workModeByDaysRes, elementsRes, tasksRes, 
//         statusRes, auditRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/overview${urlSuffix}`),
//         fetch(`${API_URL}/projects${urlSuffix}`),
//         fetch(`${API_URL}/employees${urlSuffix}`),
//         fetch(`${API_URL}/teams${urlSuffix}`),
//         fetch(`${API_URL}/timeline${urlSuffix}`),
//         fetch(`${API_URL}/workmode${urlSuffix}`),
//         fetch(`${API_URL}/workmode-by-days${urlSuffix}`),
//         fetch(`${API_URL}/elements${urlSuffix}`),
//         fetch(`${API_URL}/tasks${urlSuffix}`),
//         fetch(`${API_URL}/status${urlSuffix}`),
//         fetch(`${API_URL}/audit-status${urlSuffix}`),
//       ]);

//       setOverview(await overviewRes.json());
//       setProjects(await projectsRes.json());
//       setEmployees(await employeesRes.json());
//       setTeams(await teamsRes.json());
//       setTimeline(await timelineRes.json());
//       setWorkMode(await workModeRes.json());
//       setWorkModeByDays(await workModeByDaysRes.json());
//       setElements(await elementsRes.json());
//       setTasks(await tasksRes.json());
//       setStatuses(await statusRes.json());
//       setAuditStatus(await auditRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchAllTeams();
//   }, []);

//   // Filter teams when department changes
//   useEffect(() => {
//     if (allTeamsFromDB.length > 0) {
//       filterTeamsByDepartment(selectedDepartment);
//     }
//   }, [selectedDepartment, allTeamsFromDB]);

//   // Load employees when team changes
//   useEffect(() => {
//     if (selectedTeam !== 'All') {
//       fetchEmployees(selectedTeam);
//     } else {
//       setEmployeeNames(['All']);
//       setFilteredEmployees([]);
//     }
//   }, [selectedTeam]);

//   // Handle employee search
//   useEffect(() => {
//     if (employeeSearch.trim() === '') {
//       setFilteredEmployees(employeeNames.filter(e => e !== 'All'));
//     } else {
//       const filtered = employeeNames.filter(emp => 
//         emp !== 'All' && emp.toLowerCase().includes(employeeSearch.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     }
//   }, [employeeSearch, employeeNames]);

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedTeam, selectedEmployee, selectedPeriod]);

//   const clearAllFilters = () => {
//     setSelectedDepartment('All');
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setSelectedPeriod('All');
//     setEmployeeSearch('');
//   };

//   const handleDepartmentChange = (e) => {
//     const newDepartment = e.target.value;
//     setSelectedDepartment(newDepartment);
//     // Reset team and employee when department changes
//     setSelectedTeam('All');
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleTeamChange = (e) => {
//     const newTeam = e.target.value;
//     setSelectedTeam(newTeam);
//     // Reset employee when team changes
//     setSelectedEmployee('All');
//     setEmployeeSearch('');
//   };

//   const handleEmployeeSelect = (empName) => {
//     setSelectedEmployee(empName);
//     setEmployeeSearch(empName === 'All' ? '' : empName);
//     setShowEmployeeDropdown(false);
//   };

//   const handleProjectClick = (data) => {
//     if (data && data.activePayload && data.activePayload[0]) {
//       const project = data.activePayload[0].payload;
//       setSelectedProject(project);
//       setShowProjectModal(true);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-white text-xl">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
//         {/* Header */}
//         <div className="px-8 pt-6 pb-4">
//           <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Work Tracker Analytics
//           </h1>
//           <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Filter className="mr-2 text-purple-400" /> Filters
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Department Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={handleDepartmentChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   {departments.map(dept => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Team Name Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={handleTeamChange}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={selectedDepartment === 'All'}
//                 >
//                   <option value="All">All</option>
//                   {filteredTeams.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Employee Name Filter with Search */}
//               <div className="relative">
//                 <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={employeeSearch}
//                     onChange={(e) => {
//                       setEmployeeSearch(e.target.value);
//                       setShowEmployeeDropdown(true);
//                     }}
//                     onFocus={() => setShowEmployeeDropdown(true)}
//                     placeholder="Search employee..."
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={selectedTeam === 'All'}
//                   />
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 </div>
                
//                 {/* Dropdown */}
//                 {showEmployeeDropdown && selectedTeam !== 'All' && (
//                   <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//                     <div
//                       onClick={() => handleEmployeeSelect('All')}
//                       className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                     >
//                       All
//                     </div>
//                     {filteredEmployees.map(emp => (
//                       <div
//                         key={emp}
//                         onClick={() => handleEmployeeSelect(emp)}
//                         className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
//                       >
//                         {emp}
//                       </div>
//                     ))}
//                     {filteredEmployees.length === 0 && (
//                       <div className="px-4 py-2 text-gray-400">No employees found</div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Period Filter */}
//               <div>
//                 <label className="text-white text-sm font-semibold mb-2 block">Period</label>
//                 <select
//                   value={selectedPeriod}
//                   onChange={(e) => setSelectedPeriod(e.target.value)}
//                   className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="All">All</option>
//                   <option value="Last 7 Days">Last 7 Days</option>
//                   <option value="Last 30 Days">Last 30 Days</option>
//                   <option value="Last 3 Months">Last 3 Months</option>
//                   <option value="Last 6 Months">Last 6 Months</option>
//                   <option value="Last Year">Last Year</option>
//                   <option value="This Year">This Year</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close dropdown */}
//       {showEmployeeDropdown && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setShowEmployeeDropdown(false)}
//         />
//       )}

//       {/* Scrollable Content */}
//       <div className="px-8 py-6 overflow-y-auto">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Briefcase}
//             title="Total Projects"
//             value={overview?.totalProjects || 0}
//             color="from-purple-500 to-purple-700"
//           />
//           <StatCard
//             icon={Users}
//             title="Active Employees"
//             value={overview?.totalEmployees || 0}
//             color="from-pink-500 to-pink-700"
//           />
//           <StatCard
//             icon={Clock}
//             title="Total Hours"
//             value={Math.round(overview?.totalHours || 0)}
//             subtitle="Work logged"
//             color="from-blue-500 to-blue-700"
//           />
//           <StatCard
//             icon={Target}
//             title="Total Tasks"
//             value={overview?.totalTasks || 0}
//             color="from-green-500 to-green-700"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Top Projects by Hours with Clickable Bars */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={projects.slice(0, 10)} onClick={handleProjectClick}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={120} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
//                 <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} cursor="pointer">
//                   {projects.slice(0, 10).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//             <p className="text-gray-400 text-xs mt-2 text-center">Click on a bar to view book elements breakdown</p>
//           </div>

//           {/* Work Mode by Days - Replaces Top Performers */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Clock className="mr-2 text-pink-400" /> Work Mode by Days
//             </h2>
//             <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
//               <ResponsiveContainer width="100%" height={Math.max(300, workModeByDays.length * 40)}>
//                 <BarChart data={workModeByDays} layout="horizontal">
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis type="number" stroke="#9ca3af" />
//                   <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} fontSize={12} />
//                   <Tooltip content={<WorkModeTooltip />} />
//                   <Legend />
//                   <Bar dataKey="WFH" stackId="a" fill="#8b5cf6" name="WFH" />
//                   <Bar dataKey="OT Office" stackId="a" fill="#ec4899" name="OT Office" />
//                   <Bar dataKey="OT Home" stackId="a" fill="#f59e0b" name="OT Home" />
//                   <Bar dataKey="On Duty" stackId="a" fill="#10b981" name="On Duty" />
//                   <Bar dataKey="Night" stackId="a" fill="#ef4444" name="Night" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Work Activity Timeline - Smooth Stacked Area Chart by Projects */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <TrendingUp className="mr-2 text-blue-400" /> Project Activity Timeline
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeline}>
//                 <defs>
//                   {timeline.length > 0 && timeline[0].projects && 
//                     Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
//                       <linearGradient key={projectName} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
//                       </linearGradient>
//                     ))
//                   }
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip 
//                   content={<CustomTooltip />}
//                   wrapperStyle={{ zIndex: 1000, outline: 'none' }}
//                   allowEscapeViewBox={{ x: false, y: true }}
//                   position={{ y: 0 }}
//                 />
//                 <Legend wrapperStyle={{ paddingTop: '10px' }} />
//                 {timeline.length > 0 && timeline[0].projects && 
//                   Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
//                     <Area
//                       key={projectName}
//                       type="monotone"
//                       dataKey={`projects.${projectName}`}
//                       stackId="1"
//                       stroke={COLORS[idx % COLORS.length]}
//                       fill={`url(#color${idx})`}
//                       name={projectName}
//                     />
//                   ))
//                 }
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Work Mode Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Zap className="mr-2 text-yellow-400" /> Work Mode Distribution
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={workMode}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="mode"
//                 >
//                   {workMode.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Book Elements */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Activity className="mr-2 text-green-400" /> Book Elements
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={elements.slice(0, 10)}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="element" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Types Distribution */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Target className="mr-2 text-orange-400" /> Task Types
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={tasks.slice(0, 8)}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="hours"
//                   nameKey="task"
//                 >
//                   {tasks.slice(0, 8).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Task Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-cyan-400" /> Task Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={statuses}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]}>
//                   {statuses.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Contributions */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <Users className="mr-2 text-cyan-400" /> Team Contributions
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={teams}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
//                 <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Audit Status */}
//           <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700 lg:col-span-2">
//             <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//               <CheckCircle className="mr-2 text-purple-400" /> Audit Status Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={auditStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="status" stroke="#9ca3af" fontSize={12} />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
//                   {auditStatus.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//         <span className="text-sm">Auto-refreshing every minute</span>
//       </div>

//       {/* Project Details Modal */}
//       {showProjectModal && selectedProject && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
//           <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
//               <button
//                 onClick={() => setShowProjectModal(false)}
//                 className="text-gray-400 hover:text-white transition-colors"
//               >
//                 <X className="w-8 h-8" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4 border border-purple-500">
//                 <p className="text-gray-300 text-sm">Total Hours</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.hours?.toFixed(2)}</p>
//               </div>
//               <div className="bg-pink-600 bg-opacity-30 rounded-lg p-4 border border-pink-500">
//                 <p className="text-gray-300 text-sm">Total Units</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.units || 0}</p>
//               </div>
//               <div className="bg-blue-600 bg-opacity-30 rounded-lg p-4 border border-blue-500">
//                 <p className="text-gray-300 text-sm">Total Tasks</p>
//                 <p className="text-white text-2xl font-bold">{selectedProject.tasks || 0}</p>
//               </div>
//             </div>

//             {selectedProject.elements && selectedProject.elements.length > 0 && (
//               <div>
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
//                   <Activity className="mr-2 text-green-400" /> Book Elements Breakdown
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={selectedProject.elements}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={(entry) => `${entry.element}: ${entry.hours?.toFixed(1)}h`}
//                       outerRadius={100}
//                       dataKey="hours"
//                       nameKey="element"
//                     >
//                       {selectedProject.elements.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>

//                 <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
//                   <h4 className="text-lg font-semibold text-white mb-3">Detailed Breakdown</h4>
//                   <div className="space-y-2">
//                     {selectedProject.elements.map((elem, idx) => (
//                       <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-4 h-4 rounded-full mr-3" 
//                             style={{ backgroundColor: COLORS[idx % COLORS.length] }}
//                           ></div>
//                           <span className="text-gray-300">{elem.element}</span>
//                         </div>
//                         <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Visualization;






import React, { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, LabelList, ReferenceLine } from 'recharts';
import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search, Moon, BookMarked, AlertTriangle, LayoutDashboard, LayoutGrid, CircleHelp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const API_URL = `${BACKEND_URL}/api/dashboard`;
const REFRESH_INTERVAL = 60000;
/** Default Overall dashboard slice: smaller query for fast first paint; full range prefetched in background */
const DEFAULT_DASH_PERIOD = 'Last 7 Days';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

const GANTT_PROJECT_COL = 240;

/** Task → Independent (I) vs Collaborative (C) for contribution donuts. Unlisted tasks default to I. */
const TASK_IC_MODE = (() => {
  const raw = `DRF\tI
VRF-MS\tI
CMPL-MS\tI
COM\tI
JCR\tC
Coord\tC
MEET\tC
R1\tI
CR1\tI
R2\tI
CR2\tI
R3\tI
CR3\tI
R4\tI
CR4\tI
R5\tI
CR5\tI
TAL\tI
FINAL\tI
FER\tI
GLANCE\tI
SET\tI
Development\tI
Research\tI
Analysis\tI
Rα\tI
CRα\tI
Rβ\tI
CRβ\tI
PLAN\tI
MKT Content\tI
Miscellaneous\tC
UPL\tI
SCAN\tI
Interview\tI
Training\tC
KT\tC
Book keeping\tI
ISBN\tI
Design\tI
Testing\tI
REV\tI
QRY\tC
Code\tI
EDIT\tI
Order generation\tI
Stakeholder management\tC
Webinar\tC
Listing\tI
Creative update\tI
Campaign\tI
Shipment\tI
Website design/check\tI
Briefing\tC
Stock updation\tI
REC\tC
Report generation\tI
Customer support\tC
Compiling\tI
Generation\tI
Update\tI
QR Gen\tI
Sketch\tI
Flat colour\tI
Final Colour\tI
Final Output\tI
Visit\tC
Practice\tI
Internet/System Issue\tI`;
  const m = {};
  raw.trim().split('\n').forEach((line) => {
    const [task, mode] = line.split('\t').map((s) => s.trim());
    if (task) m[task] = mode === 'C' ? 'C' : 'I';
  });
  return m;
})();
const TASK_IC_MODE_LOWER = new Map(Object.entries(TASK_IC_MODE).map(([k, v]) => [k.toLowerCase(), v]));

function classifyTaskIndependentOrCollab(taskName) {
  const t = String(taskName || '').trim();
  if (!t) return 'I';
  if (TASK_IC_MODE[t]) return TASK_IC_MODE[t];
  const lo = t.toLowerCase();
  if (TASK_IC_MODE_LOWER.has(lo)) return TASK_IC_MODE_LOWER.get(lo);
  return 'I';
}

function quartiles(sorted) {
  const a = [...sorted].sort((x, y) => x - y);
  const n = a.length;
  if (!n) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, samples: [] };
  const q = (p) => {
    const pos = (n - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    return a[base + 1] !== undefined ? a[base] + rest * (a[base + 1] - a[base]) : a[base];
  };
  return { min: a[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: a[n - 1], samples: a };
}

function buildChapterMapFromGantt(ganttRows, employeeName) {
  const map = new Map();
  const emp = String(employeeName || '').trim();
  for (const r of ganttRows || []) {
    if (String(r?.employee || r?.name || '').trim() !== emp) continue;
    const project = String(r?.project || r?.project_name || '').trim();
    if (!project || !Array.isArray(r?.tasks)) continue;
    for (const t of r.tasks) {
      const task = String(t?.task || 'Unspecified').trim() || 'Unspecified';
      const key = `${project}\t${task}`;
      const o = map.get(key) || new Map();
      if (Array.isArray(t.chapters) && t.chapters.length) {
        for (const c of t.chapters) {
          const ch = c.chapter != null && String(c.chapter).trim() !== '' ? String(c.chapter).trim() : '—';
          const hh = Number(c.hours) || 0;
          if (hh > 0) addChapterHoursToMap(o, ch, hh);
        }
      } else {
        const th = Number(t?.hours) || 0;
        if (th > 0) o.set('—', (o.get('—') || 0) + th);
      }
      map.set(key, o);
    }
  }
  const out = new Map();
  for (const [k, chMap] of map.entries()) {
    out.set(
      k,
      [...chMap.entries()]
        .map(([chapter, hours]) => ({ chapter, hours }))
        .sort((a, b) => b.hours - a.hours)
    );
  }
  return out;
}

const EmployeeProjectStackTooltipContent = memo(({ payload, chapterMap, scrollRef, onMouseEnter, onMouseLeave, wrapperStyle }) => {
  if (!payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row?.fullName) return null;
  const taskRows = payload
    .map((p) => {
      const task = String(p.dataKey || '');
      const hours = Number(p.value) || 0;
      if (!task || hours <= 0) return null;
      return { task, hours };
    })
    .filter(Boolean)
    .sort((a, b) => b.hours - a.hours);
  const total = taskRows.reduce((s, r) => s + r.hours, 0);

  const handleScrollKeys = useCallback((e) => {
    const el = scrollRef?.current;
    if (!el) return;
    const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
    if (!scrollKeys.includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    const pageStep = Math.max(el.clientHeight * 0.85, 48);
    const lineStep = 28;
    if (e.key === 'ArrowDown') el.scrollTop += lineStep;
    else if (e.key === 'ArrowUp') el.scrollTop -= lineStep;
    else if (e.key === 'PageDown') el.scrollTop += pageStep;
    else if (e.key === 'PageUp') el.scrollTop -= pageStep;
    else if (e.key === 'Home') el.scrollTop = 0;
    else if (e.key === 'End') el.scrollTop = el.scrollHeight;
  }, [scrollRef]);

  const handleWheel = useCallback((e) => {
    e.stopPropagation();
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const delta = e.deltaY;
    const atTop = scrollTop <= 0 && delta < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && delta > 0;
    if (!atTop && !atBottom) e.preventDefault();
  }, []);

  return (
    <div
      className="rounded-lg border border-purple-500 bg-gray-900 px-3 py-2 text-xs shadow-xl max-w-sm"
      style={{ zIndex: 10005, pointerEvents: 'auto', ...wrapperStyle }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onWheel={(e) => e.stopPropagation()}
      onKeyDown={handleScrollKeys}
    >
      <p className="text-white font-semibold">{row.fullName}</p>
      <p className="text-gray-400 mt-1">Total: <span className="text-white font-bold">{total.toFixed(1)} hrs</span></p>
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="Task and chapter breakdown"
        className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded"
        onWheel={handleWheel}
        onKeyDown={handleScrollKeys}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {taskRows.map((tr) => {
          const chLines = chapterMap?.get(`${row.fullName}\t${tr.task}`) || [];
          return (
            <div key={tr.task} className="border-t border-gray-700/80 pt-1.5">
              <p className="text-purple-200 font-semibold">{tr.task}: {tr.hours.toFixed(1)} hrs</p>
              {chLines.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-gray-400 pl-2">
                  {chLines.map((c) => (
                    <li key={`${tr.task}-${c.chapter}`}>
                      Ch {c.chapter}: <span className="text-gray-200">{c.hours.toFixed(1)}h</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
EmployeeProjectStackTooltipContent.displayName = 'EmployeeProjectStackTooltipContent';

const EmployeeProjectStackTooltip = memo(({ active, payload, chapterMap }) => {
  const [mousePos, setMousePos] = useState({ left: 0, top: 0 });
  const [pointerInside, setPointerInside] = useState(false);
  const lastPayloadRef = useRef(null);
  const insideRef = useRef(false);
  const scrollRef = useRef(null);
  const rafRef = useRef(0);
  const pendingRef = useRef(null);

  React.useEffect(() => {
    if (pointerInside) return;
    if (active && payload?.length) {
      lastPayloadRef.current = payload;
    } else if (!active) {
      lastPayloadRef.current = null;
    }
  }, [active, payload, pointerInside]);

  const effectivePayload = lastPayloadRef.current;
  const hasData = !!(effectivePayload && effectivePayload.length);
  const shouldShow = hasData && (active || pointerInside);

  React.useEffect(() => {
    if (!shouldShow) return undefined;
    const onMove = (e) => {
      if (insideRef.current) return;
      const margin = 10;
      const width = 340;
      const height = 400;
      const left = Math.max(margin, Math.min(e.clientX + 16, window.innerWidth - width - margin));
      const top = Math.max(margin, Math.min(e.clientY - 24, window.innerHeight - height - margin));
      pendingRef.current = { left, top };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        if (pendingRef.current) setMousePos(pendingRef.current);
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      pendingRef.current = null;
    };
  }, [shouldShow]);

  React.useEffect(() => {
    if (!pointerInside) return undefined;
    const onKey = (e) => {
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
      if (!scrollKeys.includes(e.key)) return;
      const el = scrollRef.current;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const pageStep = Math.max(el.clientHeight * 0.85, 48);
      const lineStep = 28;
      if (e.key === 'ArrowDown') el.scrollTop += lineStep;
      else if (e.key === 'ArrowUp') el.scrollTop -= lineStep;
      else if (e.key === 'PageDown') el.scrollTop += pageStep;
      else if (e.key === 'PageUp') el.scrollTop -= pageStep;
      else if (e.key === 'Home') el.scrollTop = 0;
      else if (e.key === 'End') el.scrollTop = el.scrollHeight;
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [pointerInside]);

  const handleEnter = useCallback(() => {
    insideRef.current = true;
    setPointerInside(true);
    scrollRef.current?.focus({ preventScroll: true });
  }, []);
  const handleLeave = useCallback(() => {
    insideRef.current = false;
    setPointerInside(false);
    if (!active) lastPayloadRef.current = null;
  }, [active]);

  if (!shouldShow || typeof document === 'undefined') return null;
  return createPortal(
    <>
      {pointerInside && (
        <div
          aria-hidden
          style={{ position: 'fixed', inset: 0, zIndex: 10004, pointerEvents: 'auto', background: 'transparent' }}
        />
      )}
      <EmployeeProjectStackTooltipContent
        payload={effectivePayload}
        chapterMap={chapterMap}
        scrollRef={scrollRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        wrapperStyle={{ position: 'fixed', left: mousePos.left, top: mousePos.top }}
      />
    </>,
    document.body
  );
});
EmployeeProjectStackTooltip.displayName = 'EmployeeProjectStackTooltip';

const PIE_LABEL_LINE_STYLE = { stroke: '#94a3b8', strokeWidth: 1 };

const PieExternalLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  if (percent < 0.03) return null;
  const RAD = Math.PI / 180;
  const r = outerRadius + 20;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const anchor = x > cx ? 'start' : 'end';
  const raw = String(name || '');
  const label = raw.length > 24 ? `${raw.slice(0, 22)}…` : raw;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fill="#f1f5f9"
      fontSize={11}
      fontWeight={600}
      style={{ paintOrder: 'stroke', stroke: 'rgba(15, 23, 42, 0.95)', strokeWidth: 3 }}
    >
      {`${label} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const EmployeeProjectDonutTooltip = memo(({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const hours = Number(payload[0].value) || 0;
  const title = d?.fullName || d?.name || 'Project';
  const pct = d?.pct != null ? d.pct.toFixed(0) : '—';
  return (
    <div
      className="rounded-lg border border-purple-500 px-3 py-2 shadow-2xl max-w-xs"
      style={{ backgroundColor: 'rgb(17 24 39)', zIndex: 10005 }}
    >
      <p className="text-white font-semibold text-sm break-words">{title}</p>
      <p className="text-purple-300 text-sm mt-1">
        <span className="text-white font-bold">{hours.toFixed(1)} hrs</span>
        <span className="text-gray-400"> ({pct}%)</span>
      </p>
    </div>
  );
});
EmployeeProjectDonutTooltip.displayName = 'EmployeeProjectDonutTooltip';

function DonutWithLegend({ title, subtitle, centerLabel, pct, slices, totalLabel, totalValue, accentClass }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="flex flex-col h-full">
      <h4 className={`text-sm font-bold ${accentClass}`}>{title}</h4>
      {subtitle && <p className="text-gray-500 text-[11px] mt-0.5">{subtitle}</p>}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
        <div className="relative w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {slices.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.fill || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{Math.round(pct)}%</span>
            <span className="text-[10px] text-gray-400 text-center px-2">{centerLabel}</span>
          </div>
        </div>
        <ul className="w-full mt-3 space-y-1.5 text-xs text-gray-300">
          {slices.map((s, i) => (
            <li key={s.name} className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.fill || COLORS[i % COLORS.length] }} />
              <span className="flex-1 truncate" title={s.name}>{s.name}</span>
              <span className="tabular-nums text-gray-400">{((s.value / total) * 100).toFixed(0)}%</span>
              <span className="tabular-nums text-gray-200 w-16 text-right">{s.value.toFixed(1)}h</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 rounded-md border border-gray-600 bg-gray-900/70 px-3 py-2 flex justify-between text-sm">
        <span className="text-gray-400">{totalLabel}</span>
        <span className={`font-bold tabular-nums ${accentClass}`}>{totalValue}</span>
      </div>
    </div>
  );
}

function TaskTimePerUnitBoxPlot({ tasks }) {
  if (!tasks?.length) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center text-gray-400 text-sm text-center px-6 gap-2">
        <p>No tasks with both hours and units in this period.</p>
        <p className="text-xs text-gray-500">Time-per-unit needs logged unit counts on work entries.</p>
      </div>
    );
  }
  const padL = 132;
  const padR = 24;
  const padT = 20;
  const padB = 48;
  const rowH = 32;
  const h = padT + padB + tasks.length * rowH;
  const w = 640;
  const plotW = w - padL - padR;
  const allVals = tasks.flatMap((t) => t.stats?.samples ?? [t.stats.min, t.stats.max]);
  const maxV = Math.max(...allVals.filter((v) => Number.isFinite(v)), 0.01);
  const xScale = (v) => padL + (Math.min(v, maxV) / maxV) * plotW;
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ v: maxV * f, x: xScale(maxV * f) }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[480px]" style={{ maxHeight: 420 }} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Time per unit by task">
        <line x1={padL} y1={padT - 4} x2={padL} y2={h - padB} stroke="#475569" strokeWidth={1} />
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#475569" strokeWidth={1} />
        {xTicks.map((t) => (
          <g key={t.v}>
            <line x1={t.x} y1={padT - 4} x2={t.x} y2={h - padB} stroke="#334155" strokeDasharray="3 3" />
            <text x={t.x} y={h - padB + 16} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              {t.v >= 10 ? t.v.toFixed(0) : t.v.toFixed(1)}
            </text>
          </g>
        ))}
        {tasks.map((t, i) => {
          const y = padT + i * rowH + rowH / 2;
          const { min, q1, median, q3, max } = t.stats;
          const n = t.stats.samples?.length ?? 0;
          const collapsed = Math.abs(q3 - q1) < 1e-6;
          const tip = `${t.task}\nHours per unit (lower = faster)\nMin: ${min.toFixed(2)} · Q1: ${q1.toFixed(2)} · Median: ${median.toFixed(2)} · Q3: ${q3.toFixed(2)} · Max: ${max.toFixed(2)}\n${n} logged slice(s)`;
          return (
            <g key={t.task}>
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="#e2e8f0" fontSize={10} fontWeight={500}>
                {t.task.length > 16 ? `${t.task.slice(0, 14)}…` : t.task}
              </text>
              <title>{tip}</title>
              <line x1={xScale(min)} y1={y} x2={xScale(max)} y2={y} stroke="#94a3b8" strokeWidth={2} />
              {collapsed ? (
                <circle cx={xScale(median)} cy={y} r={5} fill="#818cf8" stroke="#e0e7ff" strokeWidth={1.5} />
              ) : (
                <>
                  <rect
                    x={xScale(q1)}
                    y={y - 9}
                    width={Math.max(3, xScale(q3) - xScale(q1))}
                    height={18}
                    fill="rgba(99, 102, 241, 0.55)"
                    stroke="#a5b4fc"
                    rx={2}
                  />
                  <line x1={xScale(median)} y1={y - 11} x2={xScale(median)} y2={y + 11} stroke="#f8fafc" strokeWidth={2.5} />
                </>
              )}
              <text x={xScale(max) + 6} y={y + 4} fill="#cbd5e1" fontSize={9} fontWeight={600}>
                {median.toFixed(1)}
              </text>
            </g>
          );
        })}
        <text x={(padL + w - padR) / 2} y={h - 6} textAnchor="middle" fill="#94a3b8" fontSize={11}>
          Hours per unit (median line · box = middle 50% of entries)
        </text>
      </svg>
    </div>
  );
}

/** Non-blocking overlay while refetching after filter changes (keeps header + filters visible). */
function FilterRefreshOverlay({ active, label = 'Updating charts…' }) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-start justify-center bg-gray-900/45 backdrop-blur-[1px] pt-20"
      aria-hidden
    >
      <div className="flex items-center gap-3 rounded-lg border border-purple-500/50 bg-gray-900/95 px-4 py-2.5 shadow-xl">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent" />
        <span className="text-gray-200 text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

function mainDashTabFromPath(pathname) {
  if (pathname === '/night') return 'night';
  if (pathname === '/books') return 'books';
  return 'overall';
}

// Work mode colors matching PowerBI style - ALL 8 work modes
const WORK_MODE_COLORS = {
  'WFH': '#8b5cf6',           // Purple color
  'In Office': '#3b82f6',     // Blue
  'OT Office': '#ec4899',     // Pink
  'OT Home': '#f59e0b',       // Orange
  'On Duty': '#10b981',       // Green
  'Night': '#ef4444',         // Red
  'Half Day': '#14b8a6',      // Teal
  'Leave': '#f97316'          // Deep Orange
};

// Department to Team mapping (handled on frontend)
const DEPARTMENT_TEAM_MAPPING = {
  'DTP': (teamName) => teamName.startsWith('DTP') || teamName.startsWith('Animation'),
  'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA') || teamName.startsWith('University'),
  'Digital Marketing': (teamName) => teamName === 'Digital_Marketing'
};

const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Sort payload by value (hours) in descending order for timeline charts
    const sortedPayload = [...payload].sort((a, b) => {
      const valueA = typeof a.value === 'number' ? a.value : 0;
      const valueB = typeof b.value === 'number' ? b.value : 0;
      return valueB - valueA; // Descending order (highest first)
    });
    
    // Calculate total hours
    const totalHours = sortedPayload.reduce((sum, entry) => {
      return sum + (typeof entry.value === 'number' ? entry.value : 0);
    }, 0);
    
    return (
      <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-3 shadow-2xl max-w-xs min-w-[280px]" style={{ backgroundColor: 'rgb(17 24 39)' }}>
        {label && <p className="text-white font-semibold text-sm mb-2 truncate">{label}</p>}
        
        {/* Show total hours at the top */}
        {sortedPayload.length > 1 && (
          <p className="text-purple-400 text-xs font-bold mb-2 pb-2 border-b border-gray-700">
            Total: {totalHours.toFixed(2)} hrs
          </p>
        )}
        
        {/* Display projects sorted by effort (highest to lowest) */}
        <div className="max-h-48 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
          {sortedPayload.map((entry, index) => {
            const entryName = entry.name || entry.dataKey || '';
            const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
            
            // Skip entries with 0 or null values
            if (!entry.value || entry.value === 0) return null;
            
            return (
              <div key={index} className="text-xs mb-1.5 break-words">
                <span style={{ color: entry.color }} className="font-medium">
                  {entryName}:
                </span>
                <span className="font-bold text-white ml-1">
                  {displayValue}
                  {entryName.toLowerCase().includes('hours') && ' hrs'}
                  {entryName.toLowerCase().includes('units') && ' units'}
                  {!entryName.toLowerCase().includes('hours') && !entryName.toLowerCase().includes('units') && ' hrs'}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Show book elements if available in the data */}
        {data && data.elements && data.elements.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
            <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
              {data.elements.slice(0, 5).map((elem, idx) => (
                <p key={idx} className="text-gray-400 text-xs break-words">
                  • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
                </p>
              ))}
              {data.elements.length > 5 && (
                <p className="text-gray-500 text-xs italic">+ {data.elements.length - 5} more...</p>
              )}
            </div>
          </div>
        )}
        
        {data && data.tasks && (
          <p className="text-gray-400 text-xs mt-2">
            Total Tasks: <span className="text-white font-semibold">{data.tasks}</span>
          </p>
        )}
        
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #8b5cf6;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a78bfa;
          }
        `}</style>
      </div>
    );
  }
  return null;
});
CustomTooltip.displayName = 'CustomTooltip';

// Custom Tooltip for Project Pie Chart showing book elements
const ProjectPieTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="border border-purple-500 rounded-lg p-4 shadow-2xl max-w-xs" style={{ backgroundColor: 'rgb(17 24 39)' }}>
        <p className="text-white font-semibold mb-2">{data.name}</p>
        <p className="text-purple-400 text-sm mb-2">
          Total: <span className="font-bold">{data.hours?.toFixed(2)} hrs</span>
        </p>
        {data.elements && data.elements.length > 0 && (
          <div className="mt-2 border-t border-gray-700 pt-2">
            <p className="text-gray-300 text-xs font-semibold mb-1">Book Elements:</p>
            {data.elements.map((elem, idx) => (
              <p key={idx} className="text-gray-400 text-xs">
                • {elem.element}: <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
});
ProjectPieTooltip.displayName = 'ProjectPieTooltip';

// Inner content for Work Mode tooltip (reused for normal and portal/locked view)
const WorkModeTooltipContent = memo(({ payload, label, wrapperRef = null, onMouseEnter, onMouseLeave, wrapperStyle }) => {
  if (!payload || !payload.length) return null;
  const data = payload[0]?.payload || {};
  const workModeProjects = data.workModeProjects || {};
  const totalDays = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
  const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <div
      ref={wrapperRef}
      className="border-2 border-purple-500 rounded-lg shadow-2xl max-w-sm min-w-[280px] flex flex-col overflow-hidden work-mode-tooltip-box"
      style={{
        backgroundColor: 'rgb(17 24 39)',
        maxHeight: '49vh',
        height: '49vh',
        zIndex: 10001,
        ...wrapperStyle
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="text-white font-semibold text-base shrink-0 px-4 pt-4 pb-2">{label}</p>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pb-2 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="space-y-2">
          {sortedPayload.map((entry, index) => {
            if (!entry.value || entry.value <= 0) return null;
            const topProjects = workModeProjects[entry.name] || [];
            return (
              <div key={index} className="border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-300 text-sm">{entry.name}:</span>
                  </div>
                  <span className="font-bold text-white text-sm ml-2">{Math.round(entry.value)} day{entry.value !== 1 ? 's' : ''}</span>
                </div>
                {topProjects.length > 0 && (
                  <div className="ml-5 mt-1">
                    <p className="text-purple-400 text-xs font-semibold mb-0.5">Top 5 projects:</p>
                    <ul className="text-gray-400 text-xs space-y-0.5">
                      {topProjects.slice(0, 5).map((p, i) => (
                        <li key={i} className="truncate">
                          {i + 1}. {p.project_name} <span className="text-gray-500">({(p.hours || 0).toFixed(1)} hrs)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-700 shrink-0 px-4 pb-4">
        <div className="flex justify-between items-center">
          <span className="text-purple-400 text-sm font-semibold">Total:</span>
          <span className="font-bold text-white text-base">{Math.round(totalDays)} day{totalDays !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <style>{`
        .work-mode-tooltip-box .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .work-mode-tooltip-box .custom-scrollbar::-webkit-scrollbar-track { background: #374151; border-radius: 3px; }
        .work-mode-tooltip-box .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 3px; }
        .work-mode-tooltip-box .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a78bfa; }
      `}</style>
    </div>
  );
});
WorkModeTooltipContent.displayName = 'WorkModeTooltipContent';

// Fixed WorkModeTooltip: positions the portal tooltip at the actual mouse cursor
// instead of using a broken invisible anchor that always snaps to (0,0) of the chart.
const WorkModeTooltip = memo(({ active, payload, label }) => {
  const [mousePos, setMousePos] = useState({ left: 0, top: 0 });
  const [pointerInside, setPointerInside] = useState(false);
  const portalRef = useRef(null);
  const lastPayloadRef = useRef(null);
  const lastLabelRef = useRef('');
  const insideRef = useRef(false);
  const rafRef = useRef(0);
  const pendingRef = useRef(null);
  const lastPosRef = useRef({ left: 0, top: 0 });

  // Remember last payload/label whenever a bar is active
  React.useEffect(() => {
    if (active && payload && payload.length) {
      lastPayloadRef.current = payload;
      lastLabelRef.current = label ?? '';
    }
  }, [active, payload, label]);

  const hasData = lastPayloadRef.current && lastPayloadRef.current.length;
  const shouldShow = !!(hasData && (active || pointerInside));

  // Track mouse position with rAF throttling (avoid setState on every mousemove)
  React.useEffect(() => {
    if (!shouldShow) return undefined;

    const onMove = (e) => {
      if (insideRef.current) return;
      // Clamp tooltip position so it never goes off-screen.
      const margin = 12;
      const estimatedMaxW = 340;
      const estimatedMaxH = Math.max(220, Math.round(window.innerHeight * 0.49)); // wrapper maxHeight ~49vh
      const rawLeft = e.clientX - 295;
      const rawTop = e.clientY - 30;
      const left = Math.max(margin, Math.min(rawLeft, window.innerWidth - estimatedMaxW - margin));
      const top = Math.max(margin, Math.min(rawTop, window.innerHeight - estimatedMaxH - margin));
      pendingRef.current = { left, top };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        const next = pendingRef.current;
        if (!next) return;
        const prev = lastPosRef.current;
        // tiny deltas don't matter visually; skip to reduce re-renders
        if (Math.abs(next.left - prev.left) < 1 && Math.abs(next.top - prev.top) < 1) return;
        lastPosRef.current = next;
        setMousePos(next);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      pendingRef.current = null;
    };
  }, [shouldShow]);

  const handleEnter = useCallback(() => {
    insideRef.current = true;
    setPointerInside(true);
  }, []);
  const handleLeave = useCallback(() => {
    insideRef.current = false;
    setPointerInside(false);
  }, []);

  return (
    <>
      {shouldShow &&
        createPortal(
          <WorkModeTooltipContent
            payload={lastPayloadRef.current}
            label={lastLabelRef.current}
            wrapperRef={portalRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            wrapperStyle={{
              position: 'fixed',
              left: mousePos.left,
              top: mousePos.top
            }}
          />,
          document.body
        )}
    </>
  );
});
WorkModeTooltip.displayName = 'WorkModeTooltip';

// Custom Tooltip for Book Elements: show element, total hours, and per-task breakdown
const BookElementsTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const tasks = data.taskBreakdown || [];
    const topTasks = tasks.slice(0, 5);

    return (
      <div
        className="border-2 border-purple-500 rounded-lg p-4 shadow-2xl max-w-sm min-w-[260px]"
        style={{ backgroundColor: 'rgb(17 24 39)' }}
      >
        <p className="text-white font-semibold mb-2 text-base">
          {data.element}
        </p>
        <p className="text-purple-400 text-sm mb-3">
          Total Hours:{' '}
          <span className="font-bold text-white">
            {typeof data.hours === 'number' ? data.hours.toFixed(2) : data.hours} hrs
          </span>
        </p>

        {topTasks.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-gray-300 text-xs font-semibold mb-2">
              Task Types (Top {topTasks.length}):
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {topTasks.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {t.task || 'Unspecified'}
                  </span>
                  <span className="text-white font-semibold ml-2">
                    {(t.hours || 0).toFixed(2)} hrs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
});
BookElementsTooltip.displayName = 'BookElementsTooltip';

// Custom Tooltip for Work Mode Distribution pie: show mode name and hours on hover
const WorkModeDistributionTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const name = data.mode || payload[0].name || 'Mode';
    return (
      <div className="border-2 border-purple-500 rounded-lg p-3 shadow-2xl min-w-[140px]" style={{ backgroundColor: 'rgb(17 24 39)', zIndex: 10001 }}>
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-purple-400 text-sm mt-1">
          Hours: <span className="font-bold text-white">{typeof value === 'number' ? value.toFixed(2) : value} hrs</span>
        </p>
      </div>
    );
  }
  return null;
});
WorkModeDistributionTooltip.displayName = 'WorkModeDistributionTooltip';

// NEW: Custom Tooltip for Task Type Pie Chart showing TOP 5 book element breakdown
const TaskPieTooltip = memo(({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Count total elements
    const totalElements = data.elements ? data.elements.length : 0;
    const displayElements = data.elements ? data.elements.slice(0, 5) : [];
    
    return (
      <div className="border-2 border-purple-500 rounded-lg p-4 shadow-2xl max-w-sm min-w-[280px]" style={{ backgroundColor: 'rgb(17 24 39)' }}>
        <p className="text-white font-semibold mb-2 text-base">{data.task}</p>
        <p className="text-purple-400 text-sm mb-3">
          Total Hours: <span className="font-bold text-white">{data.hours?.toFixed(2)} hrs</span>
        </p>
        
        {/* Show TOP 5 book elements if available */}
        {displayElements.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-gray-300 text-xs font-semibold mb-2">
              Top {displayElements.length} Book Elements:
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {displayElements.map((elem, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {data.task} → {elem.element}:
                  </span>
                  <span className="text-white font-semibold ml-2">
                    {elem.hours?.toFixed(2)} hrs
                  </span>
                </div>
              ))}
            </div>
            
            {/* Show note if there are more than 5 elements */}
            {totalElements > 5 && (
              <p className="text-gray-500 text-xs italic mt-2">
                + {totalElements - 5} more elements
              </p>
            )}
          </div>
        )}
        
        {data.units > 0 && (
          <p className="text-gray-400 text-xs mt-2">
            Total Units: <span className="text-white font-semibold">{data.units}</span>
          </p>
        )}
        
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #8b5cf6;
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a78bfa;
          }
        `}</style>
      </div>
    );
  }
  return null;
});
TaskPieTooltip.displayName = 'TaskPieTooltip';

const PROJECT_TREEMAP_CHUNK = 7;
const TIMELINE_PROJECT_CHUNK = 10;
/** Employee timeline Gantt: sticky name column width */
const GANTT_TEAM_EMPLOYEE_COL = 232;

function teamGanttIsoKey(d) {
  return d.toISOString().slice(0, 10);
}

function teamGanttWeekStartMonday(dateObj) {
  const d = new Date(dateObj);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function teamGanttFormatRangeLabel(start, end) {
  const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${s} - ${e}`;
}

/** datesDesc: ISO day keys in any order. Returns buckets oldest→newest (left→right) + date→bucketKey */
function buildTeamGanttBuckets(datesDesc, timeScale) {
  const uniqueDates = [...new Set(datesDesc)];
  const asc = [...uniqueDates].sort((a, b) => a.localeCompare(b));

  if (timeScale === 'Day') {
    const buckets = asc.map((iso) => {
      const [y, m, d] = iso.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      return {
        key: iso,
        label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      };
    });
    const lookup = new Map(asc.map((d) => [d, d]));
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
          label: first.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
        });
      }
    });
    const buckets = [...monthMap.values()].sort((a, b) => a.key.localeCompare(b.key));
    const lookup = new Map();
    asc.forEach((iso) => {
      const [y, m, d] = iso.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      lookup.set(iso, key);
    });
    return { buckets, dateToBucketKey: lookup };
  }

  const weekMap = new Map();
  asc.forEach((iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const start = teamGanttWeekStartMonday(dt);
    const key = teamGanttIsoKey(start);
    if (!weekMap.has(key)) {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      weekMap.set(key, {
        key,
        start,
        end,
        label: teamGanttFormatRangeLabel(start, end),
      });
    }
  });
  const buckets = [...weekMap.values()].sort((a, b) => a.key.localeCompare(b.key));
  const lookup = new Map();
  asc.forEach((iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const key = teamGanttIsoKey(teamGanttWeekStartMonday(dt));
    lookup.set(iso, key);
  });
  return { buckets, dateToBucketKey: lookup };
}

/** Split composite chapter labels (e.g. "3, 8") into individual chapter tokens. */
function parseChapterTokens(raw) {
  const s = String(raw ?? '').trim();
  if (!s || s === '—') return [];
  const parts = s
    .split(/[,;/|]+|\s+and\s+/gi)
    .map((p) => p.trim().replace(/^ch\.?\s*/i, ''))
    .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

/** Add hours to Map<chapter, hours>, splitting multi-chapter keys evenly. */
function addChapterHoursToMap(chMap, chapterRaw, hours) {
  const hh = Number(hours) || 0;
  if (hh <= 0) return;
  const tokens = parseChapterTokens(chapterRaw);
  if (!tokens.length) {
    chMap.set('—', (chMap.get('—') || 0) + hh);
    return;
  }
  const share = hh / tokens.length;
  for (const ch of tokens) {
    chMap.set(ch, (chMap.get(ch) || 0) + share);
  }
}

/** Merge per-task chapter hour maps into dest (Map<task, Map<chapter, hours>>). */
function mergeGanttTaskChapterMaps(dest, src) {
  if (!src || !dest) return;
  for (const [task, sm] of src.entries()) {
    if (!dest.has(task)) dest.set(task, new Map());
    const dm = dest.get(task);
    for (const [ch, h] of sm.entries()) {
      addChapterHoursToMap(dm, ch, h);
    }
  }
}

/** Deep-clone Map<task, Map<chapter, hours>>. */
function cloneGanttTaskChapterMaps(src) {
  const out = new Map();
  if (!src) return out;
  for (const [task, m] of src.entries()) {
    out.set(task, new Map(m));
  }
  return out;
}

/** Calendar days spanned by a heatmap bucket (for prorating to avg hrs/week). */
function calendarDaysInHeatmapBucket(bucket, timeScale) {
  if (timeScale === 'Day') return 1;
  if (timeScale === 'Month') {
    const parts = String(bucket?.key || '').split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if (!y || !m) return 30;
    return new Date(y, m, 0).getDate();
  }
  if (bucket?.start instanceof Date && bucket?.end instanceof Date) {
    const ms = bucket.end.getTime() - bucket.start.getTime();
    const d = Math.round(ms / 86400000) + 1;
    return Math.min(14, Math.max(1, d));
  }
  return 7;
}

/** Hours per week if the same pace continued for a full 7-day week (total over `days` calendar days). */
function hoursToAvgWeeklyRate(totalHours, days) {
  const d = Math.max(1, Number(days) || 1);
  return (Number(totalHours) || 0) * (7 / d);
}

/** Every calendar ISO date from minIso through maxIso inclusive (local calendar days). */
function enumerateIsoCalendarDaysInclusive(minIso, maxIso) {
  const a = String(minIso || '').slice(0, 10);
  const b = String(maxIso || '').slice(0, 10);
  if (!a || !b || a > b) return [];
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  const out = [];
  const cur = new Date(y1, (m1 || 1) - 1, d1 || 1);
  const end = new Date(y2, (m2 || 1) - 1, d2 || 1);
  while (cur <= end) {
    out.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
    );
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/** Local YYYY-MM-DD for a Date (matches backend period day boundaries). */
function toIsoDateLocal(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

/**
 * Same bounded range as backend `getPeriodDateRange` (buildWhereClause).
 * Returns inclusive calendar start/end ISO strings, or null when period is All / unknown.
 */
function getDashPeriodIsoRange(periodRaw) {
  const raw = String(periodRaw || '').trim();
  if (!raw || raw.toLowerCase() === 'all') return null;

  const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (normalized) {
    case 'last 7 days':
    case 'last 7 day':
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case 'last 30 days':
    case 'last 30 day':
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case 'last 3 months':
    case '3m':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'last 6 months':
    case '6m':
      start.setMonth(start.getMonth() - 6);
      break;
    case 'last year':
    case '12m':
    case '1y':
      start.setMonth(start.getMonth() - 12);
      break;
    case 'this year':
      start.setFullYear(start.getFullYear(), 0, 1);
      break;
    default:
      return null;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { startIso: toIsoDateLocal(start), endIso: toIsoDateLocal(end) };
}

function employeeNameInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] || '';
    const b = parts[parts.length - 1][0] || '';
    return `${a}${b}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0] || '?').slice(0, 2).toUpperCase();
}

function ganttRowInitials(label, rowMode = 'employee') {
  if (rowMode === 'overall') {
    const parts = String(label || '').split('_').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    return String(label || '?').slice(0, 2).toUpperCase();
  }
  return employeeNameInitials(label);
}

/** Interpolate blue scale: white (0) -> dark blue (high) */
function purpleHeatAlpha(t) {
  const x = Math.max(0, Math.min(1, t));
  const light = [255, 255, 255];
  const dark = [30, 64, 175];
  const r = Math.round(light[0] + (dark[0] - light[0]) * x);
  const g = Math.round(light[1] + (dark[1] - light[1]) * x);
  const b = Math.round(light[2] + (dark[2] - light[2]) * x);
  return `rgb(${r},${g},${b})`;
}

const TasksByHoursTooltipContent = memo(({ payload, metaRef, metric = 'hours', wrapperRef = null, onMouseEnter, onMouseLeave, wrapperStyle, locked = false }) => {
  if (!payload?.length) return null;
  const empName = payload[0]?.payload?.name || '—';
  const taskRows = payload
    .map((p) => {
      const taskName = String(p.dataKey || '');
      const hours = Number(p.value) || 0;
      if (hours <= 0 || !taskName) return null;
      const mu = metaRef?.current?.get(`${empName}\t${taskName}`) || { hours: 0, units: 0 };
      return {
        task: taskName,
        hours,
        units: Number(mu.units) || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.hours - a.hours);
  if (!taskRows.length) return null;
  const totalHours = taskRows.reduce((s, r) => s + r.hours, 0);
  const totalUnits = taskRows.reduce((s, r) => s + r.units, 0);
  const isHours = metric === 'hours';
  const totalMetric = isHours ? totalHours : totalUnits;
  return (
    <div
      ref={wrapperRef}
      className="border-2 border-purple-500 rounded-lg p-3 shadow-2xl min-w-[160px] max-w-[280px]"
      style={{ backgroundColor: 'rgb(17 24 39)', zIndex: 10002, pointerEvents: 'auto', ...wrapperStyle }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onWheel={(e) => e.stopPropagation()}
    >
      <p className="text-white font-semibold text-sm">{empName}</p>
      {locked && (
        <p className="text-[11px] text-indigo-300 mt-1">
          Locked view (click another bar to change)
        </p>
      )}
      <p className="text-purple-300 text-xs mt-2">
        Total {isHours ? 'hours' : 'units'}:{' '}
        <span className="text-white font-bold">
          {isHours ? totalMetric.toFixed(1) : Math.round(totalMetric)}
        </span>
      </p>
      <div
        className="mt-2 border-t border-gray-700/70 pt-2 space-y-1 max-h-44 overflow-y-auto pr-1 custom-scrollbar"
        onWheel={(e) => e.stopPropagation()}
      >
        {taskRows.map((r) => (
          <p key={`${empName}-${r.task}`} className="text-[11px] text-gray-300 flex items-center justify-between gap-3">
            <span className="truncate max-w-[170px]" title={r.task}>{r.task}</span>
            <span className="tabular-nums text-white">
              {isHours ? `${r.hours.toFixed(1)}h` : `${Math.round(r.units)}u`}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
});
TasksByHoursTooltipContent.displayName = 'TasksByHoursTooltipContent';

const TasksByHoursTooltip = memo(({ active, payload, metaRef, metric = 'hours', lockedRowName, rowMap, stackKeys }) => {
  const [mousePos, setMousePos] = useState({ left: 0, top: 0 });
  const [pointerInside, setPointerInside] = useState(false);
  const lastPayloadRef = useRef(null);
  const insideRef = useRef(false);
  const rafRef = useRef(0);
  const pendingRef = useRef(null);

  const lockedPayload = useMemo(() => {
    if (!lockedRowName) return null;
    const row = rowMap?.get(lockedRowName);
    if (!row) return null;
    return (stackKeys || [])
      .map((key) => ({
        dataKey: key,
        value: Number(row[key]) || 0,
        payload: { name: lockedRowName },
      }))
      .filter((p) => p.value > 0);
  }, [lockedRowName, rowMap, stackKeys]);

  React.useEffect(() => {
    if (lockedPayload?.length) return;
    if (active && payload && payload.length) {
      lastPayloadRef.current = payload;
    } else if (!active && !pointerInside) {
      lastPayloadRef.current = null;
    }
  }, [active, payload, pointerInside, lockedPayload]);

  const effectivePayload = lockedPayload?.length ? lockedPayload : lastPayloadRef.current;
  const hasData = !!(effectivePayload && effectivePayload.length);
  const shouldShow = hasData && (active || pointerInside);
  const showLocked = !!(lockedPayload?.length);
  const shouldRender = showLocked || shouldShow;

  React.useEffect(() => {
    if (showLocked || !shouldShow) return undefined;
    const onMove = (e) => {
      if (insideRef.current) return;
      const margin = 10;
      const width = 290;
      const height = 330;
      const left = Math.max(margin, Math.min(e.clientX + 16, window.innerWidth - width - margin));
      const top = Math.max(margin, Math.min(e.clientY - 24, window.innerHeight - height - margin));
      pendingRef.current = { left, top };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        if (pendingRef.current) setMousePos(pendingRef.current);
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      pendingRef.current = null;
    };
  }, [shouldShow, showLocked]);

  const handleEnter = useCallback(() => {
    insideRef.current = true;
    setPointerInside(true);
  }, []);
  const handleLeave = useCallback(() => {
    insideRef.current = false;
    setPointerInside(false);
    if (!active && !showLocked) lastPayloadRef.current = null;
  }, [active, showLocked]);

  if (!shouldRender) return null;
  return createPortal(
    <TasksByHoursTooltipContent
      payload={effectivePayload}
      metaRef={metaRef}
      metric={metric}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      locked={showLocked}
      wrapperStyle={
        showLocked
          ? { position: 'fixed', right: 24, top: 170 }
          : { position: 'fixed', left: mousePos.left, top: mousePos.top }
      }
    />,
    document.body
  );
});
TasksByHoursTooltip.displayName = 'TasksByHoursTooltip';

const ProjectEmployeeTooltip = memo(({ active, payload, chartMeta }) => {
  if (!active || !payload?.length) return null;
  const seg = payload[0];
  const row = seg?.payload || {};
  const projName = row?.fullName || row?.name || '—';
  const key = String(seg?.dataKey ?? '');
  const empName =
    key === 'Other'
      ? 'Other'
      : chartMeta?.slugToEmp?.[key] || seg?.name || key;
  const hours = Number(seg?.value) || 0;
  if (hours <= 0) return null;
  const bKey = `${projName}\t${empName}`;
  const breakdown = chartMeta?.breakdownByProjEmp?.[bKey] || [];

  return (
    <div className="rounded-xl border border-cyan-500/60 bg-gray-900 p-3 text-xs shadow-xl min-w-[220px] max-w-sm">
      <p className="text-white font-semibold break-words">{projName}</p>
      <p className="text-cyan-200 mt-1">{empName}</p>
      <p className="text-cyan-100 mt-2">
        Hours: <span className="text-white font-bold tabular-nums">{hours.toFixed(1)}</span>
      </p>
      {breakdown.length > 0 ? (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
            {breakdown.map((t) => (
              <p key={`${bKey}-${t.task}`} className="text-gray-200 flex items-center justify-between gap-3">
                <span className="truncate max-w-[150px]" title={t.task}>{t.task}</span>
                <span className="text-white tabular-nums">{`${Number(t.hours || 0).toFixed(1)}h`}</span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-2">No task-level breakdown for this segment.</p>
      )}
    </div>
  );
});
ProjectEmployeeTooltip.displayName = 'ProjectEmployeeTooltip';

/** Mini treemap tile — task name + hours/units inside a project cluster card */
function ProjectEffortTreemapContent(props) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    index
  } = props;
  const projIdx =
    (typeof props.projColorIdx === 'number' ? props.projColorIdx : undefined) ??
    (typeof props.payload?.projColorIdx === 'number' ? props.payload.projColorIdx : (index ?? 0));
  const base = COLORS[(projIdx ?? 0) % COLORS.length];

  const pickFinite = (...vals) => {
    for (const v of vals) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };
  const sz = pickFinite(
    props?.payload?.size,
    props.size,
    props.value
  ) ?? 0;
  const maxFromData = pickFinite(
    props?.payload?.maxInCluster,
    props.maxInCluster
  );
  const minFromData = pickFinite(
    props?.payload?.minInCluster,
    props.minInCluster
  );
  const maxSz = (maxFromData && maxFromData > 0) ? maxFromData : Math.max(sz, 1);
  const minSz = minFromData ?? 0;
  const range = Math.max(maxSz - minSz, 0.0001);
  const valueRatio = Math.max(0, Math.min(1, (sz - minSz) / range));
  const rankRatioRaw = pickFinite(
    props?.payload?.rankRatio,
    props.rankRatio
  );
  const rankRatio = rankRatioRaw ?? valueRatio;
  const blended = 0.35 * valueRatio + 0.65 * rankRatio;
  const ratio = Number.isFinite(blended) ? Math.pow(Math.max(0, Math.min(1, blended)), 0.85) : 0.5;
  const fill = shadeByValue(base, ratio);
  if (width < 3 || height < 3) return null;

  const maxChars = Math.max(4, Math.min(28, Math.floor((width - 10) / 6.2)));
  const raw = String(name || '');
  const shortName = raw.length > maxChars ? `${raw.slice(0, maxChars - 1)}…` : raw;

  const subtitle = typeof props.subtitle === 'string' ? props.subtitle : '';
  const hoursMatch = subtitle.match(/([\d.]+)\s*h/i);
  const hoursFromSub = hoursMatch ? hoursMatch[1] : null;
  const canShowName = width >= 34 && height >= 14;
  const stacked = !!hoursFromSub && height >= 30 && width >= 42;
  const compact = !!hoursFromSub && !stacked && canShowName;
  const nameOnly = !hoursFromSub && canShowName;
  const labelMidY = y + height / 2;

  const textStroke = 'rgba(15, 23, 42, 0.92)';
  const textFill = '#f8fafc';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="rgba(15,23,42,0.85)"
        strokeWidth={1}
        rx={2}
      />
      {stacked && (
        <>
          <text
            x={x + 5}
            y={y + 14}
            fill={textFill}
            stroke={textStroke}
            strokeWidth={2}
            strokeLinejoin="round"
            paintOrder="stroke fill"
            fontSize={width < 70 ? 9 : 10}
            fontWeight={600}
            className="pointer-events-none"
          >
            {shortName}
          </text>
          <text
            x={x + 5}
            y={y + 28}
            fill="#e2e8f0"
            stroke={textStroke}
            strokeWidth={1.5}
            paintOrder="stroke fill"
            fontSize={width < 70 ? 8.5 : 9.5}
            fontWeight={500}
            className="pointer-events-none"
          >
            {`${Number(hoursFromSub).toFixed(0)}h`}
          </text>
        </>
      )}
      {compact && (
        <text
          x={x + 5}
          y={labelMidY}
          dominantBaseline="middle"
          fill={textFill}
          stroke={textStroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontSize={width < 60 ? 8 : 9}
          fontWeight={600}
          className="pointer-events-none"
        >
          {`${shortName} · ${Number(hoursFromSub).toFixed(0)}h`}
        </text>
      )}
      {nameOnly && (
        <text
          x={x + 5}
          y={labelMidY}
          dominantBaseline="middle"
          fill={textFill}
          stroke={textStroke}
          strokeWidth={2}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontSize={width < 64 ? 8 : 9}
          fontWeight={600}
          className="pointer-events-none"
        >
          {shortName}
        </text>
      )}
    </g>
  );
}

/** Portal-rendered tooltip for the project effort treemap.
 *  Escapes the cluster card so info is never clipped, and follows the cursor. */
function ProjectEffortPortalTooltip({ active, payload }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);
  useEffect(() => {
    const handleMove = (ev) => {
      const x = ev.clientX;
      const y = ev.clientY;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setPos({ x, y }));
    };
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  if (!active || !payload?.length || typeof document === 'undefined') return null;
  const node = payload[0]?.payload ?? payload[0];
  if (!node) return null;
  const TOOLTIP_W = 320;
  const TOOLTIP_H_EST = 140;
  const margin = 14;
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  let left = pos.x + 18;
  let top = pos.y + 18;
  if (left + TOOLTIP_W + margin > vw) left = pos.x - TOOLTIP_W - 18;
  if (top + TOOLTIP_H_EST + margin > vh) top = pos.y - TOOLTIP_H_EST - 18;
  left = Math.max(margin, Math.min(left, vw - TOOLTIP_W - margin));
  top = Math.max(margin, Math.min(top, vh - margin - 40));

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: TOOLTIP_W,
        zIndex: 10010,
        pointerEvents: 'none'
      }}
      className="rounded-xl border border-indigo-500/60 bg-gray-900/98 backdrop-blur-md p-3 text-xs shadow-2xl"
    >
      <p className="text-white font-bold mb-1 break-words leading-snug">{node?.name ?? '—'}</p>
      {(node?.detail || node?.subtitle) && (
        <p className="text-indigo-200 tabular-nums whitespace-pre-wrap break-words leading-snug">
          {node.detail || node.subtitle}
        </p>
      )}
    </div>,
    document.body
  );
}

function adjustColor(hex, amount) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `rgb(${r},${g},${b})`;
}

/** Convert a hex color (#rgb or #rrggbb) to HSL so we can vary only lightness. */
function hexToHsl(hex) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let H = 0;
  let S = 0;
  const L = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) H = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) H = (b - r) / d + 2;
    else H = (r - g) / d + 4;
    H *= 60;
  }
  return { h: Math.round(H), s: Math.round(S * 100), l: Math.round(L * 100) };
}

/** Map a 0..1 ratio (1 = largest task in cluster) to a heatmap-style fill
 *  in the cluster's base hue. Largest -> dark/saturated, smallest -> very pale. */
function shadeByValue(baseHex, ratio) {
  const r = Math.max(0, Math.min(1, ratio));
  const { h, s } = hexToHsl(baseHex);
  const lightness = 94 - r * 72;
  const saturation = Math.max(40, s - (1 - r) * 28);
  return `hsl(${h}, ${saturation}%, ${lightness}%)`;
}

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-10 h-10 text-white opacity-80" />
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
    <h3 className="text-white text-lg font-semibold">{title}</h3>
    {subtitle && <p className="text-white text-sm opacity-75 mt-1">{subtitle}</p>}
  </div>
);

const Visualization = () => {
  const location = useLocation();
  const dashTab = mainDashTabFromPath(location.pathname);

  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [timelineTotalProjects, setTimelineTotalProjects] = useState(0);
  const [timelineChunkStart, setTimelineChunkStart] = useState(0);
  const [workMode, setWorkMode] = useState([]);
  const [workModeByDays, setWorkModeByDays] = useState([]);
  const [elements, setElements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employeeTaskBreakdown, setEmployeeTaskBreakdown] = useState([]);
  const [employeeTaskRateSamples, setEmployeeTaskRateSamples] = useState([]);
  const [projectTaskEffort, setProjectTaskEffort] = useState([]);
  const [projectEmployeeBreakdown, setProjectEmployeeBreakdown] = useState([]);
  const [projectGanttRows, setProjectGanttRows] = useState([]);
  const [projectTreemapChunkStart, setProjectTreemapChunkStart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardRefreshing, setDashboardRefreshing] = useState(false);
  const hasDashboardLoadedRef = useRef(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [nightData, setNightData] = useState(null);
  const [nightLoading, setNightLoading] = useState(false);
  const [nightRefreshing, setNightRefreshing] = useState(false);
  const nightHasLoadedRef = useRef(false);
  const [crossBooks, setCrossBooks] = useState(null);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksRefreshing, setBooksRefreshing] = useState(false);
  const booksHasLoadedRef = useRef(false);
  const [selectedBookGroup, setSelectedBookGroup] = useState(null);
  const [bookSessionMin, setBookSessionMin] = useState(2);
  const crossBooksFetchSeq = useRef(0);
  const crossBookDetailRef = useRef(null);
  /** Cross-filter Work Distribution: selected employee from stacked bar (syncs heatmap) */
  const [selectedEmployeeFromStack, setSelectedEmployeeFromStack] = useState(null);
  const [lockedTasksTooltipRow, setLockedTasksTooltipRow] = useState(null);
  const [taskSplitMetric, setTaskSplitMetric] = useState('hours');
  const [effortTreemapMetric, setEffortTreemapMetric] = useState('hours');
  const tasksByHoursMetaRef = useRef(new Map());

  /** Invalidate in-flight prefetch when filters/tab change */
  const prefetchGenerationRef = useRef(0);
  /** Cached "All" dataset for instant switch: { teamKey, bundle } */
  const allDataCacheRef = useRef(null);
  /** Fresh values for scheduled auto-refresh */
  const refreshDashFiltersRef = useRef({ department: 'All', team: 'All', employee: 'All', period: DEFAULT_DASH_PERIOD });
  const timelineChunkStartRef = useRef(0);
  timelineChunkStartRef.current = timelineChunkStart;
  const applyDashboardBundleRef = useRef(null);
  const fetchDashboardBundleRef = useRef(null);
  /** Track prior overall-fetch signature to avoid splash loader on timeline-range-only changes. */
  const prevOverallFetchRef = useRef({ scopeKey: '', chunk: 0 });
  /** Avoid stale-route checks after awaits (fixes dropped applies under Strict Mode / fast tab switches). */
  const dashTabRef = useRef(mainDashTabFromPath(location.pathname));
  dashTabRef.current = mainDashTabFromPath(location.pathname);

  // Modal states for project details
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ganttHover, setGanttHover] = useState(null);
  const [ganttSortMode, setGanttSortMode] = useState('hours');
  const [ganttRowMode, setGanttRowMode] = useState('overall');
  const [teamGanttTimeScale, setTeamGanttTimeScale] = useState('Week');
  /** Employee × time heatmap columns (independent from Gantt time scale) */
  const [teamHoursHeatmapScale, setTeamHoursHeatmapScale] = useState('Week');
  /** 'total' = hours in bucket; 'avgWeekly' = equivalent avg hrs/week (prorated by calendar days in bucket) */
  const [teamHeatmapValueMode, setTeamHeatmapValueMode] = useState('total');
  const ganttViewportRef = useRef(null);
  const [ganttViewportWidth, setGanttViewportWidth] = useState(0);

  // Filter states
  const [allTeamsFromDB, setAllTeamsFromDB] = useState([]); // All teams from database
  const [filteredTeams, setFilteredTeams] = useState([]); // Teams filtered by department
  const [employeeNames, setEmployeeNames] = useState(['All']);
  
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_DASH_PERIOD);
  
  // Employee search state
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  /** Selected team(s) parsed as an array. Empty array = "All". */
  const selectedTeamList = useMemo(
    () => (selectedTeam && selectedTeam !== 'All'
      ? String(selectedTeam).split(',').map((t) => t.trim()).filter(Boolean)
      : []),
    [selectedTeam]
  );
  const selectedTeamSet = useMemo(() => new Set(selectedTeamList), [selectedTeamList]);
  const teamLabel = useMemo(() => {
    if (!selectedTeamList.length) return 'All';
    if (selectedTeamList.length === 1) return selectedTeamList[0];
    if (selectedTeamList.length <= 2) return selectedTeamList.join(', ');
    return `${selectedTeamList.length} teams selected`;
  }, [selectedTeamList]);
  const toggleTeamPick = useCallback(
    (teamName) => {
      const next = new Set(selectedTeamSet);
      if (next.has(teamName)) next.delete(teamName);
      else next.add(teamName);
      const arr = Array.from(next);
      const isFullSet = filteredTeams.length > 0 && arr.length === filteredTeams.length;
      const newValue = arr.length === 0 || isFullSet ? 'All' : arr.join(',');
      setSelectedTeam(newValue);
      setSelectedEmployee('All');
      setEmployeeSearch('');
    },
    [selectedTeamSet, filteredTeams]
  );
  const clearTeamPicks = useCallback(() => {
    setSelectedTeam('All');
    setSelectedEmployee('All');
    setEmployeeSearch('');
  }, []);

  // Hardcoded departments (frontend only)
  const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

  const isAllDepartmentView =
    selectedDepartment === 'All' && selectedTeam === 'All' && selectedEmployee === 'All';
  const isDepartmentTeamView =
    selectedDepartment !== 'All' && selectedTeam === 'All' && selectedEmployee === 'All';
  const isEmployeeDetailView =
    selectedDepartment !== 'All' && selectedTeam !== 'All' && selectedEmployee !== 'All';

  const effectiveGanttRowMode =
    selectedEmployee !== 'All' ? 'employee' : ganttRowMode;
  const isOverallGanttRows = effectiveGanttRowMode === 'overall';

  const teamToDepartment = useCallback(
    (teamName) => {
      const t = String(teamName || '').trim();
      if (!t) return null;
      if (DEPARTMENT_TEAM_MAPPING.DTP?.(t)) return 'DTP';
      if (DEPARTMENT_TEAM_MAPPING.Editorial?.(t)) return 'Editorial';
      if (DEPARTMENT_TEAM_MAPPING['Digital Marketing']?.(t)) return 'Digital Marketing';
      return null;
    },
    []
  );

  const workModeByDaysChartData = useMemo(() => {
    return workModeByDays || [];
  }, [workModeByDays]);

  const employeeChapterMap = useMemo(
    () => (isEmployeeDetailView ? buildChapterMapFromGantt(projectGanttRows, selectedEmployee) : new Map()),
    [isEmployeeDetailView, projectGanttRows, selectedEmployee]
  );

  const employeeTopProjectsStack = useMemo(() => {
    if (!isEmployeeDetailView) return { rows: [], stackKeys: [] };
    const flat = projectTaskEffort || [];
    const byProj = new Map();
    for (const r of flat) {
      const p = r.project_name;
      const task = r.task_name;
      const h = Number(r.hours) || 0;
      if (!p || !task || h <= 0) continue;
      if (!byProj.has(p)) byProj.set(p, new Map());
      const tm = byProj.get(p);
      tm.set(task, (tm.get(task) || 0) + h);
    }
    const projTotals = [...byProj.entries()]
      .map(([name, tm]) => ({ name, total: [...tm.values()].reduce((s, v) => s + v, 0), tasks: tm }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    const taskTotals = {};
    for (const { tasks } of projTotals) {
      for (const [t, h] of tasks.entries()) taskTotals[t] = (taskTotals[t] || 0) + h;
    }
    const stackKeys = Object.entries(taskTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
    const rows = projTotals.map(({ name, tasks, total }) => {
      const row = {
        name: name.length > 32 ? `${name.slice(0, 30)}…` : name,
        fullName: name,
        _total: total,
      };
      for (const k of stackKeys) row[k] = tasks.get(k) || 0;
      return row;
    });
    return { rows, stackKeys };
  }, [isEmployeeDetailView, projectTaskEffort]);

  const employeeWorkModePie = useMemo(() => {
    if (!isEmployeeDetailView) return [];
    const total = (workMode || []).reduce((s, w) => s + (Number(w.hours) || 0), 0) || 1;
    return (workMode || [])
      .filter((w) => (Number(w.hours) || 0) > 0)
      .map((w) => ({
        name: w.mode,
        hours: Number(w.hours) || 0,
        pct: ((Number(w.hours) || 0) / total) * 100,
        fill: WORK_MODE_COLORS[w.mode] || COLORS[0],
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [isEmployeeDetailView, workMode]);

  const employeeProjectDonut = useMemo(() => {
    if (!isEmployeeDetailView) return { slices: [], total: 0 };
    const byProj = {};
    for (const r of projectTaskEffort || []) {
      const p = r.project_name;
      const h = Number(r.hours) || 0;
      if (!p || h <= 0) continue;
      byProj[p] = (byProj[p] || 0) + h;
    }
    const total = Object.values(byProj).reduce((s, v) => s + v, 0) || 1;
    const slices = Object.entries(byProj)
      .sort((a, b) => b[1] - a[1])
      .map(([name, hours], i) => ({
        name: name.length > 28 ? `${name.slice(0, 26)}…` : name,
        fullName: name,
        value: hours,
        hours,
        pct: (hours / total) * 100,
        fill: COLORS[i % COLORS.length],
      }));
    return { slices, total };
  }, [isEmployeeDetailView, projectTaskEffort]);

  const employeeProjectTaskHeatmap = useMemo(() => {
    if (!isEmployeeDetailView) return { projects: [], tasks: [], cellMap: new Map(), hMin: 0, hMax: 1 };
    const projTotals = {};
    const taskTotals = {};
    const cellMap = new Map();
    for (const r of projectTaskEffort || []) {
      const p = r.project_name;
      const t = r.task_name;
      const h = Number(r.hours) || 0;
      if (!p || !t || h <= 0) continue;
      projTotals[p] = (projTotals[p] || 0) + h;
      taskTotals[t] = (taskTotals[t] || 0) + h;
      const k = `${p}\t${t}`;
      cellMap.set(k, { hours: (cellMap.get(k)?.hours || 0) + h, units: (cellMap.get(k)?.units || 0) + (Number(r.units) || 0) });
    }
    const projects = Object.entries(projTotals).sort((a, b) => b[1] - a[1]).map(([p]) => p);
    const tasks = Object.entries(taskTotals).sort((a, b) => b[1] - a[1]).map(([t]) => t);
    let hMin = Infinity;
    let hMax = -Infinity;
    for (const v of cellMap.values()) {
      if (v.hours > 0) {
        hMin = Math.min(hMin, v.hours);
        hMax = Math.max(hMax, v.hours);
      }
    }
    if (hMin === Infinity) {
      hMin = 0;
      hMax = 1;
    }
    return { projects, tasks, cellMap, hMin, hMax };
  }, [isEmployeeDetailView, projectTaskEffort]);

  const employeeContributionModel = useMemo(() => {
    if (!isEmployeeDetailView) return null;
    const flat = (employeeTaskBreakdown || []).filter(
      (r) => String(r.employee || '').trim() === String(selectedEmployee).trim()
    );
    const iTasks = new Map();
    const cTasks = new Map();
    let iH = 0;
    let cH = 0;
    for (const r of flat) {
      const task = r.task;
      const h = Number(r.hours) || 0;
      if (!task || h <= 0) continue;
      const mode = classifyTaskIndependentOrCollab(task);
      if (mode === 'C') {
        cH += h;
        cTasks.set(task, (cTasks.get(task) || 0) + h);
      } else {
        iH += h;
        iTasks.set(task, (iTasks.get(task) || 0) + h);
      }
    }
    const total = iH + cH || 1;
    const toSlices = (m) =>
      [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], idx) => ({ name, value, fill: COLORS[idx % COLORS.length] }));
    return {
      iH,
      cH,
      total,
      indepPct: (iH / total) * 100,
      collabPct: (cH / total) * 100,
      indepSlices: toSlices(iTasks),
      collabSlices: toSlices(cTasks),
    };
  }, [isEmployeeDetailView, employeeTaskBreakdown, selectedEmployee]);

  const employeeTaskBoxPlot = useMemo(() => {
    if (!isEmployeeDetailView) return [];
    const emp = String(selectedEmployee).trim();
    const byTask = new Map();
    for (const r of employeeTaskRateSamples || []) {
      if (String(r.employee || '').trim() !== emp) continue;
      const task = r.task;
      const hours = Number(r.hours) || 0;
      const units = Number(r.units) || 0;
      if (!task || hours <= 0 || units <= 0) continue;
      const rate = hours / units;
      if (!byTask.has(task)) byTask.set(task, []);
      byTask.get(task).push(rate);
    }
    if (byTask.size === 0) {
      for (const r of employeeTaskBreakdown || []) {
        if (String(r.employee || '').trim() !== emp) continue;
        const task = r.task;
        const hours = Number(r.hours) || 0;
        const units = Number(r.units) || 0;
        if (!task || hours <= 0 || units <= 0) continue;
        const rate = hours / units;
        if (!byTask.has(task)) byTask.set(task, []);
        byTask.get(task).push(rate);
      }
    }
    return [...byTask.entries()]
      .map(([task, samples]) => ({ task, stats: quartiles(samples) }))
      .filter((t) => t.stats.samples.length > 0)
      .sort((a, b) => b.stats.median - a.stats.median)
      .slice(0, 16);
  }, [isEmployeeDetailView, employeeTaskRateSamples, employeeTaskBreakdown, selectedEmployee]);

  const workDistributionAgg = useMemo(() => {
    const flatRaw = employeeTaskBreakdown || [];
    const flat = isAllDepartmentView
      ? flatRaw
          .map((r) => ({ ...r, employee: teamToDepartment(r.team) }))
          .filter((r) => r.employee)
      : isDepartmentTeamView
        ? flatRaw
            .filter((r) => r.team)
            .map((r) => ({
              ...r,
              employee: r.team,
            }))
        : flatRaw;
    const taskTotals = {};
    for (const r of flat) {
      taskTotals[r.task] = (taskTotals[r.task] || 0) + (r.hours || 0);
    }
    const allTasks = Object.entries(taskTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
    const allTaskSet = new Set(allTasks);

    const empTotals = {};
    for (const r of flat) {
      empTotals[r.employee] = (empTotals[r.employee] || 0) + (r.hours || 0);
    }
    const topEmps = Object.entries(empTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([e]) => e);
    const topEmpSet = new Set(topEmps);

    const meta = new Map();
    for (const r of flat) {
      if (!topEmpSet.has(r.employee)) continue;
      const taskLabel = allTaskSet.has(r.task) ? r.task : 'Other';
      const k = `${r.employee}\t${taskLabel}`;
      const o = meta.get(k) || { hours: 0, units: 0 };
      o.hours += r.hours || 0;
      o.units += r.units || 0;
      meta.set(k, o);
    }

    const rows = topEmps.map((emp) => {
      const row = { name: emp };
      for (const t of allTasks) {
        const kk = `${emp}\t${t}`;
        row[t] = taskSplitMetric === 'hours'
          ? (meta.get(kk)?.hours || 0)
          : (meta.get(kk)?.units || 0);
      }
      const ok = `${emp}\tOther`;
      const ov = meta.get(ok)?.hours || 0;
      const ovUnits = meta.get(ok)?.units || 0;
      if ((taskSplitMetric === 'hours' ? ov : ovUnits) > 0) {
        row.Other = taskSplitMetric === 'hours' ? ov : ovUnits;
      }
      return row;
    });

    const stackKeys = [...allTasks];
    const hasOther = rows.some((r) => r.Other > 0);
    if (hasOther) stackKeys.push('Other');

    tasksByHoursMetaRef.current = meta;

    /** Heatmap: every employee and every task in the current filtered dataset (not capped like the stacked bar). */
    const heatEmpTotals = {};
    const heatTaskTotals = {};
    const heatMeta = new Map();
    for (const r of flat) {
      const emp = r.employee;
      const task = r.task;
      if (emp == null || String(emp).trim() === '') continue;
      if (task == null || String(task).trim() === '') continue;
      heatEmpTotals[emp] = (heatEmpTotals[emp] || 0) + (r.hours || 0);
      heatTaskTotals[task] = (heatTaskTotals[task] || 0) + (r.hours || 0);
      const hk = `${emp}\t${task}`;
      const ho = heatMeta.get(hk) || { hours: 0, units: 0 };
      ho.hours += r.hours || 0;
      ho.units += r.units || 0;
      heatMeta.set(hk, ho);
    }
    const allHeatEmps = Object.entries(heatEmpTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([e]) => e);
    const taskColsHeat = Object.entries(heatTaskTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);

    let heatRows = [...allHeatEmps];
    if (selectedEmployeeFromStack) {
      const one = allHeatEmps.filter((e) => e === selectedEmployeeFromStack);
      heatRows = one.length ? one : [selectedEmployeeFromStack];
    }

    const heatCells = [];
    let hMin = Infinity;
    let hMax = -Infinity;
    for (const emp of heatRows) {
      for (const task of taskColsHeat) {
        const k = `${emp}\t${task}`;
        const cell = heatMeta.get(k);
        const h = cell?.hours || 0;
        if (h > 0) {
          hMin = Math.min(hMin, h);
          hMax = Math.max(hMax, h);
        }
        heatCells.push({ employee: emp, task, hours: h, units: cell?.units || 0 });
      }
    }
    if (hMin === Infinity) {
      hMin = 0;
      hMax = 1;
    }

    const heatCellMap = new Map(
      heatCells.map((c) => [`${c.employee}\t${c.task}`, c])
    );

    return { rows, stackKeys, heatRows, taskColsHeat, heatCells, heatCellMap, hMin, hMax };
  }, [employeeTaskBreakdown, selectedEmployeeFromStack, isDepartmentTeamView, isAllDepartmentView, teamToDepartment, taskSplitMetric]);

  const workModeChartMinWidth = useMemo(() => {
    const n = workModeByDaysChartData?.length || 0;
    // Keep bars visually consistent: small n shouldn't explode width; large n scrolls.
    const perBar = 64;
    const padding = 260; // room for rotated ticks + legend/tooltip breathing space
    return Math.max(560, Math.min(1200, n * perBar + padding));
  }, [workModeByDaysChartData]);

  const workModeChartHeight = useMemo(() => {
    const n = workModeByDaysChartData?.length || 0;
    // Grow a bit with more categories but cap; then the wrapper scrolls.
    return Math.max(380, Math.min(520, 320 + n * 6));
  }, [workModeByDaysChartData]);

  const workModeBarSize = useMemo(() => {
    const n = workModeByDaysChartData?.length || 0;
    if (n <= 3) return 60; // department view: slimmer bars + larger gaps
    if (n <= 8) return 48; // team view
    if (n <= 16) return 34;
    return 26; // many employees
  }, [workModeByDaysChartData]);
  const projectEmployeeMinWidth = useMemo(
    () => Math.max(1200, (projectEmployeeBreakdown?.length ? new Set((projectEmployeeBreakdown || []).map((r) => r.project_name).filter(Boolean)).size : 0) * 110),
    [projectEmployeeBreakdown]
  );

  const projectTreemapData = useMemo(() => {
    const flat = projectTaskEffort || [];
    const byProj = {};
    for (const r of flat) {
      const p = r.project_name;
      if (!byProj[p]) byProj[p] = [];
      byProj[p].push(r);
    }
    const projTotals = Object.entries(byProj).map(([name, arr]) => {
      const hours = arr.reduce((s, x) => s + (x.hours || 0), 0);
      const units = arr.reduce((s, x) => s + (x.units || 0), 0);
      return { name, hours, units, arr };
    });
    projTotals.sort((a, b) => b.hours - a.hours);
    const totalProjects = projTotals.length;
    const chunkStart = Math.max(
      0,
      Math.min(projectTreemapChunkStart, Math.max(0, totalProjects - 1))
    );
    const picked = projTotals.slice(chunkStart, chunkStart + PROJECT_TREEMAP_CHUNK);
    const grandHours = picked.reduce((s, p) => s + p.hours, 0);
    const grandUnits = picked.reduce((s, p) => s + p.units, 0);

    const clusters = picked.map((p, projIdx) => {
      const rawTasks = p.arr
        .filter((row) =>
          effortTreemapMetric === 'hours' ? (row.hours || 0) > 0 : (row.units || 0) > 0
        )
        .map((row) => {
          const hrs = row.hours || 0;
          const un = row.units || 0;
          const size =
            effortTreemapMetric === 'hours' ? Math.max(hrs, 0.001) : Math.max(un, 0.001);
          const metricTotal = effortTreemapMetric === 'hours' ? p.hours : p.units;
          const pctProj = metricTotal > 0 ? (size / metricTotal) * 100 : 0;
          const shortH = hrs >= 100 ? `${Math.round(hrs)}h` : `${hrs.toFixed(1)}h`;
          const shortU = `${un}u`;
          return {
            name: row.task_name,
            size,
            projColorIdx: projIdx,
            hours: hrs,
            units: un,
            pctProj,
            subtitle: `${shortH} · ${shortU}`,
            detail: `Project: ${p.name}\n${hrs.toFixed(1)} h · ${un} units · ${pctProj.toFixed(1)}% of ${p.name}`
          };
        })
        .sort((a, b) => b.size - a.size);
      const maxSize = rawTasks.length ? rawTasks[0].size : 0;
      const minSize = rawTasks.length ? rawTasks[rawTasks.length - 1].size : 0;
      const totalRanks = Math.max(rawTasks.length - 1, 1);
      const tasks = rawTasks.map((t, rank) => ({
        ...t,
        maxInCluster: maxSize,
        minInCluster: minSize,
        rank,
        rankRatio: 1 - rank / totalRanks
      }));
      const metricVal = effortTreemapMetric === 'hours' ? p.hours : p.units;
      const grandMetric = effortTreemapMetric === 'hours' ? grandHours : grandUnits;
      const pctOfScope = grandMetric > 0 ? (metricVal / grandMetric) * 100 : 0;
      return {
        name: p.name,
        projIdx,
        hours: p.hours,
        units: p.units,
        metricValue: metricVal,
        pctOfScope,
        tasks
      };
    });

    const chunkOptions = [];
    for (let i = 0; i < totalProjects; i += PROJECT_TREEMAP_CHUNK) {
      const end = Math.min(i + PROJECT_TREEMAP_CHUNK, totalProjects);
      chunkOptions.push({
        value: i,
        label: `${i + 1}-${end}`,
      });
    }
    return {
      clusters,
      totalProjects,
      chunkStart,
      chunkOptions,
      grandTotals: {
        hours: grandHours,
        units: grandUnits
      }
    };
  }, [projectTaskEffort, effortTreemapMetric, projectTreemapChunkStart]);

  const projectClusterRows = useMemo(() => {
    const list = projectTreemapData.clusters || [];
    if (!list.length) return [];
    const n = list.length;
    const topCount = n <= 2 ? n : Math.ceil(n / 2);
    const top = list.slice(0, topCount);
    const bottom = list.slice(topCount);
    return [top, bottom].filter((r) => r.length);
  }, [projectTreemapData]);

  const projectEmployeeChart = useMemo(() => {
    const flatRaw = projectEmployeeBreakdown || [];
    const flat = flatRaw
      .map((r) => ({
        project_name: r.project_name,
        employee: r.employee ?? r.name,
        hours: Number(r.hours) || 0,
        units: Number(r.units) || 0,
        task_breakdown: Array.isArray(r.task_breakdown) ? r.task_breakdown : [],
      }))
      .filter(
        (r) =>
          r.project_name &&
          String(r.project_name).trim() !== '' &&
          r.employee != null &&
          String(r.employee).trim() !== ''
      );

    const projTotals = {};
    for (const r of flat) {
      projTotals[r.project_name] = (projTotals[r.project_name] || 0) + r.hours;
    }
    const topProjNames = Object.entries(projTotals)
      .filter(([, totalHours]) => (Number(totalHours) || 0) > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([n]) => n);
    if (!topProjNames.length) {
      return { rows: [], stackKeys: [], slugToEmp: {}, breakdownByProjEmp: {} };
    }

    const setP = new Set(topProjNames);
    const empByProj = {};
    for (const r of flat) {
      if (!setP.has(r.project_name)) continue;
      const k = `${r.project_name}\t${r.employee}`;
      if (!empByProj[k]) empByProj[k] = { hours: 0, units: 0 };
      empByProj[k].hours += r.hours;
      empByProj[k].units += r.units;
    }

    const empTotals = {};
    for (const r of flat) {
      if (!setP.has(r.project_name)) continue;
      empTotals[r.employee] = (empTotals[r.employee] || 0) + r.hours;
    }

    let topEmps = Object.entries(empTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([e]) => e);

    if (!topEmps.length) {
      const rows = topProjNames.map((proj) => ({
        name: proj.length > 36 ? `${proj.slice(0, 34)}…` : proj,
        fullName: proj,
        _hours: projTotals[proj] || 0,
      }));
      return {
        rows,
        stackKeys: ['_hours'],
        slugToEmp: { _hours: 'All hours' },
        breakdownByProjEmp: {},
      };
    }

    const slugToEmp = {};
    const empSlug = {};
    topEmps.forEach((emp, i) => {
      const slug = `pe${i}`;
      empSlug[emp] = slug;
      slugToEmp[slug] = emp;
    });
    const rows = topProjNames.map((proj) => {
      const row = { name: proj.length > 36 ? `${proj.slice(0, 34)}…` : proj, fullName: proj };
      for (const e of topEmps) {
        const cell = empByProj[`${proj}\t${e}`];
        row[empSlug[e]] = cell?.hours || 0;
      }
      return row;
    });
    const breakdownByProjEmp = {};
    for (const r of flat) {
      if (!setP.has(r.project_name)) continue;
      const emp = r.employee;
      if (!Array.isArray(r.task_breakdown) || !r.task_breakdown.length) continue;
      const k = `${r.project_name}\t${emp}`;
      const taskAgg = breakdownByProjEmp[k] || {};
      for (const t of r.task_breakdown) {
        const tk = String(t.task || 'Unspecified');
        taskAgg[tk] = (taskAgg[tk] || 0) + (Number(t.hours) || 0);
      }
      breakdownByProjEmp[k] = taskAgg;
    }
    Object.keys(breakdownByProjEmp).forEach((k) => {
      breakdownByProjEmp[k] = Object.entries(breakdownByProjEmp[k])
        .map(([task, h]) => ({ task, hours: h }))
        .sort((a, b) => b.hours - a.hours);
    });

    const stackKeys = topEmps.map((e) => empSlug[e]);
    return { rows, stackKeys, slugToEmp, breakdownByProjEmp };
  }, [projectEmployeeBreakdown]);

  /** Timeline Gantt: Overall = one row per team; Employee = one row per person (same /project-gantt payload). */
  const employeeGanttModel = useMemo(() => {
    const rows = Array.isArray(projectGanttRows) ? projectGanttRows : [];
    const rowMode = isOverallGanttRows ? 'overall' : 'employee';
    if (!rows.length) {
      return {
        employees: [],
        buckets: [],
        colWidth: 42,
        chartWidth: 0,
        rowHeights: new Map(),
        taskColor: {},
        dateRangeLabel: '',
        empColW: GANTT_TEAM_EMPLOYEE_COL,
        rowMode,
      };
    }

    const dateSet = new Set();
    const byRow = new Map();
    const employeeTeamMap = new Map();
    for (const r of rows) {
      const emp = String(r?.employee || r?.name || '').trim();
      const tm = String(r?.team || '').trim();
      if (emp && tm && !employeeTeamMap.has(emp)) employeeTeamMap.set(emp, tm);
    }

    for (const r of rows) {
      const project = String(r?.project || r?.project_name || '').trim();
      const employee = String(r?.employee || r?.name || '').trim();
      const team = String(r?.team || '').trim() || employeeTeamMap.get(employee) || '';
      const rowLabel = isOverallGanttRows ? team : employee;
      const date = String(r?.date || '').slice(0, 10);
      if (!project || !rowLabel || !date) continue;
      dateSet.add(date);

      if (!byRow.has(rowLabel)) byRow.set(rowLabel, new Map());
      const projMap = byRow.get(rowLabel);
      if (!projMap.has(project)) projMap.set(project, new Map());
      const dayMap = projMap.get(project);

      const existing = dayMap.get(date) || { hours: 0, tasks: new Map(), taskChapters: new Map() };
      existing.hours += Number(r?.hours) || 0;
      if (Array.isArray(r?.tasks)) {
        for (const t of r.tasks) {
          const taskName = String(t?.task || 'Unspecified').trim() || 'Unspecified';
          const th = Number(t?.hours) || 0;
          existing.tasks.set(taskName, (existing.tasks.get(taskName) || 0) + th);
          if (!existing.taskChapters.has(taskName)) existing.taskChapters.set(taskName, new Map());
          const chm = existing.taskChapters.get(taskName);
          if (Array.isArray(t.chapters) && t.chapters.length > 0) {
            for (const c of t.chapters) {
              const ckey =
                c.chapter != null && String(c.chapter).trim() !== '' ? String(c.chapter).trim() : '—';
              const hh = Number(c.hours) || 0;
              addChapterHoursToMap(chm, ckey, hh);
            }
          } else if (th > 0) {
            addChapterHoursToMap(chm, '—', th);
          }
        }
      }
      dayMap.set(date, existing);
    }

    const dates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    const { buckets, dateToBucketKey } = buildTeamGanttBuckets(dates, teamGanttTimeScale);

    const cellMap = new Map();
    for (const [rowLabel, projMap] of byRow.entries()) {
      for (const [project, dayMap] of projMap.entries()) {
        for (const [dateStr, v] of dayMap.entries()) {
          const bk = dateToBucketKey.get(dateStr);
          if (!bk) continue;
          const key = `${rowLabel}\t${project}\t${bk}`;
          if (!cellMap.has(key)) cellMap.set(key, { hours: 0, tasks: new Map(), taskChapters: new Map() });
          const cell = cellMap.get(key);
          cell.hours += v.hours || 0;
          for (const [tk, h] of v.tasks.entries()) {
            cell.tasks.set(tk, (cell.tasks.get(tk) || 0) + h);
          }
          mergeGanttTaskChapterMaps(cell.taskChapters, v.taskChapters);
        }
      }
    }

    const taskTotals = new Map();
    for (const cell of cellMap.values()) {
      for (const [tk, h] of cell.tasks.entries()) {
        taskTotals.set(tk, (taskTotals.get(tk) || 0) + h);
      }
    }
    const taskColor = {};
    Array.from(taskTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([task], i) => {
        taskColor[task] = COLORS[i % COLORS.length];
      });

    const ascDates = [...dates].sort((a, b) => a.localeCompare(b));
    const minD = ascDates[0];
    const maxD = ascDates[ascDates.length - 1];
    let dateRangeLabel = '';
    if (minD && maxD) {
      const [y1, m1, d1] = minD.split('-').map(Number);
      const [y2, m2, d2] = maxD.split('-').map(Number);
      const dt1 = new Date(y1, m1 - 1, d1);
      const dt2 = new Date(y2, m2 - 1, d2);
      dateRangeLabel = `${dt1.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${dt2.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    const usableWidth = Math.max(320, (Number(ganttViewportWidth) || 0) - GANTT_TEAM_EMPLOYEE_COL);
    const minColW = teamGanttTimeScale === 'Month' ? 88 : teamGanttTimeScale === 'Week' ? 108 : 28;
    const colWidth = buckets.length > 0
      ? Math.max(minColW, Math.min(140, usableWidth / buckets.length))
      : 42;
    const chartWidth = Math.max(usableWidth, buckets.length * colWidth);

    const employees = Array.from(byRow.entries())
      .map(([rowLabel, projMap]) => {
        const lanes = Array.from(projMap.entries())
          .map(([project, dayMap]) => {
            const withData = [];
            for (let bi = 0; bi < buckets.length; bi += 1) {
              const b = buckets[bi];
              const cell = cellMap.get(`${rowLabel}\t${project}\t${b.key}`);
              if (!cell || !(cell.hours > 0)) continue;
              withData.push({
                idx: bi,
                bucketKey: b.key,
                hours: cell.hours,
                tasks: cell.tasks,
                taskChapters: cell.taskChapters,
              });
            }

            const segments = [];
            let run = null;
            for (const d of withData) {
              if (!run) {
                run = {
                  project,
                  startIdx: d.idx,
                  endIdx: d.idx,
                  totalHours: d.hours || 0,
                  tasks: new Map(d.tasks),
                  taskChapters: cloneGanttTaskChapterMaps(d.taskChapters),
                };
                continue;
              }
              if (d.idx === run.endIdx + 1) {
                run.endIdx = d.idx;
                run.totalHours += d.hours || 0;
                for (const [tk, h] of d.tasks.entries()) run.tasks.set(tk, (run.tasks.get(tk) || 0) + h);
                mergeGanttTaskChapterMaps(run.taskChapters, d.taskChapters);
              } else {
                segments.push(run);
                run = {
                  project,
                  startIdx: d.idx,
                  endIdx: d.idx,
                  totalHours: d.hours || 0,
                  tasks: new Map(d.tasks),
                  taskChapters: cloneGanttTaskChapterMaps(d.taskChapters),
                };
              }
            }
            if (run) segments.push(run);

            const totalHours = segments.reduce((s, seg) => s + (seg.totalHours || 0), 0);
            const lastIdx = segments.length ? Math.max(...segments.map((seg) => seg.endIdx)) : -1;
            return { project, totalHours, segments, lastIdx };
          })
          .filter((l) => l.totalHours > 0)
          .sort((a, b) => b.totalHours - a.totalHours);

        const totalHours = lanes.reduce((s, l) => s + l.totalHours, 0);
        const mostRecentIdx = lanes.length ? Math.max(...lanes.map((l) => l.lastIdx)) : -1;
        return { employee: rowLabel, lanes, totalHours, mostRecentIdx };
      })
      .filter((e) => e.totalHours > 0);

    employees.sort((a, b) => {
      if (ganttSortMode === 'recent') {
        if (b.mostRecentIdx !== a.mostRecentIdx) return b.mostRecentIdx - a.mostRecentIdx;
        if (b.totalHours !== a.totalHours) return b.totalHours - a.totalHours;
        return a.employee.localeCompare(b.employee);
      }
      if (b.totalHours !== a.totalHours) return b.totalHours - a.totalHours;
      if (b.mostRecentIdx !== a.mostRecentIdx) return b.mostRecentIdx - a.mostRecentIdx;
      return a.employee.localeCompare(b.employee);
    });

    const LANE_H = 42;
    const rowHeights = new Map(
      employees.map((e) => [e.employee, Math.max(48, e.lanes.length * LANE_H + 12)])
    );

    return {
      employees,
      buckets,
      colWidth,
      chartWidth,
      rowHeights,
      taskColor,
      dateRangeLabel,
      empColW: GANTT_TEAM_EMPLOYEE_COL,
      laneHeight: LANE_H,
      rowMode,
    };
  }, [projectGanttRows, ganttViewportWidth, ganttSortMode, teamGanttTimeScale, isOverallGanttRows]);

  /** Single employee: Y = projects, X = time buckets, bar stacks = tasks. */
  const employeeProjectGanttModel = useMemo(() => {
    if (!isEmployeeDetailView) {
      return { projects: [], buckets: [], colWidth: 42, chartWidth: 0, rowHeights: new Map(), taskColor: {}, dateRangeLabel: '', projColW: GANTT_PROJECT_COL };
    }
    const emp = String(selectedEmployee).trim();
    const rows = (Array.isArray(projectGanttRows) ? projectGanttRows : []).filter(
      (r) => String(r?.employee || r?.name || '').trim() === emp
    );
    if (!rows.length) {
      return { projects: [], buckets: [], colWidth: 42, chartWidth: 0, rowHeights: new Map(), taskColor: {}, dateRangeLabel: '', projColW: GANTT_PROJECT_COL };
    }

    const dateSet = new Set();
    const byProject = new Map();

    for (const r of rows) {
      const project = String(r?.project || r?.project_name || '').trim();
      const date = String(r?.date || '').slice(0, 10);
      if (!project || !date) continue;
      dateSet.add(date);
      if (!byProject.has(project)) byProject.set(project, new Map());
      const dayMap = byProject.get(project);
      const existing = dayMap.get(date) || { hours: 0, tasks: new Map(), taskChapters: new Map() };
      existing.hours += Number(r?.hours) || 0;
      if (Array.isArray(r?.tasks)) {
        for (const t of r.tasks) {
          const taskName = String(t?.task || 'Unspecified').trim() || 'Unspecified';
          const th = Number(t?.hours) || 0;
          existing.tasks.set(taskName, (existing.tasks.get(taskName) || 0) + th);
          if (!existing.taskChapters.has(taskName)) existing.taskChapters.set(taskName, new Map());
          const chm = existing.taskChapters.get(taskName);
          if (Array.isArray(t.chapters) && t.chapters.length) {
            for (const c of t.chapters) {
              const ckey = c.chapter != null && String(c.chapter).trim() !== '' ? String(c.chapter).trim() : '—';
              addChapterHoursToMap(chm, ckey, Number(c.hours) || 0);
            }
          } else if (th > 0) addChapterHoursToMap(chm, '—', th);
        }
      }
      dayMap.set(date, existing);
    }

    const dates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    const { buckets, dateToBucketKey } = buildTeamGanttBuckets(dates, teamGanttTimeScale);
    const cellMap = new Map();
    for (const [project, dayMap] of byProject.entries()) {
      for (const [dateStr, v] of dayMap.entries()) {
        const bk = dateToBucketKey.get(dateStr);
        if (!bk) continue;
        const key = `${project}\t${bk}`;
        if (!cellMap.has(key)) cellMap.set(key, { hours: 0, tasks: new Map(), taskChapters: new Map() });
        const cell = cellMap.get(key);
        cell.hours += v.hours || 0;
        for (const [tk, h] of v.tasks.entries()) cell.tasks.set(tk, (cell.tasks.get(tk) || 0) + h);
        mergeGanttTaskChapterMaps(cell.taskChapters, v.taskChapters);
      }
    }

    const taskTotals = new Map();
    for (const cell of cellMap.values()) {
      for (const [tk, h] of cell.tasks.entries()) taskTotals.set(tk, (taskTotals.get(tk) || 0) + h);
    }
    const taskColor = {};
    Array.from(taskTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([task], i) => {
        taskColor[task] = COLORS[i % COLORS.length];
      });

    const ascDates = [...dates].sort((a, b) => a.localeCompare(b));
    const minD = ascDates[0];
    const maxD = ascDates[ascDates.length - 1];
    let dateRangeLabel = '';
    if (minD && maxD) {
      const [y1, m1, d1] = minD.split('-').map(Number);
      const [y2, m2, d2] = maxD.split('-').map(Number);
      const dt1 = new Date(y1, m1 - 1, d1);
      const dt2 = new Date(y2, m2 - 1, d2);
      dateRangeLabel = `${dt1.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${dt2.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    const usableWidth = Math.max(320, (Number(ganttViewportWidth) || 0) - GANTT_PROJECT_COL);
    const minColW = teamGanttTimeScale === 'Month' ? 88 : teamGanttTimeScale === 'Week' ? 108 : 28;
    const colWidth = buckets.length > 0 ? Math.max(minColW, Math.min(140, usableWidth / buckets.length)) : 42;
    const chartWidth = Math.max(usableWidth, buckets.length * colWidth);

    const projects = Array.from(byProject.keys())
      .map((project) => {
        const withData = [];
        for (let bi = 0; bi < buckets.length; bi += 1) {
          const b = buckets[bi];
          const cell = cellMap.get(`${project}\t${b.key}`);
          if (!cell || !(cell.hours > 0)) continue;
          withData.push({ idx: bi, bucketKey: b.key, hours: cell.hours, tasks: cell.tasks, taskChapters: cell.taskChapters });
        }
        const segments = [];
        let run = null;
        for (const d of withData) {
          if (!run) {
            run = {
              startIdx: d.idx,
              endIdx: d.idx,
              totalHours: d.hours || 0,
              tasks: new Map(d.tasks),
              taskChapters: cloneGanttTaskChapterMaps(d.taskChapters),
            };
            continue;
          }
          if (d.idx === run.endIdx + 1) {
            run.endIdx = d.idx;
            run.totalHours += d.hours || 0;
            for (const [tk, h] of d.tasks.entries()) run.tasks.set(tk, (run.tasks.get(tk) || 0) + h);
            mergeGanttTaskChapterMaps(run.taskChapters, d.taskChapters);
          } else {
            segments.push(run);
            run = {
              startIdx: d.idx,
              endIdx: d.idx,
              totalHours: d.hours || 0,
              tasks: new Map(d.tasks),
              taskChapters: cloneGanttTaskChapterMaps(d.taskChapters),
            };
          }
        }
        if (run) segments.push(run);
        const totalHours = segments.reduce((s, seg) => s + (seg.totalHours || 0), 0);
        return { project, totalHours, segments };
      })
      .filter((p) => p.totalHours > 0)
      .sort((a, b) => b.totalHours - a.totalHours);

    const rowHeights = new Map(projects.map((p) => [p.project, 44]));

    return {
      projects,
      buckets,
      colWidth,
      chartWidth,
      rowHeights,
      taskColor,
      dateRangeLabel,
      projColW: GANTT_PROJECT_COL,
    };
  }, [isEmployeeDetailView, projectGanttRows, selectedEmployee, ganttViewportWidth, teamGanttTimeScale]);

  /** Rows = employees, columns = week or month; cell = total hours in that bucket (all projects). */
  const employeeHoursHeatmapModel = useMemo(() => {
    const rows = Array.isArray(projectGanttRows) ? projectGanttRows : [];
    if (!rows.length) {
      return {
        employees: [],
        buckets: [],
        cellMap: new Map(),
        bucketByKey: new Map(),
        hMin: 0,
        hMax: 1,
        empColW: 160,
        timeScale: teamHoursHeatmapScale,
        valueMode: teamHeatmapValueMode,
      };
    }

    const dateSet = new Set();
    const employeeTotals = new Map();
    const dayHoursByEmp = new Map();

    for (const r of rows) {
      const employee = String(r?.employee || r?.name || '').trim();
      const date = String(r?.date || '').slice(0, 10);
      if (!employee || !date) continue;
      dateSet.add(date);
      const h = Number(r?.hours) || 0;
      employeeTotals.set(employee, (employeeTotals.get(employee) || 0) + h);
      if (!dayHoursByEmp.has(employee)) dayHoursByEmp.set(employee, new Map());
      const dm = dayHoursByEmp.get(employee);
      dm.set(date, (dm.get(date) || 0) + h);
    }

    const periodIso = getDashPeriodIsoRange(selectedPeriod);
    const datesAsc = Array.from(dateSet).sort((a, b) => a.localeCompare(b));
    const datesForBuckets =
      teamHoursHeatmapScale === 'Day' && periodIso
        ? enumerateIsoCalendarDaysInclusive(periodIso.startIso, periodIso.endIso).sort((a, b) =>
            b.localeCompare(a)
          )
        : teamHoursHeatmapScale === 'Day' && datesAsc.length > 0
          ? enumerateIsoCalendarDaysInclusive(datesAsc[0], datesAsc[datesAsc.length - 1]).sort((a, b) =>
              b.localeCompare(a)
            )
          : Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    const { buckets, dateToBucketKey } = buildTeamGanttBuckets(datesForBuckets, teamHoursHeatmapScale);
    const bucketByKey = new Map(buckets.map((b) => [b.key, b]));

    const cellMap = new Map();
    for (const [employee, dm] of dayHoursByEmp.entries()) {
      for (const [dateStr, h] of dm.entries()) {
        const bk = dateToBucketKey.get(dateStr);
        if (!bk) continue;
        const key = `${employee}\t${bk}`;
        cellMap.set(key, (cellMap.get(key) || 0) + h);
      }
    }

    let hMin = Infinity;
    let hMax = 0;
    for (const [key, raw] of cellMap.entries()) {
      if (raw <= 0) continue;
      const tab = key.indexOf('\t');
      const bk = tab >= 0 ? key.slice(tab + 1) : '';
      const b = bucketByKey.get(bk);
      const disp =
        teamHeatmapValueMode === 'avgWeekly' && teamHoursHeatmapScale === 'Month'
          ? hoursToAvgWeeklyRate(raw, calendarDaysInHeatmapBucket(b, teamHoursHeatmapScale))
          : raw;
      hMin = Math.min(hMin, disp);
      hMax = Math.max(hMax, disp);
    }
    if (!Number.isFinite(hMin)) hMin = 0;

    const employees = Array.from(employeeTotals.entries())
      .filter(([, t]) => t > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      employees,
      buckets,
      bucketByKey,
      cellMap,
      hMin,
      hMax: Math.max(hMax, 1e-9),
      empColW: 160,
      timeScale: teamHoursHeatmapScale,
      valueMode: teamHeatmapValueMode,
    };
  }, [projectGanttRows, teamHoursHeatmapScale, teamHeatmapValueMode, selectedPeriod]);

  useEffect(() => {
    if (teamHeatmapValueMode === 'avgWeekly' && (teamHoursHeatmapScale === 'Day' || teamHoursHeatmapScale === 'Week')) {
      setTeamHoursHeatmapScale('Month');
    }
  }, [teamHeatmapValueMode, teamHoursHeatmapScale]);

  useEffect(() => {
    const node = ganttViewportRef.current;
    if (!node) return undefined;

    const update = () => setGanttViewportWidth(node.clientWidth || 0);
    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(node);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [projectGanttRows.length, selectedPeriod]);

  const handleTasksByEmployeeBarClick = useCallback((data) => {
    if (!data?.activePayload?.[0]) return;
    const row = data.activePayload[0].payload;
    const name = row?.name;
    if (!name) return;
    setSelectedEmployeeFromStack((prev) => (prev === name ? null : name));
    setLockedTasksTooltipRow((prev) => (prev === name ? null : name));
  }, []);

  const tasksByHoursRowMap = useMemo(
    () => new Map((workDistributionAgg.rows || []).map((r) => [r.name, r])),
    [workDistributionAgg.rows]
  );

  // Fetch all teams from database
  const fetchAllTeams = async () => {
    try {
      const res = await fetch(`${API_URL}/filters/teams`);
      const teams = await res.json();
      setAllTeamsFromDB(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Filter teams based on selected department (frontend logic)
  const filterTeamsByDepartment = (department) => {
    if (department === 'All') {
      setFilteredTeams(allTeamsFromDB);
    } else {
      const filterFn = DEPARTMENT_TEAM_MAPPING[department];
      if (filterFn) {
        const filtered = allTeamsFromDB.filter(filterFn);
        setFilteredTeams(filtered);
      } else {
        setFilteredTeams([]);
      }
    }
  };

  const fetchEmployees = async (team, search = '') => {
    try {
      const params = new URLSearchParams();
      if (team && team !== 'All') {
        params.append('team', team);
      }
      if (search && search.trim() !== '') {
        params.append('search', search);
      }
      
      const res = await fetch(`${API_URL}/filters/employees?${params.toString()}`);
      const emps = await res.json();
      setEmployeeNames(['All', ...emps]);
      setFilteredEmployees(emps);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (selectedDepartment !== 'All') params.append('department', selectedDepartment);
    if (selectedTeam !== 'All') params.append('team', selectedTeam);
    if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
    if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
    return params.toString();
  };

  const dashboardUrlSuffix = (department, team, employee, period) => {
    const params = new URLSearchParams();
    if (department !== 'All') params.append('department', department);
    if (team !== 'All') params.append('team', team);
    if (employee !== 'All') params.append('employee', employee);
    if (period !== 'All') params.append('period', period);
    params.append('timelineStart', String(Math.max(0, timelineChunkStartRef.current)));
    params.append('timelineLimit', String(TIMELINE_PROJECT_CHUNK));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const parseOverviewJson = async (res) => {
    try {
      if (!res.ok) return null;
      const data = await res.json();
      if (data && typeof data.totalProjects !== 'undefined') return data;
      return null;
    } catch {
      return null;
    }
  };

  const parseArrJson = async (res) => {
    try {
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const parseTimelineJson = async (res) => {
    try {
      if (!res.ok) return { timeline: [], totalProjects: 0 };
      const data = await res.json();
      if (Array.isArray(data)) {
        return { timeline: data, totalProjects: 0 };
      }
      return {
        timeline: Array.isArray(data?.timeline) ? data.timeline : [],
        totalProjects: Number(data?.totalProjects) || 0,
      };
    } catch {
      return { timeline: [], totalProjects: 0 };
    }
  };

  /** Single bundled API call — avoids 15 parallel DB connections per user. */
  const fetchDashboardBundle = async (department, team, employee, period, { bustCache = false } = {}) => {
    const urlSuffix = dashboardUrlSuffix(department, team, employee, period);
    const bust = bustCache ? `${urlSuffix ? '&' : '?'}_=${Date.now()}` : '';
    const url = `${API_URL}/bundle${urlSuffix}${bust}`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        return {
          overview: null,
          projects: [],
          employees: [],
          teams: [],
          timeline: [],
          timelineTotalProjects: 0,
          workMode: [],
          workModeByDays: [],
          elements: [],
          tasks: [],
          statuses: [],
          employeeTaskBreakdown: [],
          employeeTaskRateSamples: [],
          projectTaskEffort: [],
          projectEmployeeBreakdown: [],
          projectGanttRows: [],
        };
      }
      const b = await res.json();
      return {
        overview: b.overview ?? null,
        projects: b.projects || [],
        employees: b.employees || [],
        teams: b.teams || [],
        timeline: b.timeline || [],
        timelineTotalProjects: Number(b.timelineTotalProjects) || 0,
        workMode: b.workMode || [],
        workModeByDays: b.workModeByDays || [],
        elements: b.elements || [],
        tasks: b.tasks || [],
        statuses: b.statuses || [],
        employeeTaskBreakdown: b.employeeTaskBreakdown || [],
        employeeTaskRateSamples: b.employeeTaskRateSamples || [],
        projectTaskEffort: b.projectTaskEffort || [],
        projectEmployeeBreakdown: b.projectEmployeeBreakdown || [],
        projectGanttRows: b.projectGanttRows || [],
      };
    } catch {
      return {
        overview: null,
        projects: [],
        employees: [],
        teams: [],
        timeline: [],
        timelineTotalProjects: 0,
        workMode: [],
        workModeByDays: [],
        elements: [],
        tasks: [],
        statuses: [],
        employeeTaskBreakdown: [],
        employeeTaskRateSamples: [],
        projectTaskEffort: [],
        projectEmployeeBreakdown: [],
        projectGanttRows: [],
      };
    }
  };

  const applyDashboardBundle = (b) => {
    setOverview(b.overview ?? null);
    setProjects(b.projects || []);
    setEmployees(b.employees || []);
    setTeams(b.teams || []);
    setTimeline(b.timeline || []);
    setTimelineTotalProjects(Number(b.timelineTotalProjects) || 0);
    setWorkMode(b.workMode || []);
    setWorkModeByDays(b.workModeByDays || []);
    setElements(b.elements || []);
    setTasks(b.tasks || []);
    setStatuses(b.statuses || []);
    setEmployeeTaskBreakdown(b.employeeTaskBreakdown || []);
    setEmployeeTaskRateSamples(b.employeeTaskRateSamples || []);
    setProjectTaskEffort(b.projectTaskEffort || []);
    setProjectEmployeeBreakdown(b.projectEmployeeBreakdown || []);
    setProjectGanttRows(b.projectGanttRows || []);
    hasDashboardLoadedRef.current = true;
  };
  applyDashboardBundleRef.current = applyDashboardBundle;
  fetchDashboardBundleRef.current = fetchDashboardBundle;

  // Initial load
  useEffect(() => {
    fetchAllTeams();
  }, []);

  // Filter teams when department changes
  useEffect(() => {
    if (allTeamsFromDB.length > 0) {
      filterTeamsByDepartment(selectedDepartment);
    }
  }, [selectedDepartment, allTeamsFromDB]);

  // Load employees when team changes
  useEffect(() => {
    if (selectedTeam !== 'All') {
      fetchEmployees(selectedTeam);
    } else {
      setEmployeeNames(['All']);
      setFilteredEmployees([]);
    }
  }, [selectedTeam]);

  // Handle employee search
  useEffect(() => {
    if (employeeSearch.trim() === '') {
      setFilteredEmployees(employeeNames.filter(e => e !== 'All'));
    } else {
      const filtered = employeeNames.filter(emp => 
        emp !== 'All' && emp.toLowerCase().includes(employeeSearch.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employeeSearch, employeeNames]);

  useEffect(() => {
    refreshDashFiltersRef.current = {
      department: selectedDepartment,
      team: selectedTeam,
      employee: selectedEmployee,
      period: selectedPeriod,
    };
  }, [selectedDepartment, selectedTeam, selectedEmployee, selectedPeriod]);

  useEffect(() => {
    setTimelineChunkStart(0);
  }, [selectedDepartment, selectedTeam, selectedEmployee, selectedPeriod]);

  // Overall dashboard: default period slices fast query; prefetch full-range in background when not on "All"
  useEffect(() => {
    if (dashTab !== 'overall') return undefined;

    prefetchGenerationRef.current += 1;
    const prefetchGenAtStart = prefetchGenerationRef.current;

    let cancelled = false;

    const teamEmpKey = `${selectedDepartment}|${selectedTeam}|${selectedEmployee}|${timelineChunkStart}`;

    async function syncDashboard() {
      try {
        const scopeKey = `${selectedDepartment}|${selectedTeam}|${selectedEmployee}|${selectedPeriod}|${dashTab}`;
        const prev = prevOverallFetchRef.current;
        const chunkOnlyChange = prev.scopeKey === scopeKey && prev.chunk !== timelineChunkStart;
        prevOverallFetchRef.current = { scopeKey, chunk: timelineChunkStart };
        if (!chunkOnlyChange) {
          if (hasDashboardLoadedRef.current) setDashboardRefreshing(true);
          else setLoading(true);
        }
        if (selectedPeriod === 'All') {
          const cached = allDataCacheRef.current;
          if (cached?.teamKey === teamEmpKey && cached?.bundle) {
            applyDashboardBundle(cached.bundle);
          } else {
            const bundle = await fetchDashboardBundle(selectedDepartment, selectedTeam, selectedEmployee, 'All');
            if (
              cancelled ||
              prefetchGenerationRef.current !== prefetchGenAtStart ||
              dashTabRef.current !== 'overall'
            ) {
              return;
            }
            applyDashboardBundle(bundle);
            allDataCacheRef.current = { teamKey: teamEmpKey, bundle };
          }
        } else {
          const bundle = await fetchDashboardBundle(
            selectedDepartment,
            selectedTeam,
            selectedEmployee,
            selectedPeriod
          );
          if (
            cancelled ||
            prefetchGenerationRef.current !== prefetchGenAtStart ||
            dashTabRef.current !== 'overall'
          ) {
            return;
          }
          applyDashboardBundle(bundle);

          fetchDashboardBundle(selectedDepartment, selectedTeam, selectedEmployee, 'All')
            .then((bAll) => {
              if (
                cancelled ||
                prefetchGenerationRef.current !== prefetchGenAtStart ||
                dashTabRef.current !== 'overall'
              ) {
                return;
              }
              allDataCacheRef.current = { teamKey: teamEmpKey, bundle: bAll };
            })
            .catch(() => {});
        }

        if (!cancelled && prefetchGenerationRef.current === prefetchGenAtStart) {
          setLastUpdate(new Date());
          if (!chunkOnlyChange) {
            setLoading(false);
            setDashboardRefreshing(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!cancelled) {
          setLoading(false);
          setDashboardRefreshing(false);
        }
      }
    }

    syncDashboard();

    return () => {
      cancelled = true;
      prefetchGenerationRef.current += 1;
    };
  }, [dashTab, selectedDepartment, selectedTeam, selectedEmployee, selectedPeriod, timelineChunkStart]);

  // Stable 60s refresh — not tied to filter/timeline refetches (avoids interval reset / missed ticks)
  useEffect(() => {
    if (dashTab !== 'overall') return undefined;

    const runRefresh = (bustCache = true) => {
      const r = refreshDashFiltersRef.current;
      const fetchBundle = fetchDashboardBundleRef.current;
      if (!fetchBundle) return;
      fetchBundle(r.department, r.team, r.employee, r.period, { bustCache })
        .then((fresh) => {
          applyDashboardBundleRef.current?.(fresh);
          allDataCacheRef.current = null;
          setLastUpdate(new Date());
        })
        .catch((err) => console.error('Dashboard auto-refresh failed:', err));
    };

    const intervalId = window.setInterval(() => runRefresh(true), REFRESH_INTERVAL);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') runRefresh(true);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [dashTab]);

  useEffect(() => {
    setSelectedEmployeeFromStack(null);
    setLockedTasksTooltipRow(null);
  }, [selectedTeam, selectedEmployee, selectedPeriod]);
  useEffect(() => {
    setProjectTreemapChunkStart(0);
  }, [selectedTeam, selectedEmployee, selectedPeriod]);

  const fetchNightAnalytics = async () => {
    const isInitial = !nightHasLoadedRef.current;
    if (isInitial) setNightLoading(true);
    else setNightRefreshing(true);
    try {
      const queryString = buildQueryParams();
      const urlSuffix = queryString ? `?${queryString}` : '';
      const res = await fetch(`${API_URL}/night-analytics${urlSuffix}`);
      const json = await res.json();
      setNightData(json.error ? null : json);
      nightHasLoadedRef.current = true;
    } catch (e) {
      console.error('Night analytics fetch failed:', e);
      setNightData(null);
    } finally {
      setNightLoading(false);
      setNightRefreshing(false);
    }
  };

  const fetchCrossSessionBooks = async () => {
    const seq = ++crossBooksFetchSeq.current;
    const isInitial = !booksHasLoadedRef.current;
    if (isInitial) setBooksLoading(true);
    else setBooksRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedTeam !== 'All') params.append('team', selectedTeam);
      if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
      if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
      params.append('minSessions', String(bookSessionMin));
      const qs = params.toString();
      const res = await fetch(`${API_URL}/cross-session-books${qs ? `?${qs}` : ''}`);
      const json = await res.json();
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(json.error ? null : json);
      booksHasLoadedRef.current = true;
    } catch (e) {
      console.error('Cross-session books fetch failed:', e);
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(null);
    } finally {
      if (crossBooksFetchSeq.current === seq) {
        setBooksLoading(false);
        setBooksRefreshing(false);
      }
    }
  };

  useEffect(() => {
    if (dashTab === 'night') fetchNightAnalytics();
  }, [dashTab, selectedTeam, selectedEmployee, selectedPeriod]);

  useEffect(() => {
    if (dashTab !== 'books') return undefined;
    fetchCrossSessionBooks();
    return () => {
      crossBooksFetchSeq.current += 1;
      setBooksLoading(false);
    };
  }, [dashTab, selectedTeam, selectedEmployee, selectedPeriod, bookSessionMin]);

  useEffect(() => {
    if (!selectedBookGroup) return;
    const id = requestAnimationFrame(() => {
      crossBookDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [selectedBookGroup?.baseKey]);

  const clearAllFilters = () => {
    setSelectedDepartment('All');
    setSelectedTeam('All');
    setSelectedEmployee('All');
    setSelectedPeriod(DEFAULT_DASH_PERIOD);
    setEmployeeSearch('');
  };

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setSelectedDepartment(newDepartment);
    setSelectedTeam('All');
    setSelectedEmployee('All');
    setEmployeeSearch('');
    setShowTeamDropdown(false);
  };

  const handleTeamChange = (e) => {
    const newTeam = e.target.value;
    setSelectedTeam(newTeam);
    // Reset employee when team changes
    setSelectedEmployee('All');
    setEmployeeSearch('');
  };

  const handleEmployeeSelect = (empName) => {
    setSelectedEmployee(empName);
    setEmployeeSearch(empName === 'All' ? '' : empName);
    setShowEmployeeDropdown(false);
  };

  const handleProjectClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const project = data.activePayload[0].payload;
      setSelectedProject(project);
      setShowProjectModal(true);
    }
  };

  // Only block the whole app for Team view initial load — Night/Books use their own loaders
  if (dashTab === 'overall' && loading && !hasDashboardLoadedRef.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Fixed Header and Filters */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-b border-gray-700 shadow-lg">
        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Work Tracker Analytics
            </h1>
            <p className="text-gray-300">Real-time insights • Last updated: {lastUpdate.toLocaleTimeString()}</p>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" /> Team view
            </NavLink>
            <NavLink
              to="/night"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <Moon className="w-4 h-4" /> Night view
            </NavLink>
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  isActive ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <BookMarked className="w-4 h-4" /> Cross-session books
            </NavLink>
            <NavLink
              to="/project"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  isActive ? 'bg-fuchsia-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`
              }
            >
              <Briefcase className="w-4 h-4" /> Project view
            </NavLink>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-8 pb-6">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Filter className="mr-2 text-purple-400" /> Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-sm font-semibold"
              >
                <X className="w-4 h-4 mr-2" /> CLEAR ALL
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Department Filter */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Team Name Filter (multi-select) */}
              <div className="relative">
                <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDepartment === 'All') return;
                    setShowTeamDropdown((v) => !v);
                  }}
                  disabled={selectedDepartment === 'All'}
                  className="w-full text-left bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-2"
                >
                  <span className="truncate">{teamLabel}</span>
                  <svg className={`w-4 h-4 text-gray-300 transition-transform ${showTeamDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showTeamDropdown && selectedDepartment !== 'All' && (
                  <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-72 overflow-y-auto z-50">
                    <div
                      onClick={clearTeamPicks}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white border-b border-gray-600 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={selectedTeamList.length === 0}
                        className="accent-purple-500 pointer-events-none"
                      />
                      <span className="font-semibold">All</span>
                    </div>
                    {filteredTeams.map((team) => {
                      const checked = selectedTeamSet.has(team);
                      return (
                        <div
                          key={team}
                          onClick={() => toggleTeamPick(team)}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={checked}
                            className="accent-purple-500 pointer-events-none"
                          />
                          <span className="truncate">{team}</span>
                        </div>
                      );
                    })}
                    {filteredTeams.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No teams</div>
                    )}
                  </div>
                )}
              </div>

              {/* Employee Name Filter with Search */}
              <div className="relative">
                <label className="text-white text-sm font-semibold mb-2 block">Employee Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    placeholder="Search employee..."
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedTeam === 'All'}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {/* Dropdown */}
                {showEmployeeDropdown && selectedTeam !== 'All' && (
                  <div className="absolute top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    <div
                      onClick={() => handleEmployeeSelect('All')}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                    >
                      All
                    </div>
                    {filteredEmployees.map(emp => (
                      <div
                        key={emp}
                        onClick={() => handleEmployeeSelect(emp)}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                      >
                        {emp}
                      </div>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No employees found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Period Filter */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={DEFAULT_DASH_PERIOD}>{DEFAULT_DASH_PERIOD}</option>
                  <option value="All">All</option>
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

      {/* Click outside to close team dropdown */}
      {showTeamDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTeamDropdown(false)}
        />
      )}
      {/* Click outside to close employee dropdown */}
      {showEmployeeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmployeeDropdown(false)}
        />
      )}

      {/* Scrollable Content */}
      <div className="px-8 py-6 overflow-y-auto relative min-h-[12rem]">
        <FilterRefreshOverlay active={dashboardRefreshing && dashTab === 'overall'} />
        {dashTab === 'overall' && (
        <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Total Projects"
            value={overview?.totalProjects || 0}
            color="from-purple-500 to-purple-700"
          />
          <StatCard
            icon={Users}
            title="Employees"
            value={overview?.totalEmployees || 0}
            subtitle="Registered users"
            color="from-pink-500 to-pink-700"
          />
          <StatCard
            icon={Clock}
            title="Total Hours"
            value={Math.round(overview?.totalHours || 0)}
            subtitle="Work logged"
            color="from-blue-500 to-blue-700"
          />
          <StatCard
            icon={Target}
            title="Total Tasks"
            value={overview?.totalTasks || 0}
            color="from-green-500 to-green-700"
          />
        </div>

        <div className="space-y-10 pb-8">

        {isEmployeeDetailView ? (
          <>
            <div className="rounded-xl border border-sky-500/30 bg-sky-950/25 px-4 py-3 text-sky-100 text-sm">
              <strong className="text-sky-200">Employee focus</strong> — {selectedEmployee} · {selectedTeam} · {selectedDepartment}
              <span className="text-sky-300/80"> · Period: {selectedPeriod}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <Activity className="mr-2 text-amber-400 shrink-0" /> Task Split of Top 10 Projects
                </h2>
                <p className="text-gray-400 text-xs mb-3">Y-axis: projects · X-axis: hours · stacks: tasks · hover for chapter breakdown</p>
                {employeeTopProjectsStack.rows.length > 0 ? (
                  <div style={{ height: Math.max(360, employeeTopProjectsStack.rows.length * 36) }}>
                    <ResponsiveContainer width="100%" height="100%" debounce={120}>
                      <BarChart data={employeeTopProjectsStack.rows} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 8 }} isAnimationActive={false}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} label={{ value: 'Hours', position: 'insideBottom', fill: '#9ca3af', fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" width={160} stroke="#9ca3af" tick={{ fontSize: 9 }} interval={0} />
                        <Tooltip
                          content={<EmployeeProjectStackTooltip chapterMap={employeeChapterMap} />}
                          cursor={false}
                          wrapperStyle={{ zIndex: 10005, pointerEvents: 'none' }}
                          contentStyle={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', padding: 0 }}
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        {employeeTopProjectsStack.stackKeys.map((key, i) => (
                          <Bar key={key} dataKey={key} stackId="empProj" fill={COLORS[i % COLORS.length]} name={key} isAnimationActive={false} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[320px] flex items-center justify-center text-gray-500 text-sm">No project/task hours for this employee.</div>
                )}
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <Clock className="mr-2 text-pink-400 shrink-0" /> Work Mode Analysis
                </h2>
                <p className="text-gray-400 text-xs mb-3">Share of hours by work mode for {selectedEmployee}</p>
                {employeeWorkModePie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <PieChart>
                      <Pie
                        data={employeeWorkModePie}
                        dataKey="hours"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        labelLine={PIE_LABEL_LINE_STYLE}
                        label={PieExternalLabel}
                        isAnimationActive={false}
                      >
                        {employeeWorkModePie.map((entry, i) => (
                          <Cell key={entry.name} fill={entry.fill || COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<WorkModeDistributionTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[360px] flex items-center justify-center text-gray-500 text-sm">No work mode data.</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <Briefcase className="mr-2 text-purple-400 shrink-0" /> Projects by Hours
                </h2>
                <p className="text-gray-400 text-xs mb-3">Donut: share of this employee&apos;s hours across projects</p>
                {employeeProjectDonut.slices.length > 0 ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <PieChart>
                      <Pie
                        data={employeeProjectDonut.slices}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        labelLine={PIE_LABEL_LINE_STYLE}
                        label={PieExternalLabel}
                        isAnimationActive={false}
                      >
                        {employeeProjectDonut.slices.map((entry, i) => (
                          <Cell key={entry.fullName} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<EmployeeProjectDonutTooltip />}
                        wrapperStyle={{ zIndex: 10005, outline: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[360px] flex items-center justify-center text-gray-500 text-sm">No project hours.</div>
                )}
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <Target className="mr-2 text-indigo-400 shrink-0" /> Project × Task Heatmap
                </h2>
                <p className="text-gray-400 text-xs mb-3">Rows: projects · Columns: tasks · Shade: hours</p>
                {employeeProjectTaskHeatmap.projects.length > 0 && employeeProjectTaskHeatmap.tasks.length > 0 ? (
                  <div className="overflow-auto max-h-[min(70vh,480px)] rounded-lg border border-gray-700">
                    <table className="text-[11px] min-w-max border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="sticky left-0 z-20 bg-gray-800 px-2 py-2 text-left text-gray-300 border-b border-r border-gray-700 w-[140px]">Project</th>
                          {employeeProjectTaskHeatmap.tasks.map((t) => (
                            <th key={t} title={t} className="bg-gray-800 px-1 py-2 text-gray-400 border-b border-gray-700 min-w-[52px]">
                              <span className="block truncate max-w-[50px]">{t.length > 8 ? `${t.slice(0, 7)}…` : t}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {employeeProjectTaskHeatmap.projects.map((proj) => (
                          <tr key={proj}>
                            <td className="sticky left-0 z-10 bg-gray-900 px-2 py-1.5 text-gray-100 border-r border-gray-700 truncate max-w-[140px]" title={proj}>{proj.length > 18 ? `${proj.slice(0, 16)}…` : proj}</td>
                            {employeeProjectTaskHeatmap.tasks.map((task) => {
                              const cell = employeeProjectTaskHeatmap.cellMap.get(`${proj}\t${task}`);
                              const h = cell?.hours || 0;
                              const rng = Math.max(employeeProjectTaskHeatmap.hMax - employeeProjectTaskHeatmap.hMin, 1e-6);
                              const t = (h - employeeProjectTaskHeatmap.hMin) / rng;
                              const clr = h <= 0 ? '#fff' : purpleHeatAlpha(Math.max(0.12, Math.min(1, t)));
                              return (
                                <td key={`${proj}-${task}`} className="p-0.5 border-l border-gray-800/60">
                                  <div title={`${proj} · ${task}: ${h.toFixed(1)}h`} className="h-8 min-w-[48px] rounded flex items-center justify-center text-[10px] font-semibold" style={{ backgroundColor: clr, color: h > employeeProjectTaskHeatmap.hMin + rng * 0.5 ? '#fff' : '#111' }}>
                                    {h > 0 ? (h >= 99 ? Math.round(h) : h.toFixed(0)) : ''}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">No project×task data.</div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <TrendingUp className="mr-2 text-blue-400" /> Project Gantt Chart
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">X-axis: dates · Y-axis: projects · bar segments: tasks (hover for task hour breakdown)</p>
                </div>
                <select
                  value={teamGanttTimeScale}
                  onChange={(e) => setTeamGanttTimeScale(e.target.value)}
                  className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-2 py-1 text-xs"
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              </div>
              {employeeProjectGanttModel.dateRangeLabel && (
                <p className="text-gray-500 text-xs mb-2">{employeeProjectGanttModel.dateRangeLabel}</p>
              )}
              {employeeProjectGanttModel.projects.length > 0 && employeeProjectGanttModel.buckets.length > 0 ? (
                <div ref={ganttViewportRef} className="overflow-auto max-h-[560px] rounded-lg border border-gray-700 bg-gray-900/50">
                  <div style={{ minWidth: `${employeeProjectGanttModel.projColW + employeeProjectGanttModel.chartWidth}px` }}>
                    <div className="flex border-b border-gray-700 sticky top-0 z-10 bg-gray-900">
                      <div className="shrink-0 px-3 py-2 text-xs font-semibold text-gray-400 border-r border-gray-700" style={{ width: employeeProjectGanttModel.projColW }}>Project</div>
                      <div className="flex" style={{ width: employeeProjectGanttModel.chartWidth }}>
                        {employeeProjectGanttModel.buckets.map((b) => (
                          <div key={b.key} className="text-[10px] text-gray-400 text-center border-l border-gray-800 py-2 truncate px-0.5" style={{ width: employeeProjectGanttModel.colWidth }} title={b.label}>{b.label}</div>
                        ))}
                      </div>
                    </div>
                    {employeeProjectGanttModel.projects.map((row) => (
                      <div key={row.project} className="flex border-b border-gray-800/80" style={{ minHeight: 44 }}>
                        <div className="shrink-0 px-3 py-2 text-xs text-gray-100 border-r border-gray-700 truncate" style={{ width: employeeProjectGanttModel.projColW }} title={row.project}>{row.project}</div>
                        <div className="relative" style={{ width: employeeProjectGanttModel.chartWidth, height: 40 }}>
                          {employeeProjectGanttModel.buckets.map((b, idx) => (
                            <div key={b.key} className="absolute top-0 bottom-0 border-l border-gray-800/50" style={{ left: idx * employeeProjectGanttModel.colWidth, width: employeeProjectGanttModel.colWidth }} />
                          ))}
                          {row.segments.map((seg, segIdx) => {
                            const left = seg.startIdx * employeeProjectGanttModel.colWidth + 1;
                            const width = (seg.endIdx - seg.startIdx + 1) * employeeProjectGanttModel.colWidth - 2;
                            const taskParts = [...seg.tasks.entries()].sort((a, b) => b[1] - a[1]);
                            const total = taskParts.reduce((s, [, h]) => s + h, 0) || 1;
                            const fromLabel = employeeProjectGanttModel.buckets[seg.startIdx]?.label || '';
                            const toLabel = employeeProjectGanttModel.buckets[seg.endIdx]?.label || '';
                            return (
                              <div
                                key={`${row.project}-${segIdx}`}
                                className="absolute top-1 bottom-1 flex overflow-hidden rounded-sm border border-slate-600/80"
                                style={{ left, width: Math.max(4, width) }}
                                onMouseEnter={(e) => {
                                  const breakdown = taskParts.map(([task, hours]) => ({ task, hours }));
                                  setGanttHover({
                                    x: e.clientX,
                                    y: e.clientY,
                                    row: row.project,
                                    project: row.project,
                                    task: breakdown.map((b) => `${b.task}=${b.hours.toFixed(1)}h`).join(', '),
                                    from: fromLabel,
                                    to: toLabel,
                                    hours: seg.totalHours,
                                    total: seg.totalHours,
                                    breakdownTitle: 'Task breakdown',
                                    breakdown: breakdown.map((b) => `${b.task}: ${b.hours.toFixed(1)} hrs`),
                                  });
                                }}
                                onMouseLeave={() => setGanttHover(null)}
                              >
                                {taskParts.map(([task, hours], i) => (
                                  <div
                                    key={task}
                                    style={{
                                      width: `${(hours / total) * 100}%`,
                                      backgroundColor: employeeProjectGanttModel.taskColor[task] || COLORS[i % COLORS.length],
                                    }}
                                    title={`${task}: ${hours.toFixed(1)}h`}
                                  />
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">No timeline data for this employee.</div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <BarChart3 className="mr-2 text-violet-400 shrink-0" /> Time per Unit by Task
                </h2>
                <p className="text-gray-400 text-xs mb-3">
                  How long this person takes per unit of work, by task. Each box uses logged hours ÷ units from individual entries (lower median = faster). Whiskers show spread; white line = median.
                </p>
                <TaskTimePerUnitBoxPlot tasks={employeeTaskBoxPlot} />
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                  <PieChartIcon className="mr-2 text-sky-400 shrink-0" /> Contribution Split
                </h2>
                <p className="text-gray-400 text-xs mb-4">Independent vs collaborative work (task classification)</p>
                {employeeContributionModel && (employeeContributionModel.indepSlices.length || employeeContributionModel.collabSlices.length) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DonutWithLegend
                      title="A. Individual Work (Creation Focused)"
                      centerLabel="Individual Work"
                      subtitle="Drafting, composing, and other I-classified tasks"
                      pct={employeeContributionModel.indepPct}
                      slices={employeeContributionModel.indepSlices}
                      totalLabel="Total Individual Hours"
                      totalValue={`${employeeContributionModel.iH.toFixed(1)} hrs`}
                      accentClass="text-blue-400"
                    />
                    <DonutWithLegend
                      title="B. Collaborative Work (Review & Refinement)"
                      centerLabel="Collaborative Work"
                      subtitle="Readings, coordination, and C-classified tasks"
                      pct={employeeContributionModel.collabPct}
                      slices={employeeContributionModel.collabSlices}
                      totalLabel="Total Collaborative Hours"
                      totalValue={`${employeeContributionModel.cH.toFixed(1)} hrs`}
                      accentClass="text-emerald-400"
                    />
                  </div>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">No classified task hours.</div>
                )}
              </div>
            </div>
          </>
        ) : (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Projects by Hours with Clickable Bars */}
<div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
    <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects by Hours
  </h2>
  <ResponsiveContainer width="100%" height={440}>
    <BarChart
      data={projects.slice(0, 10)}
      onClick={handleProjectClick}
      isAnimationActive={false}
      layout="vertical"
      barCategoryGap="18%"
      margin={{ top: 10, right: 70, left: 10, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
      <XAxis
        type="number"
        stroke="#9ca3af"
        domain={[0, (dataMax) => Math.ceil(dataMax * 1.2 / 50) * 50]}
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        allowDecimals={false}
        label={{ value: 'Hours', position: 'insideBottom', offset: -2, fill: '#9ca3af', fontSize: 12 }}
      />
      <YAxis
        type="category"
        dataKey="name"
        stroke="#9ca3af"
        width={210}
        interval={0}
        tick={{ fontSize: 11, fill: '#e5e7eb' }}
      />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
        contentStyle={{ backgroundColor: 'rgb(17 24 39)', opacity: 1 }}
      />
      <Bar
        dataKey="hours"
        fill="#8b5cf6"
        radius={[0, 8, 8, 0]}
        cursor="pointer"
        isAnimationActive={false}
      >
        {projects.slice(0, 10).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        <LabelList
          dataKey="hours"
          position="right"
          formatter={(val) => {
            const n = Number(val) || 0;
            return n >= 100 ? `${Math.round(n)} hrs` : `${n.toFixed(1)} hrs`;
          }}
          style={{ fill: '#f3f4f6', fontSize: 12, fontWeight: 600 }}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
  <p className="text-gray-400 text-xs mt-2 text-center">Click on a bar to view book elements breakdown</p>
</div>

          {/* Work Mode by Days - Vertical stacked bars (bars along x-axis: employees on x, days on y) */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Clock className="mr-2 text-pink-400" /> Work Mode Analysis
            </h2>
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '520px' }}>
              <div style={{ width: `${workModeChartMinWidth}px`, height: workModeChartHeight }}>
                <ResponsiveContainer width="100%" height="100%" debounce={180}>
                  <BarChart
                    data={workModeByDaysChartData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 80 }}
                    barCategoryGap={workModeByDaysChartData.length <= 4 ? '38%' : '14%'}
                    barGap={0}
                    isAnimationActive={false}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#9ca3af" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      interval={0}
                      fontSize={11}
                      tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis 
                      type="number" 
                      stroke="#9ca3af" 
                      label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }} 
                      tick={{ fill: '#9ca3af' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<WorkModeTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} contentStyle={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', padding: 0 }} wrapperStyle={{ outline: 'none', zIndex: 10000 }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="WFH" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['WFH']} name="WFH" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="In Office" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['In Office']} name="In Office" isAnimationActive={false} />
                    <Bar dataKey="OT Office" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['OT Office']} name="OT Office" isAnimationActive={false} />
                    <Bar dataKey="OT Home" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['OT Home']} name="OT Home" isAnimationActive={false} />
                    <Bar dataKey="On Duty" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['On Duty']} name="On Duty" isAnimationActive={false} />
                    <Bar dataKey="Night" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['Night']} name="Night" isAnimationActive={false} />
                    <Bar dataKey="Half Day" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['Half Day']} name="Half Day" isAnimationActive={false} />
                    <Bar dataKey="Leave" stackId="a" barSize={workModeBarSize} fill={WORK_MODE_COLORS['Leave']} name="Leave" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

          {/* Work Distribution: tasks by employee + employee×task heatmap */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-700 pb-3">
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                  Work Distribution
                </h2>
                <p className="text-gray-400 text-sm mt-1">Tasks by hours across employees, and task concentration per person</p>
              </div>
              {selectedEmployeeFromStack && (
                <button
                  type="button"
                  onClick={() => setSelectedEmployeeFromStack(null)}
                  className="text-sm font-semibold text-purple-200 bg-purple-900/60 border border-purple-500/50 rounded-lg px-3 py-2 hover:bg-purple-800/80 flex items-center gap-2"
                >
                  Showing heatmap for: <span className="text-white">{selectedEmployeeFromStack}</span>
                  <span className="text-gray-400">✕ Clear</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-white flex items-center flex-wrap gap-2">
                    <Activity className="text-amber-400" /> Task Split
                    <span className="text-gray-500 text-xs font-normal">stack = task type</span>
                  </h3>
                  <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden text-xs font-semibold">
                    <button
                      type="button"
                      className={`px-3 py-1.5 ${taskSplitMetric === 'hours' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      onClick={() => setTaskSplitMetric('hours')}
                    >
                      Hours
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 border-l border-gray-600 ${taskSplitMetric === 'units' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      onClick={() => setTaskSplitMetric('units')}
                    >
                      Units
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">
                  X-axis: total {taskSplitMetric} · Y-axis: {isAllDepartmentView ? 'departments' : isDepartmentTeamView ? 'teams' : 'employee names'} · stacks show task-wise split.
                </p>
                <div className="overflow-y-auto pb-2 max-h-[500px]" style={{ minHeight: 420 }}>
                  {workDistributionAgg.stackKeys.length > 0 && workDistributionAgg.rows.length > 0 ? (
                    <div
                      key={`tasksByHours-${selectedTeam}|${selectedEmployee}|${selectedPeriod}-${workDistributionAgg.rows.length}-${workDistributionAgg.stackKeys.length}`}
                      style={{ width: '100%', height: Math.max(420, workDistributionAgg.rows.length * 28) }}
                    >
                      <ResponsiveContainer width="100%" height="100%" debounce={180}>
                        <BarChart
                          data={workDistributionAgg.rows}
                          layout="vertical"
                          margin={{ top: 8, right: 16, left: 32, bottom: 8 }}
                          onClick={handleTasksByEmployeeBarClick}
                          isAnimationActive={false}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            type="number"
                            stroke="#9ca3af"
                            tick={{ fontSize: 10 }}
                            label={{ value: `Total ${taskSplitMetric}`, position: 'insideBottom', fill: '#9ca3af', fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            stroke="#9ca3af"
                            tick={{ fontSize: 10 }}
                            interval={0}
                          />
                          <Tooltip
                            content={
                              <TasksByHoursTooltip
                                metaRef={tasksByHoursMetaRef}
                                metric={taskSplitMetric}
                                lockedRowName={lockedTasksTooltipRow}
                                rowMap={tasksByHoursRowMap}
                                stackKeys={workDistributionAgg.stackKeys}
                              />
                            }
                            wrapperStyle={{ zIndex: 10002, pointerEvents: 'none' }}
                            isAnimationActive={false}
                            animationDuration={0}
                          />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {workDistributionAgg.stackKeys.map((key, i) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              stackId="tsk"
                              fill={COLORS[i % COLORS.length]}
                              name={key}
                              radius={[4, 4, 0, 0]}
                              isAnimationActive={false}
                              cursor="pointer"
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[380px] flex items-center justify-center text-gray-500 text-sm">No task–employee data for the current filters.</div>
                  )}
                </div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="text-violet-400" /> Employee vs task heatmap
                  </h3>
                  <div className="rounded-lg border border-gray-600 bg-gray-900/50 px-3 py-2 w-full sm:w-[230px] shrink-0">
                    <p className="text-gray-200 text-xs font-semibold mb-1.5">Hours Spent (Color Scale)</p>
                    <div
                      className="h-2 rounded-md border border-gray-500/60"
                      style={{ background: 'linear-gradient(90deg, rgb(255,255,255) 0%, rgb(30,64,175) 100%)' }}
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-300">
                      <span>0</span>
                      <span>{`${Math.ceil(workDistributionAgg.hMax || 0)}+`}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-4">
                  {isAllDepartmentView ? 'All departments' : isDepartmentTeamView ? 'All teams' : 'All employees'} and all task types in the current filters · Shade = logged hours (darker purple = more). Scroll to explore.
                </p>
                {workDistributionAgg.heatRows.length > 0 && workDistributionAgg.taskColsHeat.length > 0 ? (
                  <div
                    key={`heatmap-${selectedTeam}|${selectedEmployee}|${selectedPeriod}-${workDistributionAgg.heatRows.length}-${workDistributionAgg.taskColsHeat.length}`}
                    className="isolate overflow-auto max-h-[min(70vh,560px)] rounded-lg border border-gray-700 bg-gray-900/40"
                  >
                    <table className="text-[11px] min-w-max border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="sticky top-0 z-20 w-[140px] bg-gray-800 px-3 py-2 text-left font-semibold text-gray-300 border-b border-r border-gray-700">
                            Employee
                          </th>
                          {workDistributionAgg.taskColsHeat.map((t) => (
                            <th key={t} title={t} className="sticky top-0 z-10 min-w-[60px] bg-gray-800/90 px-1.5 py-2 text-gray-400 font-semibold border-b border-gray-700 align-bottom">
                              <span className="inline-block truncate max-w-[58px] text-center" title={t}>{t.length > 12 ? `${t.slice(0, 10)}…` : t}</span>
                            </th>
                          ))}
                          <th className="sticky top-0 right-0 z-30 w-[74px] bg-gray-800 px-2 py-2 text-gray-200 font-semibold border-b border-l border-gray-700 text-right shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {workDistributionAgg.heatRows.map((emp) => (
                          <tr key={emp} className="border-b border-gray-800/80">
                            <td
                              className="sticky left-0 z-10 w-[140px] bg-gray-900 px-3 py-2 font-medium text-gray-100 border-r border-gray-700 whitespace-nowrap truncate"
                              title={emp}
                            >
                              {emp}
                            </td>
                            {workDistributionAgg.taskColsHeat.map((task) => {
                              const cell = workDistributionAgg.heatCellMap.get(`${emp}\t${task}`);
                              const h = cell?.hours || 0;
                              const rng = Math.max(workDistributionAgg.hMax - workDistributionAgg.hMin, 1e-6);
                              const t = (h - workDistributionAgg.hMin) / rng;
                              const clr = h <= 0 ? '#ffffff' : purpleHeatAlpha(Math.max(0.12, Math.min(1, t)));
                              const uh = h > 0 && (cell.units || 0) > 0 ? (cell.units / h).toFixed(2) : '—';
                              return (
                                <td key={`${emp}-${task}`} className="p-1 border-l border-gray-800/70 text-center align-middle">
                                  <div
                                    title={`${emp} · ${task}\nHours: ${h.toFixed(1)} · Units/hr≈ ${uh}`}
                                    className="min-w-[56px] h-9 rounded-md flex items-center justify-center text-[10px] font-semibold tracking-tight"
                                    style={{
                                      backgroundColor: clr,
                                      color: h <= 0 ? '#111827' : h > workDistributionAgg.hMin + rng * 0.55 ? '#fafafa' : '#1e1b24'
                                    }}
                                  >
                                    {h > 0 ? (h >= 99 ? `${Math.round(h)}` : h.toFixed(0)) : ''}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="sticky right-0 z-20 w-[74px] bg-gray-900 px-2 py-2 text-right text-gray-100 font-semibold border-l border-gray-700 tabular-nums shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                              {workDistributionAgg.taskColsHeat
                                .reduce((sum, task) => sum + (workDistributionAgg.heatCellMap.get(`${emp}\t${task}`)?.hours || 0), 0)
                                .toFixed(1)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-600">
                          <td className="sticky left-0 bottom-0 z-30 w-[140px] bg-gray-800 px-3 py-2 font-bold text-white border-r border-gray-700">
                            Total Hours
                          </td>
                          {workDistributionAgg.taskColsHeat.map((task) => {
                            const colTotal = workDistributionAgg.heatRows.reduce(
                              (sum, emp) => sum + (workDistributionAgg.heatCellMap.get(`${emp}\t${task}`)?.hours || 0),
                              0
                            );
                            return (
                              <td key={`tot-${task}`} className="sticky bottom-0 z-20 bg-gray-800 px-1.5 py-2 text-center font-bold text-white tabular-nums border-l border-gray-700">
                                {colTotal.toFixed(1)}
                              </td>
                            );
                          })}
                          <td className="sticky right-0 bottom-0 z-40 w-[74px] bg-gray-800 px-2 py-2 text-right font-bold text-white tabular-nums border-l border-gray-700 shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                            {workDistributionAgg.heatRows
                              .reduce(
                                (sum, emp) =>
                                  sum +
                                  workDistributionAgg.taskColsHeat.reduce(
                                    (inner, task) => inner + (workDistributionAgg.heatCellMap.get(`${emp}\t${task}`)?.hours || 0),
                                    0
                                  ),
                                0
                              )
                              .toFixed(1)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-gray-500 text-sm border border-gray-700 rounded-lg">Nothing to chart for these filters.</div>
                )}
              </div>
            </div>
          </section>

          {/* Timeline Gantt: Overall = teams combined; Employee = per-person rows */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 text-blue-400" /> {isOverallGanttRows ? 'Team timeline Gantt chart' : 'Employee timeline Gantt chart'}
                </h2>
                <p className="text-gray-400 text-sm mt-1 max-w-3xl">
                  {isOverallGanttRows
                    ? 'Combined workload per team across projects. Bars are projects; colored stacks inside each bar are tasks. Use filters to narrow to a department or a single team.'
                    : 'Shows what each employee is working on across projects. Bars are projects; colored stacks inside each bar are tasks (same filters as the dashboard).'}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs font-semibold">Time scale:</span>
                  <select
                    value={teamGanttTimeScale}
                    onChange={(e) => setTeamGanttTimeScale(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Day">Day</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                  </select>
                </div>
                {employeeGanttModel.dateRangeLabel ? (
                  <div className="rounded-md border border-gray-600 bg-gray-900/60 px-3 py-1.5 text-xs font-medium text-gray-200 whitespace-nowrap">
                    {employeeGanttModel.dateRangeLabel}
                  </div>
                ) : null}
                <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden text-xs font-semibold">
                  <button
                    type="button"
                    className={`px-3 py-1.5 ${ganttSortMode === 'hours' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setGanttSortMode('hours')}
                  >
                    Sort: Hours
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 border-l border-gray-600 ${ganttSortMode === 'recent' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setGanttSortMode('recent')}
                  >
                    Sort: Most recent
                  </button>
                </div>
                <div className="inline-flex rounded-lg border border-blue-400/60 overflow-hidden text-xs font-semibold">
                  <button
                    type="button"
                    disabled={selectedEmployee !== 'All'}
                    title={selectedEmployee !== 'All' ? 'Employee filter active — showing individual rows' : undefined}
                    className={`px-3 py-1.5 ${effectiveGanttRowMode === 'overall' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${selectedEmployee !== 'All' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setGanttRowMode('overall')}
                  >
                    Overall
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 border-l border-blue-400/40 ${effectiveGanttRowMode === 'employee' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setGanttRowMode('employee')}
                  >
                    Employee
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">
              X-axis: {teamGanttTimeScale.toLowerCase()} buckets (oldest on the left, newest on the right) · Y-axis: {isOverallGanttRows ? 'teams' : 'employees'} · bar border: accent · bar fill: task mix.
            </p>

            {employeeGanttModel.employees.length > 0 && employeeGanttModel.buckets.length > 0 ? (
              <div ref={ganttViewportRef} className="overflow-auto max-h-[640px] rounded-lg border border-gray-700 bg-gray-900/50">
                <div
                  style={{
                    minWidth: `${employeeGanttModel.empColW + employeeGanttModel.chartWidth}px`,
                  }}
                >
                  <div className="sticky top-0 z-20 flex border-b-2 border-indigo-500/50 bg-gray-900/95 backdrop-blur">
                    <div
                      className="sticky left-0 z-30 shrink-0 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-300 border-r-2 border-indigo-500/35 bg-gray-900/95"
                      style={{ width: employeeGanttModel.empColW, minWidth: employeeGanttModel.empColW }}
                    >
                      {isOverallGanttRows ? 'Team' : 'Employee'}
                    </div>
                    <div className="relative" style={{ width: `${employeeGanttModel.chartWidth}px` }}>
                      <div className="flex">
                        {employeeGanttModel.buckets.map((b) => (
                          <div
                            key={b.key}
                            className="border-r border-gray-800 px-1 py-2 text-[10px] text-gray-400 text-center shrink-0 leading-tight"
                            style={{ width: `${employeeGanttModel.colWidth}px` }}
                          >
                            {b.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {employeeGanttModel.employees.map((row) => {
                    const rowHeight = employeeGanttModel.rowHeights.get(row.employee) || 44;
                    const laneH = employeeGanttModel.laneHeight || 30;
                    return (
                      <div key={row.employee} className="flex border-b-2 border-indigo-600/45">
                        <div
                          className="sticky left-0 z-10 shrink-0 border-r-2 border-indigo-500/35 bg-gray-900/95"
                          style={{ width: employeeGanttModel.empColW, minWidth: employeeGanttModel.empColW }}
                        >
                          <div
                            className="sticky top-0 z-20 flex items-start gap-2 px-2 py-2 bg-gray-900/95"
                            title={row.employee}
                          >
                            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              {ganttRowInitials(row.employee, employeeGanttModel.rowMode)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-gray-100 truncate">{row.employee}</div>
                              <div className="text-[10px] text-gray-400">{row.totalHours.toFixed(1)} hrs</div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="relative"
                          style={{ width: `${employeeGanttModel.chartWidth}px`, minHeight: `${rowHeight}px` }}
                        >
                          {employeeGanttModel.buckets.map((b, idx) => (
                            <div
                              key={`${row.employee}-${b.key}`}
                              className="absolute top-0 bottom-0 border-r border-gray-800/70"
                              style={{
                                left: `${idx * employeeGanttModel.colWidth}px`,
                                width: `${employeeGanttModel.colWidth}px`,
                              }}
                            />
                          ))}

                          {row.lanes.map((lane, laneIdx) =>
                            lane.segments.map((seg, segIdx) => {
                              const left = seg.startIdx * employeeGanttModel.colWidth + 1;
                              const width = (seg.endIdx - seg.startIdx + 1) * employeeGanttModel.colWidth - 2;
                              const top = laneIdx * laneH + 5;
                              const tasksArr = Array.from(seg.tasks.entries())
                                .map(([task, hours]) => ({ task, hours }))
                                .sort((a, b) => (b.hours || 0) - (a.hours || 0));
                              const fromLabel = employeeGanttModel.buckets[seg.startIdx]?.label || '';
                              const toLabel = employeeGanttModel.buckets[seg.endIdx]?.label || '';
                              return (
                                <div
                                  key={`${row.employee}-${lane.project}-${segIdx}-${seg.startIdx}`}
                                  className="absolute overflow-hidden rounded-md border-2 border-blue-400/75 bg-slate-900/90 shadow-sm"
                                  style={{
                                    left: `${left}px`,
                                    top: `${top}px`,
                                    width: `${Math.max(10, width)}px`,
                                    height: `${laneH - 10}px`,
                                  }}
                                >
                                  {width >= 56 && (
                                    <div className="absolute inset-x-0 top-1 px-1 pointer-events-none z-[1]">
                                      <div className="text-[11px] font-normal text-white/95 truncate text-center drop-shadow-sm leading-tight">
                                        {lane.project}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex h-full w-full items-stretch pt-[22px] min-h-0">
                                    {tasksArr.map((taskPart, i) => {
                                      const taskHours = Number(taskPart.hours) || 0;
                                      const pct = (seg.totalHours || 0) > 0 ? (taskHours / seg.totalHours) * 100 : 0;
                                      const chm = seg.taskChapters?.get(taskPart.task);
                                      const breakdown =
                                        chm && chm.size > 0
                                          ? [...chm.entries()]
                                              .sort((a, b) => b[1] - a[1])
                                              .map(([chapter, hours]) => ({
                                                key: chapter,
                                                label: chapter === '—' ? 'No chapter' : `Ch. ${chapter}`,
                                                hours,
                                              }))
                                          : [];
                                      return (
                                        <div
                                          key={`${row.employee}-${lane.project}-${segIdx}-${taskPart.task}-${i}`}
                                          role="presentation"
                                          className="h-full min-h-0 cursor-pointer"
                                          style={{
                                            width: `${Math.max(2, pct)}%`,
                                            backgroundColor:
                                              employeeGanttModel.taskColor[taskPart.task] || COLORS[i % COLORS.length],
                                          }}
                                          onMouseEnter={(e) =>
                                            setGanttHover({
                                              x: e.clientX,
                                              y: e.clientY,
                                              row: row.employee,
                                              project: lane.project,
                                              task: taskPart.task,
                                              hours: taskHours,
                                              total: Number(seg.totalHours) || 0,
                                              from: fromLabel,
                                              to: toLabel,
                                              breakdown,
                                              breakdownTitle: 'Chapter breakdown',
                                            })
                                          }
                                          onMouseMove={(e) =>
                                            setGanttHover((prev) =>
                                              prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
                                            )
                                          }
                                          onMouseLeave={() => setGanttHover(null)}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm rounded-lg border border-gray-700">
                {isOverallGanttRows
                  ? 'No team timeline data for current filters.'
                  : 'No employee timeline data for current filters.'}
              </div>
            )}

            {Object.keys(employeeGanttModel.taskColor || {}).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-700 pt-3">
                <div className="text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-300">Task types (stacked segments):</span>{' '}
                  {Object.entries(employeeGanttModel.taskColor)
                    .slice(0, 14)
                    .map(([task, color]) => (
                      <span key={task} className="inline-flex items-center gap-1 mx-1">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-gray-300">{task}</span>
                      </span>
                    ))}
                  {Object.keys(employeeGanttModel.taskColor).length > 14 && (
                    <span className="text-gray-500">+ more</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-300">Bar border:</span>{' '}
                  <span className="inline-flex items-center gap-1 mx-1">
                    <span className="inline-block w-4 h-2 rounded-sm border-2 border-blue-400/75 bg-slate-800" />
                    accent (project lifecycle status is not in this dataset)
                  </span>
                </div>
              </div>
            )}

            {ganttHover &&
              createPortal(
                <div
                  className="pointer-events-none fixed z-[10003] max-w-xs rounded-lg border border-purple-500/70 bg-gray-900 px-3 py-2 text-xs shadow-xl"
                  style={{
                    left: `${Math.min(
                      Math.max((ganttHover.x || 0) + 12, 8),
                      (typeof window !== 'undefined' ? window.innerWidth : 800) - 280
                    )}px`,
                    top: `${Math.min(
                      Math.max((ganttHover.y || 0) + 12, 8),
                      (typeof window !== 'undefined' ? window.innerHeight : 600) - 320
                    )}px`,
                  }}
                >
                  <p className="text-white font-semibold break-words">{ganttHover.row}</p>
                  <p className="text-indigo-300 mt-0.5">
                    Project: <span className="text-white">{ganttHover.project}</span>
                  </p>
                  <p className="text-indigo-300 mt-0.5">
                    Task: <span className="text-white">{ganttHover.task}</span>
                  </p>
                  <p className="text-gray-400 mt-0.5">
                    {ganttHover.from}
                    {ganttHover.from !== ganttHover.to ? ` → ${ganttHover.to}` : ''}
                  </p>
                  <p className="text-purple-200 mt-1">
                    {Number(ganttHover.hours || 0).toFixed(2)} hrs
                    {Number(ganttHover.total) > 0 && (
                      <span className="text-gray-500">
                        {' '}
                        ({((Number(ganttHover.hours || 0) / Number(ganttHover.total)) * 100).toFixed(0)}% of segment)
                      </span>
                    )}
                  </p>
                  {Array.isArray(ganttHover.breakdown) && ganttHover.breakdown.length > 0 && (
                    <div className="mt-2 border-t border-gray-700 pt-2">
                      <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mb-1">
                        {ganttHover.breakdownTitle || 'Chapter breakdown'}
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                        {ganttHover.breakdown.map((line) => (
                          <div key={String(line.key)} className="flex justify-between gap-3 text-gray-300">
                            <span className="truncate">{line.label}</span>
                            <span className="text-white font-semibold shrink-0 tabular-nums">
                              {Number(line.hours || 0).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>,
                document.body
              )}
          </div>

          {/* Employee × day/week/month hours heatmap (after Gantt) */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <LayoutGrid className="mr-2 text-cyan-400" /> Employee hours heatmap
                </h2>
                <p className="text-gray-400 text-sm mt-1 max-w-3xl">
                  Rows are employees for the current team filters; columns are calendar days, weeks, or months (oldest on the left, newest on the right).{' '}
                  <span className="text-gray-500">
                    {teamHeatmapValueMode === 'total'
                      ? 'Each cell shows total hours logged in that bucket across all projects.'
                      : 'Month columns only: equivalent avg hours per week = (hours in that month) × 7 ÷ (days in that calendar month). Switch to Month to use this mode. Total column stays sum of raw hours.'}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3 flex-wrap justify-end">
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">Values:</span>
                  <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden text-xs font-semibold">
                    <button
                      type="button"
                      className={`px-3 py-1.5 ${teamHeatmapValueMode === 'total' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      onClick={() => setTeamHeatmapValueMode('total')}
                    >
                      Total hrs
                    </button>
                    <button
                      type="button"
                      title="Average weekly rate from each bucket (Month only: prorated by days in that month)"
                      className={`px-3 py-1.5 border-l border-gray-600 ${
                        teamHeatmapValueMode === 'avgWeekly' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setTeamHeatmapValueMode('avgWeekly')}
                    >
                      Avg / week
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">Columns:</span>
                <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden text-xs font-semibold">
                  <button
                    type="button"
                    disabled={teamHeatmapValueMode === 'avgWeekly'}
                    title={
                      teamHeatmapValueMode === 'avgWeekly'
                        ? 'Switch Values to Total hrs to use Day columns'
                        : undefined
                    }
                    className={`px-3 py-1.5 ${teamHoursHeatmapScale === 'Day' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${
                      teamHeatmapValueMode === 'avgWeekly' ? 'opacity-45 cursor-not-allowed' : ''
                    }`}
                    onClick={() => teamHeatmapValueMode !== 'avgWeekly' && setTeamHoursHeatmapScale('Day')}
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    disabled={teamHeatmapValueMode === 'avgWeekly'}
                    title={
                      teamHeatmapValueMode === 'avgWeekly'
                        ? 'Switch Values to Total hrs to use Week columns'
                        : undefined
                    }
                    className={`px-3 py-1.5 border-l border-gray-600 ${teamHoursHeatmapScale === 'Week' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${
                      teamHeatmapValueMode === 'avgWeekly' ? 'opacity-45 cursor-not-allowed' : ''
                    }`}
                    onClick={() => teamHeatmapValueMode !== 'avgWeekly' && setTeamHoursHeatmapScale('Week')}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 border-l border-gray-600 ${teamHoursHeatmapScale === 'Month' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setTeamHoursHeatmapScale('Month')}
                  >
                    Month
                  </button>
                </div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">
              Uses the same underlying data as the employee timeline Gantt. Darker blue = higher values in the current mode.{' '}
              {teamHoursHeatmapScale === 'Day'
                ? `Day columns match the Period filter when it is a fixed window (e.g. Last 7 Days through today); for All or unknown periods they span the earliest–latest logged date. Days with no hours show 0. Scroll horizontally for the full range.`
                : 'Scroll wide grids horizontally as needed.'}
              {teamHeatmapValueMode === 'total' && teamHoursHeatmapScale === 'Month' && (
                <span className="block mt-1 text-gray-500">
                  Month cells and the Total column use one decimal; Total is the exact sum of hours in those months (add the precise values from tooltips if you need to match by hand).
                </span>
              )}
              {teamHeatmapValueMode === 'avgWeekly' && teamHoursHeatmapScale === 'Month' && (
                <span className="block mt-1 text-indigo-300/90">
                  Avg / week uses each month&apos;s calendar day count to prorate that month&apos;s hours to a 7-day week.
                </span>
              )}
            </p>

            {employeeHoursHeatmapModel.employees.length > 0 && employeeHoursHeatmapModel.buckets.length > 0 ? (
              <div
                key={`emp-hours-heat-${teamHoursHeatmapScale}-${teamHeatmapValueMode}-${employeeHoursHeatmapModel.employees.length}-${employeeHoursHeatmapModel.buckets.length}`}
                className={`isolate w-full overflow-x-auto overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/40 ${
                  teamHoursHeatmapScale === 'Day' ? 'max-h-[min(75vh,560px)]' : 'max-h-[min(70vh,480px)]'
                }`}
              >
                <table
                  className="w-full table-fixed border-separate border-spacing-0 text-[11px]"
                  style={{
                    minWidth: `max(100%, ${160 + 74 + employeeHoursHeatmapModel.buckets.length * (teamHoursHeatmapScale === 'Day' ? 40 : 56)}px)`,
                  }}
                >
                  <colgroup>
                    <col style={{ width: 160 }} />
                    {employeeHoursHeatmapModel.buckets.map((b) => (
                      <col key={b.key} />
                    ))}
                    <col style={{ width: 74 }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="sticky top-0 left-0 z-30 w-[160px] bg-gray-800 px-3 py-2 text-left font-semibold text-gray-300 border-b border-r border-gray-700">
                        Employee
                      </th>
                      {employeeHoursHeatmapModel.buckets.map((b) => (
                        <th
                          key={b.key}
                          title={teamHoursHeatmapScale === 'Day' ? `${b.key} — ${b.label}` : b.label}
                          className={`sticky top-0 z-10 bg-gray-800/90 py-2 text-gray-400 font-semibold border-b border-gray-700 align-bottom ${
                            teamHoursHeatmapScale === 'Day' ? 'px-0.5 text-[9px]' : 'px-1.5 text-[11px]'
                          }`}
                        >
                          <span className="inline-block w-full text-center leading-tight">{b.label}</span>
                        </th>
                      ))}
                      <th className="sticky top-0 right-0 z-30 w-[74px] bg-gray-800 px-2 py-2 text-gray-200 font-semibold border-b border-l border-gray-700 text-right shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeHoursHeatmapModel.employees.map((emp) => (
                      <tr key={emp} className="border-b border-gray-800/80">
                        <td
                          className="sticky left-0 z-10 w-[160px] bg-gray-900 px-3 py-2 font-medium text-gray-100 border-r border-gray-700 whitespace-nowrap truncate"
                          title={emp}
                        >
                          {emp}
                        </td>
                        {employeeHoursHeatmapModel.buckets.map((b) => {
                          const raw = employeeHoursHeatmapModel.cellMap.get(`${emp}\t${b.key}`) || 0;
                          const bucket = employeeHoursHeatmapModel.bucketByKey?.get(b.key);
                          const useAvgWeekly =
                            teamHeatmapValueMode === 'avgWeekly' && teamHoursHeatmapScale === 'Month';
                          const display = useAvgWeekly
                            ? hoursToAvgWeeklyRate(
                                raw,
                                calendarDaysInHeatmapBucket(bucket, teamHoursHeatmapScale)
                              )
                            : raw;
                          const rng = Math.max(employeeHoursHeatmapModel.hMax - employeeHoursHeatmapModel.hMin, 1e-6);
                          const t = (display - employeeHoursHeatmapModel.hMin) / rng;
                          const isZeroCell = Math.abs(display) < 1e-6;
                          const clr = isZeroCell
                            ? '#f1f5f9'
                            : purpleHeatAlpha(Math.max(0.12, Math.min(1, t)));
                          const titleExtra = isZeroCell
                            ? useAvgWeekly
                              ? '\nNo hours in this bucket'
                              : '\n0 hrs logged'
                            : useAvgWeekly
                              ? `\nTotal in bucket: ${raw.toFixed(1)} hrs\nAvg / week (prorated): ${display.toFixed(1)} hrs`
                              : `\nTotal: ${raw.toFixed(1)} hrs`;
                          return (
                            <td key={`${emp}-${b.key}`} className="p-0.5 border-l border-gray-800/70 text-center align-middle">
                              <div
                                title={`${emp}\n${b.label}${teamHoursHeatmapScale === 'Day' ? ` (${b.key})` : ''}${titleExtra}`}
                                className={`w-full rounded-md flex items-center justify-center font-semibold tracking-tight ${
                                  teamHoursHeatmapScale === 'Day' ? 'min-h-8 py-0.5 text-[9px]' : 'min-h-9 py-0.5 text-[10px]'
                                }`}
                                style={{
                                  backgroundColor: clr,
                                  color: isZeroCell
                                    ? '#64748b'
                                    : display > employeeHoursHeatmapModel.hMin + rng * 0.55
                                      ? '#fafafa'
                                      : '#1e1b24',
                                }}
                              >
                                {isZeroCell ? '0' : display.toFixed(1)}
                              </div>
                            </td>
                          );
                        })}
                        <td className="sticky right-0 z-20 w-[74px] bg-gray-900 px-2 py-2 text-right text-gray-100 font-semibold border-l border-gray-700 tabular-nums shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                          {employeeHoursHeatmapModel.buckets
                            .reduce((sum, b) => sum + (employeeHoursHeatmapModel.cellMap.get(`${emp}\t${b.key}`) || 0), 0)
                            .toFixed(1)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-600">
                      <td className="sticky left-0 bottom-0 z-30 w-[160px] bg-gray-800 px-3 py-2 font-bold text-white border-r border-gray-700">
                        Total hours
                      </td>
                      {employeeHoursHeatmapModel.buckets.map((b) => {
                        const colTotal = employeeHoursHeatmapModel.employees.reduce(
                          (sum, emp) => sum + (employeeHoursHeatmapModel.cellMap.get(`${emp}\t${b.key}`) || 0),
                          0
                        );
                        return (
                          <td
                            key={`coltot-${b.key}`}
                            className={`sticky bottom-0 z-20 bg-gray-800 text-center font-bold text-white tabular-nums border-l border-gray-700 ${
                              teamHoursHeatmapScale === 'Day' ? 'px-0.5 py-1.5 text-[9px]' : 'px-1.5 py-2 text-[11px]'
                            }`}
                          >
                            {colTotal.toFixed(1)}
                          </td>
                        );
                      })}
                      <td className="sticky right-0 bottom-0 z-40 w-[74px] bg-gray-800 px-2 py-2 text-right font-bold text-white tabular-nums border-l border-gray-700 shadow-[-4px_0_10px_rgba(0,0,0,0.35)]">
                        {employeeHoursHeatmapModel.employees
                          .reduce(
                            (sum, emp) =>
                              sum +
                              employeeHoursHeatmapModel.buckets.reduce(
                                (inner, bk) => inner + (employeeHoursHeatmapModel.cellMap.get(`${emp}\t${bk.key}`) || 0),
                                0
                              ),
                            0
                          )
                          .toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm rounded-lg border border-gray-700">
                No hourly breakdown for the current filters (same source as the Gantt chart).
              </div>
            )}
          </div>

          {/* Project Contribution: effort treemap + project vs employee stacked */}
          <section className="space-y-4">
            <div className="border-b border-gray-700 pb-3">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-teal-200 to-purple-300 bg-clip-text">
                Project Contribution
              </h2>
              <p className="text-gray-400 text-sm mt-1">Effort splits by nested project × task blocks, plus who logged time on top projects.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Briefcase className="text-purple-400" /> Project effort distribution
                </h3>
                <p className="text-gray-400 text-xs mb-3">Areas show top projects · inner tiles split hours (or units) by task inside each book.</p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Treemap sizing</span>
                  <div className="inline-flex rounded-lg border border-gray-600 overflow-hidden text-xs font-semibold">
                    <button
                      type="button"
                      className={`px-3 py-1.5 ${effortTreemapMetric === 'hours' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      onClick={() => setEffortTreemapMetric('hours')}
                    >
                      Hours
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1.5 border-l border-gray-600 ${effortTreemapMetric === 'units' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      onClick={() => setEffortTreemapMetric('units')}
                    >
                      Units
                    </button>
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Projects</span>
                    <select
                      value={String(projectTreemapData.chunkStart ?? 0)}
                      onChange={(e) => setProjectTreemapChunkStart(Number(e.target.value) || 0)}
                      className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(projectTreemapData.chunkOptions || []).map((opt) => (
                        <option key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500 text-xs ml-auto hidden sm:inline">
                    Scope total: {(projectTreemapData.grandTotals?.hours || 0).toFixed(0)} hrs · {projectTreemapData.grandTotals?.units ?? 0} units
                  </span>
                </div>
                {projectClusterRows.length ? (
                  <div
                    className="flex flex-col gap-2"
                    style={{ height: 480 }}
                  >
                    {projectClusterRows.map((row, rIdx) => {
                      const rowTotal = row.reduce((s, c) => s + (c.metricValue || 0), 0);
                      const allTotal = projectClusterRows
                        .flat()
                        .reduce((s, c) => s + (c.metricValue || 0), 0);
                      const rowFlex = allTotal > 0
                        ? Math.max(0.65, (rowTotal / allTotal) * projectClusterRows.length)
                        : 1;
                      return (
                        <div
                          key={`row-${rIdx}`}
                          className="flex gap-2"
                          style={{ flex: rowFlex, minHeight: 0 }}
                        >
                          {row.map((cluster) => {
                            const clusterColor = COLORS[cluster.projIdx % COLORS.length];
                            const flexVal = rowTotal > 0
                              ? Math.max(0.55, (cluster.metricValue || 0) / rowTotal * row.length)
                              : 1;
                            const headerHrs = cluster.hours >= 100
                              ? `${Math.round(cluster.hours)}h`
                              : `${cluster.hours.toFixed(1)}h`;
                            return (
                              <div
                                key={cluster.name}
                                title={`${cluster.name}\n${cluster.hours.toFixed(1)} h · ${cluster.units} units · ${cluster.pctOfScope.toFixed(1)}% of scope`}
                                className="flex flex-col rounded-md overflow-hidden border border-slate-900 shadow-lg"
                                style={{
                                  flex: flexVal,
                                  minWidth: 0,
                                  backgroundColor: clusterColor
                                }}
                              >
                                <div
                                  className="px-2.5 py-1.5"
                                  style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.55)',
                                    borderBottom: '1px solid rgba(248, 250, 252, 0.18)'
                                  }}
                                >
                                  <p
                                    className="text-white font-bold text-[12px] leading-tight truncate"
                                    title={cluster.name}
                                  >
                                    {cluster.name}
                                  </p>
                                  <p className="text-[11px] text-slate-200 tabular-nums leading-tight">
                                    {headerHrs} · {cluster.units}u · {cluster.pctOfScope.toFixed(1)}%
                                  </p>
                                </div>
                                <div className="flex-1 min-h-0 relative">
                                  {cluster.tasks.length ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <Treemap
                                        data={cluster.tasks}
                                        dataKey="size"
                                        nameKey="name"
                                        stroke="rgba(15,23,42,0.85)"
                                        aspectRatio={4 / 3}
                                        isAnimationActive={false}
                                        content={<ProjectEffortTreemapContent />}
                                      >
                                        <Tooltip
                                          wrapperStyle={{ pointerEvents: 'none', zIndex: 0, opacity: 0, width: 0, height: 0 }}
                                          allowEscapeViewBox={{ x: true, y: true }}
                                          content={(rcProps) => <ProjectEffortPortalTooltip {...rcProps} />}
                                        />
                                      </Treemap>
                                    </ResponsiveContainer>
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-200/80">
                                      No tasks
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[440px] flex items-center justify-center text-gray-500 text-sm rounded-lg border border-gray-700">No project/task effort for filters.</div>
                )}
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="text-cyan-400" /> Project vs employee
                  <span className="text-gray-500 text-xs font-normal">stack = contributors</span>
                </h3>
                <p className="text-gray-400 text-xs mb-3">X-axis: Hours · Y-axis: Projects · stack colors = employees.</p>
                {projectEmployeeChart.rows?.length > 0 &&
                projectEmployeeChart.stackKeys?.length > 0 ? (
                  <div className="w-full min-w-0 overflow-y-auto pb-2 max-h-[520px]">
                    <div className="mb-3 flex w-max min-w-full flex-nowrap gap-4 text-[10px] leading-snug text-gray-300">
                      {projectEmployeeChart.stackKeys.map((key, idx) => {
                        const nm =
                          key === 'Other'
                            ? 'Other'
                            : projectEmployeeChart.slugToEmp?.[key] ??
                              (typeof key === 'string' ? key.slice(0, 28) : String(key));
                        return (
                          <span
                            key={key}
                            className="inline-flex max-w-[220px] items-center gap-1.5"
                            title={nm}
                          >
                            <span
                              className="size-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                            />
                            <span className="truncate">{nm}</span>
                          </span>
                        );
                      })}
                    </div>
                    <div
                      key={`projEmp-${selectedTeam}|${selectedEmployee}|${selectedPeriod}-${projectEmployeeChart.rows.length}-${projectEmployeeChart.stackKeys.length}`}
                      className="min-h-[460px]"
                      style={{ width: '100%', height: `${Math.max(460, projectEmployeeChart.rows.length * 34)}px` }}
                    >
                      <ResponsiveContainer width="100%" height="100%" debounce={200}>
                        <BarChart
                          data={projectEmployeeChart.rows}
                          layout="vertical"
                          margin={{ top: 8, bottom: 20, left: 8, right: 12 }}
                          isAnimationActive={false}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis
                            type="number"
                            stroke="#9ca3af"
                            tick={{ fontSize: 9 }}
                            label={{ value: 'Hours', position: 'insideBottom', fill: '#9ca3af', fontSize: 11 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#9ca3af"
                            width={180}
                            interval={0}
                            tick={{ fontSize: 9 }}
                            label={{
                              value: 'Projects',
                              angle: -90,
                              position: 'insideLeft',
                              fill: '#9ca3af',
                              fontSize: 11,
                            }}
                          />
                          <Tooltip
                            shared={false}
                            content={<ProjectEmployeeTooltip chartMeta={projectEmployeeChart} />}
                            wrapperStyle={{ zIndex: 10004 }}
                            isAnimationActive={false}
                            animationDuration={0}
                            cursor={{ fill: 'rgba(148, 163, 184, 0.07)' }}
                          />
                          {projectEmployeeChart.stackKeys.map((key, idx) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              stackId="pe"
                              name={
                                key === 'Other'
                                  ? 'Other'
                                  : projectEmployeeChart.slugToEmp?.[key] ??
                                    (typeof key === 'string' ? key.slice(0, 28) : String(key))
                              }
                              fill={COLORS[idx % COLORS.length]}
                              isAnimationActive={false}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-gray-500 text-sm rounded-lg border border-gray-700">No project breakdown for filters.</div>
                )}
              </div>
            </div>
          </section>

        </>
        )}

        </div>
        </>
        )}

        {dashTab === 'night' && (
          <div className="space-y-8 pb-8 relative min-h-[16rem]">
            <FilterRefreshOverlay active={nightRefreshing} label="Updating night analytics…" />
            {nightLoading && !nightHasLoadedRef.current && (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500" />
              </div>
            )}
            {(nightHasLoadedRef.current || nightData?.summary) && !nightLoading && nightData?.summary && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={Moon} title="Night hours" value={Math.round(nightData.summary.totalNightHours || 0)} subtitle="Filtered scope" color="from-indigo-600 to-indigo-900" />
                  <StatCard icon={Clock} title="Night entries" value={nightData.summary.totalNightEntries || 0} subtitle="Row count" color="from-slate-600 to-slate-900" />
                  <StatCard icon={Users} title="Night contributors" value={nightData.summary.uniqueNightContributors || 0} subtitle="Distinct names" color="from-violet-600 to-violet-900" />
                  <StatCard icon={Zap} title="Night share" value={`${(nightData.summary.nightPercentOfFilteredHours || 0).toFixed(1)}%`} subtitle="Of all hours in filter" color="from-fuchsia-600 to-purple-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Clock}
                    title="Avg per entry"
                    value={nightData.summary.avgHoursPerNightEntry ?? 0}
                    subtitle="Hours per night log"
                    color="from-amber-600 to-amber-900"
                  />
                  <StatCard
                    icon={Target}
                    title="Units / night hr"
                    value={nightData.summary.globalUnitsPerNightHour ?? '—'}
                    subtitle="Output intensity"
                    color="from-teal-600 to-teal-900"
                  />
                  <StatCard
                    icon={Activity}
                    title="Peak log hour"
                    value={nightData.summary.peakNightHourLabel ?? '—'}
                    subtitle="By submission timestamp"
                    color="from-orange-600 to-orange-900"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="Busiest weekday"
                    value={nightData.summary.busiestWeekday ?? '—'}
                    subtitle="Most night hours"
                    color="from-rose-600 to-rose-900"
                  />
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
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
                            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm ring-1 ring-white/20" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
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
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="hours" fill="#6366f1" name="Night hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-violet-400" /> Night hours by task</h2>
                    <p className="text-gray-400 text-xs mb-4">Where night effort is spent — top tasks by hours.</p>
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={(nightData.taskNight || []).slice(0, 14)} layout="vertical" margin={{ left: 4, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="task" stroke="#9ca3af" width={108} tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="hours" fill="#8b5cf6" name="Night hours" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><BookMarked className="w-5 h-5 mr-2 text-teal-400" /> Night hours by book element</h2>
                    <p className="text-gray-400 text-xs mb-4">Distribution across elements logged at night.</p>
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={(nightData.elementNight || []).slice(0, 12)} margin={{ bottom: 56 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="element" stroke="#9ca3af" angle={-28} textAnchor="end" height={64} interval={0} fontSize={10} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="hours" fill="#14b8a6" name="Night hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><PieChartIcon className="w-5 h-5 mr-2 text-fuchsia-400" /> Night hours — task mix</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={nightData.nightTaskShare || []}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={88}
                          paddingAngle={1}
                          stroke="#1f2937"
                          isAnimationActive={false}
                        >
                          {(nightData.nightTaskShare || []).map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) =>
                            active && payload?.[0] ? (
                              <div className="rounded-lg border border-indigo-500 bg-gray-900 p-3 text-sm shadow-xl">
                                <p className="text-white font-semibold">{payload[0].payload.fullName || payload[0].payload.name}</p>
                                <p className="text-indigo-200 mt-1">
                                  {(Number(payload[0].value) || 0).toFixed(1)} hrs · {payload[0].payload.nightPercentOfNightTotal ?? 0}%
                                </p>
                              </div>
                            ) : null
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><LayoutGrid className="w-5 h-5 mr-2 text-cyan-400" /> Night share by team</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={nightData.teamNightShare || []}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={88}
                          paddingAngle={1}
                          stroke="#1f2937"
                          isAnimationActive={false}
                        >
                          {(nightData.teamNightShare || []).map((_, i) => (
                            <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) =>
                            active && payload?.[0] ? (
                              <div className="rounded-lg border border-indigo-500 bg-gray-900 p-3 text-sm shadow-xl">
                                <p className="text-white font-semibold">{payload[0].payload.fullName || payload[0].payload.name}</p>
                                <p className="text-indigo-200 mt-1">
                                  {(Number(payload[0].value) || 0).toFixed(1)} hrs · {payload[0].payload.entries ?? 0} entries
                                </p>
                              </div>
                            ) : null
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-pink-400" /> Top contributors — night hours</h2>
                    <p className="text-gray-400 text-xs mb-4">Absolute night hours logged (not % of own total).</p>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={(nightData.contributorNight || []).slice(0, 14)} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="nightHours" fill="#6366f1" name="Night hours" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-pink-400" /> Contributors — night % of own hours</h2>
                    <p className="text-gray-400 text-xs mb-4">Who logs a large share of their time as Night mode (accountability lens).</p>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={(nightData.contributorNight || []).slice(0, 14)} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="nightPercentOfOwnHours" fill="#ec4899" name="Night % own" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Activity className="w-5 h-5 mr-2 text-emerald-400" /> Night vs day — hours by task (top)</h2>
                    <p className="text-gray-400 text-xs mb-4">Side-by-side night hours vs day-mode hours for the same task.</p>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart data={(nightData.nightVsDayByTask || []).filter((t) => t.nightHours > 0).slice(0, 12)} margin={{ bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="task" stroke="#9ca3af" angle={-30} textAnchor="end" height={80} interval={0} fontSize={10} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="nightHours" fill="#6366f1" name="Night hrs" isAnimationActive={false} />
                        <Bar dataKey="dayHours" fill="#94a3b8" name="Day-mode hrs" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Zap className="w-5 h-5 mr-2 text-amber-400" /> Night-to-day ratio by task</h2>
                    <p className="text-gray-400 text-xs mb-4">
                      Bars past <span className="text-amber-300 font-semibold">1.0</span> (dashed line) = more night than day-mode hours on that task.
                    </p>
                    <ResponsiveContainer width="100%" height={380}>
                      <BarChart
                        data={(nightData.nightVsDayByTask || [])
                          .filter((t) => t.nightHours > 0)
                          .map((t) => {
                            const ratio =
                              t.nightToDayHourRatio != null
                                ? t.nightToDayHourRatio
                                : t.dayHours > 0
                                  ? t.nightHours / t.dayHours
                                  : null;
                            const rounded = ratio != null ? Math.round(ratio * 1000) / 1000 : null;
                            return {
                              task: t.task,
                              ratio: rounded,
                              nightHours: t.nightHours,
                              dayHours: t.dayHours,
                              fill: rounded != null && rounded >= 1 ? '#f59e0b' : '#6366f1'
                            };
                          })
                          .filter((t) => t.ratio != null)
                          .sort((a, b) => b.ratio - a.ratio)
                          .slice(0, 12)}
                        layout="vertical"
                        margin={{ left: 8, right: 24 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" domain={[0, 'auto']} />
                        <YAxis type="category" dataKey="task" stroke="#9ca3af" width={100} tick={{ fontSize: 10 }} />
                        <ReferenceLine x={1} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: '1.0', fill: '#fbbf24', fontSize: 11 }} />
                        <Tooltip
                          content={({ active, payload }) =>
                            active && payload?.[0] ? (
                              <div className="rounded-lg border border-amber-500/60 bg-gray-900 p-3 text-sm shadow-xl">
                                <p className="text-white font-semibold">{payload[0].payload.task}</p>
                                <p className="text-amber-200 mt-1">
                                  Ratio: <span className="font-bold text-white">{payload[0].payload.ratio}</span>
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Night {payload[0].payload.nightHours?.toFixed(1)}h · Day-mode {payload[0].payload.dayHours?.toFixed(1)}h
                                </p>
                              </div>
                            ) : null
                          }
                        />
                        <Bar dataKey="ratio" name="Night ÷ day-mode" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                          {(nightData.nightVsDayByTask || [])
                            .filter((t) => t.nightHours > 0)
                            .map((t) => {
                              const ratio =
                                t.nightToDayHourRatio != null
                                  ? t.nightToDayHourRatio
                                  : t.dayHours > 0
                                    ? t.nightHours / t.dayHours
                                    : null;
                              const rounded = ratio != null ? Math.round(ratio * 1000) / 1000 : null;
                              return { rounded, fill: rounded != null && rounded >= 1 ? '#f59e0b' : '#6366f1' };
                            })
                            .filter((x) => x.rounded != null)
                            .sort((a, b) => b.rounded - a.rounded)
                            .slice(0, 12)
                            .map((x, i) => (
                              <Cell key={i} fill={x.fill} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-lime-400" /> Night entries by team</h2>
                    <p className="text-gray-400 text-xs mb-4">Volume of night log rows vs hours — spot teams logging often at night.</p>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={(nightData.teamNight || []).slice(0, 12)} margin={{ bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="team" stroke="#9ca3af" angle={-35} textAnchor="end" height={70} interval={0} fontSize={10} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="entries" fill="#a78bfa" name="Entries" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="hours" fill="#6366f1" name="Hours" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-emerald-400" /> Night units by task</h2>
                    <p className="text-gray-400 text-xs mb-4">Output (units) produced during night sessions.</p>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={(nightData.taskNight || []).filter((t) => (t.units || 0) > 0).slice(0, 12)} margin={{ bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="task" stroke="#9ca3af" angle={-30} textAnchor="end" height={80} interval={0} fontSize={10} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="units" fill="#10b981" name="Units" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Clock className="w-5 h-5 mr-2 text-amber-400" /> Submission / log hour</h2>
                    <p className="text-gray-400 text-xs mb-4">When night rows were submitted (hour of day).</p>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={nightData.hourlyBuckets || []} isAnimationActive={false}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9ca3af" label={{ value: 'Hour', fill: '#9ca3af', fontSize: 11 }} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="hours" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Hours" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Target className="w-5 h-5 mr-2 text-orange-400" /> Night workload by weekday</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={nightData.dowBuckets || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="hours" fill="#14b8a6" name="Hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-sky-400" /> Night hours — daily</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={nightData.nightTimeline || []} isAnimationActive={false}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="hours" stroke="#818cf8" strokeWidth={2} dot={false} name="Night hours" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-indigo-400" /> Night hours — by week</h2>
                    <p className="text-gray-400 text-xs mb-3">Weeks start Monday (work date).</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={nightData.weeklyNight || []} margin={{ bottom: 48 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="weekStart" stroke="#9ca3af" fontSize={10} angle={-25} textAnchor="end" height={56} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="hours" fill="#818cf8" name="Night hours" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-purple-400" /> Projects — units per night hour</h2>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={(nightData.projectsNight || []).filter((p) => p.hours >= 1).slice(0, 12)} margin={{ bottom: 72 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="project_name" stroke="#9ca3af" angle={-30} textAnchor="end" height={90} interval={0} fontSize={9} tickFormatter={(v) => (v.length > 28 ? `${v.slice(0, 26)}…` : v)} />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="unitsPerHour" fill="#a78bfa" name="Units / hr" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-amber-400" /> Flags &amp; anomalies</h2>
                    <ul className="space-y-3 text-sm text-gray-200 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                      {(nightData.anomalies || []).length === 0 && <li className="text-gray-500">No heuristic flags for the current filter.</li>}
                      {(nightData.anomalies || []).map((a, i) => (
                        <li key={i} className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
                          <span className="text-amber-300 font-semibold text-xs uppercase">{a.type?.replace(/_/g, ' ')}</span>
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
          <div className="space-y-8 pb-8 relative min-h-[16rem]">
            <FilterRefreshOverlay active={booksRefreshing} label="Updating cross-session books…" />
            <div className="rounded-xl border border-teal-500/40 bg-teal-950/20 p-4 text-teal-100 text-sm max-w-4xl">
              Books are grouped by stripping trailing academic session tokens from <code className="text-teal-300 bg-gray-900/80 px-1 rounded">project_name</code> (e.g. <code className="text-teal-300">…-25-26</code> and <code className="text-teal-300">…_26-27</code> collapse to the same base). Compare hours, contributors, and tasks across sessions to spot duplicate effort or unusual deltas.
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
                <span className="text-gray-400 text-sm">{crossBooks.summary.groupsReturned} book(s) with at least {bookSessionMin} session suffixes.</span>
              )}
              {(booksLoading || booksRefreshing) && (
                <span className="text-gray-500 text-sm italic">Updating…</span>
              )}
            </div>
            {booksLoading && !booksHasLoadedRef.current && (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500" />
              </div>
            )}
            {(booksHasLoadedRef.current || crossBooks?.groups) && !booksLoading && crossBooks?.groups && (
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
                  <p className="text-gray-400">No books matched with the current filters and session threshold. Try &quot;All&quot; teams / period or lower minimum sessions (not below 2 for cross-session compare).</p>
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
                            <Tooltip content={<CustomTooltip />} />
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
                            <Tooltip content={<CustomTooltip />} />
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
                            {(selectedBookGroup.insights || []).length === 0 && <li className="list-none text-gray-500">No cross-session insights.</li>}
                            {(selectedBookGroup.insights || []).map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Session detail</h4>
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
                                  <Tooltip content={<CustomTooltip />} />
                                  <Bar dataKey="hours" fill="#34d399" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                                </BarChart>
                              </ResponsiveContainer>
                              <div className="text-xs text-gray-400 max-h-52 overflow-y-auto custom-scrollbar">
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

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Auto-refreshing every minute</span>
      </div>

      {/* Project Details Modal */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-purple-500 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-600 bg-opacity-30 rounded-lg p-4 border border-purple-500">
                <p className="text-gray-300 text-sm">Total Hours</p>
                <p className="text-white text-2xl font-bold">{selectedProject.hours?.toFixed(2)}</p>
              </div>
              <div className="bg-pink-600 bg-opacity-30 rounded-lg p-4 border border-pink-500">
                <p className="text-gray-300 text-sm">Total Units</p>
                <p className="text-white text-2xl font-bold">{selectedProject.units || 0}</p>
              </div>
              <div className="bg-blue-600 bg-opacity-30 rounded-lg p-4 border border-blue-500">
                <p className="text-gray-300 text-sm">Total Tasks</p>
                <p className="text-white text-2xl font-bold">{selectedProject.tasks || 0}</p>
              </div>
            </div>

            {selectedProject.elements && selectedProject.elements.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Activity className="mr-2 text-green-400" /> Book Elements Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={selectedProject.elements}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.element}: ${entry.hours?.toFixed(1)}h`}
                      outerRadius={100}
                      dataKey="hours"
                      nameKey="element"
                    >
                      {selectedProject.elements.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Detailed Breakdown</h4>
                  <div className="space-y-2">
                    {selectedProject.elements.map((elem, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3" 
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          ></div>
                          <span className="text-gray-300">{elem.element}</span>
                        </div>
                        <span className="text-white font-semibold">{elem.hours?.toFixed(2)} hrs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualization;






































// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, 
//   Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter 
// } from 'recharts';
// import { 
//   Users, UserCheck, UserX, Moon, Sun, 
//   TrendingUp, Activity, Calendar, 
//   Filter, X, AlertCircle, CheckCircle2, Clock
// } from 'lucide-react';

// const API_URL = 'http://localhost:3002/api/workforce';
// const REFRESH_INTERVAL = 60000;

// // Sophisticated color palette
// const COLORS = {
//   primary: '#0ea5e9',
//   secondary: '#f59e0b',
//   success: '#10b981',
//   danger: '#ef4444',
//   warning: '#f59e0b',
//   info: '#06b6d4',
//   purple: '#8b5cf6',
//   pink: '#ec4899'
// };

// const CHART_COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'];

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-slate-800 border border-sky-400 rounded-lg p-4 shadow-2xl backdrop-blur-xl">
//         {label && <p className="text-white font-bold mb-2 text-sm">{label}</p>}
//         {payload.map((entry, index) => {
//           const entryName = entry.name || entry.dataKey || '';
//           const displayValue = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
          
//           return (
//             <p key={index} style={{ color: entry.color }} className="text-xs font-medium">
//               {entryName}: <span className="font-bold">{displayValue}</span>
//             </p>
//           );
//         })}
//       </div>
//     );
//   }
//   return null;
// };

// const StatCard = ({ icon: Icon, title, value, subtitle, color, percentage }) => (
//   <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white border-opacity-20`}>
//     <div className="flex items-start justify-between mb-3">
//       <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
//         <Icon className="w-7 h-7 text-white" />
//       </div>
//       <div className="text-right">
//         <div className="text-3xl font-black text-white mb-1">{value}</div>
//         {percentage !== undefined && (
//           <div className="text-xs font-bold text-white opacity-90">{percentage}%</div>
//         )}
//       </div>
//     </div>
//     <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-90">{title}</h3>
//     {subtitle && <p className="text-white text-xs opacity-75 mt-1 font-medium">{subtitle}</p>}
//   </div>
// );

// const Visualization = () => {
//   const [summary, setSummary] = useState(null);
//   const [attendanceOverview, setAttendanceOverview] = useState(null);
//   const [shiftDistribution, setShiftDistribution] = useState([]);
//   const [utilisation, setUtilisation] = useState([]);
//   const [employeeAvailability, setEmployeeAvailability] = useState(null);
//   const [teamCapacity, setTeamCapacity] = useState([]);
//   const [leaveIndicators, setLeaveIndicators] = useState(null);
//   const [dailyActivity, setDailyActivity] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Filter states
//   const [teams, setTeams] = useState(['All']);
//   const [roles, setRoles] = useState(['All']);
  
//   const [selectedTeam, setSelectedTeam] = useState('All');
//   const [selectedRole, setSelectedRole] = useState('All');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedShiftType, setSelectedShiftType] = useState('All');

//   const fetchFilterOptions = async () => {
//     try {
//       const [teamsRes, rolesRes] = await Promise.all([
//         fetch(`${API_URL}/filters/teams`).catch(() => ({ json: async () => [] })),
//         fetch(`${API_URL}/filters/roles`).catch(() => ({ json: async () => [] })),
//       ]);

//       const [teamsData, rolesData] = await Promise.all([
//         teamsRes.json(),
//         rolesRes.json(),
//       ]);

//       setTeams(['All', ...teamsData]);
//       setRoles(['All', ...rolesData]);
//     } catch (error) {
//       console.error('Error fetching filter options:', error);
//     }
//   };

//   const buildQueryParams = () => {
//     const params = new URLSearchParams();
//     if (selectedTeam !== 'All') params.append('team', selectedTeam);
//     if (selectedRole !== 'All') params.append('role', selectedRole);
//     if (selectedDate) params.append('date', selectedDate);
//     if (selectedShiftType !== 'All') params.append('shiftType', selectedShiftType);
//     return params.toString();
//   };

//   const fetchData = async () => {
//     try {
//       const queryString = buildQueryParams();
//       const urlSuffix = queryString ? `?${queryString}` : '';

//       const [
//         summaryRes, attendanceRes, shiftRes, utilisationRes,
//         availabilityRes, capacityRes, leaveRes, activityRes
//       ] = await Promise.all([
//         fetch(`${API_URL}/summary${urlSuffix}`),
//         fetch(`${API_URL}/attendance-overview${urlSuffix}`),
//         fetch(`${API_URL}/shift-distribution${urlSuffix}`),
//         fetch(`${API_URL}/utilisation${urlSuffix}`),
//         fetch(`${API_URL}/employee-availability${urlSuffix}`),
//         fetch(`${API_URL}/team-capacity${urlSuffix}`),
//         fetch(`${API_URL}/leave-indicators${urlSuffix}`),
//         fetch(`${API_URL}/daily-activity${urlSuffix}`),
//       ]);

//       setSummary(await summaryRes.json());
//       setAttendanceOverview(await attendanceRes.json());
//       setShiftDistribution(await shiftRes.json());
//       setUtilisation(await utilisationRes.json());
//       setEmployeeAvailability(await availabilityRes.json());
//       setTeamCapacity(await capacityRes.json());
//       setLeaveIndicators(await leaveRes.json());
//       setDailyActivity(await activityRes.json());
//       setLastUpdate(new Date());
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFilterOptions();
//   }, []);

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, REFRESH_INTERVAL);
//     return () => clearInterval(interval);
//   }, [selectedTeam, selectedRole, selectedDate, selectedShiftType]);

//   const clearAllFilters = () => {
//     setSelectedTeam('All');
//     setSelectedRole('All');
//     setSelectedDate(new Date().toISOString().split('T')[0]);
//     setSelectedShiftType('All');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative w-32 h-32 mx-auto mb-6">
//             <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
//             <div className="absolute inset-3 border-4 border-amber-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
//           </div>
//           <p className="text-white text-2xl font-bold tracking-wide">Loading Workforce Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const attendanceData = attendanceOverview ? [
//     { name: 'Present', value: attendanceOverview.present, color: COLORS.success },
//     { name: 'Absent', value: attendanceOverview.absent, color: COLORS.danger },
//     { name: 'Entry Pending', value: attendanceOverview.entryPending, color: COLORS.warning }
//   ] : [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-950">
//       {/* Fixed Header and Filters */}
//       <div className="sticky top-0 z-50 bg-slate-950 bg-opacity-90 backdrop-blur-xl border-b border-sky-500 border-opacity-30 shadow-2xl">
//         {/* Header */}
//         <div className="px-8 pt-8 pb-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 mb-2 tracking-tight">
//                 Workforce Operations
//               </h1>
//               <p className="text-sky-200 text-sm font-medium tracking-wide">
//                 Real-time workforce insights • Last updated: {lastUpdate.toLocaleTimeString()}
//               </p>
//             </div>
//             <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl px-6 py-4 shadow-xl">
//               <Calendar className="w-10 h-10 text-white" />
//             </div>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="px-8 pb-6">
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-sky-500 border-opacity-20">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-xl font-bold text-white flex items-center tracking-wide">
//                 <Filter className="mr-3 text-sky-400 w-5 h-5" /> 
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">Filters</span>
//               </h2>
//               <button
//                 onClick={clearAllFilters}
//                 className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 text-sm font-bold tracking-wide shadow-lg hover:shadow-sky-500/50"
//               >
//                 <X className="w-4 h-4 mr-2" /> CLEAR ALL
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Team Filter */}
//               <div>
//                 <label className="text-sky-200 text-xs font-bold mb-2 block uppercase tracking-wider">Team</label>
//                 <select
//                   value={selectedTeam}
//                   onChange={(e) => setSelectedTeam(e.target.value)}
//                   className="w-full bg-slate-800 text-white border border-sky-500 border-opacity-30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
//                 >
//                   {teams.map(team => (
//                     <option key={team} value={team}>{team}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Role Filter */}
//               <div>
//                 <label className="text-sky-200 text-xs font-bold mb-2 block uppercase tracking-wider">Role</label>
//                 <select
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="w-full bg-slate-800 text-white border border-sky-500 border-opacity-30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
//                 >
//                   {roles.map(role => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Date Filter */}
//               <div>
//                 <label className="text-sky-200 text-xs font-bold mb-2 block uppercase tracking-wider">Date</label>
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="w-full bg-slate-800 text-white border border-sky-500 border-opacity-30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
//                 />
//               </div>

//               {/* Shift Type Filter */}
//               <div>
//                 <label className="text-sky-200 text-xs font-bold mb-2 block uppercase tracking-wider">Shift Type</label>
//                 <select
//                   value={selectedShiftType}
//                   onChange={(e) => setSelectedShiftType(e.target.value)}
//                   className="w-full bg-slate-800 text-white border border-sky-500 border-opacity-30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium transition-all"
//                 >
//                   <option value="All">All</option>
//                   <option value="NIGHT">Night</option>
//                   <option value="SUNDAY">Sunday</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div className="px-8 py-8 overflow-y-auto">
//         {/* Summary Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5 mb-8">
//           <StatCard
//             icon={Users}
//             title="Total Employees"
//             value={summary?.totalEmployees || 0}
//             color="from-sky-500 to-blue-600"
//           />
//           <StatCard
//             icon={Activity}
//             title="Active Employees"
//             value={summary?.activeEmployees || 0}
//             color="from-cyan-500 to-teal-600"
//           />
//           <StatCard
//             icon={UserCheck}
//             title="Present"
//             value={summary?.present || 0}
//             color="from-green-500 to-emerald-600"
//           />
//           <StatCard
//             icon={UserX}
//             title="Absent"
//             value={summary?.absent || 0}
//             color="from-red-500 to-rose-600"
//           />
//           <StatCard
//             icon={Moon}
//             title="Night Shifts"
//             value={summary?.nightShifts || 0}
//             color="from-indigo-500 to-purple-600"
//           />
//           <StatCard
//             icon={Sun}
//             title="Sunday Shifts"
//             value={summary?.sundayShifts || 0}
//             color="from-amber-500 to-orange-600"
//           />
//           <StatCard
//             icon={CheckCircle2}
//             title="Entry Compliance"
//             value={summary?.entryCompliance || 0}
//             percentage={summary?.entryCompliance || 0}
//             color="from-pink-500 to-rose-600"
//             subtitle="Submission Rate"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Attendance Overview */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <UserCheck className="mr-3 text-sky-400" /> Attendance Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={attendanceData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   dataKey="value"
//                   nameKey="name"
//                   label={(entry) => `${entry.name}: ${entry.value}`}
//                 >
//                   {attendanceData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="mt-4 grid grid-cols-3 gap-3">
//               {attendanceData.map((item, idx) => (
//                 <div key={idx} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
//                   <div className="text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
//                   <div className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">{item.name}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Shift Distribution by Team */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <Moon className="mr-3 text-sky-400" /> Shift Distribution by Team
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={shiftDistribution}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
//                 <XAxis 
//                   dataKey="team" 
//                   stroke="#94a3b8" 
//                   angle={-45} 
//                   textAnchor="end" 
//                   height={100} 
//                   fontSize={11}
//                   fontWeight="600"
//                 />
//                 <YAxis stroke="#94a3b8" fontSize={11} fontWeight="600" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="night" fill={COLORS.purple} radius={[8, 8, 0, 0]} name="Night Shifts" />
//                 <Bar dataKey="sunday" fill={COLORS.secondary} radius={[8, 8, 0, 0]} name="Sunday Shifts" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Workforce Utilisation */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20 lg:col-span-2">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <Activity className="mr-3 text-sky-400" /> Workforce Utilisation (Avg Hours per Employee)
//             </h2>
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={utilisation}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
//                 <XAxis 
//                   dataKey="team" 
//                   stroke="#94a3b8" 
//                   angle={-45} 
//                   textAnchor="end" 
//                   height={100} 
//                   fontSize={11}
//                   fontWeight="600"
//                 />
//                 <YAxis stroke="#94a3b8" fontSize={11} fontWeight="600" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Bar dataKey="avgHoursPerEmployee" fill={COLORS.primary} radius={[8, 8, 0, 0]} name="Avg Hours/Employee">
//                   {utilisation.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Team Capacity Overview */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20 lg:col-span-2">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <TrendingUp className="mr-3 text-sky-400" /> Team Capacity Overview
//             </h2>
//             <ResponsiveContainer width="100%" height={400}>
//               <ScatterChart>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
//                 <XAxis 
//                   type="number" 
//                   dataKey="totalEmployees" 
//                   name="Total Employees" 
//                   stroke="#94a3b8"
//                   label={{ value: 'Total Employees', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontWeight: 600 }}
//                   fontSize={11}
//                   fontWeight="600"
//                 />
//                 <YAxis 
//                   type="number" 
//                   dataKey="totalHours" 
//                   name="Total Hours" 
//                   stroke="#94a3b8"
//                   label={{ value: 'Total Hours', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontWeight: 600 }}
//                   fontSize={11}
//                   fontWeight="600"
//                 />
//                 <Tooltip 
//                   cursor={{ strokeDasharray: '3 3' }}
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length) {
//                       const data = payload[0].payload;
//                       return (
//                         <div className="bg-slate-800 border border-sky-400 rounded-lg p-4 shadow-2xl">
//                           <p className="text-white font-bold mb-1">{data.team}</p>
//                           <p className="text-sky-300 text-xs">Total Employees: <span className="font-bold">{data.totalEmployees}</span></p>
//                           <p className="text-green-300 text-xs">Active Employees: <span className="font-bold">{data.activeEmployees}</span></p>
//                           <p className="text-amber-300 text-xs">Total Hours: <span className="font-bold">{data.totalHours.toFixed(2)}</span></p>
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Scatter 
//                   name="Teams" 
//                   data={teamCapacity} 
//                   fill={COLORS.primary}
//                 >
//                   {teamCapacity.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={CHART_COLORS[index % CHART_COLORS.length]}
//                       r={8 + (entry.activeEmployees * 2)}
//                     />
//                   ))}
//                 </Scatter>
//               </ScatterChart>
//             </ResponsiveContainer>
//             <div className="mt-4 text-xs text-slate-400 text-center font-medium">
//               Bubble size represents number of active employees
//             </div>
//           </div>

//           {/* Leave Indicators */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <AlertCircle className="mr-3 text-sky-400" /> Leave / Half-Day Indicators
//             </h2>
//             <div className="space-y-4">
//               <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-5 shadow-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-white text-xs font-bold uppercase tracking-wider opacity-90">Full Leave</div>
//                     <div className="text-white text-3xl font-black mt-1">{leaveIndicators?.fullLeave || 0}</div>
//                   </div>
//                   <UserX className="w-12 h-12 text-white opacity-50" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-5 shadow-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-white text-xs font-bold uppercase tracking-wider opacity-90">Half Day</div>
//                     <div className="text-white text-3xl font-black mt-1">{leaveIndicators?.halfDay || 0}</div>
//                   </div>
//                   <Clock className="w-12 h-12 text-white opacity-50" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl p-5 shadow-lg">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-white text-xs font-bold uppercase tracking-wider opacity-90">Reduced Hours</div>
//                     <div className="text-white text-3xl font-black mt-1">{leaveIndicators?.reducedHours || 0}</div>
//                   </div>
//                   <Activity className="w-12 h-12 text-white opacity-50" />
//                 </div>
//               </div>
//             </div>
//             <div className="mt-5 p-4 bg-slate-800 rounded-xl border border-slate-700">
//               <p className="text-xs text-slate-300 font-medium leading-relaxed">
//                 <span className="font-bold text-sky-300">Note:</span> Derived from work entry patterns. 
//                 Full leave = no entry, Half day = &lt;4 hours, Reduced = &lt;6 hours.
//               </p>
//             </div>
//           </div>

//           {/* Daily Activity Timeline */}
//           <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20">
//             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//               <TrendingUp className="mr-3 text-sky-400" /> Daily Activity (Last 30 Days)
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={dailyActivity}>
//                 <defs>
//                   <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
//                   </linearGradient>
//                   <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.1}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
//                 <XAxis 
//                   dataKey="date" 
//                   stroke="#94a3b8" 
//                   fontSize={9}
//                   fontWeight="600"
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis stroke="#94a3b8" fontSize={11} fontWeight="600" />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend />
//                 <Area 
//                   type="monotone" 
//                   dataKey="hours" 
//                   stroke={COLORS.primary} 
//                   fillOpacity={1} 
//                   fill="url(#colorHours)"
//                   name="Total Hours"
//                   strokeWidth={2}
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="employees" 
//                   stroke={COLORS.success} 
//                   fillOpacity={1} 
//                   fill="url(#colorEmployees)"
//                   name="Active Employees"
//                   strokeWidth={2}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Employee Availability Grid */}
//           {employeeAvailability && employeeAvailability.employees && (
//             <div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-sky-500 border-opacity-20 lg:col-span-2">
//               <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-6 flex items-center tracking-tight">
//                 <Calendar className="mr-3 text-sky-400" /> Employee Availability View (Last 30 Days)
//               </h2>
//               <div className="overflow-x-auto">
//                 <div className="inline-block min-w-full">
//                   <div className="overflow-hidden rounded-xl border border-slate-700">
//                     <table className="min-w-full">
//                       <thead className="bg-slate-800">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-bold text-sky-300 uppercase tracking-wider sticky left-0 bg-slate-800 z-10">
//                             Employee
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-bold text-sky-300 uppercase tracking-wider sticky left-0 bg-slate-800 z-10 ml-2">
//                             Team
//                           </th>
//                           {employeeAvailability.dateRange.slice(-15).map(date => (
//                             <th key={date} className="px-2 py-3 text-center text-xs font-bold text-sky-300 uppercase tracking-wider">
//                               {new Date(date).getDate()}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="bg-slate-900 divide-y divide-slate-700">
//                         {employeeAvailability.employees.slice(0, 20).map((emp, idx) => (
//                           <tr key={idx} className="hover:bg-slate-800 transition-colors">
//                             <td className="px-4 py-3 text-sm font-medium text-white sticky left-0 bg-slate-900 z-10">
//                               {emp.name}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-slate-300 sticky left-0 bg-slate-900 z-10">
//                               {emp.team}
//                             </td>
//                             {emp.dates.slice(-15).map((dayData, dateIdx) => (
//                               <td key={dateIdx} className="px-2 py-3 text-center">
//                                 {dayData.logged ? (
//                                   <div className="w-6 h-6 bg-green-500 rounded-md mx-auto shadow-lg shadow-green-500/50"></div>
//                                 ) : (
//                                   <div className="w-6 h-6 bg-slate-700 rounded-md mx-auto"></div>
//                                 )}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 flex items-center justify-center space-x-6 text-xs font-medium">
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-green-500 rounded mr-2 shadow-lg shadow-green-500/50"></div>
//                   <span className="text-slate-300">Work Logged</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
//                   <span className="text-slate-300">No Entry</span>
//                 </div>
//               </div>
//               <div className="mt-3 text-xs text-slate-400 text-center font-medium">
//                 Showing last 15 days for first 20 employees
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Auto-refresh indicator */}
//       <div className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 backdrop-blur-xl border border-white border-opacity-20">
//         <div className="relative">
//           <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//           <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
//         </div>
//         <span className="text-sm font-bold tracking-wide">Auto-refresh: 1 min</span>
//       </div>
//     </div>
//   );
// };

// export default Visualization;