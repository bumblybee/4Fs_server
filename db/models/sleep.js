"use strict";

module.exports = (sequelize, DataTypes) => {
  const Sleep = sequelize.define(
    "sleep",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date",
      },
      toBed: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "to_bed",
      },
      woke: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "woke",
      },
      hoursSlept: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "hours_slept",
      },
      comments: {
        type: DataTypes.TEXT,
        field: "comments",
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

    { tableName: "sleep" }
  );

  return Sleep;
};
