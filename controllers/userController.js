const authService = require("../services/authService");
const { COOKIE_CONFIG } = require("../config/cookieConfig");

exports.signupUser = async (req, res) => {
  // const { username, email, password } = req.body;

  const { jwt, userData, createdMilestones } = await authService.signupUser(
    req.body
  );

  if (userData) {
    res.cookie("_4fs", jwt, COOKIE_CONFIG);
    //TODO: don't need to return milestones in prod
    res.status(201).json({ data: userData, milestones: createdMilestones });
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

exports.updateUser = async (req, res) => {
  const { id } = req.token.data;

  const record = await authService.updateUser(id, req.body);

  res.status(200).json({ data: record });
};
