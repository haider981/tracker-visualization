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
const { projectMatchesSeriesSelection } = require('./src/utils/projectSeriesToken');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  next();
});

// Helper function to build where clause from query params
function getPeriodDateRange(periodRaw) {
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

  // Keep period day-aligned and bounded to "today".
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function buildWhereClause(req) {
  const where = {};
  
  // Department filter (maps to team naming conventions)
  if (req.query.department && req.query.department !== 'All') {
    if (req.query.department === 'DTP') {
      where.OR = [
        { team: { startsWith: 'DTP' } },
        { team: { startsWith: 'Animation' } },
        { team: 'Animation_Maths' }
      ];
    } else if (req.query.department === 'Editorial') {
      where.OR = [
        { team: { startsWith: 'Editorial' } },
        { team: { startsWith: 'CSMA' } }
      ];
    } else if (req.query.department === 'Digital Marketing') {
      where.team = 'Digital_Marketing';
    }
  }

  if (req.query.team && req.query.team !== 'All') {
    const teams = String(req.query.team)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (teams.length === 1) {
      where.team = teams[0];
    } else if (teams.length > 1) {
      where.team = { in: teams };
    }
    // Team is more specific than department; clear department OR guard
    if (where.OR) delete where.OR;
  }
  if (req.query.employee && req.query.employee !== 'All') {
    where.name = req.query.employee;
  }
  
  // Period filter (strictly bounded date range, case-insensitive values)
  const periodRange = getPeriodDateRange(req.query.period);
  if (periodRange) {
    where.date = {
      gte: periodRange.start,
      lte: periodRange.end
    };
  }
  
  return where;
}

/** Users-table filters (department / team / employee) — same team mapping as buildWhereClause, no date period. */
function buildUsersWhereClause(req) {
  const and = [];

  if (req.query.department && req.query.department !== 'All') {
    if (req.query.department === 'DTP') {
      and.push({
        OR: [
          { team: { startsWith: 'DTP' } },
          { team: { startsWith: 'Animation' } },
          { team: 'Animation_Maths' },
        ],
      });
    } else if (req.query.department === 'Editorial') {
      and.push({
        OR: [
          { team: { startsWith: 'Editorial' } },
          { team: { startsWith: 'CSMA' } },
        ],
      });
    } else if (req.query.department === 'Digital Marketing') {
      and.push({ team: 'Digital_Marketing' });
    }
  }

  if (req.query.team && req.query.team !== 'All') {
    const teams = String(req.query.team)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (teams.length === 1) {
      and.push({ team: teams[0] });
    } else if (teams.length > 1) {
      and.push({ team: { in: teams } });
    }
  }

  if (req.query.employee && req.query.employee !== 'All') {
    and.push({ name: req.query.employee });
  }

  // Non-admins only; include null role (new users often have no role set yet)
  and.push({
    OR: [{ role: null }, { role: { not: 'ADMIN' } }],
  });

  if (and.length === 0) return {};
  if (and.length === 1) return and[0];
  return { AND: and };
}

/** Normalize repeated `series` query params (multi-select) to a non-empty string list. */
function normalizeSeriesQueryList(req) {
  const q = req.query.series;
  if (q == null || q === '' || q === 'All') return [];
  const arr = Array.isArray(q) ? q : [q];
  return arr.map((s) => String(s || '').trim()).filter((s) => s && s !== 'All');
}

// Helper function to filter project names by segment/class/series tokens
function applyProjectTokenFilters(where, req) {
  const tokenFilters = [];
  
  if (req.query.segment && req.query.segment !== 'All') {
    // segment is the first token: FK_... or VK_...
    tokenFilters.push({ project_name: { startsWith: `${req.query.segment}_` } });
  }
  if (req.query.class && req.query.class !== 'All') {
    // class/year is the second token: _<class>_...
    tokenFilters.push({ project_name: { contains: `_${req.query.class}_` } });
  }
  const seriesVals = normalizeSeriesQueryList(req);
  if (seriesVals.length === 1) {
    tokenFilters.push({ project_name: { contains: `_${seriesVals[0]}_` } });
  } else if (seriesVals.length > 1) {
    tokenFilters.push({
      OR: seriesVals.map((s) => ({ project_name: { contains: `_${s}_` } })),
    });
  }
  
  if (tokenFilters.length > 0) {
    where.AND = where.AND ? [...where.AND, ...tokenFilters] : tokenFilters;
  }
  
  return where;
}

/** Strip trailing academic session (e.g. -25-26, _26-27) from project_name for cross-session book grouping. */
function parseAcademicSessionFromProject(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    return { baseKey: '_empty', sessionLabel: 'unknown', displayOriginal: '' };
  }
  const trimmed = projectName.trim();
  const lower = trimmed.toLowerCase();
  const re = /([-_])((?:20)?\d{2})[-_]((?:20)?\d{2})$/;
  const m = lower.match(re);
  if (m) {
    const y1 = m[2].replace(/^20/, '');
    const y2 = m[3].replace(/^20/, '');
    const sessionLabel = `${y1}-${y2}`;
    const baseKey = lower.slice(0, m.index).replace(/[-_]+$/g, '') || lower;
    return { baseKey, sessionLabel, displayOriginal: trimmed };
  }
  return {
    baseKey: lower.replace(/[-_]+$/g, '') || lower,
    sessionLabel: 'unspecified',
    displayOriginal: trimmed
  };
}

function sessionChronologicalKey(sessionLabel) {
  if (sessionLabel === 'unspecified' || sessionLabel === 'unknown') return 999999;
  const [a, b] = sessionLabel.split('-').map((x) => parseInt(x, 10));
  if (Number.isNaN(a)) return 999999;
  const bb = Number.isNaN(b) ? 0 : b;
  return a * 100 + bb;
}

