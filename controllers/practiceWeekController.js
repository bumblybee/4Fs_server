const { PracticeWeek, Practice } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { CustomError } = require("../handlers/errorHandlers");

const getLastWeeksPractices = async (userId) => {
  const latestWeek = await PracticeWeek.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  const records = await Practice.findAll({
    where: {
      [Op.and]: [
        { isDeleted: false },
        { practiceWeekId: latestWeek.id },
        { userId },
      ],
    },

    // Only include the practice and userId, other attributes will be determined in new week
    attributes: ["practice", "userId"],
  });

  return records;
};

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate, latestPractices } = req.body;
  const currDate = moment().format("YYYY-MM-DD");
  const validDate = moment(startDate).isSameOrAfter(currDate);

  // Get the latest practices
  // !! Send from client instead? Already have there because displaying - {startDate, lastWeeksPractices} = req.body
  // const lastWeeksPractices = await getLastWeeksPractices(userId);

  // Safety measure - check if start date >= today before creating record
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    const record = await PracticeWeek.create(
      // Include last practices in current week creation
      { startDate, endDate, userId, practices: latestPractices },
      { include: [Practice] }
    );

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
  // await Practice.update(
  //   { isDeleted: true },
  //   {
  //     where: { [Op.and]: [{ practiceWeekId: id }, { userId }] },
  //   }
  // );

  res.status(200).json({
    data: {
      deletedWeek: deletedWeek[1],
    },
  });
};
