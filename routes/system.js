const express = require("express");
const router = express.Router();
const controllers = require("../controllers/systemController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

router
  .route("/:id")
  .post(errorWrapper(controllers.updateOrCreate))
  .put(errorWrapper(controllers.updateOne))
  .delete(errorWrapper(controllers.deleteOne));

router.route("/range").post(errorWrapper(controllers.findRange));

module.exports = router;
