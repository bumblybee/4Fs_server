const { Shared } = require("../db");
const { crudControllers } = require("./crud/crudControllers");
const { logger, loggingFormatter } = require("../handlers/logger");

module.exports = {
  ...crudControllers(Shared, ["createdAt", "ASC"]),

  async updateShared(req, res) {
    const { id: userId } = req.token.data;

    logger.info(loggingFormatter("Shared Update Initiated", { userId }));

    const record = await Shared.update(req.body, { where: { userId } });

    logger.info(loggingFormatter("Shared Record Updated", record));

    const records = await Shared.findAll({ where: { userId } });

    res.status(200).json({ data: records });
  },
};
