const { crudControllers } = require("./crud/crudControllers");
const { Practice } = require("../db");
const { PracticeWeek } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

const queryCurrentPractices = async (userId) => {
  const currDate = moment().format("YYYY-MM-DD");

  // Get current practice records - week's end date >= today
  const practices = await Practice.findAll({
    where: { userId, isDeleted: false },
    include: {
      model: PracticeWeek,
      where: {
        [Op.and]: [{ endDate: { [Op.gte]: currDate }, isDeleted: false }],
      },
    },
    order: [["createdAt", "ASC"]],
  });

  return practices;
};

module.exports = {
  ...crudControllers(Practice, ["createdAt", "ASC"]),

  async getCurrentWeeksPractices(req, res) {
    const { id: userId } = req.token.data;
    const records = await queryCurrentPractices(userId);

    res.status(200).json({ data: records });
  },

  // async getLatestPractices(req, res) {
  //   const { id: userId } = req.token.data;

  //   const latestWeek = await PracticeWeek.findOne({
  //     where: { userId },
  //     order: [["createdAt", "DESC"]],
  //   });

  //   const records = await Practice.findAll({
  //     where: {
  //       [Op.and]: [
  //         { isDeleted: false },
  //         { practiceWeekId: latestWeek.id },
  //         { userId },
  //       ],
  //     },
  //     // For UI display purposes only, don't need all attrs. New practices will be created when user chooses start date
  //     attributes: ["practice", "userId"],
  //   });

  //   res.status(200).json({ data: records });
  // },

  async getPracticeProgress(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    // Get user's practice records where PracticeWeek endDate prior to today

    const records = await Practice.findAll({
      where: { userId, isDeleted: false },
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

  // async upsertPractice(req, res) {
  //   const id = req.params.id;
  //   const { id: userId } = req.token.data;

  //   if (id === "undefined") {
  //     const record = await Practice.create({ ...req.body, userId });

  //     const records = await queryCurrentPractices(userId);

  //     res.status(201).json({ newRecord: record, data: records });
  //     return;
  //   } else {
  //     const record = await Practice.update(req.body, {
  //       where: { [Op.and]: [{ id }, { userId }] },
  //       returning: true,
  //       plain: true,
  //     });

  //     if (!record) {
  //       res.status(404).json({ message: "record.notFound" });
  //       return;
  //     }

  //     const records = await queryCurrentPractices(userId);

  //     res.status(201).json({ updatedRecord: record[1], data: records });
  //   }
  // },

  // async deletePractice(req, res) {
  //   const id = req.params.id;
  //   const { id: userId } = req.token.data;
  //   const currDate = moment().format("YYYY-MM-DD");

  //   const deletedRecord = await Practice.update(
  //     { isDeleted: true },
  //     {
  //       where: { [Op.and]: [{ id, userId }] },
  //       returning: true,
  //       plain: true,
  //     }
  //   );

  //   // Get current practice records - week's end date >= today
  //   const records = await Practice.findAll({
  //     where: { userId, isDeleted: false },
  //     include: {
  //       model: PracticeWeek,
  //       where: {
  //         [Op.and]: [{ endDate: { [Op.gte]: currDate }, isDeleted: false }],
  //       },
  //     },
  //     order: [["createdAt", "ASC"]],
  //   });

  //   res.status(200).json({ data: records, deletedRecord });
  // },
};
