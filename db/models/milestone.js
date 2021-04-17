"use strict";

module.exports = (sequelize, DataTypes) => {
  const Milestone = sequelize.define(
    "milestone",
    {
      milestone: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "body",
      },
      personalize: {
        type: DataTypes.STRING,
        field: "personalize",
      },
      comments: {
        type: DataTypes.STRING,
        field: "comments",
      },
      status: {
        type: DataTypes.ENUM("in progress", "complete"),
        defaultValue: "in progress",
        field: "status",
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

    { tableName: "resource" }
  );

  return Milestone;
};
