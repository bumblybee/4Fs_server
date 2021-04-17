var express = require("express");
var router = express.Router();
const { users } = require("../services/seedService");
const { signupUser, loginUser } = require("../services/authService");
const { errorWrapper } = require("../handlers/errorHandlers");
const COOKIE_CONFIG = require("../config/cookieConfig");

router.post("/", async (req, res) => {
  const { jwt, user, createdMilestones } = await signupUser(users[0]);
  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  res.status(201).json({ data: user, milestones: createdMilestones });
});

router.post("/login", async (req, res) => {
  const { jwt, userData } = await loginUser(users[0]);
  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  res.status(201).json({ data: userData });
});

module.exports = router;
