"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      Peminjaman.belongsTo(models.Anggota, { foreignKey: "anggotaId" });
      Peminjaman.belongsTo(models.Buku, { foreignKey: "bukuId", as: "Buku" });
    }
  }
  Peminjaman.init(
    {
      anggotaId: DataTypes.INTEGER,
      bukuId: DataTypes.INTEGER,
      tanggalPinjam: DataTypes.DATE,
      tanggalKembali: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Peminjaman",
    }
  );
  return Peminjaman;
};
