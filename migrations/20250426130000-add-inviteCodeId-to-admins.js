"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("admins", "inviteCodeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "invite_codes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("admins", "inviteCodeId");
  },
};
