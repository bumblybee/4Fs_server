const { Shared } = require("../db");
const { crudControllers } = require("./crud/crudControllers");
const { logger, loggingFormatter } = require("../../handlers/logger");

module.exports = {
  ...crudControllers(Shared, ["createdAt", "ASC"]),

  async updateShared(req, res) {
    const { id: userId } = req.token.data;

    await Shared.update(req.body, { where: { userId } });

    logger.info(loggingFormatter("Record Updated", record[1].dataValues));

    const records = await Shared.findAll();

    res.status(200).json({ data: records });
  },
};
