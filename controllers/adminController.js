const { User } = require("../db");

exports.getUsers = async (req, res) => {
  const users = await User.findAll({ where: { isDeleted: false } });

  res.status(200).json(users);
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  res.status(200).json(user);
};
