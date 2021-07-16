"use strict";

module.exports = (sequelize, DataTypes) => {
  const MilestoneDefault = sequelize.define(
    "milestone_default",
    {
      f: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "f",
      },
      milestone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "milestone",
      },
      personalize: {
        type: DataTypes.STRING,
        field: "personalize",
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
    },

    { tableName: "milestone_default" }
  );

  return MilestoneDefault;
};
