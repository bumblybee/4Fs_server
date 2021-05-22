const { crudControllers } = require("./crud/crudControllers");
const { Practice } = require("../db");
const { PracticeWeek } = require("../db");
const { PracticeStore } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

const queryCurrentPractices = async (userId, sortOrder) => {
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
    order: sortOrder && [sortOrder],
  });

  return practices;
};

module.exports = {
  ...crudControllers(Practice, ["createdAt", "ASC"]),

  async getCurrentWeeksPractices(req, res) {
    const { id: userId } = req.token.data;
    const records = await queryCurrentPractices(userId, ["createdAt", "ASC"]);

    res.status(200).json({ data: records });
  },

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

  async upsertPractice(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    if (id === "undefined") {
      const record = await Practice.create({ ...req.body, userId });

      await PracticeStore.create({ practice: req.body.practice, userId });

      const records = await queryCurrentPractices(userId, ["createdAt", "ASC"]);

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      console.log(1);
      const origPractice = await Practice.findOne({
        where: { id },
        attributes: ["practice"],
      });
      console.log(2);

      const record = await Practice.update(req.body, {
        where: { [Op.and]: [{ id }, { userId }] },
        returning: true,
        plain: true,
      });
      console.log(3);

      if (req.body.practice && record) {
        await PracticeStore.update(req.body, {
          where: {
            [Op.and]: [{ userId }, { practice: origPractice.practice }],
          },
        });
      }
      console.log(4);

      if (!record) {
        res.status(404).json({ message: "record.notFound" });
        return;
      }

      const records = await queryCurrentPractices(userId, ["id", "ASC"]);

      console.log(5);

      res.status(201).json({ updatedRecord: record[1], data: records });
    }
  },

  async deletePractice(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    const origPractice = await Practice.findOne({
      where: { id },
      attributes: ["practice"],
    });

    const deletedRecord = await Practice.update(
      { isDeleted: true },
      {
        where: { [Op.and]: [{ id, userId }] },
        returning: true,
        plain: true,
      }
    );

    if (deletedRecord) {
      await PracticeStore.update(
        { isDeleted: true },
        {
          where: {
            [Op.and]: [{ userId }, { practice: origPractice.practice }],
          },
        }
      );
    }

    // Get current practice records - week's end date >= today
    const records = await queryCurrentPractices(userId, ["createdAt", "ASC"]);

    res.status(200).json({ data: records, deletedRecord });
  },
};
