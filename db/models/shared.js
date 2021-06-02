"use strict";

module.exports = (sequelize, DataTypes) => {
  const Shared = sequelize.define(
    "shared",
    {
      belief: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,

        field: "belief",
      },
      milestone: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "milestone",
      },
      habit: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "habit",
      },
      sleep: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "sleep",
      },
      fasting: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "fasting",
      },
      system: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "practice",
      },
      swagger: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "swagger",
      },
      food: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "food",
      },
      fitness: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "fitness",
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

    { tableName: "shared" }
  );

  return Shared;
};
