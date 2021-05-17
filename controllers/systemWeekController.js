const { SystemWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getCurrentWeek = async (req, res) => {
  const currDate = moment().format("YYYY-MM-DD");

  const week = await SystemWeek.findOne({
    where: { [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false }] },
  });

  res.status(200).json({ data: week });
};

exports.setWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  console.log(startDate);
  const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

  const record = await SystemWeek.create({ startDate, endDate, userId });

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(201).json({ data: record });
};
