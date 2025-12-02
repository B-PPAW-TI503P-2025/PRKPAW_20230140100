const router = require('express').Router();
const presensiController = require('../controllers/presensicontroller'); 
const { authenticateToken } = require('../middleware/permissionMiddleware'); 

router.post('/check-in', authenticateToken, presensiController.checkIn);
router.post('/check-out', authenticateToken, presensiController.checkOut);

module.exports = router;