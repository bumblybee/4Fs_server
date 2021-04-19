const { crudControllers } = require("./crud/crudControllers");
const { Habit } = require("../db");

module.exports = crudControllers(Habit);
