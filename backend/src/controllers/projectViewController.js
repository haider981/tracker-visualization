const prisma = require('../config/prisma');
const { buildWhereClause, buildProjectViewWhere } = require('../utils/queryBuilder');
const { projectMatchesSeriesSelection } = require('../utils/projectSeriesToken');

function seriesValsFromReq(req) {
  const q = req.query.series;
  if (q == null || q === '' || q === 'All') return [];
  const arr = Array.isArray(q) ? q : [q];
  return arr.map((s) => String(s || '').trim()).filter((s) => s && s !== 'All');
}

exports.getTeams = async (req, res) => {
  try {
    const teams = await prisma.masterDatabase.findMany({
      distinct: ['team'],
      select: { team: true },
      orderBy: { team: 'asc' }
    });

    res.json(teams.map(t => t.team).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { team, search } = req.query;
    const where = {};

    if (team && team !== 'All') where.team = team;
    if (search && search.trim()) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const employees = await prisma.masterDatabase.findMany({
      distinct: ['name'],
      select: { name: true },
      where,
      orderBy: { name: 'asc' }
    });

    res.json(employees.map(e => e.name).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ======================================================
   FILTER: Project Names
====================================================== */
exports.getProjectNames = async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.project_name = {
      notIn: ['', ' ', 'blank', 'Blank', 'BLANK']
    };

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
};

/* ======================================================
   FILTER: Task Names
====================================================== */
exports.getTasksFilter = async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.task_name = { notIn: ['', ' '] };

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
};

/* ======================================================
   FILTER: Book Elements
====================================================== */
exports.getElementsFilter = async (req, res) => {
  try {
    const where = buildWhereClause(req);
    where.book_element = { notIn: ['', ' '] };

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
};

/* ======================================================
   PROJECT VIEW: Projects with Tasks (Top 10)
====================================================== */
exports.getProjects = async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);

    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        project_name: { notIn: ['', ' '] },
        task_name: { notIn: ['', ' '] }
      }
    });

    const projectMap = {};

    rows.forEach(r => {
      const project = r.project_name || 'Unspecified';

      if (!projectMap[project]) {
        projectMap[project] = {
          name: project,
          totalHours: 0,
          totalUnits: 0,
          tasks: []
        };
      }

      const hours = r._sum.hours_spent || 0;
      const units = r._sum.number_of_units || 0;

      projectMap[project].totalHours += hours;
      projectMap[project].totalUnits += units;
      projectMap[project].tasks.push({
        task: r.task_name || 'Unspecified',
        hours,
        units
      });
    });

    const result = Object.values(projectMap)
      .map(p => ({
        ...p,
        tasks: p.tasks.sort((a, b) => b.hours - a.hours)
      }))
      .filter((p) => projectMatchesSeriesSelection(p.name, seriesValsFromReq(req)))
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ======================================================
   PROJECT VIEW: Timeline for Selected Project
====================================================== */
exports.getTimeline = async (req, res) => {
  try {
    const where = buildProjectViewWhere(req);

    let dateFilter = {};
    if (req.query.period && req.query.period !== 'All') {
      const now = new Date();
      let startDate;

      switch (req.query.period) {
        case 'Last 7 Days':   startDate = new Date(now.setDate(now.getDate() - 7)); break;
        case 'Last 30 Days':  startDate = new Date(now.setDate(now.getDate() - 30)); break;
        case 'Last 3 Months': startDate = new Date(now.setMonth(now.getMonth() - 3)); break;
        case 'Last 6 Months': startDate = new Date(now.setMonth(now.getMonth() - 6)); break;
        case 'Last Year':     startDate = new Date(now.setMonth(now.getMonth() - 12)); break;
        case 'This Year':     startDate = new Date(new Date().getFullYear(), 0, 1); break;
      }

      if (startDate) dateFilter = { gte: startDate };
    }

    const records = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        date: { ...dateFilter }
      },
      select: {
        date: true,
        task_name: true,
        hours_spent: true
      },
      orderBy: { date: 'asc' }
    });

    const allTasks = [...new Set(records.map(r => r.task_name).filter(Boolean))];
    const dateMap = {};

    records.forEach(r => {
      if (!r.date) return;

      const dateKey = r.date.toISOString().slice(0, 10);

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey };
        allTasks.forEach(t => (dateMap[dateKey][t] = 0));
      }

      const task = r.task_name || 'Unspecified';
      dateMap[dateKey][task] += r.hours_spent || 0;
    });

    const timeline = Object.values(dateMap).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    res.json({ timeline, tasks: allTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
