var express = require("express");
var router = express.Router();
const { signupUser, loginUser } = require("../controllers/userController");
const { errorWrapper } = require("../handlers/errorHandlers");

router.post("/signup", errorWrapper(signupUser));
router.post("/login", loginUser);

module.exports = router;
