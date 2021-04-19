const { crudControllers } = require("./crud/crudControllers");
const { FastingWindow } = require("../db");

module.exports = crudControllers(FastingWindow);
