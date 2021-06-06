const { crudControllers } = require("./crud/crudControllers");
const { Accomplishment } = require("../db");

module.exports = crudControllers(
  Accomplishment,
  ["createdAt", "ASC"],
  ["createdAt", "ASC"],
  ["createdAt", "ASC"]
);
