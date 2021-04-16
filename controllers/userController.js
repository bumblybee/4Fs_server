const User = require("../db").User;
const authService = require("../services/authService");
const COOKIE_CONFIG = require("../config/cookieConfig").COOKIE_CONFIG;

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  const { jwt, user } = await authService.signupUser(email, username, password);

  if (user) {
    res.cookie("_4fs", jwt, COOKIE_CONFIG);

    res.json(user);
  } else {
    console.log("error");
    // TODO: Custom Error
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { jwt, user } = await authService.loginWithPassword(email, password);

  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.json({ error });
  }
};
