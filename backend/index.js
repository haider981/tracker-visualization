// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.department && req.query.department !== 'All') {
//     where.team = req.query.department;
//   }
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.employee && req.query.employee !== 'All') {
//     where.name = req.query.employee;
//   }
//   if (req.query.project && req.query.project !== 'All') {
//     where.project_name = req.query.project;
//   }
//   if (req.query.task && req.query.task !== 'All') {
//     where.task_name = req.query.task;
//   }
  
//   // Period filter
//   if (req.query.period && req.query.period !== 'All') {
//     const now = new Date();
//     let startDate;
    
//     switch(req.query.period) {
//       case 'Last 7 Days':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'Last 30 Days':
//         startDate = new Date(now.setDate(now.getDate() - 30));
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 3));
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 6));
//         break;
//       case 'This Year':
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//     }
    
//     if (startDate) {
//       where.date = { gte: startDate };
//     }
//   }
  
//   return where;
// }

// // ===== FILTER ENDPOINTS =====

// app.get('/api/dashboard/filters/departments', async (req, res) => {
//   try {
//     const departments = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       // where: { team: { not: null } },
//       orderBy: { team: 'asc' }
//     });
//     res.json(departments.map(d => d.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       // where: { team: { not: null } },
//       orderBy: { team: 'asc' }
//     });
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/employees', async (req, res) => {
//   try {
//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       orderBy: { name: 'asc' }
//     });
//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/projects', async (req, res) => {
//   try {
//     const projects = await prisma.masterDatabase.findMany({
//       distinct: ['project_name'],
//       select: { project_name: true },
//       where: { project_name: { not: null } },
//       orderBy: { project_name: 'asc' }
//     });
//     res.json(projects.map(p => p.project_name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/tasks', async (req, res) => {
//   try {
//     const tasks = await prisma.masterDatabase.findMany({
//       distinct: ['task_name'],
//       select: { task_name: true },
//       where: { task_name: { not: null } },
//       orderBy: { task_name: 'asc' }
//     });
//     res.json(tasks.map(t => t.task_name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== DATA ENDPOINTS WITH FILTERS =====

// // Get dashboard overview stats
// app.get('/api/dashboard/overview', async (req, res) => {
//   try {
//     const totalProjects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _count: true,
//       where: {
//         project_name: { not: null }
//       }
//     });

//     const totalEmployees = await prisma.users.findMany({
//       where: {
//         role: {
//           not: 'ADMIN'
//         }
//       },
//       select: {
//         name: true
//       }
//     });

//     const totalHours = await prisma.masterDatabase.aggregate({
//       _sum: { hours_spent: true },
//     });

//     const totalTasks = await prisma.masterDatabase.count();

//     const teamStats = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { hours_spent: true },
//       _count: true,
//     });

//     res.json({
//       totalProjects: totalProjects.length,
//       totalEmployees: totalEmployees.length,
//       totalHours: totalHours._sum.hours_spent || 0,
//       totalTasks: totalTasks,
//       teams: teamStats,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // Get project distribution
// app.get('/api/dashboard/projects', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, project_name: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(projects.map(p => ({
//       name: p.project_name,
//       hours: p._sum.hours_spent || 0,
//       units: p._sum.number_of_units || 0,
//       tasks: p._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employee performance
// app.get('/api/dashboard/employees', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const employees = await prisma.masterDatabase.groupBy({
//       by: ['name', 'team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 20,
//     });

//     res.json(employees.map(e => ({
//       name: e.name,
//       team: e.team,
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team performance
// app.get('/api/dashboard/teams', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get timeline data (last 30 days)
// app.get('/api/dashboard/timeline', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const timeline = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         date: {
//           gte: thirtyDaysAgo,
//           not: null
//         },
//       },
//       select: {
//         date: true,
//         hours_spent: true,
//         task_name: true,
//         project_name: true,
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Group by date
//     const grouped = timeline.reduce((acc, item) => {
//       if (!item.date) return acc;
//       const dateKey = item.date.toISOString().split('T')[0];
//       if (!acc[dateKey]) {
//         acc[dateKey] = { date: dateKey, hours: 0, tasks: 0 };
//       }
//       acc[dateKey].hours += item.hours_spent || 0;
//       acc[dateKey].tasks += 1;
//       return acc;
//     }, {});

//     res.json(Object.values(grouped));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get work mode distribution
// app.get('/api/dashboard/workmode', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const workModes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, work_mode: { not: null } }
//     });

//     res.json(workModes.map(w => ({
//       mode: w.work_mode || 'Not Specified',
//       hours: w._sum.hours_spent || 0,
//       count: w._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task distribution by element
// app.get('/api/dashboard/elements', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const elements = await prisma.masterDatabase.groupBy({
//       by: ['book_element'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, book_element: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(elements.map(e => ({
//       element: e.book_element || 'Miscellaneous',
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task type distribution
// app.get('/api/dashboard/tasks', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const tasks = await prisma.masterDatabase.groupBy({
//       by: ['task_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, task_name: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(tasks.map(t => ({
//       task: t.task_name,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       count: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get status distribution
// app.get('/api/dashboard/status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, status: { not: null } }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get audit status distribution
// app.get('/api/dashboard/audit-status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const auditStatuses = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, audit_status: { not: null } }
//     });

//     res.json(auditStatuses.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team comparison data
// app.get('/api/dashboard/team-comparison', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teamData = await prisma.masterDatabase.groupBy({
//       by: ['team', 'task_name'],
//       _sum: { hours_spent: true }
//     });

//     // Filter out null values after grouping
//     const filteredData = teamData.filter(d => d.team && d.task_name);

//     // Restructure for stacked bar chart
//     const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
//     const teams = [...new Set(filteredData.map(d => d.team))];

//     const chartData = teams.map(team => {
//       const teamEntry = { team: team };
//       taskTypes.forEach(task => {
//         const found = filteredData.find(d => d.team === team && d.task_name === task);
//         teamEntry[task] = found?._sum.hours_spent || 0;
//       });
//       return teamEntry;
//     });

//     res.json({ data: chartData, tasks: taskTypes });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`API Server running on port ${PORT}`);
// });






// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.employee && req.query.employee !== 'All') {
//     where.name = req.query.employee;
//   }
//   if (req.query.project && req.query.project !== 'All') {
//     where.project_name = req.query.project;
//   }
//   if (req.query.task && req.query.task !== 'All') {
//     where.task_name = req.query.task;
//   }
  
//   // Period filter
//   if (req.query.period && req.query.period !== 'All') {
//     const now = new Date();
//     let startDate;
    
//     switch(req.query.period) {
//       case 'Last 7 Days':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'Last 30 Days':
//         startDate = new Date(now.setDate(now.getDate() - 30));
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 3));
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 6));
//         break;
//       case 'This Year':
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//     }
    
//     if (startDate) {
//       where.date = { gte: startDate };
//     }
//   }
  
//   return where;
// }

// // ===== FILTER ENDPOINTS =====

// // Get all teams from database
// app.get('/api/dashboard/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });
    
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employees based on team
// app.get('/api/dashboard/filters/employees', async (req, res) => {
//   try {
//     const { team, search } = req.query;
    
//     let where = {};
    
//     // Filter by team
//     if (team && team !== 'All') {
//       where.team = team;
//     }
    
//     // Search functionality
//     if (search && search.trim() !== '') {
//       where.name = { contains: search, mode: 'insensitive' };
//     }
    
//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       where: where,
//       orderBy: { name: 'asc' }
//     });
    
//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/projects', async (req, res) => {
//   try {
//     const projects = await prisma.masterDatabase.findMany({
//       distinct: ['project_name'],
//       select: { project_name: true },
//       where: { project_name: { not: null } },
//       orderBy: { project_name: 'asc' }
//     });
//     res.json(projects.map(p => p.project_name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/dashboard/filters/tasks', async (req, res) => {
//   try {
//     const tasks = await prisma.masterDatabase.findMany({
//       distinct: ['task_name'],
//       select: { task_name: true },
//       where: { task_name: { not: null } },
//       orderBy: { task_name: 'asc' }
//     });
//     res.json(tasks.map(t => t.task_name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== DATA ENDPOINTS WITH FILTERS =====

// // Get dashboard overview stats
// app.get('/api/dashboard/overview', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const totalProjects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _count: true,
//       where: {
//         ...where,
//         project_name: { not: null }
//       }
//     });

//     const totalEmployees = await prisma.masterDatabase.groupBy({
//       by: ['name'],
//       _count: true,
//       where: where
//     });

//     const totalHours = await prisma.masterDatabase.aggregate({
//       _sum: { hours_spent: true },
//       where: where
//     });

//     const totalTasks = await prisma.masterDatabase.count({
//       where: where
//     });

//     res.json({
//       totalProjects: totalProjects.length,
//       totalEmployees: totalEmployees.length,
//       totalHours: totalHours._sum.hours_spent || 0,
//       totalTasks: totalTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // Get project distribution
// app.get('/api/dashboard/projects', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, project_name: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(projects.map(p => ({
//       name: p.project_name,
//       hours: p._sum.hours_spent || 0,
//       units: p._sum.number_of_units || 0,
//       tasks: p._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employee performance
// app.get('/api/dashboard/employees', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const employees = await prisma.masterDatabase.groupBy({
//       by: ['name', 'team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 20,
//     });

