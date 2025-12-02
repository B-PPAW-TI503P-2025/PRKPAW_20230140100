module.exports = (sequelize, DataTypes) => {
  const Presensi = sequelize.define('Presensi', {
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {});

  Presensi.associate = function(models) {
    Presensi.belongsTo(models.User, {
      foreignKey: 'userId', 
      as: 'User', 
    });
  };
  return Presensi;
};