const { Op } = require("sequelize");

exports.getOne = (model) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

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

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: record });
};

exports.getMany = (model, sortOrder) => async (req, res) => {
  const { id: userId } = req.token.data;

  const records = await model.findAll({
    where: { [Op.and]: [{ userId }, { isDeleted: false }] },
    attributes: {
      exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
    },
    order: [sortOrder],
  });

  if (!records) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: records });
};

exports.createOne = (model) => async (req, res) => {
  const { id: userId } = req.token.data;
  const record = await model.create({ ...req.body, userId });

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(201).json({ data: record });
};

exports.updateOne = (model) => async (req, res) => {
  const id = req.params.id;

  const { id: userId } = req.token.data;

  const record = await model.update(req.body, {
    where: { [Op.and]: [{ id }, { userId }] },
    returning: true,
    plain: true,
  });
  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }
  res.status(201).json({ data: record[1] });
};

exports.updateOrCreate = (model) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

  if (id === "undefined") {
    const record = await model.create({ ...req.body, userId });

    const records = await model.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: {
        exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
      },
    });

    res.status(201).json({ newRecord: record, data: records });
    return;
  } else {
    const record = await model.update(req.body, {
      where: { [Op.and]: [{ id }, { userId }] },
      returning: true,
      plain: true,
    });

    if (!record) {
      res.status(404).json({ message: "record.notFound" });
      return;
    }

    const records = await model.findAll({
      where: { [Op.and]: [{ userId }, { isDeleted: false }] },
      attributes: {
        exclude: ["userId", "isDeleted", "createdAt", "updatedAt", "deletedAt"],
      },
    });

    res.status(201).json({ updatedRecord: record[1], data: records });
  }
};

exports.deleteOne = (model) => async (req, res) => {
  const id = req.params.id;
  const { id: userId } = req.token.data;

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
    order: [["createdAt", "ASC"]],
  });

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: recordsWithRecordRemoved, deleted: record });
};

exports.crudControllers = (model, sortOrder) => ({
  getOne: this.getOne(model),
  getMany: this.getMany(model, sortOrder),
  createOne: this.createOne(model),
  updateOne: this.updateOne(model),
  updateOrCreate: this.updateOrCreate(model),
  deleteOne: this.deleteOne(model),
});