//     res.json(employees.map(e => ({
//       name: e.name,
//       team: e.team,
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team performance
// app.get('/api/dashboard/teams', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get timeline data (last 30 days)
// app.get('/api/dashboard/timeline', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const timeline = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         date: {
//           gte: thirtyDaysAgo,
//           not: null
//         },
//       },
//       select: {
//         date: true,
//         hours_spent: true,
//         task_name: true,
//         project_name: true,
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Group by date
//     const grouped = timeline.reduce((acc, item) => {
//       if (!item.date) return acc;
//       const dateKey = item.date.toISOString().split('T')[0];
//       if (!acc[dateKey]) {
//         acc[dateKey] = { date: dateKey, hours: 0, tasks: 0 };
//       }
//       acc[dateKey].hours += item.hours_spent || 0;
//       acc[dateKey].tasks += 1;
//       return acc;
//     }, {});

//     res.json(Object.values(grouped));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get work mode distribution
// app.get('/api/dashboard/workmode', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const workModes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, work_mode: { not: null } }
//     });

//     res.json(workModes.map(w => ({
//       mode: w.work_mode || 'Not Specified',
//       hours: w._sum.hours_spent || 0,
//       count: w._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task distribution by element
// app.get('/api/dashboard/elements', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const elements = await prisma.masterDatabase.groupBy({
//       by: ['book_element'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, book_element: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(elements.map(e => ({
//       element: e.book_element || 'Miscellaneous',
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task type distribution
// app.get('/api/dashboard/tasks', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const tasks = await prisma.masterDatabase.groupBy({
//       by: ['task_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { ...where, task_name: { not: null } },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(tasks.map(t => ({
//       task: t.task_name,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       count: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get status distribution
// app.get('/api/dashboard/status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, status: { not: null } }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get audit status distribution
// app.get('/api/dashboard/audit-status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const auditStatuses = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { ...where, audit_status: { not: null } }
//     });

//     res.json(auditStatuses.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team comparison data
// app.get('/api/dashboard/team-comparison', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teamData = await prisma.masterDatabase.groupBy({
//       by: ['team', 'task_name'],
//       _sum: { hours_spent: true },
//       where: where
//     });

//     // Filter out null values after grouping
//     const filteredData = teamData.filter(d => d.team && d.task_name);

//     // Restructure for stacked bar chart
//     const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
//     const teams = [...new Set(filteredData.map(d => d.team))];

//     const chartData = teams.map(team => {
//       const teamEntry = { team: team };
//       taskTypes.forEach(task => {
//         const found = filteredData.find(d => d.team === team && d.task_name === task);
//         teamEntry[task] = found?._sum.hours_spent || 0;
//       });
//       return teamEntry;
//     });

//     res.json({ data: chartData, tasks: taskTypes });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`API Server running on port ${PORT}`);
// });




// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.employee && req.query.employee !== 'All') {
//     where.name = req.query.employee;
//   }
  
//   // Period filter
//   if (req.query.period && req.query.period !== 'All') {
//     const now = new Date();
//     let startDate;
    
//     switch(req.query.period) {
//       case 'Last 7 Days':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'Last 30 Days':
//         startDate = new Date(now.setDate(now.getDate() - 30));
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 3));
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 6));
//         break;
//       case 'This Year':
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//     }
    
//     if (startDate) {
//       where.date = { gte: startDate };
//     }
//   }
  
//   return where;
// }

// // ===== FILTER ENDPOINTS =====

// // Get all teams from database
// app.get('/api/dashboard/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });
    
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employees based on team
// app.get('/api/dashboard/filters/employees', async (req, res) => {
//   try {
//     const { team, search } = req.query;
    
//     let where = {};
    
//     // Filter by team
//     if (team && team !== 'All') {
//       where.team = team;
//     }
    
//     // Search functionality
//     if (search && search.trim() !== '') {
//       where.name = { contains: search, mode: 'insensitive' };
//     }
    
//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       where: where,
//       orderBy: { name: 'asc' }
//     });
    
//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== DATA ENDPOINTS WITH FILTERS =====

