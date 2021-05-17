const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");
const { SystemWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  ...crudControllers(System, ["createdAt", "ASC"]),
  async getCurrentWeek(req, res) {
    const currDate = moment().format("YYYY-MM-DD");

    const week = await SystemWeek.findOne({
      where: { endDate: { [Op.gt]: currDate }, isDeleted: false },
    });

    if (week) {
      const records = await System.findAll({
        where: { systemWeekId: week.id },
        include: SystemWeek,
      });

      if (records) {
        res.status(200).json(records);
      } else {
        res.status(200).json({ code: "records.notFound" });
      }
    } else {
      res.status(200).json({ code: "records.notFound" });
    }
  },

  // async findWeek(req, res) {
  //   try {
  //     const { id: userId } = req.token.data;
  //     console.log(req.body);
  //     const records = await System.findAll({
  //       where: {
  //         [Op.and]: [
  //           { userId },
  //           { isDeleted: false },
  //           {
  //             startDate: req.body.startDate,
  //           },
  //         ],
  //       },
  //       attributes: {
  //         exclude: [
  //           "userId",
  //           "isDeleted",
  //           "createdAt",
  //           "updatedAt",
  //           "deletedAt",
  //         ],
  //       },
  //       order: [["id", "ASC"]],
  //     });

  //     if (!records) {
  //       res.status(404).json({ message: "record.notFound" });
  //     }

  //     res.status(200).json({ data: records });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};
