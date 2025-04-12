"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    static associate(models) {
      Peminjaman.belongsTo(models.Anggota, { foreignKey: "anggotaId" });
      Peminjaman.belongsTo(models.Buku, { foreignKey: "bukuId" });
    }
  }
  Peminjaman.init(
    {
      anggotaId: DataTypes.INTEGER,
      bukuId: DataTypes.INTEGER,
      tgl_pinjam: DataTypes.DATE,
      tgl_kembali: DataTypes.DATE,
      status: DataTypes.ENUM("dipinjam", "dikembalikan"),
      denda: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Peminjaman",
    }
  );
  return Peminjaman;
};
