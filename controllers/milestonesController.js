const { crudControllers } = require("./crud/crudControllers");
const { Milestone } = require("../db");

module.exports = crudControllers(Milestone);
