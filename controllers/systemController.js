const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");
const { SystemWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  ...crudControllers(System, ["createdAt", "ASC"]),

  async getCurrentWeekSystem(req, res) {
    const currDate = moment().format("YYYY-MM-DD");

    // Get system records where systemWeek endDate prior to today
    const records = await System.findAll({
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
    const currDate = moment().format("YYYY-MM-DD");

    const records = await System.findAll({
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
