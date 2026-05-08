// // src/controllers/dashboardController.js

// const prisma = require('../config/prisma');
// const { buildWhereClause } = require('../utils/queryBuilder');

// /* ================= FILTERS ================= */

// exports.getTeams = async (req, res) => {
//   try {
//     const teams = await prisma.masterDatabase.findMany({
//       distinct: ['team'],
//       select: { team: true },
//       orderBy: { team: 'asc' }
//     });

//     res.json(teams.map(t => t.team).filter(Boolean));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getEmployees = async (req, res) => {
//   try {
//     const { team, search } = req.query;
//     const where = {};

//     if (team && team !== 'All') where.team = team;
//     if (search && search.trim() !== '') {
//       where.name = { contains: search, mode: 'insensitive' };
//     }

//     const employees = await prisma.masterDatabase.findMany({
//       distinct: ['name'],
//       select: { name: true },
//       where,
//       orderBy: { name: 'asc' }
//     });

//     res.json(employees.map(e => e.name).filter(Boolean));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= OVERVIEW ================= */

// exports.getOverview = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const [projects, employees, hours, tasks] = await Promise.all([
//       prisma.masterDatabase.groupBy({
//         by: ['project_name'],
//         where: {
//           ...where,
//           project_name: { not: null, notIn: ['', ' '] }
//         }
//       }),
//       prisma.masterDatabase.groupBy({ by: ['name'], where }),
//       prisma.masterDatabase.aggregate({
//         _sum: { hours_spent: true },
//         where
//       }),
//       prisma.masterDatabase.count({ where })
//     ]);

//     res.json({
//       totalProjects: projects.length,
//       totalEmployees: employees.length,
//       totalHours: hours._sum.hours_spent || 0,
//       totalTasks: tasks
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= PROJECTS ================= */

// exports.getProjects = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const projects = await prisma.masterDatabase.groupBy({
//       by: ['project_name'],
//       _sum: { hours_spent: true, number_of_units: true },
//       _count: true,
//       where: {
//         ...where,
//         project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] }
//       },
//       orderBy: { _sum: { hours_spent: 'desc' } },
//       take: 10
//     });

//     res.json(projects.map(p => ({
//       name: p.project_name,
//       hours: p._sum.hours_spent || 0,
//       units: p._sum.number_of_units || 0,
//       tasks: p._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= TEAMS ================= */

// exports.getTeamsPerformance = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const teams = await prisma.masterDatabase.groupBy({
//       by: ['team'],
//       _sum: { hours_spent: true, number_of_units: true },
//       _count: true,
//       where,
//       orderBy: { _sum: { hours_spent: 'desc' } }
//     });

//     res.json(teams.map(t => ({
//       name: t.team,
//       hours: t._sum.hours_spent || 0,
//       units: t._sum.number_of_units || 0,
//       tasks: t._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= TIMELINE ================= */

// exports.getTimeline = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const data = await prisma.masterDatabase.findMany({
//       where: {
//         ...where,
//         project_name: { not: null, notIn: ['', ' '] },
//         date: { not: null }
//       },
//       select: { date: true, project_name: true, hours_spent: true },
//       orderBy: { date: 'asc' }
//     });

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= WORK MODE ================= */

// exports.getWorkMode = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const modes = await prisma.masterDatabase.groupBy({
//       by: ['work_mode'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         work_mode: { not: null, notIn: ['', ' '] }
//       }
//     });

//     res.json(modes.map(m => ({
//       mode: m.work_mode,
//       hours: m._sum.hours_spent || 0,
//       count: m._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getWorkModeByDays = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const rows = await prisma.masterDatabase.findMany({
//       where: { ...where, date: { not: null } },
//       select: { name: true, work_mode: true, date: true }
//     });

//     const map = {};
//     rows.forEach(r => {
//       const key = `${r.name}-${r.work_mode}`;
//       if (!map[key]) map[key] = new Set();
//       map[key].add(r.date.toISOString().slice(0, 10));
//     });

//     res.json(
//       Object.entries(map).map(([key, days]) => {
//         const [name, mode] = key.split('-');
//         return { name, mode, days: days.size };
//       })
//     );
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= ELEMENTS ================= */

