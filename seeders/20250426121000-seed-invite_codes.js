"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "invite_codes",
      [
        {
          code: "ADMIN-2025-AAA",
          used: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "ADMIN-2025-BBB",
          used: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "ADMIN-2025-CCC",
          used: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("invite_codes", null, {});
  },
};
