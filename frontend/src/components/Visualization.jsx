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
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap } from 'recharts';
import { TrendingUp, Users, Clock, Briefcase, Activity, Zap, Target, CheckCircle, Filter, X, Search, Moon, BookMarked, AlertTriangle, LayoutDashboard } from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const API_URL = `${BACKEND_URL}/api/dashboard`;
const REFRESH_INTERVAL = 60000;
/** Default Overall dashboard slice: smaller query for fast first paint; full range prefetched in background */
const DEFAULT_DASH_PERIOD = 'Last 7 Days';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

function mainDashTabFromPath(pathname) {
  if (pathname === '/night') return 'night';
  if (pathname === '/books') return 'books';
  return 'overall';
}

// Work mode colors matching PowerBI style - ALL 8 work modes
const WORK_MODE_COLORS = {
  'WFH': '#8b5cf6',           // Purple
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
  'Editorial': (teamName) => teamName.startsWith('Editorial') || teamName.startsWith('CSMA'),
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
      pendingRef.current = { left: e.clientX - 295, top: e.clientY - 30 };
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

const PROJECT_TREEMAP_CHUNK = 10;

/** Interpolate purple scale: light = low, dark = high */
function purpleHeatAlpha(t) {
  const x = Math.max(0, Math.min(1, t));
  const light = [233, 213, 255];
  const dark = [76, 29, 149];
  const r = Math.round(light[0] + (dark[0] - light[0]) * x);
  const g = Math.round(light[1] + (dark[1] - light[1]) * x);
  const b = Math.round(light[2] + (dark[2] - light[2]) * x);
  return `rgb(${r},${g},${b})`;
}

const TasksByHoursTooltip = memo(({ active, payload, metaRef }) => {
  if (!active || !payload?.length) return null;
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
  const idxPct = totalHours > 0 ? (totalUnits / totalHours) * 100 : null;
  return (
    <div className="border-2 border-purple-500 rounded-lg p-3 shadow-2xl min-w-[160px]" style={{ backgroundColor: 'rgb(17 24 39)', zIndex: 10002 }}>
      <p className="text-white font-semibold text-sm">{empName}</p>
      <p className="text-purple-300 text-xs mt-2">
        Total hours: <span className="text-white font-bold">{totalHours.toFixed(1)}</span>
      </p>
      {totalUnits > 0 && (
        <p className="text-purple-300 text-xs mt-1">
          Total units: <span className="text-white font-bold">{totalUnits}</span>
        </p>
      )}
      <div className="mt-2 border-t border-gray-700/70 pt-2 space-y-1 max-h-44 overflow-y-auto pr-1">
        {taskRows.map((r) => (
          <p key={`${empName}-${r.task}`} className="text-[11px] text-gray-300 flex items-center justify-between gap-3">
            <span className="truncate max-w-[140px]" title={r.task}>{r.task}</span>
            <span className="tabular-nums text-white">{r.hours.toFixed(1)}h</span>
          </p>
        ))}
      </div>
      <p className="text-purple-300 text-xs mt-1">
        Avg productivity:{' '}
        <span className="text-white font-bold">
          {idxPct == null ? '—' : `${idxPct.toFixed(1)}%`}
        </span>
        <span className="text-gray-500 ml-1">(units÷hours × 100)</span>
      </p>
    </div>
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
        <div className="mt-2 border-t border-gray-700 pt-2 space-y-1">
          {breakdown.slice(0, 8).map((t) => (
            <p key={`${bKey}-${t.task}`} className="text-gray-200 flex items-center justify-between gap-3">
              <span className="truncate max-w-[150px]" title={t.task}>{t.task}</span>
              <span className="text-white tabular-nums">{`${Number(t.hours || 0).toFixed(1)}h`}</span>
            </p>
          ))}
          {breakdown.length > 8 && (
            <p className="text-[10px] text-gray-400">+{breakdown.length - 8} more tasks</p>
          )}
        </div>
      ) : (
        <p className="text-gray-400 mt-2">No task-level breakdown for this segment.</p>
      )}
    </div>
  );
});
ProjectEmployeeTooltip.displayName = 'ProjectEmployeeTooltip';