// exports.getElements = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const elements = await prisma.masterDatabase.groupBy({
//       by: ['book_element'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         book_element: { not: null, notIn: ['', ' '] }
//       }
//     });

//     res.json(elements.map(e => ({
//       element: e.book_element,
//       hours: e._sum.hours_spent || 0,
//       count: e._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= TASKS ================= */

// exports.getTasks = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const tasks = await prisma.masterDatabase.groupBy({
//       by: ['task_name'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         task_name: { not: null, notIn: ['', ' '] }
//       }
//     });

//     res.json(tasks.map(t => ({
//       task: t.task_name,
//       hours: t._sum.hours_spent || 0,
//       count: t._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= STATUS ================= */

// exports.getStatus = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const statuses = await prisma.masterDatabase.groupBy({
//       by: ['status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         status: { not: null, notIn: ['', ' '] }
//       }
//     });

//     res.json(statuses.map(s => ({
//       status: s.status,
//       hours: s._sum.hours_spent || 0,
//       count: s._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// /* ================= AUDIT STATUS ================= */

// exports.getAuditStatus = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const audits = await prisma.masterDatabase.groupBy({
//       by: ['audit_status'],
//       _sum: { hours_spent: true },
//       _count: true,
//       where: {
//         ...where,
//         audit_status: { not: null, notIn: ['', ' '] }
//       }
//     });

//     res.json(audits.map(a => ({
//       status: a.audit_status,
//       hours: a._sum.hours_spent || 0,
//       count: a._count
//     })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




const prisma = require('../config/prisma');
const { buildWhereClause } = require('../utils/queryBuilder');

/* ===================== FILTERS ===================== */

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

/* ===================== OVERVIEW ===================== */

