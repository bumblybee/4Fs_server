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

    const record = await PracticeWeek.create(
      // Include last practices in current week creation
      { startDate, endDate, userId },
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
      [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false, userId }],
    },
    order: [["createdAt", "DESC"]],
    include: Practice,
  });

  res.status(200).json({ data: week });
};

exports.getProgressWeeks = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  const week = await PracticeWeek.findAll({
    where: {
      [Op.and]: [{ endDate: { [Op.lt]: currDate }, isDeleted: false, userId }],
    },
    order: [["startDate", "DESC"]],
  });

  res.status(200).json({ data: week });
};

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  const validDate = moment(startDate).isSameOrAfter(
    moment().format("YYYY-MM-DD")
  );

  // Safety measure - check if start date >= today before creating record
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    const record = await PracticeWeek.create({ startDate, endDate, userId });

    res.status(201).json({ data: record });
  } else {
    throw new CustomError("practices.invalidDate", "PracticeWeekError", 400);
  }
};

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  //delete user's practice records associated with week
  // const deletedRecords = await Practice.update(
  //   { isDeleted: true },
  //   {
  //     where: { [Op.and]: [{ practiceWeekId: id }, { userId }] },
  //     returning: true,
  //     plain: true,
  //   }
  // );

  const deletedWeek = await PracticeWeek.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    }
  );

  res.status(200).json({
    data: {
      deletedWeek: deletedWeek[1],
      deletedRecords: deletedRecords[1],
    },
  });
};
