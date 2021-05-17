const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");
const { SystemWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  ...crudControllers(System, ["createdAt", "ASC"]),

  async getCurrentWeekSystem(req, res) {
    const currDate = moment().format("YYYY-MM-DD");

    // Get system weeks where end date is after today
    const week = await SystemWeek.findOne({
      where: {
        [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false }],
      },
    });

    // Get system records with system week id from above
    const records = await System.findAll({
      where: { [Op.and]: [{ systemWeekId: week.id }, { isDeleted: false }] },
      include: SystemWeek,
    });

    res.status(200).json({ data: records });
  },
};
