const { Op } = require("sequelize");
const { logger, loggingFormatter } = require("../../handlers/logger");
const { CustomError } = require("../../handlers/errorHandlers");

exports.getOne = (model) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  logger.info(`Get request at getOne - user id: ${userId} `);

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  const record = await model.findOne({
    where: { [Op.and]: [{ userId }, { id }, { isDeleted: false }] },
    attributes: {
      exclude: [
        "userId",
        "isShared",
        "isDeleted",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
  });

  logger.info(`Record Query Successful at getOne - user id: ${userId} `);

  res.status(200).json({ data: record });
};

exports.getMany = (model, sortOrder) => async (req, res) => {
  const { id: userId } = req.token.data;

  logger.info(`Get Request at getMany - user id: ${userId} `);

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  const records = await model.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
    order: [sortOrder],
  });

  logger.info(`Record Query Successful at getMany - user id: ${userId} `);

  res.status(200).json({ data: records });
};

exports.createOne = (model) => async (req, res) => {
  const { id: userId } = req.token.data;

  logger.info(
    loggingFormatter("Record Creation Initiated at createOne", req.body)
  );

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  const record = await model.create({ ...req.body, userId });

  logger.info(loggingFormatter("Record Created", record.dataValues));

  const records = await model.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
  });

  res.status(201).json({ updatedRecord: record[1], data: records });
};

exports.updateOne = (model, sortOrder) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  logger.info(
    loggingFormatter("Record Update Initiated at updateOne", req.body)
  );

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  const record = await model.update(req.body, {
    where: { [Op.and]: [{ id }, { userId }] },
    returning: true,
    plain: true,
  });

  logger.info(
    loggingFormatter("Record Updated at updateOne", record[1].dataValues)
  );

  const records = await model.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
    order: [sortOrder],
  });

  res.status(201).json({ updatedRecord: record[1], data: records });
};

exports.updateOrCreate = (model, sortOrder) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  logger.info(
    loggingFormatter("Record Upsert Initiated at updateOrCreate", req.body)
  );

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  if (id === "undefined") {
    const record = await model.create({ ...req.body, userId });

    logger.info(loggingFormatter("Record Created", record.dataValues));

    const records = await model.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: {
        exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
      },
      order: [sortOrder],
    });

    res.status(201).json({ newRecord: record, data: records });
    return;
  } else {
    const record = await model.update(req.body, {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    });

    logger.info(loggingFormatter("Record Updated", record[1].dataValues));

    const records = await model.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: {
        exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
      },
      order: [sortOrder],
    });

    res.status(201).json({ updatedRecord: record[1], data: records });
  }
};

exports.deleteOne = (model, sortOrder) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  logger.info(
    loggingFormatter("Record Deletion Initiated at deleteOne", {
      recordId: id,
      userId,
    })
  );

  if (!userId) throw new CustomError("user.unauthorized", "UserError", 401);

  const record = await model.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id, userId }] },
      returning: true,
      plain: true,
    }
  );

  const recordsWithRecordRemoved = await model.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
    order: [sortOrder] || [["createdAt", "ASC"]],
  });

  logger.info(loggingFormatter("Record Flagged Deleted", record[1].dataValues));

  res.status(200).json({ data: recordsWithRecordRemoved, deleted: record[1] });
};

exports.crudControllers = (model, getOrder, updateOrder, deleteOrder) => ({
  getOne: this.getOne(model),
  getMany: this.getMany(model, getOrder),
  createOne: this.createOne(model, getOrder),
  updateOne: this.updateOne(model, updateOrder),
  updateOrCreate: this.updateOrCreate(model, updateOrder),
  deleteOne: this.deleteOne(model, deleteOrder),
});
