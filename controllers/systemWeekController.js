const { SystemWeek, System } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getCurrentWeek = async (req, res) => {
  const currDate = moment().format("YYYY-MM-DD");

  const week = await SystemWeek.findAll({
    limit: 1,
    where: { [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false }] },
  });

  res.status(200).json({ data: week });
};

exports.setNewWeek = async (req, res) => {
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

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  //delete system records associated with week
  const systemRecords = await System.update(
    { isDeleted: true },
    { where: { systemWeekId: id } }
  );

  const weekRecord = await SystemWeek.update(
    { isDeleted: true },
    {
      where: { id },
      returning: true,
      plain: true,
    }
  );

  res.status(200).json({ data: weekRecord, systemRecords });
};
