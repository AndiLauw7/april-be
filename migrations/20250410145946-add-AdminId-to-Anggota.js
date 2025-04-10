"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Anggota", "AdminId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Admins", // nama tabel di database
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Anggota", "AdminId");
  },
};
