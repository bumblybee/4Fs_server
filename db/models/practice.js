"use strict";

module.exports = (sequelize, DataTypes) => {
  const Practice = sequelize.define(
    "practice",
    {
      practice: {
        type: DataTypes.STRING,
        field: "practice",
      },
      dayOne: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_one",
      },
      dayTwo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_two",
      },
      dayThree: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_three",
      },
      dayFour: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_four",
      },
      dayFive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_five",
      },
      daySix: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_six",
      },
      daySeven: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "day_seven",
      },
      goal: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "goal",
      },
      performed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

    { tableName: "practice" }
  );

  return Practice;
};
