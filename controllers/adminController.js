const { User } = require("../db");

//TODO: custom errors

exports.getUsers = async (req, res) => {
  const { isAdmin } = req.token.data;

  if (isAdmin) {
    const users = await User.findAll({ where: { isDeleted: false } });

    res.status(200).json(users);
  } else {
    res.status(403).json({ message: "unauthorized" });
  }
};

exports.getUser = async (req, res) => {
  const { isAdmin } = req.token.data;

  if (isAdmin) {
    const user = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json(user);
  } else {
    res.status(403).json({ message: "unauthorized" });
  }
};
