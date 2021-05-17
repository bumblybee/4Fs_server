const express = require("express");
const router = express.Router();
const controllers = require("../controllers/systemWeekController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/").post(errorWrapper(controllers.setWeek));

router.route("/current").get(controllers.getCurrentWeek);

router.route("/:id").delete(errorWrapper(controllers.deleteCurrentWeek));

module.exports = router;
