const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

// --- SETUP MULTER (Tidak berubah) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) { cb(null, true); } 
  else { cb(new Error('Hanya file gambar yang diperbolehkan!'), false); }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });


// --- FUNCTION CHECK-IN (Tidak berubah) ---
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, name: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;
    const buktiFoto = req.file ? req.file.path : null;

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId, checkIn: waktuSekarang, latitude, longitude, buktiFoto
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil.`,
      data: formattedData,
    });
  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// --- FUNCTION CHECK-OUT (Tidak berubah) ---
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, name: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Belum ada check-in aktif." });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    res.json({
      message: `Bye ${userName}, check-out berhasil.`,
      data: {
          checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
          checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// --- FUNCTION UPDATE (Tidak berubah) ---
exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;
    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) return res.status(404).json({ message: "Data tidak ditemukan." });

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    await recordToUpdate.save();

    res.json({ message: "Update berhasil", data: recordToUpdate });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// --- FUNCTION DELETE (Tidak berubah) ---
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const recordToDelete = await Presensi.findByPk(req.params.id);

    if (!recordToDelete) return res.status(404).json({ message: "Data tidak ditemukan." });
    if (recordToDelete.userId !== userId) return res.status(403).json({ message: "Bukan milik Anda." });

    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// --- FUNCTION GET LAPORAN (INI YANG DIPERBAIKI) ---
exports.getLaporan = async (req, res) => {
  try {
    const dataLaporan = await Presensi.findAll({
      include: [
        {
          model: User,
          // as: 'user', <--- HAPUS INI (Biarkan default)
          attributes: ['nama', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedData = dataLaporan.map(item => ({
      id: item.id,
      userId: item.userId,
      // PERHATIKAN: Sekarang kita pakai 'item.User' (Huruf Besar) karena default Sequelize
      // Gunakan chaining operator (?.) untuk keamanan jika user null
      nama: item.User?.nama || 'User Tidak Dikenal', 
      email: item.User?.email || '-',
      checkIn: item.checkIn ? format(new Date(item.checkIn), "yyyy-MM-dd HH:mm:ss", { timeZone }) : '-',
      checkOut: item.checkOut ? format(new Date(item.checkOut), "yyyy-MM-dd HH:mm:ss", { timeZone }) : '-',
      buktiFoto: item.buktiFoto
    }));

    res.status(200).json({
      message: "Data laporan berhasil diambil",
      data: formattedData
    });
  } catch (error) {
    console.error("GET LAPORAN ERROR:", error); 
    res.status(500).json({ 
      message: "Gagal mengambil data laporan", 
      error: error.message 
    });
  }
};