const { PracticeStore, Practice } = require("../db");
const { Op } = require("sequelize");

exports.getStoredPractices = async (req, res) => {
  const { id: userId } = req.token.data;

  const storedPractices = await PracticeStore.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
  });

  res.status(200).json({ data: storedPractices });
};
