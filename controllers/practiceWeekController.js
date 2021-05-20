const { PracticeWeek, Practice } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { CustomError } = require("../handlers/errorHandlers");

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  const currDate = moment().format("YYYY-MM-DD");
  const validDate = moment(startDate).isSameOrAfter(currDate);

  // Safety measure - check if start date >= today before creating record
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    const record = await PracticeWeek.create({ startDate, endDate, userId });

    res.status(201).json({ data: record });
  } else {
    throw new CustomError("practices.invalidDate", "PracticeWeekError", 400);
  }
};

exports.getCurrentWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  const week = await PracticeWeek.findAll({
    limit: 1,
    where: {
      [Op.and]: [{ endDate: { [Op.gte]: currDate }, isDeleted: false, userId }],
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ data: week });
};

exports.getPriorWeeks = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  const weeks = await PracticeWeek.findAll({
    where: {
      [Op.and]: [{ endDate: { [Op.lt]: currDate }, isDeleted: false, userId }],
    },
    include: Practice,
    order: [["startDate", "DESC"]],
  });

  res.status(200).json({ data: weeks });
};

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  const deletedWeek = await PracticeWeek.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    }
  );

  // Deleted flag - user's practices associated with week
  await Practice.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ practiceWeekId: id }, { userId }] },
    }
  );

  res.status(200).json({
    data: {
      deletedWeek: deletedWeek[1],
    },
  });
};
