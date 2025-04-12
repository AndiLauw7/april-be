"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Admins", "role", {
      type: Sequelize.ENUM("admin", "anggota"),
      defaultValue: "admin",
    });
    await queryInterface.addColumn("Anggota", "role", {
      type: Sequelize.ENUM("admin", "anggota"),
      defaultValue: "anggota",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Admins", "role");
    await queryInterface.removeColumn("Anggota", "role");
  },
};
