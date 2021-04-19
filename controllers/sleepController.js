const { crudControllers } = require("./crud/crudControllers");
const { Sleep } = require("../db");

module.exports = crudControllers(Sleep);
