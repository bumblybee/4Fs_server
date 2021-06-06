const { crudControllers } = require("./crud/crudControllers");
const { Practice } = require("../db");
const { PracticeWeek } = require("../db");
const { PracticeStore } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { logger, loggingFormatter } = require("../../handlers/logger");

module.exports = {
  ...crudControllers(Practice, ["createdAt", "ASC"]),

  async getCurrentPractices(req, res) {
    const { id: userId } = req.token.data;
    const records = await queryCurrentPractices(userId, ["id", "ASC"]);

    res.status(200).json({ data: records });
  },

  async getPracticeProgress(req, res) {
    const { id: userId } = req.token.data;
    const currDate = moment().format("YYYY-MM-DD");

    // Get practice records where PracticeWeek endDate prior to today
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

  // Clean up with upsert() and break some logic out into separate fns
  async upsertPractice(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    // If no id, record doesn't already exist = create
    if (id === "undefined") {
      const record = await Practice.create({ ...req.body, userId });

      await PracticeStore.create({ practice: req.body.practice, userId });

      logger.info(loggingFormatter("Record Created", record.dataValues));

      const records = await queryCurrentPractices(userId, ["createdAt", "ASC"]);

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      // Checking for null so practice doesn't update if no value (they've cleared the input) - better solution here and on client?
      if (req.body.practice !== null) {
        const origRecord = await Practice.findOne({
          where: { id },
          attributes: ["practice"],
        });

        const record = await Practice.update(req.body, {
          where: { [Op.and]: [{ id }, { userId }] },
          returning: true,
          plain: true,
        });

        // Update practice store if curr practice updated
        if (req.body.practice && record) {
          await PracticeStore.update(req.body, {
            where: {
              [Op.and]: [{ userId }, { practice: origRecord.practice }],
            },
          });
        }

        logger.info(loggingFormatter("Record Updated", record[1].dataValues));
      }

      const records = await queryCurrentPractices(userId, ["id", "ASC"]);

      res.status(201).json({ data: records });
    }
  },

  async deletePractice(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    const origRecord = await Practice.findOne({
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
      // Find practiceStore record with same title and flag deleted
      logger.info(
        loggingFormatter("Record Flagged Deleted", deletedRecord[1].dataValues)
      );

      await PracticeStore.update(
        { isDeleted: true },
        {
          where: {
            [Op.and]: [{ userId }, { practice: origRecord.practice }],
          },
        }
      );
    }

    const records = await queryCurrentPractices(userId, ["createdAt", "ASC"]);

    res.status(200).json({ data: records, deletedRecord });
  },
};

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
