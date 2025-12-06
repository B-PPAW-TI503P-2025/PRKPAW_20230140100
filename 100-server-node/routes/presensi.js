const express = require('express');
const router = express.Router(); // <--- Router harus dibuat di sini dulu!
const presensiController = require('../controllers/presensiController');
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// Middleware Global untuk file ini (Cek token di semua request)
router.use(authenticateToken);

// --- 1. ROUTE SPESIFIK (Taruh Paling Atas) ---
// Route ini harus dibaca duluan sebelum route yang pakai :id
router.get('/laporan', presensiController.getLaporan); 

// --- 2. ROUTE LAINNYA ---
router.post('/check-in', [presensiController.upload.single('image')], presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// --- 3. ROUTE DINAMIS (Taruh Paling Bawah) ---
// Hati-hati, route :id akan menangkap apapun jika ditaruh di atas
router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

// Route Default (Cek status)
router.get("/", (req, res) => {
  res.json({ message: "Presensi OK" });
});

module.exports = router;