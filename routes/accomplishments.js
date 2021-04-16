const express = require("express");
const router = express.Router();
const controllers = require("../controllers/accomplishmentController");
const { errorWrapper } = require("../handlers/errorHandlers");

router
  .route("/")
  .get(controllers.getMany)
  .post(errorWrapper(controllers.createOne));

module.exports = router;
