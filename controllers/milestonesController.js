const { crudControllers } = require("../utils/crud/crudControllers");
const { Milestone } = require("../db");

module.exports = crudControllers(Milestone);
