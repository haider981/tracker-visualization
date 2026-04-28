// src/utils/queryBuilder.js

function buildWhereClause(req) {
    const where = {};
  
    if (req.query.team && req.query.team !== 'All') {
      where.team = req.query.team;
    }
  
    if (req.query.employee && req.query.employee !== 'All') {
      where.name = req.query.employee;
    }
  
    if (req.query.period && req.query.period !== 'All') {
      const now = new Date();
      let startDate;
  
      switch (req.query.period) {
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

    // Support project-name based filters via segment/series/class query params
    // These are client-side concepts mapped to parts of `project_name` separated by underscores.
    const nameFilters = [];
    if (req.query.segment && req.query.segment !== 'All') {
      // segment is the first token in project_name: e.g. FK_6th_...
      nameFilters.push({ project_name: { startsWith: `${req.query.segment}_` } });
    }
    if (req.query.class && req.query.class !== 'All') {
      // class/year is typically the second token: match _<class>_ somewhere
      nameFilters.push({ project_name: { contains: `_${req.query.class}_` } });
    }
    if (req.query.series && req.query.series !== 'All') {
      // series often appears later; match as a whole token between underscores
      nameFilters.push({ project_name: { contains: `_${req.query.series}_` } });
    }
    if (nameFilters.length) {
      where.AND = where.AND ? [...where.AND, ...nameFilters] : nameFilters;
    }
  
    return where;
  }
  
  function buildProjectViewWhere(req) {
    const where = buildWhereClause(req);
  
    if (req.query.project_name && req.query.project_name !== 'All') {
      // support repeated project_name params (array) by converting to an "in" filter
      if (Array.isArray(req.query.project_name)) {
        where.project_name = { in: req.query.project_name };
      } else {
        where.project_name = req.query.project_name;
      }
    }
    if (req.query.task_name && req.query.task_name !== 'All') {
      where.task_name = req.query.task_name;
    }
    if (req.query.book_element && req.query.book_element !== 'All') {
      where.book_element = req.query.book_element;
    }
  
    if (!where.project_name) {
      where.project_name = {
        not: null,
        notIn: ['', ' ', 'blank', 'Blank', 'BLANK']
      };
    }
  
    return where;
  }
  
  module.exports = {
    buildWhereClause,
    buildProjectViewWhere
  };
  