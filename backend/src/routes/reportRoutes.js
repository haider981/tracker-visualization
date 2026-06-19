const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

router.get('/catalog', reportController.getSectionCatalog);
router.get('/options/projects', reportController.getProjectOptions);
router.post('/generate', reportController.generateReport);

module.exports = router;
