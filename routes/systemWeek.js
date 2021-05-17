const express = require("express");
const router = express.Router();
const controllers = require("../controllers/systemWeekController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  //   .get(controllers.getMany)
  .post(errorWrapper(controllers.setWeek));

// router
//   .route("/:id")
//   .post(errorWrapper(controllers.updateOrCreate))
//   .put(errorWrapper(controllers.updateOne))
//   .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
