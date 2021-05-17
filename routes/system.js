const express = require("express");
const router = express.Router();
const controllers = require("../controllers/systemController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/week").post(errorWrapper(controllers.findWeek));

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

router.route("/current-week").get(controllers.getCurrentWeek);

router
  .route("/:id")
  .post(errorWrapper(controllers.updateOrCreate))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
