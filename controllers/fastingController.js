const { crudControllers } = require("./crud/crudControllers");
const { Fasting } = require("../db");
const { Op } = require("sequelize");
const { logger, loggingFormatter } = require("../handlers/logger");
const { CustomError } = require("../handlers/errorHandlers");

module.exports = {
  ...crudControllers(Fasting, ["date", "DESC"]),

  async upsertFasting(req, res) {
    const { id: userId } = req.token.data;

    if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

    const origRecord = await Fasting.findOne({
      where: { [Op.and]: [{ userId }, { date: req.body.date }] },
    });

    if (!origRecord) {
      const record = await Fasting.create({ ...req.body, userId });

      logger.info(
        loggingFormatter("Fasting Record Created", record.dataValues)
      );

      const records = await queryFastingRecords(userId);

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      const record = await Fasting.update(req.body, {
        where: { [Op.and]: [{ date: req.body.date }, { userId }] },
        returning: true,
        plain: true,
      });

      logger.info(
        loggingFormatter("Fasting Record Updated", record[1].dataValues)
      );

      const records = await queryFastingRecords(userId);

      res.status(201).json({ updatedRecord: record[1], data: records });
    }
  },
};

const queryFastingRecords = async (userId) => {
  const records = await Fasting.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
    order: [["date", "DESC"]],
  });

  return records;
};
