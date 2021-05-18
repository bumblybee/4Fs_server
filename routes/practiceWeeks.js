const express = require("express");
const router = express.Router();
const controllers = require("../controllers/practiceWeekController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/").post(errorWrapper(controllers.setNewWeek));

router.route("/current").get(controllers.getCurrentWeek);

router.route("/prior").get(controllers.getPriorWeeks);

router.route("/:id").delete(errorWrapper(controllers.deleteCurrentWeek));

module.exports = router;
