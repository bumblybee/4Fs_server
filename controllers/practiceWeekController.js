const { PracticeWeek, Practice, PracticeStore } = require("../db");
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

    const storedPractices = await PracticeStore.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: ["practice", "userId"],
    });

    const record = await PracticeWeek.create(
      // Include last practices in current week creation
      { startDate, endDate, userId, practices: storedPractices },
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
      [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false, userId }],
    },
    order: [["createdAt", "DESC"]],
    include: Practice,
  });

  res.status(200).json({ data: week[0] });
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

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;
  console.log("hit");
  //delete user's practice records associated with week

  const deletedWeek = await PracticeWeek.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    }
  );

  if (deletedWeek) {
    await Practice.update(
      { isDeleted: true },
      {
        where: { [Op.and]: [{ practiceWeekId: id }, { userId }] },
      }
    );
  }

  res.status(200).json({
    data: deletedWeek[1],
  });
};
