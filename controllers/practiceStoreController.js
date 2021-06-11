const { PracticeStore } = require("../db");
const { crudControllers } = require("../controllers/crud/crudControllers");
const { Op } = require("sequelize");
const { logger, loggingFormatter } = require("../handlers/logger");

module.exports = {
  ...crudControllers(
    PracticeStore,
    ["id", "ASC"],
    ["id", "ASC"],
    ["id", "ASC"]
  ),

  async upsertStoredPractice(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    logger.info(
      loggingFormatter(
        "Practice Store Upsert Initiated at upsertStoredPractice",
        req.body
      )
    );

    // If no id, record doesn't already exist = create
    if (id === "undefined") {
      const record = await PracticeStore.create({ ...req.body, userId });

      logger.info(
        loggingFormatter("Stored Practice Created", record.dataValues)
      );

      const records = await PracticeStore.findAll({
        where: { [Op.and]: [{ userId }, { isDeleted: false }] },
        order: [["createdAt", "ASC"]],
      });

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      // Checking for null so practice doesn't update if no value (they've cleared the input) - better solution here and on client?
      if (req.body.practice !== null) {
        const record = await PracticeStore.update(req.body, {
          where: { [Op.and]: [{ id }, { userId }] },
          returning: true,
          plain: true,
        });

        logger.info(
          loggingFormatter("Stored Practice Updated", record[1].dataValues)
        );
      }

      const records = await PracticeStore.findAll({
        where: { [Op.and]: [{ userId }, { isDeleted: false }] },
        order: [["createdAt", "ASC"]],
      });

      res.status(201).json({ data: records });
    }
  },
};
