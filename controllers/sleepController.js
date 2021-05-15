const { crudControllers } = require("./crud/crudControllers");
const { Sleep } = require("../db");

// module.exports = crudControllers(Sleep, ["date", "ASC"]);

module.exports = {
  ...crudControllers(Sleep, ["date", "ASC"]),

  async findWeek(req, res) {
    try {
      const { id: userId } = req.token.data;
      console.log(req.body);
      const records = await System.findAll({
        where: {
          [Op.and]: [
            { userId },
            { isDeleted: false },
            {
              startDate: req.body.startDate,
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