// // Get dashboard overview stats
// app.get('/api/dashboard/overview', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const totalProjects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _count: true,
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     const totalEmployees = await prisma.masterDatabase.groupBy({
//       by: ['name'],
//       _count: true,
//       where: where
//     });

//     const totalHours = await prisma.masterDatabase.aggregate({
//       _sum: { hours_spent: true },
//       where: where
//     });

//     const totalTasks = await prisma.masterDatabase.count({
//       where: where
//     });

//     res.json({
//       totalProjects: totalProjects.length,
//       totalEmployees: totalEmployees.length,
//       totalHours: totalHours._sum.hours_spent || 0,
//       totalTasks: totalTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // Get project distribution with book elements
// app.get('/api/dashboard/projects', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // Get projects with their total hours (excluding blanks)
//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 10,
//     });

//     // Get all book elements for the top 10 projects in a single query
//     const projectNames = projects.map(p => p.project_name);
    
//     const allElements = await prisma.masterDatabase.groupBy({
//       by: ['project_name', 'book_element'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         project_name: { in: projectNames },
//         book_element: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     // Map elements to their respective projects
//     const projectsWithElements = projects.map(p => {
//       const elements = allElements
//         .filter(e => e.project_name === p.project_name)
//         .map(e => ({
//           element: e.book_element,
//           hours: e._sum.hours_spent || 0,
//         }));

//       return {
//         name: p.project_name,
//         hours: p._sum.hours_spent || 0,
//         units: p._sum.number_of_units || 0,
//         tasks: p._count,
//         elements: elements,
//       };
//     });

//     res.json(projectsWithElements);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employee performance
// app.get('/api/dashboard/employees', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const employees = await prisma.masterDatabase.groupBy({
//       by: ['name', 'team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 20,
//     });

//     res.json(employees.map(e => ({
//       name: e.name,
//       team: e.team,
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team performance
// app.get('/api/dashboard/teams', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get timeline data - Project-based timeline
// app.get('/api/dashboard/timeline', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const projectData = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] // Exclude blanks
//         }
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     const timeline = projectData.map(p => ({
//       project: p.project_name,
//       hours: p._sum.hours_spent || 0,
//       tasks: p._count,
//     }));

//     res.json(timeline);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get work mode distribution
// app.get('/api/dashboard/workmode', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const workModes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         work_mode: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(workModes.map(w => ({
//       mode: w.work_mode || 'Not Specified',
//       hours: w._sum.hours_spent || 0,
//       count: w._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // NEW ENDPOINT: Get work mode by days (employee-wise stacked bar chart)
// app.get('/api/dashboard/workmode-by-days', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // Get all records with employee and work mode
//     const records = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         work_mode: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       },
//       select: {
//         name: true,
//         work_mode: true,
//         hours_spent: true,
//       }
//     });

//     // Group by employee and work mode
//     const employeeWorkMode = {};
    
//     records.forEach(record => {
//       if (!employeeWorkMode[record.name]) {
//         employeeWorkMode[record.name] = {
//           name: record.name,
//           'WFH': 0,
//           'OT Office': 0,
//           'OT Home': 0,
//           'On Duty': 0,
//           'Night': 0,
//         };
//       }
      
//       const mode = record.work_mode;
//       if (employeeWorkMode[record.name][mode] !== undefined) {
//         employeeWorkMode[record.name][mode] += record.hours_spent || 0;
//       }
//     });

//     // Convert to array and sort by total hours
//     const result = Object.values(employeeWorkMode).map(emp => {
//       const totalHours = emp['WFH'] + emp['OT Office'] + emp['OT Home'] + emp['On Duty'] + emp['Night'];
//       return { ...emp, totalHours };
//     }).sort((a, b) => b.totalHours - a.totalHours);

//     res.json(result.map(({ totalHours, ...rest }) => rest));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task distribution by element
// app.get('/api/dashboard/elements', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const elements = await prisma.masterDatabase.groupBy({
//       by: ['book_element'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         book_element: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(elements.map(e => ({
//       element: e.book_element || 'Miscellaneous',
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task type distribution
// app.get('/api/dashboard/tasks', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const tasks = await prisma.masterDatabase.groupBy({
//       by: ['task_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         task_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(tasks.map(t => ({
//       task: t.task_name,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       count: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get status distribution
// app.get('/api/dashboard/status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get audit status distribution
// app.get('/api/dashboard/audit-status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const auditStatuses = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         audit_status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(auditStatuses.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team comparison data
// app.get('/api/dashboard/team-comparison', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teamData = await prisma.masterDatabase.groupBy({
//       by: ['team', 'task_name'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         task_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     // Filter out null values after grouping
//     const filteredData = teamData.filter(d => d.team && d.task_name);

//     // Restructure for stacked bar chart
//     const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
//     const teams = [...new Set(filteredData.map(d => d.team))];

//     const chartData = teams.map(team => {
//       const teamEntry = { team: team };
//       taskTypes.forEach(task => {
//         const found = filteredData.find(d => d.team === team && d.task_name === task);
//         teamEntry[task] = found?._sum.hours_spent || 0;
//       });
//       return teamEntry;
//     });

//     res.json({ data: chartData, tasks: taskTypes });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`API Server running on port ${PORT}`);
// });


// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.employee && req.query.employee !== 'All') {
//     where.name = req.query.employee;
//   }
  
//   // Period filter
//   if (req.query.period && req.query.period !== 'All') {
//     const now = new Date();
//     let startDate;
    
//     switch(req.query.period) {
//       case 'Last 7 Days':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'Last 30 Days':
//         startDate = new Date(now.setDate(now.getDate() - 30));
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 3));
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 6));
//         break;
//       case 'Last Year':
//         startDate = new Date(now.setMonth(now.getMonth() - 12));
//         break;
//       case 'This Year':
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//     }
    
//     if (startDate) {
//       where.date = { gte: startDate };
//     }
//   }
  
//   return where;
// }

// // ===== FILTER ENDPOINTS =====

// // Get all teams from database
// app.get('/api/dashboard/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });
    
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employees based on team
// app.get('/api/dashboard/filters/employees', async (req, res) => {
//   try {
//     const { team, search } = req.query;
    
//     let where = {};
    
//     // Filter by team
//     if (team && team !== 'All') {
//       where.team = team;
//     }
    
//     // Search functionality
//     if (search && search.trim() !== '') {
//       where.name = { contains: search, mode: 'insensitive' };
//     }
    
//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       where: where,
//       orderBy: { name: 'asc' }
//     });
    
//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== DATA ENDPOINTS WITH FILTERS =====

// // Get dashboard overview stats
// app.get('/api/dashboard/overview', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const totalProjects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _count: true,
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     const totalEmployees = await prisma.masterDatabase.groupBy({
//       by: ['name'],
//       _count: true,
//       where: where
//     });

//     const totalHours = await prisma.masterDatabase.aggregate({
//       _sum: { hours_spent: true },
//       where: where
//     });

//     const totalTasks = await prisma.masterDatabase.count({
//       where: where
//     });

//     res.json({
//       totalProjects: totalProjects.length,
//       totalEmployees: totalEmployees.length,
//       totalHours: totalHours._sum.hours_spent || 0,
//       totalTasks: totalTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // Get project distribution with book elements
// app.get('/api/dashboard/projects', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // Get projects with their total hours (excluding blanks)
//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 10,
//     });

//     // Get all book elements for the top 10 projects in a single query
//     const projectNames = projects.map(p => p.project_name);
    
//     const allElements = await prisma.masterDatabase.groupBy({
//       by: ['project_name', 'book_element'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         project_name: { in: projectNames },
//         book_element: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     // Map elements to their respective projects
//     const projectsWithElements = projects.map(p => {
//       const elements = allElements
//         .filter(e => e.project_name === p.project_name)
//         .map(e => ({
//           element: e.book_element,
//           hours: e._sum.hours_spent || 0,
//         }));

//       return {
//         name: p.project_name,
//         hours: p._sum.hours_spent || 0,
//         units: p._sum.number_of_units || 0,
//         tasks: p._count,
//         elements: elements,
//       };
//     });

//     res.json(projectsWithElements);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employee performance
// app.get('/api/dashboard/employees', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const employees = await prisma.masterDatabase.groupBy({
//       by: ['name', 'team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 20,
//     });

//     res.json(employees.map(e => ({
//       name: e.name,
//       team: e.team,
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team performance
// app.get('/api/dashboard/teams', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get timeline data - Stacked area chart by date and projects
// app.get('/api/dashboard/timeline', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     // Get date range based on period filter
//     let dateFilter = {};
//     if (req.query.period && req.query.period !== 'All') {
//       const now = new Date();
//       let startDate;
      
//       switch(req.query.period) {
//         case 'Last 7 Days':
//           startDate = new Date(now.setDate(now.getDate() - 7));
//           break;
//         case 'Last 30 Days':
//           startDate = new Date(now.setDate(now.getDate() - 30));
//           break;
//         case 'Last 3 Months':
//           startDate = new Date(now.setMonth(now.getMonth() - 3));
//           break;
//         case 'Last 6 Months':
//           startDate = new Date(now.setMonth(now.getMonth() - 6));
//           break;
//         case 'Last Year':
//           startDate = new Date(now.setMonth(now.getMonth() - 12));
//           break;
//         case 'This Year':
//           startDate = new Date(now.getFullYear(), 0, 1);
//           break;
//       }
      
//       if (startDate) {
//         dateFilter = { gte: startDate };
//       }
//     } else {
//       // Default to last 30 days if no period specified
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       dateFilter = { gte: thirtyDaysAgo };
//     }

//     const timelineData = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK']
//         },
//         date: {
//           ...dateFilter,
//           not: null
//         }
//       },
//       select: {
//         date: true,
//         project_name: true,
//         hours_spent: true,
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Get top 10 projects by total hours
//     const projectTotals = {};
//     timelineData.forEach(item => {
//       if (!projectTotals[item.project_name]) {
//         projectTotals[item.project_name] = 0;
//       }
//       projectTotals[item.project_name] += item.hours_spent || 0;
//     });

//     const topProjects = Object.entries(projectTotals)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 10)
//       .map(([name]) => name);

//     // Group by date and project
//     const groupedByDate = {};
    
//     timelineData.forEach(item => {
//       if (!item.date || !topProjects.includes(item.project_name)) return;
      
//       const dateKey = item.date.toISOString().split('T')[0];
      
//       if (!groupedByDate[dateKey]) {
//         groupedByDate[dateKey] = {
//           date: dateKey,
//           projects: {}
//         };
        
//         // Initialize all projects with 0
//         topProjects.forEach(project => {
//           groupedByDate[dateKey].projects[project] = 0;
//         });
//       }
      
//       groupedByDate[dateKey].projects[item.project_name] += item.hours_spent || 0;
//     });

//     // Convert to array and sort by date
//     const timeline = Object.values(groupedByDate).sort((a, b) => 
//       new Date(a.date) - new Date(b.date)
//     );

//     res.json(timeline);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get work mode distribution
// app.get('/api/dashboard/workmode', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const workModes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         work_mode: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(workModes.map(w => ({
//       mode: w.work_mode || 'Not Specified',
//       hours: w._sum.hours_spent || 0,
//       count: w._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // NEW ENDPOINT: Get work mode by days (employee-wise stacked bar chart)
// app.get('/api/dashboard/workmode-by-days', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // Get all records with employee and work mode
//     const records = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         work_mode: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       },
//       select: {
//         name: true,
//         work_mode: true,
//         hours_spent: true,
//       }
//     });

//     // Group by employee and work mode
//     const employeeWorkMode = {};
    
//     records.forEach(record => {
//       if (!employeeWorkMode[record.name]) {
//         employeeWorkMode[record.name] = {
//           name: record.name,
//           'WFH': 0,
//           'OT Office': 0,
//           'OT Home': 0,
//           'On Duty': 0,
//           'Night': 0,
//         };
//       }
      
//       const mode = record.work_mode;
//       if (employeeWorkMode[record.name][mode] !== undefined) {
//         employeeWorkMode[record.name][mode] += record.hours_spent || 0;
//       }
//     });

//     // Convert to array and sort by total hours
//     const result = Object.values(employeeWorkMode).map(emp => {
//       const totalHours = emp['WFH'] + emp['OT Office'] + emp['OT Home'] + emp['On Duty'] + emp['Night'];
//       return { ...emp, totalHours };
//     }).sort((a, b) => b.totalHours - a.totalHours);

//     res.json(result.map(({ totalHours, ...rest }) => rest));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task distribution by element
// app.get('/api/dashboard/elements', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const elements = await prisma.masterDatabase.groupBy({
//       by: ['book_element'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         book_element: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(elements.map(e => ({
//       element: e.book_element || 'Miscellaneous',
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task type distribution
// app.get('/api/dashboard/tasks', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const tasks = await prisma.masterDatabase.groupBy({
//       by: ['task_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         task_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 15,
//     });

//     res.json(tasks.map(t => ({
//       task: t.task_name,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       count: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get status distribution
// app.get('/api/dashboard/status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get audit status distribution
// app.get('/api/dashboard/audit-status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const auditStatuses = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         audit_status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(auditStatuses.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team comparison data
// app.get('/api/dashboard/team-comparison', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teamData = await prisma.masterDatabase.groupBy({
//       by: ['team', 'task_name'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         task_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     // Filter out null values after grouping
//     const filteredData = teamData.filter(d => d.team && d.task_name);

//     // Restructure for stacked bar chart
//     const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
//     const teams = [...new Set(filteredData.map(d => d.team))];

//     const chartData = teams.map(team => {
//       const teamEntry = { team: team };
//       taskTypes.forEach(task => {
//         const found = filteredData.find(d => d.team === team && d.task_name === task);
//         teamEntry[task] = found?._sum.hours_spent || 0;
//       });
//       return teamEntry;
//     });

//     res.json({ data: chartData, tasks: taskTypes });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`API Server running on port ${PORT}`);
// });




// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.employee && req.query.employee !== 'All') {
//     where.name = req.query.employee;
//   }
  
//   // Period filter
//   if (req.query.period && req.query.period !== 'All') {
//     const now = new Date();
//     let startDate;
    
//     switch(req.query.period) {
//       case 'Last 7 Days':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         break;
//       case 'Last 30 Days':
//         startDate = new Date(now.setDate(now.getDate() - 30));
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 3));
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.setMonth(now.getMonth() - 6));
//         break;
//       case 'Last Year':
//         startDate = new Date(now.setMonth(now.getMonth() - 12));
//         break;
//       case 'This Year':
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//     }
    
//     if (startDate) {
//       where.date = { gte: startDate };
//     }
//   }
  
//   return where;
// }

// // ===== FILTER ENDPOINTS =====

// // Get all teams from database
// app.get('/api/dashboard/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });
    
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employees based on team
// app.get('/api/dashboard/filters/employees', async (req, res) => {
//   try {
//     const { team, search } = req.query;
    
//     let where = {};
    
//     // Filter by team
//     if (team && team !== 'All') {
//       where.team = team;
//     }
    
