const { crudControllers } = require("./crud/crudControllers");
const { Practice } = require("../db");
const { PracticeWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  ...crudControllers(Practice, ["createdAt", "ASC"]),

  async getCurrentWeeksPractices(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    // Get user's practice records where PracticeWeek endDate prior to today
    const records = await Practice.findAll({
      where: { userId, isDeleted: false },
      include: {
        model: PracticeWeek,
        where: {
          [Op.and]: [{ endDate: { [Op.gt]: currDate }, isDeleted: false }],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ data: records });
  },

  async getPriorWeeksPractices(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    const records = await Practice.findAll({
      where: { userId },
      include: {
        model: PracticeWeek,
        where: {
          [Op.and]: [{ endDate: { [Op.lt]: currDate }, isDeleted: false }],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: records });
  },
};
