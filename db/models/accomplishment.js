"use strict";

module.exports = (sequelize, DataTypes) => {
  const Accomplishment = sequelize.define(
    "accomplishment",
    {
      accomplishment: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "body",
      },
      isShared: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_shared",
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_deleted",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },

    { tableName: "accomplishment" }
  );

  return Accomplishment;
};