//     // Search functionality
//     if (search && search.trim() !== '') {
//       where.name = { contains: search, mode: 'insensitive' };
//     }
    
//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       where: where,
//       orderBy: { name: 'asc' }
//     });
    
//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== DATA ENDPOINTS WITH FILTERS =====

// // Get dashboard overview stats
// app.get('/api/dashboard/overview', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const totalProjects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _count: true,
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     const totalEmployees = await prisma.masterDatabase.groupBy({
//       by: ['name'],
//       _count: true,
//       where: where
//     });

//     const totalHours = await prisma.masterDatabase.aggregate({
//       _sum: { hours_spent: true },
//       where: where
//     });

//     const totalTasks = await prisma.masterDatabase.count({
//       where: where
//     });

//     res.json({
//       totalProjects: totalProjects.length,
//       totalEmployees: totalEmployees.length,
//       totalHours: totalHours._sum.hours_spent || 0,
//       totalTasks: totalTasks,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // Get project distribution with book elements
// app.get('/api/dashboard/projects', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // Get projects with their total hours (excluding blanks)
//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: { 
//         ...where, 
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] // Exclude blanks
//         } 
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 10,
//     });

//     // Get all book elements for the top 10 projects in a single query
//     const projectNames = projects.map(p => p.project_name);
    
//     const allElements = await prisma.masterDatabase.groupBy({
//       by: ['project_name', 'book_element'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         project_name: { in: projectNames },
//         book_element: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       },
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     // Map elements to their respective projects
//     const projectsWithElements = projects.map(p => {
//       const elements = allElements
//         .filter(e => e.project_name === p.project_name)
//         .map(e => ({
//           element: e.book_element,
//           hours: e._sum.hours_spent || 0,
//         }));

//       return {
//         name: p.project_name,
//         hours: p._sum.hours_spent || 0,
//         units: p._sum.number_of_units || 0,
//         tasks: p._count,
//         elements: elements,
//       };
//     });

//     res.json(projectsWithElements);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get employee performance
// app.get('/api/dashboard/employees', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const employees = await prisma.masterDatabase.groupBy({
//       by: ['name', 'team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//       take: 20,
//     });

//     res.json(employees.map(e => ({
//       name: e.name,
//       team: e.team,
//       hours: e._sum.hours_spent || 0,
//       units: e._sum.number_of_units || 0,
//       tasks: e._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team performance
// app.get('/api/dashboard/teams', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { 
//         hours_spent: true,
//         number_of_units: true 
//       },
//       _count: true,
//       where: where,
//       orderBy: {
//         _sum: {
//           hours_spent: 'desc',
//         },
//       },
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get timeline data - Stacked area chart by date and projects
// app.get('/api/dashboard/timeline', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     // Get date range based on period filter
//     let dateFilter = {};
//     if (req.query.period && req.query.period !== 'All') {
//       const now = new Date();
//       let startDate;
      
//       switch(req.query.period) {
//         case 'Last 7 Days':
//           startDate = new Date(now.setDate(now.getDate() - 7));
//           break;
//         case 'Last 30 Days':
//           startDate = new Date(now.setDate(now.getDate() - 30));
//           break;
//         case 'Last 3 Months':
//           startDate = new Date(now.setMonth(now.getMonth() - 3));
//           break;
//         case 'Last 6 Months':
//           startDate = new Date(now.setMonth(now.getMonth() - 6));
//           break;
//         case 'Last Year':
//           startDate = new Date(now.setMonth(now.getMonth() - 12));
//           break;
//         case 'This Year':
//           startDate = new Date(now.getFullYear(), 0, 1);
//           break;
//       }
      
//       if (startDate) {
//         dateFilter = { gte: startDate };
//       }
//     } else {
//       // Default to last 30 days if no period specified
//       const thirtyDaysAgo = new Date();
//       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//       dateFilter = { gte: thirtyDaysAgo };
//     }

//     const timelineData = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         project_name: { 
//           not: null,
//           notIn: ['', ' ', 'blank', 'Blank', 'BLANK']
//         },
//         date: {
//           ...dateFilter,
//           not: null
//         }
//       },
//       select: {
//         date: true,
//         project_name: true,
//         hours_spent: true,
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Get top 10 projects by total hours
//     const projectTotals = {};
//     timelineData.forEach(item => {
//       if (!projectTotals[item.project_name]) {
//         projectTotals[item.project_name] = 0;
//       }
//       projectTotals[item.project_name] += item.hours_spent || 0;
//     });

//     const topProjects = Object.entries(projectTotals)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 10)
//       .map(([name]) => name);

//     // Group by date and project
//     const groupedByDate = {};
    
//     timelineData.forEach(item => {
//       if (!item.date || !topProjects.includes(item.project_name)) return;
      
//       const dateKey = item.date.toISOString().split('T')[0];
      
//       if (!groupedByDate[dateKey]) {
//         groupedByDate[dateKey] = {
//           date: dateKey,
//           projects: {}
//         };
        
//         // Initialize all projects with 0
//         topProjects.forEach(project => {
//           groupedByDate[dateKey].projects[project] = 0;
//         });
//       }
      
//       groupedByDate[dateKey].projects[item.project_name] += item.hours_spent || 0;
//     });

//     // Convert to array and sort by date
//     const timeline = Object.values(groupedByDate).sort((a, b) => 
//       new Date(a.date) - new Date(b.date)
//     );

//     res.json(timeline);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get work mode distribution
// app.get('/api/dashboard/workmode', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const workModes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         work_mode: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(workModes.map(w => ({
//       mode: w.work_mode || 'Not Specified',
//       hours: w._sum.hours_spent || 0,
//       count: w._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Work mode by DAYS (distinct dates per employee per mode) + top 5 projects per mode
// app.get('/api/dashboard/workmode-by-days', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const ALL_WORK_MODES = [
//       'WFH',
//       'In Office',
//       'OT Office',
//       'OT Home',
//       'On Duty',
//       'Night',
//       'Half Day',
//       'Leave'
//     ];

//     const whereWithMode = {
//       ...where,
//       work_mode: { not: null, notIn: ['', ' '] },
//       date: where.date || undefined
//     };

//     // 1) Get records for distinct-day count and project aggregation
//     const records = await prisma.masterDatabase.findMany({
//       where: whereWithMode,
//       select: { name: true, work_mode: true, date: true, project_name: true, hours_spent: true }
//     });

//     const makeKey = (name, work_mode) => JSON.stringify([name, work_mode]);

//     // 2) Distinct days per (name, work_mode) - normalize date to date-only string
//     const daysByKey = {};
//     records.forEach(r => {
//       if (!r.date) return;
//       const key = makeKey(r.name, r.work_mode);
//       if (!daysByKey[key]) daysByKey[key] = new Set();
//       const dateStr = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
//       daysByKey[key].add(dateStr);
//     });

//     // 3) Hours per (name, work_mode, project_name) for top 5 projects
//     const projectHoursByKey = {};
//     records.forEach(r => {
//       if (!r.work_mode) return;
//       const proj = r.project_name && r.project_name.trim() ? r.project_name.trim() : 'Unspecified';
//       const key = makeKey(r.name, r.work_mode);
//       if (!projectHoursByKey[key]) projectHoursByKey[key] = {};
//       projectHoursByKey[key][proj] = (projectHoursByKey[key][proj] || 0) + (r.hours_spent || 0);
//     });

//     // 4) Build employee list and workModeProjects (top 5 per mode)
//     const employeeMap = {};
//     Object.keys(daysByKey).forEach(key => {
//       const [name, mode] = JSON.parse(key);
//       if (!employeeMap[name]) {
//         employeeMap[name] = { name, workModeProjects: {} };
//         ALL_WORK_MODES.forEach(m => {
//           employeeMap[name][m] = 0;
//           employeeMap[name].workModeProjects[m] = [];
//         });
//       }
//       const days = daysByKey[key].size;
//       if (ALL_WORK_MODES.includes(mode)) employeeMap[name][mode] = days;
//       const projMap = projectHoursByKey[key] || {};
//       const sorted = Object.entries(projMap)
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 5)
//         .map(([project_name, hours]) => ({ project_name, hours }));
//       employeeMap[name].workModeProjects[mode] = sorted;
//     });

//     // Ensure every employee has all work modes and workModeProjects entries
//     Object.keys(employeeMap).forEach(name => {
//       ALL_WORK_MODES.forEach(mode => {
//         if (employeeMap[name][mode] === undefined) employeeMap[name][mode] = 0;
//         if (!employeeMap[name].workModeProjects[mode]) employeeMap[name].workModeProjects[mode] = [];
//       });
//     });

//     const result = Object.values(employeeMap)
//       .map(emp => {
//         const { workModeProjects, ...rest } = emp;
//         const totalDays = ALL_WORK_MODES.reduce((s, m) => s + (rest[m] || 0), 0);
//         return { ...rest, workModeProjects, totalDays };
//       })
//       .filter(emp => emp.totalDays > 0)
//       .sort((a, b) => b.totalDays - a.totalDays);

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get task distribution by element, including per-task breakdown for rich tooltips
// app.get('/api/dashboard/elements', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     // Group by element + task to get per-task hours per element
//     const rows = await prisma.masterDatabase.groupBy({
//       by: ['book_element', 'task_name'],
//       _sum: {
//         hours_spent: true,
//         number_of_units: true
//       },
//       where: {
//         ...where,
//         book_element: {
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     // Build element-level aggregates with task-type breakdown
//     const elementMap = {};

