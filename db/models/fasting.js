"use strict";

module.exports = (sequelize, DataTypes) => {
  const Fasting = sequelize.define(
    "fasting",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date",
      },
      goalWindow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "goal_window",
      },
      todayWindow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "today_window",
      },
      performed: {
        type: DataTypes.Sequelize.DECIMAL(10, 2),
        field: "performed",
        allowNull: false,
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

    { tableName: "fasting_window" }
  );

  return Fasting;
};
