const { crudControllers } = require("./crud/crudControllers");
const { Sleep } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");
const { logger, loggingFormatter } = require("../handlers/logger");

module.exports = {
  ...crudControllers(Sleep, ["date", "ASC"], null, ["date", "ASC"]),

  async upsertSleep(req, res) {
    const id = req.params.id;
    const { id: userId } = req.token.data;

    if (id === "undefined") {
      req.body.hoursSlept = calculateHoursSlept(req.body.woke, req.body.toBed);

      const record = await Sleep.create({ ...req.body, userId });

      logger.info(loggingFormatter("Sleep Record Created", record.dataValues));

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
        order: [["date", "ASC"]],
      });

      res.status(201).json({ newRecord: record, data: records });
      return;
    } else {
      const originalRecord = await Sleep.findOne({ where: { id } });

      // Below handles updating hoursSlept -  make more readable
      if (req.body.woke) {
        req.body.hoursSlept = calculateHoursSlept(
          req.body.woke,
          originalRecord.toBed
        );
      } else if (req.body.toBed) {
        req.body.hoursSlept = calculateHoursSlept(
          originalRecord.woke,
          req.body.toBed
        );
      }

      const record = await Sleep.update(req.body, {
        where: { [Op.and]: [{ id }, { userId }] },
        returning: true,
        plain: true,
        include: Sleep,
      });

      logger.info(
        loggingFormatter("Sleep Record Updated", record[1].dataValues)
      );

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
        order: [["date", "ASC"]],
      });

      res.status(201).json({ updatedRecord: record[1], data: records });
    }
  },
};

const calculateHoursSlept = (wokeUp, toBed) => {
  let timeSlept = null;

  if (wokeUp && toBed) {
    const slept = moment(toBed, "HH:mm");
    const woke = moment(wokeUp, "HH:mm");

    if (woke.isBefore(slept)) woke.add(1, "day");

    const duration = moment.duration(woke.diff(slept));

    timeSlept = moment.utc(+duration).format("hh:mm");
  }

  return timeSlept;
};