exports.getOverview = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const [projects, employees, hours, tasks] = await Promise.all([
      prisma.masterDatabase.groupBy({
        by: ['project_name'],
        where: {
          ...where,
          project_name: { not: null, notIn: ['', ' '] }
        }
      }),
      prisma.masterDatabase.groupBy({ by: ['name'], where }),
      prisma.masterDatabase.aggregate({
        _sum: { hours_spent: true },
        where
      }),
      prisma.masterDatabase.count({ where })
    ]);

    res.json({
      totalProjects: projects.length,
      totalEmployees: employees.length,
      totalHours: hours._sum.hours_spent || 0,
      totalTasks: tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== PROJECTS ===================== */

exports.getProjects = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const projects = await prisma.masterDatabase.groupBy({
      by: ['project_name'],
      _sum: { hours_spent: true, number_of_units: true },
      _count: true,
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' ', 'blank', 'Blank', 'BLANK'] }
      },
      orderBy: { _sum: { hours_spent: 'desc' } },
      take: 10
    });

    const names = projects.map(p => p.project_name);

    const elements = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'book_element'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        project_name: { in: names },
        book_element: { not: null, notIn: ['', ' '] }
      }
    });

    const result = projects.map(p => ({
      name: p.project_name,
      hours: p._sum.hours_spent || 0,
      units: p._sum.number_of_units || 0,
      tasks: p._count,
      elements: elements
        .filter(e => e.project_name === p.project_name)
        .map(e => ({
          element: e.book_element,
          hours: e._sum.hours_spent || 0
        }))
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== TEAMS ===================== */

exports.getTeamsOverview = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const teams = await prisma.masterDatabase.groupBy({
      by: ['team'],
      _sum: { hours_spent: true, number_of_units: true },
      _count: true,
      where,
      orderBy: { _sum: { hours_spent: 'desc' } }
    });

    res.json(teams.map(t => ({
      name: t.team,
      hours: t._sum.hours_spent || 0,
      units: t._sum.number_of_units || 0,
      tasks: t._count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== TIMELINE ===================== */

exports.getTimeline = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const records = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        project_name: { not: null, notIn: ['', ' '] },
        date: { not: null }
      },
      select: { date: true, project_name: true, hours_spent: true },
      orderBy: { date: 'asc' }
    });

    const projectTotals = {};
    records.forEach(r => {
      projectTotals[r.project_name] =
        (projectTotals[r.project_name] || 0) + (r.hours_spent || 0);
    });

    const topProjects = Object.entries(projectTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([p]) => p);

    const dateMap = {};
    records.forEach(r => {
      if (!topProjects.includes(r.project_name)) return;
      const d = r.date.toISOString().slice(0, 10);

      if (!dateMap[d]) {
        dateMap[d] = { date: d, projects: {} };
        topProjects.forEach(p => (dateMap[d].projects[p] = 0));
      }
      dateMap[d].projects[r.project_name] += r.hours_spent || 0;
    });

    res.json(Object.values(dateMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== WORK MODE ===================== */

exports.getWorkMode = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const modes = await prisma.masterDatabase.groupBy({
      by: ['work_mode'],
      _sum: { hours_spent: true },
      _count: true,
      where: { ...where, work_mode: { not: null, notIn: ['', ' '] } }
    });

    res.json(modes.map(m => ({
      mode: m.work_mode,
      hours: m._sum.hours_spent || 0,
      count: m._count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== WORK MODE BY DAYS ===================== */

// exports.getWorkModeByDays = async (req, res) => {
//   try {
//     const where = buildWhereClause(req);

//     const rows = await prisma.masterDatabase.findMany({
//       where: { ...where, work_mode: { not: null, notIn: ['', ' '] } },
//       select: { name: true, work_mode: true, date: true }
//     });

//     const map = {};
//     rows.forEach(r => {
//       const key = `${r.name}-${r.work_mode}`;
//       if (!map[key]) map[key] = new Set();
//       if (r.date) map[key].add(r.date.toISOString().slice(0, 10));
//     });

//     const result = Object.entries(map).map(([k, v]) => {
//       const [name, mode] = k.split('-');
//       return { name, mode, days: v.size };
//     });

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getWorkModeByDays = async (req, res) => {
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

    // Fetch required fields only
    const records = await prisma.masterDatabase.findMany({
      where: {
        ...where,
        work_mode: { notIn: ['', ' '] },
        name: { notIn: ['', ' '] }
      },
      select: {
        name: true,
        work_mode: true,
        date: true,
        project_name: true,
        hours_spent: true
      }
    });

    const makeKey = (name, mode) => `${name}__${mode}`;

    const daysByKey = {};
    const projectHoursByKey = {};
    const employeeMap = {};

    for (const r of records) {
      if (!r.date) continue;
      if (!ALL_WORK_MODES.includes(r.work_mode)) continue;

      const key = makeKey(r.name, r.work_mode);

      // Init employee
      if (!employeeMap[r.name]) {
        employeeMap[r.name] = { name: r.name, workModeProjects: {} };
        ALL_WORK_MODES.forEach(m => {
          employeeMap[r.name][m] = 0;
          employeeMap[r.name].workModeProjects[m] = [];
        });
      }

      // 1️⃣ Distinct days
      if (!daysByKey[key]) daysByKey[key] = new Set();
      const dateStr = r.date.toISOString().slice(0, 10);
      daysByKey[key].add(dateStr);

      // 2️⃣ Project hours
      const project =
        r.project_name && r.project_name.trim()
          ? r.project_name.trim()
          : 'Unspecified';

      if (!projectHoursByKey[key]) projectHoursByKey[key] = {};
      projectHoursByKey[key][project] =
        (projectHoursByKey[key][project] || 0) + (r.hours_spent || 0);
    }

    // Build final structure
    Object.keys(daysByKey).forEach(key => {
      const [name, mode] = key.split('__');
      const days = daysByKey[key].size;

      employeeMap[name][mode] = days;

      const projects = projectHoursByKey[key] || {};
      employeeMap[name].workModeProjects[mode] = Object.entries(projects)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([project_name, hours]) => ({ project_name, hours }));
    });

    const result = Object.values(employeeMap)
      .map(emp => {
        const totalDays = ALL_WORK_MODES.reduce(
          (sum, m) => sum + (emp[m] || 0),
          0
        );
        return { ...emp, totalDays };
      })
      .filter(emp => emp.totalDays > 0)
      .sort((a, b) => b.totalDays - a.totalDays);

    res.json(result);
  } catch (error) {
    console.error('getWorkModeByDays error:', error);
    res.status(500).json({ error: error.message });
  }
};


/* ===================== ELEMENTS ===================== */

exports.getElements = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const rows = await prisma.masterDatabase.groupBy({
      by: ['book_element'],
      _sum: { hours_spent: true, number_of_units: true },
      where: { ...where, book_element: { not: null, notIn: ['', ' '] } }
    });

    res.json(rows.map(r => ({
      element: r.book_element,
      hours: r._sum.hours_spent || 0,
      units: r._sum.number_of_units || 0
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== TASKS ===================== */

exports.getTasks = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const rows = await prisma.masterDatabase.groupBy({
      by: ['task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: { ...where, task_name: { not: null, notIn: ['', ' '] } }
    });

    res.json(rows.map(r => ({
      task: r.task_name,
      hours: r._sum.hours_spent || 0,
      units: r._sum.number_of_units || 0
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== STATUS ===================== */

exports.getStatus = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const rows = await prisma.masterDatabase.groupBy({
      by: ['status'],
      _sum: { hours_spent: true },
      _count: true,
      where: { ...where, status: { not: null, notIn: ['', ' '] } }
    });

    res.json(rows.map(r => ({
      status: r.status,
      hours: r._sum.hours_spent || 0,
      count: r._count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===================== AUDIT STATUS ===================== */

exports.getAuditStatus = async (req, res) => {
  try {
    const where = buildWhereClause(req);

    const rows = await prisma.masterDatabase.groupBy({
      by: ['audit_status'],
      _sum: { hours_spent: true },
      _count: true,
      where: { ...where, audit_status: { not: null, notIn: ['', ' '] } }
    });

    res.json(rows.map(r => ({
      status: r.audit_status,
      hours: r._sum.hours_spent || 0,
      count: r._count
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** Flat rows: employee × task (hours / units) for stacked bars + heatmap */
exports.getEmployeeTaskBreakdown = async (req, res) => {
  try {
    const where = buildWhereClause(req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['name', 'task_name'],
      _sum: { hours_spent: true, number_of_units: true },
      where: {
        ...where,
        name: { notIn: ['', ' '] },
        task_name: { not: null, notIn: ['', ' '] }
      }
    });

    res.json(
      rows.map((r) => ({
        employee: r.name,
        task: r.task_name,
        hours: r._sum.hours_spent || 0,
        units: r._sum.number_of_units || 0
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** Flat rows: project × task for treemap nesting on the client */
exports.getProjectTaskEffort = async (req, res) => {
  try {
    const where = buildWhereClause(req);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** Flat rows: project × employee for stacked bars */
exports.getProjectEmployeeBreakdown = async (req, res) => {
  try {
    const where = buildWhereClause(req);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployeePerformanceOverTime = async (req, res) => {
  try {
    const where = buildWhereClause(req);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** Day-level rows: project x employee x date with task-hour breakdown (for Gantt chart). */
exports.getProjectGantt = async (req, res) => {
  try {
    const where = buildWhereClause(req);
    const rows = await prisma.masterDatabase.groupBy({
      by: ['project_name', 'name', 'date', 'task_name'],
      _sum: { hours_spent: true },
      where: {
        ...where,
        date: { not: null },
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
          tasks: []
        });
      }
      const row = byDay.get(key);
      const h = Number(r?._sum?.hours_spent) || 0;
      row.hours += h;
      row.tasks.push({
        task: r.task_name,
        hours: h
      });
    }

    const payload = Array.from(byDay.values()).map((r) => ({
      ...r,
      tasks: r.tasks.sort((a, b) => (b.hours || 0) - (a.hours || 0))
    }));

    payload.sort((a, b) => {
      if (a.project !== b.project) return String(a.project).localeCompare(String(b.project));
      if (a.date !== b.date) return String(a.date).localeCompare(String(b.date));
      return String(a.employee).localeCompare(String(b.employee));
    });

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
