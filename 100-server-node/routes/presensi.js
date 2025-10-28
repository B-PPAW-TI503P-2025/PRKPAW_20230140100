const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");


const { addUserData, isAdmin } = require("../middleware/permissionMiddleware");


router.use(addUserData);



// Check-in
router.post("/checkin", presensiController.CheckIn);

// Check-out
router.post("/checkout", presensiController.CheckOut);


// Tambahkan isAdmin agar hanya admin yang bisa lihat laporan
router.get("/reports", isAdmin, presensiController.getReports);

module.exports = router;
