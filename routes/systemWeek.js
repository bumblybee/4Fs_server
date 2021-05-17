const express = require("express");
const router = express.Router();
const controllers = require("../controllers/systemWeekController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/").post(errorWrapper(controllers.setWeek));

router.route("/current").get(controllers.getCurrentWeek);

// router
//   .route("/:id")
//   .post(errorWrapper(controllers.updateOrCreate))
//   .put(errorWrapper(controllers.updateOne))
//   .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
