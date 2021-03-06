// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Shareds = sequelize.define('shareds', {
    belief: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    milestone: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    habit: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sleep: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fasting: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    practice: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    swagger: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    food: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fitness: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'shareds',
    underscored: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Shareds.associate = (models) => {
    Shareds.belongsTo(models.users, {
      foreignKey: {
        name: 'userIdKey',
        field: 'userId',
      },
      as: 'user',
    });
  };

  return Shareds;
};
