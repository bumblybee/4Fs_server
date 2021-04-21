const express = require("express");
const router = express.Router();
const controllers = require("../controllers/milestonesController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.route("/").get(controllers.getMany);

router
  .route("/:id")
  .put(errorWrapper(controllers.updateOne))
  .post(errorWrapper(controllers.deleteOne));

module.exports = router;
