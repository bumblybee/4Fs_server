const authService = require("../services/authService");
const { COOKIE_CONFIG } = require("../config/cookieConfig");

exports.getCurrentUser = async (req, res) => {
  const { id } = req.token.data;

  const user = await authService.getUser(id);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "user.unauthorized" });
  }
};

exports.signupUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  email = email.toLowerCase();

  const { jwt, userData } = await authService.signupUser({
    firstName,
    lastName,
    email,
    password,
  });

  if (userData) {
    res.cookie("_4fs", jwt, COOKIE_CONFIG);

    res.status(201).json(userData);
  } else {
    // TODO: Custom Error
  }
};

exports.loginUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  const { jwt, userData } = await authService.loginUser({ email, password });

  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  if (userData) {
    res.status(200).json({ data: userData });
  } else {
    res.json(error);
  }
};

exports.logoutUser = async (req, res) => {
  res
    .clearCookie("_4fs", COOKIE_CONFIG)
    .json({ message: "Successfully logged out" });
};

exports.checkUserEmail = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  const emailExists = await authService.checkIfUserEmailExists(email);

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

exports.generatePasswordResetLink = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  await authService.generatePasswordReset(email);

  res.json({ message: "An email has been sent to the address provided." });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const { jwt, userRecord } = await authService.passwordReset(token, password);

  res.cookie("_4fs", jwt, COOKIE_CONFIG);

  res.json({
    message: "Password Updated",
    id: userRecord.id,
    email: userRecord.email,
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
  });
};
