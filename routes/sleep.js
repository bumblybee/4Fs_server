const express = require("express");
const router = express.Router();
const controllers = require("../controllers/sleepController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createSleep));

router
  .route("/:id")
  .post(errorWrapper(controllers.upsertSleep))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
