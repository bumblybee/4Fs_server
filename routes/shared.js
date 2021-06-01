const express = require("express");
const router = express.Router();
const controllers = require("../controllers/sharedController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.updateShared));

module.exports = router;
