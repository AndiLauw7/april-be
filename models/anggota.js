"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Anggota extends Model {
    static associate(models) {
      Anggota.hasMany(models.Peminjaman, { foreignKey: "anggotaId" });
      Anggota.belongsTo(models.Admin, {
        foreignKey: "AdminId",
        as: "admin",
      });
    }
  }
  Anggota.init(
    {
      nama: DataTypes.STRING,
      alamat: DataTypes.STRING,
      noHp: DataTypes.STRING,
      AdminId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Anggota",
    }
  );
  return Anggota;
};
