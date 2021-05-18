const { SystemWeek, System } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { CustomError } = require("../handlers/errorHandlers");

exports.getCurrentWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  const week = await SystemWeek.findAll({
    limit: 1,
    where: {
      [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false, userId }],
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ data: week });
};

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  const validDate = moment(startDate).isSameOrAfter(moment());

  // Safety measure - check if start date >= today before creating record
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    const record = await SystemWeek.create({ startDate, endDate, userId });

    res.status(201).json({ data: record });
  } else {
    throw new CustomError("system.invalidDate", "SystemWeekError", 400);
  }
};

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  //delete user's system records associated with week
  const deletedSystemRecords = await System.update(
    { isDeleted: true },
    { where: { [Op.and]: [{ systemWeekId: id }, { userId }] } }
  );

  const deletedSystemWeekRecord = await SystemWeek.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    }
  );

  res.status(200).json({ deletedSystemWeekRecord, deletedSystemRecords });
};
