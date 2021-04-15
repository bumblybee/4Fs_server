"use strict";
// TODO: May not need height, weight, age, gender if not doing calculators

module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    "resource",
    {
      resourceURL: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isURL: {
            msg: "resource.invalidURL",
            args: [
              {
                protocols: ["https"],
                require_valid_protocol: true,
                require_protocol: true,
              },
            ],
          },
        },
        field: "resource_url",
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

  return Resource;
};
