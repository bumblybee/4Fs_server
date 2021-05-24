const { crudControllers } = require("./crud/crudControllers");
const { Milestone } = require("../db");
const { Op } = require("sequelize");

module.exports = crudControllers(
  Milestone,
  [["id", "ASC"]],
  [["id", "ASC"]],
  [["id", "ASC"]]
);