//     rows.forEach(r => {
//       const elementName = r.book_element || 'Miscellaneous';
//       const taskName = r.task_name || 'Unspecified';
//       const hours = r._sum.hours_spent || 0;
//       const units = r._sum.number_of_units || 0;

//       if (!elementMap[elementName]) {
//         elementMap[elementName] = {
//           element: elementName,
//           hours: 0,
//           units: 0,
//           tasks: 0,
//           taskBreakdown: []
//         };
//       }

//       elementMap[elementName].hours += hours;
//       elementMap[elementName].units += units;

//       elementMap[elementName].taskBreakdown.push({
//         task: taskName,
//         hours,
//         units
//       });
//     });

//     const elements = Object.values(elementMap)
//       .map(e => ({
//         ...e,
//         tasks: e.taskBreakdown.length,
//         taskBreakdown: e.taskBreakdown
//           .sort((a, b) => (b.hours || 0) - (a.hours || 0))
//       }))
//       .sort((a, b) => (b.hours || 0) - (a.hours || 0))
//       .slice(0, 15);

//     res.json(elements);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // OPTIMIZED: Get task type distribution with TOP 5 book elements per task
// app.get('/api/dashboard/tasks', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     // OPTIMIZED: Single groupBy query
//     const taskElementData = await prisma.masterDatabase.groupBy({
//       by: ['task_name', 'book_element'],
//       _sum: {
//         hours_spent: true,
//         number_of_units: true
//       },
//       where: { 
//         ...where, 
//         task_name: { 
//           not: null,
//           notIn: ['', ' ']
//         }
//       }
//     });

//     // Group by task and calculate totals
//     const taskGroups = {};
    
//     taskElementData.forEach(record => {
//       const taskName = record.task_name;
      
//       if (!taskGroups[taskName]) {
//         taskGroups[taskName] = {
//           task: taskName,
//           hours: 0,
//           units: 0,
//           count: 0,
//           elementBreakdown: []
//         };
//       }
      
//       taskGroups[taskName].hours += record._sum.hours_spent || 0;
//       taskGroups[taskName].units += record._sum.number_of_units || 0;
//       taskGroups[taskName].count += 1;
      
//       // Track book element breakdown
//       if (record.book_element && record.book_element.trim() !== '') {
//         taskGroups[taskName].elementBreakdown.push({
//           element: record.book_element,
//           hours: record._sum.hours_spent || 0
//         });
//       }
//     });

//     // Convert to array and process
//     let tasks = Object.values(taskGroups)
//       .map(task => ({
//         task: task.task,
//         hours: task.hours,
//         units: task.units,
//         count: task.count,
//         // LIMIT TO TOP 5 ELEMENTS per task, sorted by hours descending
//         elements: task.elementBreakdown
//           .sort((a, b) => b.hours - a.hours)
//           .slice(0, 5) // Only top 5
//       }))
//       .sort((a, b) => b.hours - a.hours)
//       .slice(0, 15);

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get status distribution
// app.get('/api/dashboard/status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get audit status distribution
// app.get('/api/dashboard/audit-status', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const auditStatuses = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: { 
//         ...where, 
//         audit_status: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         } 
//       }
//     });

//     res.json(auditStatuses.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count,
//     })));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get team comparison data
// app.get('/api/dashboard/team-comparison', async (req, res) => {
//   try {
//     const where = buildWhereClause(req);
    
//     const teamData = await prisma.masterDatabase.groupBy({
//       by: ['team', 'task_name'],
//       _sum: { hours_spent: true },
//       where: {
//         ...where,
//         task_name: { 
//           not: null,
//           notIn: ['', ' '] // Exclude blanks
//         }
//       }
//     });

//     // Filter out null values after grouping
//     const filteredData = teamData.filter(d => d.team && d.task_name);

//     // Restructure for stacked bar chart
//     const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
//     const teams = [...new Set(filteredData.map(d => d.team))];

//     const chartData = teams.map(team => {
//       const teamEntry = { team: team };
//       taskTypes.forEach(task => {
//         const found = filteredData.find(d => d.team === team && d.task_name === task);
//         teamEntry[task] = found?._sum.hours_spent || 0;
//       });
//       return teamEntry;
//     });

//     res.json({ data: chartData, tasks: taskTypes });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`API Server running on port ${PORT}`);
// });




const express = require('express');
const cors = require('cors');
const prisma = require('./src/config/prisma'); 

const app = express();

app.use(cors());
app.use(express.json());

// Helper function to build where clause from query params
function buildWhereClause(req) {
  const where = {};
  
  if (req.query.team && req.query.team !== 'All') {
    where.team = req.query.team;
  }
  if (req.query.employee && req.query.employee !== 'All') {
    where.name = req.query.employee;
  }
  
  // Period filter
  if (req.query.period && req.query.period !== 'All') {
    const now = new Date();
    let startDate;
    
    switch(req.query.period) {
      case 'Last 7 Days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'Last 30 Days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'Last 3 Months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'Last 6 Months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'Last Year':
        startDate = new Date(now.setMonth(now.getMonth() - 12));
        break;
      case 'This Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    if (startDate) {
      where.date = { gte: startDate };
    }
  }
  
  return where;
}

// ===== FILTER ENDPOINTS =====

