"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      Peminjaman.belongsTo(models.Anggota, {
        foreignKey: "anggotaId",
        as: "anggota",
      });
      Peminjaman.belongsTo(models.Buku, { foreignKey: "bukuId", as: "buku" });
    }
  }
  Peminjaman.init(
    {
      anggotaId: DataTypes.INTEGER,
      bukuId: DataTypes.INTEGER,
      tanggalPinjam: DataTypes.DATE,
      tanggalKembali: DataTypes.DATE,
      status: DataTypes.STRING,
      denda: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Peminjaman",
    }
  );
  return Peminjaman;
};
