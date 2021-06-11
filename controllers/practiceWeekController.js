const { PracticeWeek, Practice, PracticeStore } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { CustomError } = require("../handlers/errorHandlers");
const { logger, loggingFormatter } = require("../handlers/logger");

exports.setNewWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  const currDate = moment().format("YYYY-MM-DD");
  const validDate = moment(startDate).isSameOrAfter(currDate);

  logger.info(
    loggingFormatter("New Week Flow Initiated at setNewWeek", req.body)
  );

  // Safety measure - check if start date >= today before creating record. Comment out to add past weeks for testing.
  if (validDate) {
    const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

    const storedPractices = await PracticeStore.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: ["practice", "userId"],
    });

    const record = await PracticeWeek.create(
      // When new week created, also create week's practices using stored practices
      { startDate, endDate, userId, practices: storedPractices },
      { include: [Practice] }
    );

    logger.info(
      loggingFormatter("System Week Record Created", record.dataValues)
    );

    res.status(201).json({ data: record });
  } else {
    logger.error(
      loggingFormatter("New Week Creation Failed: Invalid date", {
        userId,
        startDate,
      })
    );

    throw new CustomError("practices.invalidDate", "PracticeWeekError", 400);
  }
};

exports.getCurrentWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  logger.info(loggingFormatter("Get Request at getCurrentWeek", { userId }));

  const week = await PracticeWeek.findAll({
    limit: 1,
    where: {
      [Op.and]: [{ endDate: { [Op.gte]: currDate }, isDeleted: false, userId }],
    },
    order: [["createdAt", "DESC"]],
    include: Practice,
  });

  res.status(200).json({ data: week[0] });
};

exports.deleteCurrentWeek = async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  logger.info(
    loggingFormatter("System Week Deletion Initiated at deleteCurrentWeek", {
      recordId: id,
      userId,
    })
  );

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

    logger.info(
      loggingFormatter(
        "System Week Record Flagged Deleted",
        deletedWeek[1].dataValues
      )
    );
  }

  res.status(200).json({
    data: deletedWeek[1],
  });
};

exports.getProgressWeeks = async (req, res) => {
  const { id: userId } = req.token.data;
  const currDate = moment().format("YYYY-MM-DD");

  logger.info(loggingFormatter("Get Request at getProgressWeeks", { userId }));

  const week = await PracticeWeek.findAll({
    where: {
      [Op.and]: [{ endDate: { [Op.lt]: currDate }, isDeleted: false, userId }],
    },
    order: [["startDate", "DESC"]],
  });

  res.status(200).json({ data: week });
};
