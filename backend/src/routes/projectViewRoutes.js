const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectViewController');

router.get('/filter/project-names', controller.getProjectNames);
router.get('/filter/teams', controller.getTeams);
router.get('/filter/employees', controller.getEmployees);
router.get('/filter/tasks', controller.getTasksFilter);
router.get('/filter/elements', controller.getElementsFilter);
router.get('/projects', controller.getProjects);
router.get('/timeline', controller.getTimeline);

module.exports = router;

