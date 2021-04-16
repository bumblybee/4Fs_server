"use strict";

module.exports = (sequelize, DataTypes) => {
  const System = sequelize.define(
    "system",
    {
      practice: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "practice",
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "end_date",
      },
      goal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "goal",
      },
      performed: {
        type: DataTypes.INTEGER,
        field: "performed",
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
      freezeTableName: true,
    },

    { tableName: "system" }
  );

  return System;
};
