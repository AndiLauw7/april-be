"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Anggota extends Model {
    static associate(models) {
      Anggota.belongsTo(models.Admin, { foreignKey: "adminId" });
      Anggota.hasMany(models.Peminjaman, { foreignKey: "anggotaId" });
    }
  }
  Anggota.init(
    {
      nis: DataTypes.STRING,
      nama_siswa: DataTypes.STRING,
      kelas: DataTypes.STRING,
      jenis_kelamin: DataTypes.ENUM("L", "P"),
      tgl_lahir: DataTypes.DATE,
      email: DataTypes.STRING,
      nohp: DataTypes.STRING,
      image: DataTypes.STRING,
      password: DataTypes.STRING,
      adminId: DataTypes.INTEGER,
      role: {
        type: DataTypes.ENUM("admin", "anggota"),
        defaultValue: "anggota",
      },
    },
    {
      sequelize,
      modelName: "Anggota",
    }
  );
  return Anggota;
};
