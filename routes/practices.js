const express = require("express");
const router = express.Router();
const controllers = require("../controllers/practiceController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

router.route("/current").get(controllers.getCurrentWeeksPractices);
router.route("/prior").get(controllers.getPriorWeeksPractices);

router
  .route("/:id")
  .post(errorWrapper(controllers.updateOrCreate))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
