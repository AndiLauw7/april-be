"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Anggota", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nis: {
        type: Sequelize.STRING,
      },
      nama_siswa: {
        type: Sequelize.STRING,
      },
      kelas: {
        type: Sequelize.STRING,
      },
      jenis_kelamin: {
        type: Sequelize.ENUM("L", "P"),
      },
      tgl_lahir: {
        type: Sequelize.DATE,
      },
      email: {
        type: Sequelize.STRING,
      },
      nohp: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Anggota");
  },
};
