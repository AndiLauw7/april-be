// models/inviteCode.js
module.exports = (sequelize, DataTypes) => {
  const InviteCode = sequelize.define(
    "InviteCode",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "invite_codes",
      timestamps: true,
    }
  );
  InviteCode.associate = (models) => {
    InviteCode.hasOne(models.Admin, {
      foreignKey: "inviteCodeId",
      as: "admin",
    });
  };

  return InviteCode;
};
