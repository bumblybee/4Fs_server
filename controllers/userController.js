const authService = require("../services/authService");
const { COOKIE_CONFIG } = require("../config/cookieConfig");

exports.getCurrentUser = async (req, res) => {
  const { id } = req.token.data;

  const user = await authService.getUser(id);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ code: "user.unauthorized" });
  }
};

exports.signupUser = async (req, res) => {
  const { jwt, userData } = await authService.signupUser(req.body);

  if (userData) {
    res.cookie("_4fs", jwt, COOKIE_CONFIG);

    res.status(201).json(userData);
  } else {
    // TODO: Custom Error
  }
};

exports.loginUser = async (req, res) => {
  const { jwt, userData } = await authService.loginUser(req.body);

  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  if (userData) {
    res.status(200).json({ data: userData });
  } else {
    res.json(error);
  }
};

exports.checkUserEmail = async (req, res) => {
  const { email } = req.body;
  const emailExists = await authService.validateUserEmail(email);
  if (!emailExists) {
    res.status(200).json({ code: "email.available" });
  } else {
    // Throwing error in authService
    res.status(200).json({ code: "email.unavailable" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.token.data;

  const record = await authService.updateUser(id, req.body);

  res.status(200).json({ data: record });
};
