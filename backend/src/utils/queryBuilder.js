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
  
    return where;
  }
  
  function buildProjectViewWhere(req) {
    const where = buildWhereClause(req);
  
    if (req.query.project_name && req.query.project_name !== 'All') {
      where.project_name = req.query.project_name;
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
  