/** Recharts nested treemap cell — project hue + darker task shards */
function ProjectEffortTreemapContent(props) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    index,
    children
  } = props;
  const projIdx =
    (typeof props.projColorIdx === 'number' ? props.projColorIdx : undefined) ??
    (typeof props.payload?.projColorIdx === 'number' ? props.payload.projColorIdx : (index ?? 0));
  const hasKids = Array.isArray(children) && children.length > 0;
  const base = COLORS[(projIdx ?? 0) % COLORS.length];
  const fill = hasKids ? base : adjustColor(base, -18 - ((index ?? 0) % 6) * 10);
  if (width < 4 || height < 4) return null;
  const fullTitle = `${name || '—'}${props.detail ? `\n${props.detail}` : props.subtitle ? `\n${props.subtitle}` : ''}`;
  const maxChars = Math.max(6, Math.min(28, Math.floor((width - 12) / 6.5)));
  const raw = String(name || '');
  const shortName = raw.length > maxChars ? `${raw.slice(0, maxChars - 1)}…` : raw;

  const showProjectLabel = hasKids && width >= 56 && height >= 22;

  const leaf = !hasKids;
  const hoursMatch =
    typeof props.subtitle === 'string' ? props.subtitle.match(/([\d.]+)\s*h/i) : null;
  const hoursFromSub = hoursMatch ? hoursMatch[1] : null;
  /** Old logic showed hours from 44×18 but name only from 84×26 — always pair label + metric when space allows */
  const canShowLeafLabel = leaf && width >= 36 && height >= 14;
  const stackedLeafLines = leaf && !!hoursFromSub && height >= 22 && width >= 42;
  const compactLeafCombo = leaf && !!hoursFromSub && !stackedLeafLines && canShowLeafLabel;
  const nameOnlyLeaf = leaf && !hoursFromSub && canShowLeafLabel;
  const labelMidY = y + height / 2;

  const textStroke = 'rgba(15, 23, 42, 0.92)';
  const textFill = '#f8fafc';

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#0f172a" strokeWidth={1} rx={2} />
      {showProjectLabel && (
        <text
          x={x + 5}
          y={y + 15}
          fill={textFill}
          stroke={textStroke}
          strokeWidth={2.5}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontSize={width > 120 ? 11 : 10}
          fontWeight={700}
          className="pointer-events-none"
        >
          {shortName}
        </text>
      )}
      {stackedLeafLines && (
        <>
          <text
            x={x + 4}
            y={y + 14}
            fill={textFill}
            stroke={textStroke}
            strokeWidth={2}
            strokeLinejoin="round"
            paintOrder="stroke fill"
            fontSize={width < 68 ? 8 : 9}
            fontWeight={600}
            className="pointer-events-none"
          >
            {shortName}
          </text>
          <text
            x={x + 4}
            y={y + 26}
            fill="#e2e8f0"
            stroke={textStroke}
            strokeWidth={1.5}
            paintOrder="stroke fill"
            fontSize={width < 68 ? 7.5 : 9}
            fontWeight={500}
            className="pointer-events-none"
          >
            {`${Number(hoursFromSub).toFixed(0)}h`}
          </text>
        </>
      )}
      {compactLeafCombo && (
        <text
          x={x + 4}
          y={labelMidY}
          dominantBaseline="middle"
          fill={textFill}
          stroke={textStroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontSize={width < 54 ? 7 : width < 70 ? 7.5 : 8}
          fontWeight={600}
          className="pointer-events-none"
        >
          {`${shortName} · ${Number(hoursFromSub).toFixed(0)}h`}
        </text>
      )}
      {nameOnlyLeaf && (
        <text
          x={x + 4}
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
  const [workMode, setWorkMode] = useState([]);
  const [workModeByDays, setWorkModeByDays] = useState([]);
  const [elements, setElements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employeeTaskBreakdown, setEmployeeTaskBreakdown] = useState([]);
  const [projectTaskEffort, setProjectTaskEffort] = useState([]);
  const [projectEmployeeBreakdown, setProjectEmployeeBreakdown] = useState([]);
  const [projectTreemapChunkStart, setProjectTreemapChunkStart] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [nightData, setNightData] = useState(null);
  const [nightLoading, setNightLoading] = useState(false);
  const [crossBooks, setCrossBooks] = useState(null);
  const [booksLoading, setBooksLoading] = useState(false);
  const [selectedBookGroup, setSelectedBookGroup] = useState(null);
  const [bookSessionMin, setBookSessionMin] = useState(2);
  const crossBooksFetchSeq = useRef(0);
  const crossBookDetailRef = useRef(null);
  /** Cross-filter Work Distribution: selected employee from stacked bar (syncs heatmap) */
  const [selectedEmployeeFromStack, setSelectedEmployeeFromStack] = useState(null);
  const [effortTreemapMetric, setEffortTreemapMetric] = useState('hours');
  const tasksByHoursMetaRef = useRef(new Map());

  /** Invalidate in-flight prefetch when filters/tab change */
  const prefetchGenerationRef = useRef(0);
  /** Cached "All" dataset for instant switch: { teamKey, bundle } */
  const allDataCacheRef = useRef(null);
  /** Fresh values for scheduled auto-refresh */
  const refreshDashFiltersRef = useRef({ department: 'All', team: 'All', employee: 'All', period: DEFAULT_DASH_PERIOD });
  /** Avoid stale-route checks after awaits (fixes dropped applies under Strict Mode / fast tab switches). */
  const dashTabRef = useRef(mainDashTabFromPath(location.pathname));
  dashTabRef.current = mainDashTabFromPath(location.pathname);

  // Modal states for project details
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Hardcoded departments (frontend only)
  const departments = ['All', 'DTP', 'Editorial', 'Digital Marketing'];

  const workModeByDaysChartData = useMemo(() => workModeByDays, [workModeByDays]);

  const workDistributionAgg = useMemo(() => {
    const flat = employeeTaskBreakdown || [];
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
        row[t] = meta.get(kk)?.hours || 0;
      }
      const ok = `${emp}\tOther`;
      const ov = meta.get(ok)?.hours || 0;
      if (ov > 0) row.Other = ov;
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
  }, [employeeTaskBreakdown, selectedEmployeeFromStack]);
  const workModeChartMinWidth = useMemo(
    () => Math.max(1100, (workModeByDaysChartData?.length || 0) * 38),
    [workModeByDaysChartData]
  );
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

    const tree = picked.map((p, projIdx) => {
      const children = p.arr
        .filter((row) =>
          effortTreemapMetric === 'hours' ? (row.hours || 0) > 0 : (row.units || 0) > 0
        )
        .map((row) => {
          const hrs = row.hours || 0;
          const un = row.units || 0;
          const size =
            effortTreemapMetric === 'hours' ? Math.max(hrs, 0.001) : Math.max(un, 0.001);
          const pctGrand =
            effortTreemapMetric === 'hours'
              ? grandHours > 0 ? (hrs / grandHours) * 100 : 0
              : grandUnits > 0 ? (un / grandUnits) * 100 : 0;
          const metricTotal = effortTreemapMetric === 'hours' ? p.hours : p.units;
          const pctProj = metricTotal > 0 ? (size / metricTotal) * 100 : 0;
          const shortH = hrs >= 100 ? `${Math.round(hrs)}h` : `${hrs.toFixed(1)}h`;
          const shortU = `${un}u`;
          return {
            name: row.task_name,
            size,
            projColorIdx: projIdx,
            subtitle: `${shortH} · ${shortU}`,
            detail: `Project: ${p.name}\n${hrs.toFixed(1)} h · ${un} units · ${pctGrand.toFixed(1)}% of scope · ${pctProj.toFixed(0)}% of ${p.name}`
          };
        })
        .sort((a, b) => b.size - a.size);
      const sumChild = children.reduce((s, c) => s + c.size, 0);
      return {
        name: p.name,
        size: Math.max(sumChild, 0.001),
        projColorIdx: projIdx,
        subtitle: `${Math.round(p.hours || 0)}h · ${p.units || 0}u`,
        detail: `${p.name}\n${(p.hours || 0).toFixed(1)} h · ${p.units || 0} units (project total)`,
        children
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
      tree,
      totalProjects,
      chunkStart,
      chunkOptions,
      grandTotals: {
        hours: grandHours,
        units: picked.reduce((s, p) => s + p.units, 0)
      }
    };
  }, [projectTaskEffort, effortTreemapMetric, projectTreemapChunkStart]);

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

  const handleTasksByEmployeeBarClick = useCallback((data) => {
    if (!data?.activePayload?.[0]) return;
    const row = data.activePayload[0].payload;
    const name = row?.name;
    if (!name) return;
    setSelectedEmployeeFromStack((prev) => (prev === name ? null : name));
  }, []);

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

  /** One bad endpoint cannot wipe the dashboard; pool/timeouts won't reject the whole bundle. */
  const fetchDashboardBundle = async (department, team, employee, period) => {
    const urlSuffix = dashboardUrlSuffix(department, team, employee, period);
    const endpoints = [
      `${API_URL}/overview${urlSuffix}`,
      `${API_URL}/projects${urlSuffix}`,
      `${API_URL}/employees${urlSuffix}`,
      `${API_URL}/teams${urlSuffix}`,
      `${API_URL}/timeline${urlSuffix}`,
      `${API_URL}/workmode${urlSuffix}`,
      `${API_URL}/workmode-by-days${urlSuffix}`,
      `${API_URL}/elements${urlSuffix}`,
      `${API_URL}/tasks${urlSuffix}`,
      `${API_URL}/status${urlSuffix}`,
      `${API_URL}/employee-task-breakdown${urlSuffix}`,
      `${API_URL}/project-task-effort${urlSuffix}`,
      `${API_URL}/project-employee-breakdown${urlSuffix}`,
    ];

    const settled = await Promise.allSettled(endpoints.map((u) => fetch(u)));
    const responses = settled.map((r) => (r.status === 'fulfilled' ? r.value : null));

    const [
      overview,
      projects,
      employees,
      teams,
      timeline,
      workMode,
      workModeByDays,
      elements,
      tasks,
      statuses,
      jt1,
      jt2,
      jt3,
    ] = await Promise.all([
      responses[0] ? parseOverviewJson(responses[0]) : Promise.resolve(null),
      responses[1] ? parseArrJson(responses[1]) : Promise.resolve([]),
      responses[2] ? parseArrJson(responses[2]) : Promise.resolve([]),
      responses[3] ? parseArrJson(responses[3]) : Promise.resolve([]),
      responses[4] ? parseArrJson(responses[4]) : Promise.resolve([]),
      responses[5] ? parseArrJson(responses[5]) : Promise.resolve([]),
      responses[6] ? parseArrJson(responses[6]) : Promise.resolve([]),
      responses[7] ? parseArrJson(responses[7]) : Promise.resolve([]),
      responses[8] ? parseArrJson(responses[8]) : Promise.resolve([]),
      responses[9] ? parseArrJson(responses[9]) : Promise.resolve([]),
      responses[10] ? parseArrJson(responses[10]) : Promise.resolve([]),
      responses[11] ? parseArrJson(responses[11]) : Promise.resolve([]),
      responses[12] ? parseArrJson(responses[12]) : Promise.resolve([]),
    ]);

    return {
      overview,
      projects,
      employees,
      teams,
      timeline,
      workMode,
      workModeByDays,
      elements,
      tasks,
      statuses,
      employeeTaskBreakdown: jt1,
      projectTaskEffort: jt2,
      projectEmployeeBreakdown: jt3,
    };
  };

  const applyDashboardBundle = (b) => {
    setOverview(b.overview ?? null);
    setProjects(b.projects || []);
    setEmployees(b.employees || []);
    setTeams(b.teams || []);
    setTimeline(b.timeline || []);
    setWorkMode(b.workMode || []);
    setWorkModeByDays(b.workModeByDays || []);
    setElements(b.elements || []);
    setTasks(b.tasks || []);
    setStatuses(b.statuses || []);
    setEmployeeTaskBreakdown(b.employeeTaskBreakdown || []);
    setProjectTaskEffort(b.projectTaskEffort || []);
    setProjectEmployeeBreakdown(b.projectEmployeeBreakdown || []);
  };

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

  /** Night / Books tabs don't use the Overall fetch effect; avoid a stuck splash loader */
  useEffect(() => {
    if (dashTab !== 'overall') setLoading(false);
    if (dashTab === 'overall') setLoading(true);
  }, [dashTab]);

  // Overall dashboard: default period slices fast query; prefetch full-range in background when not on "All"
  useEffect(() => {
    if (dashTab !== 'overall') return undefined;

    prefetchGenerationRef.current += 1;
    const prefetchGenAtStart = prefetchGenerationRef.current;

    let cancelled = false;
    let intervalId = null;

    const teamEmpKey = `${selectedDepartment}|${selectedTeam}|${selectedEmployee}`;

    async function syncDashboard() {
      try {
        // Block UI until this filter slice is ready (prevents click/portal gaps)
        setLoading(true);
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
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!cancelled) setLoading(false);
      }
    }

    syncDashboard();

    intervalId = window.setInterval(() => {
      const r = refreshDashFiltersRef.current;
      fetchDashboardBundle(r.department, r.team, r.employee, r.period)
        .then((fresh) => {
          applyDashboardBundle(fresh);
          setLastUpdate(new Date());
        })
        .catch(() => {});
    }, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalId != null) window.clearInterval(intervalId);
      prefetchGenerationRef.current += 1;
    };
  }, [dashTab, selectedDepartment, selectedTeam, selectedEmployee, selectedPeriod]);

  useEffect(() => {
    setSelectedEmployeeFromStack(null);
  }, [selectedTeam, selectedEmployee, selectedPeriod]);
  useEffect(() => {
    setProjectTreemapChunkStart(0);
  }, [selectedTeam, selectedEmployee, selectedPeriod]);

  const fetchNightAnalytics = async () => {
    setNightLoading(true);
    try {
      const queryString = buildQueryParams();
      const urlSuffix = queryString ? `?${queryString}` : '';
      const res = await fetch(`${API_URL}/night-analytics${urlSuffix}`);
      const json = await res.json();
      setNightData(json.error ? null : json);
    } catch (e) {
      console.error('Night analytics fetch failed:', e);
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
      if (selectedTeam !== 'All') params.append('team', selectedTeam);
      if (selectedEmployee !== 'All') params.append('employee', selectedEmployee);
      if (selectedPeriod !== 'All') params.append('period', selectedPeriod);
      params.append('minSessions', String(bookSessionMin));
      const qs = params.toString();
      const res = await fetch(`${API_URL}/cross-session-books${qs ? `?${qs}` : ''}`);
      const json = await res.json();
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(json.error ? null : json);
    } catch (e) {
      console.error('Cross-session books fetch failed:', e);
      if (crossBooksFetchSeq.current !== seq) return;
      setCrossBooks(null);
    } finally {
      if (crossBooksFetchSeq.current === seq) {
        setBooksLoading(false);
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
    // Reset team and employee when department changes
    setSelectedTeam('All');
    setSelectedEmployee('All');
    setEmployeeSearch('');
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

  if (loading) {
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
              <LayoutDashboard className="w-4 h-4" /> Overall
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

              {/* Team Name Filter */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Team Name</label>
                <select
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedDepartment === 'All'}
                >
                  <option value="All">All</option>
                  {filteredTeams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
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

      {/* Click outside to close dropdown */}
      {showEmployeeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmployeeDropdown(false)}
        />
      )}

      {/* Scrollable Content */}
      <div className="px-8 py-6 overflow-y-auto">
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
            title="Active Employees"
            value={overview?.totalEmployees || 0}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Projects by Hours with Clickable Bars */}
<div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
    <Briefcase className="mr-2 text-purple-400" /> Top 10 Projects by Hours
  </h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={projects.slice(0, 10)}
      onClick={handleProjectClick}
      isAnimationActive={false}
      barCategoryGap="10%"
      margin={{ top: 20, right: 10, left: 0, bottom: 100 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis 
        dataKey="name" 
        stroke="#9ca3af" 
        angle={-45} 
        textAnchor="end" 
        height={100} 
        fontSize={11}
        interval={0}
      />
      <YAxis 
        stroke="#9ca3af"
        domain={[0, (dataMax) => Math.ceil(dataMax * 1.25 / 100) * 100]}
        tick={{ fontSize: 12 }}
        allowDecimals={false}
      />
      <Tooltip 
        content={<CustomTooltip />} 
        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} 
        contentStyle={{ backgroundColor: 'rgb(17 24 39)', opacity: 1 }} 
      />
      <Bar 
        dataKey="hours" 
        fill="#8b5cf6" 
        radius={[8, 8, 0, 0]} 
        cursor="pointer" 
        isAnimationActive={false}
      >
        {projects.slice(0, 10).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
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
            <div className="overflow-x-auto overflow-y-hidden" style={{ height: '500px' }}>
              <div style={{ width: `${workModeChartMinWidth}px`, height: 500 }}>
                <ResponsiveContainer width="100%" height="100%" debounce={180}>
                  <BarChart data={workModeByDaysChartData} margin={{ top: 10, right: 20, left: 10, bottom: 80 }} isAnimationActive={false}>
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
                    <Bar dataKey="WFH" stackId="a" fill={WORK_MODE_COLORS['WFH']} name="WFH" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="In Office" stackId="a" fill={WORK_MODE_COLORS['In Office']} name="In Office" isAnimationActive={false} />
                    <Bar dataKey="OT Office" stackId="a" fill={WORK_MODE_COLORS['OT Office']} name="OT Office" isAnimationActive={false} />
                    <Bar dataKey="OT Home" stackId="a" fill={WORK_MODE_COLORS['OT Home']} name="OT Home" isAnimationActive={false} />
                    <Bar dataKey="On Duty" stackId="a" fill={WORK_MODE_COLORS['On Duty']} name="On Duty" isAnimationActive={false} />
                    <Bar dataKey="Night" stackId="a" fill={WORK_MODE_COLORS['Night']} name="Night" isAnimationActive={false} />
                    <Bar dataKey="Half Day" stackId="a" fill={WORK_MODE_COLORS['Half Day']} name="Half Day" isAnimationActive={false} />
                    <Bar dataKey="Leave" stackId="a" fill={WORK_MODE_COLORS['Leave']} name="Leave" isAnimationActive={false} />
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
                <h3 className="text-xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
                  <Activity className="text-amber-400" /> Tasks by hours
                  <span className="text-gray-500 text-xs font-normal">stack = task type</span>
                </h3>
                <p className="text-gray-400 text-xs mb-3">
                  X-axis: total hours · Y-axis: employee names · stacks show task-wise hour split.
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
                            label={{ value: 'Total hours', position: 'insideBottom', fill: '#9ca3af', fontSize: 11 }}
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
                            content={<TasksByHoursTooltip metaRef={tasksByHoursMetaRef} />}
                            wrapperStyle={{ zIndex: 10002 }}
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
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="text-violet-400" /> Employee vs task heatmap
                </h3>
                <p className="text-gray-400 text-xs mb-4">
                  All employees and all task types in the current filters · Shade = logged hours (darker purple = more). Scroll to explore.
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
                              const clr = purpleHeatAlpha(h <= 0 ? 0 : 0.08 + Math.min(1, t) * 0.92);
                              const uh = h > 0 && (cell.units || 0) > 0 ? (cell.units / h).toFixed(2) : '—';
                              return (
                                <td key={`${emp}-${task}`} className="p-1 border-l border-gray-800/70 text-center align-middle">
                                  <div
                                    title={`${emp} · ${task}\nHours: ${h.toFixed(1)} · Units/hr≈ ${uh}`}
                                    className="min-w-[56px] h-9 rounded-md flex items-center justify-center text-[10px] font-semibold tracking-tight"
                                    style={{
                                      backgroundColor: clr,
                                      color: h > workDistributionAgg.hMin + rng * 0.55 ? '#fafafa' : '#1e1b24'
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

          {/* Work Activity Timeline - Smooth Stacked Area Chart by Projects */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-400" /> Project Activity Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeline} isAnimationActive={false}>
                <defs>
                  {timeline.length > 0 && timeline[0].projects && 
                    Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
                      <linearGradient key={projectName} id={`color${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
                      </linearGradient>
                    ))
                  }
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ zIndex: 1000, outline: 'none' }}
                  contentStyle={{ backgroundColor: 'rgb(17 24 39)', opacity: 1 }}
                  allowEscapeViewBox={{ x: false, y: true }}
                  position={{ y: 0 }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                {timeline.length > 0 && timeline[0].projects && 
                  Object.keys(timeline[0].projects).slice(0, 10).map((projectName, idx) => (
                    <Area
                      key={projectName}
                      type="monotone"
                      dataKey={`projects.${projectName}`}
                      stackId="1"
                      stroke={COLORS[idx % COLORS.length]}
                      fill={`url(#color${idx})`}
                      name={projectName}
                      isAnimationActive={false}
                    />
                  ))
                }
              </AreaChart>
            </ResponsiveContainer>
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
                {projectTreemapData.tree?.length ? (
                  <ResponsiveContainer width="100%" height={460}>
                    <Treemap
                      data={projectTreemapData.tree}
                      dataKey="size"
                      nameKey="name"
                      stroke="#0f172a"
                      aspectRatio={4 / 3}
                      isAnimationActive={false}
                      content={<ProjectEffortTreemapContent />}
                    >
                      <Tooltip
                        wrapperStyle={{ zIndex: 10008 }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const node = payload[0]?.payload ?? payload[0];
                          return (
                            <div className="rounded-xl border border-indigo-500/60 bg-gray-900 p-3 text-xs shadow-xl max-w-sm">
                              <p className="text-white font-bold mb-1 break-words">{node?.name ?? '—'}</p>
                              {(node?.detail || node?.subtitle) && (
                                <p className="text-indigo-200 tabular-nums whitespace-pre-wrap">{node.detail || node.subtitle}</p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </Treemap>
                  </ResponsiveContainer>
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

          {/* Team Contributions */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Users className="mr-2 text-cyan-400" /> Team Contributions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Hours" />
                <Bar dataKey="units" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
        </>
        )}

        {dashTab === 'night' && (
          <div className="space-y-8 pb-8">
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-4 text-indigo-100 text-sm max-w-4xl">
              <strong className="text-indigo-200">Night view</strong> includes only rows where <code className="text-indigo-300 bg-gray-900/80 px-1 rounded">work_mode</code> is Night
              (case-insensitive). Hour-of-day uses <code className="text-indigo-300 bg-gray-900/80 px-1 rounded">submitted_at</code> when present, otherwise the work <code className="text-indigo-300 bg-gray-900/80 px-1 rounded">date</code>.
              Day baseline for task ratios uses WFH, In Office, OT Office, OT Home, On Duty, and Half Day.
            </div>
            {nightLoading && (
              <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500" />
              </div>
            )}
            {!nightLoading && nightData?.summary && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={Moon} title="Night hours" value={Math.round(nightData.summary.totalNightHours || 0)} subtitle="Filtered scope" color="from-indigo-600 to-indigo-900" />
                  <StatCard icon={Clock} title="Night entries" value={nightData.summary.totalNightEntries || 0} subtitle="Row count" color="from-slate-600 to-slate-900" />
                  <StatCard icon={Users} title="Night contributors" value={nightData.summary.uniqueNightContributors || 0} subtitle="Distinct names" color="from-violet-600 to-violet-900" />
                  <StatCard icon={Zap} title="Night share" value={`${(nightData.summary.nightPercentOfFilteredHours || 0).toFixed(1)}%`} subtitle="Of all hours in filter" color="from-fuchsia-600 to-purple-900" />
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
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Activity className="w-5 h-5 mr-2 text-emerald-400" /> Night vs day — hours by task (top)</h2>
                    <p className="text-gray-400 text-xs mb-4">Ratio &gt; 1 means more night hours than selected day-modes for that task.</p>
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Clock className="w-5 h-5 mr-2 text-amber-400" /> Submission / log hour (UTC)</h2>
                    <p className="text-gray-400 text-xs mb-4">Bucketed by timestamp used for analytics (see note above).</p>
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

                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-sky-400" /> Night hours over time</h2>
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
          <div className="space-y-8 pb-8">
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