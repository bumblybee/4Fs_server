const { SystemWeek } = require("../db");
const moment = require("moment");

exports.setWeek = async (req, res) => {
  const { id: userId } = req.token.data;
  const { startDate } = req.body;
  console.log(startDate);
  const endDate = moment(startDate).add(6, "days").format("YYYY-MM-DD");

  const record = await SystemWeek.create({ startDate, endDate, userId });

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(201).json({ data: record });
};