/** Human-readable base title preserving original casing (strips trailing YY-YY). */
function stripSessionForDisplay(projectName) {
  const trimmed = String(projectName || '').trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  const re = /([-_])((?:20)?\d{2})[-_]((?:20)?\d{2})$/;
  const m = lower.match(re);
  if (!m) return trimmed;
  return trimmed.slice(0, m.index).replace(/[-_]+$/g, '') || trimmed;
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
    
    // Filter by team (supports comma-separated multi-select)
    if (team && team !== 'All') {
      const teams = String(team)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (teams.length === 1) {
        where.team = teams[0];
      } else if (teams.length > 1) {
        where.team = { in: teams };
      }
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

    const totalEmployees = await prisma.users.count({
      where: buildUsersWhereClause(req),
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
      totalEmployees,
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
    const timelineStart = Math.max(0, parseInt(req.query.timelineStart, 10) || 0);
    const timelineLimitRaw = parseInt(req.query.timelineLimit, 10);
    const timelineLimit = Math.min(100, Math.max(1, Number.isFinite(timelineLimitRaw) ? timelineLimitRaw : 10));

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

    const sortedProjects = Object.entries(projectTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    const topProjects = sortedProjects.slice(timelineStart, timelineStart + timelineLimit);

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

    res.json({
      timeline,
      totalProjects: sortedProjects.length,
      timelineStart,
      timelineLimit,
      shownProjects: topProjects.length
    });
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
      select: { name: true, team: true, work_mode: true, date: true, project_name: true, hours_spent: true }
    });

    const selectedDepartment = req.query.department || 'All';
    const selectedTeam = req.query.team || 'All';
    const selectedEmployee = req.query.employee || 'All';

    const teamToDepartment = (teamName) => {
      const t = String(teamName || '').trim();
      if (!t) return null;
      if (t.startsWith('DTP') || t.startsWith('Animation')) return 'DTP';
      if (t.startsWith('Editorial') || t.startsWith('CSMA')) return 'Editorial';
      if (t === 'Digital_Marketing') return 'Digital Marketing';
      return null;
    };

    const resolveGroup = (row) => {
      const name = String(row?.name || '').trim();
      const team = String(row?.team || '').trim();
      if (!name && !team) return null;

      // Employee-level view: specific team selected (or specific employee).
      if (selectedEmployee !== 'All' || selectedTeam !== 'All') {
        if (!name) return null;
        return { id: `emp:${name}\t${team}`, name, team: team || null };
      }

      // Team-level view: department selected, team = All.
      if (selectedDepartment !== 'All') {
        if (!team) return null;
        return { id: `team:${team}`, name: team, team };
      }

      // Department-level view: department = All, team = All.
      const department = teamToDepartment(team);
      if (!department) return null;
      return { id: `dept:${department}`, name: department, team: department };
    };

    const makeModeDateKey = (groupId, mode) => `${groupId}\t${mode}`;
    const makeModeProjKey = (groupId, mode) => `${groupId}\t${mode}`;

    const grouped = {};
    const daysByGroupMode = {};
    const projByGroupMode = {};

    for (const r of records) {
      const mode = ALL_WORK_MODES.includes(r.work_mode) ? r.work_mode : null;
      if (!mode) continue;
      const group = resolveGroup(r);
      if (!group) continue;

      if (!grouped[group.id]) {
        grouped[group.id] = { name: group.name, team: group.team, workModeProjects: {} };
        ALL_WORK_MODES.forEach((m) => {
          grouped[group.id][m] = 0;
          grouped[group.id].workModeProjects[m] = [];
        });
      }

      if (r.date) {
        const d = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
        const dk = makeModeDateKey(group.id, mode);
        if (!daysByGroupMode[dk]) daysByGroupMode[dk] = new Set();
        daysByGroupMode[dk].add(d);
      }

      const proj = r.project_name && String(r.project_name).trim() ? String(r.project_name).trim() : 'Unspecified';
      const pk = makeModeProjKey(group.id, mode);
      if (!projByGroupMode[pk]) projByGroupMode[pk] = {};
      projByGroupMode[pk][proj] = (projByGroupMode[pk][proj] || 0) + (r.hours_spent || 0);
    }

    Object.keys(grouped).forEach((gid) => {
      ALL_WORK_MODES.forEach((mode) => {
        const dk = makeModeDateKey(gid, mode);
        grouped[gid][mode] = daysByGroupMode[dk]?.size || 0;

        const pk = makeModeProjKey(gid, mode);
        const sortedProjects = Object.entries(projByGroupMode[pk] || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([project_name, hours]) => ({ project_name, hours }));
        grouped[gid].workModeProjects[mode] = sortedProjects;
      });
    });

    let result = Object.values(grouped)
      .map((row) => {
        const totalDays = ALL_WORK_MODES.reduce((s, m) => s + (row[m] || 0), 0);
        return { ...row, totalDays };
      })
      .filter((row) => row.totalDays > 0);

    if (selectedDepartment === 'All' && selectedTeam === 'All' && selectedEmployee === 'All') {
      const order = ['DTP', 'Editorial', 'Digital Marketing'];
      result.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    } else {
      result.sort((a, b) => b.totalDays - a.totalDays);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cross-session book effort: group project_name by base book (strip YY-YY session suffix) and compare sessions
app.get('/api/dashboard/cross-session-books', async (req, res) => {
  try {
    let where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rawProj = req.query.project_name;
    const projList = rawProj == null ? [] : Array.isArray(rawProj) ? rawProj : [rawProj];
    const projFiltered = projList.map((p) => String(p).trim()).filter((p) => p && p !== 'All');
    if (projFiltered.length) {
      where = { ...where, project_name: { in: projFiltered } };
    }
    const minSessions = Math.max(1, Math.min(20, parseInt(req.query.minSessions, 10) || 2));

    const rows = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] }
      },
      select: {
        project_name: true,
        hours_spent: true,
        name: true,
        task_name: true,
        date: true,
        number_of_units: true
      }
    });

    /** baseKey -> sessionLabel -> aggregate bucket */
    const tree = {};
    for (const r of rows) {
      const pn = r.project_name || '';
      const { baseKey, sessionLabel } = parseAcademicSessionFromProject(pn);
      if (!tree[baseKey]) tree[baseKey] = {};
      if (!tree[baseKey][sessionLabel]) {
        tree[baseKey][sessionLabel] = {
          sessionLabel,
          projectNames: new Set(),
          totalHours: 0,
          totalUnits: 0,
          entryCount: 0,
          contributors: new Set(),
          taskHours: {},
          dates: []
        };
      }
      const b = tree[baseKey][sessionLabel];
      b.projectNames.add(pn);
      b.totalHours += r.hours_spent || 0;
      b.totalUnits += r.number_of_units || 0;
      b.entryCount += 1;
      if (r.name) b.contributors.add(r.name);
      const task = (r.task_name && String(r.task_name).trim()) || 'Unspecified';
      b.taskHours[task] = (b.taskHours[task] || 0) + (r.hours_spent || 0);
      if (r.date) b.dates.push(r.date);
    }

    const groups = [];
    for (const [baseKey, sessionsMap] of Object.entries(tree)) {
      const sessionLabels = Object.keys(sessionsMap);
      const distinctSessions = sessionLabels.filter((s) => s !== 'unspecified' && s !== 'unknown');
      if (distinctSessions.length < minSessions) continue;

      const sessions = sessionLabels
        .filter((s) => s !== 'unknown')
        .map((s) => {
          const x = sessionsMap[s];
          const dateObjs = x.dates.filter(Boolean);
          const minD = dateObjs.length ? new Date(Math.min(...dateObjs.map((d) => d.getTime()))) : null;
          const maxD = dateObjs.length ? new Date(Math.max(...dateObjs.map((d) => d.getTime()))) : null;
          const taskHoursSorted = Object.entries(x.taskHours)
            .sort((a, b) => b[1] - a[1])
            .map(([task, hours]) => ({ task, hours }));
          return {
            sessionLabel: s,
            projectNames: [...x.projectNames].sort(),
            totalHours: Math.round(x.totalHours * 100) / 100,
            totalUnits: x.totalUnits,
            entryCount: x.entryCount,
            contributorCount: x.contributors.size,
            contributors: [...x.contributors].sort(),
            taskHours: taskHoursSorted,
            dateFrom: minD ? minD.toISOString().slice(0, 10) : null,
            dateTo: maxD ? maxD.toISOString().slice(0, 10) : null
          };
        })
        .sort((a, b) => sessionChronologicalKey(a.sessionLabel) - sessionChronologicalKey(b.sessionLabel));

      const chartBySession = sessions
        .filter((s) => s.sessionLabel !== 'unspecified')
        .map((s) => ({
          session: s.sessionLabel,
          hours: s.totalHours,
          contributors: s.contributorCount,
          entries: s.entryCount,
          hoursPerContributor: s.contributorCount ? Math.round((s.totalHours / s.contributorCount) * 100) / 100 : 0
        }));

      const flags = [];
      const insights = [];
      const sortedForCompare = sessions.filter((s) => s.sessionLabel !== 'unspecified');
      if (sortedForCompare.length >= 2) {
        const hoursList = sortedForCompare.map((s) => s.totalHours);
        const last = hoursList[hoursList.length - 1];
        const prev = hoursList.slice(0, -1);
        const meanPrev = prev.reduce((a, c) => a + c, 0) / prev.length;

        if (meanPrev > 5 && last > meanPrev * 2) {
          flags.push({
            type: 'disproportionate_high',
            severity: 'warning',
            message: `Latest session (${sortedForCompare[sortedForCompare.length - 1].sessionLabel}) logged ${last.toFixed(1)}h vs prior-session average ${meanPrev.toFixed(1)}h — review for over-reporting or scope change.`
          });
        }
        if (meanPrev > 10 && last < meanPrev * 0.25) {
          flags.push({
            type: 'disproportionate_low',
            severity: 'info',
            message: `Latest session shows much lower hours than prior sessions — possible under-reporting or reduced scope.`
          });
        }

        const lastCont = new Set(sortedForCompare[sortedForCompare.length - 1].contributors);
        const priorUnion = new Set();
        for (let i = 0; i < sortedForCompare.length - 1; i++) {
          sortedForCompare[i].contributors.forEach((n) => priorUnion.add(n));
        }
        let overlap = 0;
        lastCont.forEach((n) => {
          if (priorUnion.has(n)) overlap += 1;
        });
        const jaccard =
          lastCont.size + priorUnion.size > 0
            ? overlap / (new Set([...lastCont, ...priorUnion]).size || 1)
            : 0;
        if (overlap >= 3 && jaccard > 0.35) {
          insights.push(
            `${overlap} contributors appear in both the latest session and earlier sessions (overlap index ${(jaccard * 100).toFixed(0)}%) — validate against duplicate or repeated work.`
          );
        }

        const hPerCont = sortedForCompare.map((s) =>
          s.contributorCount ? s.totalHours / s.contributorCount : 0
        );
        const maxH = Math.max(...hPerCont);
        const minH = Math.min(...hPerCont);
        if (maxH > 0 && minH > 0 && maxH / minH > 2.5) {
          insights.push('Hours per contributor vary strongly between sessions — check team composition or allocation consistency.');
        }
      }

      const allNames = sessions.flatMap((s) => s.projectNames).sort();
      const displayBase = allNames[0] ? stripSessionForDisplay(allNames[0]) : baseKey;

      groups.push({
        baseKey,
        displayBase,
        sessionCount: distinctSessions.length,
        sessions,
        chartBySession,
        flags,
        insights
      });
    }

    groups.sort((a, b) => {
      const ha = a.sessions.reduce((s, x) => s + x.totalHours, 0);
      const hb = b.sessions.reduce((s, x) => s + x.totalHours, 0);
      return hb - ha;
    });

    res.json({
      summary: {
        groupsReturned: groups.length,
        minSessions,
        note: 'Books are matched by stripping trailing academic year tokens (e.g. -25-26, _26-27) from project_name.'
      },
      groups
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Night work deep analytics (work_mode = Night, case-insensitive)
app.get('/api/dashboard/night-analytics', async (req, res) => {
  try {
    let baseWhere = applyProjectTokenFilters(buildWhereClause(req), req);
    const rawProj = req.query.project_name;
    const projList = rawProj == null ? [] : Array.isArray(rawProj) ? rawProj : [rawProj];
    const projFiltered = projList.map((p) => String(p).trim()).filter((p) => p && p !== 'All');
    if (projFiltered.length) {
      baseWhere = { ...baseWhere, project_name: { in: projFiltered } };
    }
    const nightWhere = {
      ...baseWhere,
      work_mode: { equals: 'night', mode: 'insensitive' }
    };

    const dayModes = ['WFH', 'In Office', 'OT Office', 'OT Home', 'On Duty', 'Half Day'];
    const dayWhere = {
      ...baseWhere,
      work_mode: { in: dayModes }
    };

    const [
      nightRows,
      nightByProject,
      nightByName,
      nightByTeam,
      nightByTask,
      totalsAll,
      totalsNightAgg,
      dayTaskAgg
    ] = await Promise.all([
      prisma.masterDatabase.findMany({
        where: nightWhere,
        select: {
          name: true,
          team: true,
          project_name: true,
          task_name: true,
          book_element: true,
          hours_spent: true,
          number_of_units: true,
          date: true,
          submitted_at: true,
          work_mode: true
        }
      }),
      prisma.masterDatabase.groupBy({
        by: ['project_name'],
        where: { ...nightWhere, project_name: { not: null, notIn: ['', ' '] } },
        _sum: { hours_spent: true, number_of_units: true },
        _count: true
      }),
      prisma.masterDatabase.groupBy({
        by: ['name', 'team'],
        where: nightWhere,
        _sum: { hours_spent: true, number_of_units: true },
        _count: true
      }),
      prisma.masterDatabase.groupBy({
        by: ['team'],
        where: nightWhere,
        _sum: { hours_spent: true, number_of_units: true },
        _count: true
      }),
      prisma.masterDatabase.groupBy({
        by: ['task_name'],
        where: nightWhere,
        _sum: { hours_spent: true, number_of_units: true },
        _count: true
      }),
      prisma.masterDatabase.aggregate({
        where: baseWhere,
        _sum: { hours_spent: true, number_of_units: true }
      }),
      prisma.masterDatabase.aggregate({
        where: nightWhere,
        _sum: { hours_spent: true, number_of_units: true }
      }),
      prisma.masterDatabase.groupBy({
        by: ['task_name'],
        where: dayWhere,
        _sum: { hours_spent: true, number_of_units: true },
        _count: true
      })
    ]);

    const totalNightEntries = await prisma.masterDatabase.count({ where: nightWhere });

    const totalAllHours = totalsAll._sum.hours_spent || 0;
    const totalNightHours = totalsNightAgg._sum.hours_spent || 0;
    const totalNightUnits = totalsNightAgg._sum.number_of_units || 0;

    const byUserAll = await prisma.masterDatabase.groupBy({
      by: ['name'],
      where: baseWhere,
      _sum: { hours_spent: true }
    });
    const allHoursByName = {};
    byUserAll.forEach((r) => {
      allHoursByName[r.name] = r._sum.hours_spent || 0;
    });

    const contributorNight = nightByName
      .map((r) => {
        const nh = r._sum.hours_spent || 0;
        const ah = allHoursByName[r.name] || nh;
        const pct = ah > 0 ? (nh / ah) * 100 : 0;
        return {
          name: r.name,
          team: r.team,
          nightHours: Math.round(nh * 100) / 100,
          nightEntries: r._count,
          nightUnits: r._sum.number_of_units || 0,
          totalHoursAllModes: Math.round(ah * 100) / 100,
          nightPercentOfOwnHours: Math.round(pct * 10) / 10,
          unitsPerHour:
            nh > 0 ? Math.round(((r._sum.number_of_units || 0) / nh) * 1000) / 1000 : null
        };
      })
      .sort((a, b) => b.nightHours - a.nightHours);

    const hourlyBuckets = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0, hours: 0 }));
    const dowBuckets = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ].map((d) => ({ day: d, hours: 0, entries: 0 }));
    const timelineByDate = {};
    const elementByNight = {};
    const weeklyByNight = {};

    for (const r of nightRows) {
      const hrs = Number(r.hours_spent) || 0;
      const el =
        r.book_element != null && String(r.book_element).trim()
          ? String(r.book_element).trim()
          : 'Miscellaneous';
      if (!elementByNight[el]) {
        elementByNight[el] = { element: el, hours: 0, entries: 0, units: 0 };
      }
      elementByNight[el].hours += hrs;
      elementByNight[el].entries += 1;
      elementByNight[el].units += Number(r.number_of_units) || 0;

      const ts = r.submitted_at || r.date;
      if (ts) {
        const d = new Date(ts);
        const h = d.getHours();
        hourlyBuckets[h].count += 1;
        hourlyBuckets[h].hours += hrs;
        const dow = d.getDay();
        dowBuckets[dow].hours += hrs;
        dowBuckets[dow].entries += 1;
      }
      if (r.date) {
        const key = r.date.toISOString().slice(0, 10);
        if (!timelineByDate[key]) timelineByDate[key] = { date: key, hours: 0, entries: 0 };
        timelineByDate[key].hours += hrs;
        timelineByDate[key].entries += 1;

        const [y, mo, da] = key.split('-').map(Number);
        const dt = new Date(y, (mo || 1) - 1, da || 1);
        const day = dt.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        dt.setDate(dt.getDate() + diff);
        const weekKey = dt.toISOString().slice(0, 10);
        if (!weeklyByNight[weekKey]) {
          weeklyByNight[weekKey] = { weekStart: weekKey, hours: 0, entries: 0 };
        }
        weeklyByNight[weekKey].hours += hrs;
        weeklyByNight[weekKey].entries += 1;
      }
    }

    const nightTimeline = Object.values(timelineByDate).sort((a, b) => a.date.localeCompare(b.date));

    const elementNight = Object.values(elementByNight)
      .map((e) => ({
        element: e.element,
        hours: Math.round(e.hours * 100) / 100,
        entries: e.entries,
        units: e.units
      }))
      .sort((a, b) => b.hours - a.hours);

    const weeklyNight = Object.values(weeklyByNight)
      .map((w) => ({
        weekStart: w.weekStart,
        hours: Math.round(w.hours * 100) / 100,
        entries: w.entries
      }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    const projectsNight = nightByProject
      .map((p) => {
        const h = p._sum.hours_spent || 0;
        const u = p._sum.number_of_units || 0;
        return {
          project_name: p.project_name,
          hours: Math.round(h * 100) / 100,
          entries: p._count,
          units: u,
          unitsPerHour: h > 0 ? Math.round((u / h) * 1000) / 1000 : null
        };
      })
      .sort((a, b) => b.hours - a.hours);

    const taskNight = nightByTask
      .map((t) => ({
        task: t.task_name || 'Unspecified',
        hours: Math.round((t._sum.hours_spent || 0) * 100) / 100,
        entries: t._count,
        units: t._sum.number_of_units || 0
      }))
      .sort((a, b) => b.hours - a.hours);

    const dayTaskMap = {};
    dayTaskAgg.forEach((t) => {
      dayTaskMap[(t.task_name || 'Unspecified').toLowerCase()] = {
        hours: t._sum.hours_spent || 0,
        units: t._sum.number_of_units || 0,
        entries: t._count
      };
    });

    const nightVsDayByTask = taskNight.slice(0, 25).map((t) => {
      const d = dayTaskMap[t.task.toLowerCase()] || { hours: 0, units: 0, entries: 0 };
      const ratio = d.hours > 0 ? t.hours / d.hours : null;
      return {
        task: t.task,
        nightHours: t.hours,
        dayHours: Math.round(d.hours * 100) / 100,
        nightToDayHourRatio: ratio != null ? Math.round(ratio * 1000) / 1000 : null
      };
    });

    const teamNight = nightByTeam
      .map((t) => ({
        team: t.team,
        hours: Math.round((t._sum.hours_spent || 0) * 100) / 100,
        entries: t._count,
        units: t._sum.number_of_units || 0
      }))
      .sort((a, b) => b.hours - a.hours);

    const nightShareGlobal = totalAllHours > 0 ? (totalNightHours / totalAllHours) * 100 : 0;

    const anomalies = [];
    contributorNight.slice(0, 40).forEach((c) => {
      if (c.nightPercentOfOwnHours >= 45 && c.totalHoursAllModes >= 20) {
        anomalies.push({
          type: 'heavy_night_contributor',
          entity: c.name,
          detail: `${c.nightPercentOfOwnHours}% of logged hours are Night mode (${c.nightHours}h / ${c.totalHoursAllModes}h).`
        });
      }
    });
    if (totalNightHours > 0) {
      projectsNight.slice(0, 8).forEach((p) => {
        const share = (p.hours / totalNightHours) * 100;
        if (share >= 12 && p.hours >= 8) {
          anomalies.push({
            type: 'night_reliant_project',
            entity: p.project_name,
            detail: `About ${share.toFixed(0)}% of all night hours in this filter (${p.hours.toFixed(1)}h) — disproportionate night reliance.`
          });
        }
      });
    }
    const topAnomalies = anomalies.slice(0, 25);

    const peakHourBucket = hourlyBuckets.reduce(
      (best, b) => ((b.hours || 0) > (best?.hours || 0) ? b : best),
      hourlyBuckets[0]
    );
    const busiestDowBucket = dowBuckets.reduce(
      (best, b) => ((b.hours || 0) > (best?.hours || 0) ? b : best),
      dowBuckets[0]
    );

    const summary = {
      totalNightHours: Math.round(totalNightHours * 100) / 100,
      totalNightEntries: totalNightEntries,
      totalNightUnits,
      uniqueNightContributors: contributorNight.length,
      nightPercentOfFilteredHours: Math.round(nightShareGlobal * 10) / 10,
      avgHoursPerNightEntry:
        totalNightEntries > 0 ? Math.round((totalNightHours / totalNightEntries) * 100) / 100 : 0,
      globalUnitsPerNightHour:
        totalNightHours > 0 ? Math.round((totalNightUnits / totalNightHours) * 1000) / 1000 : null,
      peakNightHour: peakHourBucket?.hour ?? null,
      peakNightHourLabel:
        peakHourBucket != null && peakHourBucket.hour != null
          ? `${peakHourBucket.hour}:00`
          : '—',
      busiestWeekday: busiestDowBucket?.day ?? '—'
    };

    const nightProjectShare = projectsNight.slice(0, 15).map((p) => ({
      name: p.project_name.length > 42 ? `${p.project_name.slice(0, 40)}…` : p.project_name,
      fullName: p.project_name,
      value: p.hours,
      nightPercentOfNightTotal: totalNightHours > 0 ? Math.round((p.hours / totalNightHours) * 1000) / 10 : 0
    }));

    const nightTaskShare = taskNight.slice(0, 12).map((t) => ({
      name: t.task.length > 36 ? `${t.task.slice(0, 34)}…` : t.task,
      fullName: t.task,
      value: t.hours,
      entries: t.entries,
      nightPercentOfNightTotal:
        totalNightHours > 0 ? Math.round((t.hours / totalNightHours) * 1000) / 10 : 0
    }));

    const teamNightShare = teamNight.slice(0, 10).map((t) => ({
      name: t.team.length > 28 ? `${t.team.slice(0, 26)}…` : t.team,
      fullName: t.team,
      value: t.hours,
      entries: t.entries,
      nightPercentOfNightTotal:
        totalNightHours > 0 ? Math.round((t.hours / totalNightHours) * 1000) / 10 : 0
    }));

    res.json({
      summary,
      contributorNight,
      projectsNight,
      teamNight,
      taskNight,
      elementNight,
      weeklyNight,
      hourlyBuckets,
      dowBuckets,
      nightTimeline,
      nightVsDayByTask,
      nightProjectShare,
      nightTaskShare,
      teamNightShare,
      anomalies: topAnomalies
    });
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

// Per worklog slice: hours + units (for time-per-unit box plots by task)
app.get('/api/dashboard/employee-task-rate-samples', async (req, res) => {
  try {
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['name', 'task_name', 'project_name', 'chapter_number', 'date'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        name: { notIn: ['', ' '] },
        task_name: { not: null, notIn: ['', ' '] },
        date: { not: null },
      },
    });
    res.json(
      rows
        .map((r) => ({
          employee: r.name,
          task: r.task_name,
          project: r.project_name,
          chapter: r.chapter_number,
          date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
          hours: Number(r._sum.hours_spent) || 0,
          units: Number(r._sum.number_of_units) || 0,
        }))
        .filter((r) => r.hours > 0 && r.units > 0)
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employee × task (overall analytics: stacked bars + heatmap)
app.get('/api/dashboard/employee-task-breakdown', async (req, res) => {
  try {
    // Include project-name token filters (segment/class/series) so cards update together
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['team', 'name', 'task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        name: { notIn: ['', ' '] },
        task_name: { not: null, notIn: ['', ' '] }
      }
    });
    res.json(
      rows.map((r) => ({
        team: r.team,
        employee: r.name,
        task: r.task_name,
        hours: r._sum.hours_spent || 0,
        units: r._sum.number_of_units || 0
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project × task (treemap: project effort distribution)
app.get('/api/dashboard/project-task-effort', async (req, res) => {
  try {
    // Include project-name token filters (segment/class/series)
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] },
        task_name: { not: null, notIn: ['', ' '] }
      }
    });
    res.json(
      rows.map((r) => ({
        project_name: r.project_name,
        task_name: r.task_name,
        hours: r._sum.hours_spent || 0,
        units: r._sum.number_of_units || 0
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project × employee (stacked bar)
app.get('/api/dashboard/project-employee-breakdown', async (req, res) => {
  try {
    // Include project-name token filters (segment/class/series)
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] },
        name: { notIn: ['', ' '] }
      }
    });
    const taskRows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'name', 'task_name'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] },
        name: { notIn: ['', ' '] },
        task_name: { not: null, notIn: ['', ' '] }
      }
    });
    const taskMap = new Map();
    for (const tr of taskRows) {
      const k = `${tr.project_name}\t${tr.name}`;
      const arr = taskMap.get(k) || [];
      arr.push({
        task: tr.task_name,
        hours: tr._sum.hours_spent || 0
      });
      taskMap.set(k, arr);
    }
    for (const [, arr] of taskMap) {
      arr.sort((a, b) => b.hours - a.hours);
    }
    res.json(
      rows.map((r) => ({
        project_name: r.project_name,
        employee: r.name,
        hours: r._sum.hours_spent || 0,
        units: r._sum.number_of_units || 0,
        task_breakdown: taskMap.get(`${r.project_name}\t${r.name}`) || []
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employee performance trend (date × employee)
app.get('/api/dashboard/employee-performance-over-time', async (req, res) => {
  try {
    // Include project-name token filters (segment/class/series)
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['date', 'name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        date: { not: null },
        name: { notIn: ['', ' '] }
      },
      orderBy: [{ date: 'asc' }, { name: 'asc' }]
    });

    res.json(
      rows.map((r) => {
        const hours = r._sum.hours_spent || 0;
        const units = r._sum.number_of_units || 0;
        const productivity = hours > 0 ? units / hours : 0;
        const d = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
        return {
          date: d,
          employee: r.name,
          hours,
          units,
          productivity
        };
      })
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** Split composite chapter_number values (e.g. "3, 8") into individual chapter tokens. */
function parseChapterNumberTokens(raw) {
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

function addHoursToChapterBucket(chaptersObj, chapterRaw, hours) {
  const h = Number(hours) || 0;
  if (h <= 0) return;
  const tokens = parseChapterNumberTokens(chapterRaw);
  if (!tokens.length) {
    chaptersObj['—'] = (chaptersObj['—'] || 0) + h;
    return;
  }
  const share = h / tokens.length;
  for (const t of tokens) {
    chaptersObj[t] = (chaptersObj[t] || 0) + share;
  }
}

// Project Gantt rows (project x employee x date with task-hour breakdown + chapter split)
app.get('/api/dashboard/project-gantt', async (req, res) => {
  try {
    // Include project-name token filters (segment/class/series)
    const where = applyProjectTokenFilters(buildWhereClause(req), req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'name', 'date', 'task_name', 'chapter_number'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] },
        name: { notIn: ['', ' '] }
      },
      orderBy: [{ project_name: 'asc' }, { date: 'asc' }, { name: 'asc' }]
    });

    const byDay = new Map();
    for (const r of rows) {
      const dateStr = r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10);
      const key = `${r.project_name}\t${r.name}\t${dateStr}`;
      if (!byDay.has(key)) {
        byDay.set(key, {
          project: r.project_name,
          employee: r.name,
          date: dateStr,
          hours: 0,
          tasks: {}
        });
      }
      const row = byDay.get(key);
      const h = Number(r?._sum?.hours_spent) || 0;
      row.hours += h;
      const taskName = String(r.task_name || 'Unspecified');
      const chRaw =
        r.chapter_number != null && String(r.chapter_number).trim()
          ? String(r.chapter_number).trim()
          : '—';
      if (!row.tasks[taskName]) {
        row.tasks[taskName] = { hours: 0, chapters: {} };
      }
      const t = row.tasks[taskName];
      t.hours += h;
      addHoursToChapterBucket(t.chapters, chRaw, h);
    }

    const payload = Array.from(byDay.values()).map((r) => ({
      project: r.project,
      employee: r.employee,
      date: r.date,
      hours: r.hours,
      tasks: Object.entries(r.tasks || {})
        .map(([task, v]) => ({
          task,
          hours: v.hours,
          chapters: Object.entries(v.chapters || {})
            .sort((a, b) => (b[1] || 0) - (a[1] || 0))
            .map(([chapter, hours]) => ({
              chapter: chapter === '—' ? null : chapter,
              hours: Number(hours) || 0
            }))
        }))
        .sort((a, b) => (b.hours || 0) - (a.hours || 0))
    }));

    payload.sort((a, b) => {
      if (a.project !== b.project) return String(a.project).localeCompare(String(b.project));
      if (a.date !== b.date) return String(a.date).localeCompare(String(b.date));
      return String(a.employee).localeCompare(String(b.employee));
    });

    res.json(payload);
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

  const normalizeQueryValues = (input) => {
    if (Array.isArray(input)) {
      return input
        .map(v => String(v || '').trim())
        .filter(v => v && v !== 'All');
    }
    const single = String(input || '').trim();
    return single && single !== 'All' ? [single] : [];
  };

  const projectNames = normalizeQueryValues(req.query.project_name);
  if (projectNames.length === 1) {
    where.project_name = projectNames[0];
  } else if (projectNames.length > 1) {
    where.project_name = { in: projectNames };
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

  // Keep project-view cards in sync with top filters:
  // segment / class / series should affect timeline, gantt, heatmap, insights too.
  applyProjectTokenFilters(where, req);

  return where;
}

// Filter: distinct project names (respects team/employee/period only; NO segment/class/series)
app.get('/api/dashboard/project-view/filter/project-names', async (req, res) => {
  try {
    const where = buildWhereClause(req);
    // Do NOT apply segment/class/series filters here; fetch ALL project names
    // so frontend can derive conditional options from the full list
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
    let result = Object.values(projectMap)
      .map(p => ({
        ...p,
        tasks: p.tasks.sort((a, b) => b.hours - a.hours)
      }))
      ;

    // Additional strict filtering by segment/class/series from query params.
    // Use tokenized matching on project_name to avoid loose substring matches.
    const matchProjectTokens = (projName) => {
      if (!projName) return false;
      const tokens = projName.split('_').map(t => t.trim()).filter(Boolean);
      // segment -> token[0]
      if (req.query.segment && req.query.segment !== 'All') {
        if (tokens[0] !== req.query.segment) return false;
      }
      // class -> token[1]
      if (req.query.class && req.query.class !== 'All') {
        if (tokens[1] !== req.query.class) return false;
      }
      // series -> exact token match (same extraction as project-view UI; avoids SureS matching SureS_WB via substring)
      const seriesVals = normalizeSeriesQueryList(req);
      if (seriesVals.length > 0 && !projectMatchesSeriesSelection(projName, seriesVals)) return false;
      return true;
    };

    // filter using the stricter token matcher
    result = result.filter(p => matchProjectTokens(p.name));

    // sort by total hours; return all matched projects so frontend scroll can show full list
    result = result.sort((a, b) => b.totalHours - a.totalHours);

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
    let periodStartDate = null;
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
      if (startDate) {
        periodStartDate = new Date(startDate);
        periodStartDate.setHours(0, 0, 0, 0);
        dateFilter = { gte: periodStartDate };
      }
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

    // For period-based timeline, include missing dates as zero rows so full range is visible.
    if (periodStartDate) {
      const endDate = new Date();
      endDate.setHours(0, 0, 0, 0);
      const cursor = new Date(periodStartDate);
      while (cursor <= endDate) {
        const dateKey = cursor.toISOString().split('T')[0];
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { date: dateKey };
          allTasks.forEach(t => { dateMap[dateKey][t] = 0; });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    const timeline = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    res.json({ timeline, tasks: allTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Gantt: day-level rows for selected project(s) — task × employee hours (same filters as timeline)
app.get('/api/dashboard/project-view/gantt', async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);

    let dateFilter = {};
    let periodStartDate = null;
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
      if (startDate) {
        periodStartDate = new Date(startDate);
        periodStartDate.setHours(0, 0, 0, 0);
        dateFilter = { gte: periodStartDate };
      }
    }

    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'date', 'task_name', 'name', 'chapter_number'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        date: { ...dateFilter, not: null },
        name: { notIn: ['', ' '] }
      },
      orderBy: [{ date: 'asc' }, { project_name: 'asc' }, { task_name: 'asc' }, { name: 'asc' }]
    });

    const payload = rows.map((r) => ({
      project_name: r.project_name,
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
      task_name: r.task_name && String(r.task_name).trim() ? r.task_name : 'Unspecified',
      employee: r.name && String(r.name).trim() ? r.name : 'Unassigned',
      chapter_number:
        r.chapter_number != null && String(r.chapter_number).trim()
          ? String(r.chapter_number).trim()
          : null,
      hours: Number(r._sum?.hours_spent) || 0,
      units: Number(r._sum?.number_of_units) || 0
    })).filter((x) => x.hours > 0);

    const seriesVals = normalizeSeriesQueryList(req);
    const payloadFiltered =
      seriesVals.length > 0 ? payload.filter((x) => projectMatchesSeriesSelection(x.project_name, seriesVals)) : payload;

    res.json(payloadFiltered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Deep Dive: employee contribution + task ownership breakdown for one project
app.get('/api/dashboard/project-view/project-insights', async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);
    const selectedProjects = Array.isArray(req.query.project_name)
      ? req.query.project_name.filter(p => p && p !== 'All')
      : (req.query.project_name && req.query.project_name !== 'All' ? [req.query.project_name] : []);

    if (selectedProjects.length === 0) {
      return res.status(400).json({ error: 'project_name is required' });
    }

    const records = await prisma.masterDatabase.findMany({
      where: {
        ...where
      },
      select: {
        project_name: true,
        name: true,
        task_name: true,
        book_element: true,
        chapter_number: true,
        hours_spent: true,
        number_of_units: true,
        date: true
      }
    });

    const employeeMap = {};
    const taskMap = {};
    const projectMap = {};
    const dateHoursMap = {};
    const employeeDayHoursMap = {};
    const projectDateMap = {};
    let totalHours = 0;
    let totalUnits = 0;
    let minDate = null;
    let maxDate = null;

    records.forEach((r) => {
      const project = (r.project_name || 'Unspecified').trim();
      const employee = (r.name || 'Unassigned').trim();
      const task = (r.task_name || 'Unspecified').trim();
      const bookElement = (r.book_element || '').trim();
      const chapter = (r.chapter_number || '').trim();
      const hours = r.hours_spent || 0;
      const units = r.number_of_units || 0;
      const dateKey = r.date
        ? (r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10))
        : null;

      totalHours += hours;
      totalUnits += units;

      if (dateKey) {
        dateHoursMap[dateKey] = (dateHoursMap[dateKey] || 0) + hours;
        const empDateKey = `${employee}__${dateKey}`;
        employeeDayHoursMap[empDateKey] = (employeeDayHoursMap[empDateKey] || 0) + hours;

        if (!projectDateMap[project]) projectDateMap[project] = new Set();
        projectDateMap[project].add(dateKey);

        const d = new Date(dateKey);
        if (!minDate || d < minDate) minDate = d;
        if (!maxDate || d > maxDate) maxDate = d;
      }

      if (!projectMap[project]) {
        projectMap[project] = { project, hours: 0, units: 0, taskCount: 0 };
      }
      projectMap[project].hours += hours;
      projectMap[project].units += units;

      if (!employeeMap[employee]) {
        employeeMap[employee] = {
          employee,
          hours: 0,
          units: 0,
          taskCount: 0,
          activeDays: new Set(),
          projects: new Set()
        };
      }
      employeeMap[employee].hours += hours;
      employeeMap[employee].units += units;
      if (dateKey) employeeMap[employee].activeDays.add(dateKey);
      employeeMap[employee].projects.add(project);

      if (!taskMap[task]) {
        taskMap[task] = {
          task,
          totalHours: 0,
          totalUnits: 0,
          employeeHours: {},
          projects: new Set(),
          elementHours: {},
          chapterHours: {},
          ownerContext: {}
        };
      }
      taskMap[task].totalHours += hours;
      taskMap[task].totalUnits += units;
      taskMap[task].employeeHours[employee] = (taskMap[task].employeeHours[employee] || 0) + hours;
      taskMap[task].projects.add(project);
      if (bookElement) taskMap[task].elementHours[bookElement] = (taskMap[task].elementHours[bookElement] || 0) + hours;
      if (chapter) taskMap[task].chapterHours[chapter] = (taskMap[task].chapterHours[chapter] || 0) + hours;
      if (!taskMap[task].ownerContext[employee]) {
        taskMap[task].ownerContext[employee] = { chapterHours: {}, elementHours: {} };
      }
      if (bookElement) {
        const elementMap = taskMap[task].ownerContext[employee].elementHours;
        elementMap[bookElement] = (elementMap[bookElement] || 0) + hours;
      }
      if (chapter) {
        const chapterMap = taskMap[task].ownerContext[employee].chapterHours;
        chapterMap[chapter] = (chapterMap[chapter] || 0) + hours;
      }
    });

    const taskBreakdown = Object.values(taskMap).map((taskEntry) => {
      const owners = Object.entries(taskEntry.employeeHours)
        .map(([employee, hours]) => ({ employee, hours }))
        .sort((a, b) => b.hours - a.hours);

      owners.forEach((owner) => {
        if (employeeMap[owner.employee]) {
          employeeMap[owner.employee].taskCount += 1;
        }
      });

      const topElements = Object.entries(taskEntry.elementHours || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, hours]) => ({ name, hours }));
      const topChapters = Object.entries(taskEntry.chapterHours || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, hours]) => ({ name, hours }));
      const ownerContext = Object.entries(taskEntry.ownerContext || {})
        .map(([employee, ctx]) => {
          const ownerTopChapters = Object.entries(ctx.chapterHours || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([name, hours]) => ({ name, hours }));
          const ownerTopElements = Object.entries(ctx.elementHours || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([name, hours]) => ({ name, hours }));
          return {
            employee,
            hours: taskEntry.employeeHours[employee] || 0,
            topChapters: ownerTopChapters,
            topElements: ownerTopElements
          };
        })
        .sort((a, b) => b.hours - a.hours);

      return {
        task: taskEntry.task,
        totalHours: taskEntry.totalHours,
        totalUnits: taskEntry.totalUnits,
        primaryOwner: owners[0]?.employee || 'Unassigned',
        projectCount: taskEntry.projects ? taskEntry.projects.size : 1,
        primaryOwnerSharePct: taskEntry.totalHours > 0 ? ((owners[0]?.hours || 0) / taskEntry.totalHours) * 100 : 0,
        collaborationCount: owners.length,
        topElement: topElements[0]?.name || '-',
        topChapter: topChapters[0]?.name || '-',
        topElements,
        topChapters,
        ownerContext,
        owners
      };
    }).sort((a, b) => b.totalHours - a.totalHours);

    const employeeContribution = Object.values(employeeMap)
      .map((entry) => ({
        employee: entry.employee,
        hours: entry.hours,
        units: entry.units,
        taskCount: entry.taskCount,
        activeDays: entry.activeDays.size,
        avgHoursPerActiveDay: entry.activeDays.size > 0 ? entry.hours / entry.activeDays.size : 0,
        unitsPerHour: entry.hours > 0 ? entry.units / entry.hours : 0,
        projectCount: entry.projects.size,
        contributionPct: totalHours > 0 ? (entry.hours / totalHours) * 100 : 0
      }))
      .sort((a, b) => b.hours - a.hours);

    const projectBreakdown = Object.values(projectMap)
      .map((entry) => ({
        ...entry,
        contributionPct: totalHours > 0 ? (entry.hours / totalHours) * 100 : 0,
        activeDays: projectDateMap[entry.project] ? projectDateMap[entry.project].size : 0,
        avgHoursPerActiveDay: projectDateMap[entry.project] && projectDateMap[entry.project].size > 0
          ? entry.hours / projectDateMap[entry.project].size
          : 0
      }))
      .sort((a, b) => b.hours - a.hours);

    const activeDateKeys = Object.keys(dateHoursMap).sort((a, b) => a.localeCompare(b));
    const totalActiveDays = activeDateKeys.length;
    const avgHoursPerActiveDay = totalActiveDays > 0 ? totalHours / totalActiveDays : 0;
    const unitsPerHour = totalHours > 0 ? totalUnits / totalHours : 0;

    let peakDay = { date: '-', hours: 0 };
    let lowDay = { date: '-', hours: 0 };
    if (activeDateKeys.length > 0) {
      peakDay = activeDateKeys
        .map((date) => ({ date, hours: dateHoursMap[date] || 0 }))
        .sort((a, b) => b.hours - a.hours)[0];
      lowDay = activeDateKeys
        .map((date) => ({ date, hours: dateHoursMap[date] || 0 }))
        .sort((a, b) => a.hours - b.hours)[0];
    }

    const spanDays = minDate && maxDate
      ? Math.max(1, Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1)
      : totalActiveDays;
    const activityRatePct = spanDays > 0 ? (totalActiveDays / spanDays) * 100 : 0;

    const dailySeries = activeDateKeys.map((date) => ({ date, hours: dateHoursMap[date] || 0 }));
    const recentWindow = dailySeries.slice(-7);
    const previousWindow = dailySeries.slice(Math.max(0, dailySeries.length - 14), Math.max(0, dailySeries.length - 7));
    const recent7DayHours = recentWindow.reduce((sum, d) => sum + d.hours, 0);
    const previous7DayHours = previousWindow.reduce((sum, d) => sum + d.hours, 0);
    const velocityTrendPct = previous7DayHours > 0
      ? ((recent7DayHours - previous7DayHours) / previous7DayHours) * 100
      : 0;

    const topThreeTaskSharePct = (() => {
      const top3 = taskBreakdown.slice(0, 3).reduce((sum, t) => sum + t.totalHours, 0);
      return totalHours > 0 ? (top3 / totalHours) * 100 : 0;
    })();
    const topContributorSharePct = employeeContribution[0]?.contributionPct || 0;
    const highlyOwnedTasksPct = taskBreakdown.length > 0
      ? (taskBreakdown.filter(t => t.primaryOwnerSharePct >= 80).length / taskBreakdown.length) * 100
      : 0;

    const riskFlags = [];
    if (topContributorSharePct > 45) riskFlags.push('High dependency on one contributor');
    if (topThreeTaskSharePct > 75) riskFlags.push('Task concentration is high (top 3 tasks dominate effort)');
    if (activityRatePct < 35) riskFlags.push('Low activity density across the selected date range');
    if (previous7DayHours > 0 && velocityTrendPct < -20) riskFlags.push('Recent 7-day velocity has dropped significantly');
    if (highlyOwnedTasksPct > 60) riskFlags.push('Many tasks rely on a single owner (low collaboration)');

    const insights = {
      health: {
        activeDays: totalActiveDays,
        spanDays,
        activityRatePct,
        avgHoursPerActiveDay,
        unitsPerHour,
        peakDay,
        lowDay,
        recent7DayHours,
        previous7DayHours,
        velocityTrendPct
      },
      concentration: {
        topThreeTaskSharePct,
        topContributorSharePct,
        highlyOwnedTasksPct
      },
      topContributors: employeeContribution.slice(0, 3),
      bottomContributors: employeeContribution.slice(-3).reverse(),
      riskFlags
    };

    res.json({
      projectName: selectedProjects.length === 1 ? selectedProjects[0] : 'All Selected Projects',
      selectedProjects,
      isMultiProject: selectedProjects.length > 1,
      summary: {
        totalHours,
        totalUnits,
        totalProjects: projectBreakdown.length,
        totalEmployees: employeeContribution.length,
        totalTasks: taskBreakdown.length
      },
      projectBreakdown,
      employeeContribution,
      taskBreakdown,
      insights
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});

async function shutdown(signal) {
  try {
    await prisma.$disconnect();
  } catch {
    /* ignore */
  }
  server.close(() => process.exit(signal === 'SIGTERM' ? 0 : 0));
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));



























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