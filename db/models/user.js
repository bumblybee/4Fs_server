"use strict";
// TODO: May not need height, weight, age, gender if not doing calculators

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "last_name",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          const normalizedEmail = value.trim().toLowerCase();
          this.setDataValue("email", normalizedEmail);
        },
        validate: {
          isEmail: {
            msg: "user.invalidEmail",
          },
        },
        field: "email",
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        field: "phone",
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "age",
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "weight",
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "height",
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "gender",
      },
      sheetsURL: {
        type: DataTypes.STRING,
        unique: true,
        field: "sheets_url",
        validate: {
          isURL: {
            msg: "user.invalidSheetsURL",
            args: [
              {
                protocols: ["https"],
                require_valid_protocol: true,
                require_protocol: true,
              },
            ],
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        field: "reset_password_token",
      },
      resetPasswordExpiry: {
        type: DataTypes.DATE,
        field: "reset_password_expiry",
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_admin",
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

    { tableName: "user" }
  );

  return User;
};
