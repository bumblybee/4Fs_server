"use strict";

module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define(
    "habit",
    {
      habit_goal: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "habit_goal",
      },
      reward: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "reward",
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

    { tableName: "habit" }
  );

  return Habit;
};
