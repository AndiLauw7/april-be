"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    static associate(models) {
      Buku.hasMany(models.Peminjaman, { foreignKey: "bukuId" });
    }
  }
  Buku.init(
    {
      judul_buku: DataTypes.STRING,
      pengarang: DataTypes.STRING,
      tahun_terbit: DataTypes.STRING,
      stok: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Buku",
    }
  );
  return Buku;
};
