const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");

module.exports = crudControllers(System);
