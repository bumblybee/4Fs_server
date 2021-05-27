const { crudControllers } = require("./crud/crudControllers");
const { Fasting } = require("../db");

module.exports = {
  ...crudControllers(Fasting, ["date", "DESC"]),
};
