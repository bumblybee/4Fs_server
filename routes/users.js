var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/isAuth");

const {
  getCurrentUser,
  signupUser,
  loginUser,
  updateUser,
  checkUserEmail,
} = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.get("/current", isAuth, errorWrapper(getCurrentUser));

router.post("/validate-email", errorWrapper(checkUserEmail));
router.post("/signup", errorWrapper(signupUser));
router.post("/login", errorWrapper(loginUser));

router.put("/", isAuth, errorWrapper(updateUser));

module.exports = router;
