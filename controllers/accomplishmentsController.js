const { crudControllers } = require("./crud/crudControllers");
const { Accomplishment } = require("../db");

module.exports = crudControllers(Accomplishment, ["createdAt", "ASC"]);

/* 
Example overwriting or adding to generic controllers

module.exports = {
    * Spread default controllers so still have access
    ...crudControllers(Accomplishment),
    * Overwrite a controller function
    getOne(){
        *do whatever needed here that differs from original controller
    }
    * Create an additional controller
    doSomethingElse() {
        add code for new controller here
    }
}
*/
