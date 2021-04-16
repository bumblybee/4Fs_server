// TODO: If sticking with generic controllers, make sure to add userId to all relevant fns

const { Op } = require("sequelize");

exports.getOne = (model) => async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;

  const record = await model.findOne({ where: { id, userId } });

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: record });
};

exports.getMany = (model) => async (req, res) => {
  const userId = req.body.userId;

  const records = await model.findAll({ where: { userId } });

  if (!records) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: records });
};

exports.createOne = (model) => async (req, res) => {
  const record = await model.create(req.body);
  res.status(201).json({ data: record });
};

exports.updateOne = (model) => async (req, res) => {
  const id = req.params.id;
  // const userId = req.token.data.id;

  const record = await model.update(req.body, {
    where: { id: id, userId: req.body.userId },
    returning: true,
    plain: true,
  });
  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }
  res.status(201).json({ data: record });
};

exports.deleteOne = (model) => async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;
  const record = await model.update(
    { isDeleted: true },
    {
      where: { [Op.and]: [{ id, userId }] },
      returning: true,
      plain: true,
    }
  );

  if (!record) {
    res.status(404).json({ message: "record.notFound" });
  }

  res.status(200).json({ data: record });
};

exports.crudControllers = (model) => ({
  getOne: this.getOne(model),
  getMany: this.getMany(model),
  createOne: this.createOne(model),
  updateOne: this.updateOne(model),
  deleteOne: this.deleteOne(model),
});
