const { crudControllers } = require("./crud/crudControllers");
const { Resource } = require("../db");

module.exports = crudControllers(Resource);
