const { crudControllers } = require("./crud/crudControllers");
const { Accomplishment } = require("../db");

module.exports = crudControllers(Accomplishment);

/* 
Example overwriting or adding to generic controllers

module.exports = {
    * Spread default controllers so still have access
    ...crudControllers(Accomplishment),
    * Overwrite a controller function
    getOne(Accomplishment){
        *do whatever needed here that differs from original controller
    }
    * Create an additional controller
    doSomethingElse(Accomplishment) {
        add code for new controller here
    }
}
*/
