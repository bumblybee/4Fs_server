const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");
const { SystemWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  ...crudControllers(System, ["createdAt", "ASC"]),

  async getCurrentWeekSystem(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    // Get user's system records where systemWeek endDate prior to today
    const records = await System.findAll({
      where: { userId, isDeleted: false },
      include: {
        model: SystemWeek,
        where: {
          [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false }],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ data: records });
  },

  async getPriorWeeksSystems(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    const records = await System.findAll({
      where: { userId },
      include: {
        model: SystemWeek,
        where: {
          [Op.and]: [{ endDate: { [Op.lt]: currDate }, isDeleted: false }],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: records });
  },
};
