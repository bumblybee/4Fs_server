const { PracticeStore } = require("../db");
const { crudControllers } = require("../controllers/crud/crudControllers");

module.exports = crudControllers(
  PracticeStore,
  ["createdAt", "ASC"],
  ["createdAt", "ASC"],
  ["createdAt", "ASC"]
);
