"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.Anggota, { foreignKey: "adminId" });
    }
  }
  Admin.init(
    {
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "anggota"),
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
