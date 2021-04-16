const { crudControllers } = require("../utils/crud/crudControllers");
const { Accomplishment } = require("../db");

module.exports = crudControllers(Accomplishment);

/* 
Example overwriting or adding to generic controllers

export default {
    * Spread default controllers so still have access
    ...crudControllers(Accomplishment),
    * Overwrite a controller function
    getOne(Accomplishment){
        *do whatever needed here that differs from original controller
    }
    * Create an additional controller
    updateAccomplishmentBasedOnX(Accomplishment) {
        add code for new controller here
    }
}
*/
