"use strict";

const Sequelize = require("sequelize");

// Models
const UserModel = require("./models/user.js");

// Database environment config
const env = process.env.NODE_ENV || "development";

if (env !== "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    { dialect: "postgres", logging: false }
  );
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

const User = UserModel(sequelize, Sequelize);

// Relationships

// Authenticate db and log connection or err
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error:" + err));

module.exports = {
  sequelize,
  Sequelize,
  User,
};