// Get all teams from database
app.get('/api/dashboard/filters/teams', async (req, res) => {
  try {
    const teams = await prisma.masterDatabase.findMany({
      distinct: ['team'],
      select: { team: true },
      orderBy: { team: 'asc' }
    });
    
    res.json(teams.map(t => t.team).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employees based on team
app.get('/api/dashboard/filters/employees', async (req, res) => {
  try {
    const { team, search } = req.query;
    
    let where = {};
    
    // Filter by team
    if (team && team !== 'All') {
      where.team = team;
    }
    
    // Search functionality
    if (search && search.trim() !== '') {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    const employees = await prisma.masterDatabase.findMany({
      distinct: ['name'],
      select: { name: true },
      where: where,
      orderBy: { name: 'asc' }
    });
    
    res.json(employees.map(e => e.name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DATA ENDPOINTS WITH FILTERS =====

// Get dashboard overview stats
app.get('/api/dashboard/overview', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const totalProjects = await prisma.masterDatabase.groupBy({
      by: ['project_name'],
      _count: true,
      where: {
        ...where,
        project_name: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        }
      }
    });

    const totalEmployees = await prisma.masterDatabase.groupBy({
      by: ['name'],
      _count: true,
      where: where
    });

    const totalHours = await prisma.masterDatabase.aggregate({
      _sum: { hours_spent: true },
      where: where
    });

    const totalTasks = await prisma.masterDatabase.count({
      where: where
    });

    res.json({
      totalProjects: totalProjects.length,
      totalEmployees: totalEmployees.length,
      totalHours: totalHours._sum.hours_spent || 0,
      totalTasks: totalTasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get project distribution with book elements
app.get('/api/dashboard/projects', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    // Get projects with their total hours (excluding blanks)
    const projects = await prisma.masterDatabase.groupBy({
      by: ['project_name'],
      _sum: { 
        hours_spent: true,
        number_of_units: true 
      },
      _count: true,
      where: { 
        ...where, 
        project_name: { 
          not: null,
          notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] // Exclude blanks
        } 
      },
      orderBy: {
        _sum: {
          hours_spent: 'desc',
        },
      },
      take: 10,
    });

    // Get all book elements for the top 10 projects in a single query
    const projectNames = projects.map(p => p.project_name);
    
    const allElements = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'book_element'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        project_name: { in: projectNames },
        book_element: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        }
      },
      orderBy: {
        _sum: {
          hours_spent: 'desc',
        },
      },
    });

    // Map elements to their respective projects
    const projectsWithElements = projects.map(p => {
      const elements = allElements
        .filter(e => e.project_name === p.project_name)
        .map(e => ({
          element: e.book_element,
          hours: e._sum.hours_spent || 0,
        }));

      return {
        name: p.project_name,
        hours: p._sum.hours_spent || 0,
        units: p._sum.number_of_units || 0,
        tasks: p._count,
        elements: elements,
      };
    });

    res.json(projectsWithElements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee performance
app.get('/api/dashboard/employees', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const employees = await prisma.masterDatabase.groupBy({
      by: ['name', 'team'],
      _sum: { 
        hours_spent: true,
        number_of_units: true 
      },
      _count: true,
      where: where,
      orderBy: {
        _sum: {
          hours_spent: 'desc',
        },
      },
      take: 20,
    });

    res.json(employees.map(e => ({
      name: e.name,
      team: e.team,
      hours: e._sum.hours_spent || 0,
      units: e._sum.number_of_units || 0,
      tasks: e._count,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team performance
app.get('/api/dashboard/teams', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const teams = await prisma.masterDatabase.groupBy({
      by: ['team'],
      _sum: { 
        hours_spent: true,
        number_of_units: true 
      },
      _count: true,
      where: where,
      orderBy: {
        _sum: {
          hours_spent: 'desc',
        },
      },
    });

    res.json(teams.map(t => ({
      name: t.team,
      hours: t._sum.hours_spent || 0,
      units: t._sum.number_of_units || 0,
      tasks: t._count,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get timeline data - Stacked area chart by date and projects
app.get('/api/dashboard/timeline', async (req, res) => {
  try {
    const where = buildWhereClause(req);

    // Get date range based on period filter
    let dateFilter = {};
    if (req.query.period && req.query.period !== 'All') {
      const now = new Date();
      let startDate;
      
      switch(req.query.period) {
        case 'Last 7 Days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'Last 30 Days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'Last 3 Months':
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case 'Last 6 Months':
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case 'Last Year':
          startDate = new Date(now.setMonth(now.getMonth() - 12));
          break;
        case 'This Year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        dateFilter = { gte: startDate };
      }
    } else {
      // Default to last 30 days if no period specified
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter = { gte: thirtyDaysAgo };
    }

    const timelineData = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        project_name: { 
          not: null,
          notIn: ['', ' ', 'blank', 'Blank', 'BLANK']
        },
        date: {
          ...dateFilter,
          not: null
        }
      },
      select: {
        date: true,
        project_name: true,
        hours_spent: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get top 10 projects by total hours
    const projectTotals = {};
    timelineData.forEach(item => {
      if (!projectTotals[item.project_name]) {
        projectTotals[item.project_name] = 0;
      }
      projectTotals[item.project_name] += item.hours_spent || 0;
    });

    const topProjects = Object.entries(projectTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);

    // Group by date and project
    const groupedByDate = {};
    
    timelineData.forEach(item => {
      if (!item.date || !topProjects.includes(item.project_name)) return;
      
      const dateKey = item.date.toISOString().split('T')[0];
      
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          projects: {}
        };
        
        // Initialize all projects with 0
        topProjects.forEach(project => {
          groupedByDate[dateKey].projects[project] = 0;
        });
      }
      
      groupedByDate[dateKey].projects[item.project_name] += item.hours_spent || 0;
    });

    // Convert to array and sort by date
    const timeline = Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get work mode distribution
app.get('/api/dashboard/workmode', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const workModes = await prisma.masterDatabase.groupBy({
      by: ['work_mode'],
      _sum: { hours_spent: true },
      _count: true,
      where: { 
        ...where, 
        work_mode: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        } 
      }
    });

    res.json(workModes.map(w => ({
      mode: w.work_mode || 'Not Specified',
      hours: w._sum.hours_spent || 0,
      count: w._count,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Work mode by DAYS (distinct dates per employee per mode) + top 5 projects per mode
app.get('/api/dashboard/workmode-by-days', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const ALL_WORK_MODES = [
      'WFH',
      'In Office',
      'OT Office',
      'OT Home',
      'On Duty',
      'Night',
      'Half Day',
      'Leave'
    ];

    const whereWithMode = {
      ...where,
      work_mode: { not: null, notIn: ['', ' '] },
      date: where.date || undefined
    };

    // 1) Get records for distinct-day count and project aggregation
    const records = await prisma.masterDatabase.findMany({
      where: whereWithMode,
      select: { name: true, work_mode: true, date: true, project_name: true, hours_spent: true }
    });

    const makeKey = (name, work_mode) => JSON.stringify([name, work_mode]);

    // 2) Distinct days per (name, work_mode) - normalize date to date-only string
    const daysByKey = {};
    records.forEach(r => {
      if (!r.date) return;
      const key = makeKey(r.name, r.work_mode);
      if (!daysByKey[key]) daysByKey[key] = new Set();
      const dateStr = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
      daysByKey[key].add(dateStr);
    });

    // 3) Hours per (name, work_mode, project_name) for top 5 projects
    const projectHoursByKey = {};
    records.forEach(r => {
      if (!r.work_mode) return;
      const proj = r.project_name && r.project_name.trim() ? r.project_name.trim() : 'Unspecified';
      const key = makeKey(r.name, r.work_mode);
      if (!projectHoursByKey[key]) projectHoursByKey[key] = {};
      projectHoursByKey[key][proj] = (projectHoursByKey[key][proj] || 0) + (r.hours_spent || 0);
    });

    // 4) Build employee list and workModeProjects (top 5 per mode)
    const employeeMap = {};
    Object.keys(daysByKey).forEach(key => {
      const [name, mode] = JSON.parse(key);
      if (!employeeMap[name]) {
        employeeMap[name] = { name, workModeProjects: {} };
        ALL_WORK_MODES.forEach(m => {
          employeeMap[name][m] = 0;
          employeeMap[name].workModeProjects[m] = [];
        });
      }
      const days = daysByKey[key].size;
      if (ALL_WORK_MODES.includes(mode)) employeeMap[name][mode] = days;
      const projMap = projectHoursByKey[key] || {};
      const sorted = Object.entries(projMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([project_name, hours]) => ({ project_name, hours }));
      employeeMap[name].workModeProjects[mode] = sorted;
    });

    // Ensure every employee has all work modes and workModeProjects entries
    Object.keys(employeeMap).forEach(name => {
      ALL_WORK_MODES.forEach(mode => {
        if (employeeMap[name][mode] === undefined) employeeMap[name][mode] = 0;
        if (!employeeMap[name].workModeProjects[mode]) employeeMap[name].workModeProjects[mode] = [];
      });
    });

    const result = Object.values(employeeMap)
      .map(emp => {
        const { workModeProjects, ...rest } = emp;
        const totalDays = ALL_WORK_MODES.reduce((s, m) => s + (rest[m] || 0), 0);
        return { ...rest, workModeProjects, totalDays };
      })
      .filter(emp => emp.totalDays > 0)
      .sort((a, b) => b.totalDays - a.totalDays);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task distribution by element, including per-task breakdown for rich tooltips
app.get('/api/dashboard/elements', async (req, res) => {
  try {
    const where = buildWhereClause(req);

    // Group by element + task to get per-task hours per element
    const rows = await prisma.masterDatabase.groupBy({
      by: ['book_element', 'task_name'],
      _sum: {
        hours_spent: true,
        number_of_units: true
      },
      where: {
        ...where,
        book_element: {
          not: null,
          notIn: ['', ' '] // Exclude blanks
        }
      }
    });

    // Build element-level aggregates with task-type breakdown
    const elementMap = {};

    rows.forEach(r => {
      const elementName = r.book_element || 'Miscellaneous';
      const taskName = r.task_name || 'Unspecified';
      const hours = r._sum.hours_spent || 0;
      const units = r._sum.number_of_units || 0;

      if (!elementMap[elementName]) {
        elementMap[elementName] = {
          element: elementName,
          hours: 0,
          units: 0,
          tasks: 0,
          taskBreakdown: []
        };
      }

      elementMap[elementName].hours += hours;
      elementMap[elementName].units += units;

      elementMap[elementName].taskBreakdown.push({
        task: taskName,
        hours,
        units
      });
    });

    const elements = Object.values(elementMap)
      .map(e => ({
        ...e,
        tasks: e.taskBreakdown.length,
        taskBreakdown: e.taskBreakdown
          .sort((a, b) => (b.hours || 0) - (a.hours || 0))
      }))
      .sort((a, b) => (b.hours || 0) - (a.hours || 0))
      .slice(0, 15);

    res.json(elements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OPTIMIZED: Get task type distribution with TOP 5 book elements per task
app.get('/api/dashboard/tasks', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    // OPTIMIZED: Single groupBy query
    const taskElementData = await prisma.masterDatabase.groupBy({
      by: ['task_name', 'book_element'],
      _sum: {
        hours_spent: true,
        number_of_units: true
      },
      where: { 
        ...where, 
        task_name: { 
          not: null,
          notIn: ['', ' ']
        }
      }
    });

    // Group by task and calculate totals
    const taskGroups = {};
    
    taskElementData.forEach(record => {
      const taskName = record.task_name;
      
      if (!taskGroups[taskName]) {
        taskGroups[taskName] = {
          task: taskName,
          hours: 0,
          units: 0,
          count: 0,
          elementBreakdown: []
        };
      }
      
      taskGroups[taskName].hours += record._sum.hours_spent || 0;
      taskGroups[taskName].units += record._sum.number_of_units || 0;
      taskGroups[taskName].count += 1;
      
      // Track book element breakdown
      if (record.book_element && record.book_element.trim() !== '') {
        taskGroups[taskName].elementBreakdown.push({
          element: record.book_element,
          hours: record._sum.hours_spent || 0
        });
      }
    });

    // Convert to array and process
    let tasks = Object.values(taskGroups)
      .map(task => ({
        task: task.task,
        hours: task.hours,
        units: task.units,
        count: task.count,
        // LIMIT TO TOP 5 ELEMENTS per task, sorted by hours descending
        elements: task.elementBreakdown
          .sort((a, b) => b.hours - a.hours)
          .slice(0, 5) // Only top 5
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 15);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get status distribution
app.get('/api/dashboard/status', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const statuses = await prisma.masterDatabase.groupBy({
      by: ['status'],
      _sum: { hours_spent: true },
      _count: true,
      where: { 
        ...where, 
        status: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        } 
      }
    });

    res.json(statuses.map(s => ({
      status: s.status,
      hours: s._sum.hours_spent || 0,
      count: s._count,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit status distribution
app.get('/api/dashboard/audit-status', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const auditStatuses = await prisma.masterDatabase.groupBy({
      by: ['audit_status'],
      _sum: { hours_spent: true },
      _count: true,
      where: { 
        ...where, 
        audit_status: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        } 
      }
    });

    res.json(auditStatuses.map(a => ({
      status: a.audit_status,
      hours: a._sum.hours_spent || 0,
      count: a._count,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team comparison data
app.get('/api/dashboard/team-comparison', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    
    const teamData = await prisma.masterDatabase.groupBy({
      by: ['team', 'task_name'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        task_name: { 
          not: null,
          notIn: ['', ' '] // Exclude blanks
        }
      }
    });

    // Filter out null values after grouping
    const filteredData = teamData.filter(d => d.team && d.task_name);

    // Restructure for stacked bar chart
    const taskTypes = [...new Set(filteredData.map(d => d.task_name))].slice(0, 10);
    const teams = [...new Set(filteredData.map(d => d.team))];

    const chartData = teams.map(team => {
      const teamEntry = { team: team };
      taskTypes.forEach(task => {
        const found = filteredData.find(d => d.team === team && d.task_name === task);
        teamEntry[task] = found?._sum.hours_spent || 0;
      });
      return teamEntry;
    });

    res.json({ data: chartData, tasks: taskTypes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== PROJECT VIEW ENDPOINTS =====

// Helper: build extended where for project-view (adds project_name, task_name, book_element)
function buildProjectViewWhere(req) {
  const where = buildWhereClause(req); // team, employee, period already handled

  if (req.query.project_name && req.query.project_name !== 'All') {
    where.project_name = req.query.project_name;
  }
  if (req.query.task_name && req.query.task_name !== 'All') {
    where.task_name = req.query.task_name;
  }
  if (req.query.book_element && req.query.book_element !== 'All') {
    where.book_element = req.query.book_element;
  }

  // Always exclude blank project names
  if (!where.project_name) {
    where.project_name = { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] };
  }

  return where;
}

// Filter: distinct project names (respects team/employee/period)
app.get('/api/dashboard/project-view/filter/project-names', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.project_name = { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] };

    const rows = await prisma.masterDatabase.findMany({
      distinct: ['project_name'],
      select: { project_name: true },
      where,
      orderBy: { project_name: 'asc' }
    });

    res.json(rows.map(r => r.project_name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter: distinct task names
app.get('/api/dashboard/project-view/filter/tasks', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.task_name = { not: null, notIn: ['', ' '] };

    const rows = await prisma.masterDatabase.findMany({
      distinct: ['task_name'],
      select: { task_name: true },
      where,
      orderBy: { task_name: 'asc' }
    });

    res.json(rows.map(r => r.task_name).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter: distinct book_element values (Project Element dropdown)
app.get('/api/dashboard/project-view/filter/elements', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.book_element = { not: null, notIn: ['', ' '] };

    const rows = await prisma.masterDatabase.findMany({
      distinct: ['book_element'],
      select: { book_element: true },
      where,
      orderBy: { book_element: 'asc' }
    });

    res.json(rows.map(r => r.book_element).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project-wise Tasks: top 10 projects each with per-task { hours, units }
// Used to render the horizontal stacked bars
app.get('/api/dashboard/project-view/projects', async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);

    // Single query: group by (project_name, task_name)
    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        task_name: { not: null, notIn: ['', ' '] }
      }
    });

    // Aggregate into per-project map
    const projectMap = {};
    rows.forEach(r => {
      const pName = r.project_name;
      if (!projectMap[pName]) {
        projectMap[pName] = { name: pName, totalHours: 0, totalUnits: 0, tasks: [] };
      }
      const hours = r._sum.hours_spent || 0;
      const units = r._sum.number_of_units || 0;
      projectMap[pName].totalHours += hours;
      projectMap[pName].totalUnits += units;
      projectMap[pName].tasks.push({ task: r.task_name, hours, units });
    });

    // Sort each project's tasks by hours desc, then sort projects by totalHours desc, take 10
    const result = Object.values(projectMap)
      .map(p => ({
        ...p,
        tasks: p.tasks.sort((a, b) => b.hours - a.hours)
      }))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Timeline: for ONE clicked project, returns date-grouped data with per-task hours
// Used for the area chart below the bars. Tooltip shows task→hours on each date.
app.get('/api/dashboard/project-view/timeline', async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);

    // Date filter — default to all time for project timeline (no forced 30-day window)
    let dateFilter = {};
    if (req.query.period && req.query.period !== 'All') {
      const now = new Date();
      let startDate;
      switch (req.query.period) {
        case 'Last 7 Days':   startDate = new Date(now); startDate.setDate(startDate.getDate() - 7); break;
        case 'Last 30 Days':  startDate = new Date(now); startDate.setDate(startDate.getDate() - 30); break;
        case 'Last 3 Months': startDate = new Date(now); startDate.setMonth(startDate.getMonth() - 3); break;
        case 'Last 6 Months': startDate = new Date(now); startDate.setMonth(startDate.getMonth() - 6); break;
        case 'Last Year':     startDate = new Date(now); startDate.setMonth(startDate.getMonth() - 12); break;
        case 'This Year':     startDate = new Date(now.getFullYear(), 0, 1); break;
      }
      if (startDate) dateFilter = { gte: startDate };
    }

    const records = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        date: { ...dateFilter, not: null }
      },
      select: { date: true, task_name: true, hours_spent: true },
      orderBy: { date: 'asc' }
    });

    // Collect all distinct task names that actually appear
    const allTasks = [...new Set(records.map(r => r.task_name).filter(Boolean))];

    // Group by date
    const dateMap = {};
    records.forEach(r => {
      if (!r.date) return;
      const dateKey = r.date instanceof Date
        ? r.date.toISOString().split('T')[0]
        : String(r.date).slice(0, 10);

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey };
        allTasks.forEach(t => { dateMap[dateKey][t] = 0; });
      }
      const task = r.task_name || 'Unspecified';
      dateMap[dateKey][task] = (dateMap[dateKey][task] || 0) + (r.hours_spent || 0);
    });

    const timeline = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    res.json({ timeline, tasks: allTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});



























// const express = require('express');
// const cors = require('cors');
// const prisma = require('./src/config/prisma'); 

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Helper function to build where clause from query params
// function buildWhereClause(req) {
//   const where = {};
  
//   if (req.query.team && req.query.team !== 'All') {
//     where.team = req.query.team;
//   }
//   if (req.query.role && req.query.role !== 'All') {
//     where.role = req.query.role;
//   }
//   if (req.query.shiftType && req.query.shiftType !== 'All') {
//     where.shift_type = req.query.shiftType;
//   }
  
//   // Date filter
//   if (req.query.date) {
//     const selectedDate = new Date(req.query.date);
//     where.date = {
//       gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
//       lte: new Date(selectedDate.setHours(23, 59, 59, 999))
//     };
//   }
  
//   // Date range filter
//   if (req.query.startDate && req.query.endDate) {
//     const start = new Date(req.query.startDate);
//     const end = new Date(req.query.endDate);
//     where.date = {
//       gte: new Date(start.setHours(0, 0, 0, 0)),
//       lte: new Date(end.setHours(23, 59, 59, 999))
//     };
//   }
  
//   return where;
// }

// // Helper function to get date range
// function getDateRange(req) {
//   if (req.query.date) {
//     const selectedDate = new Date(req.query.date);
//     return {
//       start: new Date(selectedDate.setHours(0, 0, 0, 0)),
//       end: new Date(selectedDate.setHours(23, 59, 59, 999))
//     };
//   }
  
//   if (req.query.startDate && req.query.endDate) {
//     const start = new Date(req.query.startDate);
//     const end = new Date(req.query.endDate);
//     return {
//       start: new Date(start.setHours(0, 0, 0, 0)),
//       end: new Date(end.setHours(23, 59, 59, 999))
//     };
//   }
  
//   // Default to today
//   const today = new Date();
//   return {
//     start: new Date(today.setHours(0, 0, 0, 0)),
//     end: new Date(today.setHours(23, 59, 59, 999))
//   };
// }

// // ===== FILTER ENDPOINTS =====

// app.get('/api/workforce/filters/teams', async (req, res) => {
//   try {
//     const teams = await prisma.users.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });
//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/workforce/filters/roles', async (req, res) => {
//   try {
//     const roles = await prisma.users.findMany({
//       distinct: ['role'],
//       select: { role: true },
//       orderBy: { role: 'asc' }
//     });
//     res.json(roles.map(r => r.role).filter(Boolean));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ===== WORKFORCE MANAGEMENT ENDPOINTS =====

// // 1. Top Summary Metrics
// app.get('/api/workforce/summary', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
//     const roleFilter = req.query.role && req.query.role !== 'All' ? { role: req.query.role } : {};
    
//     // Total Employees
//     const totalEmployees = await prisma.users.count({
//       where: {
//         ...teamFilter,
//         ...roleFilter,
//         role: { not: 'ADMIN' }
//       }
//     });

//     // Get all employees for further calculations
//     const allEmployees = await prisma.users.findMany({
//       where: {
//         ...teamFilter,
//         ...roleFilter,
//         role: { not: 'ADMIN' }
//       },
//       select: { name: true, email: true }
//     });

//     // Active Employees (logged at least once in the period)
//     const activeEmployees = await prisma.masterDatabase.groupBy({
//       by: ['name'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       _count: true
//     });

//     // Present Employees (logged work on selected date)
//     const presentEmployees = await prisma.todaysWorklog.groupBy({
//       by: ['name'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       _count: true
//     });

//     const presentCount = presentEmployees.length;
//     const activeCount = activeEmployees.length;
//     const absentCount = totalEmployees - presentCount;

//     // Night Shifts
//     const nightShifts = await prisma.markShift.count({
//       where: {
//         shift_date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         shift_type: 'NIGHT',
//         ...teamFilter
//       }
//     });

//     // Sunday Shifts
//     const sundayShifts = await prisma.markShift.count({
//       where: {
//         shift_date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         shift_type: 'SUNDAY',
//         ...teamFilter
//       }
//     });

//     // Entry Compliance %
//     const entryCompliance = totalEmployees > 0 
//       ? ((presentCount / totalEmployees) * 100).toFixed(1) 
//       : 0;

//     res.json({
//       totalEmployees,
//       activeEmployees: activeCount,
//       present: presentCount,
//       absent: absentCount,
//       nightShifts,
//       sundayShifts,
//       entryCompliance: parseFloat(entryCompliance)
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 2. Attendance Overview
// app.get('/api/workforce/attendance-overview', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Total employees
//     const totalEmployees = await prisma.users.count({
//       where: {
//         ...teamFilter,
//         role: { not: 'ADMIN' }
//       }
//     });

//     // Present
//     const present = await prisma.todaysWorklog.groupBy({
//       by: ['name'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       }
//     });

//     const presentCount = present.length;
//     const absentCount = totalEmployees - presentCount;

//     res.json({
//       present: presentCount,
//       absent: absentCount,
//       entryPending: absentCount, // Same as absent for simplicity
//       total: totalEmployees
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 3. Shift Distribution by Team
// app.get('/api/workforce/shift-distribution', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     const shifts = await prisma.markShift.groupBy({
//       by: ['team', 'shift_type'],
//       where: {
//         shift_date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       _count: true
//     });

//     // Organize by team
//     const teamShifts = {};
//     shifts.forEach(shift => {
//       if (!teamShifts[shift.team]) {
//         teamShifts[shift.team] = {
//           team: shift.team,
//           night: 0,
//           sunday: 0
//         };
//       }
//       if (shift.shift_type === 'NIGHT') {
//         teamShifts[shift.team].night = shift._count;
//       } else if (shift.shift_type === 'SUNDAY') {
//         teamShifts[shift.team].sunday = shift._count;
//       }
//     });

//     res.json(Object.values(teamShifts));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 4. Workforce Utilisation
// app.get('/api/workforce/utilisation', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Get total hours per team
//     const teamHours = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       _sum: {
//         hours_spent: true
//       },
//       _count: {
//         name: true
//       }
//     });

//     // Get active employees per team
//     const activePerTeam = await prisma.masterDatabase.groupBy({
//       by: ['team', 'name'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       }
//     });

//     const teamEmployeeCount = {};
//     activePerTeam.forEach(record => {
//       if (!teamEmployeeCount[record.team]) {
//         teamEmployeeCount[record.team] = new Set();
//       }
//       teamEmployeeCount[record.team].add(record.name);
//     });

//     const utilisation = teamHours.map(team => ({
//       team: team.team,
//       totalHours: team._sum.hours_spent || 0,
//       activeEmployees: teamEmployeeCount[team.team]?.size || 0,
//       avgHoursPerEmployee: teamEmployeeCount[team.team]?.size > 0 
//         ? ((team._sum.hours_spent || 0) / teamEmployeeCount[team.team].size).toFixed(2)
//         : 0
//     }));

//     res.json(utilisation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 5. Employee Availability View (Audit Friendly)
// app.get('/api/workforce/employee-availability', async (req, res) => {
//   try {
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Get date range (default to last 30 days)
//     const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
//     const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
//     // Get all employees
//     const employees = await prisma.users.findMany({
//       where: {
//         ...teamFilter,
//         role: { not: 'ADMIN' }
//       },
//       select: { name: true, team: true },
//       orderBy: { name: 'asc' }
//     });

//     // Get all work logs in the date range
//     const workLogs = await prisma.masterDatabase.findMany({
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate
//         },
//         ...teamFilter
//       },
//       select: {
//         name: true,
//         date: true
//       }
//     });

//     // Create a map of employee work days
//     const employeeWorkDays = {};
//     workLogs.forEach(log => {
//       if (!employeeWorkDays[log.name]) {
//         employeeWorkDays[log.name] = new Set();
//       }
//       if (log.date) {
//         employeeWorkDays[log.name].add(log.date.toISOString().split('T')[0]);
//       }
//     });

//     // Generate date range array
//     const dates = [];
//     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//       dates.push(new Date(d).toISOString().split('T')[0]);
//     }

//     // Build availability grid
//     const availability = employees.map(emp => ({
//       name: emp.name,
//       team: emp.team,
//       dates: dates.map(date => ({
//         date,
//         logged: employeeWorkDays[emp.name]?.has(date) || false
//       }))
//     }));

//     res.json({
//       employees: availability,
//       dateRange: dates
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 6. Team Capacity Overview
// app.get('/api/workforce/team-capacity', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Get total employees per team
//     const teamEmployees = await prisma.users.groupBy({
//       by: ['team'],
//       where: {
//         ...teamFilter,
//         role: { not: 'ADMIN' }
//       },
//       _count: true
//     });

//     // Get total hours and active employees per team
//     const teamHours = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       _sum: {
//         hours_spent: true
//       }
//     });

//     const activePerTeam = await prisma.masterDatabase.groupBy({
//       by: ['team', 'name'],
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       }
//     });

//     const teamActiveCount = {};
//     activePerTeam.forEach(record => {
//       if (!teamActiveCount[record.team]) {
//         teamActiveCount[record.team] = new Set();
//       }
//       teamActiveCount[record.team].add(record.name);
//     });

//     // Combine data
//     const capacity = teamEmployees.map(team => {
//       const hours = teamHours.find(h => h.team === team.team);
//       return {
//         team: team.team,
//         totalEmployees: team._count,
//         activeEmployees: teamActiveCount[team.team]?.size || 0,
//         totalHours: hours?._sum.hours_spent || 0
//       };
//     });

//     res.json(capacity);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 7. Leave / Half-Day Indicators (Derived)
// app.get('/api/workforce/leave-indicators', async (req, res) => {
//   try {
//     const dateRange = getDateRange(req);
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Get all work logs
//     const workLogs = await prisma.masterDatabase.findMany({
//       where: {
//         date: {
//           gte: dateRange.start,
//           lte: dateRange.end
//         },
//         ...teamFilter
//       },
//       select: {
//         name: true,
//         date: true,
//         hours_spent: true
//       }
//     });

//     // Group by employee and date
//     const dailyHours = {};
//     workLogs.forEach(log => {
//       if (!log.date) return;
//       const dateKey = log.date.toISOString().split('T')[0];
//       const empKey = `${log.name}_${dateKey}`;
//       if (!dailyHours[empKey]) {
//         dailyHours[empKey] = {
//           name: log.name,
//           date: dateKey,
//           hours: 0
//         };
//       }
//       dailyHours[empKey].hours += log.hours_spent || 0;
//     });

//     // Categorize
//     const indicators = {
//       fullLeave: [],
//       halfDay: [],
//       reducedHours: []
//     };

//     Object.values(dailyHours).forEach(record => {
//       if (record.hours === 0) {
//         indicators.fullLeave.push(record);
//       } else if (record.hours < 4) {
//         indicators.halfDay.push(record);
//       } else if (record.hours < 6) {
//         indicators.reducedHours.push(record);
//       }
//     });

//     // Get employees with no entry
//     const allEmployees = await prisma.users.findMany({
//       where: {
//         ...teamFilter,
//         role: { not: 'ADMIN' }
//       },
//       select: { name: true }
//     });

//     const loggedEmployees = new Set(workLogs.map(log => log.name));
//     const noEntry = allEmployees
//       .filter(emp => !loggedEmployees.has(emp.name))
//       .map(emp => ({ name: emp.name, date: dateRange.start.toISOString().split('T')[0], hours: 0 }));

//     res.json({
//       fullLeave: indicators.fullLeave.length + noEntry.length,
//       halfDay: indicators.halfDay.length,
//       reducedHours: indicators.reducedHours.length,
//       details: {
//         fullLeave: [...indicators.fullLeave, ...noEntry],
//         halfDay: indicators.halfDay,
//         reducedHours: indicators.reducedHours
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 8. Daily Activity Timeline
// app.get('/api/workforce/daily-activity', async (req, res) => {
//   try {
//     const teamFilter = req.query.team && req.query.team !== 'All' ? { team: req.query.team } : {};
    
//     // Get last 30 days
//     const endDate = new Date();
//     const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
//     const dailyActivity = await prisma.masterDatabase.groupBy({
//       by: ['date'],
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate
//         },
//         ...teamFilter
//       },
//       _sum: {
//         hours_spent: true
//       },
//       _count: {
//         name: true
//       },
//       orderBy: {
//         date: 'asc'
//       }
//     });

//     // Count unique employees per day
//     const dailyEmployees = await prisma.masterDatabase.findMany({
//       where: {
//         date: {
//           gte: startDate,
//           lte: endDate
//         },
//         ...teamFilter
//       },
//       select: {
//         date: true,
//         name: true
//       }
//     });

//     const employeesPerDay = {};
//     dailyEmployees.forEach(record => {
//       if (!record.date) return;
//       const dateKey = record.date.toISOString().split('T')[0];
//       if (!employeesPerDay[dateKey]) {
//         employeesPerDay[dateKey] = new Set();
//       }
//       employeesPerDay[dateKey].add(record.name);
//     });

//     const timeline = dailyActivity.map(day => ({
//       date: day.date ? day.date.toISOString().split('T')[0] : null,
//       hours: day._sum.hours_spent || 0,
//       entries: day._count,
//       employees: employeesPerDay[day.date?.toISOString().split('T')[0]]?.size || 0
//     })).filter(d => d.date);

//     res.json(timeline);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => {
//   console.log(`Workforce API Server running on port ${PORT}`);
// });