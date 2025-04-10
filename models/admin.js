"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.Anggota, {
        foreignKey: "AdminId",
        as: "anggotaTambahan",
      });
    }
  }
  Admin.init(
    {
      nama: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
