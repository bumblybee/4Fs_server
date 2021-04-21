const { crudControllers } = require("./crud/crudControllers");
const { Milestone } = require("../db");
const { Op } = require("sequelize");

module.exports = {
  ...crudControllers(Milestone),

  async getMany(req, res) {
    const { id: userId } = req.token.data;

    const records = await Milestone.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: {
        exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
      },
      order: [["id", "ASC"]],
    });

    if (!records) {
      res.status(404).json({ message: "record.notFound" });
    }

    res.status(200).json({ data: records });
  },
};
