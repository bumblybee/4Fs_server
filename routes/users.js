var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");
const {
  signupUser,
  loginUser,
  updateUser,
} = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.post("/signup", errorWrapper(signupUser));
router.post("/login", loginUser);

router.put("/", isAuth, errorWrapper(updateUser));

module.exports = router;
