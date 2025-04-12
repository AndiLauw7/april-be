"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Peminjamans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      anggotaId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Anggota",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      bukuId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Bukus",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tgl_pinjam: {
        type: Sequelize.DATE,
      },
      tgl_kembali: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM("dipinjam", "dikembalikan"),
      },
      denda: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable("Peminjamans");
  },
};
