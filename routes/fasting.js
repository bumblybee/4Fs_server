const express = require("express");
const router = express.Router();
const controllers = require("../controllers/fastingController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.upsertFasting));

router.route("/shared").post(errorWrapper(controllers.updateAll));

router
  .route("/:id")
  .post(errorWrapper(controllers.updateOrCreate))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
