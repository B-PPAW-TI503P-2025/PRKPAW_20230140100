const { Presensi, User } = require('../models');
const { Op } = require('sequelize');

exports.getDailyReports = async (req, res) => {
    const { nama, startDate, endDate } = req.query; 
    let userWhere = {};
    if (nama) {
        userWhere.nama = { [Op.iLike]: `%${nama}%` };
    }
    
    try {
        const reports = await Presensi.findAll({
            include: [{ 
                model: User, 
                as: 'User', 
                where: userWhere, 
                required: true 
            }],
            order: [['checkIn', 'DESC']]
        });

        return res.status(200).json({ message: 'Laporan harian berhasil diambil.', data: reports });
      } 
      catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil laporan: ' + error.message });
      }
};