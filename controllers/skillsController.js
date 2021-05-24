const { crudControllers } = require("./crud/crudControllers");
const { Skill } = require("../db");

module.exports = crudControllers(
  Skill,
  ["createdAt", "ASC"],
  ["createdAt", "ASC"],
  ["createdAt", "ASC"]
);
