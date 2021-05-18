"use strict";

module.exports = (sequelize, DataTypes) => {
  const PracticeWeek = sequelize.define(
    "practice_week",
    {
      startDate: {
        type: DataTypes.DATEONLY,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        field: "end_date",
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

    { tableName: "practice_week" }
  );

  return PracticeWeek;
};
