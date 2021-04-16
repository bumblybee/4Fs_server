"use strict";

module.exports = (sequelize, DataTypes) => {
  const FastingWindow = sequelize.define(
    "fasting_window",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date",
      },
      goal_window: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "goal_window",
      },
      today_window: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "today_window",
      },
      performed: {
        type: DataTypes.Sequelize.DECIMAL(10, 2),
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
    },

    { tableName: "fasting_window" }
  );

  return FastingWindow;
};
