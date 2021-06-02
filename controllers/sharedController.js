const { Shared } = require("../db");
const { crudControllers } = require("./crud/crudControllers");

module.exports = {
  ...crudControllers(Shared, ["createdAt", "ASC"]),
  async updateShared(req, res) {
    const { id: userId } = req.token.data;

    const record = await Shared.update(req.body, { where: { userId } });

    const records = await Shared.findAll();

    res.status(200).json({ data: records });
  },
};
