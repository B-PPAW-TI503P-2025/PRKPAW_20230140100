const express = require("express");
const { body, validationResult } = require("express-validator");
const { Presensi } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { addUserData, isAdmin } = require("../middleware/permissionMiddleware");


router.use(addUserData);

router.post("/checkin", presensiController.CheckIn);

router.post("/checkout", presensiController.CheckOut);

router.get("/reports", isAdmin, presensiController.getReports);

router.delete("/:id", presensiController.deletePresensi);


router.put(
  "/:id",
  [
    body("waktuCheckIn")
      .optional()
      .isISO8601()
      .withMessage("waktuCheckIn harus berupa tanggal yang valid (format ISO8601)"),
    body("waktuCheckOut")
      .optional()
      .isISO8601()
      .withMessage("waktuCheckOut harus berupa tanggal yang valid (format ISO8601)"),
    body("nama").optional().isString().withMessage("nama harus berupa string"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: errors.array(),
      });
    }
    next();
  },
  presensiController.updatePresensi
);


router.get("/", presensiController.getAllPresensi);


router.get("/search/nama", async (req, res) => {
  try {
    const { nama } = req.query;
    console.log("Query nama:", nama);
    if (!nama) {
      return res.status(400).json({ message: "Query nama wajib diisi." });
    }

    const results = await Presensi.findAll({
      where: {
        nama: { [Op.like]: `%${nama}%` }, 
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ message: "Hasil pencarian presensi", data: results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
});


router.get("/search/tanggal", async (req, res) => {
  try {
    const { tanggal } = req.query;
    if (!tanggal) {
      return res.status(400).json({ message: "Query tanggal wajib diisi." });
    }

    const results = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.between]: [
            new Date(`${tanggal}T00:00:00`),
            new Date(`${tanggal}T23:59:59`),
          ],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ message: "Hasil pencarian presensi", data: results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
});

module.exports = router;
