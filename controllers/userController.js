const authService = require("../services/authService");
const { COOKIE_CONFIG } = require("../config/cookieConfig");

exports.signupUser = async (req, res) => {
  //   const { username, email, password } = req.body;

  const { jwt, userData } = await authService.signupUser(req.body);

  if (userData) {
    res.cookie("_4fs", jwt, COOKIE_CONFIG);

    res.status(201).json({ data: userData });
  } else {
    console.log("error");
    // TODO: Custom Error
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { jwt, userData } = await authService.loginWithPassword(
    email,
    password
  );

  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  if (userData) {
    res.status(200).json({ data: userData });
  } else {
    res.json({ error });
  }
};
