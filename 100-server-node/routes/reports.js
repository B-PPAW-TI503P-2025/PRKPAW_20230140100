const router = require('express').Router();
const reportController = require('../controllers/reportcontroller'); 
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware'); 

// GET /api/reports/daily
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReports);

module.exports = router;