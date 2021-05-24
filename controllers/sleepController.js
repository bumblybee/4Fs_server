const { crudControllers } = require("./crud/crudControllers");
const { Sleep } = require("../db");
const { Op } = require("sequelize");

module.exports = {
  ...crudControllers(Sleep, ["date", "ASC"], null, ["date", "ASC"]),

  async upsertSleep(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    if (id === "undefined") {
      const record = await Sleep.create({ ...req.body, userId });

      const records = await Sleep.findAll({
        where: { [Op.and]: [{ userId }, { isDeleted: false }] },
        attributes: {
          exclude: [
            "userId",
            "isDeleted",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
      });

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      const record = await Sleep.update(req.body, {
        where: { [Op.and]: [{ id }, { userId }] },
        returning: true,
        plain: true,
      });

      if (!record) {
        res.status(404).json({ message: "record.notFound" });
        return;
      }

      const records = await Sleep.findAll({
        where: { [Op.and]: [{ userId }, { isDeleted: false }] },
        attributes: {
          exclude: [
            "userId",
            "isDeleted",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
      });

      res.status(201).json({ updatedRecord: record[1], data: records });
    }
  },
};
