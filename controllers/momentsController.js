const { crudControllers } = require("./crud/crudControllers");
const { Moment } = require("../db");

module.exports = crudControllers(Moment, ["createdAt", "ASC"]);
