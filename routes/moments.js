const express = require("express");
const router = express.Router();
const controllers = require("../controllers/momentsController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

router
  .route("/:id")
  .put(errorWrapper(controllers.updateOne))
  .post(errorWrapper(controllers.deleteOne));

module.exports = router;
