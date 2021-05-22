"use strict";

module.exports = (sequelize, DataTypes) => {
  const PracticeStore = sequelize.define(
    "practice_store",
    {
      practice: {
        type: DataTypes.STRING,
        field: "practice",
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
      freezeTableName: true,
    },

    { tableName: "practice_store" }
  );

  return PracticeStore;
};
