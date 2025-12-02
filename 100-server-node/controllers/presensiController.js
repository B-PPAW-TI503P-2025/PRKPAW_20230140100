const { Presensi } = require('../models');
const { Op } = require('sequelize');

exports.checkIn = async (req, res) => {
    const userId = req.user.id; 

    try {
        const existingPresensi = await Presensi.findOne({
            where: {
                userId: userId,
                checkOut: null 
            }
        });

        if (existingPresensi) {
            return res.status(400).json({ message: 'Anda sudah Check-In dan belum Check-Out.' });
        }

        const presensi = await Presensi.create({ userId, checkIn: new Date() });
        return res.status(201).json({ message: 'Check-In berhasil!', presensi });

    } catch (error) {
        console.error("Check-In Error (Mahasiswa Gagal):", error);
        return res.status(500).json({ message: 'Gagal melakukan Check-In. Cek log server.' });
    }
};

exports.checkOut = async (req, res) => {
    const userId = req.user.id; 
    try {
        const presensi = await Presensi.findOne({ where: { userId, checkOut: null }, order: [['checkIn', 'DESC']] });

        if (!presensi) {
            return res.status(400).json({ message: 'Anda belum melakukan Check-In hari ini.' });
        }

        await presensi.update({ checkOut: new Date() });
        return res.status(200).json({ message: 'Check-Out berhasil!', presensi });

    } catch (error) {
        console.error("Check-Out Error:", error);
        return res.status(500).json({ message: 'Gagal melakukan Check-Out. Cek log server.' });
    }
};