const { crudControllers } = require("./crud/crudControllers");
const { Belief } = require("../db");

module.exports = crudControllers(Belief);
