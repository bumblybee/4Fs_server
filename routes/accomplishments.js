const express = require("express");
const router = express.Router();
const controllers = require("../controllers/accomplishmentsController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

router
  .route("/:id")
  .put(errorWrapper(controllers.updateOne))
  .post(errorWrapper(controllers.updateOrCreate))
  .delete(errorWrapper(controllers.deleteOne));

module.exports = router;
