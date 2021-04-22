const { crudControllers } = require("./crud/crudControllers");
const { System } = require("../db");
const { Op } = require("sequelize");

module.exports = {
  ...crudControllers(System),

  async getRange(req, res) {
    try {
      const { id: userId } = req.token.data;

      const records = await System.findAll({
        where: {
          [Op.and]: [
            { userId },
            { isDeleted: false },
            {
              startDate: { [Op.gte]: req.body.startDate },
              endDate: { [Op.lte]: req.body.endDate },
            },
          ],
        },
        attributes: {
          exclude: [
            "userId",
            "isDeleted",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        order: [["id", "ASC"]],
      });

      if (!records) {
        res.status(404).json({ message: "record.notFound" });
      }

      res.status(200).json({ data: records });
    } catch (err) {
      console.log(err);
    }
  },
};
