// // src/routes/dashboard.routes.js

// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/dashboardController');

// router.get('/filters/teams', controller.getTeams);
// router.get('/employees', controller.getEmployees);
// router.get('/overview', controller.getOverview);

// router.get('/projects', controller.getProjects);
// router.get('/teams', controller.getTeamsPerformance);
// router.get('/timeline', controller.getTimeline);

// router.get('/workmode', controller.getWorkMode);
// router.get('/workmode-by-days', controller.getWorkModeByDays);

// router.get('/elements', controller.getElements);
// router.get('/tasks', controller.getTasks);
// router.get('/status', controller.getStatus);
// router.get('/audit-status', controller.getAuditStatus);


// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

router.get('/filters/teams', controller.getTeams);
router.get('/employees', controller.getEmployees);
router.get('/overview', controller.getOverview);

router.get('/projects', controller.getProjects);
router.get('/teams', controller.getTeamsOverview);
router.get('/timeline', controller.getTimeline);
router.get('/workmode', controller.getWorkMode);
router.get('/workmode-by-days', controller.getWorkModeByDays);
router.get('/elements', controller.getElements);
router.get('/tasks', controller.getTasks);
router.get('/status', controller.getStatus);
router.get('/audit-status', controller.getAuditStatus);

module.exports = router;
