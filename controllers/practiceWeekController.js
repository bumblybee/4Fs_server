const { PracticeWeek, Practice } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { CustomError } = require("../handlers/errorHandlers");

const getLastWeeksPractices = async (userId) => {
  const latestWeek = await PracticeWeek.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  if (latestWeek) {
    const records = await Practice.findAll({
      where: {
        [Op.and]: [
          { isDeleted: false },
          { practiceWeekId: latestWeek.id },
          { userId },
        ],
      },
      // For UI display purposes only, don't need all attrs. New practices will be created when user chooses start date
      attributes: ["practice", "userId"],
    });
    return records;
  } else {
    return;
  }
};

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  const currDate = moment().format("YYYY-MM-DD");
  const validDate = moment(startDate).isSameOrAfter(currDate);

  // Safety measure - check if start date >= today before creating record
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    // Get the latest practices
    const lastWeeksPractices = await getLastWeeksPractices(userId);

    const record = await PracticeWeek.create(
      // Include last practices in current week creation
      { startDate, endDate, userId, practices: lastWeeksPractices },
      { include: [Practice] }
    );
    res.status(201).json({ data: [record, ...lastWeeksPractices] });
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
    include: Practice,
  });

  console.log(week.Practice);

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

  const lastWeeksPractices = await getLastWeeksPractices(userId);

  // console.log(lastPractices);

  res.status(200).json({
    data: [deletedWeek[1], ...lastWeeksPractices],
    // deletedWeek: deletedWeek[1],
  });
};
