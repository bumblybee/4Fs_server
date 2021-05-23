const express = require("express");
const router = express.Router();
const controllers = require("../controllers/practiceController");
const practiceStoreController = require("../controllers/practiceStoreController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/").get(controllers.getMany);

router.route("/current").get(controllers.getCurrentPractices);

router.route("/progress").get(controllers.getPracticeProgress);

router.route("/store").get(practiceStoreController.getStoredPractices);

router
  .route("/:id")
  .post(errorWrapper(controllers.upsertPractice))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deletePractice));

module.exports = router;
